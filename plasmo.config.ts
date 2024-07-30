import type { PlasmoConfig } from "plasmo"

export const config: PlasmoConfig = {
  manifest: {
    name: "Raydium Info",
    description: "Browser extension for Raydium information",
    version: "0.0.1",
    host_permissions: ["https://api-v3.raydium.io/*"],
    options_ui: {
      page: "options.html",
      open_in_tab: true
    }
  }
}
