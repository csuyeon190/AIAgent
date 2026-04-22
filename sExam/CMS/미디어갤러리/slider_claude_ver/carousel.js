class Carousel {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        this.slides = document.querySelectorAll('.carousel-slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.pagination = document.getElementById('pagination');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.pauseIcon = document.getElementById('pauseIcon');
        this.playIcon = document.getElementById('playIcon');
        this.progressFill = document.getElementById('progressFill');
        
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.isPlaying = true;
        this.autoPlayInterval = null;
        this.progressInterval = null;
        this.autoPlayDuration = 5000; // 5 seconds
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        this.createPagination();
        this.attachEventListeners();
        this.startAutoPlay();
        this.updateSlide();
    }
    
    createPagination() {
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('pagination-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.pagination.appendChild(dot);
        }
    }
    
    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Touch/Swipe support
        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });
        
        this.track.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        // Pause on hover
        this.track.addEventListener('mouseenter', () => {
            if (this.isPlaying) this.pauseAutoPlay();
        });
        
        this.track.addEventListener('mouseleave', () => {
            if (this.isPlaying) this.startAutoPlay();
        });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }
    
    updateSlide() {
        // Update track position
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        
        // Update active slide
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update pagination
        const dots = this.pagination.querySelectorAll('.pagination-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
        
        // Reset progress
        this.resetProgress();
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateSlide();
    }
    
    previousSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlide();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlide();
    }
    
    startAutoPlay() {
        this.pauseAutoPlay(); // Clear any existing intervals
        this.autoPlayInterval = setInterval(() => this.nextSlide(), this.autoPlayDuration);
        this.startProgress();
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        this.stopProgress();
    }
    
    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        
        if (this.isPlaying) {
            this.pauseIcon.style.display = 'block';
            this.playIcon.style.display = 'none';
            this.startAutoPlay();
        } else {
            this.pauseIcon.style.display = 'none';
            this.playIcon.style.display = 'block';
            this.pauseAutoPlay();
        }
    }
    
    startProgress() {
        this.stopProgress();
        let progress = 0;
        const increment = 100 / (this.autoPlayDuration / 100);
        
        this.progressInterval = setInterval(() => {
            progress += increment;
            if (progress >= 100) {
                progress = 0;
            }
            this.progressFill.style.width = `${progress}%`;
        }, 100);
    }
    
    stopProgress() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }
    
    resetProgress() {
        this.progressFill.style.width = '0%';
        if (this.isPlaying) {
            this.startProgress();
        }
    }
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});
