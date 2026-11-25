import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'node:child_process';
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { viteSingleFile } from "vite-plugin-singlefile";
import { VitePWA } from "vite-plugin-pwa";
import packageConfig from "./package.json";

const configFile = existsSync(resolve("config.local.ts"))
  ? resolve("config.local.ts")
  : resolve("config.default.ts");

let __MODIFIED__ = "";

try {
  __MODIFIED__ = process.platform === "win32" 
    ? execSync('git status --porcelain --untracked-files=yes | find /c /v ""').toString()
    : execSync("git status --porcelain --untracked-files=yes | wc -l").toString()
} catch {
  console.error("Modified execSync failed")
} 

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@staticConfig": configFile
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    viteSingleFile(),
    VitePWA({
      workbox: {
        globPatterns: ["**/*"],
        maximumFileSizeToCacheInBytes: 2**32
      },
      includeAssets: [
        "**/*",
      ],
      manifest: {
        "theme_color": "#00FFFF",
        "background_color": "#000000",
        "display": "standalone",
        "scope": "/",
        "start_url": "/",
        "short_name": "Paper",
        "description": "Parts And Production Electronic Resource",
        "name": "Paper",
        "icons": [
          {
            "src": "/favicon.svg",
            "sizes": "192x192",
            "type": "image/svg"
          },
          {
            "src": "/favicon.svg",
            "sizes": "256x256",
            "type": "image/svg"
          },
          {
            "src": "/favicon.svg",
            "sizes": "384x384",
            "type": "image/svg"
          },
          {
            "src": "/favicon.svg",
            "sizes": "512x512",
            "type": "image/svg"
          }
        ],
      },
    })
  ],
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().getTime()),
    __GIT_HASH__: JSON.stringify(
      execSync("git rev-parse --short HEAD").toString().trim()
    ),
    __MODIFIED__: JSON.stringify(__MODIFIED__.trim()),
    __VERSION__: JSON.stringify(packageConfig.version)
  },
})
