// 等待文档加载完成
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    let fuse;
    let data;

    // 1. 加载 JSON 数据
    fetch('/index.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            // 2. 配置 Fuse.js
            const options = {
                keys: ['title', 'tags', 'summary'], // 你想要搜索的字段
                includeScore: true,
                threshold: 0.4, // 匹配的模糊度，0.0 是完全匹配，1.0 是任意匹配
                minMatchCharLength: 2, // 最小触发搜索的字符长度
            };
            fuse = new Fuse(data, options);
        })
        .catch(error => console.error('无法加载搜索索引:', error));

    // 3. 监听输入框事件
    searchInput.addEventListener('input', function () {
        const query = this.value;

        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }

        const results = fuse.search(query);
        displayResults(results);
    });

    // 4. 显示搜索结果
    function displayResults(results) {
        resultsContainer.innerHTML = ''; // 清空之前的结果

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>没有找到相关内容。</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'search-results-list';

        results.forEach(result => {
            const item = result.item;
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="${item.permalink}">
                    <h3>${item.title}</h3>
                </a>
                <p>${item.summary}</p>
            `;
            ul.appendChild(li);
        });

        resultsContainer.appendChild(ul);
    }
});