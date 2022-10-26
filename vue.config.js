const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
// module.exports = {
//   publicPath: process.env.NODE_ENV == 'production' ? './' : '', // 部署应用时的根路径(默认'/'),也可用相对路径(存在使用限制)cli3.0以上使用publicPath替代baseUrl,解决build后找不到静态资源的问题
//   runtimeCompiler: process.env.NODE_ENV == 'production' ? false : true, //是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
//   outputDir: process.env.NODE_ENV == 'production' ? 'dist' : 'dist', // 运行时生成的生产环境构建文件的目录(默认''dist''，构建之前会被清除)
//   assetsDir: 'assets', //放置生成的静态资源(s、css、img、fonts)的(相对于 outputDir 的)目录(默认'')
//   indexPath: 'index.html', //指定生成的 index.html 的输出路径(相对于 outputDir)也可以是一个绝对路径。
//   filenameHashing: true,
//   lintOnSave: true, // 是否在保存的时候检查
//   productionSourceMap: false, // 生产环境是否生成 sourceMap 文件,如果你不需要生产环境的 source map,可以将其设置为 false 以加速生产环境构建
//   devServer: {
//     //所有 webpack-dev-server 的选项都支持。
//     disableHostCheck: true,
//     host: '0.0.0.0', //localhost
//     port: 8080,
//     https: false,
//     hotOnly: false,
//     open: true, //配置自动启动浏览器
//     overlay: {
//       //配置eslint报错的级别
//       // warnings: true,
//       // error: true
//     },
//     proxy: {
//       // 配置多个代理(配置一个 proxy: 'http://localhost:4000' // 本地模拟数据服务器)
//       // "/dd": {
//       //     target: "http://10.66.88.27:8088/",
//       //     ws: true,
//       //     changeOrigin: true
//       // },
//       // "/dd": {
//       //   target: "http://10.66.90.8:8088/",//10.64.90.46
//       //   ws: true,
//       //   changeOrigin: true
//       // },
//       '/dd': {
//         target: 'https://direct.view.cn', //431
//         ws: true,
//         changeOrigin: true
//       }
//     }
//   },
//   css: {}
// }
