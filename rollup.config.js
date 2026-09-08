import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default {
    input: 'src/index.ts',

    output: [
        {
            file: 'dist/index.cjs.js',
            format: 'cjs',
            exports: 'named',
            sourcemap: true,
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true,
        },
    ],

    // Don't bundle Vue itself.
    // Nuxt/Vue app provides Vue.
    external: ['vue'],

    plugins: [
        resolve({
            // browser: true,
            // preferBuiltins: false,
            extensions: ['.js', '.ts'],
        }),

        commonjs(),

        typescript({
            tsconfig: './tsconfig.json',
        }),
    ],
}