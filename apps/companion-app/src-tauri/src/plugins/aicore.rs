use tauri::{command, AppHandle, Runtime, Manager};
use std::sync::Arc;

#[cfg(target_os = "android")]
fn invoke_infer_gemini_nano<'a>(env: &mut jni::JNIEnv<'a>, activity: &jni::objects::JObject<'a>, prompt: String) -> Result<String, String> {
    let j_prompt = env.new_string(prompt).map_err(|e| e.to_string())?;
    
    // Call inferGeminiNano on the MainActivity instance
    let result = env.call_method(
        activity,
        "inferGeminiNano",
        "(Ljava/lang/String;)Ljava/lang/String;",
        &[jni::objects::JValue::from(&j_prompt)]
    ).map_err(|e| e.to_string())?;

    let j_str = result.l().map_err(|e| e.to_string())?;
    let rust_string: String = env.get_string((&j_str).into()).map_err(|e| e.to_string())?.into();
    
    Ok(rust_string)
}

#[command]
pub async fn ask_gemini_nano<R: Runtime>(app: AppHandle<R>, prompt: String) -> Result<String, String> {
    #[cfg(target_os = "android")]
    {
        // Offload blocking JNI call to a thread pool
        let result = tauri::async_runtime::spawn_blocking(move || {
            let ctx = ndk_context::android_context();
            let vm = unsafe { jni::JavaVM::from_raw(ctx.vm().cast()) }.map_err(|e| e.to_string())?;
            let mut env = vm.attach_current_thread().map_err(|e| e.to_string())?;
            let activity = unsafe { jni::objects::JObject::from_raw(ctx.context().cast()) };
            
            invoke_infer_gemini_nano(&mut env, &activity, prompt)
        }).await.map_err(|e| e.to_string())??;
        
        return Ok(result);
    }

    #[cfg(not(target_os = "android"))]
    {
        Ok(format!("[Mock Nano (Desktop)] Received: {}", prompt))
    }
}

pub fn init<R: Runtime>() -> tauri::plugin::TauriPlugin<R> {
    tauri::plugin::Builder::new("aicore")
        .invoke_handler(tauri::generate_handler![ask_gemini_nano])
        .build()
}
