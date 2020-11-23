import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';
const { name } = pkg
const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default [{
	input: 'src/index.js',
	output: [
		{
			file: pkg.module,
			format: 'es',
			sourcemap: true,
			name
		},
		{
			file: pkg.main,
			format: 'umd',
			sourcemap: true,
			name
		}
	],
	external: [
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.peerDependencies || {})
	],
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('style.css');
			},
			preprocess: sveltePreprocess(),
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		typescript({ sourceMap: !production, }),
		commonjs({extensions:['.js','.ts']}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
},
	// {
	// 	input: 'src/index.js',
	// 	output: { dir: '@types', 'format': 'umd', sourcemap: true, name },
	// 	plugins: [
	// 		typescript({
	// 			declaration: true,
	// 			declarationDir: '@types/',
	// 			emitDeclarationOnly: true,
	// 			rootDir: 'src/'
	// 		})
	// 	],
	// 	external: [
	// 		// ...Object.keys(pkg.dependencies || {}),
	// 		// ...Object.keys(pkg.peerDependencies || {})
	// 	]
	// }
];
