module.exports = {
  devtool: 'source-map',
  entry: ['babel-polyfill', './carousel-element.js'],
  output: {
    path: './',
    filename: 'result.js',
  },
  watch: true,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
}