/* ==========================================================================
   ANKIT.DEV — Core Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Mobile Navigation & Viewport Fixes
  initNavigation();

  // Dynamic Typing Subtitle Engine
  initTypingEngine();

  // Interactive Particle Canvas Visualizer
  initParticlesCanvas();

  // Real-Time Automation Console Stream
  initAutomationConsole();

  // Live Theme Customizer Panel Engine
  initThemeCustomizer();
});

/* ==========================================================================
   1. Navigation & Viewport Fixes (Mobile, iOS, Scroll reveals)
   ========================================================================== */
function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.getElementById('header');

  if (hamburger && navMenu) {
    // Toggle Menu on Hamburger Click
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // Header Scroll Tint
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveLink();
  });

  // Highlight Active Section Link
  function highlightActiveLink() {
    let scrollPos = window.scrollY + 100;
    navLinks.forEach(link => {
      const sectionId = link.getAttribute('href');
      if (sectionId && sectionId.startsWith('#')) {
        const section = document.querySelector(sectionId);
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      }
    });
  }
}

/* ==========================================================================
   2. Dynamic Typing Subtitle Engine
   ========================================================================== */
function initTypingEngine() {
  const target = document.getElementById('typing-text');
  if (!target) return;

  const roles = [
    "Full-Stack Software Architect",
    "Machine Learning Engineer",
    "Discord Bot Architect",
    "Data Science Explorer",
    "Stealth SaaS Founder"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      delay = 50;
    } else {
      target.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      delay = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      delay = 1800; // Time it stays fully typed
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 500; // Break before typing next word
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   3. Interactive Particle Canvas Visualizer
   ========================================================================== */
function initParticlesCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  const mouse = { x: null, y: null, radius: 120 };

  // Track cursor position
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  // Track touch position on Mobile / iOS Safari
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle window resizing
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }
  window.addEventListener('resize', resizeCanvas);
  
  // Set dimensions initially
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Particle Blueprint
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    // Draw particle
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    // Update coordinates
    update() {
      // Bounce off borders
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      // Check cursor proximity (attraction force)
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x += (dx / distance) * force * 1.5;
          this.y += (dy / distance) * force * 1.5;
        }
      }

      // Move particle
      this.x += this.directionX;
      this.y += this.directionY;
      
      this.draw();
    }
  }

  // Initialize Particle Array
  function initParticles() {
    particlesArray = [];
    const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 80);
    const particleColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#00d9ff';
    
    for (let i = 0; i < numberOfParticles; i++) {
      let size = Math.random() * 2 + 1;
      let x = Math.random() * (canvas.width - size * 2) + size;
      let y = Math.random() * (canvas.height - size * 2) + size;
      let directionX = (Math.random() * 0.8) - 0.4;
      let directionY = (Math.random() * 0.8) - 0.4;

      particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
    }
  }

  // Draw lines connecting close particles
  function connectParticles() {
    let opacityValue = 1;
    const maxDistance = 110;
    const strokeColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '0, 217, 255';
    
    // Parse hex or named color to rgb components safely
    let r = 0, g = 217, b = 255;
    if (strokeColor.startsWith('#')) {
      const hex = strokeColor.replace('#', '');
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }

    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          opacityValue = 1 - (distance / maxDistance);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacityValue * 0.15})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();

  // Export helper to refresh colors dynamically when theme customizer changes
  window.refreshCanvasParticles = () => {
    initParticles();
  };
}

/* ==========================================================================
   4. Real-Time Automation Console Stream
   ========================================================================== */
const logsCollection = [
  "Anti-nuke scanner: scanning role changes...",
  "Active Poru audio thread: streaming high-fidelity audio buffers (Turso persistence)",
  "anti-nuke validation: OK, no unauthorized admin grants.",
  "ML pipeline: customer churn feature extractor complete.",
  "database timeout handler: validated active queries in 12ms.",
  "ML pipeline: trained Logistic Regression (AUC: 70.2%).",
  "data science: parsed 1500+ records, cleaned 38 duplicate sheets.",
  "Supabase sync: validated dynamic student token signature.",
  "Canvas renderer: buffer loaded for Music Card Now Playing banner.",
  "system check: CPU temperature stable, server load minimal."
];

function initAutomationConsole() {
  const consoleScreen = document.getElementById('console-screen');
  if (!consoleScreen) return;

  // Print startup logs
  consoleScreen.innerHTML = `
    <p><span class="log-time">[${getFormattedTime()}]</span> <span class="log-tag">[SYSTEM]</span> Initializing secure edge framework...</p>
    <p><span class="log-time">[${getFormattedTime()}]</span> <span class="log-tag">[SECURITY]</span> Anti-nuke systems loaded: ACTIVE</p>
    <p><span class="log-time">[${getFormattedTime()}]</span> <span class="log-tag">[DATABASE]</span> Connected to Turso DB cluster: 12ms ping</p>
  `;

  // Periodically stream simulated server logs
  setInterval(() => {
    if (window.isConsolePaused) return;
    
    const randomLog = logsCollection[Math.floor(Math.random() * logsCollection.length)];
    const logTag = randomLog.includes("ML") ? "ML_ENGINE" : randomLog.includes("nuke") ? "SECURITY" : "SYSTEM";
    const logClass = randomLog.includes("validation") || randomLog.includes("complete") ? "log-success" : "log-info";

    const p = document.createElement('p');
    p.innerHTML = `
      <span class="log-time">[${getFormattedTime()}]</span> 
      <span class="log-tag">[${logTag}]</span> 
      <span class="${logClass}">${randomLog}</span>
    `;
    consoleScreen.appendChild(p);
    
    // Auto-scroll to bottom
    consoleScreen.scrollTop = consoleScreen.scrollHeight;

    // Prune excessive logs to prevent memory hangs
    if (consoleScreen.children.length > 50) {
      consoleScreen.removeChild(consoleScreen.firstChild);
    }
  }, 3500);

  // Initialize Resource dials
  initResourceDials();
}

function getFormattedTime() {
  const now = new Date();
  return now.toTimeString().split(' ')[0];
}

// resource dial trackers
function initResourceDials() {
  const cpuRing = document.getElementById('cpu-ring');
  const ramRing = document.getElementById('ram-ring');
  const dbRing = document.getElementById('db-ring');
  
  const cpuValue = document.getElementById('cpu-value');
  const ramValue = document.getElementById('ram-value');
  const dbValue = document.getElementById('db-value');

  // Animate dials with slight variances
  setInterval(() => {
    if (window.isConsolePaused) return;

    // Generate simulated metrics
    const cpu = Math.floor(15 + Math.random() * 15);
    const ram = Math.floor(45 + Math.random() * 6);
    const db = Math.floor(8 + Math.random() * 8);

    updateDial(cpuRing, cpuValue, cpu, '%');
    updateDial(ramRing, ramValue, ram, '%');
    updateDial(dbRing, dbValue, db, 'ms');
  }, 2500);
}

function updateDial(ring, textEl, value, suffix) {
  if (!ring || !textEl) return;
  
  // Circumference of dial circle is 2 * PI * 35 = 220
  const circ = 220;
  const max = suffix === 'ms' ? 50 : 100; // Scale DB latency dial max to 50ms
  
  const offset = circ - (Math.min(value, max) / max) * circ;
  ring.style.strokeDashoffset = offset;
  textEl.textContent = value + suffix;
}

// Trigger Manual Job Overrides
window.isConsolePaused = false;
window.triggerJob = (jobType) => {
  const fill = document.getElementById(`fill-${jobType}`);
  const status = document.getElementById(`status-${jobType}`);
  const screen = document.getElementById('console-screen');

  if (!fill || !status || status.textContent === "RUNNING") return;

  status.textContent = "RUNNING";
  status.className = "job-status active";
  fill.style.width = "0%";
  window.isConsolePaused = true; // Pause general log streams to highlight job logs

  const consoleTitle = jobType === 'ml' ? "ML_ENGINE" : jobType === 'auth' ? "DATABASE" : "ANTI_NUKE";
  
  const pStart = document.createElement('p');
  pStart.innerHTML = `<span class="log-time">[${getFormattedTime()}]</span> <span class="log-tag">[${consoleTitle}]</span> <span class="log-success">>>> MANUAL OVERRIDE INITIATED: ${status.previousElementSibling.textContent}</span>`;
  screen.appendChild(pStart);
  screen.scrollTop = screen.scrollHeight;

  // Animate simulated loading bar
  let width = 0;
  const interval = setInterval(() => {
    width += 4;
    fill.style.width = width + "%";

    if (width % 20 === 0) {
      const pStep = document.createElement('p');
      pStep.innerHTML = `<span class="log-time">[${getFormattedTime()}]</span> <span class="log-tag">[${consoleTitle}]</span> Processing verification pipeline step (${width}%)...`;
      screen.appendChild(pStep);
      screen.scrollTop = screen.scrollHeight;
    }

    if (width >= 100) {
      clearInterval(interval);
      status.textContent = "SUCCESS";
      status.className = "job-status";
      window.isConsolePaused = false;

      const pDone = document.createElement('p');
      pDone.innerHTML = `<span class="log-time">[${getFormattedTime()}]</span> <span class="log-tag">[${consoleTitle}]</span> <span class="log-success">✅ PIPELINE COMPLETED SUCCESSFULLY. Badges verification code released.</span>`;
      screen.appendChild(pDone);
      screen.scrollTop = screen.scrollHeight;

      showToast("Job Completed Successfully!", "success");
    }
  }, 100);
};

/* ==========================================================================
   5. Live Theme Customizer Control (Edit the Theme in Real-Time)
   ========================================================================== */
const presets = {
  cyberpunk: {
    primary: '#00d9ff',
    secondary: '#ab47bc',
    bg: '#090314',
    blur: '16',
    glow: '15',
    radius: '16',
    font: "'Outfit', sans-serif"
  },
  matrix: {
    primary: '#10b981',
    secondary: '#047857',
    bg: '#022c22',
    blur: '8',
    glow: '10',
    radius: '4',
    font: "'Fira Code', monospace"
  },
  sunset: {
    primary: '#f59e0b',
    secondary: '#f43f5e',
    bg: '#1c1917',
    blur: '24',
    glow: '20',
    radius: '20',
    font: "'Inter', sans-serif"
  },
  nebula: {
    primary: '#8b5cf6',
    secondary: '#ec4899',
    bg: '#0f051d',
    blur: '20',
    glow: '25',
    radius: '12',
    font: "'Space Mono', monospace"
  }
};

function initThemeCustomizer() {
  const toggle = document.getElementById('customizer-toggle');
  const drawer = document.getElementById('customizer-drawer');
  const close = document.getElementById('customizer-close');

  if (toggle && drawer && close) {
    toggle.addEventListener('click', () => drawer.classList.add('active'));
    close.addEventListener('click', () => drawer.classList.remove('active'));
  }

  // Color Pickers
  const primaryInput = document.getElementById('theme-primary');
  const secondaryInput = document.getElementById('theme-secondary');
  const bgInput = document.getElementById('theme-bg');

  // Sliders
  const blurInput = document.getElementById('theme-blur');
  const glowInput = document.getElementById('theme-glow');
  const radiusInput = document.getElementById('theme-radius');

  // Dropdown Select
  const fontInput = document.getElementById('theme-font');

  // Setup inputs to update styling on real-time tweak
  const inputs = [primaryInput, secondaryInput, bgInput, blurInput, glowInput, radiusInput, fontInput];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('input', applyCustomizerValues);
      input.addEventListener('change', applyCustomizerValues);
    }
  });

  function applyCustomizerValues() {
    const root = document.documentElement;

    // Fetch and bind input states to CSS variables
    const primary = primaryInput.value;
    const secondary = secondaryInput.value;
    const bg = bgInput.value;
    const blur = blurInput.value + 'px';
    const glow = glowInput.value + 'px';
    const radius = radiusInput.value + 'px';
    const font = fontInput.value;

    root.style.setProperty('--primary-color', primary);
    root.style.setProperty('--secondary-color', secondary);
    root.style.setProperty('--bg-dark', bg);
    root.style.setProperty('--glass-blur', blur);
    root.style.setProperty('--card-glow', glow);
    root.style.setProperty('--border-radius', radius);
    root.style.setProperty('--font-family', font);

    // Dynamic glow shadow calculations
    root.style.setProperty('--neon-glow-color', hexToRgbA(primary, 0.25));

    // Update Slider Value labels
    document.getElementById('label-blur').textContent = blur;
    document.getElementById('label-glow').textContent = glow;
    document.getElementById('label-radius').textContent = radius;

    // Refresh canvas particle nodes colors to match accent hue
    if (window.refreshCanvasParticles) {
      window.refreshCanvasParticles();
    }

    // Save Custom Theme to LocalStorage
    const customConfig = { primary, secondary, bg, blur: blurInput.value, glow: glowInput.value, radius: radiusInput.value, font };
    localStorage.setItem('ankit_custom_theme', JSON.stringify(customConfig));
  }

  // Load Custom Theme Config on DOM Start
  const savedConfig = localStorage.getItem('ankit_custom_theme');
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig);
      primaryInput.value = config.primary;
      secondaryInput.value = config.secondary;
      bgInput.value = config.bg;
      blurInput.value = config.blur;
      glowInput.value = config.glow;
      radiusInput.value = config.radius;
      fontInput.value = config.font;
      applyCustomizerValues();
    } catch (e) {
      console.warn('Failed to parse saved custom theme configurations:', e);
    }
  }
}

// Convert Hex to RGBA utility for glow shadows
function hexToRgbA(hex, opacity) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
  }
  return 'rgba(0, 217, 255, 0.25)';
}

// Apply Preset Preset Themes
window.applyPreset = (presetName) => {
  const config = presets[presetName];
  if (!config) return;

  document.getElementById('theme-primary').value = config.primary;
  document.getElementById('theme-secondary').value = config.secondary;
  document.getElementById('theme-bg').value = config.bg;
  document.getElementById('theme-blur').value = config.blur;
  document.getElementById('theme-glow').value = config.glow;
  document.getElementById('theme-radius').value = config.radius;
  document.getElementById('theme-font').value = config.font;

  // Set active class
  document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
  const triggerBtn = Array.from(document.querySelectorAll('.preset-btn')).find(b => b.textContent.toLowerCase().includes(presetName.replace('warm ', '').replace('deep ', '')));
  if (triggerBtn) triggerBtn.classList.add('active');

  // Trigger DOM updates
  document.getElementById('theme-primary').dispatchEvent(new Event('input'));
  showToast(`${presetName.charAt(0).toUpperCase() + presetName.slice(1)} theme applied!`, "success");
};

// Export Custom Theme as global CSS variables
window.exportThemeStyles = () => {
  const p = document.getElementById('theme-primary').value;
  const s = document.getElementById('theme-secondary').value;
  const bg = document.getElementById('theme-bg').value;
  const bl = document.getElementById('theme-blur').value + 'px';
  const gl = document.getElementById('theme-glow').value + 'px';
  const r = document.getElementById('theme-radius').value + 'px';
  const f = document.getElementById('theme-font').value;

  const cssString = `:root {
  --primary-color: ${p};
  --secondary-color: ${s};
  --bg-dark: ${bg};
  --glass-blur: ${bl};
  --card-glow: ${gl};
  --border-radius: ${r};
  --font-family: ${f};
}`;

  navigator.clipboard.writeText(cssString).then(() => {
    showToast("CSS theme variables copied to clipboard!", "success");
  }).catch(() => {
    showToast("Failed to export styles.", "error");
  });
};

// Reset Custom Theme styles
window.resetThemeStyles = () => {
  localStorage.removeItem('ankit_custom_theme');
  window.location.reload();
};

/* ==========================================================================
   6. Contact Submission & Toast Alerts
   ========================================================================== */
window.handleContactSubmit = (event) => {
  event.preventDefault();
  const name = document.getElementById('contact-name').value;
  const form = document.getElementById('contact-form');

  showToast(`Thank you, ${name}! Your encrypted inquiry has been simulated.`, "success");
  form.reset();
};

function showToast(message, type = "success") {
  const toast = document.getElementById('toast-notify');
  if (!toast) return;

  toast.querySelector('.toast-text').textContent = message;
  toast.querySelector('.toast-icon').textContent = type === 'success' ? '✅' : '❌';
  toast.className = `toast ${type}`;

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   7. Portfolio Filter Engine
   ========================================================================== */
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filterVal = tab.dataset.filter;
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
      if (filterVal === 'all' || card.dataset.category === filterVal) {
        card.style.display = '';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'none'; }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => { card.style.display = 'none'; }, 200);
      }
    });
  });
});
