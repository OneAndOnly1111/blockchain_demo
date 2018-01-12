const path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	//entry:'./src/script/main.js', //生成一个出口文件
	// entry:['./src/script/main.js','./src/script/a.js'], //生成一个出口文件
	entry: { //生成多个出口文件
		main: './src/script/main.js',
		a: './src/script/a.js',
		b: './src/script/a.js',
		c: './src/script/c.js',
	},
	output: {
		path: __dirname + '/dist',
		// path:path.resolve(__dirname,'./dist/js'), //定义打包以后文件所在路径 
		filename: 'js/[name]-[chunkhash].js', //定义打包以后的文件名 
		publicPath: 'http://10.100.3.15:8080', //指定绝对路径的地址  （满足上线需求）
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json'] //自动解析确定的扩展。默认值为：[".js", ".json"]
	},
	plugins: [
		//用htmlWebpackPlugin.options/files.obj 可获取里面的obj的值
		new htmlWebpackPlugin({ //指定打包后的index.html文件的模板，解决生成的hash文件名无法对应到实际index.html文件中的问题
			template: 'index.html',
			filename: 'index.html', //定义打包后的文件名
			inject: 'head', //定义脚本注入的位置 body/head  默认是body
			title: 'webpack is well~', //用htmlWebpackPlugin.options.title 可获取
			date: new Date(), //用htmlWebpackPlugin.options.date可获取
			minify: { //压缩
				removeComments: true, //删除注释
			},
			excludeChunks: ['a', 'b', 'c']
		}),
		new htmlWebpackPlugin({
			template: 'index.html',
			filename: 'a.html',
			inject: 'body',
			title: 'this is a.html',
			chunks: ['main', 'a'], //指定要关联的js文件
			// excludeChunks:['b','c']  //排除要关联的js文件
		}),
		new htmlWebpackPlugin({
			template: 'index.html',
			filename: 'b.html',
			inject: 'body',
			title: 'this is b.html',
			chunks: ['main', 'b'],
			// excludeChunks:['a','c']  
		}),
		new htmlWebpackPlugin({
			template: 'index.html',
			filename: 'c.html',
			inject: 'body',
			title: 'this is c.html',
			chunks: ['main', 'c'],
			// excludeChunks:['a','c'] 
		})
	]
}