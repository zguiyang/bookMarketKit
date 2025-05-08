import tailwindcssVite from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src/',
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxt/image',
    // '@nuxt/content',
    // '@nuxt/test-utils',
    '@vueuse/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'system',
    fallback: 'dark',
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  vite: {
    plugins: [tailwindcssVite()],
  },
});
