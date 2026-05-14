const fs = require('fs');
const content = fs.readFileSync('d:/jqueryUpgrade/common_module.js', 'utf8');
console.log('isArray:', content.match(/\$\.isArray|jQuery\.isArray/g)?.length || 0);
console.log('parseJSON:', content.match(/\$\.parseJSON|jQuery\.parseJSON/g)?.length || 0);
console.log('now:', content.match(/\$\.now\(\)|jQuery\.now\(\)/g)?.length || 0);
console.log('trim:', content.match(/\$\.trim\([^)]+\)|jQuery\.trim\([^)]+\)/g)?.length || 0);
console.log('isWindow:', content.match(/\$\.isWindow|jQuery\.isWindow/g)?.length || 0);
console.log('isNumeric:', content.match(/\$\.isNumeric|jQuery\.isNumeric/g)?.length || 0);
