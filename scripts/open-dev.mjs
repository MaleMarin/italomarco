#!/usr/bin/env node
/**
 * Abre la URL del dev server en el navegador predeterminado (macOS / Windows / Linux).
 */
import { execSync } from "node:child_process";

const url = process.env.DEV_URL ?? "http://localhost:3052";
const platform = process.platform;

try {
  if (platform === "darwin") {
    execSync(`open "${url}"`, { stdio: "inherit" });
  } else if (platform === "win32") {
    execSync(`start "" "${url}"`, { shell: "cmd.exe", stdio: "inherit" });
  } else {
    execSync(`xdg-open "${url}"`, { stdio: "inherit" });
  }
} catch (e) {
  console.error("No se pudo abrir el navegador. Abre manualmente:", url);
  process.exit(1);
}
