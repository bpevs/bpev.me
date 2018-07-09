module.exports = {
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.(css|md)$/,
        loader: "emit-file-loader",
        options: {
          name: "dist/[path][name].[ext]"
        }
      },
      {
        test: /\.css$/,
        use: [ "babel-loader", "raw-loader", "postcss-loader" ]
      },
      {
        test: /\.md$/,
        loader: "raw-loader"
      }
    );

    return config
  }
}
