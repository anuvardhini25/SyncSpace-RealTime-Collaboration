import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "monaco-editor/esm/vs/editor/editor.api.js": fileURLToPath(
        new URL("./node_modules/monaco-editor/esm/vs/editor/editor.api.js", import.meta.url)
      ),
    },
  },
});
