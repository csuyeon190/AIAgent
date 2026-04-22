/**
 * ============================================================
 *  Premium Image Slider – slider.js
 * ============================================================
 */

(function () {
  'use strict';

  /* ── DOM References ─────────────────────────────────── */
  const track        = document.getElementById('slidesTrack');
  const viewport     = document.getElementById('sliderViewport');
  const arrowLeft    = document.getElementById('arrowLeft');
  const arrowRight   = document.getElementById('arrowRight');
  const dotsWrap     = document.getElementById('dotsContainer');
  const progressBar  = document.getElementById('progressBar');
  const currentNum   = document.getElementById('currentNum');
  const totalNum     = document.getElementById('totalNum');
  const autoplayBtn  = document.getElementById('autoplayBtn');
  const pauseIcon    = document.getElementById('pauseIcon');
  const playIcon     = document.getElementById('playIcon');

  /* ── State ──────────────────────────────────────────── */
  const slides       = Array.from(track.querySelectorAll('.slide'));
  const TOTAL        = slides.length;
  const AUTOPLAY_MS  = 5000;   // time per slide in ms
  const PROGRESS_INT = 50;     // progress bar update interval (ms)

  let currentIndex   = 0;
  let isAnimating    = false;
  let autoplayTimer  = null;
  let progressTimer  = null;
  let progressValue  = 0;
  let isPlaying      = true;

  /* ── Init ───────────────────────────────────────────── */
  function init() {
    totalNum.textContent = TOTAL;
    buildDots();
    goTo(0, false);
    startAutoplay();
  }

  /* ── Dot Builder ────────────────────────────────────── */
  function buildDots() {
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className   = 'dot';
      btn.setAttribute('aria-label', `슬라이드 ${i + 1}로 이동`);
      btn.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(btn);
    });
  }

  /* ── Core: goTo ─────────────────────────────────────── */
  function goTo(index, animate = true) {
    if (isAnimating) return;
    if (index === currentIndex && animate) return;

    isAnimating = true;

    // Clamp index
    const next = ((index % TOTAL) + TOTAL) % TOTAL;

    /* Flash viewport overlay */
    if (animate) {
      viewport.classList.add('transitioning');
      setTimeout(() => viewport.classList.remove('transitioning'), 200);
    }

    /* Remove active from old slide */
    slides[currentIndex].classList.remove('active');
    updateDots(next);

    /* Apply CSS translate */
    const transitionDuration = animate ? '' : '0ms';
    track.style.transitionDuration = transitionDuration;
    track.style.transform = `translateX(-${next * 100}%)`;

    /* After CSS transition ends, mark new slide active */
    const delay = animate ? 700 : 0;
    setTimeout(() => {
      slides[next].classList.add('active');
      currentIndex = next;
      currentNum.textContent = currentIndex + 1;
      isAnimating = false;
      track.style.transitionDuration = ''; // restore to CSS default
    }, delay);

    /* Reset progress */
    resetProgress();
  }

  /* ── Dot Highlight ──────────────────────────────────── */
  function updateDots(index) {
    const dots = dotsWrap.querySelectorAll('.dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  /* ── Progress Bar ───────────────────────────────────── */
  function resetProgress() {
    clearInterval(progressTimer);
    progressValue = 0;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';

    if (!isPlaying) return;

    // Tiny delay so "none" transition is applied before we restart
    setTimeout(() => {
      progressBar.style.transition = `width ${PROGRESS_INT}ms linear`;
      progressTimer = setInterval(() => {
        progressValue += (PROGRESS_INT / AUTOPLAY_MS) * 100;
        if (progressValue >= 100) progressValue = 100;
        progressBar.style.width = progressValue + '%';
      }, PROGRESS_INT);
    }, 30);
  }

  /* ── Autoplay ───────────────────────────────────────── */
  function startAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      goTo(currentIndex + 1);
    }, AUTOPLAY_MS);
    resetProgress();
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
    clearInterval(progressTimer);
    autoplayTimer = null;
    progressBar.style.width = '0%';
  }

  function toggleAutoplay() {
    isPlaying = !isPlaying;
    pauseIcon.style.display = isPlaying ? 'block' : 'none';
    playIcon.style.display  = isPlaying ? 'none'  : 'block';

    if (isPlaying) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
  }

  /* ── Arrow Buttons ──────────────────────────────────── */
  arrowLeft.addEventListener('click', () => {
    if (isPlaying) startAutoplay();   // reset timer on manual nav
    goTo(currentIndex - 1);
  });

  arrowRight.addEventListener('click', () => {
    if (isPlaying) startAutoplay();
    goTo(currentIndex + 1);
  });

  /* ── Autoplay Button ────────────────────────────────── */
  autoplayBtn.addEventListener('click', toggleAutoplay);

  /* ── Keyboard Navigation ────────────────────────────── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { if (isPlaying) startAutoplay(); goTo(currentIndex - 1); }
    if (e.key === 'ArrowRight') { if (isPlaying) startAutoplay(); goTo(currentIndex + 1); }
    if (e.key === ' ')          { e.preventDefault(); toggleAutoplay(); }
  });

  /* ── Touch / Swipe Support ──────────────────────────── */
  let touchStartX = 0;
  let touchEndX   = 0;
  const SWIPE_THRESHOLD = 50;

  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const delta = touchStartX - touchEndX;

    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (isPlaying) startAutoplay();
      goTo(delta > 0 ? currentIndex + 1 : currentIndex - 1);
    }
  }, { passive: true });

  /* ── Pause on Hover ─────────────────────────────────── */
  viewport.addEventListener('mouseenter', () => {
    if (isPlaying) {
      clearInterval(autoplayTimer);
      clearInterval(progressTimer);
    }
  });

  viewport.addEventListener('mouseleave', () => {
    if (isPlaying) startAutoplay();
  });

  /* ── Run ─────────────────────────────────────────────── */
  init();

})();
