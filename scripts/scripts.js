import { setConfig, loadArea } from './nx.js';

const locales = { '': { ietf: 'en' } };

function decorateArea(area = document) {
  const eagerLoad = (parent, selector) => {
    const img = parent.querySelector(selector);
    img?.removeAttribute('loading');
  };

  (async function loadLCPImage() {
    eagerLoad(area, 'img');
  }());
}

setConfig({ locales, decorateArea });

function loadPage() {
  decorateArea();
  loadArea();
}

loadPage();

(function loadDa() {
  if (!new URL(window.location.href).searchParams.get('dapreview')) return;
  import('https://da.live/scripts/dapreview.js').then(({ default: daPreview }) => daPreview(loadPage));
}());
