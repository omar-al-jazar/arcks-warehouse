// Minimal main router for the Supabase Edge Functions runtime.
// ARC doesn't use Edge Functions yet; this just keeps the
// `functions` container's health check passing.
Deno.serve(() => new Response("ARC edge functions: none deployed.", { status: 200 }));
