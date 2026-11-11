import fs from 'fs';
import zlib from 'zlib';

function createPng(width, height, r, g, b) {
  // Minimal PNG generator in pure Node.js
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf) {
    let table = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ (-1)) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const body = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body), 0);
    return Buffer.concat([len, body, crc]);
  }

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: 2 (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image data with scanline filter bytes
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // filter type 0: none
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;
      // Draw a dark slate background (#0f172a = 15, 23, 42) with cyan border and center mark
      const isBorder = (x < 12 || x >= width - 12 || y < 12 || y >= height - 12);
      const isCenter = Math.hypot(x - width/2, y - height/2) < width * 0.28;
      if (isBorder) {
        rawData[pxOffset] = 6;    // R
        rawData[pxOffset + 1] = 182; // G
        rawData[pxOffset + 2] = 212; // B (#06b6d4)
      } else if (isCenter) {
        rawData[pxOffset] = 2;    // R
        rawData[pxOffset + 1] = 132; // G
        rawData[pxOffset + 2] = 199; // B (#0284c7)
      } else {
        rawData[pxOffset] = 15;
        rawData[pxOffset + 1] = 23;
        rawData[pxOffset + 2] = 42;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const pwa192 = createPng(192, 192);
fs.writeFileSync('public/pwa-192x192.png', pwa192);

const pwa512 = createPng(512, 512);
fs.writeFileSync('public/pwa-512x512.png', pwa512);

const pwaMaskable = createPng(512, 512);
fs.writeFileSync('public/pwa-maskable-512x512.png', pwaMaskable);

const appleTouch = createPng(180, 180);
fs.writeFileSync('public/apple-touch-icon.png', appleTouch);

console.log('PNG icons generated successfully.');
