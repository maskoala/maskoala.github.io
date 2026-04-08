(function () {
    var nav = document.getElementById('page-nav');
    if (!nav) return;

    var trigger = document.querySelector('.metabar');
    var sections = Array.from(document.querySelectorAll('.section[id]'));
    var items = Array.from(nav.querySelectorAll('[data-target]'));

    function update() {
        // Show after metabar scrolls out of view
        if (trigger) {
            var bottom = trigger.getBoundingClientRect().bottom;
            nav.classList.toggle('page-nav--visible', bottom < 0);
        }

        // Active section — default to 'overview' until first section is reached
        var navHeight = trigger ? trigger.getBoundingClientRect().height : 0;
        var threshold = (topNav ? topNav.offsetHeight : 72) + 24;
        var active = 'overview';
        for (var i = 0; i < sections.length; i++) {
            if (sections[i].getBoundingClientRect().top <= threshold) {
                active = sections[i].id;
            }
        }
        items.forEach(function (item) {
            item.classList.toggle('page-nav-item--active', item.dataset.target === active);
        });
    }

    // Click handler
    var topNav = document.querySelector('.nav');
    nav.addEventListener('click', function (e) {
        var item = e.target.closest('[data-target]');
        if (!item) return;
        e.preventDefault();
        var target = item.dataset.target;
        if (target === 'overview') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            var section = document.getElementById(target);
            if (section) {
                var navHeight = topNav ? topNav.offsetHeight : 72;
                var top = window.scrollY + section.getBoundingClientRect().top - navHeight - 16;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        }
    });

    window.addEventListener('scroll', update, { passive: true });
    update();
})();
