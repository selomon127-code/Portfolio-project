// Modern 3D Portfolio JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Initialize loading and theme
  initLoadingScreen();
  initThemeToggle();
  
  // Initialize performance optimizations
  initLazyLoading();
  initPerformanceOptimizations();
  
  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Initialize all components
  initCustomCursor();
  initNavigation();
  initParticles();
  initTypewriter();
  initHeroAnimations();
  initScrollAnimations();
  initSkillTabs();
  init3DTilt();
  initFormEffects();
  initThreeJS();
});

// Lazy Loading
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.onload = () => {
          img.classList.add('loaded');
          img.removeAttribute('loading');
        };
        img.src = img.src; // Trigger load if already cached
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });

  images.forEach(img => imageObserver.observe(img));
}

// Performance Optimizations
function initPerformanceOptimizations() {
  // Throttle scroll events
  let ticking = false;
  function updateOnScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        ticking = false;
      });
      ticking = true;
    }
  }

  // Optimize Three.js for mobile
  if (window.innerWidth < 768) {
    // Reduce particle count on mobile
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
      const particles = particlesContainer.querySelectorAll('.particle');
      particles.forEach((particle, index) => {
        if (index > 15) particle.remove();
      });
    }
  }

  // Preload critical resources
  const criticalLinks = [
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
  ];

  criticalLinks.forEach(link => {
    const linkElement = document.createElement('link');
    linkElement.rel = 'preload';
    linkElement.as = 'style';
    linkElement.href = link;
    document.head.appendChild(linkElement);
  });

  // Add will-change properties for optimized rendering
  const animatedElements = document.querySelectorAll('.hero-image, .floating-elements, .project-card');
  animatedElements.forEach(el => {
    el.style.willChange = 'transform';
  });
}

// Loading Screen
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;

  // Hide loading screen after everything loads
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }, 2000);
}

// Theme Toggle
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const html = document.documentElement;
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  themeToggle?.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add transition effect
    html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      html.style.transition = '';
    }, 300);
  });
  
  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }
}

// Custom Cursor
function initCustomCursor() {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');

  if (window.matchMedia('(pointer: coarse)').matches) {
    cursorDot.style.display = 'none';
    cursorOutline.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects
  const hoverElements = document.querySelectorAll('a, button, .magnetic, .skill-category, .project-card');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursorOutline.classList.remove('hover');
    });
  });

  // Magnetic effect
  const magneticElements = document.querySelectorAll('.magnetic');
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

// Navigation
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle?.classList.remove('active');
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Particles
function initParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    particlesContainer.appendChild(particle);
  }
}

// Typewriter Effect
function initTypewriter() {
  const textElement = document.getElementById('typewriter-text');
  if (!textElement) return;

  const phrases = [
    'Frontend Developer',
    'Creative Designer',
    'Problem Solver',
    'CS Student'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isWaiting = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      textElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      textElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

// Hero Animations
function initHeroAnimations() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  gsap.from('.hero-badge', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.2,
    ease: 'power3.out'
  });

  gsap.from('.hero-text h1', {
    opacity: 0,
    y: 50,
    duration: 1,
    delay: 0.4,
    ease: 'power3.out'
  });

  gsap.from('.typewriter', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.6,
    ease: 'power3.out'
  });

  gsap.from('.hero-description', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.8,
    ease: 'power3.out'
  });

  gsap.from('.hero-buttons', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 1,
    ease: 'power3.out'
  });

  gsap.from('.social-links', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 1.2,
    ease: 'power3.out'
  });

  gsap.from('.hero-image-wrapper', {
    opacity: 0,
    scale: 0.8,
    duration: 1.2,
    delay: 0.5,
    ease: 'power3.out'
  });

  gsap.from('.floating-elements .float-icon', {
    opacity: 0,
    scale: 0,
    rotation: -180,
    duration: 0.8,
    stagger: 0.2,
    delay: 1.4,
    ease: 'back.out(1.7)'
  });

  gsap.from('.scroll-indicator', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 1.8,
    ease: 'power3.out'
  });
}

// Scroll Animations
function initScrollAnimations() {
  // About section
  gsap.from('.about-image', {
    scrollTrigger: {
      trigger: '#about',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    x: -50,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.from('.about-text', {
    scrollTrigger: {
      trigger: '#about',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    x: 50,
    duration: 1,
    ease: 'power3.out'
  });

  // Animate stats counter
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    
    ScrollTrigger.create({
      trigger: stat,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(stat, {
          innerHTML: target,
          duration: 2,
          snap: { innerHTML: 1 },
          ease: 'power2.out'
        });
      },
      once: true
    });
  });

  // Skills section
  gsap.from('.skill-category', {
    scrollTrigger: {
      trigger: '#skills',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out'
  });

  // Animate progress bars
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach(item => {
    const level = item.getAttribute('data-level');
    const progressBar = item.querySelector('.progress-bar');
    
    ScrollTrigger.create({
      trigger: item,
      start: 'top 80%',
      onEnter: () => {
        progressBar.style.width = level + '%';
      },
      once: true
    });
  });

  // Projects section
  gsap.from('.project-card', {
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
  });

  // Contact section
  gsap.from('.contact-info', {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    x: -50,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.from('.contact-form-wrapper', {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    x: 50,
    duration: 1,
    ease: 'power3.out'
  });

  // Parallax effect on hero
  gsap.to('.hero-image-wrapper', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    },
    y: 100,
    ease: 'none'
  });

  gsap.to('.floating-elements', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    },
    y: -50,
    rotation: 15,
    ease: 'none'
  });
}

// Skill Tabs
function initSkillTabs() {
  const categories = document.querySelectorAll('.skill-category');
  const skillGrids = document.querySelectorAll('.skills-grid');

  categories.forEach(category => {
    category.addEventListener('click', () => {
      const targetCategory = category.getAttribute('data-category');
      
      // Update active category
      categories.forEach(c => c.classList.remove('active'));
      category.classList.add('active');

      // Show corresponding skills
      skillGrids.forEach(grid => {
        grid.classList.remove('active');
      });
      
      const targetGrid = document.getElementById(targetCategory + '-skills');
      if (targetGrid) {
        targetGrid.classList.add('active');
        
        // Animate progress bars in the new grid
        const progressBars = targetGrid.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
          const parent = bar.closest('.skill-item');
          const level = parent.getAttribute('data-level');
          bar.style.width = '0';
          setTimeout(() => {
            bar.style.width = level + '%';
          }, 100);
        });

        // Animate skill items
        gsap.from(targetGrid.querySelectorAll('.skill-item'), {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out'
        });
      }
    });
  });
}

// 3D Tilt Effect for Project Cards
function init3DTilt() {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

// Form Effects
function initFormEffects() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Show success animation
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
    button.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = '';
      form.reset();
    }, 3000);
  });
}

// Three.js Background
function initThreeJS() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;

  // Check for touch devices - skip heavy 3D
  if (window.matchMedia('(pointer: coarse)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create floating geometric shapes
  const geometries = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(0.8, 0),
    new THREE.TetrahedronGeometry(1.2, 0)
  ];

  const material = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });

  const shapes = [];
  for (let i = 0; i < 8; i++) {
    const geometry = geometries[i % geometries.length];
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10 - 5
    );
    
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    
    mesh.userData = {
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      },
      floatSpeed: Math.random() * 0.5 + 0.5,
      floatOffset: Math.random() * Math.PI * 2
    };
    
    scene.add(mesh);
    shapes.push(mesh);
  }

  camera.position.z = 8;

  let isVisible = true;
  let rafId = null;

  // Visibility check
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !rafId) {
      animate();
    }
  }, { threshold: 0.1 });
  
  observer.observe(canvas);

  // Animation
  function animate() {
    if (!isVisible) {
      rafId = null;
      return;
    }

    rafId = requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    shapes.forEach((shape, i) => {
      shape.rotation.x += shape.userData.rotationSpeed.x;
      shape.rotation.y += shape.userData.rotationSpeed.y;
      shape.rotation.z += shape.userData.rotationSpeed.z;
      
      shape.position.y += Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.002;
    });

    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
