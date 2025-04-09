import { loadArea } from './nx.js';

export const config = {
  locales: { '': { ietf: 'en' } },
  decorateArea: (area = document) => {
    const eagerLoad = (parent, selector) => {
      const img = parent.querySelector(selector);
      img?.removeAttribute('loading');
    };

    (async function loadLCPImage() {
      eagerLoad(area, 'img');
    }());
  },
};

loadArea();

(function loadDa() {
  if (!new URL(window.location.href).searchParams.get('dapreview')) return;
  import('https://da.live/scripts/dapreview.js').then(({ default: daPreview }) => daPreview(loadArea));
}());
