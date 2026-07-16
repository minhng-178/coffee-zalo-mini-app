const path = require("path");
const { UnifiedWebpackPluginV5: WeappTailwindcss } = require("weapp-tailwindcss/webpack");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const config = {
  projectName: "hdui-coffee-weixin",
  date: "2026-7-15",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: "src",
  outputRoot: "dist",
  plugins: [],
  defineConstants: {
    API_BASE_URL: JSON.stringify(
      process.env.API_BASE_URL || "http://localhost:8080"
    ),
  },
  copy: {
    patterns: [],
    options: {},
  },
  framework: "react",
  compiler: {
    type: "webpack5",
    prebundle: {
      enable: false,
    },
  },
  cache: {
    enable: false,
  },
  alias: {
    utils: path.resolve(__dirname, "..", "src", "utils"),
    types: path.resolve(__dirname, "..", "src", "types"),
    components: path.resolve(__dirname, "..", "src", "components"),
    static: path.resolve(__dirname, "..", "src", "static"),
    state: path.resolve(__dirname, "..", "src", "state"),
    hooks: path.resolve(__dirname, "..", "src", "hooks"),
  },
  sass: {
    resource: [],
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024,
        },
      },
      cssModules: {
        enable: false,
      },
    },
    webpackChain(chain) {
      chain.plugin("weapp-tailwindcss").use(WeappTailwindcss, [
        {
          appType: "taro",
          rem2rpx: true,
        },
      ]);
    },
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false,
      },
    },
    webpackChain(chain) {
      chain.plugin("weapp-tailwindcss").use(WeappTailwindcss, [
        {
          appType: "taro",
          // H5 runs in a real browser, which already understands Tailwind's
          // own escaped selectors (e.g. `.-top-\[2px\]`) — skip the
          // className/WXML rewriting this plugin does for WXSS safety, since
          // it mangles literal class strings (e.g. `-top-[2px]` ->
          // `-top-_b2px_B`) without a matching CSS rule, breaking layout.
          disabled: true,
        },
      ]);
    },
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
