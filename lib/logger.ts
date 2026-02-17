const DEBUG_ENABLED =
  process.env.DEBUG === "true" || process.env.NEXT_PUBLIC_DEBUG === "true";

const PREFIX = "[xenastore]";

type LogMeta = Record<string, string | number | boolean | undefined>;

function formatMeta(meta?: LogMeta): string {
  if (!meta) {
    return "";
  }

  const parts = Object.entries(meta)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${String(value)}`);

  return parts.length > 0 ? ` ${parts.join(" ")}` : "";
}

function emit(level: "info" | "warn" | "error", event: string, meta?: LogMeta): void {
  if (!DEBUG_ENABLED) {
    return;
  }

  const message = `${PREFIX} ${event}${formatMeta(meta)}`;
  if (level === "info") {
    console.info(message);
    return;
  }
  if (level === "warn") {
    console.warn(message);
    return;
  }
  console.error(message);
}

export const logger = {
  info: (event: string, meta?: LogMeta): void => emit("info", event, meta),
  warn: (event: string, meta?: LogMeta): void => emit("warn", event, meta),
  error: (event: string, meta?: LogMeta): void => emit("error", event, meta),
};
