# Data Sources

Game statistics, player information, and team information are loaded from the `/data` directory.

The <abbr title="comma separated value">CSV</abbr> files in this directory act as a simple <abbr title="content management system">CMS</abbr> for the project.

The necessary pages are generated at build time by leveraging Astro's [`getStaticPaths()` function](https://docs.astro.build/en/reference/routing-reference/#getstaticpaths).

## Package Reference

- [Vite glob import](https://vitejs.dev/guide/features.html#glob-import)
- [DSV Rollup plugin](https://github.com/rollup/plugins/tree/master/packages/dsv)
- [Astro `getStaticPaths()`](https://docs.astro.build/en/reference/routing-reference/#getstaticpaths)

> [!NOTE]
> Imported data must have the query string `?url&raw` appended to the file path for CSV parsing to work.
