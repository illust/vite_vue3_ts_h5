import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'
import components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import autoImport from 'unplugin-auto-import/vite'

import postcsspxtoviewport from 'postcss-px-to-viewport'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueSetupExtend(),
    components({
      resolvers: [VantResolver()],
    }),
    autoImport({
      resolvers: [VantResolver()],
    }),
    // gzip压缩 生产环境生成.gz文件
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/style/main.scss";',
      },
    },
    postcss: {
      plugins: [
        postcsspxtoviewport({
          unitToConvert: 'px', // 要转化的单位
          viewportWidth: 375, // UI设计稿的宽度
          unitPrecision: 6, // 转换后的精度，即小数点位数
          propList: ['*'], // 指定转换的css属性单位，*代表全部css属性的单位都要进行转换
          viewportUnit: 'vw', // 指定需要转化成的视窗单位，默认vw
          fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
          selectorBlackList: ['van-'], // 指定不转换为视窗单位的类名，例如van- (vantUI组件)
          minPixelValue: 1, // 默认为1，小于或等于1则不进行转换
          mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
          replace: true, // 是否转换后直接更换属性值
          exclude: [], // 设置忽略文件，用正则做目录名匹配，最好不要排除node_modules 文件，排除后在项目中会发现字体不能跟随页面放大
        }),
      ],
    },
  },
  // 启动服务配置
  server: {
    port: 8088,
    open: true,
    https: false,
    proxy: {},
  },
  // 生产环境打包配置
  // 去除console debugger
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
