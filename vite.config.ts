import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'node:child_process';
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { viteSingleFile } from "vite-plugin-singlefile";
import packageConfig from "./package.json";

const configFile = existsSync(resolve("config.local.ts"))
  ? resolve("config.local.ts")
  : resolve("config.default.ts");

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
    viteSingleFile()
  ],
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().getTime()),
    __GIT_HASH__: JSON.stringify(
      execSync("git rev-parse --short HEAD").toString().trim()
    ),
    __MODIFIED__: JSON.stringify(
      execSync("git status --porcelain --untracked-files=yes | wc -l").toString().trim()
    ),
    __VERSION__: JSON.stringify(packageConfig.version)
  },
})
