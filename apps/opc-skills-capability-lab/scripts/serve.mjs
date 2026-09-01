import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(appDir, "dist");
const host = "127.0.0.1";
const port = Number(process.env.OPC_LAB_PORT || 8791);
const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
]);

http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${host}:${port}`);
  const relative = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
  const target = path.resolve(distDir, relative);
  const inside = path.relative(distDir, target);
  if (inside.startsWith("..") || path.isAbsolute(inside)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const info = await stat(target);
    const filePath = info.isDirectory() ? path.join(target, "index.html") : target;
    const body = await readFile(filePath);
    response.writeHead(200, { "Content-Type": types.get(path.extname(filePath)) || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404).end("Not found");
  }
}).listen(port, host, () => process.stdout.write(`OPC Skills Capability Lab: http://${host}:${port}\n`));
