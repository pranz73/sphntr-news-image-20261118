import { copyFile, mkdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
const sourcePath = new URL(source);
const destination = resolve(outputDir, 'entry.png');

let sourceInfo;
try {
  sourceInfo = await stat(sourcePath);
} catch (error) {
  if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
    throw new Error(`Required entry image is missing: ${sourcePath.pathname}`);
  }
  throw error;
}

await mkdir(outputDir, { recursive: true });
await copyFile(sourcePath, destination);
const writtenInfo = await stat(destination);
if (writtenInfo.size !== sourceInfo.size) {
  throw new Error(`Copied entry.png size mismatch: expected ${sourceInfo.size} bytes, wrote ${writtenInfo.size} bytes.`);
}
console.log(`Copied entry.png (${writtenInfo.size} bytes).`);
