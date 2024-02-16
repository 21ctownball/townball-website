// import dsv from '@rollup/plugin-dsv';
import { defineConfig } from 'astro/config';
import { resolve } from 'path';

const PROJECT_ROOT = resolve('.');

// https://astro.build/config
export default defineConfig({
  root: PROJECT_ROOT,
  vite: {
    assetsInclude: ['**/*.jpe?g', '**/*.csv'],
    // plugins: [dsv()],
    resolve: {
      alias: {
        '@assets': resolve(PROJECT_ROOT, 'src/assets'),
        '@components': resolve(PROJECT_ROOT, 'src/components'),
        '@layouts': resolve(PROJECT_ROOT, 'src/layouts'),
        '@scripts': resolve(PROJECT_ROOT, 'src/scripts'),
      },
    },
  },
});
