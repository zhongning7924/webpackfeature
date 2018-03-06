var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js'
    },
    module: {
        rules:[ 
            {   
                test: /\.(js|jsx)$/,
                // exclude: /node_modules/,
                include:[   path.resolve(__dirname,'src'),
                        path.resolve(__dirname,'../fe_common')
                    ],
                use: {
                    loader: 'babel-loader',
                    options: {
                       //引入了第三方文件,如要下面的写法
                        // babelrc: true,
                        presets: [
                            require.resolve('babel-preset-react'),
                            [   require.resolve('babel-preset-es2015'),
                                { "modules": false }
                            ],
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
                loader:'file-loader?name=img/[name].[ext]',
            },
            {
                test: /\.css$/,
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
    //线上需要调试时候开启
    // devtool: 'inline-source-map',

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
   
   
};