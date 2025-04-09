import { getConfig } from '../../scripts/nx.js';
import createPicture from '../../scripts/utils/image.js';

const QUERY_PATH = '/query-index.json';

function decorateFeed(json) {
  const ul = document.createElement('ul');
  ul.className = 'article-feed';
  json.data.forEach((article) => {
    const li = document.createElement('li');
    li.className = 'article-feed-article';

    const pic = createPicture(article.image);

    const title = document.createElement('p');
    title.className = 'article-feed-article-title';
    title.innerText = article.title;

    li.append(pic, title);
    ul.append(li);
  });
  return ul;
}

export default async function init(el) {
  el.innerHTML = '';
  const { locale } = getConfig();
  const resp = await fetch(`${locale.base}${QUERY_PATH}`);
  if (!resp.ok) throw new Error('Could not fetch query index');
  const json = await resp.json();
  const list = decorateFeed(json);
  el.append(list);
}
