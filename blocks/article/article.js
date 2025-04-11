import { getMetadata, loadArea, loadBlock } from '../../scripts/nx.js';

function createRelatedFeed(related) {
  const html = `
    <div class="article-feed grid">
      <div>
        <div>
          <h2 id="related">Related</h2>
        </div>
      </div>
      <div>
        <div>filter</div>
        <div>tags = ${related}</div>
      </div>
    </div>
  `;
  const section = document.body.querySelector('.side-section');
  section.insertAdjacentHTML('beforeend', html);
  loadBlock(section.querySelector('.article-feed'));
}

export default async function init(el) {
  const article = el.querySelector('article');
  await loadArea(article);

  const related = getMetadata('related');
  if (related) createRelatedFeed(related);
}

(function decorateTemplate() {
  // get all the top level article sections
  const content = document.body.querySelectorAll('main > div');

  // Create an article tag for semantics
  const article = document.createElement('article');
  article.append(...content);

  // Create a new block to house the article tag
  const block = document.createElement('div');
  block.className = 'article';
  block.append(article);

  // Create a main section
  const mainSection = document.createElement('div');
  mainSection.className = 'article-section';
  mainSection.append(block);

  // Add a sidebar section
  const sideSection = document.createElement('div');
  sideSection.className = 'side-section';

  // Add the new synthetic section back to main
  document.body.querySelector('main').append(mainSection, sideSection);
}());
