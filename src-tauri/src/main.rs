//! Standalone Agent Taskboard desktop host.
//!
//! The desktop app owns exactly one child process: the bundled Node runtime
//! running the local Taskboard server. It does not launch or attach to Codex,
//! WorkBuddy, a browser, or a browser automation endpoint.

use serde::Serialize;
use std::fs;
use std::net::TcpStream;
#[cfg(unix)]
use std::os::unix::fs::PermissionsExt;
use std::path::PathBuf;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use std::thread;
use std::time::{Duration, Instant};

#[cfg(target_os = "macos")]
use tauri::ActivationPolicy;
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};

struct ServerProcess {
    child: Mutex<Option<Child>>,
    runtime_path: Mutex<Option<PathBuf>>,
}

#[derive(Serialize)]
struct RuntimeDescriptor {
    version: u8,
    pid: u32,
    url: String,
}

fn setup_error(message: impl Into<String>) -> tauri::Error {
    let error: Box<dyn std::error::Error> = Box::new(std::io::Error::other(message.into()));
    tauri::Error::Setup(error.into())
}

fn data_directory(app: &tauri::AppHandle) -> tauri::Result<PathBuf> {
    let home = app.path().home_dir()?;
    #[cfg(target_os = "macos")]
    return Ok(home.join("Library/Application Support/Agent Taskboard"));
    #[cfg(target_os = "windows")]
    return Ok(app.path().app_data_dir()?.join("Agent Taskboard"));
    #[cfg(target_os = "linux")]
    return Ok(std::env::var_os("XDG_DATA_HOME")
        .filter(|value| !value.is_empty())
        .map(PathBuf::from)
        .unwrap_or_else(|| home.join(".local/share"))
        .join("Agent Taskboard"));
}

fn write_runtime_descriptor(data_dir: &PathBuf, child: &Child, url: &str) -> tauri::Result<()> {
    let path = data_dir.join("launcher-runtime.json");
    let temporary_path = data_dir.join("launcher-runtime.json.tmp");
    let contents = serde_json::to_vec(&RuntimeDescriptor {
        version: 1,
        pid: child.id(),
        url: url.to_owned(),
    })?;
    fs::write(&temporary_path, contents)?;
    #[cfg(unix)]
    fs::set_permissions(&temporary_path, fs::Permissions::from_mode(0o600))?;
    fs::rename(temporary_path, path)?;
    Ok(())
}

fn node_command() -> std::io::Result<PathBuf> {
    let executable = std::env::current_exe()?;
    if let Some(parent) = executable.parent() {
        #[cfg(target_os = "macos")]
        let candidates = [
            parent.join("node"),
            parent.join("node-aarch64-apple-darwin"),
            parent.join("node-universal-apple-darwin"),
        ];
        #[cfg(target_os = "windows")]
        let candidates = [parent.join("node.exe")];
        #[cfg(target_os = "linux")]
        let candidates = [parent.join("agent-taskboard-node")];
        if let Some(path) = candidates.into_iter().find(|path| path.is_file()) {
            return Ok(path);
        }
    }
    Ok(PathBuf::from("node"))
}

fn start_server(app: &tauri::AppHandle) -> tauri::Result<(Child, String)> {
    let resource_dir = app.path().resource_dir()?;
    let server_entry = resource_dir.join("app/server/index.mjs");
    if !server_entry.is_file() {
        return Err(setup_error("Bundled Taskboard server is missing"));
    }
    let data_dir = data_directory(app)?;
    std::fs::create_dir_all(&data_dir)?;
    if TcpStream::connect_timeout(
        &"127.0.0.1:47823".parse().expect("valid loopback address"),
        Duration::from_millis(100),
    )
    .is_ok()
    {
        return Err(setup_error(
            "Port 47823 is already in use; quit the other Taskboard instance first",
        ));
    }
    let mut child = Command::new(node_command()?)
        .arg(server_entry)
        .env("CODEX_TASKBOARD_HOST", "127.0.0.1")
        .env("CODEX_TASKBOARD_PORT", "47823")
        .env("CODEX_TASKBOARD_DATA_DIR", &data_dir)
        .env_remove("CODEX_TASKBOARD_RUNTIME_FILE")
        .env_remove("CODEX_TASKBOARD_COMPANION_URL")
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()?;
    // Wait for the local server before creating the webview so the first
    // screen is the real taskboard, not a transient connection error.
    let deadline = Instant::now() + Duration::from_secs(10);
    while Instant::now() < deadline {
        if TcpStream::connect_timeout(
            &"127.0.0.1:47823".parse().expect("valid loopback address"),
            Duration::from_millis(100),
        )
        .is_ok()
        {
            let url = "http://127.0.0.1:47823".to_owned();
            write_runtime_descriptor(&data_dir, &child, &url)?;
            return Ok((child, url));
        }
        if child.try_wait()?.is_some() {
            return Err(setup_error("Taskboard server exited during startup"));
        }
        thread::sleep(Duration::from_millis(100));
    }
    let _ = child.kill();
    let _ = child.wait();
    Err(setup_error("Taskboard server did not become ready"))
}

fn main() {
    tauri::Builder::default()
        .manage(ServerProcess {
            child: Mutex::new(None),
            runtime_path: Mutex::new(None),
        })
        .setup(|app| {
            #[cfg(target_os = "macos")]
            app.set_activation_policy(ActivationPolicy::Regular);
            let (child, url) = start_server(app.handle())?;
            let state = app.state::<ServerProcess>();
            *state.child.lock().unwrap() = Some(child);
            *state.runtime_path.lock().unwrap() =
                Some(data_directory(app.handle())?.join("launcher-runtime.json"));
            let parsed = url
                .parse()
                .map_err(|error| setup_error(format!("Invalid local Taskboard URL: {error}")))?;
            let window = WebviewWindowBuilder::new(app, "main", WebviewUrl::External(parsed))
                .title("Agent Taskboard")
                .inner_size(1280.0, 820.0)
                .min_inner_size(1100.0, 720.0)
                .resizable(true)
                .center()
                .build()?;
            let close_app = app.handle().clone();
            window.on_window_event(move |event| {
                if matches!(event, tauri::WindowEvent::CloseRequested { .. }) {
                    close_app.exit(0);
                }
            });
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("failed to build Agent Taskboard")
        .run(|app, event| {
            if matches!(
                event,
                tauri::RunEvent::Exit | tauri::RunEvent::ExitRequested { .. }
            ) {
                if let Some(state) = app.try_state::<ServerProcess>() {
                    if let Some(mut child) = state.child.lock().unwrap().take() {
                        let _ = child.kill();
                        let _ = child.wait();
                    }
                    if let Some(path) = state.runtime_path.lock().unwrap().take() {
                        let _ = fs::remove_file(path);
                    }
                }
            }
        });
}
