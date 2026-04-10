import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Must match the repo name for GitHub Pages to serve assets from /igr-datagrid-treegrid/
  base: '/igr-datagrid-treegrid/',
})
