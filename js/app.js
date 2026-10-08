const short = (v, n = 160) => { const s = JSON.stringify(v) ?? 'undefined'; return esc(s.length > n ? s.slice(0, n) + '…' : s) };
let filter = 'All';

// Build tests (and expected outputs) on first use of each problem
function tests(p) {
  return p.t ||= p.tests().map(a => ({ args: a, exp: p.ref(...a) }));
}

function list() {
  document.title = 'Problems – CompetPro';
  const s = solved(), rows = P.filter(p => filter == 'All' || p.diff == filter);
  $('#app').innerHTML = `
  <h1>Problems</h1>
  <p class="lede">Pick a problem, write a function in JavaScript, and run it against the tests.</p>
  <section class="board" aria-label="Problems">
    <div class="bar"><b>${P.length} problems</b>${['All', 'Easy', 'Medium', 'Hard'].map(f => `<button class="chip" aria-pressed="${f == filter}" data-f="${f}">${f}</button>`).join('')}</div>
    ${rows.map(p => `<a class="row" href="#/p/${p.id}">${balloon(COL[p.diff], s[p.id])}<span><span class="t">${p.title}</span><span class="tags">${p.tags}</span></span><span class="d" style="color:${COL[p.diff]}">${p.diff}</span><span class="st">${s[p.id] ? 'solved' : 'not yet'}</span></a>`).join('')}
  </section>`;
  document.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { filter = b.dataset.f; list() });
}

function problem(p) {
  document.title = p.title + ' – CompetPro';
  const T = tests(p);
  const ex = T.slice(0, 2).map((t, i) => `<div><b>Example ${i + 1}</b><pre>${p.fn}(${t.args.map(a => short(a, 120)).join(', ')})\n→ ${short(t.exp, 120)}</pre></div>`).join('');
  $('#app').innerHTML = `
  <p class="back"><a href="#/">← All problems</a></p>
  <div class="prob">
    <article>
      <span class="d" style="color:${COL[p.diff]}">${p.diff}</span> <span class="score">${p.tags}</span>
      <h2>${p.title}</h2><p>${p.desc}</p>${ex}
      <p class="side">${TOOL.note} <a href="${TOOL.url}" target="_blank" rel="noopener">${TOOL.name}</a>.</p>
    </article>
    <section>
      <label for="code" class="score">Your solution (JavaScript)</label>
      <textarea id="code" spellcheck="false" autocapitalize="off"></textarea>
      <div class="acts"><button class="btn" id="run">Run tests</button><button class="btn alt" id="reset">Reset code</button></div>
      <div class="res" id="res" aria-live="polite">Run your code to see results.</div>
    </section>
  </div>`;
  const ta = $('#code');
  ta.value = store.get('balloon.code.' + p.id, p.starter);
  ta.oninput = () => store.set('balloon.code.' + p.id, ta.value);
  ta.onkeydown = e => { if (e.key == 'Tab') { e.preventDefault(); ta.setRangeText('  ', ta.selectionStart, ta.selectionEnd, 'end') } };
  $('#reset').onclick = () => { if (confirm('Replace your code with the starter template?')) { ta.value = p.starter; ta.oninput() } };
  $('#run').onclick = () => run(p, ta.value);
}

const WORKER = `onmessage=e=>{const{code,fn,tests}=e.data;let f;try{f=new Function(code+"\\n;return "+fn+";")();if(typeof f!="function")throw new Error("Function "+fn+" is not defined")}catch(err){postMessage({err:String(err)});return}
const out=[];for(const t of tests){try{const r=f(...structuredClone(t.args));out.push({ok:JSON.stringify(r)===JSON.stringify(t.exp),got:r===undefined?null:r})}catch(err){out.push({ok:false,err:String(err)})}}postMessage({out})}`;

function run(p, code) {
  const btn = $('#run'), res = $('#res'), T = tests(p);
  btn.disabled = true; res.textContent = 'Running…';
  const w = new Worker(URL.createObjectURL(new Blob([WORKER], { type: 'text/javascript' })));
  const done = h => { clearTimeout(timer); w.terminate(); btn.disabled = false; res.innerHTML = h };
  const timer = setTimeout(() => done('<span class="lose">Time limit exceeded</span><br>Your code took longer than 4 seconds on the full test set. Look for a faster algorithm.'), 4000);
  w.onmessage = e => {
    const d = e.data;
    if (d.err) return done(`<span class="lose">Error</span><br><code>${esc(d.err)}</code>`);
    const o = d.out, pass = o.filter(x => x.ok).length, all = pass == o.length;
    let h = `<span class="${all ? 'win' : 'lose'}">${all ? 'All tests passed' : 'Passed ' + pass + ' of ' + o.length}</span><div class="dots">${o.map(x => `<i class="${x.ok ? 'ok' : 'no'}"></i>`).join('')}</div>`;
    const bad = o.findIndex(x => !x.ok);
    if (bad >= 0) {
      const x = o[bad], t = T[bad];
      h += bad < 2
        ? `Test ${bad + 1} failed.<pre>input: ${t.args.map(a => short(a, 120)).join(', ')}\nexpected: ${short(t.exp, 120)}\ngot: ${x.err ? esc(x.err) : short(x.got, 120)}</pre>`
        : `Hidden test ${bad + 1} failed${x.err ? ': <code>' + esc(x.err) + '</code>' : '.'} Check edge cases and large inputs.`;
    }
    if (all) {
      const s = solved(); s[p.id] = 1; store.set('balloon.solved', s);
      h += `<div class="pop" style="display:inline-block">${balloon(COL[p.diff], true)}</div> Balloon earned. <a href="#/">Pick the next problem</a>`;
      showScore(P.length);
    }
    done(h);
  };
  w.onerror = e => done(`<span class="lose">Error</span><br><code>${esc(e.message)}</code>`);
  w.postMessage({ code, fn: p.fn, tests: T });
}

function route() {
  const m = location.hash.match(/^#\/p\/(.+)$/), p = m && P.find(x => x.id == m[1]);
  showScore(P.length);
  p ? problem(p) : list();
  window.scrollTo(0, 0);
}
addEventListener('hashchange', route);
route();
