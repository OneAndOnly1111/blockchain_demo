const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: ['babel-polyfill', './src/index.js'],
	output: {
		filename: 'js/bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'), //告诉服务器从哪里提供内容。
		historyApiFallback: true, //任意的 404 响应都可能需要被替代为 index.html
		compress: true, //启用gzip 压缩
		host: '0.0.0.0', //服务外部也可访问
		port: 8081,
		proxy: [{
			context: ["/a/users", "/a/videos", "/a/transaction", "/a/record/user", "/a/record/transaction", "/a/record/videos"],
			target: "http://47.96.188.88:8080/", //http://hia.bchain.entropycode.com/
			pathRewrite: { "^/a": "" },
		}, {
			context: ["/b/users", "/b/videos", "/b/transaction", "/b/record/user", "/b/record/transaction", "/b/record/videos"],
			target: "http://47.96.188.88:8080/",
			pathRewrite: { "^/b": "" },
		}, {
			context: ["/c/users", "/c/videos", "/c/transaction", "/c/record/user", "/c/record/transaction", "/c/record/videos"],
			target: "http://47.96.188.88:8080/",
			pathRewrite: { "^/c": "" },
		}, {
			context: ["/action.do"],
			target: 'http://47.96.188.88:8989/', // http://cms.bchain.entropycode.com/
		}, {
			context: ["/oss"],
			target: 'http://test-zxy-yunshang.oss-cn-beijing.aliyuncs.com/',
			changeOrigin: true,
		}],
	},
	module: {
		rules: [{
			test: /\.js$/,
			use: [{
				loader: 'babel-loader',
			}],
			include: path.resolve(__dirname, 'src'),
			exclude: path.resolve(__dirname, 'node_modules'), //绝对路径 exclude代表不去解析这个目录下的.js文件
		}, {
			test: /\.css$/,
			use: [
				'style-loader', {
					loader: 'css-loader',
					options: {
						importLoaders: 1
					}
				}, {
					loader: 'postcss-loader',
					options: {
						ident: 'postcss',
						plugins: [
							require('autoprefixer')({ //处理CSS前缀问题，自动添加前缀
								broswer: 'last 5 versions'
							}),
						]
					}
				}
			],
		}, {
			test: /\.less$/,
			exclude: path.resolve(__dirname, 'src/styles'),
			use: [{
				loader: 'style-loader'
			}, {
				loader: 'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]'
			}, {
				loader: 'postcss-loader',
				options: {
					ident: 'postcss',
					plugins: [
						require('autoprefixer')({ //处理CSS前缀问题，自动添加前缀
							broswer: 'last 5 versions'
						}),
					]
				}
			}, {
				loader: 'less-loader'
			}]
		}, {
			test: /\.less$/,
			include: path.resolve(__dirname, 'src/styles'), //解决全局样式与局部样式共存的问题
			use: [{
				loader: 'style-loader'
			}, {
				loader: 'css-loader'
			}, {
				loader: 'postcss-loader',
				options: {
					ident: 'postcss',
					plugins: [
						require('autoprefixer')({ //处理CSS前缀问题，自动添加前缀
							broswer: 'last 5 versions'
						}),
					]
				}
			}, {
				loader: 'less-loader'
			}]
		}, {
			test: /\.(png|jpg|jpeg|gif|svg|ico)$/i,
			use: [{
				loader: 'url-loader',
				options: {
					limit: 1000, //小于这个大小的图片将被base64编码
					name: 'assets/[name]-[hash:5].[ext]' //制定打包后的路径及名字
				}
			}, {
				loader: 'image-webpack-loader', //压缩图片 配合url-loader或file-loader使用
			}]
		}]
	},
	plugins: [
		new htmlWebpackPlugin({
			template: path.resolve(__dirname, './src/index.html'),
			filename: 'index.html',
			inject: 'body',
			title: '控制台'
		})
	]
}