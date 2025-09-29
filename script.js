document.addEventListener('DOMContentLoaded', function () {
    var burger = document.getElementById('burger');
    var mobileMenu = document.getElementById('mobileMenu');
    var mobileClose = document.getElementById('mobileClose');
    var focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var lastFocusedBeforeOpen = null;

    function setBurgerInactive() {
        burger.classList.remove('force-show');
        burger.classList.add('inactive');
        burger.setAttribute('aria-hidden', 'true');
        burger.setAttribute('tabindex', '-1');
        if (burger.classList.contains('open')) {
            closeMobileMenu();
        }
    }

    function setBurgerActive() {
        burger.classList.remove('inactive');
        requestAnimationFrame(function () {
            burger.classList.add('force-show');
        });
        burger.setAttribute('aria-hidden', 'false');
        burger.removeAttribute('tabindex');
    }

    function openMobileMenu() {
        lastFocusedBeforeOpen = document.activeElement;
        mobileMenu.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        burger.classList.add('open');
        burger.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        trapFocus(mobileMenu);
        var first = mobileMenu.querySelector(focusableSelectors);
        if (first) first.focus();
    }

    function closeMobileMenu() {
        mobileMenu.style.display = 'none';
        document.body.style.overflow = '';
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        releaseFocusTrap();
        if (lastFocusedBeforeOpen) try { lastFocusedBeforeOpen.focus(); } catch (e) { }
    }

    burger.addEventListener('click', function (e) {
        if (burger.classList.contains('inactive')) return;
        var isOpen = burger.classList.toggle('open');
        if (isOpen) openMobileMenu(); else closeMobileMenu();
    });

    mobileClose.addEventListener('click', closeMobileMenu);
    mobileMenu.addEventListener('click', function (e) {
        if (e.target === mobileMenu) closeMobileMenu();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (mobileMenu.style.display === 'flex') closeMobileMenu();
        }
    });
    var trap = { enabled: false, first: null, last: null, container: null };
    function trapFocus(container) {
        var nodes = Array.prototype.slice.call(container.querySelectorAll(focusableSelectors));
        if (!nodes.length) return;
        trap.enabled = true;
        trap.container = container;
        trap.first = nodes[0];
        trap.last = nodes[nodes.length - 1];
        container.addEventListener('keydown', handleTrapKey);
    }
    function releaseFocusTrap() {
        if (!trap.enabled || !trap.container) return;
        trap.container.removeEventListener('keydown', handleTrapKey);
        trap.enabled = false;
        trap.container = null;
        trap.first = trap.last = null;
    }
    function handleTrapKey(e) {
        if (e.key !== 'Tab') return;
        if (!trap.first || !trap.last) return;
        if (e.shiftKey) {
            if (document.activeElement === trap.first) {
                e.preventDefault();
                trap.last.focus();
            }
        } else {
            if (document.activeElement === trap.last) {
                e.preventDefault();
                trap.first.focus();
            }
        }
    }
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        lastScrollY = window.scrollY;
    });
});