(function () {
    var footnotePlugin = function (hook, vm) {
        hook.beforeEach(function(markdown) {
            markdown = markdown.replaceAll('\r\n', '\n');

            const footnoteRegex = /(^\[\^.+?\]:.+?(?=(\n\n|\n$|\n\[\^.+?\]:|$(?!\n))))|(\^\[.+?\])/gsm;

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
                let i = 1;
                matchList.forEach(function(e) {
                    if (/\^\[.*?\]/s.test(e)) { // inline-style footnote
                        markdown = markdown.replace(
                            e, 
                            `<sup class="footnote-symbol" id="ft-${i}">[\[${i}\]](#ftref-${i})</sup>`
                        );
            
                        footnoteList.push(
                            `${i}. ${e.match(/\[(.*)\]/s)[1].trim().replaceAll('\n', '<br />')} <stronge id="ftref-${i}">[↩︎](#ft-${i})</stronge>\n`
                        );

                        i++;
                    }else { // reference-style footnote
                        const noteMap = e.split(/(?<=\]):/);
                        const refRegex = new RegExp('\\[\\^'+noteMap[0].replace(/[\[\^\]]/g, '')+'\\](?!:)', 'g');

                        markdown = markdown.replace(e, '');

                        const refMatchList = markdown.match(refRegex);
                        if (refMatchList) {
                            const subAnchorIconList = [];
                            refMatchList.forEach(function(e1, j) {
                                const subAnchor = j > 0 ? '-'+j : '';
                                const displayIndex = $props.hideSubAnchor ? i : i+subAnchor;
                                markdown = markdown.replace(
                                    noteMap[0],
                                    `<sup class="footnote-symbol" id="ft-${i+subAnchor}">[\[${displayIndex}\]](#ftref-${i+subAnchor})</sup>`
                                );

                                subAnchorIconList.push(`<stronge id="ftref-${i+subAnchor}">[↩︎](#ft-${i+subAnchor})</stronge>`)
                            });

                            footnoteList.push(
                                `${i}. ${noteMap[1].trim().replaceAll('\n', '<br />')} ${subAnchorIconList.join(' ')}\n`
                            );

                            i++;
                        }
                    }
                })

                markdown += `\n\n---\n ${footnoteList.join('')}`;
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

    $props = $docsify.docsifyFootnote || {};

    $docsify.plugins = [].concat($docsify.plugins || [], footnotePlugin);
})();
