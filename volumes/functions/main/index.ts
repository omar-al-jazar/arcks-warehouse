// Minimal main router for the Supabase Edge Functions runtime.
// Arck's Warehouse doesn't use Edge Functions yet; this just keeps the
// `functions` container's health check passing.
Deno.serve(() => new Response("Arck's Warehouse edge functions: none deployed.", { status: 200 }));
