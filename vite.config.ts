import path from "path"; // <-- Import path
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This maps '@' to the 'src' directory relative to the project root
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
