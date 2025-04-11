import { getMetadata, loadArea } from '../../scripts/nx.js';

function createRelatedFeed(section, related) {
  const html = `
    <div>
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
    </div>
  `;
  section.insertAdjacentHTML('afterend', html);
}

export default async function init(el) {
  const article = el.querySelector('article');
  await loadArea(article);
}

(function decorateTemplate() {
  // get all the top level article content
  const content = document.body.querySelectorAll('main > div');

  // Create an article tag for semantics
  const article = document.createElement('article');
  article.append(...content);

  // Create a new block to house the article tag
  const block = document.createElement('div');
  block.className = 'article';
  block.append(article);

  // Create a new section
  const section = document.createElement('div');
  section.className = 'article-section';
  section.append(block);

  // Add the new synthetic section back to main
  document.body.querySelector('main').append(section);

  const related = getMetadata('related');
  if (related) createRelatedFeed(section, related);
}());
