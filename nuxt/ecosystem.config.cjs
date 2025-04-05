module.exports = {
    apps: [
        {
            name: 'station',
            exec_mode: 'cluster',
            instances: 1,
            script: './server/index.mjs',
            env: {
                NODE_ENV: 'production',
                NITRO_PORT: 3000
            },
            log_file: './logs.log',
            merge_logs: true,
            time: true
        }
    ]
}