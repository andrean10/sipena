export default defineNuxtConfig({
    // Nuxt 4: tetap pakai struktur folder di root (tanpa folder app/)
    srcDir: '.',

    app: {
        head: {
            title: 'SIPENA | Kantor Wilayah Direktorat Jenderal Imigrasi Riau',
            titleTemplate: '%s | Kantor Wilayah Direktorat Jenderal Imigrasi Riau',
            htmlAttrs: {
                lang: 'id',
            },
            meta: [
                { charset: 'utf-8' },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no',
                },
                { hid: 'description', name: 'description', content: '' },
                { name: 'format-detection', content: 'telephone=no' },
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
            ],
        },
    },

    css: ['~/assets/css/main.css'],

    modules: ['@nuxt/ui'],

    vite: {
        
        server: {
            allowedHosts: ['.ngrok-free.dev'], // atau host lengkapnya
        },
    },

    router: {
        options: { linkExactActiveClass: 'active' },
    },

    runtimeConfig: {
        public: {
            supabaseUrl: '',
            supabaseKey: '',
        },
    },

    compatibilityDate: '2030-01-01',
});
