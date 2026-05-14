const fs = require('fs');
let content = fs.readFileSync('d:/jqueryUpgrade/libs.js', 'utf8');

// Replace .delegate("a, img", c, ...) -> .on(c, "a, img", ...)
content = content.replace(/\.delegate\("a, img", c,/g, '.on(c, "a, img",');

// Replace .unbind( -> .off( globally, since native JS doesn't have .unbind()
content = content.replace(/\.unbind\(/g, '.off(');

// Replace .bind( -> .on( UNLESS it's .bind(this) or .bind(this.parent)
// We use a negative lookahead to ensure the argument is not 	his or 	his.something
// Note: \s*this is excluded.
content = content.replace(/\.bind\((?!\s*this[\),\.])/g, '.on(');

fs.writeFileSync('d:/jqueryUpgrade/libs.js', content, 'utf8');
console.log('Replaced bindings in libs.js');
