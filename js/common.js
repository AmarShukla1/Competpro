// ---- Edit this block to advertise a different tool ----
const TOOL = {
  name: 'Competitive Companion',
  line: 'A browser extension that sends a problem\u2019s sample tests to your editor in one click, so you stop copy-pasting inputs.',
  url: 'https://github.com/jmerle/competitive-companion',
  cta: 'Get the extension',
  note: 'Tip: grab sample tests from any contest site automatically with'
};
// -------------------------------------------------------

const COL = { Easy: 'var(--easy)', Medium: 'var(--med)', Hard: 'var(--hard)' };
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
};
const solved = () => store.get('balloon.solved', {});

const balloon = (c, on, cls = '') =>
  `<svg class="${cls}" width="26" height="34" viewBox="0 0 26 34" aria-hidden="true"><ellipse cx="13" cy="12" rx="10" ry="11" fill="${on ? c : 'none'}" stroke="${on ? c : 'var(--mute)'}" stroke-width="2" ${on ? '' : 'stroke-dasharray="3 3"'}/><path d="M13 23v3l-3 7M13 26l3 7" stroke="var(--mute)" fill="none" stroke-width="1.4"/></svg>`;

// Fill any element marked data-tool="name|line|cta|url"
document.querySelectorAll('[data-tool]').forEach(el => {
  const k = el.dataset.tool;
  if (k === 'url') el.href = TOOL.url; else el.textContent = TOOL[k];
});

function showScore(total) {
  const el = $('#score');
  if (el) el.textContent = Object.keys(solved()).length + ' / ' + total + ' balloons';
}
