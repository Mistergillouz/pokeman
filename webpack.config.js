var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');

var webpack = require('webpack');

module.exports = {

    entry: path.resolve(__dirname, './src/index.jsx'),
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'build'), 
        filename: 'bundle.js'
    },

    devServer: {
        host: '0.0.0.0',
        historyApiFallback: true,
        port: 9000
    },

    resolve: {
        modules: ['node_modules', './src'],
        extensions: ['.js', '.jsx']
    },

    plugins: [],

    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader'
            },
            { 
                test: /node_modules\/jquery\/.+\.(jsx|js)$/,
                loader: 'imports-loader?jQuery=jquery,$=jquery,this=>window'
            },
            { 
                test: /\.css$/, 
                loader: 'style-loader!css-loader'
            },
            { 
                test: /\.(png|jpg|gif)$/, 
                loader: 'file-loader?name=images/[name].[ext]',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/images/'
                }
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?mimetype=application/vnd.ms-fontobject'
            },
            {
                test: /\.woff/,
                loader: 'url-loader?mimetype=application/font-woff'
            }, {
                test: /\.woff2/,
                loader: 'url-loader?mimetype=application/font-woff2'
            },
            { 
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?mimetype=application/x-font-ttf'
            },
            { 
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            }
        ],
        noParse: [pathToReact]
  },
};