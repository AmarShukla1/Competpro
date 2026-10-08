const tags = new Set(P.flatMap(p => p.tags.split(', ')));
$('#n-problems').textContent = P.length;
$('#n-topics').textContent = tags.size;

const s = solved(), count = Object.keys(s).length;
$('#progress').textContent = count
  ? `You have ${count} of ${P.length} balloons. Keep going.`
  : 'No sign-up. Your progress is saved in this browser.';

$('#preview').innerHTML = P.map(p =>
  `<a class="row" href="practice.html#/p/${p.id}">${balloon(COL[p.diff], s[p.id])}<span><span class="t">${p.title}</span><span class="tags">${p.tags}</span></span><span class="d" style="color:${COL[p.diff]}">${p.diff}</span><span class="st">${s[p.id] ? 'solved' : 'not yet'}</span></a>`
).join('');
