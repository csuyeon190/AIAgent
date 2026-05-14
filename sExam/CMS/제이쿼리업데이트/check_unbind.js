const fs = require('fs');
const content = fs.readFileSync('d:/jqueryUpgrade/libs.js', 'utf8');
let match;
const regex = /\.unbind\((.{0,30})/g;
while ((match = regex.exec(content)) !== null) {
  console.log(match[0]);
}
