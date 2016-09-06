module.exports = {
    entry: ["babel-polyfill", "./src/app/js/index.js"],
    output: {
        path: "./src",
        filename: "bundle.js"
    },
    devServer: {
        inline: true,
        contentBase: "./src",
        port: 8080
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.(png|gif|jpg|jpeg)$/,
                loader: 'file-loader'
            },
            {
                test: /Cesium\.js$/,
                loader: 'script'
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/, /Cesium\.js$/],
                loader: 'babel'
            },
            {
                test: /\.json$/,
                loader: "json"
            }
        ]
    }
}
