// Each problem: metadata, statement, starter code, a reference solution (ref)
// and tests() -> list of argument arrays. Expected outputs come from ref.
// Tests are built lazily so the landing page stays fast.

const R = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 };
const rnd = R(7);
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const arr = (n, a, b) => Array.from({ length: n }, () => ri(a, b));

class Heap {
  constructor() { this.a = [] }
  get n() { return this.a.length }
  push(x) { const a = this.a; a.push(x); let i = a.length - 1; while (i && a[i][0] < a[i - 1 >> 1][0]) { [a[i], a[i - 1 >> 1]] = [a[i - 1 >> 1], a[i]]; i = i - 1 >> 1 } }
  pop() { const a = this.a, t = a[0], l = a.pop(); if (a.length) { a[0] = l; let i = 0; for (;;) { let m = i, c = 2 * i + 1; if (c < a.length && a[c][0] < a[m][0]) m = c; if (c + 1 < a.length && a[c + 1][0] < a[m][0]) m = c + 1; if (m == i) break; [a[i], a[m]] = [a[m], a[i]]; i = m } } return t }
}
const bigGrid = () => { const n = 300; return Array.from({ length: n }, (_, y) => Array.from({ length: n }, (_, x) => y + x == 0 ? 'S' : y == n - 1 && x == n - 1 ? 'E' : rnd() < .2 ? '#' : '.').join('')) };

const P = [
{ id: 'two-sum', title: 'Two Sum', diff: 'Easy', tags: 'arrays, hashing', fn: 'twoSum',
  desc: 'Given an array <code>nums</code> and an integer <code>target</code>, return the indices <code>[i, j]</code> with <code>i &lt; j</code> where <code>nums[i] + nums[j] = target</code>. Exactly one such pair exists.',
  starter: 'function twoSum(nums, target) {\n  // return [i, j]\n}\n',
  ref: (a, t) => { const m = new Map(); for (let j = 0; j < a.length; j++) { if (m.has(t - a[j])) return [m.get(t - a[j]), j]; m.set(a[j], j) } },
  tests: () => [[[2, 7, 11, 15], 9], [[3, 2, 4], 6], [[3, 3], 6], [[-1, -2, -3, -4, -5], -8], [[...arr(1000, -1e6, 1e6).map(v => v * 2), 1, 2], 3]] },
{ id: 'balanced', title: 'Balanced Brackets', diff: 'Easy', tags: 'stack, strings', fn: 'isBalanced',
  desc: 'Given a string of <code>()[]{}</code> characters, return <code>true</code> if every bracket is closed by the same type in the correct order. The empty string is balanced.',
  starter: 'function isBalanced(s) {\n  \n}\n',
  ref: s => { const st = [], m = { ')': '(', ']': '[', '}': '{' }; for (const c of s) { if (m[c]) { if (st.pop() !== m[c]) return false } else st.push(c) } return !st.length },
  tests: () => [['()[]{}'], ['(]'], ['([{}])'], ['(('], [''], [')('], ['('.repeat(50000) + ')'.repeat(50000)]] },
{ id: 'range-sums', title: 'Range Sums', diff: 'Easy', tags: 'prefix sums', fn: 'rangeSums',
  desc: 'Given <code>nums</code> and a list of queries <code>[l, r]</code> (0-indexed, inclusive), return the sum of <code>nums[l..r]</code> for each query. Up to 200,000 numbers and 200,000 queries, so recomputing each sum will be too slow.',
  starter: 'function rangeSums(nums, queries) {\n  \n}\n',
  ref: (a, q) => { const p = [0]; for (const v of a) p.push(p.at(-1) + v); return q.map(([l, r]) => p[r + 1] - p[l]) },
  tests: () => [[[1, 2, 3, 4, 5], [[0, 4], [1, 2], [3, 3]]], [[-5, 5, -5], [[0, 2], [0, 0]]], [arr(200000, -1000, 1000), Array.from({ length: 200000 }, () => { const l = ri(0, 199999); return [l, ri(l, 199999)] })]] },
{ id: 'max-subarray', title: 'Maximum Subarray', diff: 'Medium', tags: 'dp, arrays', fn: 'maxSubarray',
  desc: 'Return the largest sum of any non-empty contiguous subarray of <code>nums</code>. The array can hold up to 200,000 values, positive and negative.',
  starter: 'function maxSubarray(nums) {\n  \n}\n',
  ref: a => { let b = -Infinity, c = 0; for (const v of a) { c = Math.max(v, c + v); b = Math.max(b, c) } return b },
  tests: () => [[[-2, 1, -3, 4, -1, 2, 1, -5, 4]], [[1]], [[-3, -1, -2]], [arr(200000, -1000, 1000)]] },
{ id: 'coin-change', title: 'Fewest Coins', diff: 'Medium', tags: 'dp', fn: 'minCoins',
  desc: 'Given coin denominations and an <code>amount</code>, return the fewest coins that make exactly that amount, or <code>-1</code> if it is impossible. You may use each denomination any number of times.',
  starter: 'function minCoins(coins, amount) {\n  \n}\n',
  ref: (c, A) => { const d = Array(A + 1).fill(Infinity); d[0] = 0; for (let i = 1; i <= A; i++) for (const x of c) if (x <= i && d[i - x] + 1 < d[i]) d[i] = d[i - x] + 1; return d[A] === Infinity ? -1 : d[A] },
  tests: () => [[[1, 2, 5], 11], [[2], 3], [[1], 0], [[186, 419, 83, 408], 6249], [[1, 5, 10, 25, 50], 100000]] },
{ id: 'lis', title: 'Longest Increasing Subsequence', diff: 'Medium', tags: 'binary search, dp', fn: 'lis',
  desc: 'Return the length of the longest strictly increasing subsequence of <code>nums</code>. With 100,000 numbers, an O(n&sup2;) solution will time out; aim for O(n log n).',
  starter: 'function lis(nums) {\n  \n}\n',
  ref: a => { const t = []; for (const v of a) { let l = 0, h = t.length; while (l < h) { const m = l + h >> 1; t[m] < v ? l = m + 1 : h = m } t[l] = v } return t.length },
  tests: () => [[[10, 9, 2, 5, 3, 7, 101, 18]], [[0, 1, 0, 3, 2, 3]], [[7, 7, 7]], [arr(100000, 0, 1e9)]] },
{ id: 'grid-path', title: 'Maze Steps', diff: 'Medium', tags: 'bfs, grids', fn: 'shortestPath',
  desc: 'The grid is an array of equal-length strings: <code>S</code> start, <code>E</code> exit, <code>.</code> open, <code>#</code> wall. Moving up, down, left or right costs one step. Return the fewest steps from S to E, or <code>-1</code> if E is unreachable.',
  starter: 'function shortestPath(grid) {\n  \n}\n',
  ref: g => { const n = g.length, m = g[0].length; let q = [], d = new Map(); for (let y = 0; y < n; y++) for (let x = 0; x < m; x++) if (g[y][x] == 'S') { q = [[y, x]]; d.set(y * m + x, 0) }
    for (let i = 0; i < q.length; i++) { const [y, x] = q[i], k = d.get(y * m + x); if (g[y][x] == 'E') return k; for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const Y = y + a, X = x + b; if (Y >= 0 && X >= 0 && Y < n && X < m && g[Y][X] != '#' && !d.has(Y * m + X)) { d.set(Y * m + X, k + 1); q.push([Y, X]) } } } return -1 },
  tests: () => [[['S.#', '..#', '#.E']], [['S#E']], [['S..', '...', '..E']], [bigGrid()]] },
{ id: 'dijkstra', title: 'Shortest Roads', diff: 'Hard', tags: 'graphs, heap', fn: 'distances',
  desc: 'A country has <code>n</code> cities (0 to n-1) and two-way roads <code>[u, v, w]</code> of length <code>w</code>. Return an array with the shortest distance from <code>src</code> to every city, using <code>-1</code> for cities that cannot be reached. Up to 100,000 cities and 300,000 roads.',
  starter: 'function distances(n, edges, src) {\n  \n}\n',
  ref: (n, e, s) => { const g = Array.from({ length: n }, () => []); for (const [u, v, w] of e) { g[u].push([v, w]); g[v].push([u, w]) } const D = Array(n).fill(Infinity); D[s] = 0; const h = new Heap(); h.push([0, s]);
    while (h.n) { const [d, u] = h.pop(); if (d > D[u]) continue; for (const [v, w] of g[u]) if (d + w < D[v]) { D[v] = d + w; h.push([D[v], v]) } } return D.map(x => x === Infinity ? -1 : x) },
  tests: () => [[4, [[0, 1, 5], [1, 2, 2], [0, 2, 9]], 0], [3, [[0, 1, 1]], 2], [100000, Array.from({ length: 300000 }, () => [ri(0, 99999), ri(0, 99999), ri(1, 1000)]), 0]] }
];
