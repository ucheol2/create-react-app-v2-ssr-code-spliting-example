import Koa from 'koa';
import serve from 'koa-static';
import React from 'react';
import { renderToString } from 'react-dom/server';
import path from 'path';
import fs from 'fs';
import Loadable from 'react-loadable';

import App from '../src/App';

const app = new Koa();
const template = fs.readFileSync(path.join(__dirname, '../build/index.html'), { encoding: 'utf8'});

const render = (ctx) => {
  const modules = [];

  const html = renderToString(
    <Loadable.Capture report={moduleName => modules.push(moduleName)}>
      <App/>
    </Loadable.Capture>
  );


  const bundles = getBundles(stats, modules);

  const styles = bundles.filter(bundle => bundle.file.endsWith('.css')).map(style => {
    return `<link href="/dist/${style.file}" rel="stylesheet"/>`;
  }).join('\n');
  const scripts = bundles.filter(bundle => bundle.file.endsWith('.js')).map(script => {
    return `<script src="/dist/${script.file}"></script>`
  }).join('\n');

  console.log(styles, scripts)

  const page = template
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  ctx.body = page;
}

app.use((ctx, next) => {
  if(ctx.path === '/') return render(ctx);
  return next();
})
app.use(serve(path.resolve(__dirname, '../build')));
app.use(render);

process.on('SIGINT', function onSigint () {
	console.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString());
  shutdown();
});

process.on('SIGTERM', function onSigterm () {
  console.info('Got SIGTERM (docker container stop). Graceful shutdown ', new Date().toISOString());
  shutdown();
})

function shutdown() {
  process.exit();
}

Loadable.preloadAll().then(() => {
  app.listen(5000);
  console.log("Running on http://localhost:5000");
})
