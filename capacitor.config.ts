import type { CapacitorConfig } from "@capacitor/cli";

const serverUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: "com.srisaibaba.toolrental",
  appName: "Sri Sai Baba Tool Rental",
  webDir: "www",
  android: {
    allowMixedContent: false,
  },
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: false,
      }
    : undefined,
};

export default config;
