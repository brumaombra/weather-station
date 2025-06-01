import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
    ssr: true,

    runtimeConfig: {
        // Database connection
        mysqlIp: process.env.MYSQL_IP || '',
        mysqlPort: process.env.MYSQL_PORT || '',
        mysqlUser: process.env.MYSQL_USER || '',
        mysqlPassword: process.env.MYSQL_PASSWORD || '',
        mysqlDatabase: process.env.MYSQL_DATABASE || '',
        logQueries: process.env.LOG_QUERIES || '',

        // Auth token
        authToken: process.env.AUTH_TOKEN || '',

        // Public runtime config
        public: {
            nodeEnv: process.env.NODE_ENV || 'development',
            buildtime: process.env.BUILDTIME || 'false',

            // Firebase
            firebaseApiKey: process.env.FIREBASE_API_KEY || '',
            firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
            firebaseProjectId: process.env.FIREBASE_PROJECT_ID || ''
        }
    },

    app: {
        head: {
            title: 'Weather Station'
        }
    },

    routeRules: {
        '/**': { ssr: true, prerender: true }
    },

    css: ['~/assets/css/main.css'],

    vite: {
        plugins: [
            tailwindcss()
        ]
    },

    compatibilityDate: '2024-11-01'
});