use serde::{Deserialize, Serialize};
use std::env;
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct LanguageInfo {
    pub system_language: String,
    pub default_language: String,
}

#[command]
pub async fn get_system_language() -> Result<LanguageInfo, String> {
    let system_language = detect_system_language();
    
    Ok(LanguageInfo {
        system_language: system_language.clone(),
        default_language: system_language,
    })
}

fn detect_system_language() -> String {
    // 通过环境变量检测
    if let Ok(lang) = env::var("LANG") {
        if lang.to_lowercase().contains("zh") {
            return "zh".to_string();
        }
    }
    
    // Windows系统语言检测
    #[cfg(target_os = "windows")]
    {
        if let Ok(output) = std::process::Command::new("powershell")
            .arg("-Command")
            .arg("Get-Culture | Select-Object -ExpandProperty Name")
            .output()
        {
            if output.status.success() {
                let lang = String::from_utf8_lossy(&output.stdout);
                if lang.to_lowercase().contains("zh") {
                    return "zh".to_string();
                }
            }
        }
    }
    
    // macOS系统语言检测
    #[cfg(target_os = "macos")]
    {
        if let Ok(output) = std::process::Command::new("defaults")
            .arg("read")
            .arg("-g")
            .arg("AppleLanguages")
            .output()
        {
            if output.status.success() {
                let lang = String::from_utf8_lossy(&output.stdout);
                if lang.contains("zh") {
                    return "zh".to_string();
                }
            }
        }
    }
    
    // 默认英文
    "en".to_string()
}