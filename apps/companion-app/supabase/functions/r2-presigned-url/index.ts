import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { S3Client, PutObjectCommand } from "https://esm.sh/@aws-sdk/client-s3@3.370.0";
import { getSignedUrl } from "https://esm.sh/@aws-sdk/s3-request-presigner@3.370.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") || "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { fileName, contentType } = await req.json();

    if (!fileName || !contentType) {
      return new Response(
        JSON.stringify({ error: "Missing fileName or contentType in request body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const r2Endpoint = Deno.env.get("R2_ENDPOINT");
    const r2AccessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
    const r2SecretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");
    const r2BucketName = Deno.env.get("R2_BUCKET_NAME");
    const r2PublicUrl = Deno.env.get("R2_PUBLIC_URL") || "";

    if (!r2Endpoint || !r2AccessKeyId || !r2SecretAccessKey || !r2BucketName) {
      return new Response(
        JSON.stringify({ error: "Cloudflare R2 environment variables are not fully configured on the server." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize S3 client for Cloudflare R2
    const s3Client = new S3Client({
      region: "auto",
      endpoint: r2Endpoint,
      credentials: {
        accessKeyId: r2AccessKeyId,
        secretAccessKey: r2SecretAccessKey,
      },
    });

    const fileKey = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}-${fileName}`;

    // Create PUT command
    const command = new PutObjectCommand({
      Bucket: r2BucketName,
      Key: fileKey,
      ContentType: contentType,
    });

    // Generate pre-signed URL (expires in 15 minutes / 900 seconds)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
    
    // Construct the public URL for file retrieval after successful upload
    const publicUrl = r2PublicUrl 
      ? `${r2PublicUrl}/${fileKey}` 
      : `${r2Endpoint}/${r2BucketName}/${fileKey}`;

    return new Response(
      JSON.stringify({ uploadUrl, publicUrl, fileKey }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
