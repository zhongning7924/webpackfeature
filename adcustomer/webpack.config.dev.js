var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
// process.traceDeprecation = false
module.exports = {
    entry: {
        main:'./src/index.js',
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js'
    },
    module: {
        rules:[ 
            {   
                test: /\.(js|jsx)$/,
                include:[   path.resolve(__dirname,'src'),
                            path.resolve(__dirname,'../fe_common')
                        ],
                // exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                       //引入了第三方文件,如要下面的写法
                        // babelrc: true,
                        presets: [
                        require.resolve('babel-preset-react'),
                        [   require.resolve('babel-preset-es2015'),
                            { "modules": false }],
                            require.resolve('babel-preset-stage-0')
                        ]
                       
                    }
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.(jpg|jpeg|gif|png|ico)$/,
                loader:'file-loader?name=img/[path][name].[ext]',
            },
            {
                test: /\.(css|less)$/,
                use: [ 'style-loader', 'css-loader' ]
            }
        ]
    },
    resolve: {
        //文件解析的先后顺序
        modules:[ path.join(__dirname, 'node_modules'),
                  path.join(__dirname, 'src'),
                  path.join(__dirname, 'src/components'),
                ],
        extensions: [".js", ".json", ".jsx", ".css"],
        alias: {
            containers: path.resolve(__dirname, 'src/containers'),
            components: path.resolve(__dirname,'src/components'),
            constants: path.resolve(__dirname,'src/constants'),
            reducers: path.resolve(__dirname,'src/reducers'),
            styles: path.resolve(__dirname,'src/styles'),
            actions: path.resolve(__dirname,'src/actions'),
            utils: path.resolve(__dirname,'src/utils'),
            common: path.resolve(__dirname,'../fe_common'),
        },

    },
    cache: true,

    plugins: [
        new HtmlWebpackPlugin({
          title: '客户信息管理',
          filename: 'index.html',
          // template: './src/index.html',
          inject: 'body',
          favicon: '../fe_common/images/icon.ico',
          hash: true,
        }),
        new webpack.DefinePlugin({
            'systemname': '"客户信息管理"',
            'homepathurl': '"/app/#/home/welcome"'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
        // ["import", { "libraryName": "antd", "style": "css" }],

    ],   
    devtool: 'inline-source-map',
    devServer: {
        proxy: {
          '/app/index.php*': {
              target: 'http://test.admin.appstore.smartisan.com',
              changeOrigin: 'http://test.admin.appstore.smartisan.com',
              // secure: false,
          },
        // '/api-app.smartisan.com/app/*': {
        //       target: 'http://git-pro.kongxiangdong.user.smartisan.com',
        //       changeOrigin: 'https://test-admin.smartisan.com',
        //       // secure: false,
        //   },

        },
        host: '0.0.0.0',
        port: 8892,
        hot: true,
        inline: true, 
        // mode: 'development',
        // // historyApiFallback: true, 
        contentBase: 'build', // boolean | string | array, static file location
        // compress: true, // enable gzip compression
        // historyApiFallback: true, // true for index.html upon 404, object for multiple paths
        // hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
        // https: false, // true for self-signed, object for cert authority
        // noInfo: true, // only errors & warns on hot reload

    },
};