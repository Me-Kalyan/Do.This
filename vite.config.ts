import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            },
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'Do.This',
                short_name: 'Do.This',
                description: 'The Intelligent Life OS for Tasks, Memory, and Daily Flow',
                theme_color: '#18181b', // zinc-900
                background_color: '#18181b',
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@store': path.resolve(__dirname, './src/store'),
            '@styles': path.resolve(__dirname, './src/styles'),
            '@lib': path.resolve(__dirname, './src/lib'),
            '@api': path.resolve(__dirname, './src/api'),
            '@assets': path.resolve(__dirname, './src/assets'),
        },
    },
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Firebase - split into its own chunk
                    if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
                        return 'firebase'
                    }
                    // React core
                    if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
                        return 'react'
                    }
                    // React ecosystem (router, etc)
                    if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) {
                        return 'react-router'
                    }
                    // Animation libraries
                    if (id.includes('node_modules/framer-motion')) {
                        return 'framer-motion'
                    }
                    // UI components (Radix)
                    if (id.includes('node_modules/@radix-ui')) {
                        return 'radix-ui'
                    }
                    // Other vendor libraries
                    if (id.includes('node_modules')) {
                        return 'vendor'
                    }
                },
            },
        },
    },
})
