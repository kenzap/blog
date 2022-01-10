// Find plugins: https://github.com/rollup/awesome
import glob from "glob"
import path from "path"
import { terser } from "rollup-plugin-terser"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import copy from 'rollup-plugin-copy'
import fs from 'fs';

// TODO - remove these two
// import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const targetFolder = "public/"
const absolutePath = (dirPath) => path.resolve(__dirname, dirPath)



/**
 * This is a simple build pipeline for JavaScript files.
 *
 * It works by checking for any `.js` files without a leading `_`
 * in the name. If so, rollup processes the file using
 * the defined babel configuration and spits it out (folder
 * paths in tact) in the project's dist folder.
 *
 * It's intended to be simple and get out of the way as much
 * as possible. Unlike other front-end pipelines, this one
 * does not associate file names to any particular layout
 * or view. Developers have full control over which files
 * get loaded by requiring them to add a script tag.
 *
 * Additionally, the npm scripts are set up to process
 * scripts using terser for additional optimization when
 * the build is in "production" mode (see `netlify.tml`
 * and `package.json`).
 */

const terserPlugin = terser({
	output: {
		comments: (_, comment) => {
			const { value, type } = comment
			if (type === "comment2") {
				return /@preserve|@license|@cc_on/i.test(value)
			}
		},
	},
})

let workingFolders = [];
 
/* prepare script import paths */
let scriptFiles = glob.sync(absolutePath("src/**/!(_)*.js"))
const scriptInputs = scriptFiles.reduce((files, input) => {
	const parts = input.split("src/")
	const fileKey = parts[parts.length - 1]
	
	// if(parts[1]!='home')
	// workingFolders.push(parts[1].replace('.js','.html'))
	return { [fileKey]: absolutePath(input), ...files }
}, {})

const scriptPaths = Object.keys(scriptInputs)
const scriptOutputs = scriptPaths.reduce((files, file) => {
	const inputPath = scriptInputs[file]
	const parts = inputPath.split("/")
	const pathIndex = parts.indexOf("index.js") - 1
	// const scriptName = parts.indexOf("scripts.js") - 1
	const outputPath = parts.slice(pathIndex).join("/")

	// find working folders only
	if(outputPath.indexOf("home/") != -1 && outputPath.indexOf("_/") != -1){
		workingFolders.push(parts[parts.length-2]);
	}

	// homepage goes to root
	if(outputPath.indexOf("home/") != -1){

		return { [file]: absolutePath(targetFolder + parts[parts.length-1]), ...files }

	// any other page ordinary route
	}else{

		return { [file]: absolutePath(targetFolder + outputPath), ...files }
	}

}, {})

// creates predefined index.html files for browser navigation
function createIndexes(key){

	let keyF = key.replace('.js','.html');
	keyF = keyF.replace('home/','');

	fs.copyFile('src/_/_index.html', targetFolder + keyF, function (err) {
		if (err) throw err;
		// console.log('Error creating '+targetFolder + keyF+' index file, make sure that template index file exists in src/_/_index.html. Error: ' + err);
	});

	// public/home is now moved to root folder, removing instead
	if (fs.existsSync(targetFolder + 'home')) fs.rmdirSync(targetFolder + 'home', { recursive: true });
}

const bundles = scriptPaths.map((key) => {
	const prodEnv = process.env.BABEL_ENV === "production"
	const plugins = [
		nodeResolve(),
		commonjs(), 
		babel({
			babelHelpers: "bundled",
			exclude: "node_modules/**",
			comments: false,
		}),   
		copy({
			targets: [
				{ src: ['public/home/*'], dest: 'public' },
			]
		}),
		createIndexes(key),
		livereload({
			watch: [ 
			  path.resolve(__dirname, 'public'),
			],
			delay: 500,
			exts: [ 'html', 'js', 'scss', 'sass', 'css' ]
		}),
	]

	let sourcemap = true

	if (prodEnv) {
		plugins.push(terserPlugin)
		sourcemap = false
	}

	return {
		input: scriptInputs[key],
		output: {
			file: scriptOutputs[key],
			format: "iife",
			sourcemap,
		},
		plugins,
	}
})

export default bundles
