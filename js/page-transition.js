(function() {
    document.documentElement.classList.remove('no-js');
    var body = document.body;
    if (!body) return;

    function scrollToHash(hash) {
        if (!hash || hash === '#') return false;
        var id = hash.charAt(0) === '#' ? hash : '#' + hash;
        var el = document.querySelector(id);
        if (!el) return false;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
    }

    function ready() {
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                body.classList.remove('page-transition-enter');
                body.classList.add('page-transition-ready');
                if (location.hash) {
                    setTimeout(function() { scrollToHash(location.hash); }, 50);
                }
            });
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ready);
    } else {
        ready();
    }

    document.addEventListener('click', function(e) {
        var a = e.target.closest('a');
        if (!a || !a.href) return;
        var href = a.getAttribute('href');
        if (!href || href === '#' || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:') || a.target === '_blank') return;

        if (href.charAt(0) === '#') {
            if (scrollToHash(href)) {
                e.preventDefault();
                if (history.pushState) history.pushState(null, '', href);
            }
            return;
        }

        try {
            var url = new URL(a.href, location.href);
            if (url.origin !== location.origin) return;
            if (url.pathname === location.pathname && url.search === location.search) {
                if (url.hash && scrollToHash(url.hash)) {
                    e.preventDefault();
                    if (history.pushState) history.pushState(null, '', url.hash);
                }
                return;
            }
        } catch (_) { return; }

        e.preventDefault();
        body.classList.add('page-transition-exit');
        setTimeout(function() { location.href = a.href; }, 380);
    }, true);
})();
