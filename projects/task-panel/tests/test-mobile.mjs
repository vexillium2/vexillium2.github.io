import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire('/Users/jacobdu/Dev/learning/deepseek-harness/package.json');
const { JSDOM } = require('jsdom');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP = path.join(HERE, '..', 'app');
const html = fs.readFileSync(path.join(APP, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(APP, 'task-panel.js'), 'utf8');
const data = fs.readFileSync(path.join(HERE, 'fixture.json'), 'utf8');
const cal = fs.readFileSync(path.join(APP, 'feishu-calendar.json'), 'utf8');

const errors = [], fetched = [];
const dom = new JSDOM(html, { url: 'http://localhost:8911/', runScripts: 'outside-only', pretendToBeVisual: true });
const w = dom.window;
w.URL.createObjectURL = () => 'blob:x';
w.URL.revokeObjectURL = () => {};
w.fetch = (url) => {
  url = String(url); fetched.push(url);
  if (url.indexOf('feishu-calendar.json') >= 0) return Promise.resolve({ ok: true, text: () => Promise.resolve(cal) });
  if (url.indexOf('/api/worktable') >= 0) return Promise.resolve({ ok: true, text: () => Promise.resolve(data) });
  return Promise.resolve({ ok: false, text: () => Promise.resolve('') });
};
w.onerror = (m, s, l, c, e) => errors.push('onerror: ' + (e && e.stack || m));
w.addEventListener('unhandledrejection', (e) => errors.push('unhandled: ' + (e.reason && e.reason.stack || e.reason)));
w.__TP_MOBILE__ = true;
w.eval(js);
const $ = (id) => w.document.getElementById(id);
const q = (s) => w.document.querySelector(s);
const qa = (s) => Array.from(w.document.querySelectorAll(s));
const click = (el) => { if (el) el.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true })); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function step(n, fn) { try { fn(); console.log('OK  ' + n); } catch (e) { console.log('ERR ' + n + ': ' + e.stack); errors.push(n + ': ' + e.stack); } }
function assert(c, m) { if (!c) throw new Error(m); }

await sleep(800);
step('mobile loads without DSH', () => {
  assert($('view').innerHTML.length > 500, 'empty view');
  assert(qa('#tabs .dshell-tab').length === 4, 'tabs');
  assert(!fetched.some((u) => u.indexOf('/api/worktable') >= 0), 'called DSH api');
  console.log('   fetch', fetched.join(','));
});
step('welcome modal', () => {
  assert($('modalWrap').classList.contains('on'), 'no welcome');
  assert($('modalBody').textContent.indexOf('手机版') >= 0, 'no mobile welcome');
});
step('blank start sets flag', () => {
  click(q('[data-act="mobileBlank"]'));
  const s = JSON.parse(w.localStorage.getItem('tasktable.mobile.v3'));
  assert(s.settings.mobileWelcomeDone === true, 'flag not set');
});
step('import fixture via file input', () => {
  const input = $('mobileImportFile'); assert(input, 'no import input');
  const file = new w.File([data], 'fixture.json', { type: 'application/json' });
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  input.dispatchEvent(new w.Event('change', { bubbles: true }));
});
await sleep(700);
step('fixture migrated', () => {
  const s = JSON.parse(w.localStorage.getItem('tasktable.mobile.v3'));
  assert(s.tasks.length > 2, 'tasks ' + s.tasks.length);
  assert(s.thoughts.length === 2, 'thoughts ' + s.thoughts.length);
  assert(s.version === 3, 'version ' + s.version);
  assert(s.settings.mobileWelcomeDone === true, 'welcome flag');
  console.log('   tasks', s.tasks.length, 'thoughts', s.thoughts.length, 'version', s.version);
});
step('today renders after import', () => {
  const t = $('view').textContent;
  assert(t.indexOf('思绪寄存') >= 0, 'no thought card');
  assert(t.indexOf('专注度曲线') >= 0, 'no curve');
  assert(t.indexOf('时间轴') >= 0, 'no timeline');
});
step('no DSH api after import', () => {
  assert(!fetched.some((u) => u.indexOf('/api/worktable') >= 0), 'called DSH api');
});
step('mobile paths display local', () => {
  click(qa('#tabs .dshell-tab')[3]);
  const t = $('view').textContent;
  assert(t.indexOf('本机存储') >= 0, 'no local storage label');
  assert(t.indexOf('手机版不直连飞书') >= 0, 'no feishu mobile note');
});
step('export uses share or download no throw', () => {
  const b = q('[data-act="export"]'); if (b) click(b);
});
await sleep(300);
console.log('=== errors ' + errors.length + ' ===');
errors.slice(0, 12).forEach((e) => console.log(e));
process.exit(errors.length ? 1 : 0);
