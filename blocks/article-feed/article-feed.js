import { getConfig } from '../../scripts/nx.js';
import createPicture from '../../scripts/utils/picture.js';

const QUERY_PATH = '/query-index.json';

function calculateExcelDate(excelDate) {
  // Excel's date system starts on January 1, 1900
  // JavaScript's Date counts from January 1, 1970
  // Excel has a leap year bug where it incorrectly includes February 29, 1900
  // So we need to adjust for dates after February 28, 1900

  // Convert Excel date to JavaScript date
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const excelEpoch = new Date(1899, 11, 30);
  console.log(excelEpoch);

  // Create a new date by adding the Excel serial number of days
  const jsDate = new Date(excelEpoch.getTime() + excelDate * millisecondsPerDay);
  console.log(jsDate);

  // Format the date as "Apr 4, 2025"
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return jsDate.toLocaleDateString('en-US', options);
}

function decorateFeed(data, opts) {
  const ul = document.createElement('ul');
  ul.className = 'article-feed-list';
  data.forEach((item) => {
    const li = document.createElement('li');
    const article = document.createElement('article');

    li.className = 'article-feed-article';

    if (opts.layout === 'list') {
      const imgLink = document.createElement('a');
      imgLink.className = 'article-feed-article-image-link';
      imgLink.href = item.path;

      const pic = createPicture({ src: item.image, breakpoints: [{ width: '1000' }] });
      imgLink.append(pic);

      article.append(imgLink);
    }

    const date = document.createElement('p');
    date.className = 'article-feed-article-date';
    date.innerText = calculateExcelDate(item.date);

    const author = document.createElement('p');
    author.className = 'article-feed-article-author';
    author.innerText = item.author;

    const meta = document.createElement('div');
    meta.className = 'article-feed-article-meta';
    meta.append(date, author);

    const title = document.createElement('p');
    title.className = 'article-feed-article-title';
    title.innerText = item.title;

    article.append(meta, title);
    li.append(article);
    ul.append(li);
  });
  return ul;
}

function filterFeed(filter, data) {
  const [key, search] = filter.split('=');

  return data.reduce((acc, article) => {
    if (article[key.trim()].includes(search.trim())) {
      acc.push(article);
    }
    return acc;
  }, []);
}

const getBlockMeta = (el) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children) {
    const key = row.children[0].textContent.trim();
    const content = row.children[1];
    if (content) {
      const text = content.textContent.trim();
      if (key && content) rdx[key] = { text };
    }
  }
  return rdx;
}, {});

export default async function init(el) {
  const { locale } = getConfig();
  const { filter } = getBlockMeta(el);
  const resp = await fetch(`${locale.base}${QUERY_PATH}`);
  if (!resp.ok) throw new Error('Could not fetch query index');
  const { data } = await resp.json();

  const filtered = filter ? filterFeed(filter.text, data) : data;

  const layout = el.classList.contains('grid') ? 'grid' : 'list';
  const opts = { layout };

  const list = decorateFeed(filtered, opts);

  el.querySelector(':scope > div:nth-child(2)')?.remove();
  el.append(list);
}
