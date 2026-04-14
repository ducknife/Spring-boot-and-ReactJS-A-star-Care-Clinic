import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const EMAILJS_SERVICE_ID =
  process.env.VITE_EMAILJS_SERVICE_ID ||
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
  process.env.EMAILJS_SERVICE_ID ||
  ''

const EMAILJS_TEMPLATE_ID =
  process.env.VITE_EMAILJS_TEMPLATE_ID ||
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
  process.env.EMAILJS_TEMPLATE_ID ||
  ''

const EMAILJS_PUBLIC_KEY =
  process.env.VITE_EMAILJS_PUBLIC_KEY ||
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
  process.env.EMAILJS_PUBLIC_KEY ||
  ''

// https://vite.dev/config/
export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_', 'EMAILJS_'],
  define: {
    'import.meta.env.VITE_EMAILJS_SERVICE_ID': JSON.stringify(EMAILJS_SERVICE_ID),
    'import.meta.env.VITE_EMAILJS_TEMPLATE_ID': JSON.stringify(EMAILJS_TEMPLATE_ID),
    'import.meta.env.VITE_EMAILJS_PUBLIC_KEY': JSON.stringify(EMAILJS_PUBLIC_KEY),
  },
  plugins: [react(),
    tailwindcss(),
  ],
})
