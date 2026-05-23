/* ==========================================================================
   LILYGO WIRELESS INTEL SCALE LANDING - LOGIC & ANIMATIONS
   ========================================================================== */

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initAnatomyScrollTrigger();
  initLiveSimulators();
  initSmartphoneMockup();
  initInvestorCounters();
});

/* ==========================================================================
   1. HERO PAGE INTERACTIVE ANIMATIONS & PRELOADER
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  const bar = document.querySelector(".preloader-bar");
  const text = document.getElementById("preloader-text");
  
  if (!preloader) return;

  const loadTL = gsap.timeline({
    onComplete: () => {
      // Slide preloader out with premium slide-up transition
      gsap.to(preloader, {
        yPercent: -100,
        duration: 1.0,
        ease: "power4.inOut",
        onStart: () => {
          // Trigger the hero entrance sequence slightly after the slide starts
          gsap.delayedCall(0.2, () => {
            initHeroAnimations();
            initHeroMouseParallax();
          });
        },
        onComplete: () => {
          preloader.style.display = "none";
          document.body.classList.remove("loading-locked");
        }
      });
    }
  });

  // Loading bar & text reveal sequence
  loadTL
    .from(text, { opacity: 0, y: 20, duration: 1.2, ease: "power3.out" })
    .from(".preloader-badge", { opacity: 0, y: 10, duration: 0.8, ease: "power3.out" }, "-=0.8")
    .to(bar, { width: "100%", duration: 2.0, ease: "power2.inOut" }, "-=0.6");
}

function initHeroAnimations() {
  // Premium smooth entrance transitions
  const heroTL = gsap.timeline({ defaults: { ease: "power4.out" } });

  heroTL
    .from("#hud-header", { y: -30, opacity: 0, duration: 1.2 })
    .from(".badge-investor", { y: 15, opacity: 0, duration: 0.8 }, "-=0.6")
    .from(".hero-title", { y: 24, opacity: 0, duration: 1 }, "-=0.6")
    .from(".hero-description", { y: 16, opacity: 0, duration: 1 }, "-=0.8")
    .from(".hero-buttons", { y: 16, opacity: 0, duration: 1 }, "-=0.8")
    .from(".metric-card", { y: 16, opacity: 0, stagger: 0.1, duration: 1 }, "-=0.8")
    .from(".hero-visual", { scale: 0.95, opacity: 0, duration: 1.5 }, "-=1.2");

  // Subtle premium float drift effect on the main Hero ESP32 board
  gsap.to("#esp32-hero-wrapper", {
    y: -8,
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
}

function initHeroMouseParallax() {
  const heroSection = document.getElementById("hero-section");
  const boardWrapper = document.getElementById("esp32-hero-wrapper");
  const glowBack = document.querySelector(".device-glow-back");

  if (!heroSection || !boardWrapper) return;

  // Let the board react in real-time 3D perspective to mouse position
  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const rotX = -(y / rect.height) * 15; // Max 15 degrees tilt
    const rotY = (x / rect.width) * 15;   // Max 15 degrees tilt
    
    gsap.to(boardWrapper, {
      rotationX: rotX,
      rotationY: rotY,
      x: (x / rect.width) * 12,
      y: (y / rect.height) * 12,
      duration: 0.8,
      ease: "power2.out"
    });

    if (glowBack) {
      gsap.to(glowBack, {
        x: -(x / rect.width) * 20,
        y: -(y / rect.height) * 20,
        duration: 1.0,
        ease: "power2.out"
      });
    }
  });

  // Smoothly restore default floating and orientation on mouse leave
  heroSection.addEventListener("mouseleave", () => {
    gsap.to(boardWrapper, {
      rotationX: 5,
      rotationY: -3,
      x: 0,
      y: 0,
      duration: 1.5,
      ease: "power3.out"
    });
    if (glowBack) {
      gsap.to(glowBack, {
        x: 0,
        y: 0,
        duration: 1.5,
        ease: "power3.out"
      });
    }
  });
}

/* ==========================================================================
   2. ANATOMY EXPOLODED VIEW (SCROLLTRIGGER)
   ========================================================================== */
function initAnatomyScrollTrigger() {
  const isMobile = window.innerWidth <= 1024;
  
  if (isMobile) {
    // Mobile fallback: simple vertical scroll reveals
    gsap.utils.toArray(".anatomy-step").forEach((step) => {
      gsap.from(step, {
        scrollTrigger: {
          trigger: step,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      });
    });
    return;
  }

  // Scoped selectors for anatomy layers to ensure isolated styling
  const base = "#esp32-anatomy-svg #ana-base";
  const soc = "#esp32-anatomy-svg #ana-soc";
  const screen = "#esp32-anatomy-svg #ana-screen";
  const gps = "#esp32-anatomy-svg #ana-gps";
  const power = "#esp32-anatomy-svg #ana-power";
  const waves = "#esp32-anatomy-svg #ana-waves";

  // 1. Progressive Explosion Timeline
  // Drives layers smoothly into a suspended exploded view stack.
  // Completes early so layers stay in position while steps scroll and highlight.
  const exploderTL = gsap.timeline({
    scrollTrigger: {
      trigger: "#anatomy-section",
      start: "top 12%",
      end: "top -80%",
      scrub: 0.8
    }
  });

  exploderTL
    .to(screen, { y: -110, x: -10, scale: 1.05, duration: 1.5, ease: "power2.out" }, 0)
    .to(soc, { y: -45, x: -5, scale: 1.02, duration: 1.5, ease: "power2.out" }, 0)
    .to(gps, { x: 50, y: 30, scale: 0.95, duration: 1.5, ease: "power2.out" }, 0)
    .to(power, { x: -50, y: 30, scale: 0.95, duration: 1.5, ease: "power2.out" }, 0)
    .to(base, { y: 20, scale: 0.9, duration: 1.5, ease: "power2.out" }, 0);

  // 2. Highlighting Layer Controller mapped to text columns scrolling
  const steps = gsap.utils.toArray(".anatomy-step");
  steps.forEach((step, index) => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => setActiveStep(index),
      onEnterBack: () => setActiveStep(index)
    });
  });

  function setActiveStep(activeIndex) {
    // 1. Highlight current text row via CSS class
    steps.forEach((step, index) => {
      if (index === activeIndex) {
        step.classList.add("active-step");
      } else {
        step.classList.remove("active-step");
      }
    });

    // 2. Dim inactive layers, fully light up and pulse the active layer
    const layers = [
      { sel: base, index: 0 },
      { sel: soc, index: 1 },
      { sel: screen, index: 2 },
      { sel: gps, index: 3 },
      { sel: power, index: 4 }
    ];

    layers.forEach((layerObj) => {
      const element = document.querySelector(layerObj.sel);
      if (!element) return;

      const isActive = layerObj.index === activeIndex;

      // Animate opacity & modern drop shadow filter
      gsap.to(element, {
        opacity: isActive ? 1.0 : 0.22,
        filter: isActive ? "drop-shadow(0 15px 30px rgba(0,0,0,0.18))" : "none",
        duration: 0.5,
        overwrite: "auto",
        ease: "power2.out"
      });

      // Special visual feedback for active vector components
      if (layerObj.sel === screen) {
        // OLED SSD1306 stroke width glow pulse
        gsap.to("#esp32-anatomy-svg #ana-screen rect[stroke='#00e5ff']", {
          strokeWidth: isActive ? 3.5 : 1.5,
          duration: 0.5,
          overwrite: "auto"
        });
      } else if (layerObj.sel === soc) {
        // ESP32 chip contrast borders
        gsap.to("#esp32-anatomy-svg #ana-soc rect", {
          stroke: isActive ? "#ffb732" : "#4e5563",
          duration: 0.5,
          overwrite: "auto"
        });
      } else if (layerObj.sel === gps) {
        // GPS patch active satellite beacon
        gsap.to("#esp32-anatomy-svg #ana-gps circle", {
          fill: isActive ? "#39ff14" : "#fff",
          duration: 0.5,
          overwrite: "auto"
        });
      }
    });

    // WiFi / BLE Antenna wave expansion logic
    const wavesEl = document.querySelector(waves);
    if (wavesEl) {
      const isRFActive = activeIndex === 4 || activeIndex === 3;
      gsap.to(wavesEl, {
        opacity: isRFActive ? 0.85 : 0,
        scale: isRFActive ? 1.1 : 0.95,
        transformOrigin: "250px 110px",
        duration: 0.6,
        overwrite: "auto"
      });
    }
  }
}

/* ==========================================================================
   3. DEEP-TECH FUNCTIONALITIES SIMULATORS
   ========================================================================== */
function initLiveSimulators() {
  // A. WiFi Terminal Mock Data Output
  const terminal = document.getElementById("wifi-terminal");
  const wifiDevices = [
    { type: "PROBE_REQ", mac: "18:af:61:c0:92:ef", rssi: "-54dBm", detail: "Samsung_S22" },
    { type: "BEACON", mac: "70:d3:79:41:c2:08", rssi: "-72dBm", detail: "Office_Network_Guest" },
    { type: "BLE_ADV", mac: "f4:39:09:ac:71:0d", rssi: "-61dBm", detail: "SmartBand_H7" },
    { type: "PROBE_REQ", mac: "a8:96:75:e8:11:c3", rssi: "-48dBm", detail: "iPhone_15_Pro" },
    { type: "BEACON", mac: "00:1a:2b:3c:4d:5e", rssi: "-88dBm", detail: "Hidden_Sec_Cam" },
    { type: "BLE_TAG", mac: "d3:11:a4:90:5e:32", rssi: "-65dBm", detail: "Possible_Tracker_BLE" }
  ];

  let currentLine = 4;
  
  function addTerminalLine() {
    if (!terminal) return;
    
    // Choose random device log
    const dev = wifiDevices[Math.floor(Math.random() * wifiDevices.length)];
    const time = new Date().toLocaleTimeString('es-ES', { hour12: false });
    
    let typeSpan = "";
    if (dev.type === "PROBE_REQ") typeSpan = `<span class="output-cyan">PROBE_REQ</span>`;
    else if (dev.type === "BEACON") typeSpan = `<span class="output-green">BEACON</span>`;
    else if (dev.type === "BLE_TAG") typeSpan = `<span class="output-magenta">BLE_TAG</span>`;
    else typeSpan = `<span class="output-yellow">BLE_ADV</span>`;

    const lineHTML = `<div class="term-line" style="opacity: 0; transform: translateY(10px);"><span class="output-dim">${time}</span> ${typeSpan} MAC: <span class="output-white">${dev.mac}</span> RSSI: <span class="output-cyan">${dev.rssi}</span> INFO: "${dev.detail}"</div>`;
    
    terminal.insertAdjacentHTML("beforeend", lineHTML);
    
    // Animate the new line in
    const lastLine = terminal.lastElementChild;
    gsap.to(lastLine, { opacity: 1, translateY: 0, duration: 0.4 });
    
    // Keep only last 5 lines to prevent overflow
    if (terminal.children.length > 5) {
      terminal.removeChild(terminal.firstElementChild);
    }
  }

  // Start continuous simulator logs
  setInterval(addTerminalLine, 3500);

  // Premium scroll trigger for sections and animated elements
  gsap.utils.toArray(".animate-on-scroll").forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none reverse"
      },
      y: 24,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out"
    });
  });
}

/* ==========================================================================
   4. SMARTPHONE UI SIMULATOR (PORTAL DEMO)
   ========================================================================== */
function initSmartphoneMockup() {
  // "SIMULAR ALERTA DE STALKING" button event
  const alertBtn = document.getElementById("btn-ble-alert");
  if (alertBtn) {
    alertBtn.addEventListener("click", () => {
      const list = document.querySelector(".ble-list-simulation");
      if (!list) return;
      
      // Temporary threat addition styled elegantly for the cyber dark mode
      const threatHTML = `
        <div class="ble-item tracking-risk alert-flash" style="background: rgba(255, 59, 48, 0.08); border-left: 3px solid #ff3b30; padding: 6px 8px; display: flex; justify-content: space-between; align-items: center;">
          <div class="ble-meta">
            <span class="ble-name font-mono" style="font-size: 0.6rem; color: #ff3b30; font-weight: 700; display: block;">⚠️ CRÍTICO: AirTag Oculto</span>
            <span class="ble-mac font-mono" style="font-size: 0.5rem; color: #9ba3b0;">DISTANCIA: ~1.5m (Rastreo Continuo)</span>
          </div>
          <div class="ble-signal" style="text-align: right;">
            <span class="ble-rssi font-mono" style="font-size: 0.55rem; color: #ff3b30; font-weight: 700; display: block;">PELIGRO</span>
            <span class="ble-persistence" style="font-size: 0.45rem; color: #ff3b30; font-weight: 500;">CONFIRMADO 98%</span>
          </div>
        </div>
      `;

      // Insert at the beginning of the BLE list
      list.insertAdjacentHTML("afterbegin", threatHTML);

      // Disable button temporarily
      alertBtn.disabled = true;
      alertBtn.innerText = "¡ALERTA DE STALKING SIMULADA!";
      alertBtn.style.opacity = "0.7";

      const phone = document.querySelector(".phone-mockup");
      const flashTL = gsap.timeline();
      flashTL
        .to(phone, { borderColor: "#ff3b30", duration: 0.3, repeat: 3, yoyo: true })
        .to(phone, { borderColor: "#e3e3e8", duration: 0.6 });

      // Append alert entry in system logs tab (utilizing manufacturer data and signal heuristics)
      const consoleLog = document.getElementById("sys-console");
      if (consoleLog) {
        consoleLog.insertAdjacentHTML("beforeend", `<br><span class="text-danger" style="color: #ff3b30 !important; font-weight: 600;">[ALERT] Amenaza BLE: AirTag persistente detectado. RSSI: -42dBm, Confianza: 98%. PELIGRO DE SEGUIMIENTO ACTIVO.</span>`);
        consoleLog.scrollTop = consoleLog.scrollHeight;
      }

      // Remove after 6 seconds to restore default state
      setTimeout(() => {
        const item = list.querySelector(".alert-flash");
        if (item) {
          gsap.to(item, {
            opacity: 0,
            x: -50,
            duration: 0.5,
            onComplete: () => {
              item.remove();
              alertBtn.disabled = false;
              alertBtn.innerText = "SIMULAR ALERTA DE STALKING";
              alertBtn.style.opacity = "1";
            }
          });
        }
      }, 6000);
    });
  }
}

/* ==========================================================================
   5. INVESTOR COUNTER NUMBERS
   ========================================================================== */
function initInvestorCounters() {
  // Target counter elements
  const countCost = document.getElementById("count-cost");
  const countRoi = document.getElementById("count-roi");
  const countMarket = document.getElementById("count-market");

  // GSAP ScrollTrigger to start counts when pitch section is visible
  ScrollTrigger.create({
    trigger: "#pitch-section",
    start: "top 75%",
    onEnter: () => {
      // SRAM memory count (0 to 520 KB)
      animateCounter(countCost, 0, 520, "", " KB");
      // Xtensa Processor Frequency count (0 to 240 MHz)
      animateCounter(countRoi, 0, 240, "", " MHz");
      // Flash memory count (0 to 4 MB)
      animateCounter(countMarket, 0, 4, "", " MB");
    }
  });

  function animateCounter(element, start, end, prefix = "", suffix = "") {
    if (!element) return;
    
    const obj = { val: start };
    gsap.to(obj, {
      val: end,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        element.innerHTML = prefix + Math.floor(obj.val).toLocaleString() + suffix;
      }
    });
  }
}

