// Cloudflare Worker — OAuth proxy for Decap CMS on GitHub Pages
// Deploy: npx wrangler deploy --name keyur-cms-auth
//
// Before deploying, set your secrets:
//   npx wrangler secret put CLIENT_ID
//   npx wrangler secret put CLIENT_SECRET

const GITHUB_AUTH  = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN = "https://github.com/login/oauth/access_token";
const SCOPE        = "repo,user";

function cors(headers = {}) {
  return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", ...headers };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors() });
    }

    // Step 1: redirect user to GitHub login
    if (url.pathname === "/auth") {
      const params = new URLSearchParams({
        client_id: env.CLIENT_ID,
        redirect_uri: url.origin + "/callback",
        scope: SCOPE,
        state: crypto.randomUUID(),
      });
      return Response.redirect(GITHUB_AUTH + "?" + params, 302);
    }

    // Step 2: exchange code for token, then send it to the CMS
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) return new Response("Missing code", { status: 400 });

      const tokenRes = await fetch(GITHUB_TOKEN, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: env.CLIENT_ID,
          client_secret: env.CLIENT_SECRET,
          code,
        }),
      });
      const data = await tokenRes.json();

      if (data.error) {
        return new Response(`Error: ${data.error_description || data.error}`, { status: 401 });
      }

      // Post the token back to the CMS window
      const body = `<script>
        (function() {
          function recieveMessage(e) {
            console.log("recieveMessage %o", e);
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({ token: data.access_token, provider: "github" })}',
              e.origin
            );
          }
          window.addEventListener("message", recieveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })();
      </script>`;
      return new Response(body, { headers: { "Content-Type": "text/html" } });
    }

    return new Response("Decap CMS OAuth Proxy", { headers: cors() });
  },
};
