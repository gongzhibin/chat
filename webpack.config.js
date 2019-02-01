const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    // 环境
    mode: 'development',

    // 生成Source Maps，使调试更容易
    // eval-source-map只能在开发阶段使用
    // devtools: 'eval-source-map',

    // 唯一入口
    entry: path.resolve(__dirname, 'src/main.js'),
    // 出口
    output: {
        path: path.resolve(__dirname, 'dist'), // 打包后文件所在目录
        filename: 'index.js' // 文件名
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(path.resolve(__dirname, 'dist'))
    ],
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js',
            '@': path.resolve(__dirname, 'src')
        },
        // 引入文件可不加后缀
        extensions: ['.js', '.vue', '.json']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(gif|jpg|jpeg|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        name: 'name.[hash:6].[ext]'
                    }
                }
            }
        ]
    },

    // webpack本地服务器
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'), // 本地服务器所加载的页面所在目录
        historyApiFallback: true, // 不跳转
        inline: true, // 实时刷新
        compress: true, // 是否压缩
        host: '127.0.0.1',
        port: 9000
    }
};