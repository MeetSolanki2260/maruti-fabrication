export async function verifyTurnstile(token: string, ip: string, secret: string): Promise<"ok" | "fail" | "unreachable"> {
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", signal: AbortSignal.timeout(3000),
      body: new URLSearchParams({ secret, response: token, remoteip: ip })
    });
    if (!res.ok) return "unreachable";
    return ((await res.json()) as { success?: boolean }).success ? "ok" : "fail";
  } catch { return "unreachable"; }
}
