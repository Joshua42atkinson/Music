use serde::{Serialize, Deserialize};
use reqwest::Client;
use tracing::{info, error};
use crate::ffmpeg::PitchPoint;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SocraticEvaluation {
    pub pythagoras_scorecard: String,
    pub troubadour_draft: String,
}

pub fn generate_offline_pythagoras_scorecard(telemetry_json: &str, is_french: bool) -> String {
    let points: Vec<PitchPoint> = serde_json::from_str(telemetry_json).unwrap_or_default();
    
    if points.is_empty() {
        return if is_french {
            "### 🧮 Scorecard Télémétrique Pythagore (Moteur Hors-Ligne)\n\n*Analyse acoustique calculée directement à partir de vos données de performance.*\n\n**Aucune télémétrie de hauteur de son détectée.** Veuillez vérifier que votre microphone est activé et que vous jouez à proximité du récepteur.".to_string()
        } else {
            "### 🧮 Pythagoras Telemetric Scorecard (Offline Engine)\n\n*Acoustic analysis computed directly from your performance telemetry.*\n\n**No audio pitch telemetry detected.** Please verify that your microphone is active and that you are playing close to the receiver.".to_string()
        };
    }

    // 1. Note Hit Accuracy (points within ±15 cents)
    let accurate_points = points.iter().filter(|p| p.deviation_cents.abs() <= 15.0).count();
    let note_accuracy = (accurate_points as f64 / points.len() as f64) * 100.0;

    // 2. Pitch Deviation Analysis
    let avg_dev = points.iter().map(|p| p.deviation_cents).sum::<f64>() / points.len() as f64;
    let max_dev = points.iter().map(|p| p.deviation_cents.abs()).fold(0.0, f64::max);

    let drift_dir = if is_french {
        if avg_dev > 5.0 { "Dérive vers le haut / Dièse" }
        else if avg_dev < -5.0 { "Dérive vers le bas / Bémol" }
        else { "Centré" }
    } else {
        if avg_dev > 5.0 { "Sharp drift" }
        else if avg_dev < -5.0 { "Flat drift" }
        else { "Centered" }
    };

    // 3. Rhythm/Tempo Stability
    let mut note_transitions = Vec::new();
    let mut last_note = String::new();
    for p in &points {
        if p.note != last_note && p.note != "Silence" {
            note_transitions.push(p.time);
            last_note = p.note.clone();
        }
    }

    let mut intervals = Vec::new();
    for w in note_transitions.windows(2) {
        intervals.push(w[1] - w[0]);
    }

    let rhythm_stability = if intervals.len() >= 2 {
        let mean_interval = intervals.iter().sum::<f64>() / intervals.len() as f64;
        if mean_interval > 0.0 {
            let variance = intervals.iter().map(|&x| {
                let diff = x - mean_interval;
                diff * diff
            }).sum::<f64>() / intervals.len() as f64;
            let std_dev = variance.sqrt();
            (1.0 - (std_dev / mean_interval).min(0.5) / 0.5) * 100.0
        } else {
            85.0
        }
    } else {
        85.0
    };

    // 4. Mechanical recommendations
    let mechanical_advice = if is_french {
        let mut advice = if note_accuracy >= 90.0 {
            "- **Justesse exceptionnelle** : Conservez une tension minimale des doigts pour préserver la résonance pure."
        } else if note_accuracy >= 70.0 {
            "- **Centrage modéré** : Appuyez directement derrière les frettes. Évitez de tirer ou tordre la corde latéralement."
        } else {
            "- **Déviation importante** : Relâchez le pouce gauche derrière le manche. Arrondissez vos doigts pour éviter les torsions."
        }.to_string();

        if rhythm_stability < 80.0 {
            advice.push_str("\n- **Stabilité rythmique** : Pratiquez à 60 BPM avec un métronome lent. Relâchez le doigt exactement sur le temps.");
        }
        advice
    } else {
        let mut advice = if note_accuracy >= 90.0 {
            "- **Exceptional pitch alignment**: Maintain minimal finger tension to conserve pure acoustic resonance."
        } else if note_accuracy >= 70.0 {
            "- **Moderate pitch centering**: Press directly behind the frets. Avoid pulling or bending the string sideways."
        } else {
            "- **Significant pitch deviation**: Relax your left hand thumb behind the neck. Arch your fingers to prevent accidental bends."
        }.to_string();

        if rhythm_stability < 80.0 {
            advice.push_str("\n- **Timing drift**: Practice with a slow metronome at 60 BPM. Release the finger exactly on the beat.");
        }
        advice
    };

    if is_french {
        format!(
            "### 🧮 Scorecard Télémétrique Pythagore (Moteur Hors-Ligne)\n\n*Analyse acoustique calculée directement à partir de vos données de performance.*\n\n- **Précision des Notes** : {:.1}%\n- **Stabilité Rythmique** : {:.1}%\n- **Analyse des Déviations** :\n  - Dérive cents moyenne : {:+.1}¢ ({})\n  - Dérive de crête maximale : {:.1}¢\n- **Recommandations Mécaniques** :\n{}",
            note_accuracy, rhythm_stability, avg_dev, drift_dir, max_dev, mechanical_advice
        )
    } else {
        format!(
            "### 🧮 Pythagoras Telemetric Scorecard (Offline Engine)\n\n*Acoustic analysis computed directly from your performance telemetry.*\n\n- **Note Hit Accuracy** : {:.1}%\n- **Rhythm/Tempo Stability** : {:.1}%\n- **Pitch Deviation Analysis** :\n  - Average cents drift : {:+.1}¢ ({})\n  - Maximum peak drift : {:.1}¢\n- **Mechanical Recommendations** :\n{}",
            note_accuracy, rhythm_stability, avg_dev, drift_dir, max_dev, mechanical_advice
        )
    }
}

pub fn generate_offline_troubadour_draft(
    telemetry_json: &str,
    student_name: &str,
    exercise_name: &str,
    transcript: &str,
    is_french: bool,
) -> String {
    let points: Vec<PitchPoint> = serde_json::from_str(telemetry_json).unwrap_or_default();
    
    if points.is_empty() {
        return if is_french {
            format!(
                "Salutations, {} !\n\nJ'ai écouté avec attention vos respirations, mais mes capteurs n'ont pas détecté la résonance de votre guitare sur **{}**. Prenez une profonde inspiration, vérifiez votre connexion audio, et faisons vibrer le Pling ensemble !",
                student_name, exercise_name
            )
        } else {
            format!(
                "Greetings, {} !\n\nI listened closely to your breathing, but my sensors could not detect the acoustic chime of your guitar on **{}**. Take a deep breath, verify your audio input, and let us seek the Pling together!",
                student_name, exercise_name
            )
        };
    }

    let accurate_points = points.iter().filter(|p| p.deviation_cents.abs() <= 15.0).count();
    let note_accuracy = (accurate_points as f64 / points.len() as f64) * 100.0;
    let avg_dev = points.iter().map(|p| p.deviation_cents).sum::<f64>() / points.len() as f64;

    let mut note_transitions = Vec::new();
    let mut last_note = String::new();
    for p in &points {
        if p.note != last_note && p.note != "Silence" {
            note_transitions.push(p.time);
            last_note = p.note.clone();
        }
    }

    let mut intervals = Vec::new();
    for w in note_transitions.windows(2) {
        intervals.push(w[1] - w[0]);
    }

    let rhythm_stability = if intervals.len() >= 2 {
        let mean_interval = intervals.iter().sum::<f64>() / intervals.len() as f64;
        if mean_interval > 0.0 {
            let variance = intervals.iter().map(|&x| {
                let diff = x - mean_interval;
                diff * diff
            }).sum::<f64>() / intervals.len() as f64;
            let std_dev = variance.sqrt();
            (1.0 - (std_dev / mean_interval).min(0.5) / 0.5) * 100.0
        } else {
            85.0
        }
    } else {
        85.0
    };

    let category = if note_accuracy < 80.0 {
        "PLING"
    } else if rhythm_stability < 80.0 {
        "FHEAL"
    } else {
        "SHEARL"
    };
    let struggle_comment = if !transcript.is_empty() && transcript != "Struggling with note transitions." {
        if is_french {
            format!("\n\nJ'ai noté votre observation : *\"{}\"* — c'est une prise de conscience précieuse. Accueillons ce ressenti dans notre pratique.", transcript)
        } else {
            format!("\n\nI heard your reflection that you were *\"{}\"* — this is a beautiful window of self-awareness. Let us bring this feeling gently into our practice.", transcript)
        }
    } else {
        "".to_string()
    };

    if is_french {
        let somatic_focus_intro = match category {
            "PLING" => "nous devons centrer le cœur de la note. L'alignement physique du doigt n'est pas une question de force, mais d'un équilibre vertical et doux. Laissez le bout du doigt agir comme une ancre légère, maintenant la frette avec juste assez de poids pour déclencher le carillon.",
            "FHEAL" => "notre timing est le reflet de notre respiration. Lorsque le rythme dérive, cela signifie souvent que le corps retient son souffle lors des transitions difficiles. Le principe ©FHEAL de Bertrand nous enseigne à respirer *à travers* les doigts, en laissant chaque pulsation se poser sur une expiration.",
            _ => "nous explorons le glissement fluide de la main. Le mouvement ©CISAILLEMENT est un déplacement sans friction où le pouce relâche entièrement sa prise, laissant le bras déplacer les doigts le long du manche comme de la glace sur de la pierre chaude.",
        };

        let q1 = match category {
            "PLING" => "Lorsque vous appuyez sur la corde, votre doigt ressemble-t-il à un marteau lourd, ou à une feuille posée sur une branche ?",
            "FHEAL" => "Avez-vous remarqué si vous reteniez votre souffle lors des transitions difficiles ?",
            _ => "Votre pouce ressemblait-il à un étau serré ou à une plume de guidage à l'arrière du manche pendant vos glissements ?",
        };

        let q2 = match category {
            "PLING" => "Pouvez-vous essayer de jouer la frette et de relâcher lentement la pression jusqu'à ce que la note grésille, afin de trouver la force minimale exacte requise pour un ©PLING! pur ?",
            "FHEAL" => "Pouvez-vous essayer de chanter le rythme sur un son doux 'Haa' avant que vos doigts ne touchent le manche ?",
            _ => "Pouvez-vous vous entraîner à passer d'une note à l'autre avec le pouce complètement décollé du bois ?",
        };

        let q3 = match category {
            "PLING" => "Vos épaules retiennent-elles une tension secondaire pendant que vous cherchez la justesse ?",
            "FHEAL" => "Où dans votre poitrine ou votre diaphragme ressentez-vous la pulsation se poser lorsque vous jouez ?",
            _ => "Comment ressentez-vous la texture du manche contre votre paume lorsque vous laissez couler le mouvement ?",
        };

        format!(
            "Salutations, voyageur en quête du Pling !\n\nJ'ai écouté attentivement votre interprétation de **{}**. Même en l'absence du serveur d'IA local, la télémétrie physique de vos cordes raconte un magnifique voyage.\n\nVos notes ont enregistré un **alignement de justesse de {:.1}%** avec une dérive moyenne de {:+.1}¢.{}\n\nJe ressens que {}\n\nVoici quelques contemplations socratiques pour votre séance d'aujourd'hui :\n1. {}\n2. {}\n3. {}\n\nRespirez dans vos doigts, et laissez chanter la guitare.",
            exercise_name, note_accuracy, avg_dev, struggle_comment, somatic_focus_intro, q1, q2, q3
        )
    } else {
        let somatic_focus_intro = match category {
            "PLING" => "we must center the core of the note. The physical alignment of the finger is not about force, but about a soft, vertical balance. Let the finger-tip act as a gentle anchor, holding the fret with just enough weight to trigger the chime, and no more.",
            "FHEAL" => "our timing is the reflection of our breathing. When the rhythm drifts, it often means the body is holding its breath during difficult shifts. Bertrand's ©FHEAL teaches us to breathe *through* the fingers—letting each pulse land on an exhale.",
            _ => "we are exploring the smooth shift of the hand. The ©SHEARL glide is a friction-free motion where the thumb releases its grip entirely, letting the arm move the fingers along the wood like ice on warm stone.",
        };

        let q1 = match category {
            "PLING" => "When you press the string, does your finger feel like a heavy hammer, or a leaf resting on a branch?",
            "FHEAL" => "Did you notice if you held your breath during the transitions between notes?",
            _ => "Did your thumb feel like a clamping vise or a guiding feather on the back of the neck during shifts?",
        };

        let q2 = match category {
            "PLING" => "Can you try playing the fret and slowly releasing pressure until the note buzzes, finding the exact minimum force needed for a pure ©PLING!?",
            "FHEAL" => "Can you try singing the rhythm on a soft 'Haa' sound before your fingers touch the fretboard?",
            _ => "Can you practice shifting from note to note with your thumb completely hovering off the wood?",
        };

        let q3 = match category {
            "PLING" => "Are your shoulders holding any secondary tension while you seek the pitch?",
            "FHEAL" => "Where in your chest or diaphragm do you feel the beat landing as you play?",
            _ => "How does the texture of the neck feel against your palm when you allow the movement to flow?",
        };

        format!(
            "Greetings, fellow seeker of the Pling!\n\nI have listened deeply to your performance of **{}**. Even with the local AI library resting, the physical telemetry of your strings speaks of a beautiful journey.\n\nYour notes registered a **{:.1}% pitch alignment** with a {:+.1}¢ average drift.{}\n\nI feel that {}\n\nHere are some Socratic contemplations for your practice session today:\n1. {}\n2. {}\n3. {}\n\nBreathe into the fingers, and let the guitar ring.",
            exercise_name, note_accuracy, avg_dev, struggle_comment, somatic_focus_intro, q1, q2, q3
        )
    }
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
                    .map(|s| s.to_string())
                    .unwrap_or_else(|| generate_offline_pythagoras_scorecard(telemetry_json, is_french))
            } else {
                generate_offline_pythagoras_scorecard(telemetry_json, is_french)
            }
        }
        Err(e) => {
            error!("Pythagoras call failed: {:?}", e);
            generate_offline_pythagoras_scorecard(telemetry_json, is_french)
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
                    .map(|s| s.to_string())
                    .unwrap_or_else(|| generate_offline_troubadour_draft(telemetry_json, student_name, exercise_name, transcript, is_french))
            } else {
                generate_offline_troubadour_draft(telemetry_json, student_name, exercise_name, transcript, is_french)
            }
        }
        Err(e) => {
            error!("Troubadour call failed: {:?}", e);
            generate_offline_troubadour_draft(telemetry_json, student_name, exercise_name, transcript, is_french)
        }
    };

    info!("✅ Dual Socratic evaluation completed successfully!");

    Ok(SocraticEvaluation {
        pythagoras_scorecard,
        troubadour_draft,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_offline_scorecard_empty_telemetry() {
        let scorecard = generate_offline_pythagoras_scorecard("", false);
        assert!(scorecard.contains("No audio pitch telemetry detected"));
        
        let scorecard_fr = generate_offline_pythagoras_scorecard("", true);
        assert!(scorecard_fr.contains("Aucune télémétrie de hauteur de son détectée"));
    }

    #[test]
    fn test_offline_scorecard_valid_telemetry() {
        let test_json = r#"[
            {"time": 0.0, "frequency": 440.0, "note": "A4", "deviation_cents": 2.0, "amplitude": 0.8},
            {"time": 0.1, "frequency": 440.5, "note": "A4", "deviation_cents": 4.0, "amplitude": 0.8},
            {"time": 0.2, "frequency": 441.0, "note": "A4", "deviation_cents": 6.0, "amplitude": 0.8},
            {"time": 0.3, "frequency": 329.6, "note": "E4", "deviation_cents": -10.0, "amplitude": 0.8},
            {"time": 0.4, "frequency": 330.0, "note": "E4", "deviation_cents": -18.0, "amplitude": 0.8}
        ]"#;

        let scorecard = generate_offline_pythagoras_scorecard(test_json, false);
        assert!(scorecard.contains("Note Hit Accuracy"));
        assert!(scorecard.contains("80.0%"));
        assert!(scorecard.contains("Rhythm/Tempo Stability"));

        let draft = generate_offline_troubadour_draft(test_json, "Jean-Luc", "Scale Practice", "Struggling with hand pain", false);
        assert!(draft.contains("Greetings, fellow seeker of the Pling!"));
        assert!(draft.contains("Scale Practice"));
        assert!(draft.contains("I heard your reflection that you were"));
        assert!(draft.contains("hand pain"));
    }
}
