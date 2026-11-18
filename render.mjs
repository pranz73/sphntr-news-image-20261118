import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const page = `file://${resolve(root, 'index.html')}`;
const target = resolve(root, 'entry.png');
const policy = '/var/lib/hatch-browser/rootfs-base/usr/share/hatch/chromium/webgl-allowed-domains.txt';
const chrome = spawn('/opt/meta-chromium/chrome', [
  '--headless', '--no-sandbox', '--disable-gpu', '--remote-allow-origins=*',
  '--remote-debugging-port=9223', '--user-data-dir=/tmp/makefun-news-chrome',
  '--window-size=1024,1024', '--force-device-scale-factor=1',
  `--hatch-webgl-allowed-domains-file=${policy}`,
  '--hatch-webgl-allowed-domains-sha256=8097045f0459c96c4cdc76e3a1af4e0f43f640b4b59c43d6db35e3641c0264c6',
  'about:blank'
], { stdio: 'ignore' });

async function waitForVersion() {
  for (let i = 0; i < 80; i++) {
    try { return await (await fetch('http://127.0.0.1:9223/json/version')).json(); }
    catch { await new Promise(r => setTimeout(r, 250)); }
  }
  throw new Error('Chromium DevTools did not start');
}

try {
  await waitForVersion();
  const response = await fetch(`http://127.0.0.1:9223/json/new?${encodeURIComponent(page)}`, { method: 'PUT' });
  if (!response.ok) throw new Error(`Could not open render page: ${response.status}`);
  const tab = await response.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = event => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, msg => msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result));
    ws.send(JSON.stringify({ id: requestId, method, params }));
  });
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1024, height: 1024, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: page });
  await new Promise(r => setTimeout(r, 700));
  await send('Page.bringToFront');
  const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  await writeFile(target, Buffer.from(shot.data, 'base64'));
  ws.close();
} finally {
  chrome.kill('SIGTERM');
}
