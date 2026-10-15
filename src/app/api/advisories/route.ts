import { CAVITE_PROVINCE_ID } from "@/data/phl-provinces";
import { ADVISORY_FRESHNESS_MS, parseAdvisorySnapshot } from "@/lib/map-advisories";

const headers = { "Cache-Control": "no-store, max-age=0", "X-Content-Type-Options": "nosniff" };

/** Live mode stays disabled until the source, mapping and complete-snapshot contract are reviewed. */
export async function GET() {
  const feedUrl = process.env.BANGWIT_ADVISORY_FEED_URL;
  if (!feedUrl || process.env.BANGWIT_ADVISORY_FEED_REVIEWED !== "true") {
    return Response.json({ status: "unavailable", reason: "not_configured" }, { status: 503, headers });
  }

  try {
    const url = new URL(feedUrl);
    if (url.protocol !== "https:" || url.username || url.password) throw new Error("Invalid feed URL");
    const response = await fetch(url, {
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(8000),
      redirect: "error",
      headers: { Accept: "application/json" },
    });
    if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Advisory feed unavailable");
    }
    const reader = response.body?.getReader();
    if (!reader) throw new Error("Empty advisory response");
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 1_000_000) throw new Error("Advisory response too large");
        chunks.push(value);
      }
    } finally {
      await reader.cancel().catch(() => {});
      reader.releaseLock();
    }
    const body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const snapshot = parseAdvisorySnapshot(JSON.parse(new TextDecoder().decode(body)), [CAVITE_PROVINCE_ID]);
    const age = Date.now() - Date.parse(snapshot.generatedAt);
    if (age < 0 || age > ADVISORY_FRESHNESS_MS) throw new Error("Outdated advisory publication");
    return Response.json({ status: "ready", snapshot }, { headers });
  } catch {
    return Response.json({ status: "unavailable", reason: "source_unavailable" }, { status: 503, headers });
  }
}
