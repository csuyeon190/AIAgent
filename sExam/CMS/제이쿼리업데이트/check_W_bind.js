const fs = require('fs');
const content = fs.readFileSync('d:/jqueryUpgrade/libs.js', 'utf8');
const index = content.indexOf('W.bind(z, J)');
console.log(content.substring(index - 100, index + 50));
