export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function parseCommaList(input: string): string[] {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseLineList(input: string): string[] {
  return input
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseKvLines(input: string): Array<{ key: string; value: string }> {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [key, ...rest] = line.split(":");
      return {
        key: key?.trim() ?? "",
        value: rest.join(":").trim(),
      };
    })
    .filter((row) => row.key && row.value);
}

export function parseDefectLines(
  input: string
): Array<{ title: string; description: string; severity?: string }> {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title = "", description = "", severity = ""] = line.split("|").map((part) => part.trim());
      return {
        title,
        description,
        severity: severity || undefined,
      };
    })
    .filter((row) => row.title && row.description);
}

export function toKvLines(entries: Array<{ key: string; value: string }> | null | undefined): string {
  return (entries ?? []).map((entry) => `${entry.key}: ${entry.value}`).join("\n");
}

export function toDefectLines(
  entries: Array<{ title: string; description: string; severity?: string }> | null | undefined
): string {
  return (entries ?? [])
    .map((entry) => `${entry.title}|${entry.description}|${entry.severity ?? ""}`)
    .join("\n");
}
