(function () {
    'use strict';

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.deck-nav-dot');
    const progress = document.querySelector('.deck-progress');
    const hint = document.querySelector('.deck-hint');
    const totalSlides = slides.length;
    let currentSlide = 0;

    // --- Slide Navigation ---

    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        slides[index].scrollIntoView({ behavior: 'smooth' });
    }

    function updateCurrent() {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;

        let closest = 0;
        let closestDist = Infinity;
        slides.forEach(function (slide, i) {
            var dist = Math.abs(slide.offsetTop - scrollTop);
            if (dist < closestDist) {
                closestDist = dist;
                closest = i;
            }
        });
        currentSlide = closest;

        // Update dots
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === currentSlide);
        });

        // Update progress bar
        var pct = totalSlides <= 1 ? 100 : (currentSlide / (totalSlides - 1)) * 100;
        if (progress) progress.style.width = pct + '%';

        // Update URL hash
        history.replaceState(null, '', '#slide-' + (currentSlide + 1));
    }

    // --- Keyboard Navigation ---

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            goToSlide(currentSlide + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            goToSlide(currentSlide - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSlide(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSlide(totalSlides - 1);
        }

        // Hide hint after first keypress
        if (hint) hint.classList.add('hidden');
    });

    // --- Dot Click Navigation ---

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            goToSlide(i);
        });
    });

    // --- Scroll Tracking ---

    var scrollTimer;
    window.addEventListener('scroll', function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(updateCurrent, 50);
    }, { passive: true });

    // --- Init from URL hash ---

    function initFromHash() {
        var hash = window.location.hash;
        var match = hash.match(/^#slide-(\d+)$/);
        if (match) {
            var idx = parseInt(match[1], 10) - 1;
            if (idx >= 0 && idx < totalSlides) {
                // Use instant scroll on load
                slides[idx].scrollIntoView();
                currentSlide = idx;
            }
        }
        updateCurrent();
    }

    // --- Hide hint on first scroll ---

    var scrollOnce = false;
    window.addEventListener('scroll', function () {
        if (!scrollOnce && hint) {
            scrollOnce = true;
            hint.classList.add('hidden');
        }
    }, { passive: true });

    // --- Start ---

    initFromHash();
})();
