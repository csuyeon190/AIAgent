const fs = require('fs');
const content = fs.readFileSync('d:/jqueryUpgrade/libs.js', 'utf8');
const match = content.match(/\.size\(\)/g);
console.log('size() count:', match ? match.length : 0);
