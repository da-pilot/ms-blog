import { getConfig, getMetadata, loadArea } from '../../scripts/nx.js';

async function getNavEl() {
  const source = getMetadata('header-source') || '/fragments/nav/header';
  const resp = await fetch(`${source}.plain.html`);
  if (!resp.ok) return null;
  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const navSections = [...doc.querySelectorAll('body > *')];
  const nav = document.createElement('nav');
  nav.append(...navSections);

  const { decorateArea } = getConfig();

  await decorateArea(nav);
  await loadArea(nav);
  return nav;
}

function decorateNav(nav) {
  // The first image is our brand area
  const brand = nav.querySelector('img');
  if (brand) brand.closest('.section').classList.add('dme-section-brand');

  // The first list is our list of menu items
  const mainMenu = nav.querySelector('ul');
  if (mainMenu) {
    mainMenu.closest('.section').classList.add('dme-section-main-menu');
    mainMenu.classList.add('dme-main-menu');
  }

  const searchSection = nav.querySelector('.search')?.closest('.section');
  if (searchSection) searchSection.classList.add('dme-section-search');
}

export default async function init(el) {
  const nav = await getNavEl();
  if (!nav) return;
  decorateNav(nav);
  el.append(nav);
}
