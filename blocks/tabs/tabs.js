/**
 * Converts a string to kebab-case.
 * @param {string} str - Input string.
 * @returns {string} Kebab-case string.
 */
function kebab(str) {
  return typeof str === 'string'
    ? str
      .toLowerCase()
      .replace(/[^0-9a-z]/gi, '-') // replace nonalphanumeric with dashes
      .replace(/-+/g, '-') // replace multiple dashes with a single
      .replace(/^-|-$/g, '') // trim leading and trailing hyphens
    : '';
}

/**
 * Builds a `tabpanel` element that corresponds to a tab.
 * @param {HTMLElement} el - Content element to be wrapped inside panel.
 * @param {string} label - Label for the panel.
 * @param {boolean} [selected=false] - Panel visibility.
 * @returns {HTMLLIElement} `tabpanel` element.
 */
function buildPanel(el, label, selected = false) {
  const panel = document.createElement('div');
  panel.role = 'tabpanel';
  panel.id = `panel-${label}`;
  panel.setAttribute('aria-labelledby', `tab-${label}`);
  panel.hidden = !selected; // hide panel if not selected

  const img = el.querySelector('p img');
  if (img) {
    const imgWrapper = img.closest('p');
    imgWrapper.className = 'img-wrapper';
    el.className = 'tabs-panel-content';
    panel.append(imgWrapper, el);
  } else panel.append(el);
  return panel;
}

/**
 * Creates a tab that corresponds to a panel.
 * @param {HTMLElement} el - Content element to be wrapped inside tab.
 * @param {string} label - Label for the tab.
 * @param {boolean} [selected=false] - Tab selection status.
 * @returns {HTMLLIElement} Tab button.
 */
function buildTab(el, label, selected = false) {
  const tab = document.createElement('button');
  tab.role = 'tab';
  tab.id = `tab-${label}`;
  tab.setAttribute('aria-controls', `panel-${label}`);
  tab.setAttribute('aria-selected', selected);
  tab.append(...el.children);
  const img = tab.querySelector('p img');
  if (img) img.closest('p').className = 'img-wrapper';
  return tab;
}

/**
 * Updates tab and panel visibility.
 * @param {NodeListOf<Element>} tabs - List of all tabs.
 * @param {HTMLElement} content - Parent container for all panels.
 * @param {HTMLElement} activeTab - Currently active tab.
 * @param {HTMLElement} activePanel - Panel controlled by currently active tab.
 */
function updateVisibility(tabs, content, activeTab, activePanel) {
  tabs.forEach((t) => t.setAttribute('aria-selected', t === activeTab));
  [...content.children].forEach((panel) => {
    panel.hidden = panel !== activePanel;
  });
}

/**
 * Updates active tab and toggles visibility of associated panel.
 * @param {Event} e - Click event.
 */
function switchTabs(e) {
  const { target } = e;
  const tab = target.closest('button');
  if (!tab) return; // eject if target is not a button

  const selected = tab.getAttribute('aria-selected') === 'true';
  if (selected) return; // eject if tab already selected

  const block = tab.closest('.tabs');
  const tabs = block.querySelectorAll('[role="tablist"] [role="tab"]');
  const panels = block.querySelector('.tabs-panels');
  const tabPanel = panels.querySelector(`#${tab.getAttribute('aria-controls')}`);

  updateVisibility(tabs, panels, tab, tabPanel);
  tab.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  });
}

export default async function decorate(block) {
  // build tab list
  const tabList = document.createElement('div');
  tabList.role = 'tablist';
  tabList.addEventListener('click', switchTabs);

  // build tab panels container
  const tabPanels = document.createElement('div');
  tabPanels.className = 'tabs-panels';

  [...block.children].forEach((row, i) => {
    const [tabContent, panelContent] = [...row.children];
    const label = kebab(tabContent.textContent.trim());

    tabList.append(buildTab(tabContent, label, !i));
    tabPanels.append(buildPanel(panelContent, label, !i));
  });

  block.replaceChildren(tabList, tabPanels);
}
