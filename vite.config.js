import basicSsl from '@vitejs/plugin-basic-ssl'
export default {
    root: 'src',
    build: {
        outDir: '../dist'
    },
    plugins: [
        basicSsl()
    ]
}