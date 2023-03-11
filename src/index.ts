import fs from "fs";
import path from "path";
import webpack from "webpack";
import { Configuration } from "webpack";
import nodeExternals from "webpack-node-externals";

const runtimeEntry = path.resolve(__dirname, "../runtime/index.js");

class MixWebpackPlugin {
  private options: { handler: string };

  constructor(options) {
    this.options = options;
  }

  apply(compiler: webpack.Compiler) {
    const nodeScriptPath = path.resolve(this.options.handler);

    compiler.options.devServer = {
      ...compiler.options.devServer,
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error("webpack-dev-server is not defined");
        }

        middlewares.push({
          name: "mix",
          path: "/",
          middleware: require(nodeScriptPath).handler,
        });

        return middlewares;
      },
    };

    if (!process.env.WEBPACK_SERVE) {
      compiler.hooks.afterEmit.tapAsync(
        "MixWebpackPlugin",
        (compilation, callback) => {
          const outputDir = compilation.options.output.path || "";

          const config: Configuration = {
            mode: "production",
            entry: runtimeEntry,
            output: {
              path: path.resolve(outputDir, "../build"),
              filename: "server.js",
            },
            resolve: {
              alias: {
                $handler_file: nodeScriptPath,
              },
            },
            target: "node",
            externals: [nodeExternals()],
          };

          const webpackCompiler = webpack(config);
          webpackCompiler.run((err, stats) => {
            if (err) {
              console.error(`Webpack compilation failed: ${err}`);
            } else if (stats?.hasErrors()) {
              console.error(`Webpack compilation failed`);
              console.error(stats.compilation.errors);
            } else {
              console.log(`Webpack compilation completed successfully.`);
            }
          });
        }
      );
    }
  }
}

export { MixWebpackPlugin };
