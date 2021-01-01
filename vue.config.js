module.exports = {
    publicPath: '/greenpaint/',
    runtimeCompiler: true,
    pages: {
        index: {
            template: 'public/index.html'
        },
        demo: {
            entry: 'src/main.js',
            template: 'public/demo_puzzle.html'
        },
        custom: {
            entry: 'src/main.js',
            template: 'public/custom_puzzle.html'
        }
    }
}
