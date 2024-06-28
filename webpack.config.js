const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const imageminAvif = require("imagemin-avif");
const TerserPlugin = require('terser-webpack-plugin');
const { watch } = require('fs');


let cssLoaders = (extra) => {
    let loaders = [
        {
            loader:MiniCssExtractPlugin.loader,
        },
        "css-loader",
        "postcss-loader",
        "group-css-media-queries-loader",
    ];
    if(extra){
        loaders.push(extra);
    }
    return loaders;
}





module.exports = {
    //говорим где лежат все исзодники нашшего приложения
    context: path.resolve(__dirname, 'src'),
    // указываем режим разрабоотки проекта
    mode: 'development',
    entry: {
        main: './scripts/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "script/[name].[contenthash].js",
        clean: true,
    },

    resolve: {
        alias:{
            "@": path.resolve(__dirname, 'src'),
        },
    },

    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist/")
        },
        port: 4000,
        open: true,
        watchFiles: ["src/**/*.pug"],
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './index.pug'
        }),
        new MiniCssExtractPlugin({
            filename: "style/[name].css",
        }),
        new ImageminPlugin({
          test: /\.(jpe?g|png|gif|svg)$/i,
          plugins: [
            imageminAvif({
              quality: 50,
            })
          ]
        })
    ],
    optimization:{
      minimizer: [new TerserPlugin()],
    },
    module: {
        rules: [
          {
            // когда webpack видит любой файл html, неважно большой или маленькой буквой
            test: /\.html$/i,
            loader: "html-loader",
          },
          {
            test: /\.pug$/i,
            loader: "pug-loader",
          },
          {
            test: /\.css$/i,
            use: cssLoaders(),
          },
          {
            test: /\.s[ac]ss$/i,
            use: cssLoaders("sass-loader"),
          },
          {
            test: /\.(png|jpg|jpeg|svg|gif|webp|avif)$/i,
            //  type: "asset/resource" --- специальный обработчик webpack для картинок и шрифтов А [ext] это все расширения
            type: "asset/resource",
            generator: {
              filename: "images/[name][hash][ext]",
            },
          },
          {
            test: /\.(ttf|woff|woff2|eot)$/i,
            generator: {
              filename: "fonts/[name][hash][ext]",
            },
          },
          {
            // babel-loader --- это загрузчик для webpack который меняет из современного js на старый js
            test: /\.js$/i,
            loader: "babel-loader",
            exclude: /node-modules/,
          },
        ],
      },
}