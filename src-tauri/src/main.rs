// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod language;

use tauri::Manager;
use reqwest::multipart::{Form, Part};
use language::{get_system_language, LanguageInfo};

#[tauri::command]
async fn ocr_request(url: String, base64_data: String) -> Result<serde_json::Value, String> {
    let client = reqwest::Client::new();
    
    // 将 base64 数据转换回二进制
    let image_data = base64::decode(base64_data)
        .map_err(|e| e.to_string())?;

    // 创建 multipart form
    let form = Form::new()
        .part("file", Part::bytes(image_data)
            .file_name("image.png")
            .mime_str("image/png")
            .map_err(|e| e.to_string())?);

    let response = client
        .post(url)
        .header("accept", "*/*")
        .header("accept-language", "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6")
        .header("sec-ch-ua", "\"Microsoft Edge\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"")
        .header("sec-ch-ua-mobile", "?0")
        .header("sec-ch-ua-platform", "\"Windows\"")
        .header("sec-fetch-dest", "empty")
        .header("sec-fetch-mode", "cors")
        .header("sec-fetch-site", "same-origin")
        .header("referrer", "https://www.olmocr.com/zh")
        .multipart(form)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let data = response
        .json::<serde_json::Value>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(data)
}

#[tauri::command]
async fn get_app_language() -> Result<LanguageInfo, String> {
    get_system_language().await
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![ocr_request, get_app_language])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}