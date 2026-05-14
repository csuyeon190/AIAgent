const fs = require('fs');

let content = fs.readFileSync('module.js', 'utf8');

// First replacement
let target1 = `$($menuPanel_d2)
                                .addClass('renewal cstm_scrl')
                                .load(path + exclude[_excludeIndex].file, function() {
                                    // callback complete
                                    resizeGsnbDropdownMenu();
                                });`;

let replacement1 = `$($menuPanel_d2).addClass('renewal cstm_scrl');
                            $.get(path + exclude[_excludeIndex].file, function(data) {
                                $($menuPanel_d2).html(data);
                                // callback complete
                                resizeGsnbDropdownMenu();
                            });`;

content = content.replace(target1, replacement1);

// Second replacement
let target2 = `$($menuPanel_d2)
                    .addClass('renewal')
                    .load(path + exclude[_excludeIndex].file, function() {
                        // callback complete
                    });`;

let replacement2 = `$($menuPanel_d2).addClass('renewal');
                $.get(path + exclude[_excludeIndex].file, function(data) {
                    $($menuPanel_d2).html(data);
                    // callback complete
                });`;

content = content.replace(target2, replacement2);

fs.writeFileSync('module.js', content, 'utf8');
console.log('Successfully replaced .load() in module.js');
