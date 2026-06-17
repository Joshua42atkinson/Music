import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Authenticate caller using Supabase JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Parse request payload
    const payload = await req.json();
    const {
      type,
      submissionId,
      exerciseName,
      fretId,
      studentName,
      studentId,
      feedbackNotes,
      mentorVideoLink,
      locale = "en",
    } = payload;

    if (!type || (type !== "submission" && type !== "review")) {
      return new Response(JSON.stringify({ error: "Invalid email type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Resolve emails
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const resendFrom = Deno.env.get("RESEND_FROM_EMAIL") || "Voix Vive Academy <onboarding@resend.dev>";
    const bertrandEmail = Deno.env.get("BERTRAND_EMAIL") || Deno.env.get("MENTOR_EMAIL") || "bertrand.laurence@gmail.com";
    const frontendUrl = Deno.env.get("FRONTEND_URL") || "http://localhost:5173";

    let recipientEmail = "";
    let emailSubject = "";
    let emailHtml = "";

    if (type === "submission") {
      recipientEmail = bertrandEmail;
      
      if (locale === "fr") {
        emailSubject = `[Voix Vive] Nouvelle soumission d'enregistrement — ${studentName}`;
        emailHtml = `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0b0b0f; color: #f0e6d2; border: 1px solid #c9a96e; border-radius: 8px;">
            <h2 style="color: #c9a96e; font-family: 'Cormorant Garamond', serif; border-bottom: 1px solid rgba(201, 169, 110, 0.2); padding-bottom: 10px;">Nouvelle soumission de pratique</h2>
            <p>Bonjour Bertrand,</p>
            <p>Un étudiant a soumis un nouvel enregistrement pour votre évaluation somatique :</p>
            <table style="width: 100%; margin: 20px 0; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #8a9aaa; width: 150px;"><strong>Étudiant:</strong></td>
                <td style="padding: 8px 0; color: #f0e6d2;">${studentName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8a9aaa;"><strong>Exercice:</strong></td>
                <td style="padding: 8px 0; color: #f0e6d2;">${exerciseName} (Fret ${fretId || "N/A"})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8a9aaa;"><strong>ID Soumission:</strong></td>
                <td style="padding: 8px 0; color: #8a9aaa; font-family: monospace;">${submissionId || "N/A"}</td>
              </tr>
            </table>
            <div style="margin-top: 30px; text-align: center;">
              <a href="${frontendUrl}/mentor" style="background-color: #c9a96e; color: #0d0d14; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; font-family: sans-serif; display: inline-block;">Ouvrir le portail mentor</a>
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #8a9aaa; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 15px;">Cet e-mail automatique provient du système de mentorat asynchrone Voix Vive.</p>
          </div>
        `;
      } else {
        emailSubject = `[Voix Vive] New Practice Submission — ${studentName}`;
        emailHtml = `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0b0b0f; color: #f0e6d2; border: 1px solid #c9a96e; border-radius: 8px;">
            <h2 style="color: #c9a96e; font-family: 'Cormorant Garamond', serif; border-bottom: 1px solid rgba(201, 169, 110, 0.2); padding-bottom: 10px;">New Practice Submission</h2>
            <p>Hello Bertrand,</p>
            <p>A student has submitted a new practice recording for your somatic review:</p>
            <table style="width: 100%; margin: 20px 0; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #8a9aaa; width: 150px;"><strong>Student:</strong></td>
                <td style="padding: 8px 0; color: #f0e6d2;">${studentName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8a9aaa;"><strong>Exercise:</strong></td>
                <td style="padding: 8px 0; color: #f0e6d2;">${exerciseName} (Fret ${fretId || "N/A"})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8a9aaa;"><strong>Submission ID:</strong></td>
                <td style="padding: 8px 0; color: #8a9aaa; font-family: monospace;">${submissionId || "N/A"}</td>
              </tr>
            </table>
            <div style="margin-top: 30px; text-align: center;">
              <a href="${frontendUrl}/mentor" style="background-color: #c9a96e; color: #0d0d14; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; font-family: sans-serif; display: inline-block;">Open Mentor Portal</a>
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #8a9aaa; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 15px;">This is an automated email from the Voix Vive Async Coaching Pipeline.</p>
          </div>
        `;
      }
    } else if (type === "review") {
      // Look up student email using studentId and service role client
      if (!studentId) {
        return new Response(JSON.stringify({ error: "Missing studentId for review notification" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!supabaseServiceKey) {
        console.warn("[send-email] SUPABASE_SERVICE_ROLE_KEY not available, using fallback/dummy student email");
        recipientEmail = "student@example.com";
      } else {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(studentId);
        if (userError || !userData || !userData.user) {
          console.warn(`[send-email] Failed to retrieve student user:`, userError, `. Using fallback student@example.com`);
          recipientEmail = "student@example.com";
        } else {
          recipientEmail = userData.user.email || "student@example.com";
        }
      }

      const formattedNotes = (feedbackNotes || "")
        .replace(/\n/g, "<br/>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");

      if (locale === "fr") {
        emailSubject = `[Voix Vive] Votre évaluation somatique de Bertrand est prête !`;
        emailHtml = `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0b0b0f; color: #f0e6d2; border: 1px solid #7aaa88; border-radius: 8px;">
            <h2 style="color: #7aaa88; font-family: 'Cormorant Garamond', serif; border-bottom: 1px solid rgba(122, 170, 136, 0.2); padding-bottom: 10px;">Commentaires de votre mentor</h2>
            <p>Bonjour ${studentName || "l'étudiant"},</p>
            <p>Maître Bertrand Laurence a examiné votre soumission d'enregistrement pour l'exercice <strong>${exerciseName}</strong>.</p>
            
            <div style="background-color: rgba(255,255,255,0.03); border-left: 3px solid #7aaa88; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <h4 style="margin-top: 0; color: #f0e6d2; font-family: 'Cormorant Garamond', serif;">Notes de Bertrand :</h4>
              <p style="font-size: 14px; line-height: 1.6; color: #e8dcc8; font-style: italic;">${formattedNotes || "Pas de notes écrites"}</p>
            </div>

            ${mentorVideoLink ? `
              <p style="font-size: 14px;">📹 Un retour vidéo personnalisé a été joint à votre évaluation. Vous pouvez le visionner en cliquant sur le lien ci-dessous :</p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${mentorVideoLink}" style="background-color: #7aaa88; color: #0d0d14; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 4px; font-family: sans-serif; display: inline-block;">Visionner les commentaires vidéo</a>
              </div>
            ` : ""}

            <p>Vous pouvez consulter votre fiche d'évaluation et l'intégralité de vos commentaires dans votre <strong>Classeur Numérique</strong> en vous connectant à l'application.</p>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="${frontendUrl}/" style="background-color: #c9a96e; color: #0d0d14; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; font-family: sans-serif; display: inline-block;">Accéder au classeur</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 11px; color: #8a9aaa; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 15px;">"Le son arrive là où le souffle se détend." — Voix Vive Academy</p>
          </div>
        `;
      } else {
        emailSubject = `[Voix Vive] Your Somatic Review from Bertrand is Ready!`;
        emailHtml = `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0b0b0f; color: #f0e6d2; border: 1px solid #7aaa88; border-radius: 8px;">
            <h2 style="color: #7aaa88; font-family: 'Cormorant Garamond', serif; border-bottom: 1px solid rgba(122, 170, 136, 0.2); padding-bottom: 10px;">Mentorship Feedback</h2>
            <p>Hello ${studentName || "student"},</p>
            <p>Maître Bertrand Laurence has completed a somatic review of your practice submission for <strong>${exerciseName}</strong>.</p>
            
            <div style="background-color: rgba(255,255,255,0.03); border-left: 3px solid #7aaa88; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <h4 style="margin-top: 0; color: #f0e6d2; font-family: 'Cormorant Garamond', serif;">Bertrand's Notes:</h4>
              <p style="font-size: 14px; line-height: 1.6; color: #e8dcc8; font-style: italic;">${formattedNotes || "No written notes provided"}</p>
            </div>

            ${mentorVideoLink ? `
              <p style="font-size: 14px;">📹 A personalized video response has been attached. You can view it directly by clicking below:</p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${mentorVideoLink}" style="background-color: #7aaa88; color: #0d0d14; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 4px; font-family: sans-serif; display: inline-block;">Watch Video Feedback</a>
              </div>
            ` : ""}

            <p>You can read your complete diagnostic scorecard and review history inside your <strong>Digital Binder</strong> by logging into the app.</p>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="${frontendUrl}/" style="background-color: #c9a96e; color: #0d0d14; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; font-family: sans-serif; display: inline-block;">Open Digital Binder</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 11px; color: #8a9aaa; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 15px;">"The note arrives where the breath relaxes." — Voix Vive Academy</p>
          </div>
        `;
      }
    }

    // 4. Send email securely via Resend API
    if (!resendApiKey) {
      console.warn(`[send-email] RESEND_API_KEY env var not configured. Email content (Mocked Send):`);
      console.log(`  To: ${recipientEmail}`);
      console.log(`  From: ${resendFrom}`);
      console.log(`  Subject: ${emailSubject}`);
      return new Response(JSON.stringify({ 
        success: true, 
        mocked: true, 
        message: "Email logged to console (mocked local development)" 
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: resendFrom,
        to: [recipientEmail],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const resData = await response.json();
      console.error("[send-email] Resend API error:", resData);
      throw new Error(resData?.message || "Failed to send email via Resend API");
    }

    const resData = await response.json();
    return new Response(JSON.stringify({ success: true, id: resData.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[send-email] Error:", err);
    // Graceful fallback status in response for sovereign mode
    return new Response(JSON.stringify({ success: false, error: err.message, fallback: true }), {
      status: 200, // Keep 200 for sovereign resilience
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
