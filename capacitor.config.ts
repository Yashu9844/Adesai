// @ts-ignore
import type { CapacitorConfig } from "@capacitor/cli";
import { existsSync, readFileSync } from "node:fs";

function readEnvValue(key: string) {
  if (process.env[key]) return process.env[key];
  if (!existsSync(".env")) return undefined;

  const env = readFileSync(".env", "utf8");
  const line = env
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(`${key}=`));

  return line?.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
}

const serverUrl = readEnvValue("CAPACITOR_SERVER_URL");

const config: CapacitorConfig = {
  appId: "com.srisaibaba.toolrental",
  appName: "Srisaibaba Hardware",
  webDir: "www",
  backgroundColor: "#fdfdff",
  android: {
    allowMixedContent: false,
  },
  plugins: {
    CapacitorSQLite: {
      androidIsEncryption: false,
    },
  },
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: false,
      }
    : undefined,
};

export default config;
