// ── Page Transition ──
(function() {
    var doc = document.documentElement;
    var overlay = document.querySelector('.page-transition');
    if (!overlay) return;

    // Phase 2: arriving on new page — clip the overlay away to reveal content
    if (sessionStorage.getItem('page-transition')) {
        sessionStorage.removeItem('page-transition');
        overlay.classList.add('leaving');
        overlay.addEventListener('animationend', function handler(e) {
            if (e.animationName === 'clipOut') {
                overlay.classList.remove('leaving');
                doc.classList.remove('transition-arriving');
                doc.classList.remove('transitioning');
                overlay.removeEventListener('animationend', handler);
            }
        });
    }

    // Phase 1: clip overlay in, show text, hold, then navigate
    var navigating = false;
    document.addEventListener('click', function(e) {
        if (navigating) return;

        var link = e.target.closest('a[href], [data-href]');
        if (!link) return;

        var href = link.getAttribute('href') || link.getAttribute('data-href');
        if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto:')) return;
        if (href === window.location.pathname) return;

        e.preventDefault();
        navigating = true;
        doc.classList.add('transitioning');
        sessionStorage.setItem('page-transition', '1');
        overlay.classList.add('entering');

        overlay.addEventListener('animationend', function handler(e) {
            if (e.animationName === 'textFadeIn') {
                overlay.removeEventListener('animationend', handler);
                setTimeout(function() {
                    window.location.href = href;
                }, 400);
            }
        });
    });

    // Convert onclick work-items to data-href
    document.querySelectorAll('.work-item[onclick]').forEach(function(item) {
        var str = item.getAttribute('onclick');
        var m = str && str.match(/window\.location\.href\s*=\s*'([^']+)'/);
        if (m) {
            item.removeAttribute('onclick');
            item.setAttribute('data-href', m[1]);
        }
    });
})();
