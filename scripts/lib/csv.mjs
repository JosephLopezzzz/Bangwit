export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  let closedQuote = false;
  const source = text.replace(/^\uFEFF/, "");
  function finishField() {
    row.push(field);
    field = "";
    closedQuote = false;
  }
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
        closedQuote = true;
      } else field += char;
    } else if (char === ",") finishField();
    else if (char === "\n" || char === "\r") {
      finishField();
      rows.push(row);
      row = [];
      if (char === "\r" && source[index + 1] === "\n") index += 1;
    } else if (closedQuote || (char === '"' && field.length)) {
      throw new Error(`Malformed CSV quote at character ${index + 1}.`);
    } else if (char === '"') quoted = true;
    else field += char;
  }
  if (quoted) throw new Error("Malformed CSV: unterminated quoted field.");
  if (field.length || row.length || closedQuote) {
    finishField();
    rows.push(row);
  }
  const [headers, ...records] = rows;
  if (!headers?.length || headers.some((header) => !header.trim())) throw new Error("CSV headers must be nonempty.");
  if (new Set(headers).size !== headers.length) throw new Error("Duplicate CSV headers.");
  return records.map((record, index) => {
    if (record.length !== headers.length) {
      throw new Error(`CSV column mismatch in record ${index + 1}: expected ${headers.length}, got ${record.length}.`);
    }
    return Object.fromEntries(headers.map((header, column) => [header, record[column]]));
  });
}
