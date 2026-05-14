const fs = require('fs');

const files = ['module.js', 'extension2.js', 'extension_ko.js', 'ion_common.js'];

const patterns = {
  '\\.bind\\(': /\.bind\(/g,
  '\\.unbind\\(': /\.unbind\(/g,
  '\\.delegate\\(': /\.delegate\(/g,
  '\\.undelegate\\(': /\.undelegate\(/g,
  '\\.live\\(': /\.live\(/g,
  '\\.die\\(': /\.die\(/g,
  '\\.size\\(': /\.size\(\)/g,
  '\\.error\\(': /\.error\(/g,
  '\\.load\\(': /\.load\(/g,
  '\\.unload\\(': /\.unload\(/g,
  '\\$\\.isArray\\(': /\$\.isArray\(/g,
  '\\$\\.isFunction\\(': /\$\.isFunction\(/g,
  '\\$\\.isWindow\\(': /\$\.isWindow\(/g,
  '\\$\\.type\\(': /\$\.type\(/g,
  '\\$\\.trim\\(': /\$\.trim\(/g,
  '\\$\\.browser': /\$\.browser/g,
  '\\$\\.now\\(': /\$\.now\(/g,
  '\\$\\.parseJSON\\(': /\$\.parseJSON\(/g,
  '\\$\\.support': /\$\.support/g
};

let totalCounts = {};

files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    console.log(`\n--- Analysis for ${file} ---`);
    for (let [name, regex] of Object.entries(patterns)) {
      const count = (content.match(regex) || []).length;
      if (count > 0) {
        console.log(`${name}: ${count}`);
        totalCounts[name] = (totalCounts[name] || 0) + count;
      }
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log(`\n--- Total Counts ---`);
console.table(totalCounts);
