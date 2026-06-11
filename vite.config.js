import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'




// https://vite.dev/config/
export default defineConfig({
  plugins: [react() ,  tailwindcss()],
})
                















// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react() ,  tailwindcss()],
//   server: {
//     // Enable polling for file watcher - fixes Windows file watching issues
//     watch: {
//       usePolling: true,
//       interval: 100,
//     },
//     // Configure server host properly for Windows
//     host: true,
//     port: 5173,
//     strictPort: false,
//     // Allow serving files from the project directory
//     fs: {
//       allow: ['..'],
//     },
//   },
//   // Ensure proper build optimization
//   build: {
//     sourcemap: true,
//   },
// })