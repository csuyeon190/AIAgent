const fs = require('fs');
const content = fs.readFileSync('d:/jqueryUpgrade/libs.js', 'utf8');
const matches = content.match(/.{0,20}\.bind\(/g) || [];
const unique = [...new Set(matches.map(m => m.trim()))];
console.log(unique);
