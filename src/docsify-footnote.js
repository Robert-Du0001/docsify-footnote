(function () {
    var footnotePlugin = function (hook, vm) {
        hook.beforeEach(function(markdown) {
            console.log(markdown);
            const footnoteRegex = /(\[\^.+\]:\s.*(\n|$))|(\^\[.*?\])/gm;

            // To temporarily bypass footnotes within code blocks, replace all code blocks with placeholders first.
            const codeBlocks = markdown.match(/```.*?```/gsm);
            if (codeBlocks) {
                codeBlocks.forEach(function(e, i) {
                    markdown = markdown.replace(e, '```'+i+'```');
                })
            }

            if (footnoteRegex.test(markdown)) {
                const matchList = markdown.match(footnoteRegex);

                const footnoteList = [];
                matchList.forEach(function(e, i) {
                    // inline-style footnote
                    if (/\^\[.*?\]/.test(e)) {
                        markdown = markdown.replace(
                            e, 
                            `<sup class="footnote-symbol" id="ft-${i}">[\[${i+1}\]](#ftref-${i})</sup>`
                        );
            
                        footnoteList.push(
                            `${i}. ${e.match(/\[(.*)\]/)[1]} <stronge id="ftref-${i}">[↩︎](#ft-${i})</stronge>\n`
                        );
                    }else { // reference-style footnote
                        const noteMap = e.split(': ');

                        markdown = markdown.replace(
                            noteMap[0], 
                            `<sup class="footnote-symbol" id="ft-${i}">[\[${i+1}\]](#ftref-${i})</sup>`
                        ).replace(e, '');
            
                        footnoteList.push(
                            `${i}. ${noteMap[1].replace('\n', '')} <stronge id="ftref-${i}">[↩︎](#ft-${i})</stronge>\n`
                        );
                    }
                })

                markdown += `\n---\n ${footnoteList.join('')}`;
            }

            // restore code blocks
            if (codeBlocks) {
                codeBlocks.forEach(function(e, i) {
                    markdown = markdown.replace('```'+i+'```', e);
                });
            }

            return markdown;
        });
    };

    // Add plugin to docsify's plugin array
    $docsify = $docsify || {};
    $docsify.plugins = [].concat($docsify.plugins || [], footnotePlugin);
})();
