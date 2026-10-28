const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
      }
  });
}, observerOptions);

const logoImg = document.getElementById('logo-img');
const logoNormal = 'images/logo-normal.svg';
const logoWink = 'images/logo-wink.svg';

function startLogoWink() {
  if (!logoImg) return;
  
  function wink() {
      const baseInterval = 2000 + Math.random() * 3000;
      
      setTimeout(() => {
          logoImg.src = logoWink;
          setTimeout(() => {
              logoImg.src = logoNormal;
              wink();
          }, 150);
      }, baseInterval);
  }
  
  wink();
}

function initPageLoader() {
  const loaderLogo = document.getElementById('loader-logo');
  const pageLoader = document.getElementById('page-loader');
  const isHome = document.body.classList.contains('page-home');
  
  if (!loaderLogo || !pageLoader) return;
  
  setTimeout(() => {
      loaderLogo.src = 'images/logo-wink.svg';
      setTimeout(() => {
          loaderLogo.src = 'images/logo-normal.svg';
      }, 150);
  }, 1100);
  
  setTimeout(() => {
      if (pageLoader.parentNode) {
          pageLoader.parentNode.removeChild(pageLoader);
      }
  }, 1700);
  
  setTimeout(() => {
      const mainContainer = document.getElementById('main-container');
      if (mainContainer) {
          mainContainer.style.maskImage = 'none';
          mainContainer.style.webkitMaskImage = 'none';
      }
      if (isHome) {
          document.body.classList.add('is-edge-padded');
      }
  }, 1700);
}

document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('[data-animate]');
  animatedElements.forEach(el => {
      observer.observe(el);
  });
  
  initPageLoader();
  
  setTimeout(() => {
      startLogoWink();
  }, 1700);

  initClientsMarquee();
  setRandomLogoColors();
  initLogoCardClick();
});

function setRandomLogoColors() {
  const colors = ['#FFCC00', '#FF5E00', '#57B6FF', '#4D05AB'];
  const columns = document.querySelectorAll('.clients__logos-column');
  
  columns.forEach(col => {
    const cards = Array.from(col.querySelectorAll('.clients__logo-card'));
    const halfCards = cards.length / 2;
    
    for (let i = 0; i < halfCards; i++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      cards[i].style.backgroundColor = randomColor;
      if (cards[i + halfCards]) {
        cards[i + halfCards].style.backgroundColor = randomColor;
      }
    }
  });
}

function initLogoCardClick() {
  const cards = document.querySelectorAll('.clients__logo-card');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (!isTouchDevice) return;
  
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      
      cards.forEach(c => {
        if (c !== card) {
          c.classList.remove('active');
        }
      });
      
      if (card.classList.contains('active')) {
        card.classList.remove('active');
      } else {
        card.classList.add('active');
        setTimeout(() => {
          card.classList.remove('active');
        }, 1000);
      }
    });
  });
}

const AnimationUtils = {
  fadeIn: (element, duration = 600) => {
      element.style.opacity = '0';
      element.style.transition = `opacity ${duration}ms ease-in-out`;
      requestAnimationFrame(() => {
          element.style.opacity = '1';
      });
  },

  slide: (element, direction = 'up', duration = 600) => {
      const directions = {
          up: 'translateY(30px)',
          down: 'translateY(-30px)',
          left: 'translateX(30px)',
          right: 'translateX(-30px)'
      };
      
      element.style.transform = directions[direction] || directions.up;
      element.style.opacity = '0';
      element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
      
      requestAnimationFrame(() => {
          element.style.transform = 'translate(0, 0)';
          element.style.opacity = '1';
      });
  },

  scale: (element, from = 0.8, to = 1, duration = 600) => {
      element.style.transform = `scale(${from})`;
      element.style.opacity = '0';
      element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
      
      requestAnimationFrame(() => {
          element.style.transform = `scale(${to})`;
          element.style.opacity = '1';
      });
  }
};


function initClientsMarquee() {
  const columns = document.querySelectorAll('.clients__logos-column');
  if (!columns.length) return;

  columns.forEach(col => {
      if (col.dataset.marqueeInitialized === 'true') return;
      col.dataset.marqueeInitialized = 'true';

      const originalHTML = col.innerHTML;
      col.innerHTML = originalHTML + originalHTML;

      const isDown = col.classList.contains('clients__logos-column--down');
      const speed = 25;
      let offset = 0;
      let lastTime = null;

      function step(timestamp) {
          if (lastTime === null) {
              lastTime = timestamp;
              requestAnimationFrame(step);
              return;
          }
          const dt = (timestamp - lastTime) / 1000;
          lastTime = timestamp;

          const isMobile = window.innerWidth <= 1024;

          if (isMobile) {
              const halfWidth = col.scrollWidth / 2;
              if (isDown) {
                  offset += speed * dt;
                  if (offset >= 0) {
                      offset -= halfWidth;
                  }
              } else {
                  offset -= speed * dt;
                  if (Math.abs(offset) >= halfWidth) {
                      offset += halfWidth;
                  }
              }
              col.style.transform = `translateX(${offset}px)`;
          } else {
              const halfHeight = col.scrollHeight / 2;
              if (isDown) {
                  offset += speed * dt;
                  if (offset >= 0) {
                      offset -= halfHeight;
                  }
              } else {
                  offset -= speed * dt;
                  if (Math.abs(offset) >= halfHeight) {
                      offset += halfHeight;
                  }
              }
              col.style.transform = `translateY(${offset}px)`;
          }

          requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
  });
}

function initLogoWallCycle() {
  const loopDelay = 1.5;
  const duration  = 0.9;

  document.querySelectorAll('[data-logo-wall-cycle-init]').forEach(root => {
    const list   = root.querySelector('[data-logo-wall-list]');
    const items  = Array.from(list.querySelectorAll('[data-logo-wall-item]'));

    const shuffleFront = root.getAttribute('data-logo-wall-shuffle') !== 'false';
    const originalTargets = items
      .map(item => item.querySelector('[data-logo-wall-target]'))
      .filter(Boolean);

    let visibleItems   = [];
    let visibleCount   = 0;
    let pool           = [];
    let pattern        = [];
    let patternIndex   = 0;
    let tl;

    function isVisible(el) {
      return window.getComputedStyle(el).display !== 'none';
    }

    function shuffleArray(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function setup() {
      if (tl) {
        tl.kill();
      }
      visibleItems = items.filter(isVisible);
      visibleCount = visibleItems.length;

      pattern = shuffleArray(
        Array.from({ length: visibleCount }, (_, i) => i)
      );
      patternIndex = 0;

      items.forEach(item => {
        item.querySelectorAll('[data-logo-wall-target]').forEach(old => old.remove());
      });

      pool = originalTargets.map(n => n.cloneNode(true));

      let front, rest;
      if (shuffleFront) {
        const shuffledAll = shuffleArray(pool);
        front = shuffledAll.slice(0, visibleCount);
        rest  = shuffleArray(shuffledAll.slice(visibleCount));
      } else {
        front = pool.slice(0, visibleCount);
        rest  = shuffleArray(pool.slice(visibleCount));
      }
      pool = front.concat(rest);

      for (let i = 0; i < visibleCount; i++) {
        const parent =
          visibleItems[i].querySelector('[data-logo-wall-target-parent]') ||
          visibleItems[i];
        parent.appendChild(pool.shift());
      }

      tl = gsap.timeline({ repeat: -1, repeatDelay: loopDelay });
      tl.call(swapNext);
      tl.play();
    }

    function swapNext() {
      const nowCount = items.filter(isVisible).length;
      if (nowCount !== visibleCount) {
        setup();
        return;
      }
      if (!pool.length) return;

      const idx = pattern[patternIndex % visibleCount];
      patternIndex++;

      const container = visibleItems[idx];
      const parent =
        container.querySelector('[data-logo-wall-target-parent]') ||
        container.querySelector('*:has(> [data-logo-wall-target])') ||
        container;
      const existing = parent.querySelectorAll('[data-logo-wall-target]');
      if (existing.length > 1) return;

      const current  = parent.querySelector('[data-logo-wall-target]');
      const incoming = pool.shift();

      gsap.set(incoming, { yPercent: 50, autoAlpha: 0 });
      parent.appendChild(incoming);

      if (current) {
        gsap.to(current, {
          yPercent: -50,
          autoAlpha: 0,
          duration,
          ease: "expo.inOut",
          onComplete: () => {
            current.remove();
            pool.push(current);
          }
        });
      }

      gsap.to(incoming, {
        yPercent: 0,
        autoAlpha: 1,
        duration,
        delay: 0.1,
        ease: "expo.inOut"
      });
    }

    setup();

    ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onEnter:     () => tl.play(),
      onLeave:     () => tl.pause(),
      onEnterBack: () => tl.play(),
      onLeaveBack: () => tl.pause()
    });

    document.addEventListener('visibilitychange', () =>
      document.hidden ? tl.pause() : tl.play()
    );
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLogoWallCycle();
});




// Export für Module (falls verwendet)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnimationUtils;
}




if (typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function initFooterParallax(){
document.querySelectorAll('[data-footer-parallax]').forEach(el => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: 'clamp(top bottom)',
      end: 'clamp(top top)',
      scrub: true
    }
  });

  const inner = el.querySelector('[data-footer-parallax-inner]');
  const dark  = el.querySelector('[data-footer-parallax-dark]');

  if (inner) {
    tl.from(inner, {
      yPercent: -25,
      ease: 'linear'
    });
  }

  if (dark) {
    tl.from(dark, {
      opacity: 0.5,
      ease: 'linear'
    }, '<');
  }
});
}
// Initialize Footer with Parallax Effect
document.addEventListener('DOMContentLoaded', () => {
initFooterParallax();
});

function initFalling2DMatterJS() {
  const canvas = document.querySelector("#canvas-target");
  if (!canvas) return;
  function readSize() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width) || canvas.clientWidth || 0;
    const h = Math.round(rect.height) || canvas.clientHeight || 0;
    return { width: w + 2, height: h + 2 };
  }
  let size = readSize();
  if (size.width <= 0 || size.height <= 0) {
    let attempts = 0;
    function retry() {
      size = readSize();
      if (size.width > 0 && size.height > 0) {
        initFalling2DMatterJSInner(size);
        return;
      }
      if (++attempts < 20) requestAnimationFrame(retry);
    }
    requestAnimationFrame(retry);
    return;
  }
  initFalling2DMatterJSInner(size);
}

function initFalling2DMatterJSInner(size) {
  const canvasWidth = size.width;
  const canvasHeight = size.height;
  const canvas = document.querySelector("#canvas-target");
  if (!canvas) return;
  const canvasWallDepth = canvasWidth / 4;
  const smileyAmount = 15;
  const pillAspectRatio = 473 / 168;
  const isMobile = window.innerWidth <= 480;
  const pillBaseHeight = isMobile ? canvasWidth / 12 : canvasWidth / 15;
  const pillWidth = pillBaseHeight * pillAspectRatio;
  const pillHeight = pillBaseHeight;
  const pillTextureWidth = 473;
  const pillTextureHeight = 168;
  const pillXScale = pillWidth / pillTextureWidth;
  const pillYScale = pillHeight / pillTextureHeight;
  const smileyRestitution = 0.75;
  const worldGravity = 0.2;
  let { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Query } = Matter;
  let engine = Engine.create();
  engine.world.gravity.y = worldGravity;
  let render = Render.create({
    element: canvas,
    engine: engine,
    options: {
      background: "transparent",
      wireframes: false,
      width: canvasWidth,
      height: canvasHeight,
      pixelRatio: 2,
      border: "none",
    }
  });
  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
  let textureArray = [
    "assets/Pill1.svg", "assets/Pill2.svg", "assets/Pill3.svg", "assets/Pill4.svg",
    "assets/Pill5.svg", "assets/Pill6.svg", "assets/Pill7.svg", "assets/Pill8.svg",
    "assets/Pill9.svg", "assets/Pill10.svg", "assets/Pill11.svg"
  ];
  let textureIndex = 0;
  function getNextTexture() {
    const t = textureArray[textureIndex];
    textureIndex = (textureIndex + 1) % textureArray.length;
    return t;
  }
  const smileys = [];
  const smileyCreate = () => {
    let smiley = Bodies.rectangle(getRandomNumber(min, max), -pillHeight, pillWidth, pillHeight, {
      chamfer: { radius: pillHeight / 2 },
      restitution: smileyRestitution,
      render: {
        sprite: { texture: getNextTexture(), xScale: pillXScale, yScale: pillYScale },
        zIndex: 7
      },
      label: 'smiley'
    });
    Composite.add(engine.world, smiley);
    smileys.push(smiley);
    return smiley;
  };
  let min = pillWidth / 2;
  let max = canvasWidth - (pillWidth / 2);
  let boxTop = Bodies.rectangle(canvasWidth / 2 + (canvasWallDepth * 2), (canvasWallDepth * -1) - 100,
    canvasWidth + (canvasWallDepth * 4), (canvasWallDepth * 2), { isStatic: true });
  let boxLeft = Bodies.rectangle((canvasWallDepth * -1), canvasHeight / 2, (canvasWallDepth * 2),
    canvasHeight + 200, { isStatic: true });
  let boxRight = Bodies.rectangle(canvasWidth + canvasWallDepth, canvasHeight / 2,
    (canvasWallDepth * 2), canvasHeight + 200, { isStatic: true });
  let boxBottom = Bodies.rectangle(canvasWidth / 2 + (canvasWallDepth * 2), canvasHeight + canvasWallDepth,
    canvasWidth + (canvasWallDepth * 4), (canvasWallDepth * 2), { isStatic: true });
  Composite.add(engine.world, [boxTop, boxLeft, boxRight, boxBottom]);
  Render.run(render);
  let runner = Runner.create();
  Matter.Runner.run(runner, engine);
  function repeatedFunction(count, maxCount) {
    if (count < maxCount) {
      smileyCreate();
      setTimeout(() => repeatedFunction(count + 1, maxCount), 100);
    }
  }
  repeatedFunction(0, smileyAmount);
  let mouse = Mouse.create(render.canvas);
  let mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: { stiffness: 0.2, render: { visible: false } }
  });
  Composite.add(engine.world, mouseConstraint);
  Events.on(engine, 'mousedown', (event) => {
    const bodies = Matter.Query.point(engine.world.bodies, event.mouse.position);
    if (bodies.length > 0 && bodies[0].label === 'smiley') {
      Matter.Body.applyForce(bodies[0], bodies[0].position, { x: 0, y: -0.05 });
    }
  });
  const el = mouseConstraint.mouse.element;
  el.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
  el.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);
  el.removeEventListener('touchstart', mouseConstraint.mouse.mousedown);
  el.removeEventListener('touchmove', mouseConstraint.mouse.mousemove);
  el.removeEventListener('touchend', mouseConstraint.mouse.mouseup);
  el.addEventListener('touchstart', mouseConstraint.mouse.mousedown, { passive: true });
  el.addEventListener('touchmove', (e) => { if (mouseConstraint.body) mouseConstraint.mouse.mousemove(e); });
  el.addEventListener('touchend', (e) => { if (mouseConstraint.body) mouseConstraint.mouse.mouseup(e); });
}


if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
document.documentElement.classList.add('primary-mouse');
} else {
document.documentElement.classList.add('primary-touch');
}

function initSegmentedControl() {
const buttons = document.querySelectorAll('.segmented-control__button');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    buttons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
  });
});
}

async function loadFigmaDesign(fileIdOrUrl) {
try {
  const fileData = await initFigma(fileIdOrUrl);
  const colors = extractColors(fileData);
  const root = document.documentElement;
  Object.entries(colors).forEach(([name, color]) => {
    const cssVar = `--figma-${name.toLowerCase().replace(/\s+/g, '-')}`;
    root.style.setProperty(cssVar, color);
  });
  
  return fileData;
} catch (error) {
  console.error('Error loading Figma design:', error);
}
}

async function loadFigmaNavigation() {
try {
  const fileId = 'PJQNHV5e7UXfn3v6pKKZRO';
  const fileData = await getFigmaFile(fileId);
  
  if (!fileData) {
    // Figma API failed, use default navigation
    return;
  }
  
  const navNode = findNodeById(fileData.document, '1:51');
  
  if (navNode) {
    buildNavigationFromFigma(navNode);
  } else {
    const navNodes = findNodesByName(fileData.document, 'Navigation');
    if (navNodes.length > 0) {
      buildNavigationFromFigma(navNodes[0]);
    } else {
      buildNavigationFromFigma(fileData.document);
    }
  }
} catch (error) {
}
}

function findNodeById(node, targetId) {
if (node.id === targetId) {
  return node;
}

if (node.children) {
  for (const child of node.children) {
    const found = findNodeById(child, targetId);
    if (found) return found;
  }
}

return null;
}

function buildNavigationFromFigma(figmaNode) {
const navItems = [];

function extractNavItems(node, depth = 0) {
  if (node.type === 'TEXT' || node.name) {
    const name = node.name || '';
    if (name && name.length < 50 && !name.includes('Frame') && !name.includes('Group')) {
      navItems.push({
        name: name,
        id: node.id,
        type: node.type
      });
    }
  }
  
  if (node.children) {
    node.children.forEach(child => extractNavItems(child, depth + 1));
  }
}

extractNavItems(figmaNode);

const segmentedControl = document.querySelector('.segmented-control');
if (segmentedControl && navItems.length > 0) {
  segmentedControl.innerHTML = '';
  
  navItems.slice(0, 4).forEach((item, index) => {
    const button = document.createElement('button');
    button.className = 'segmented-control__button';
    button.textContent = item.name;
    button.setAttribute('data-segment', index);
    if (index === 0) button.classList.add('active');
    segmentedControl.appendChild(button);
  });
  
  // Re-initialize segmented control
  initSegmentedControl();
}
}

function initElasticPulseButtons() {
if (!window.matchMedia('(hover: hover)').matches) return;

const buttons = document.querySelectorAll('[data-elastic-pulse-btn]');

buttons.forEach(button => {
  let isLocked = false;
  let lockTimeout;
  
  const target = button.querySelector('[data-elastic-pulse-target]') || button;
  
  const computedStyle = window.getComputedStyle(target);
  const fontSize = parseFloat(computedStyle.fontSize);
  const stretch = 0.75 * fontSize;
  
  gsap.set(target, { transformOrigin: "center center" });
  
  button.addEventListener('mouseenter', function() {
    if (isLocked) return;
    
    isLocked = true;
    gsap.killTweensOf(target);
    
    const width = target.offsetWidth;
    const height = target.offsetHeight;
    const scaleX = 1 + (stretch / width);
    const scaleY = 1 + (stretch / height);
    
    gsap.to(target, {
      scaleX: scaleX,
      scaleY: scaleY,
      duration: 0.4,
      ease: "elastic.out(1, 0.5)",
      onComplete: () => {
        gsap.to(target, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)"
        });
      }
    });
    
    // Lock for 500ms to prevent spam
    clearTimeout(lockTimeout);
    lockTimeout = setTimeout(() => {
      isLocked = false;
    }, 500);
  });
  
  button.addEventListener('mouseleave', function() {
    gsap.killTweensOf(target);
    gsap.to(target, {
      scaleX: 1,
      scaleY: 1,
      duration: 0.3,
      ease: "power2.out"
    });
    clearTimeout(lockTimeout);
    isLocked = false;
  });
});
}

// Tooltip System - Follows Mouse (canvas / smiley only, logo tooltip disabled on homepage)
function initMouseFollowTooltips() {
  const smileyTooltip = document.createElement('span');
  smileyTooltip.className = 'smiley-tooltip';
  smileyTooltip.id = 'smiley-tooltip';
  smileyTooltip.textContent = 'Play With Me!';
  document.body.appendChild(smileyTooltip);

  const canvas = document.querySelector('#canvas-target');
  if (canvas) {
    let isHoveringSmiley = false;
    canvas.addEventListener('mousemove', (e) => {
      if (isHoveringSmiley) {
        smileyTooltip.style.left = (e.clientX + 15) + 'px';
        smileyTooltip.style.top = (e.clientY + 15) + 'px';
      }
    });
    canvas.addEventListener('mouseenter', () => {
      isHoveringSmiley = true;
      smileyTooltip.classList.add('visible');
    });
    canvas.addEventListener('mouseleave', () => {
      isHoveringSmiley = false;
      smileyTooltip.classList.remove('visible');
    });
  }
}

// Tooltip System – Subpage logo (independent from homepage)
function initSubpageLogoTooltip() {
  const logoSubpage = document.querySelector('.logo-subpage');
  const logoImgSubpage = document.getElementById('logo-img-blog');
  const logoTooltipSubpage = document.getElementById('logo-tooltip-subpage');

  if (!logoSubpage || !logoImgSubpage || !logoTooltipSubpage) return;

  // Gleicher Stil wie auf der Startseite: Tooltip folgt der Maus (aber eigene Klasse/IDs)
  logoSubpage.addEventListener('mouseenter', (e) => {
    logoTooltipSubpage.classList.add('visible');
    logoTooltipSubpage.style.left = (e.clientX + 15) + 'px';
    logoTooltipSubpage.style.top = (e.clientY + 15) + 'px';
  });

  logoSubpage.addEventListener('mousemove', (e) => {
    if (!logoTooltipSubpage.classList.contains('visible')) return;
    logoTooltipSubpage.style.left = (e.clientX + 15) + 'px';
    logoTooltipSubpage.style.top = (e.clientY + 15) + 'px';
  });

  logoSubpage.addEventListener('mouseleave', () => {
    logoTooltipSubpage.classList.remove('visible');
  });
}

function wrapTitleWords(container) {
  const textContent = container.textContent.trim();
  const words = textContent.split(/\s+/).filter(Boolean);
  const isHomeHero = !!container.closest('.hero-copy--home');
  const wordGap = isHomeHero ? '0.4em' : '0.3em';

  container.innerHTML = '';

  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'hero-title__word';
    wordSpan.style.display = 'inline-block';
    wordSpan.style.overflow = 'visible';
    wordSpan.style.marginRight = wordIndex < words.length - 1 ? wordGap : '0';
    wordSpan.style.verticalAlign = 'baseline';

    const wordInner = document.createElement('span');
    wordInner.style.display = 'inline-block';
    wordInner.style.overflow = 'visible';
    wordInner.style.opacity = '0';
    wordInner.style.filter = 'blur(10px)';
    wordInner.textContent = word;
    wordSpan.appendChild(wordInner);

    container.appendChild(wordSpan);

    if (!isHomeHero && wordIndex < words.length - 1) {
      const space = document.createElement('span');
      space.textContent = ' ';
      space.style.display = 'inline-block';
      container.appendChild(space);
    }
  });
}

function shuffleComingSoonWork() {
  const grid = document.querySelector('.page-home .tko-stories__grid');
  if (!grid) return;

  const live = Array.from(grid.querySelectorAll('[data-work="live"]'));
  const soon = Array.from(grid.querySelectorAll('[data-work="soon"]'));
  if (!soon.length) return;

  for (let i = soon.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = soon[i];
    soon[i] = soon[j];
    soon[j] = swap;
  }

  live.forEach((col) => grid.appendChild(col));
  soon.forEach((col) => grid.appendChild(col));

  Array.from(grid.querySelectorAll('.tko-tile')).forEach((tile, index) => {
    tile.classList.toggle('tko-tile--odd', index % 2 === 0);
    tile.classList.toggle('tko-tile--even', index % 2 === 1);
  });
}

function initMutedVideoAutoplay() {
  const videos = Array.from(document.querySelectorAll('video'));
  if (!videos.length) return;

  const playVideo = (video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.removeAttribute('controls');
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) playVideo(entry.target);
    });
  }, { threshold: 0.2, rootMargin: '80px 0px' });

  videos.forEach((video) => {
    playVideo(video);
    io.observe(video);
    video.addEventListener('loadeddata', () => playVideo(video));
  });

  const unlock = () => videos.forEach(playVideo);
  document.addEventListener('touchstart', unlock, { once: true, passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) videos.forEach(playVideo);
  });
}

function initSeamlessVideoLoops() {
  const videos = Array.from(document.querySelectorAll('video[loop], .tko-stories video'));
  if (!videos.length) return;

  videos.forEach((video) => {
    if (video.hasAttribute('data-start')) return;
    if (video.dataset.seamlessLoop === '1') return;
    video.dataset.seamlessLoop = '1';
    video.loop = false;
    video.removeAttribute('loop');

    let seeking = false;
    const restart = () => {
      if (seeking) return;
      const duration = video.duration;
      if (!isFinite(duration) || duration <= 0.2) return;
      const pad = Math.min(0.16, duration * 0.04);
      if (video.currentTime < duration - pad) return;
      seeking = true;
      try {
        video.currentTime = 0.03;
      } catch (err) {
        seeking = false;
      }
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    };

    video.addEventListener('timeupdate', restart);
    video.addEventListener('ended', restart);
    video.addEventListener('seeked', () => {
      seeking = false;
    });
  });
}

function initWorkTileHover() {
  if (typeof gsap === 'undefined') return;
  const tiles = document.querySelectorAll('.page-home .tko-tile');
  if (!tiles.length) return;

  const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1167px)');

  tiles.forEach((tile) => {
    const media = tile.querySelector('.tko-tile__media');
    const inner = media && media.querySelector('figure');
    if (!media || !inner) return;

    const xTo = gsap.quickTo(inner, 'x', { duration: 0.55, ease: 'power3.out' });
    const yTo = gsap.quickTo(inner, 'y', { duration: 0.55, ease: 'power3.out' });
    const rotXTo = gsap.quickTo(inner, 'rotationX', { duration: 0.45, ease: 'power2.out' });
    const rotYTo = gsap.quickTo(inner, 'rotationY', { duration: 0.45, ease: 'power2.out' });

    gsap.set(media, { transformPerspective: 900 });
    gsap.set(inner, { transformOrigin: 'center center' });

    tile.addEventListener('mouseenter', () => {
      if (!mq.matches || !motionOk) return;
      tile.classList.add('is-hover');
      gsap.to(inner, { scale: 1.12, duration: 0.75, ease: 'power3.out' });
    });

    tile.addEventListener('mousemove', (e) => {
      if (!mq.matches || !motionOk) return;
      const rect = media.getBoundingClientRect();
      const rx = (e.clientX - rect.left) / rect.width - 0.5;
      const ry = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(rx * -22);
      yTo(ry * -18);
      rotYTo(rx * 8);
      rotXTo(ry * -7);
    });

    tile.addEventListener('mouseleave', () => {
      tile.classList.remove('is-hover');
      gsap.to(inner, { scale: 1, x: 0, y: 0, rotationX: 0, rotationY: 0, duration: 0.7, ease: 'power3.out' });
    });
  });
}

function initHomeHeroVideo() {
  const video = document.querySelector('.hero-video-bg__video');
  if (!video) return;

  const tryPlay = () => {
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  };

  tryPlay();
  video.addEventListener('loadeddata', tryPlay);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryPlay();
  });
}

function initH1Animation() {
  const title = document.querySelector('.prevent-hero .hero-title') || document.querySelector('.main-content .hero-title') || document.querySelector('.hero-title');
  if (!title) return;
  gsap.set(title, { opacity: 0 });
document.fonts.ready.then(() => {

  const lineEls = title.querySelectorAll('.hero-title__line');
  if (lineEls.length) {
    lineEls.forEach(wrapTitleWords);
  } else {
    wrapTitleWords(title);
  }

  const wordSpans = title.querySelectorAll('.hero-title__word > span, span > span');

  gsap.set(wordSpans, {
    opacity: 0,
    filter: 'blur(10px)'
  });
  gsap.set(title, { opacity: 1 });

  const tl = gsap.timeline({ paused: true });

  wordSpans.forEach((wordSpan, index) => {
    tl.to(wordSpan, {
      duration: 0.3,
      opacity: 1,
      ease: "power2.out"
    }, index * 0.12);

    tl.to(wordSpan, {
      duration: 0.6,
      filter: 'blur(0px)',
      ease: "power2.out"
    }, index * 0.12 + 0.2);
  });

  // Start nach dem Loader auf Startseite; auf Prevent-Seite früher (kein Loader)
  const isPrevent = title.closest('.prevent-hero');
  const delay = isPrevent ? 600 : 1700;
  setTimeout(() => {
    tl.play(0);
  }, delay);
});
}

function initClientsHeadingAnimation() {
document.fonts.ready.then(() => {
  const title = document.querySelector('.clients__title');
  const subtitle = document.querySelector('.clients__subtitle');
  if (!title || !subtitle) return;

  const elements = [title, subtitle];

  elements.forEach((el, elIndex) => {
    const textContent = el.textContent;
    const words = textContent.split(' ');

    el.innerHTML = '';

    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.overflow = 'visible';
      wordSpan.style.marginRight = '0.3em';
      wordSpan.style.verticalAlign = 'baseline';

      const wordInner = document.createElement('span');
      wordInner.style.display = 'inline-block';
      wordInner.style.overflow = 'visible';
      wordInner.textContent = word;
      wordSpan.appendChild(wordInner);

      el.appendChild(wordSpan);

      if (wordIndex < words.length - 1) {
        const space = document.createElement('span');
        space.textContent = ' ';
        space.style.display = 'inline-block';
        el.appendChild(space);
      }
    });

    const wordSpans = el.querySelectorAll('span > span');

    gsap.set(wordSpans, {
      opacity: 0,
      filter: 'blur(10px)'
    });
    gsap.set(el, { opacity: 1 });

    const tl = gsap.timeline({ paused: true });

    wordSpans.forEach((wordSpan, index) => {
      const base = elIndex * 0.3;
      tl.to(wordSpan, {
        duration: 0.3,
        opacity: 1,
        ease: "power2.out"
      }, base + index * 0.12);

      tl.to(wordSpan, {
        duration: 0.6,
        filter: 'blur(0px)',
        ease: "power2.out"
      }, base + index * 0.12 + 0.2);
    });

    const targetSection = document.querySelector('.clients') || el;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tl.play(0);
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    observer.observe(targetSection);
  });
});
}

// Continuous letter animations - individual letters get thinner
function initLetterAnimations(textElement) {
// Get all individual word spans
const wordSpans = textElement.querySelectorAll('span > span');
const allChars = [];

wordSpans.forEach((wordSpan) => {
  const word = wordSpan.textContent;
  const chars = word.split('');
  
  wordSpan.innerHTML = '';
  chars.forEach((char) => {
    const charSpan = document.createElement('span');
    charSpan.textContent = char === ' ' ? '\u00A0' : char;
    charSpan.style.display = 'inline-block';
    charSpan.style.fontWeight = '600';
    wordSpan.appendChild(charSpan);
    allChars.push(charSpan);
  });
});

// Animate individual letters one at a time - only thinner, never thicker
let currentlyAnimating = new Set(); // Track which chars are animating

function animateRandomChar() {
  if (allChars.length === 0) return;
  
  // Filter out characters that are currently animating
  const availableChars = allChars.filter(char => !currentlyAnimating.has(char));
  
  if (availableChars.length === 0) {
    // If all are animating, wait a bit longer
    setTimeout(animateRandomChar, 1000);
    return;
  }
  
  // Pick a random character from available ones
  const randomChar = availableChars[Math.floor(Math.random() * availableChars.length)];
  
  // Mark as animating
  currentlyAnimating.add(randomChar);
  
  // Animate font-weight to thinner (300-400)
  const thinWeight = 300 + Math.random() * 100; // 300-400
  
  gsap.to(randomChar, {
    fontWeight: thinWeight,
    duration: 2.5,
    ease: "sine.inOut",
    onComplete: () => {
      // Return to normal weight smoothly
      gsap.to(randomChar, {
        fontWeight: '600',
        duration: 3,
        ease: "sine.inOut",
        onComplete: () => {
          currentlyAnimating.delete(randomChar);
        }
      });
    }
  });
  
  const nextDelay = 800 + Math.random() * 1200;
  setTimeout(animateRandomChar, nextDelay);
}

setTimeout(animateRandomChar, 1500);
}

let galleryFlipCtx;

const createGalleryTween = () => {
let galleryElement = document.querySelector("#gallery-8");
if (!galleryElement) return;

let galleryItems = galleryElement.querySelectorAll(".gallery__item");

galleryFlipCtx && galleryFlipCtx.revert();

// Start OHNE gallery--final (großes Bild = initial state)
galleryElement.classList.remove("gallery--final");

galleryFlipCtx = gsap.context(() => {
  // Aktuellen State (großes Bild) erfassen
  const flipState = Flip.getState(galleryItems);

  // Zu bento Layout wechseln (klein)
  galleryElement.classList.add("gallery--final");

  const flip = Flip.to(flipState, {
    simple: true,
    ease: "expoScale(1, 5)"
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: galleryElement,
      start: "center center",
      end: "+=100%",
      scrub: true,
      pin: galleryElement.parentNode
    }
  });

  tl.add(flip);

  return () => gsap.set(galleryItems, { clearProps: "all" });
});
};

function onPageReady() {
  initSegmentedControl();
  loadFigmaNavigation();
  initElasticPulseButtons();
  initMouseFollowTooltips();
  initClientsHeadingAnimation();
  initFooterModals();
  createGalleryTween();
  window.addEventListener("resize", createGalleryTween);
  initComingSoonTooltips();
  initLogoSpeechBubble();
  initPreventHypothesisTabs();
  initPreventSectionReveal();

  var logoBlog = document.querySelector('.logo-subpage');
  var speechBubbleBlog = document.getElementById('logo-speech-bubble-subpage');
  var logoTooltipBlog = document.getElementById('logo-tooltip-subpage');
  if (logoBlog) {
    if (speechBubbleBlog) {
      initLogoSpeechBubbleBlog();
    }
    if (logoTooltipBlog) {
      initSubpageLogoTooltip();
    }
  }

  initWorkButtonTooltip();

  if (document.querySelector('.main-content .hero-title') || document.querySelector('.prevent-hero .hero-title')) {
    initH1Animation();
  }

  initHomeHeroVideo();
  shuffleComingSoonWork();
  initMutedVideoAutoplay();
  initSeamlessVideoLoops();
  initWorkTileHover();

  if (document.querySelector('.blog-letters')) {
    initBlogFilters();
    initBlogSubscribe();
  }

  setTimeout(function () {
    initFalling2DMatterJS();
  }, 1700);

}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onPageReady);
} else {
  onPageReady();
}

// Coming Soon Tooltips für Navigation
function initComingSoonTooltips() {
const naviButtons = document.querySelectorAll('.navi-coming-soon');

naviButtons.forEach(button => {
  const tooltip = button.querySelector('.navi-tooltip');
  if (!tooltip) return;
  if (tooltip.parentElement !== document.body) {
    document.body.appendChild(tooltip);
  }
  
  let tooltipTimeout;
  let isMobile = window.innerWidth <= 1166;
  
  button.addEventListener('mouseenter', () => {
    if (!isMobile) {
      tooltip.classList.add('visible');
    }
  });
  
  button.addEventListener('mousemove', (e) => {
    if (!isMobile) {
      tooltip.style.left = (e.clientX + 15) + 'px';
      tooltip.style.top = (e.clientY + 15) + 'px';
    }
  });
  
  button.addEventListener('mouseleave', () => {
    if (!isMobile) {
      tooltip.classList.remove('visible');
    }
  });
  
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMobile) {
      naviButtons.forEach(otherButton => {
        if (otherButton !== button) {
          const otherTooltip = otherButton.querySelector('.navi-tooltip');
          if (otherTooltip) {
            otherTooltip.classList.remove('visible');
          }
        }
      });
      
      // Zeige Tooltip an der Click-Position
      tooltip.style.left = (e.clientX + 15) + 'px';
      tooltip.style.top = (e.clientY + 15) + 'px';
      tooltip.classList.add('visible');
      
      // Verstecke nach 3 Sekunden
      clearTimeout(tooltipTimeout);
      tooltipTimeout = setTimeout(() => {
        tooltip.classList.remove('visible');
      }, 3000);
    }
  });
  
  // Click außerhalb schließt Tooltip auf Mobile
  document.addEventListener('click', (e) => {
    if (isMobile && !button.contains(e.target)) {
      tooltip.classList.remove('visible');
    }
  });
  
  // Update isMobile on resize
  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 1166;
    if (!isMobile) {
      tooltip.classList.remove('visible');
    }
  });
});
}

function initFooterModals() {
const openButtons = document.querySelectorAll('[data-modal-open]');
const modals = document.querySelectorAll('.modal');

if (!openButtons.length || !modals.length) return;

function closeModal(modal) {
  modal.classList.remove('is-open');
}

openButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-modal-open');
    const modal = document.querySelector(`#modal-${id}`);
    if (modal) {
      modal.classList.add('is-open');
    }
  });
});

modals.forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-modal-close]') || e.target.classList.contains('modal__backdrop')) {
      closeModal(modal);
    }
  });
});
}

// Logo Speech Bubble
function initLogoSpeechBubble() {
const logo = document.querySelector('.logo');
const speechBubble = document.getElementById('logo-speech-bubble');

if (!logo || !speechBubble) return;

const mobileMessages = [
  'Let\'s build!',
  'Ready?',
  'Why wait?',
  'Let\'s go'
];

const desktopMessages = [
  'Ready for a new project?',
  'Let\'s build something amazing together!',
  'Got an idea? Let\'s make it happen!',
  'Looking for a design partner?',
  'Time to create something special?',
  'Need help with your next project?'
];

function getMessages() {
  return window.innerWidth <= 480 ? mobileMessages : desktopMessages;
}

let currentMessageIndex = 0;
let speechBubbleInterval;
let isHovering = false;

function showNextMessage() {
  if (isHovering) return;
  
  const messages = getMessages();
  speechBubble.textContent = messages[currentMessageIndex];
  speechBubble.classList.add('visible');
  positionSpeechBubble();
  
  setTimeout(() => {
    if (!isHovering) {
      speechBubble.classList.remove('visible');
    }
  }, 4000);
  
  currentMessageIndex = (currentMessageIndex + 1) % messages.length;
}

function positionSpeechBubble() {
  if (!speechBubble.classList.contains('visible')) return;
  
  const logoRect = logo.getBoundingClientRect();
  const isMobile = window.innerWidth <= 480;
  
  if (isMobile) {
    speechBubble.style.left = (logoRect.right + 12) + 'px';
    speechBubble.style.top = (logoRect.top + logoRect.height / 2 + 8) + 'px';
    speechBubble.style.transform = 'translateY(-50%) translateX(0)';
  } else {
    speechBubble.style.left = (logoRect.right + 12) + 'px';
    speechBubble.style.top = (logoRect.top + logoRect.height / 2 + 8) + 'px';
    speechBubble.style.transform = 'translateY(-50%) translateX(-10px)';
  }
}

setTimeout(() => {
  showNextMessage();
}, 5000);

function scheduleNext() {
  const delay = 15000 + Math.random() * 5000;
  speechBubbleInterval = setTimeout(() => {
    const messages = getMessages();
    if (currentMessageIndex >= messages.length) {
      currentMessageIndex = 0;
    }
    showNextMessage();
    scheduleNext();
  }, delay);
}

scheduleNext();

// Hide on hover
logo.addEventListener('mouseenter', () => {
  isHovering = true;
  speechBubble.classList.remove('visible');
});

logo.addEventListener('mouseleave', () => {
  isHovering = false;
});

const positionInterval = setInterval(() => {
  if (speechBubble.classList.contains('visible')) {
    positionSpeechBubble();
  }
}, 100);

window.addEventListener('scroll', positionSpeechBubble);
window.addEventListener('resize', () => {
  positionSpeechBubble();
  const messages = getMessages();
  if (currentMessageIndex >= messages.length) {
    currentMessageIndex = 0;
  }
});
}

function initLogoSpeechBubbleBlog() {
const logo = document.querySelector('.logo-subpage');
const speechBubble = document.getElementById('logo-speech-bubble-subpage');

if (!logo || !speechBubble) return;

const mobileMessages = [
  'Let\'s build!',
  'Ready?',
  'Why wait?',
  'Let\'s go'
];

const desktopMessages = [
  'Ready for a new project?',
  'Let\'s build something amazing together!',
  'Got an idea? Let\'s make it happen!',
  'Looking for a design partner?',
  'Time to create something special?',
  'Need help with your next project?'
];

function getMessages() {
  return window.innerWidth <= 480 ? mobileMessages : desktopMessages;
}

let currentMessageIndex = 0;
let speechBubbleInterval;
let isHovering = false;

function showNextMessage() {
  if (isHovering) return;
  
  const messages = getMessages();
  speechBubble.textContent = messages[currentMessageIndex];
  speechBubble.classList.add('visible');
  positionSpeechBubble();
  
  setTimeout(() => {
    if (!isHovering) {
      speechBubble.classList.remove('visible');
    }
  }, 4000);
  
  currentMessageIndex = (currentMessageIndex + 1) % messages.length;
}

function positionSpeechBubble() {
  if (!speechBubble.classList.contains('visible')) return;
  
  const logoRect = logo.getBoundingClientRect();
  const isMobile = window.innerWidth <= 480;
  
  if (isMobile) {
    speechBubble.style.left = (logoRect.right + 8) + 'px';
    speechBubble.style.top = (logoRect.top + logoRect.height / 2 + 8) + 'px';
  } else {
    speechBubble.style.left = (logoRect.right + 8) + 'px';
    speechBubble.style.top = (logoRect.top + logoRect.height / 2 + 8) + 'px';
  }
}

logo.addEventListener('mouseenter', () => {
  isHovering = true;
  const messages = getMessages();
  speechBubble.textContent = messages[Math.floor(Math.random() * messages.length)];
  speechBubble.classList.add('visible');
  positionSpeechBubble();
});

logo.addEventListener('mouseleave', () => {
  isHovering = false;
  speechBubble.classList.remove('visible');
});

logo.addEventListener('mousemove', positionSpeechBubble);

window.addEventListener('resize', () => {
  if (speechBubble.classList.contains('visible')) {
    positionSpeechBubble();
  }
});

// Initial message after delay
setTimeout(() => {
  showNextMessage();
  speechBubbleInterval = setInterval(showNextMessage, 8000);
}, 3000);
}

function initWorkButtonTooltip() {
const workButtons = document.querySelectorAll('.work-coming-soon');

workButtons.forEach(workButton => {
  const tooltip = workButton.querySelector('.work-tooltip');
  if (!tooltip) return;
  
  if (tooltip.parentNode !== document.body) {
    document.body.appendChild(tooltip);
  }
  
  let tooltipTimeout;
  let isMobile = window.innerWidth <= 1166;
  
  workButton.addEventListener('mouseenter', (e) => {
    if (!isMobile) {
      tooltip.classList.add('visible');
      const x = e.clientX + 15;
      const y = e.clientY + 15;
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    }
  });
  
  workButton.addEventListener('mousemove', (e) => {
    if (!isMobile) {
      const x = e.clientX + 15;
      const y = e.clientY + 15;
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    }
  });
  
  workButton.addEventListener('mouseleave', () => {
    if (!isMobile) {
      tooltip.classList.remove('visible');
    }
  });
  
  const content = workButton.querySelector('.elastic-pulse-btn-primary__content');
  if (content) {
    content.addEventListener('mouseenter', (e) => {
      if (!isMobile) {
        tooltip.classList.add('visible');
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
      }
    });
    
    content.addEventListener('mousemove', (e) => {
      if (!isMobile) {
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
      }
    });
    
    content.addEventListener('mouseleave', () => {
      if (!isMobile) {
        tooltip.classList.remove('visible');
      }
    });
  }
  
  workButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMobile) {
      workButtons.forEach(otherButton => {
        if (otherButton !== workButton) {
          const otherTooltip = otherButton.querySelector('.work-tooltip');
          if (otherTooltip) {
            otherTooltip.classList.remove('visible');
          }
        }
      });
      
      // Zeige Tooltip an der Click-Position
      tooltip.style.left = (e.clientX + 15) + 'px';
      tooltip.style.top = (e.clientY + 15) + 'px';
      tooltip.classList.add('visible');
      
      // Verstecke nach 3 Sekunden
      clearTimeout(tooltipTimeout);
      tooltipTimeout = setTimeout(() => {
        tooltip.classList.remove('visible');
      }, 3000);
    }
  });
  
  // Click außerhalb schließt Tooltip auf Mobile
  document.addEventListener('click', (e) => {
    if (isMobile && !workButton.contains(e.target)) {
      tooltip.classList.remove('visible');
    }
  });
  
  // Update isMobile on resize
  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 1166;
    if (!isMobile) {
      tooltip.classList.remove('visible');
    }
  });
});
}

function initBlogFilters() {
  const filterItems = document.querySelectorAll('.blog-filter-item');
  const blogPosts = document.querySelectorAll('.blog-post-card');
  const searchInput = document.querySelector('.blog-search-input');
  
  if (!filterItems.length || !blogPosts.length) {
    return;
  }
  
  function filterPosts() {
    const activeFilter = document.querySelector('.blog-filter-item.active')?.dataset.filter || 'all';
    const searchTerm = searchInput?.value.toLowerCase() || '';
    
    blogPosts.forEach(post => {
      const category = post.dataset.category || '';
      const title = post.querySelector('.blog-post-title')?.textContent.toLowerCase() || '';
      
      const matchesFilter = activeFilter === 'all' || category === activeFilter;
      const matchesSearch = !searchTerm || title.includes(searchTerm);
      
      if (matchesFilter && matchesSearch) {
        post.style.display = 'block';
      } else {
        post.style.display = 'none';
      }
    });
  }
  
  filterItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      filterItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      filterPosts();
    });
  });
  
  if (searchInput) {
    searchInput.addEventListener('input', filterPosts);
    searchInput.addEventListener('keyup', filterPosts);
    searchInput.addEventListener('change', filterPosts);
  }
  
  filterPosts();
}

function initBlogSubscribe() {
  const subscribeForms = document.querySelectorAll('.blog-subscribe-form');
  
  if (!subscribeForms.length) {
    return;
  }
  
  subscribeForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const emailInput = form.querySelector('.blog-form-input');
      const email = emailInput?.value.trim();
      
      if (!email) {
        alert('Please enter your email address.');
        emailInput.focus();
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        emailInput.focus();
        return;
      }
      
      const subject = encodeURIComponent('Newsletter Subscription');
      const body = encodeURIComponent(`Hi Daniel!\n\nI would like to subscribe to your newsletter.\n\nEmail: ${email}\n\nBest Regards`);
      const mailtoLink = `mailto:daniel@sacharov.com?subject=${subject}&body=${body}`;
      
      window.location.href = mailtoLink;
      
      emailInput.value = '';
      
      const button = form.querySelector('.blog-subscribe-button');
      if (button) {
        const originalText = button.querySelector('p')?.textContent || 'Subscribe';
        if (button.querySelector('p')) {
          button.querySelector('p').textContent = 'Subscribed!';
        }
        button.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
          if (button.querySelector('p')) {
            button.querySelector('p').textContent = originalText;
          }
          button.style.backgroundColor = '#000';
        }, 2000);
      }
    });
  });
}

function initPreventSectionReveal() {
  var sections = document.querySelectorAll('.prevent-reveal');
  if (!sections.length) return;
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  sections.forEach(function (el) { return revealObserver.observe(el); });
}

function initPreventHypothesisTabs() {
  const section = document.querySelector('.prevent-hypothesis');
  if (!section) return;
  const img = section.querySelector('.prevent-hypothesis__media-img');
  const tabsContainer = section.querySelector('.prevent-hypothesis__tabs');
  if (!img || !tabsContainer) return;

  const textEl = section.querySelector('[data-hypothesis-text-content]');
  const labelEl = section.querySelector('[data-hypothesis-label]');
  const slider = tabsContainer.querySelector('.prevent-hypothesis__tab-slider');
  const captionEl = section.querySelector('[data-hypothesis-caption]');
  const variants = {
    problem: {
      src: 'assets/projects/prevent/mail_app.jpg',
      alt: 'Medical results as PDFs',
      label: 'Problem',
      text: 'Most patients receive their medical results as static PDFs without explanation, making it difficult to interpret what the values actually mean.'
    },
    hypothesis: {
      src: 'assets/projects/prevent/health_app_portfolio_bg_2.jpg',
      alt: 'Interactive platform',
      label: 'Hypothesis',
      text: 'Providing medical results in an interactive platform with explanations and context will help patients interpret their results more accurately.'
    },
    researchQuestion: {
      src: 'assets/projects/prevent/customer_testimonial.jpg',
      alt: 'Research question',
      label: 'Research Question',
      text: 'Which parts of medical results cause the most confusion or misinterpretation for patients?'
    }
  };

  function updateSliderPosition() {
    if (!slider) return;
    var activeBtn = tabsContainer.querySelector('.prevent-hypothesis__tab--active');
    if (activeBtn) {
      slider.style.left = activeBtn.offsetLeft + 'px';
      slider.style.width = activeBtn.offsetWidth + 'px';
    }
  }

  function activate(key) {
    var v = variants[key];
    if (!v) return;

    section.querySelectorAll('[data-hypothesis-tab]').forEach(function (btn) {
      btn.classList.toggle('prevent-hypothesis__tab--active', btn.getAttribute('data-hypothesis-tab') === key);
    });
    updateSliderPosition();

    textEl.classList.add('is-changing');
    img.classList.add('is-changing');
    setTimeout(function () {
      img.src = v.src;
      img.alt = v.alt;
      if (textEl && v.text) textEl.textContent = v.text;
      if (labelEl && v.label) labelEl.textContent = v.label;
      if (captionEl) {
        var showCaption = key === 'researchQuestion';
        captionEl.classList.toggle('is-visible', showCaption);
        captionEl.setAttribute('aria-hidden', showCaption ? 'false' : 'true');
      }
      textEl.classList.remove('is-changing');
      img.classList.remove('is-changing');
    }, 220);
  }

  tabsContainer.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-hypothesis-tab]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    activate(btn.getAttribute('data-hypothesis-tab'));
  });

  var firstTab = tabsContainer.querySelector('[data-hypothesis-tab]');
  activate(firstTab ? firstTab.getAttribute('data-hypothesis-tab') : 'problem');

  if (slider) {
    window.addEventListener('resize', updateSliderPosition);
  }
}

(function initHeaderNavSwipe() {
  var DRAG_THRESHOLD = 12;
  var DESKTOP_MQ = '(min-width: 1167px)';

  function canScroll(el) {
    return el.scrollWidth - el.clientWidth > 2;
  }

  function isDesktop() {
    return window.matchMedia(DESKTOP_MQ).matches;
  }

  function bindSwipe(scroller) {
    if (!scroller) return;

    var tracking = false;
    var dragging = false;
    var startX = 0;
    var startY = 0;
    var startScroll = 0;
    var pointerId = null;

    function usable() {
      return getComputedStyle(scroller).display !== 'contents';
    }

    scroller.addEventListener('pointerdown', function (e) {
      if (!usable()) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.pointerType === 'pen') return;
      if (!canScroll(scroller)) return;
      if (!isDesktop()) return;
      if (e.pointerType !== 'mouse') return;
      tracking = true;
      dragging = false;
      startX = e.clientX;
      startY = e.clientY;
      startScroll = scroller.scrollLeft;
      pointerId = e.pointerId;
    }, true);

    scroller.addEventListener('pointermove', function (e) {
      if (!tracking || e.pointerId !== pointerId) return;
      if (!usable()) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          tracking = false;
          return;
        }
        dragging = true;
        scroller.classList.add('is-dragging');
        try { scroller.setPointerCapture(e.pointerId); } catch (err) {}
      }
      e.preventDefault();
      scroller.scrollLeft = startScroll - dx;
    }, { capture: true, passive: false });

    function endDrag(e) {
      if (!tracking) return;
      if (e && pointerId != null && e.pointerId !== pointerId) return;
      tracking = false;
      pointerId = null;
      scroller.classList.remove('is-dragging');
      setTimeout(function () { dragging = false; }, 0);
    }

    scroller.addEventListener('pointerup', endDrag, true);
    scroller.addEventListener('pointercancel', endDrag, true);

    scroller.addEventListener('click', function (e) {
      if (!dragging) return;
      e.preventDefault();
      e.stopPropagation();
      dragging = false;
    }, true);

    scroller.scrollLeft = 0;
  }

  document.querySelectorAll('.header-wrapper--home .header__navs, .header-wrapper--home .header__nav, .prevent-hero__tags').forEach(bindSwipe);
})();

(function initVideoStartOffset() {
  document.querySelectorAll('video[data-start]').forEach(function (video) {
    var start = parseFloat(video.getAttribute('data-start'));
    if (!isFinite(start) || start <= 0) return;

    function jumpToStart() {
      if (video.currentTime < start) video.currentTime = start;
    }

    video.loop = false;
    video.addEventListener('loadedmetadata', jumpToStart);
    video.addEventListener('playing', jumpToStart);
    video.addEventListener('timeupdate', jumpToStart);
    video.addEventListener('ended', function () {
      video.currentTime = start;
      video.play();
    });
    if (video.readyState >= 1) jumpToStart();
  });
})();

