document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const escHint = document.getElementById('esc-hint');

    if (searchInput && resultsContainer && escHint) {
        let fuse;

        fetch('/index.json')
            .then(response => response.json())
            .then(data => {
                const options = {
                    includeMatches: true,
                    includeScore: true, // 必须为 true 才能获取 score 用于排序
                    minMatchCharLength: 2,
                    threshold: 0.4,
                    ignoreLocation: true,
                    keys: [
                        { name: "title", weight: 0.7 },
                        { name: "tags", weight: 0.5 },
                        { name: "content", weight: 0.3 }
                    ]
                };
                fuse = new Fuse(data, options);
            })
            .catch(error => console.error('Could not load or parse search index:', error));

        function clearSearch() {
            searchInput.value = '';
            resultsContainer.innerHTML = '';
            escHint.style.display = 'none';
        }

        searchInput.addEventListener('input', function () {
            const query = this.value.trim();
            if (query) {
                escHint.style.display = 'flex';
                if (fuse) {
                    const results = fuse.search(query);
                    displayResults(results); // 将原始结果传递给 displayResults
                }
            } else {
                clearSearch();
            }
        });

        searchInput.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                clearSearch();
            }
        });

        function displayResults(results) {
            // --- 排序逻辑在这里 ---
            results.sort((a, b) => {
                // 第一级排序：按相关度分数（score）升序排列（分数越小越相关）
                if (a.score !== b.score) {
                    return a.score - b.score;
                }
                // 第二级排序：如果分数相同，则按日期（date）降序排列（日期越新越靠前）
                return new Date(b.item.date) - new Date(a.item.date);
            });
            // --- 排序逻辑结束 ---

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

