const path = require("path");
const htmlWebpack = require("html-webpack-plugin");

module.exports = async ({ config, mode }) => {
  return {
    ...config,
    // module: {
    //   ...config.module,
    //   rules: [
    //     ...config.module.rules,
    //     {
    //       test: /\.(css|scss|sass)$/,
    //       use: ["style-loader", "css-loader",
    //         "sass-loader"
    //       ]
    //     }
    //   ]
    // },

    resolve: {
          ...config.resolve,
          modules: [path.resolve(__dirname, "../src"), ...config.resolve.modules]
        }
  };
  };
