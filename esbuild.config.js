const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

const banner = `// Logical CSS Extension
// Built with esbuild
`;

const buildOptions = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'out/extension.js',
  external: ['vscode'],
  format: 'cjs',
  target: 'node18',
  platform: 'node',
  sourcemap: !production,
  banner: {
    js: banner,
  },
  loader: {
    '.ts': 'ts',
  },
  logLevel: 'info',
};

async function main() {
  const ctx = await esbuild.context(buildOptions);
  if (watch) {
    await ctx.watch();
    console.log('Watching for file changes...');
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

main().catch(() => process.exit(1));
