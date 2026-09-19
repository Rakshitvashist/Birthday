// Embedded playlist (Spotify or YouTube).
export function mountPlaylist(host, content) {
  const c = content.playlist;
  if (!c.embedUrl) return;
  const section = document.createElement('section');
  section.className = 'section playlist';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">Press play.</h2>
      <div class="reveal">
        <iframe src="${c.embedUrl}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" title="Playlist"></iframe>
      </div>
    </div>`;
  host.appendChild(section);
}
