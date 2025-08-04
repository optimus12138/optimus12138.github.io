document.addEventListener('DOMContentLoaded', function () {
    // 获取需要的元素
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const escHint = document.getElementById('esc-hint'); // 新增：获取提示元素

    // 安全检查
    if (searchInput && resultsContainer && escHint) {
        let fuse;

        // 加载索引文件 (不变)
        fetch('/index.json')
            .then(response => response.json())
            .then(data => {
                const options = {
                    includeMatches: true, includeScore: true, minMatchCharLength: 2,
                    threshold: 0.4, ignoreLocation: true,
                    keys: [
                        { name: "title", weight: 0.7 },
                        { name: "tags", weight: 0.5 },
                        { name: "content", weight: 0.3 }
                    ]
                };
                fuse = new Fuse(data, options);
            })
            .catch(error => console.error('Could not load or parse search index:', error));

        // 清除搜索的函数
        function clearSearch() {
            searchInput.value = '';
            resultsContainer.innerHTML = '';
            escHint.style.display = 'none'; // 隐藏提示
        }

        // 监听输入事件
        searchInput.addEventListener('input', function () {
            const query = this.value.trim();
            if (query) {
                escHint.style.display = 'flex'; // 有文字，显示提示
                if (fuse) {
                    const results = fuse.search(query);
                    displayResults(results);
                }
            } else {
                clearSearch(); // 没文字，调用清除函数（会隐藏提示）
            }
        });

        // Esc 键事件 (核心功能)
        searchInput.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                clearSearch();
            }
        });

        // 显示结果的函数 (不变)
        function displayResults(results) {
            resultsContainer.innerHTML = '';
            if (results.length === 0) {
                resultsContainer.innerHTML = '<p>没有找到相关内容。</p>';
                return;
            }
            const ul = document.createElement('ul');
            ul.className = 'search-results-list';
            results.slice(0, 10).forEach(result => {
                const item = result.item;
                const li = document.createElement('li');
                let summary = '';
                const matches = result.matches;
                if (matches && matches.length > 0) {
                    const contentMatch = matches.find(match => match.key === "content");
                    if (contentMatch) {
                        const { indices, value } = contentMatch;
                        const bestMatch = indices[0];
                        const [start, end] = bestMatch;
                        const prefix_start = Math.max(start - 30, 0);
                        const suffix_end = Math.min(end + 31, value.length);
                        const prefix = value.substring(prefix_start, start);
                        const matched_text = value.substring(start, end + 1);
                        const suffix = value.substring(end + 1, suffix_end);
                        summary = `...${prefix}<mark>${matched_text}</mark>${suffix}...`;
                    }
                }
                if (!summary) {
                    summary = item.content ? item.content.substring(0, 150) + '...' : '';
                }
                li.innerHTML = `<a href="${item.permalink}"><h3>${item.title}</h3></a><p>${summary}</p>`;
                ul.appendChild(li);
            });
            resultsContainer.appendChild(ul);
        }
    }
});