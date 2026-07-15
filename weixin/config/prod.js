module.exports = {
  mini: {},
  h5: {
    /**
     * WebpackChain 插件配置
     * @docs https://docs.taro.zone/docs/webpack-chain
     */
    /**
     * 如果 h5 端首屏加载时间过长，可以使用 SplitChunksPlugin 进行优化
     */
    webpackChain(chain) {
      chain.merge({
        optimization: {
          splitChunks: {
            cacheGroups: {
              vendors: {
                name: "vendors",
                minChunks: 2,
                priority: 1,
              },
            },
          },
        },
      });
    },
  },
};
