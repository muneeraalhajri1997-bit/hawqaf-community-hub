import { createMiddleware } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

export const requireSupabaseAuth = createMiddleware().server(async ({ next, request }) => {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    throw new Response("Unauthorized: No authorization header provided", { status: 401 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_PUBLISHABLE_KEY ?? "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const token = authorization.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new Response("Unauthorized: Invalid token", { status: 401 });
  }

  return await next({
    context: {
      supabase,
      userId: data.user.id,
      claims: data.user,
    } as {
      supabase: typeof supabase;
      userId: string;
      claims: typeof data.user;
    },
  });
});
