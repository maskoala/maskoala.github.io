// ── Before / After Slider ──
(function() {
    document.querySelectorAll('.ba-slider').forEach(function(slider) {
        var before = slider.querySelector('.ba-before');
        var handle = slider.querySelector('.ba-handle');
        var dragging = false;

        // Match before-image width to slider width so both images align
        var beforeImg = before.querySelector('img');
        function syncSize() {
            beforeImg.style.width = slider.offsetWidth + 'px';
        }
        syncSize();
        window.addEventListener('resize', syncSize);

        function setPosition(x) {
            var rect = slider.getBoundingClientRect();
            var pct = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
            before.style.width = (pct * 100) + '%';
            handle.style.left = (pct * 100) + '%';
        }

        slider.addEventListener('mousedown', function(e) {
            e.preventDefault();
            dragging = true;
            setPosition(e.clientX);
        });
        window.addEventListener('mousemove', function(e) {
            if (dragging) setPosition(e.clientX);
        });
        window.addEventListener('mouseup', function() {
            dragging = false;
        });

        slider.addEventListener('touchstart', function(e) {
            dragging = true;
            setPosition(e.touches[0].clientX);
        }, { passive: true });
        window.addEventListener('touchmove', function(e) {
            if (dragging) setPosition(e.touches[0].clientX);
        }, { passive: true });
        window.addEventListener('touchend', function() {
            dragging = false;
        });
    });
})();
