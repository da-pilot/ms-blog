import { setConfig, loadArea, loadStyle } from './nx.js';

const conf = {
  locales: { '': { ietf: 'en', tk: 'cks7hcz.css' } },
  decorateArea: (area = document) => {
    const eagerLoad = (parent, selector) => {
      const img = parent.querySelector(selector);
      img?.removeAttribute('loading');
    };

    eagerLoad(area, 'img');
  },
};

const config = setConfig(conf);
config.decorateArea();

async function articleCheck() {
  const { pathname } = window.location;
  if (!pathname.startsWith(`${config.locale.base}/blog/`)) return;
  if (!pathname.split('/').length > 3) return;
  const script = import('../templates/article/article.js');
  const style = loadStyle('/templates/article/article.css');
  await Promise.all([script, style]);
}

await articleCheck();
loadArea();
