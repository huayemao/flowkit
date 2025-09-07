// vite.config.ts
import { defineConfig } from "file:///C:/Users/huaye/workspace/apps/flowkit/packages/auto-trim-image/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/huaye/workspace/apps/flowkit/node_modules/@vitejs/plugin-react/dist/index.js";
import dts from "file:///C:/Users/huaye/workspace/apps/flowkit/packages/auto-trim-image/node_modules/vite-plugin-dts/dist/index.mjs";
import { viteStaticCopy } from "file:///C:/Users/huaye/workspace/apps/flowkit/node_modules/vite-plugin-static-copy/dist/index.js";
var libConfig = defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true
    }),
    viteStaticCopy({
      targets: [
        {
          src: "src/i18n/locales",
          dest: "i18n"
        }
      ]
    })
  ],
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "AutoTrimImage",
      formats: ["es"],
      fileName: "index"
    },
    rollupOptions: {
      external: ["react", "react-dom", "lucide-react", "@flowkit/shared-ui"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "lucide-react": "LucideReact",
          "@flowkit/shared-ui": "SharedUI"
        }
      }
    },
    cssCodeSplit: false
  }
});
var appConfig = defineConfig({
  plugins: [
    react()
  ],
  build: {
    outDir: "dist-demo",
    rollupOptions: {
      input: "./index.html"
    }
  }
});
var vite_config_default = libConfig;
export {
  appConfig,
  vite_config_default as default,
  libConfig
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxodWF5ZVxcXFx3b3Jrc3BhY2VcXFxcYXBwc1xcXFxmbG93a2l0XFxcXHBhY2thZ2VzXFxcXGF1dG8tdHJpbS1pbWFnZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcaHVheWVcXFxcd29ya3NwYWNlXFxcXGFwcHNcXFxcZmxvd2tpdFxcXFxwYWNrYWdlc1xcXFxhdXRvLXRyaW0taW1hZ2VcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2h1YXllL3dvcmtzcGFjZS9hcHBzL2Zsb3draXQvcGFja2FnZXMvYXV0by10cmltLWltYWdlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcclxuaW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgeyB2aXRlU3RhdGljQ29weSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN0YXRpYy1jb3B5J1xyXG5cclxuLy8gXHU1RTkzXHU2QTIxXHU1RjBGXHU5MTREXHU3RjZFXHJcbmV4cG9ydCBjb25zdCBsaWJDb25maWcgPSBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCkgYXMgUGx1Z2luT3B0aW9uLFxyXG4gICAgZHRzKHtcclxuICAgICAgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSxcclxuICAgIH0pLFxyXG4gICAgdml0ZVN0YXRpY0NvcHkoe1xyXG4gICAgICB0YXJnZXRzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgc3JjOiAnc3JjL2kxOG4vbG9jYWxlcycsXHJcbiAgICAgICAgICBkZXN0OiAnaTE4bidcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0pIGFzIFBsdWdpbk9wdGlvblxyXG4gIF0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIGxpYjoge1xyXG4gICAgICBlbnRyeTogJy4vc3JjL2luZGV4LnRzJyxcclxuICAgICAgbmFtZTogJ0F1dG9UcmltSW1hZ2UnLFxyXG4gICAgICBmb3JtYXRzOiBbJ2VzJ10sXHJcbiAgICAgIGZpbGVOYW1lOiAnaW5kZXgnLFxyXG4gICAgfSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgZXh0ZXJuYWw6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ2x1Y2lkZS1yZWFjdCcsICdAZmxvd2tpdC9zaGFyZWQtdWknXSxcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgZ2xvYmFsczoge1xyXG4gICAgICAgICAgcmVhY3Q6ICdSZWFjdCcsXHJcbiAgICAgICAgICAncmVhY3QtZG9tJzogJ1JlYWN0RE9NJyxcclxuICAgICAgICAgICdsdWNpZGUtcmVhY3QnOiAnTHVjaWRlUmVhY3QnLFxyXG4gICAgICAgICAgJ0BmbG93a2l0L3NoYXJlZC11aSc6ICdTaGFyZWRVSScsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBjc3NDb2RlU3BsaXQ6IGZhbHNlLFxyXG4gIH0sXHJcbn0pXHJcblxyXG4vLyBcdTVFOTRcdTc1MjhcdTZBMjFcdTVGMEZcdTkxNERcdTdGNkVcclxuZXhwb3J0IGNvbnN0IGFwcENvbmZpZyA9IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSBhcyBQbHVnaW5PcHRpb24sXHJcbiAgXSxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiAnZGlzdC1kZW1vJyxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgaW5wdXQ6ICcuL2luZGV4Lmh0bWwnLFxyXG4gICAgfSxcclxuICB9LFxyXG59KVxyXG5cclxuLy8gXHU5RUQ4XHU4QkE0XHU1QkZDXHU1MUZBXHU1RTkzXHU2QTIxXHU1RjBGXHJcbmV4cG9ydCBkZWZhdWx0IGxpYkNvbmZpZyJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFgsU0FBUyxvQkFBb0I7QUFDelosT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUVoQixTQUFTLHNCQUFzQjtBQUd4QixJQUFNLFlBQVksYUFBYTtBQUFBLEVBQ3BDLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLElBQUk7QUFBQSxNQUNGLGtCQUFrQjtBQUFBLElBQ3BCLENBQUM7QUFBQSxJQUNELGVBQWU7QUFBQSxNQUNiLFNBQVM7QUFBQSxRQUNQO0FBQUEsVUFDRSxLQUFLO0FBQUEsVUFDTCxNQUFNO0FBQUEsUUFDUjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixTQUFTLENBQUMsSUFBSTtBQUFBLE1BQ2QsVUFBVTtBQUFBLElBQ1o7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxTQUFTLGFBQWEsZ0JBQWdCLG9CQUFvQjtBQUFBLE1BQ3JFLFFBQVE7QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLE9BQU87QUFBQSxVQUNQLGFBQWE7QUFBQSxVQUNiLGdCQUFnQjtBQUFBLFVBQ2hCLHNCQUFzQjtBQUFBLFFBQ3hCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWM7QUFBQSxFQUNoQjtBQUNGLENBQUM7QUFHTSxJQUFNLFlBQVksYUFBYTtBQUFBLEVBQ3BDLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0Y7QUFDRixDQUFDO0FBR0QsSUFBTyxzQkFBUTsiLAogICJuYW1lcyI6IFtdCn0K
