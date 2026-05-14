const fs = require('fs');

const files = ['module.js', 'extension2.js', 'extension_ko.js', 'ion_common.js'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // 1. .bind( -> .on(
    content = content.replace(/\.bind\(/g, '.on(');
    
    // 2. .unbind( -> .off(
    content = content.replace(/\.unbind\(/g, '.off(');
    
    // 3. $(window).load(function... -> $(window).on('load', function...
    content = content.replace(/\$\(window\)\.load\(/g, '$(window).on(\'load\', ');
    
    // 4. $.trim(content) -> (content || '').trim()
    content = content.replace(/\$\.trim\(([^)]+)\)/g, '($1 || "").trim()');
    
    // 5. AJAX .load() is actually kept in some cases, but if we have $.fn.load removed in jQuery 4, we might need a workaround. 
    // However, for extension_ko.js there are 4 AJAX loads:
    // $('#header .M00_A').load(...)
    // $("#footer").load(...)
    // Let's replace $.fn.load for ajax with a custom implementation just in case, or leave it to jquery-migrate.
    // Given the complexity of jQuery.fn.load (handles selectors like "url #foo"), it's better to let jquery-migrate handle it or keep it if jQuery 4 doesn't remove it.
    // jQuery 4.0 removes jQuery.fn.load. So we should replace $(el).load(url, callback).
    // Let's manually replace the known ajax loads in extension_ko.js and module.js
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
