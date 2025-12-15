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
                // Simplified chunking - only split Firebase to reduce initial load
                // Let Vite handle React/Radix/etc. naturally to avoid initialization issues
                manualChunks: {
                    firebase: [
                        'firebase/app',
                        'firebase/auth',
                        'firebase/firestore'
                    ]
                }
            },
        },
    },
})
