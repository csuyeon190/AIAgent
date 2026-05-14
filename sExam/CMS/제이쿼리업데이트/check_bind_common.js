const fs = require('fs');
const content = fs.readFileSync('d:/jqueryUpgrade/common_module.js', 'utf8');
console.log('bind:', content.match(/\.bind\(/g)?.length || 0);
console.log('unbind:', content.match(/\.unbind\(/g)?.length || 0);
