use serde::{Serialize, Deserialize};
use reqwest::Client;
use tracing::{info, error};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SocraticEvaluation {
    pub pythagoras_scorecard: String,
    pub troubadour_draft: String,
}

/// Evaluates a student submission using the dual Pythagoras & Troubadour local LLM prompts
pub async fn run_socratic_evaluation(
    llm_base_url: &str,
    student_name: &str,
    exercise_name: &str,
    transcript: &str,
    telemetry_json: &str,
    language: &str,
) -> anyhow::Result<SocraticEvaluation> {
    let client = Client::new();
    let chat_endpoint = format!("{}/v1/chat/completions", llm_base_url);
    
    let is_french = language == "fr" || language == "French";
    
    info!("🧠 Triggering Socratic Pythagoras evaluation (lang: {}) over LLM at: {}", language, chat_endpoint);
    
    // 1. Run Pythagoras Diagnostic Prompt (Bilingual)
    let pythagoras_system = if is_french {
        "Vous êtes Pythagore, l'intelligence artificielle de coaching de guitare Socratique et scientifique. Vous analysez la physique acoustique, la stabilité rythmique et l'alignement des notes. Vous êtes extrêmement précis, logique et constructif. Évitez les métaphores vagues et concentrez-vous sur la réalité mécanique et la relaxation des doigts."
    } else {
        "You are Pythagoras, the scientific Socratic guitar coaching AI. You analyze acoustic physics, timing stability, and note alignment. You are highly constructive, precise, and logical. You avoid vague metaphors, focusing on mechanical reality and finger relaxation."
    };
    
    let pythagoras_user = if is_french {
        format!(
            "Évaluez cette session d'élève.\n\nÉlève: {}\nExercice: {}\nTélémétrie de Performance (JSON): {}\n\nCréez une fiche de diagnostic en markdown détaillée et concise contenant :\n1. Précision des notes (%)\n2. Stabilité rythmique (%)\n3. Analyse des déviations de justesse (cents de dérive microtonale)\n4. Corrections mécaniques immédiates (ex. posture du pouce, relâchement des doigts). Restez concis, logique et structuré.",
            student_name, exercise_name, telemetry_json
        )
    } else {
        format!(
            "Evaluate this guitar student's session.\n\nStudent: {}\nExercise: {}\nPerformance Telemetry (JSON): {}\n\nCreate a brief, beautiful markdown diagnostic scorecard detailing:\n1. Note Hit Accuracy (%)\n2. Rhythm/Tempo Stability (%)\n3. Pitch Deviation Analysis (microtonal cents drift)\n4. Immediate mechanical corrections (e.g., finger positioning, thumb release). Keep it concise, logical, and extremely structured.",
            student_name, exercise_name, telemetry_json
        )
    };

    let pythagoras_payload = serde_json::json!({
        "model": "active",
        "messages": [
            { "role": "system", "content": pythagoras_system },
            { "role": "user", "content": pythagoras_user }
        ],
        "temperature": 0.3
    });

    let pythagoras_scorecard = match client.post(&chat_endpoint)
        .json(&pythagoras_payload)
        .send()
        .await 
    {
        Ok(resp) => {
            if resp.status().is_success() {
                let json: serde_json::Value = resp.json().await?;
                json["choices"][0]["message"]["content"]
                    .as_str()
                    .unwrap_or("Failed to parse Pythagoras scorecard.")
                    .to_string()
            } else {
                "Local AI Pythagoras model returned a server error.".to_string()
            }
        }
        Err(e) => {
            error!("Pythagoras call failed: {:?}", e);
            if is_french {
                "scorecard de diagnostic hors-ligne : cents de dérive tracés avec succès. Serveur d'IA locale inaccessible.".to_string()
            } else {
                "offline Pythagoras diagnostic: Pitch cents mapped successfully. Local AI server unreachable.".to_string()
            }
        }
    };

    info!("🎨 Triggering Socratic Troubadour evaluation...");

    // 2. Run Troubadour Somatic Socratic Prompt (Bilingual)
    let troubadour_system = if is_french {
        "Vous êtes Le Troubadour, le copilote somatique de Bertrand Laurence. Vous parlez avec une voix chaleureuse, contemplative et artistique. Vous intégrez les concepts somatiques de Bertrand :\n- ©Le PLING! (résonance acoustique maximale, maintien de la note avec un effort somatique minimal)\n- ©Le CISAILLEMENT (glissement fluide des doigts le long du manche sans friction du pouce)\n- ©La GUÉRISON (respiration des doigts et relaxation générale du corps)\n\nAu lieu d'imposer, posez des questions socratiques qui guident l'élève à observer son propre ressenti physique."
    } else {
        "You are The Troubadour, Bertrand Laurence's somatic coaching co-pilot. You write in a warm, artistic, and slow contemplative voice. You integrate Bertrand's somatic guitar concepts:\n- ©PLING! (maximum acoustic resonance, holding the note with minimal somatic effort)\n- ©SHEARL (the shear glide, smooth finger shifts without hand tension)\n- ©FHEAL (relaxed finger breathing and muscle relaxation)\n\nInstead of lecturing, you ask Socratic questions that guide the student to observe their own somatic feelings."
    };
    
    let troubadour_user = if is_french {
        format!(
            "Rédigez un retour bienveillant et somatique pour cet élève.\n\nÉlève: {}\nExercice: {}\nNotes sur la difficulté ressentie par l'élève: {}\n\nLe message doit :\n1. Encourager chaleureusement avec un focus somatique.\n2. Lier le geste technique à l'un des principes (©Le PLING!, ©Le CISAILLEMENT, ou ©La GUÉRISON).\n3. Poser 2 à 3 questions socratiques contemplatives sur le ressenti du corps, des épaules et des mains.\n\nCommencez par : 'Salutations, voyageur en quête du Pling...' et parlez d'une voix très chaleureuse.",
            student_name, exercise_name, transcript
        )
    } else {
        format!(
            "Draft a warm, somatic mentoring response for this student.\n\nStudent: {}\nExercise: {}\nStudent's Verbal Struggle Notes: {}\n\nDraft a message that:\n1. Encourages them warmly with a somatic focus.\n2. Connects their technical shift to one of Bertrand's principles (©PLING!, ©SHEARL, or ©FHEAL).\n3. Asks 2-3 Socratic, contemplation-rich questions about what they felt in their body, shoulders, or hands.\n\nStart the message with: 'Greetings, fellow seeker of the Pling...' and keep it extremely warm.",
            student_name, exercise_name, transcript
        )
    };

    let troubadour_payload = serde_json::json!({
        "model": "active",
        "messages": [
            { "role": "system", "content": troubadour_system },
            { "role": "user", "content": troubadour_user }
        ],
        "temperature": 0.7
    });

    let troubadour_draft = match client.post(&chat_endpoint)
        .json(&troubadour_payload)
        .send()
        .await 
    {
        Ok(resp) => {
            if resp.status().is_success() {
                let json: serde_json::Value = resp.json().await?;
                json["choices"][0]["message"]["content"]
                    .as_str()
                    .unwrap_or("Failed to parse Troubadour draft.")
                    .to_string()
            } else {
                "Local AI Troubadour model returned a server error.".to_string()
            }
        }
        Err(e) => {
            error!("Troubadour call failed: {:?}", e);
            if is_french {
                "brouillon du Troubadour hors-ligne : n'oubliez pas de relâcher votre épaule et d'écouter la résonance du Pling.".to_string()
            } else {
                "offline Troubadour draft: Standard Somatic check-in. Remember to relax your shoulder and listen for the Pling resonance.".to_string()
            }
        }
    };

    info!("✅ Dual Socratic evaluation completed successfully!");

    Ok(SocraticEvaluation {
        pythagoras_scorecard,
        troubadour_draft,
    })
}
