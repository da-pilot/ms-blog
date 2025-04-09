export default function init(el) {
  if (el.classList.contains('split')) {
    const links = el.querySelectorAll('a');
    links.forEach((link) => {
      const parent = link.closest('p');
      link.classList.add('btn', 'btn-primary');
    });
  }
}
