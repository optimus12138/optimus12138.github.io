'use strict';
document.addEventListener('DOMContentLoaded', function() {
    console.log('【调试】脚本已加载，开始执行...');

    // 1. 获取需要操作的元素
    const copyButton = document.getElementById('copy-rss-button');
    const toast = document.getElementById('copy-toast');
    console.log('【调试】查找元素完成。按钮:', copyButton, '提示框:', toast);

    // 2. 确保按钮存在
    if (copyButton) {
        console.log('【调试】按钮存在，准备添加点击事件监听器...');
        
        // 3. 监听按钮的点击事件
        copyButton.addEventListener('click', function(event) {
            // ****** 这是最关键的一条日志 ******
            console.log('【调试】RSS 按钮被点击了！');
            
            event.preventDefault();

            const rssUrl = this.dataset.rssUrl;
            console.log('【调试】获取到的 RSS URL:', rssUrl);
            if (!rssUrl) {
                console.error('【调试】错误：未在 data-rss-url 属性中找到链接。');
                return;
            }

            // 4. 执行复制操作
            if (navigator.clipboard && window.isSecureContext) {
                console.log('【调试】尝试使用现代 Clipboard API 复制...');
                navigator.clipboard.writeText(rssUrl).then(function() {
                    console.log('【调试】Clipboard API 复制成功！');
                    showToast();
                }).catch(function(err) {
                    console.error('【调试】Clipboard API 失败，尝试备用方法。', err);
                    fallbackCopy(rssUrl);
                });
            } else {
                console.log('【调试】浏览器不支持或非安全环境，使用备用方法。');
                fallbackCopy(rssUrl);
            }
        });
        
        console.log('【调试】点击事件监听器已添加。');

    } else {
        console.error('【调试】错误：未能在页面上找到 id="copy-rss-button" 的按钮。');
    }

    // 5. 显示提示框的函数
    function showToast() {
        console.log('【调试】执行 showToast 函数，准备显示提示框。');
        if (toast) {
            toast.classList.add('show');
            setTimeout(function() {
                toast.classList.remove('show');
            }, 2000);
        } else {
            console.error('【调试】错误：无法找到 toast 元素来显示。');
        }
    }

    // 6. 兼容旧浏览器的备用复制方法
    function fallbackCopy(text) {
        console.log('【调试】执行备用复制方法 fallbackCopy...');
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                console.log('【调试】备用方法复制成功！');
                showToast();
            } else {
                console.error('【调试】备用方法复制失败。');
            }
        } catch (err) {
            console.error('【调试】备用方法执行时捕获到错误。', err);
        }
        document.body.removeChild(textArea);
    }
});
;
// Navbar scroll hide/show
(function () {
  var navbar = document.querySelector(".navbar");
  if (!navbar) return;

  var lastScrollY = window.scrollY;
  var ticking = false;

  function onScroll() {
    var currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
      navbar.classList.remove("navbar--hidden");
    } else if (currentScrollY > lastScrollY) {
      navbar.classList.add("navbar--hidden");
    } else {
      navbar.classList.remove("navbar--hidden");
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  });
})();

;
'use strict';

// Table of Contents ScrollSpy
document.addEventListener('DOMContentLoaded', function() {
    const toc = document.querySelector('.toc');
    if (!toc) return; // No TOC on this page

    const tocLinks = toc.querySelectorAll('#TableOfContents a[href^="#"]');
    if (tocLinks.length === 0) return;

    // Get all section headings that have corresponding TOC links
    const sections = Array.from(tocLinks).map(link => {
        const id = link.getAttribute('href').substring(1);
        return document.getElementById(id);
    }).filter(section => section !== null);

    if (sections.length === 0) return;

    // Remove any existing active classes
    function clearActiveLinks() {
        tocLinks.forEach(link => {
            link.classList.remove('active');
        });
    }

    // Set active link based on current scroll position
    function setActiveLink() {
        // Get current scroll position
        const scrollPos = window.scrollY + 100; // offset for better UX

        // Find the current section
        let currentSection = null;
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.offsetTop <= scrollPos) {
                currentSection = section;
                break;
            }
        }

        // Clear all active classes
        clearActiveLinks();

        // If we found a current section, activate the corresponding link
        if (currentSection) {
            const currentLink = toc.querySelector(`a[href="#${currentSection.id}"]`);
            if (currentLink) {
                currentLink.classList.add('active');
            }
        } else {
            // If no section found (scrolled to top), activate the first link
            tocLinks[0]?.classList.add('active');
        }
    }

    // Throttle scroll events for performance
    let ticking = false;
    function updateOnScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                setActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Initial activation
    setActiveLink();

    // Listen to scroll events
    window.addEventListener('scroll', updateOnScroll);

    // Update on hash change (when user clicks TOC links)
    window.addEventListener('hashchange', setActiveLink);

    // Clicking on TOC links should also update active state
    tocLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Small delay to allow hash change to take effect
            setTimeout(setActiveLink, 100);
        });
    });

    // Optional: Auto-expand details element if it's collapsed
    const detailsElement = toc.closest('details');
    if (detailsElement && !detailsElement.open) {
        // Auto-open TOC on desktop for better UX
        if (window.innerWidth >= 1200) {
            detailsElement.open = true;
        }
    }
});
;
window.addEventListener('load', () => {
    const gttButton = document.getElementById("totop");
    if (!gttButton) return;
    window.onscroll = () => {
        if (
            document.body.scrollTop > 300 ||
            document.documentElement.scrollTop > 300
        ) {
            gttButton.style.visibility = "visible";
            gttButton.style.opacity = "1";
        } else {
            gttButton.style.visibility = "hidden";
            gttButton.style.opacity = "0";
        }
    };
});
