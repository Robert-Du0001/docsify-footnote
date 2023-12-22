(function () {
    var footnotePlugin = function (hook, vm) {
        hook.beforeEach(function(html) {
            const footnoteRegex = /(\[\^.+\]:\s.*(\n|$))|(\^\[.*?\])/gm;

            if (footnoteRegex.test(html)) {
                const matchList = html.match(footnoteRegex);

                const footnoteList = [];
                matchList.forEach(function(e, i) {
                    // inline-style footnote
                    if (/\^\[.*?\]/.test(e)) {
                        html = html.replace(
                            e, 
                            `<sup class="footnote-symbol" id="ft-${i}">[\[${i+1}\]](#ftref-${i})</sup>`
                        );
            
                        footnoteList.push(
                            `${i}. ${e.match(/\[(.*)\]/)[1]} <stronge id="ftref-${i}">[↩︎](#ft-${i})</stronge>\n`
                        );
                    }else { // reference-style footnote
                        const noteMap = e.split(': ');

                        html = html.replace(
                            noteMap[0], 
                            `<sup class="footnote-symbol" id="ft-${i}">[\[${i+1}\]](#ftref-${i})</sup>`
                        ).replace(e, '');
            
                        footnoteList.push(
                            `${i}. ${noteMap[1].replace('\n', '')} <stronge id="ftref-${i}">[↩︎](#ft-${i})</stronge>\n`
                        );
                    }
                })

                html += `\n---\n ${footnoteList.join('')}`;
            }

            return html;
        });
    };

    // Add plugin to docsify's plugin array
    $docsify = $docsify || {};
    $docsify.plugins = [].concat($docsify.plugins || [], footnotePlugin);
})();
