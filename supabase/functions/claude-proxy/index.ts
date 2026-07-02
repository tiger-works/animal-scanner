// Claude proxy for Animal Scanner.
// Holds the Anthropic API key server-side so the public web app never sees it.
// Deploy:  supabase functions deploy claude-proxy --no-verify-jwt
// Secret:  supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

const CORS = {
  "Access-Control-Allow-Origin": "https://tiger-works.github.io",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: { message: "POST only" } }), {
      status: 405,
      headers: { ...CORS, "content-type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: { message: "Invalid JSON" } }), {
      status: 400,
      headers: { ...CORS, "content-type": "application/json" },
    });
  }

  // Pin the model and cap output server-side so the endpoint can't be abused.
  body.model = "claude-opus-4-8";
  body.max_tokens = Math.min(body.max_tokens ?? 1024, 1024);

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  return new Response(await resp.text(), {
    status: resp.status,
    headers: { ...CORS, "content-type": "application/json" },
  });
});
