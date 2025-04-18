import { defineConfig } from 'astro/config';
import { resolve } from 'path';

const PROJECT_ROOT = resolve('.');

// https://astro.build/config
export default defineConfig({
  root: PROJECT_ROOT,
  vite: {
    assetsInclude: ['**/*.jpe?g'],
    resolve: {
      alias: {
        '@assets': resolve(PROJECT_ROOT, 'src/assets'),
        '@components': resolve(PROJECT_ROOT, 'src/components'),
        '@data': resolve(PROJECT_ROOT, 'src/data'),
        '@layouts': resolve(PROJECT_ROOT, 'src/layouts'),
        '@scripts': resolve(PROJECT_ROOT, 'src/scripts'),
        '@styles': resolve(PROJECT_ROOT, 'src/styles'),
      },
    },
  },
});
