// Shared SVG flower drawings, used by the garden and the bouquet.
// Every head is drawn centred on (0,0) so it can be translated to the top of a stem.

export const FLOWER_TYPES = ['daisy', 'tulip', 'sunflower', 'rose', 'lavender', 'blossom'];

function ring(count, rx, ry, dist, fill, extra = '') {
  return Array.from({ length: count }, (_, i) =>
    `<ellipse class="petal" cx="0" cy="${-dist}" rx="${rx}" ry="${ry}" fill="${fill}" transform="rotate(${(360 / count) * i})" ${extra}/>`
  ).join('');
}

export function flowerHead(type) {
  switch (type) {
    case 'daisy':
      return `${ring(9, 4, 12, 10, '#fff7fb', 'opacity="0.95"')}<circle r="5.5" fill="#f4c542" /><circle r="2" fill="#d99a1b" />`;
    case 'tulip':
      return `
        <ellipse cx="-6" cy="-12" rx="7" ry="14" fill="#ff5c8a" transform="rotate(-18)" />
        <ellipse cx="6" cy="-12" rx="7" ry="14" fill="#ff5c8a" transform="rotate(18)" />
        <ellipse cx="0" cy="-13" rx="7.5" ry="15" fill="#ff7aa3" />
        <path d="M-7 -4 Q0 2 7 -4 L7 -10 Q0 -6 -7 -10Z" fill="#e6386f" />`;
    case 'sunflower':
      return `${ring(14, 3.5, 13, 11, '#f7b731')}${ring(14, 3, 10, 8, '#f9c74f', 'transform="rotate(12)"')}<circle r="7.5" fill="#5b3a1a" /><circle r="4" fill="#3f2712" />`;
    case 'rose':
      return `
        <circle r="13" fill="#b5175a" />
        <path d="M-10 -4 A10 10 0 0 1 8 -8" stroke="#ff8fb5" stroke-width="2.2" fill="none" stroke-linecap="round" />
        <circle r="9" fill="#e0457b" />
        <path d="M6 4 A7 7 0 0 1 -6 4" stroke="#ffb3c9" stroke-width="2" fill="none" stroke-linecap="round" />
        <circle r="5.5" fill="#ff6b9d" />
        <path d="M-3 -2 A3 3 0 0 1 3 -1" stroke="#ffd4e2" stroke-width="1.6" fill="none" stroke-linecap="round" />
        <circle r="2" fill="#ffb3c9" />`;
    case 'lavender':
      return Array.from({ length: 10 }, (_, i) =>
        `<circle class="petal" cx="${i % 2 ? 3.5 : -3.5}" cy="${8 - i * 4.4}" r="3.4" fill="${i % 3 ? '#9b6bff' : '#b68cff'}" />`
      ).join('') + '<circle cx="0" cy="-36" r="2.6" fill="#c9a8ff" />';
    case 'blossom':
    default:
      return `${ring(5, 7, 10, 8, '#ffb3c9')}${ring(5, 4, 6, 4, '#ffd1e0', 'transform="rotate(36)"')}<circle r="3" fill="#f4c542" />`;
  }
}

// A curved stem from (0,0) up to (0,-h), plus two leaves.
export function stemMarkup(h, sway = 1) {
  const c = 10 * sway;
  return `
    <path class="stem" d="M0 0 C ${c} ${-h * 0.35}, ${-c} ${-h * 0.65}, 0 ${-h}" stroke="#4caf6f" stroke-width="3" fill="none" stroke-linecap="round" />
    <path class="leaf" d="M0 ${-h * 0.45} C -14 ${-h * 0.5}, -20 ${-h * 0.62}, -6 ${-h * 0.66} C -2 ${-h * 0.58}, 0 ${-h * 0.5}, 0 ${-h * 0.45}Z" fill="#5ec27f" />
    <path class="leaf" d="M0 ${-h * 0.3} C 14 ${-h * 0.34}, 20 ${-h * 0.46}, 6 ${-h * 0.5} C 2 ${-h * 0.42}, 0 ${-h * 0.35}, 0 ${-h * 0.3}Z" fill="#4caf6f" />`;
}

// A complete standalone flower as an <svg>, for shelves and bouquets.
export function flowerSvg(type, h = 60, size = 56) {
  return `
    <svg viewBox="${-size / 2} ${-h - 24} ${size} ${h + 30}" width="${size}" height="${h + 30}" xmlns="http://www.w3.org/2000/svg">
      <g class="flower-stem">${stemMarkup(h)}</g>
      <g transform="translate(0,${-h})"><g class="head">${flowerHead(type)}</g></g>
    </svg>`;
}
