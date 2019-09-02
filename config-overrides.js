//在antd的官网上有相关配置的介绍
const {override, fixBabelImports, addLessLoader} = require('customize-cra');
module.exports = override(
  //实现按需打包
  fixBabelImports('import',
    {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true, //自动打包相关的样式
    }
  ),

  //使用less-loader对源码中的less变量进行重新赋值
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {'@primary-color': '#1DA57A'},
  }),
);
