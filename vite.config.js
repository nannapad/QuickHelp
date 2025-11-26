import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/QuickHelp/",
  plugins: [
    react(),
    // Bundle analyzer for development
    mode === "analyze" &&
      visualizer({
        filename: "dist/stats.html",
        open: true,
      }),
  ].filter(Boolean),

  // Bundle optimization
  build: {
    // Generate source maps for production debugging
    sourcemap: process.env.NODE_ENV === "development",

    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          vendor: ["react", "react-dom", "react-router-dom"],

          // UI components
          ui: [
            "./src/components/ManualCard.jsx",
            "./src/components/SearchBar.jsx",
            "./src/components/NavBar.jsx",
          ],

          // Utilities
          utils: [
            "./src/utils/translations.js",
            "./src/utils/dataUtils.js",
            "./src/utils/fileUtils.js",
          ],
        },
      },
    },

    // Compression and optimization
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === "production",
        drop_debugger: true,
      },
    },
  },

  // Development optimizations
  server: {
    hmr: {
      overlay: false,
    },
  },

  // Path resolution
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@pages": resolve(__dirname, "./src/pages"),
      "@utils": resolve(__dirname, "./src/utils"),
      "@data": resolve(__dirname, "./src/data"),
      "@contexts": resolve(__dirname, "./src/contexts"),
    },
  },

  // CSS optimizations
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
}));
