const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

test('all local page assets exist and IDs are unique', () => {
  for (const page of ['index.html', 'politicas-certificados.html']) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, `Duplicate IDs in ${page}`);
    for (const [, url] of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
      if (/^(?:[a-z]+:|#|\/\/)/i.test(url)) continue;
      const file = decodeURIComponent(url.split(/[?#]/)[0]);
      if (file) assert.ok(fs.statSync(path.join(root, file)).isFile(), `${page}: ${file}`);
    }
  }
});

test('browser scripts parse without syntax errors', () => {
  for (const file of fs.readdirSync(path.join(root, 'js')).filter(file => file.endsWith('.js'))) {
    assert.doesNotThrow(() => new vm.Script(fs.readFileSync(path.join(root, 'js', file), 'utf8'), { filename: file }));
  }
});
