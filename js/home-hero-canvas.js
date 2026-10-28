(function initHomeHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const services = [
    { label: 'UX Design', color: '#FFCC00' },
    { label: 'UI Design', color: '#57B6FF' },
    { label: 'Prototyping', color: '#FF5E00' },
    { label: 'Design Systems', color: '#06d6a0' },
    { label: 'User Research', color: '#ffd166' },
    { label: 'Web Design', color: '#F9F4ED' },
    { label: 'App Design', color: '#4D05AB', text: '#F9F4ED' },
    { label: 'Branding', color: '#ff6b6b' },
    { label: 'Interaction Design', color: '#c8b6ff' },
    { label: 'Product Strategy', color: '#f4a261' },
  ];

  const slots = {
    left: { x: 0.0, y: 0.12, rotate: -12 },
    right: { x: 0.78, y: 0.68, rotate: 10 },
  };

  const AUTO_POP_MS = 8000;
  const MANUAL_PAUSE_MS = 15000;
  const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

  const layers = { left: null, right: null };
  const autoPausedUntil = { left: 0, right: 0 };
  let servicePool = shuffle(services.slice());
  let poolIndex = 0;
  let selectedLayer = null;
  let autoPopTimer = null;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function nextService() {
    if (poolIndex >= servicePool.length) {
      servicePool = shuffle(services.slice());
      poolIndex = 0;
    }
    return servicePool[poolIndex++];
  }

  function getCanvasRect() {
    return canvas.getBoundingClientRect();
  }

  function pauseAutoForSide(side) {
    autoPausedUntil[side] = Date.now() + MANUAL_PAUSE_MS;
  }

  function isAutoPaused(side) {
    return Date.now() < autoPausedUntil[side];
  }

  function applyTransform(layer) {
    const rotate = parseFloat(layer.dataset.rotate) || 0;
    const scale = parseFloat(layer.dataset.scale) || 1;
    layer.style.transform = 'rotate(' + rotate + 'deg) scale(' + scale + ')';
  }

  function positionLayer(layer, xRatio, yRatio, rotate, scale) {
    const rect = getCanvasRect();
    const left = xRatio * rect.width;
    const top = yRatio * rect.height;
    layer.style.left = left + 'px';
    layer.style.top = top + 'px';
    layer.dataset.x = String(xRatio);
    layer.dataset.y = String(yRatio);
    layer.dataset.rotate = String(rotate);
    layer.dataset.scale = String(scale);
    applyTransform(layer);
  }

  function getLayerCenterScreen(layer) {
    const canvasRect = getCanvasRect();
    const left = parseFloat(layer.style.left) || 0;
    const top = parseFloat(layer.style.top) || 0;
    const frame = layer.querySelector('.hero-canvas__frame');
    const w = frame ? frame.offsetWidth : layer.offsetWidth;
    const h = frame ? frame.offsetHeight : layer.offsetHeight;
    return {
      x: canvasRect.left + left + w / 2,
      y: canvasRect.top + top + h / 2,
    };
  }

  function popIn(layer) {
    const targetScale = parseFloat(layer.dataset.scale) || 1;
    layer.style.opacity = '0';
    layer.dataset.scale = '0.82';
    applyTransform(layer);

    if (typeof gsap !== 'undefined') {
      gsap.to(layer, {
        opacity: 1,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(layer, {
        duration: 0.55,
        ease: 'back.out(2)',
        overwrite: 'auto',
        onUpdate: function () {
          const p = this.progress();
          const s = 0.82 + (targetScale - 0.82) * p;
          layer.dataset.scale = String(s);
          applyTransform(layer);
        },
        onComplete: function () {
          layer.dataset.scale = String(targetScale);
          applyTransform(layer);
        },
      });
    } else {
      layer.style.opacity = '1';
      layer.dataset.scale = String(targetScale);
      applyTransform(layer);
    }
  }

  function createLayer(side) {
    const service = nextService();
    const slot = slots[side];
    const layer = document.createElement('div');
    layer.className = 'hero-canvas__layer';
    layer.dataset.side = side;

    const handlesHtml = HANDLES.map(function (h) {
      return '<span class="hero-canvas__handle hero-canvas__handle--' + h + '" data-handle="' + h + '"></span>';
    }).join('');

    layer.innerHTML =
      '<div class="hero-canvas__frame">' +
        '<div class="hero-canvas__toolbar">' +
          '<button type="button" class="hero-canvas__tool" data-action="reload" aria-label="Neue Leistung">↻</button>' +
          '<button type="button" class="hero-canvas__tool" data-action="delete" aria-label="Entfernen">✕</button>' +
        '</div>' +
        handlesHtml +
        '<span class="hero-canvas__handle hero-canvas__handle--rotate" data-handle="rotate" aria-hidden="true"></span>' +
        '<div class="hero-canvas__pill">' + service.label + '</div>' +
      '</div>';

    const pill = layer.querySelector('.hero-canvas__pill');
    pill.style.backgroundColor = service.color;
    if (service.text) pill.style.color = service.text;

    canvas.appendChild(layer);
    positionLayer(layer, slot.x, slot.y, slot.rotate, 1);
    bindLayer(layer);
    layers[side] = layer;
    popIn(layer);

    return layer;
  }

  function selectLayer(layer) {
    if (selectedLayer) selectedLayer.classList.remove('is-selected');
    selectedLayer = layer;
    if (layer) layer.classList.add('is-selected');
  }

  function replaceLayer(side, fromAuto) {
    if (fromAuto && isAutoPaused(side)) return;

    const old = layers[side];
    if (!old) {
      createLayer(side);
      return;
    }

    const remove = function () {
      if (old.parentNode) old.parentNode.removeChild(old);
      layers[side] = null;
      createLayer(side);
    };

    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(old);
      gsap.to(old, {
        opacity: 0,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: remove,
      });
    } else {
      remove();
    }
  }

  function reloadLayer(layer) {
    const side = layer.dataset.side;
    pauseAutoForSide(side);

    const service = nextService();
    const pill = layer.querySelector('.hero-canvas__pill');
    pill.textContent = service.label;
    pill.style.backgroundColor = service.color;
    pill.style.color = service.text || '#000';
    popIn(layer);
  }

  function bindLayer(layer) {
    layer.addEventListener('pointerdown', function (e) {
      if (e.target.closest('[data-action]') || e.target.closest('[data-handle]')) return;
      selectLayer(layer);
      layer.classList.add('is-dragging');
      layer.setPointerCapture(e.pointerId);

      const rect = getCanvasRect();
      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = parseFloat(layer.style.left) || 0;
      const startTop = parseFloat(layer.style.top) || 0;
      const pad = 120;

      function onMove(ev) {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        const newLeft = Math.max(-pad, Math.min(rect.width + pad, startLeft + dx));
        const newTop = Math.max(-pad, Math.min(rect.height + pad, startTop + dy));
        layer.style.left = newLeft + 'px';
        layer.style.top = newTop + 'px';
        layer.dataset.x = String(newLeft / rect.width);
        layer.dataset.y = String(newTop / rect.height);
      }

      function onUp() {
        layer.classList.remove('is-dragging');
        layer.removeEventListener('pointermove', onMove);
        layer.removeEventListener('pointerup', onUp);
        layer.removeEventListener('pointercancel', onUp);
      }

      layer.addEventListener('pointermove', onMove);
      layer.addEventListener('pointerup', onUp);
      layer.addEventListener('pointercancel', onUp);
    });

    layer.querySelector('[data-action="delete"]').addEventListener('click', function (e) {
      e.stopPropagation();
      const side = layer.dataset.side;
      pauseAutoForSide(side);
      replaceLayer(side, false);
    });

    layer.querySelector('[data-action="reload"]').addEventListener('click', function (e) {
      e.stopPropagation();
      reloadLayer(layer);
    });

    layer.querySelectorAll('[data-handle]').forEach(function (handle) {
      handle.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        e.stopPropagation();
        selectLayer(layer);

        const type = handle.dataset.handle;

        if (type === 'rotate') {
          layer.classList.add('is-rotating');
          const center = getLayerCenterScreen(layer);
          const startAngle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
          const startRotate = parseFloat(layer.dataset.rotate) || 0;

          function onRotate(ev) {
            ev.preventDefault();
            const angle = Math.atan2(ev.clientY - center.y, ev.clientX - center.x);
            const deg = startRotate + (angle - startAngle) * (180 / Math.PI);
            layer.dataset.rotate = String(deg);
            applyTransform(layer);
          }

          function onUp() {
            layer.classList.remove('is-rotating');
            window.removeEventListener('pointermove', onRotate);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
          }

          window.addEventListener('pointermove', onRotate);
          window.addEventListener('pointerup', onUp);
          window.addEventListener('pointercancel', onUp);
          return;
        }

        const startScale = parseFloat(layer.dataset.scale) || 1;
        const startX = e.clientX;
        const startY = e.clientY;

        function onResize(ev) {
          ev.preventDefault();
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;
          let delta = 0;
          if (type.includes('e')) delta += dx;
          if (type.includes('w')) delta -= dx;
          if (type.includes('s')) delta += dy;
          if (type.includes('n')) delta -= dy;
          const next = Math.max(0.65, Math.min(1.45, startScale + delta * 0.004));
          layer.dataset.scale = String(next);
          applyTransform(layer);
        }

        function onUp() {
          window.removeEventListener('pointermove', onResize);
          window.removeEventListener('pointerup', onUp);
          window.removeEventListener('pointercancel', onUp);
        }

        window.addEventListener('pointermove', onResize);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
      });
    });

    layer.addEventListener('click', function () {
      selectLayer(layer);
    });
  }

  canvas.addEventListener('pointerdown', function (e) {
    if (e.target === canvas) selectLayer(null);
  });

  function scheduleAutoPop() {
    if (autoPopTimer) clearInterval(autoPopTimer);
    autoPopTimer = setInterval(function () {
      replaceLayer('left', true);
      setTimeout(function () {
        replaceLayer('right', true);
      }, 450);
    }, AUTO_POP_MS);
  }

  function init() {
    createLayer('left');
    setTimeout(function () {
      createLayer('right');
    }, 350);
    scheduleAutoPop();
  }

  window.addEventListener('resize', function () {
    Object.keys(layers).forEach(function (side) {
      const layer = layers[side];
      if (!layer) return;
      positionLayer(
        layer,
        parseFloat(layer.dataset.x) || slots[side].x,
        parseFloat(layer.dataset.y) || slots[side].y,
        parseFloat(layer.dataset.rotate) || slots[side].rotate,
        parseFloat(layer.dataset.scale) || 1
      );
    });
  });

  setTimeout(init, 2000);
})();
