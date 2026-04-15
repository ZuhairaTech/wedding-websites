// =============================================================================
// WEDDING INVITATION TEMPLATE - CONFIGURATION
// =============================================================================
if (sessionStorage.getItem('landingShown') === 'true') {
    const WEDDING_CONFIG = {
    // Wedding Details
    weddingDate: "Feb 14, 2026 12:01:00", // Format: "MMM DD, YYYY HH:mm:ss"
    
    // Location Settings
    location: {
      googleMapsUrl: "https://maps.app.goo.gl/H8Ay22CgTzp73WMi6",
      wazeUrl: "https://waze.com/ul/hw30e559hb", // Replace with your actual Waze URL
      modalText: {
        title: "Pilih Aplikasi Peta",
        subtitle: "Buka lokasi dengan aplikasi pilihan anda",
        googleMaps: "Google Maps",
        waze: "Waze",
        cancel: "Batal"
      }
    },
    
    // Slideshow Settings
    slideshow: {
      autoAdvanceDelay: 5000, // milliseconds
      enableAutoAdvance: true
    },
    
    // Animation Settings
      animation: {
      mobileRevealDelay: 1200, // Keep for compatibility
      mobileScrollDelay: 150,  // Keep for compatibility
      buttonShowDelay: 500,    // Keep for compatibility
      
      // New scroll-triggered animation settings
      scrollTrigger: {
        threshold: 0.2,        // Percentage of element that needs to be visible (0.2 = 20%)
        rootMargin: '0px 0px -10% 0px', // Trigger animation when element is 10% from bottom
        fadeDistance: 30,      // Distance in pixels for fade-up animation
        animationDuration: 800, // Animation duration in milliseconds
        animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)' // Smooth easing function
      }
    },
      
    // Responsive Settings
    breakpoint: {
      mobile: 768 // pixels
    },
    
    // Google Sheets Configuration
    wishes: {
      sheetId: '1pGniIsCYrVZZav3XIEdD51XO-CSGsyWp7ESrLPA0UdE', // Replace with client's Sheet ID
      useCsvMethod: true,
      range: 'Sheet1!A:F',
      nameColumn: 2,    // Column C (0-indexed)
      wishColumn: 5,    // Column F (0-indexed)
      refreshInterval: 5 * 60 * 1000, // 5 minutes in milliseconds
      loadingMessages: {
        loading: 'Memuatkan ucapan...',
        error: 'Gagal memuatkan ucapan. Sila semak sambungan internet anda dan cuba lagi.',
        noWishes: 'Tiada ucapan dijumpai dalam spreadsheet.',
        noValidWishes: 'Tiada ucapan yang sah dijumpai. Sila pastikan lajur nama dan ucapan mengandungi data.',
        statsTemplate: 'Jumlah ucapan: <strong>{count}</strong>'
      }
    },
    
    // UI Text (easily customizable for different languages)
    ui: {
      scrollButton: {
        viewWishes: "Lihat Ucapan",
        backToTop: "Kembali ke Atas"
      }
    }
  };

  // =============================================================================
  // WEDDING INVITATION CORE CLASS
  // =============================================================================

  class WeddingInvitation {
    constructor(config = WEDDING_CONFIG) {
      this.config = config;
      this.state = {
        currentIndex: 0,
        slideIndex: 0,
        slideTimer: null,
        isMobile: window.innerWidth <= config.breakpoint.mobile,
        countdownTimer: null
      };
      
      this.elements = this.initializeElements();
      this.init();
    }
    

    // Initialize DOM elements
    initializeElements() {
      return {
        lines: document.querySelectorAll('.invitation-line'),
        slideshowContainer: document.getElementById('slideshowContainer'),
        buttonContainer: document.querySelector('.button-container'),
        backBtn: document.getElementById('backBtn'),
        scrollToggleBtn: document.getElementById('scrollToggleBtn'),
        wishesSection: document.getElementById('wishes-section'),
        locationModal: document.getElementById('locationModal'),
        countdown: {
          days: document.getElementById("countdown-days"),
          hours: document.getElementById("countdown-hours"),
          minutes: document.getElementById("countdown-minutes"),
          seconds: document.getElementById("countdown-seconds")
        },
        wishes: {
          loading: document.getElementById('wishes-loading'),
          error: document.getElementById('wishes-error'),
          stats: document.getElementById('wishes-stats'),
          grid: document.getElementById('wishes-grid')
        }
      };
    }

    // Initialize all components
    init() {
      this.setupScrollReveal();
      this.initializeSlideshow();
      this.initializeCountdown();
      this.initializeWishes();
      this.setupScrollToggle();
      this.setupBackButton();
      this.setupWishesRefreshButton();
      this.setupLocationModal(); // Add location modal setup
    }

    // =============================================================================
    // LOCATION MODAL MODULE
    // =============================================================================

    setupLocationModal() {
      // Make location modal functions globally accessible for HTML onclick handlers
      window.openLocationModal = () => this.openLocationModal();
      window.closeLocationModal = () => this.closeLocationModal();
      
      // Close modal when clicking outside of it
      window.addEventListener('click', (event) => {
        if (this.elements.locationModal && event.target === this.elements.locationModal) {
          this.closeLocationModal();
        }
      });

      // Close modal with Escape key
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.closeLocationModal();
        }
      });
      
      // Update modal content with config text
      this.updateLocationModalContent();
    }

    openLocationModal() {
      if (this.elements.locationModal) {
        this.elements.locationModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    }

    closeLocationModal() {
      if (this.elements.locationModal) {
        this.elements.locationModal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore scrolling
      }
    }

    updateLocationModalContent() {
      if (!this.elements.locationModal) return;
      
      const modalTitle = this.elements.locationModal.querySelector('.modal-header h3');
      const modalSubtitle = this.elements.locationModal.querySelector('.modal-header p');
      const googleBtn = this.elements.locationModal.querySelector('.btn-google');
      const wazeBtn = this.elements.locationModal.querySelector('.btn-waze');
      const cancelBtn = this.elements.locationModal.querySelector('.btn-cancel');
      
      if (modalTitle) {
        modalTitle.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${this.config.location.modalText.title}`;
      }
      if (modalSubtitle) {
        modalSubtitle.textContent = this.config.location.modalText.subtitle;
      }
      if (googleBtn) {
        googleBtn.href = this.config.location.googleMapsUrl;
        googleBtn.innerHTML = `<i class="fab fa-google"></i> ${this.config.location.modalText.googleMaps}`;
      }
      if (wazeBtn) {
        wazeBtn.href = this.config.location.wazeUrl;
        wazeBtn.innerHTML = `<i class="fab fa-waze"></i> ${this.config.location.modalText.waze}`;
      }
      if (cancelBtn) {
        cancelBtn.innerHTML = `<i class="fas fa-times"></i> ${this.config.location.modalText.cancel}`;
      }
    }

    // =============================================================================
    // SCROLL REVEAL MODULE
    // =============================================================================

    setupScrollReveal() {
      if (this.state.isMobile) {
        this.setupMobileScrollTrigger(); 
      } else {
        this.setupDesktopManualReveal();
      }
    }

    setupMobileScrollTrigger() {
      this.initializeScrollObserver();
      this.addScrollTriggerStyles();
    }

    initializeScrollObserver() {
  // Create intersection observer options
  const observerOptions = {
    root: null, // Use viewport as root
    rootMargin: this.config.animation.scrollTrigger.rootMargin,
    threshold: this.config.animation.scrollTrigger.threshold
  };

  // Create the intersection observer
  this.scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Element is entering the viewport - fade in with slide up
        this.animateElementIn(entry.target);
      } else {
        // Element is leaving the viewport - fade out
        this.animateElementOut(entry.target);
      }
    });
  }, observerOptions);

  // Observe all invitation lines
  this.elements.lines.forEach((line, index) => {
    // Reset line visibility for scroll-triggered animation
    line.classList.remove('visible');
    line.classList.add('scroll-trigger-element');
    
    // Add initial transform for fade-up animation
    line.style.transform = `translateY(${this.config.animation.scrollTrigger.fadeDistance}px)`;
    line.style.opacity = '0';
    line.style.transition = `all ${this.config.animation.scrollTrigger.animationDuration}ms ${this.config.animation.scrollTrigger.animationEasing}`;
    
    // Start observing this element
    this.scrollObserver.observe(line);
  });

  // Also observe slideshow container
  if (this.elements.slideshowContainer) {
    this.elements.slideshowContainer.classList.add('scroll-trigger-element');
    this.elements.slideshowContainer.style.transform = `translateY(${this.config.animation.scrollTrigger.fadeDistance}px)`;
    this.elements.slideshowContainer.style.opacity = '0';
    this.elements.slideshowContainer.style.transition = `all ${this.config.animation.scrollTrigger.animationDuration}ms ${this.config.animation.scrollTrigger.animationEasing}`;
    this.scrollObserver.observe(this.elements.slideshowContainer);
  }

  // Observe button container
  if (this.elements.buttonContainer) {
    this.elements.buttonContainer.classList.add('scroll-trigger-element');
    this.elements.buttonContainer.style.transform = `translateY(${this.config.animation.scrollTrigger.fadeDistance}px)`;
    this.elements.buttonContainer.style.opacity = '0';
    this.elements.buttonContainer.style.transition = `all ${this.config.animation.scrollTrigger.animationDuration}ms ${this.config.animation.scrollTrigger.animationEasing}`;
    this.scrollObserver.observe(this.elements.buttonContainer);
  }
}

// Animate element into view
animateElementIn(element) {
  element.classList.add('visible', 'scroll-triggered');
  element.style.transform = 'translateY(0)';
  element.style.opacity = '1';
  
  // Add a subtle delay based on element index for staggered effect
  const elementIndex = Array.from(this.elements.lines).indexOf(element);
  if (elementIndex !== -1) {
    element.style.transitionDelay = `${elementIndex * 50}ms`; // 50ms stagger
  }
}

// Animate element out of view
animateElementOut(element) {
  element.classList.remove('visible', 'scroll-triggered');
  element.style.transform = `translateY(${this.config.animation.scrollTrigger.fadeDistance}px)`;
  element.style.opacity = '0';
  element.style.transitionDelay = '0ms'; // Reset delay when fading out
}

// Add CSS styles for scroll-triggered elements
addScrollTriggerStyles() {
  // Check if styles are already added
  if (document.getElementById('scroll-trigger-styles')) return;
  
  const styleSheet = document.createElement('style');
  styleSheet.id = 'scroll-trigger-styles';
  styleSheet.textContent = `
    /* Scroll-triggered animation styles */
    .scroll-trigger-element {
      will-change: transform, opacity;
    }
    
    .scroll-trigger-element.scroll-triggered {
      transform: translateY(0) !important;
      opacity: 1 !important;
    }
    
    /* Enhanced mobile animations */
    @media (max-width: ${this.config.breakpoint.mobile}px) {
      .invitation-line {
        transform: translateY(30px);
        opacity: 0;
        transition: all 800ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .invitation-line.visible {
        transform: translateY(0);
        opacity: 1;
      }
      
      /* Smooth slideshow reveal */
      #slideshowContainer {
        transform: translateY(40px);
        opacity: 0;
        transition: all 1000ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      #slideshowContainer.visible {
        transform: translateY(0);
        opacity: 1;
      }
      
      /* Button container fade-in */
      .button-container {
        transform: translateY(20px);
        opacity: 0;
        transition: all 600ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .button-container.visible {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
  
  document.head.appendChild(styleSheet);
}

// Updated updateVisibility method to work with scroll-triggered animations
updateVisibility() {
  // For mobile, visibility is now handled by scroll observer
  if (this.state.isMobile) {
    // Don't manually update visibility - let scroll observer handle it
    return;
  }
  
  // Keep original desktop behavior
  this.elements.lines.forEach((line, index) => {
    line.classList.toggle('visible', index <= this.state.currentIndex);
  });

  // Show/hide slideshow and buttons for desktop
  if (this.state.currentIndex >= this.elements.lines.length) {
    this.elements.slideshowContainer.classList.add('visible');
    
    setTimeout(() => {
      if (this.elements.buttonContainer) {
        this.elements.buttonContainer.classList.add('visible');
      }
    }, this.config.animation.buttonShowDelay);
  } else {
    this.elements.slideshowContainer.classList.remove('visible');
    if (this.elements.buttonContainer) {
      this.elements.buttonContainer.classList.remove('visible');
    }
  }
}

// Cleanup method update to include scroll observer
destroy() {
  if (this.state.slideTimer) clearTimeout(this.state.slideTimer);
  if (this.state.countdownTimer) clearInterval(this.state.countdownTimer);
  
  // Clean up scroll observer
  if (this.scrollObserver) {
    this.scrollObserver.disconnect();
    this.scrollObserver = null;
  }
  
  // Remove added styles
  const styleSheet = document.getElementById('scroll-trigger-styles');
  if (styleSheet) {
    styleSheet.remove();
  }
}

// Optional: Method to manually trigger scroll check (useful for dynamic content)
triggerScrollCheck() {
  if (this.scrollObserver && this.state.isMobile) {
    // Re-observe all elements to trigger intersection check
    this.elements.lines.forEach(line => {
      this.scrollObserver.unobserve(line);
      this.scrollObserver.observe(line);
    });
  }
}

// Optional: Method to update scroll trigger settings
updateScrollTriggerSettings(newSettings) {
  if (!this.state.isMobile) return;
  
  // Update config
  this.config.animation.scrollTrigger = {
    ...this.config.animation.scrollTrigger,
    ...newSettings
  };
  
  // Reinitialize scroll observer with new settings
  if (this.scrollObserver) {
    this.scrollObserver.disconnect();
  }
  this.initializeScrollObserver();
}

    setupDesktopManualReveal() {
      this.startAutoReveal();

      // Click to advance
      window.addEventListener('click', (e) => {
        if (this.shouldIgnoreClick(e.target)) return;
        
        if (this.state.currentIndex < this.elements.lines.length) {
          this.state.currentIndex++;
          this.updateVisibility();
        }
      });
    }

    startAutoReveal() {
      const revealDelay = 700; // 1.5 seconds between each reveal
      
      const revealNext = () => {
        if (this.state.currentIndex < this.elements.lines.length) {
          this.state.currentIndex++;
          this.updateVisibility();
          setTimeout(revealNext, revealDelay);
        }
      };
      
      // Start the first reveal after a short delay
      setTimeout(revealNext, 300);
    }

    shouldIgnoreClick(target) {
      const ignoreClasses = ['prev', 'next', 'dot', 'info-button', 'map-button', 'back-button', 'modal', 'modal-content', 'modal-btn'];
      return ignoreClasses.some(className => target.classList.contains(className)) ||
            target.closest('.modal') !== null;
    }

    updateVisibility() {
      // Update line visibility
      this.elements.lines.forEach((line, index) => {
        line.classList.toggle('visible', index <= this.state.currentIndex);
      });

      // Show/hide slideshow and buttons
      if (this.state.currentIndex >= this.elements.lines.length) {
        this.elements.slideshowContainer.classList.add('visible');
        
        setTimeout(() => {
          if (this.elements.buttonContainer) {
            this.elements.buttonContainer.classList.add('visible');
          }
        }, this.config.animation.buttonShowDelay);
      } else {
        this.elements.slideshowContainer.classList.remove('visible');
        if (this.elements.buttonContainer) {
          this.elements.buttonContainer.classList.remove('visible');
        }
      }
    }

    // =============================================================================
    // SLIDESHOW MODULE
    // =============================================================================

    initializeSlideshow() {
      this.showSlides();
      if (this.config.slideshow.enableAutoAdvance) {
        this.startSlideTimer();
      }
      
      // Make slideshow methods globally accessible for HTML onclick handlers
      window.changeSlide = (n) => this.changeSlide(n);
      window.currentSlide = (n) => this.setCurrentSlide(n);
    }

    showSlides() {
      const slides = document.querySelectorAll('.slide');
      const dots = document.querySelectorAll('.dot');
      
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active-dot'));
      
      if (slides.length > 0) {
        slides[this.state.slideIndex].classList.add('active');
        if (dots.length > 0) {
          dots[this.state.slideIndex].classList.add('active-dot');
        }
      }
    }

    changeSlide(n) {
      this.clearSlideTimer();
      const slides = document.querySelectorAll('.slide');
      this.state.slideIndex += n;
      
      if (this.state.slideIndex >= slides.length) {
        this.state.slideIndex = 0;
      } else if (this.state.slideIndex < 0) {
        this.state.slideIndex = slides.length - 1;
      }
      
      this.showSlides();
      if (this.config.slideshow.enableAutoAdvance) {
        this.startSlideTimer();
      }
    }

    setCurrentSlide(n) {
      this.clearSlideTimer();
      this.state.slideIndex = n;
      this.showSlides();
      if (this.config.slideshow.enableAutoAdvance) {
        this.startSlideTimer();
      }
    }

    startSlideTimer() {
      this.state.slideTimer = setTimeout(() => {
        this.changeSlide(1);
      }, this.config.slideshow.autoAdvanceDelay);
    }

    clearSlideTimer() {
      if (this.state.slideTimer) {
        clearTimeout(this.state.slideTimer);
        this.state.slideTimer = null;
      }
    }

    // =============================================================================
    // COUNTDOWN MODULE
    // =============================================================================

    initializeCountdown() {
      if (!this.elements.countdown.days) return;
      
      this.updateCountdown();
      this.state.countdownTimer = setInterval(() => {
        this.updateCountdown();
      }, 1000);
    }

    updateCountdown() {
      const weddingDate = new Date(this.config.weddingDate).getTime();
      const now = new Date().getTime();
      const distance = weddingDate - now;
      
      if (distance < 0) {
        this.setCountdownToZero();
        if (this.state.countdownTimer) {
          clearInterval(this.state.countdownTimer);
        }
        return;
      }
      
      const timeUnits = this.calculateTimeUnits(distance);
      this.updateCountdownDisplay(timeUnits);
    }

    calculateTimeUnits(distance) {
      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      };
    }

    updateCountdownDisplay(timeUnits) {
      this.elements.countdown.days.textContent = timeUnits.days;
      this.elements.countdown.hours.textContent = timeUnits.hours;
      this.elements.countdown.minutes.textContent = timeUnits.minutes;
      this.elements.countdown.seconds.textContent = timeUnits.seconds;
    }

    setCountdownToZero() {
      Object.values(this.elements.countdown).forEach(el => {
        if (el) el.textContent = "0";
      });
    }

    // =============================================================================
    // WISHES MODULE
    // =============================================================================

    initializeWishes() {
      window.addEventListener('load', () => this.loadWishes());
      setInterval(() => this.loadWishes(), this.config.wishes.refreshInterval);
    }

    setupWishesRefreshButton() {
      const button = document.querySelector('.refresh-btn');
      if (button) {
        button.addEventListener('click', () => this.loadWishes());
      }
    }

    async loadWishes() {
      this.showWishesLoading();
      
      try {
        const data = await this.loadWishesFromCSV();
        this.displayWishes(data);
      } catch (error) {
        console.error('Error loading wishes:', error);
        this.showWishesError(this.config.wishes.loadingMessages.error);
      }
      
      this.hideWishesLoading();
    }

    async loadWishesFromCSV() {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${this.config.wishes.sheetId}/export?format=csv`;
      const response = await fetch(csvUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const csvText = await response.text();
      return this.parseCSV(csvText);
    }

    parseCSV(csvText) {
      const lines = csvText.split('\n');
      const result = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const cells = line.split(',').map(cell => 
            cell.replace(/^"|"$/g, '').trim()
          );
          result.push(cells);
        }
      }
      
      return result;
    }

    displayWishes(data) {
      if (!data || data.length <= 1) {
        this.showWishesError(this.config.wishes.loadingMessages.noWishes);
        return;
      }

      const validWishes = this.filterValidWishes(data);
      
      if (validWishes.length === 0) {
        this.showWishesError(this.config.wishes.loadingMessages.noValidWishes);
        return;
      }

      this.updateWishesStats(validWishes.length);
      this.renderWishCards(validWishes);
    }

    filterValidWishes(data) {
      return data.slice(1).filter(row => {
        const name = row[this.config.wishes.nameColumn] ? 
          row[this.config.wishes.nameColumn].toString().trim() : '';
        const wish = row[this.config.wishes.wishColumn] ? 
          row[this.config.wishes.wishColumn].toString().trim() : '';
        return name && wish;
      });
    }

    updateWishesStats(count) {
      this.elements.wishes.stats.innerHTML = 
        this.config.wishes.loadingMessages.statsTemplate.replace('{count}', count);
      this.elements.wishes.stats.style.display = 'block';
    }

    renderWishCards(validWishes) {
      this.elements.wishes.grid.innerHTML = validWishes.map(row => {
        const name = row[this.config.wishes.nameColumn].toString().trim();
        const wish = row[this.config.wishes.wishColumn].toString().trim();
        
        return `
          <div class="wish-card">
            <div class="wish-text">${this.escapeHtml(wish)}</div>
            <div class="wish-author">${this.escapeHtml(name)}</div>
          </div>
        `;
      }).join('');
    }

    showWishesLoading() {
      this.elements.wishes.loading.style.display = 'flex';
      this.elements.wishes.error.style.display = 'none';
      this.elements.wishes.stats.style.display = 'none';
      this.elements.wishes.grid.innerHTML = '';
    }

    hideWishesLoading() {
      this.elements.wishes.loading.style.display = 'none';
    }

    showWishesError(message) {
      this.elements.wishes.error.textContent = message;
      this.elements.wishes.error.style.display = 'block';
    }

    escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    // =============================================================================
    // SCROLL TOGGLE MODULE
    // =============================================================================

    setupScrollToggle() {
      if (!this.elements.scrollToggleBtn) return;
      
      // Make toggleScroll globally accessible for HTML onclick handlers
      window.toggleScroll = () => this.toggleScroll();
      
      window.addEventListener('scroll', () => this.updateScrollButton());
    }

    toggleScroll() {
      const wishesRect = this.elements.wishesSection.getBoundingClientRect();
      const isAtWishes = wishesRect.top <= 100 && wishesRect.bottom >= 100;
      
      if (isAtWishes) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        this.elements.wishesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }

    updateScrollButton() {
      if (!this.elements.scrollToggleBtn || !this.elements.wishesSection) return;
      
      const wishesRect = this.elements.wishesSection.getBoundingClientRect();
      const isAtWishes = wishesRect.top <= 100 && wishesRect.bottom >= 100;
      
      if (isAtWishes) {
        this.elements.scrollToggleBtn.classList.add('at-wishes');
        this.elements.scrollToggleBtn.title = this.config.ui.scrollButton.backToTop;
        this.elements.scrollToggleBtn.innerHTML = '<i class="fa fa-chevron-up"></i>';
      } else {
        this.elements.scrollToggleBtn.classList.remove('at-wishes');
        this.elements.scrollToggleBtn.title = this.config.ui.scrollButton.viewWishes;
        this.elements.scrollToggleBtn.innerHTML = '<i class="fa fa-chevron-down"></i>';
      }
    }

    // =============================================================================
    // BACK BUTTON MODULE
    // =============================================================================

    setupBackButton() {
      if (!this.elements.backBtn) return;
      
      this.elements.backBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.state.currentIndex > 0) {
          this.state.currentIndex--;
          this.updateVisibility();
        }
      });
    }

    // =============================================================================
    // PUBLIC METHODS FOR EXTERNAL ACCESS
    // =============================================================================

    // Method to update configuration after initialization
    updateConfig(newConfig) {
      this.config = { ...this.config, ...newConfig };
      this.updateLocationModalContent(); // Update modal content when config changes
    }

    // Method to manually trigger wishes reload
    reloadWishes() {
      this.loadWishes();
    }

    // Method to reset invitation state
    reset() {
      this.state.currentIndex = 0;
      this.state.slideIndex = 0;
      this.updateVisibility();
      this.showSlides();
    }

    // Cleanup method
    destroy() {
      if (this.state.slideTimer) clearTimeout(this.state.slideTimer);
      if (this.state.countdownTimer) clearInterval(this.state.countdownTimer);
    }
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  // Initialize the wedding invitation when DOM is loaded
  // document.addEventListener('DOMContentLoaded', () => {
  //   window.weddingInvitation = new WeddingInvitation(WEDDING_CONFIG);
  // });
  // Only auto-initialize if landing was already shown
  if (sessionStorage.getItem('landingShown') === 'true') {
    document.addEventListener('DOMContentLoaded', () => {
      window.weddingInvitation = new WeddingInvitation(WEDDING_CONFIG);
    });
  }

  // =============================================================================
  // CONFIGURATION HELPER FUNCTIONS
  // =============================================================================

  // Helper function to create custom configuration for different clients
  function createWeddingConfig(customConfig) {
    return {
      ...WEDDING_CONFIG,
      ...customConfig,
      location: {
        ...WEDDING_CONFIG.location,
        ...(customConfig.location || {})
      },
      wishes: {
        ...WEDDING_CONFIG.wishes,
        ...(customConfig.wishes || {})
      },
      animation: {
        ...WEDDING_CONFIG.animation,
        ...(customConfig.animation || {})
      },
      slideshow: {
        ...WEDDING_CONFIG.slideshow,
        ...(customConfig.slideshow || {})
      },
      ui: {
        ...WEDDING_CONFIG.ui,
        ...(customConfig.ui || {})
      }
    };
  }

  // Export for module usage (if needed)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeddingInvitation, createWeddingConfig, WEDDING_CONFIG };
  }
  console.log("Invitation page initialized.");
  // e.g., start countdown, load wishes, enable buttons, etc.
}
