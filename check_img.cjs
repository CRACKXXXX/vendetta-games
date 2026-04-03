const fs = require('fs');
const b = fs.readFileSync('public/cursor-normal.png');
console.log('normal:', b.readUInt32BE(16), 'x', b.readUInt32BE(20));
const h = fs.readFileSync('public/cursor-hover.png');
console.log('hover:', h.readUInt32BE(16), 'x', h.readUInt32BE(20));
