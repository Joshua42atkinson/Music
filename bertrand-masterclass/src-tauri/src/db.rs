use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};
use std::fs;
use tracing::info;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StudentProfile {
    pub id: String,
    pub name: String,
    pub current_chapter: i32,
    pub xp: i32,
    pub coaching_tier: String,
    pub has_pin: Option<bool>,
    pub pin: Option<String>,
    pub florins: Option<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PracticeLog {
    pub id: String,
    pub timestamp: String,
    pub chapter: i32,
    pub notes: String,
    pub score: f64,
    pub recording_path: Option<String>,
    pub student_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StudentSubmission {
    pub id: String,
    pub student_name: String,
    pub exercise_name: String,
    pub video_path: String,
    pub audio_path: Option<String>,
    pub transcript: Option<String>,
    pub telemetry_json: Option<String>,
    pub pythagoras_scorecard: Option<String>,
    pub troubadour_draft: Option<String>,
    pub status: String,
}

pub struct Database {
    pub pool: SqlitePool,
}

fn hash_pin(pin: &str) -> String {
    let mut hash: u64 = 5381;
    for c in pin.chars() {
        hash = ((hash << 5).wrapping_add(hash)).wrapping_add(c as u64);
    }
    format!("{:x}", hash)
}

impl Database {
    pub async fn init() -> Self {
        // Resolve database directory: ~/.local/share/voix-vive or AppData/Roaming/voix-vive
        let mut db_dir = dirs::data_dir().expect("Failed to get standard data directory");
        db_dir.push("voix-vive");
        
        if !db_dir.exists() {
            fs::create_dir_all(&db_dir).expect("Failed to create database directory");
        }

        let db_path = db_dir.join("voix_vive.db");
        let db_url = format!("sqlite://{}", db_path.to_string_lossy());
        
        info!("🗄️ Initializing SQLite database at: {}", db_path.display());

        // Create file if not exists
        if !db_path.exists() {
            fs::File::create(&db_path).expect("Failed to create database file");
        }

        let pool = SqlitePoolOptions::new()
            .max_connections(5)
            .connect(&db_url)
            .await
            .expect("Failed to connect to SQLite database");

        let db = Self { pool };
        db.run_migrations().await;
        db
    }

    async fn run_migrations(&self) {
        info!("🛠️ Running SQLite database migrations...");

        // Create student_profile table
        sqlx::query(
            "CREATE TABLE IF NOT EXISTS student_profile (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                current_chapter INTEGER NOT NULL DEFAULT 1,
                xp INTEGER NOT NULL DEFAULT 0,
                coaching_tier TEXT NOT NULL DEFAULT 'free',
                pin_hash TEXT,
                florins INTEGER NOT NULL DEFAULT 100
            )"
        )
        .execute(&self.pool)
        .await
        .expect("Failed to create student_profile table");

        // Migrate existing databases if they lack pin_hash
        let _ = sqlx::query("ALTER TABLE student_profile ADD COLUMN pin_hash TEXT")
            .execute(&self.pool)
            .await;

        // Migrate existing databases if they lack florins
        let _ = sqlx::query("ALTER TABLE student_profile ADD COLUMN florins INTEGER NOT NULL DEFAULT 100")
            .execute(&self.pool)
            .await;

        // Create practice_logs table
        sqlx::query(
            "CREATE TABLE IF NOT EXISTS practice_logs (
                id TEXT PRIMARY KEY,
                timestamp TEXT NOT NULL,
                chapter INTEGER NOT NULL,
                notes TEXT NOT NULL,
                score REAL NOT NULL,
                recording_path TEXT,
                student_name TEXT NOT NULL DEFAULT 'Jean-Luc'
            )"
        )
        .execute(&self.pool)
        .await
        .expect("Failed to create practice_logs table");

        // Migrate existing databases if they lack the student_name column
        let _ = sqlx::query("ALTER TABLE practice_logs ADD COLUMN student_name TEXT NOT NULL DEFAULT 'Jean-Luc'")
            .execute(&self.pool)
            .await;

        // Create student_submissions table
        sqlx::query(
            "CREATE TABLE IF NOT EXISTS student_submissions (
                id TEXT PRIMARY KEY,
                student_name TEXT NOT NULL,
                exercise_name TEXT NOT NULL,
                video_path TEXT NOT NULL,
                audio_path TEXT,
                transcript TEXT,
                telemetry_json TEXT,
                pythagoras_scorecard TEXT,
                troubadour_draft TEXT,
                status TEXT NOT NULL DEFAULT 'unreviewed'
            )"
        )
        .execute(&self.pool)
        .await
        .expect("Failed to create student_submissions table");

        info!("✅ Database migrations complete!");
    }

    // --- Helper operations ---

    pub async fn get_all_profiles(&self) -> Vec<StudentProfile> {
        match sqlx::query_as::<_, (String, String, i32, i32, String, Option<bool>, i32)>(
            "SELECT id, name, current_chapter, xp, coaching_tier, (pin_hash IS NOT NULL AND pin_hash != ''), florins FROM student_profile ORDER BY name ASC"
        )
        .fetch_all(&self.pool)
        .await {
            Ok(rows) => rows.into_iter().map(|row| StudentProfile {
                id: row.0,
                name: row.1,
                current_chapter: row.2,
                xp: row.3,
                coaching_tier: row.4,
                has_pin: Some(row.5.unwrap_or(false)),
                pin: None,
                florins: Some(row.6),
            }).collect(),
            Err(_) => vec![],
        }
    }

    pub async fn get_profile_by_name(&self, name: &str) -> Option<StudentProfile> {
        sqlx::query_as::<_, (String, String, i32, i32, String, Option<bool>, i32)>(
            "SELECT id, name, current_chapter, xp, coaching_tier, (pin_hash IS NOT NULL AND pin_hash != ''), florins FROM student_profile WHERE name = ?"
        )
        .bind(name)
        .fetch_optional(&self.pool)
        .await
        .ok()
        .flatten()
        .map(|row| StudentProfile {
            id: row.0,
            name: row.1,
            current_chapter: row.2,
            xp: row.3,
            coaching_tier: row.4,
            has_pin: Some(row.5.unwrap_or(false)),
            pin: None,
            florins: Some(row.6),
        })
    }

    pub async fn get_profile(&self) -> Option<StudentProfile> {
        sqlx::query_as::<_, (String, String, i32, i32, String, Option<bool>, i32)>(
            "SELECT id, name, current_chapter, xp, coaching_tier, (pin_hash IS NOT NULL AND pin_hash != ''), florins FROM student_profile LIMIT 1"
        )
        .fetch_optional(&self.pool)
        .await
        .ok()
        .flatten()
        .map(|row| StudentProfile {
            id: row.0,
            name: row.1,
            current_chapter: row.2,
            xp: row.3,
            coaching_tier: row.4,
            has_pin: Some(row.5.unwrap_or(false)),
            pin: None,
            florins: Some(row.6),
        })
    }

    pub async fn verify_profile_pin(&self, name: &str, pin: &str) -> bool {
        let expected = hash_pin(pin);
        match sqlx::query_as::<_, (String,)>(
            "SELECT pin_hash FROM student_profile WHERE name = ?"
        )
        .bind(name)
        .fetch_optional(&self.pool)
        .await {
            Ok(Some(row)) => row.0 == expected,
            _ => false,
        }
    }

    pub async fn upsert_profile(&self, profile: &StudentProfile) -> anyhow::Result<()> {
        let pin_val = profile.pin.as_deref().unwrap_or("").trim();
        let hash_val = if !pin_val.is_empty() {
            Some(hash_pin(pin_val))
        } else {
            None
        };
        let florins_val = profile.florins.unwrap_or(100);

        if hash_val.is_some() {
            sqlx::query(
                "INSERT INTO student_profile (id, name, current_chapter, xp, coaching_tier, pin_hash, florins)
                 VALUES (?, ?, ?, ?, ?, ?, ?)
                 ON CONFLICT(id) DO UPDATE SET
                    name = excluded.name,
                    current_chapter = excluded.current_chapter,
                    xp = excluded.xp,
                    coaching_tier = excluded.coaching_tier,
                    pin_hash = excluded.pin_hash,
                    florins = excluded.florins"
            )
            .bind(&profile.id)
            .bind(&profile.name)
            .bind(profile.current_chapter)
            .bind(profile.xp)
            .bind(&profile.coaching_tier)
            .bind(hash_val)
            .bind(florins_val)
            .execute(&self.pool)
            .await?;
        } else {
            sqlx::query(
                "INSERT INTO student_profile (id, name, current_chapter, xp, coaching_tier, florins)
                 VALUES (?, ?, ?, ?, ?, ?)
                 ON CONFLICT(id) DO UPDATE SET
                    name = excluded.name,
                    current_chapter = excluded.current_chapter,
                    xp = excluded.xp,
                    coaching_tier = excluded.coaching_tier,
                    florins = excluded.florins"
            )
            .bind(&profile.id)
            .bind(&profile.name)
            .bind(profile.current_chapter)
            .bind(profile.xp)
            .bind(&profile.coaching_tier)
            .bind(florins_val)
            .execute(&self.pool)
            .await?;
        }

        Ok(())
    }

    pub async fn earn_florins(&self, name: &str, amount: i32) -> anyhow::Result<i32> {
        let profile = self.get_profile_by_name(name).await;
        if let Some(mut p) = profile {
            let current = p.florins.unwrap_or(100);
            let new_total = current + amount;
            p.florins = Some(new_total);
            self.upsert_profile(&p).await?;
            Ok(new_total)
        } else {
            Err(anyhow::anyhow!("Profile not found"))
        }
    }

    pub async fn spend_florins(&self, name: &str, amount: i32) -> anyhow::Result<i32> {
        let profile = self.get_profile_by_name(name).await;
        if let Some(mut p) = profile {
            let current = p.florins.unwrap_or(100);
            if current < amount {
                return Err(anyhow::anyhow!("Insufficient florins"));
            }
            let new_total = current - amount;
            p.florins = Some(new_total);
            self.upsert_profile(&p).await?;
            Ok(new_total)
        } else {
            Err(anyhow::anyhow!("Profile not found"))
        }
    }

    pub async fn get_logs(&self) -> Vec<PracticeLog> {
        match sqlx::query_as::<_, (String, String, i32, String, f64, Option<String>, String)>(
            "SELECT id, timestamp, chapter, notes, score, recording_path, student_name FROM practice_logs ORDER BY timestamp DESC"
        )
        .fetch_all(&self.pool)
        .await {
            Ok(rows) => rows.into_iter().map(|row| PracticeLog {
                id: row.0,
                timestamp: row.1,
                chapter: row.2,
                notes: row.3,
                score: row.4,
                recording_path: row.5,
                student_name: Some(row.6),
            }).collect(),
            Err(_) => vec![],
        }
    }

    pub async fn get_logs_by_student(&self, student_name: &str) -> Vec<PracticeLog> {
        match sqlx::query_as::<_, (String, String, i32, String, f64, Option<String>, String)>(
            "SELECT id, timestamp, chapter, notes, score, recording_path, student_name FROM practice_logs WHERE student_name = ? ORDER BY timestamp DESC"
        )
        .bind(student_name)
        .fetch_all(&self.pool)
        .await {
            Ok(rows) => rows.into_iter().map(|row| PracticeLog {
                id: row.0,
                timestamp: row.1,
                chapter: row.2,
                notes: row.3,
                score: row.4,
                recording_path: row.5,
                student_name: Some(row.6),
            }).collect(),
            Err(_) => vec![],
        }
    }

    pub async fn insert_log(&self, log: &PracticeLog) -> anyhow::Result<()> {
        let student = log.student_name.clone().unwrap_or_else(|| "Jean-Luc".to_string());
        sqlx::query(
            "INSERT INTO practice_logs (id, timestamp, chapter, notes, score, recording_path, student_name)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(&log.id)
        .bind(&log.timestamp)
        .bind(log.chapter)
        .bind(&log.notes)
        .bind(log.score)
        .bind(&log.recording_path)
        .bind(student)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    // --- Submissions helpers ---

    pub async fn get_submissions(&self) -> Vec<StudentSubmission> {
        match sqlx::query_as::<_, (String, String, String, String, Option<String>, Option<String>, Option<String>, Option<String>, Option<String>, String)>(
            "SELECT id, student_name, exercise_name, video_path, audio_path, transcript, telemetry_json, pythagoras_scorecard, troubadour_draft, status 
             FROM student_submissions ORDER BY id DESC"
        )
        .fetch_all(&self.pool)
        .await {
            Ok(rows) => rows.into_iter().map(|row| StudentSubmission {
                id: row.0,
                student_name: row.1,
                exercise_name: row.2,
                video_path: row.3,
                audio_path: row.4,
                transcript: row.5,
                telemetry_json: row.6,
                pythagoras_scorecard: row.7,
                troubadour_draft: row.8,
                status: row.9,
            }).collect(),
            Err(_) => vec![],
        }
    }

    pub async fn get_submission_by_id(&self, id: &str) -> Option<StudentSubmission> {
        sqlx::query_as::<_, (String, String, String, String, Option<String>, Option<String>, Option<String>, Option<String>, Option<String>, String)>(
            "SELECT id, student_name, exercise_name, video_path, audio_path, transcript, telemetry_json, pythagoras_scorecard, troubadour_draft, status 
             FROM student_submissions WHERE id = ?"
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .ok()
        .flatten()
        .map(|row| StudentSubmission {
            id: row.0,
            student_name: row.1,
            exercise_name: row.2,
            video_path: row.3,
            audio_path: row.4,
            transcript: row.5,
            telemetry_json: row.6,
            pythagoras_scorecard: row.7,
            troubadour_draft: row.8,
            status: row.9,
        })
    }

    pub async fn upsert_submission(&self, sub: &StudentSubmission) -> anyhow::Result<()> {
        sqlx::query(
            "INSERT INTO student_submissions (id, student_name, exercise_name, video_path, audio_path, transcript, telemetry_json, pythagoras_scorecard, troubadour_draft, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
                student_name = excluded.student_name,
                exercise_name = excluded.exercise_name,
                video_path = excluded.video_path,
                audio_path = excluded.audio_path,
                transcript = excluded.transcript,
                telemetry_json = excluded.telemetry_json,
                pythagoras_scorecard = excluded.pythagoras_scorecard,
                troubadour_draft = excluded.troubadour_draft,
                status = excluded.status"
        )
        .bind(&sub.id)
        .bind(&sub.student_name)
        .bind(&sub.exercise_name)
        .bind(&sub.video_path)
        .bind(&sub.audio_path)
        .bind(&sub.transcript)
        .bind(&sub.telemetry_json)
        .bind(&sub.pythagoras_scorecard)
        .bind(&sub.troubadour_draft)
        .bind(&sub.status)
        .execute(&self.pool)
        .await?;

        Ok(())
    }
}
