const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
module.exports = {
    entry: './src/index.js', // 以我们的src的index.js 作为入口进行打包
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'source-map',// 可以产生source-map
    resolve: { //  更改解析模板查找方式
        modules: [path.resolve(__dirname, 'source'), path.resolve('node_modules')]
    },
    plugins: [
        new HtmlPlugin({
            template: path.resolve(__dirname, './app.html')
        })
    ]

}
