const fs = require('fs');
const content = fs.readFileSync('d:/jqueryUpgrade/libs.js', 'utf8');
const match = content.match(/.{0,50}\.delegate\(.{0,50}/g);
console.log(match);
