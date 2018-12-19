const path = require ('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ATL = require('awesome-typescript-loader');

// Load environment vars from .env
require('dotenv').config();

const BabelLoader = {
	loader: 'babel-loader',
	options: {
		presets: ['react', 'es2015'],
	//	plugins: [ 'lodash' ],
	},
};

const ExtractSassPlugin = new ExtractTextPlugin({
	filename: 'app.css',
});

module.exports = {
	entry: {
		app: [
			'babel-polyfill',
			"./src/front/index.tsx",
		],
	},
	output: {
		filename: "app.js",
		path: path.resolve(path.join(__dirname, "..", "out", "dist"))
	},

	// Enable sourcemaps for debugging webpack's output.
	devtool: "source-map",

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [".ts", ".tsx", ".js", ".json"],
		plugins: [
			new ATL.TsConfigPathsPlugin(),
		]
	},

	module: {
		rules: [
			// All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
			{
				test: /\.tsx?$/,
				use: [
					BabelLoader,
					"awesome-typescript-loader"
				]
			},

			{
				test: /\.scss$/,
				use: ExtractSassPlugin.extract({
					use: [{
						loader: 'css-loader?-url',
						options: {
							sourceMap: true,
							minimize: true
						}
					}, {
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}],
					// use style-loader in development
					fallback: 'style-loader',
				}),
			},

			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
		]
	},

	plugins: [
		ExtractSassPlugin
	],

	// When importing a module whose path matches one of the following, just
	// assume a corresponding global variable exists and use that instead.
	// This is important because it allows us to avoid bundling all of our
	// dependencies, which allows browsers to cache those libraries between builds.
	externals: {
	//	"react": "React",
	//	"react-dom": "ReactDOM"
	},
};
