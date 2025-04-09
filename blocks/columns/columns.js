function decorateRow(row, num) {
  const cols = row.querySelectorAll(':scope > div');
  const className = `columns-row child-count-${cols.length}`;
  row.style = `--child-count: ${cols.length}`;
  row.className = cols.length === 1 ? `${className} row-title` : `${className} row-content`;
  row.classList.add(`row-${num}`);
  cols.forEach((col, i) => {
    col.className = `columns-col columns-col-${i + 1}`;
  });
}

export default function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  rows.forEach((row, idx) => { decorateRow(row, idx + 1); });
}
