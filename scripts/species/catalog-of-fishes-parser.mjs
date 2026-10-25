function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&bull;/gi, "•")
    .replace(/&rsquo;|&#8217;/gi, "’")
    .replace(/&ndash;|&#8211;/gi, "–")
    .replace(/&mdash;|&#8212;/gi, "—")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseCatalogResults(html) {
  const resultBlocks = html.matchAll(
    /<p\b(?=[^>]*\bclass\s*=\s*["'][^"']*\bresult\b[^"']*["'])[^>]*>([\s\S]*?)<\/p>/gi,
  );
  return [...resultBlocks].flatMap(([, block]) => {
    const heading = block.match(/<b[^>]*>\s*<i>([^<]+)<\/i>\s*,\s*<i>([^<]+)<\/i>\s*<\/b>/i);
    if (!heading) return [];

    const text = htmlToText(block);
    const currentStatus = text.match(/Current status:\s*(.*?)(?=\s*(?:Distribution:|Habitat:|$))/i)?.[1] ?? null;
    if (!currentStatus) return [];

    const validName = currentStatus.match(/^Valid as\s+([A-Z][A-Za-z-]+\s+[a-z][A-Za-z-]+)/i)?.[1] ?? null;
    const synonymName = currentStatus.match(/^Synonym of\s+([A-Z][A-Za-z-]+\s+[a-z][A-Za-z-]+)/i)?.[1] ?? null;
    return [
      {
        rowName: `${heading[2]} ${heading[1]}`,
        currentStatus,
        statusName: validName ?? synonymName,
        classification: validName ? "valid-name" : synonymName ? "synonym" : "other-status-needs-review",
      },
    ];
  });
}

export function selectCatalogResult(name, rows) {
  const normalizedName = name.toLowerCase();
  const exactRows = rows.filter((row) => row.rowName.toLowerCase() === normalizedName);
  const exactValidNames = rows.filter(
    (row) => row.classification === "valid-name" && row.statusName.toLowerCase() === normalizedName,
  );
  const candidates = exactRows.length > 0 ? exactRows : exactValidNames;
  if (candidates.length !== 1) {
    return {
      selected: null,
      classification: rows.length === 0 ? "status-unresolved" : "result-unresolved-or-ambiguous",
      matchingRows: candidates.length,
    };
  }
  return {
    selected: candidates[0],
    classification: candidates[0].classification,
    matchingRows: candidates.length,
  };
}
