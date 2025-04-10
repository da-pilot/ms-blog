import { loadArea } from './nx.js';

export const config = {
  locales: { '': { ietf: 'en', tk: 'cks7hcz.css' } },
  decorateArea: (area = document) => {
    const eagerLoad = (parent, selector) => {
      const img = parent.querySelector(selector);
      img?.removeAttribute('loading');
    };

    eagerLoad(area, 'img');
  },
};

loadArea();
