const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('local preview serves assets, HEAD, errors and protects development files', async () => {
  const source = fs.readFileSync(path.join(__dirname, '../server.js'), 'utf8');
  assert.match(source, /require\.main === module/, 'Importing the server must not start a listening process');
  const { createServer } = require('../server.js');
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    let res = await fetch(base + '/');
    assert.equal(res.status, 200);
    assert.match(await res.text(), /Datweb/);
    res = await fetch(base + '/css/refinements.css');
    assert.match(res.headers.get('content-type'), /text\/css/);
    res = await fetch(base + '/media/datweb-vizage-biometria.jpg');
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type'), /image\/jpeg/);
    res = await fetch(base + '/index.html', { method: 'HEAD' });
    assert.equal(res.status, 200);
    assert.equal(await res.text(), '');
    for (const route of ['/.git/config', '/.env', '/backup-home-2026-10-29/index.html', '/missing.html']) {
      assert.equal((await fetch(base + route)).status, 404, route);
    }
    assert.equal((await fetch(base + '/%E0%A4%A')).status, 400);
    assert.equal((await fetch(base + '/', { method: 'POST' })).status, 405);
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
