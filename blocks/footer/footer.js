import { getConfig, getMetadata, loadArea } from '../../scripts/nx.js';

async function getNavEl() {
  const source = getMetadata('footer-source') || '/fragments/nav/footer';
  const resp = await fetch(`${source}.plain.html`);
  if (!resp.ok) return null;
  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const navSections = [...doc.querySelectorAll('body > *')];
  const nav = document.createElement('nav');
  nav.append(...navSections);
  return nav;
}

function decorateNav(nav) {
  const lastButtons = nav.querySelectorAll('.section:last-child strong a');
  lastButtons.forEach((button) => {
    button.classList.add('btn', 'btn-primary');
    const strong = button.parentElement;
    strong.parentElement.replaceChild(button, strong);
  });
}

export default async function init(el) {
  const { decorateArea } = getConfig();
  const nav = await getNavEl();
  if (!nav) return;
  el.append(nav);
  await decorateArea(nav);
  await loadArea(nav);
  decorateNav(nav);
}
