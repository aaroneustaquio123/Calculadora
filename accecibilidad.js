(function(){
  if(window.AccessibilityWidget) return;
  const LS_KEY = 'matekids_ultimate_full_v4';
  const MI_IMAGEN_WIDGET = 'IMAGENES/deku.jpeg'; 

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

  const css = `
  :root {
    --acc-primary: #FF6B6B;
    --acc-secondary: #4ECDC4;
    --acc-kids-bg: #f8f9fa;
  }

  /* Botón de Deku */
  #accFab {
    position:fixed; bottom:20px; left:20px; width:70px; height:70px; 
    border-radius:50%; background:var(--acc-primary); border:4px solid white;
    box-shadow:0 8px 15px rgba(0,0,0,0.2); z-index:100000; cursor:pointer;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); padding:0; overflow:hidden;
  }
  #accFab:hover { transform: scale(1.1) rotate(5deg); }
  #accFab img { width:100%; height:100%; object-fit:cover; }
  #accFab.right { right:20px; left:auto; }

  /* Panel Unificado */
  #accPanel {
    position:fixed; top:50%; left:50%; transform:translate(-50%, -50%);
    width:95%; max-width:680px; background:white; border-radius:30px;
    box-shadow:0 25px 50px rgba(0,0,0,0.4); z-index:100001; display:none;
    font-family: 'Segoe UI', 'Comic Sans MS', sans-serif;
    border: 6px solid var(--acc-secondary); overflow:hidden;
  }
  #accPanel.open { display:block; animation: bounceIn 0.4s ease-out; }

  header.acc-head { background:var(--acc-secondary); color:white; padding:15px; text-align:center; position:relative; }
  #accClose { position:absolute; right:15px; top:12px; background:none; border:none; color:white; font-size:28px; cursor:pointer; }

  .acc-body { padding:20px; max-height:75vh; overflow-y:auto; }
  .acc-section-title { font-weight:800; color:var(--acc-primary); margin:18px 0 8px; text-transform:uppercase; font-size:12px; border-bottom: 2px dashed #eee; display:flex; align-items:center; gap:5px; }

  /* Cuadrícula */
  .acc-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:10px; }
  .acc-tile {
    background: var(--acc-kids-bg); border: 3px solid #e2e8f0; border-radius: 18px;
    padding: 10px; text-align:center; cursor:pointer; transition: 0.2s;
    display:flex; flex-direction:column; align-items:center; font-weight:700; font-size:12px; color: #444;
  }
  .acc-tile:hover { background: #edf2f7; transform: translateY(-2px); }
  .acc-tile.active { background: #fff3bf; border-color: #fab005; color: #664d00; }
  .acc-tile .ico { font-size: 24px; margin-bottom: 3px; }

  /* Sliders */
  .acc-card { background:#f1f5f9; border-radius:15px; padding:12px; margin-bottom:10px; border:1px solid #e2e8f0; }
  .acc-row { display:flex; justify-content:space-between; margin-bottom:5px; font-size:12px; font-weight:bold; }
  input[type=range] { width: 100%; accent-color: var(--acc-primary); cursor:pointer; }

  /* Efectos Especiales */
  #accReadingGuide { position:fixed; left:0; width:100%; height:45px; background:rgba(255,235,59,0.3); pointer-events:none; z-index:99998; display:none; border-top:2px solid #fbc02d; border-bottom:2px solid #fbc02d; }
  html.acc-super-btns a:hover, html.acc-super-btns button:hover { transform: scale(1.1) !important; outline: 4px solid var(--acc-primary) !important; box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important; }
  html.acc-big-cursor { cursor: url('https://cur.cursors-4u.net/games/gam-4/gam372.cur'), auto !important; }
  html.acc-big-cursor a, html.acc-big-cursor button { cursor: url('https://cur.cursors-4u.net/games/gam-4/gam372.cur'), pointer !important; }
  #accOverlay { position:fixed; inset:0; pointer-events:none; z-index:99999; display:none; opacity: 0.2; }

  /* Alineación y Contrastes */
  html.acc-align-left * { text-align: left !important; }
  html.acc-align-center * { text-align: center !important; }
  html.acc-no-anim * { animation: none !important; transition: none !important; }

  @keyframes bounceIn { from { transform: translate(-50%, -55%) scale(0.8); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
  `;

  const defaults = {
    fontSize: 100, letterSpacing: 0, lineHeight: 1.5,
    daltonic: 'none', overlayColor: 'none',
    bigCursor: false, readingGuide: false, superBtns: false,
    stopAnimations: false, voiceFeedback: false, align: 'none',
    position: 'left'
  };

  let settings = Object.assign({}, defaults, JSON.parse(localStorage.getItem(LS_KEY) || '{}'));

  function applyAll() {
    const html = document.documentElement;
    const body = document.body;

    // 1. Tipografía Global
    body.style.fontSize = settings.fontSize + '%';
    body.style.letterSpacing = settings.letterSpacing + 'px';
    body.style.lineHeight = settings.lineHeight;

    // 2. Modos de Clase
    html.classList.toggle('acc-big-cursor', settings.bigCursor);
    html.classList.toggle('acc-super-btns', settings.superBtns);
    html.classList.toggle('acc-no-anim', settings.stopAnimations);
    
    html.classList.remove('acc-align-left', 'acc-align-center');
    if(settings.align !== 'none') html.classList.add('acc-align-' + settings.align);

    // 3. Filtros Daltónicos
    html.style.filter = 'none';
    if(settings.daltonic === 'protanopia') html.style.filter = "url('#protanopia-filter')";
    if(settings.daltonic === 'deuteranopia') html.style.filter = "url('#deuteranopia-filter')";

    // 4. Guía y Overlay
    $('#accReadingGuide').style.display = settings.readingGuide ? 'block' : 'none';
    const ov = $('#accOverlay');
    if(settings.overlayColor !== 'none') { ov.style.display='block'; ov.style.backgroundColor=settings.overlayColor; }
    else { ov.style.display='none'; }

    $('#accFab').classList.toggle('right', settings.position === 'right');
    localStorage.setItem(LS_KEY, JSON.stringify(settings));
  }

  function speak(text) {
    if (!settings.voiceFeedback) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'es-ES';
    window.speechSynthesis.speak(msg);
  }

  function buildUI() {
    const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

    // Nodos auxiliares
    document.body.insertAdjacentHTML('beforeend', `
      <div id="accOverlay"></div>
      <div id="accReadingGuide"></div>
      <svg style="display:none"><filter id="protanopia-filter"><feColorMatrix values="0.567,0.433,0,0,0, 0.558,0.442,0,0,0, 0,0.242,0.758,0,0, 0,0,0,1,0"/></filter><filter id="deuteranopia-filter"><feColorMatrix values="0.625,0.375,0,0,0, 0.7,0.3,0,0,0, 0,0.3,0.7,0,0, 0,0,0,1,0"/></filter></svg>
    `);

    window.addEventListener('mousemove', e => { if(settings.readingGuide) $('#accReadingGuide').style.top = (e.clientY - 22) + 'px'; });

    const fab = document.createElement('button');
    fab.id = 'accFab';
    fab.innerHTML = `<img src="${MI_IMAGEN_WIDGET}">`;
    document.body.appendChild(fab);

    const panel = document.createElement('div');
    panel.id = 'accPanel';
    panel.innerHTML = `
      <header class="acc-head"><h3>⚡ SUPER PODERES MATEKIDS</h3><button id="accClose">✖</button></header>
      <div class="acc-body">
        
        <div class="acc-section-title">📏 Tamaño y Lectura</div>
        <div class="acc-card">
          <div class="acc-row"><span>Tamaño Web</span><span>${settings.fontSize}%</span></div>
          <input type="range" id="r-font" min="100" max="180" value="${settings.fontSize}">
        </div>
        <div class="acc-card">
          <div class="acc-row"><span>Espacio Letras</span><span>${settings.letterSpacing}px</span></div>
          <input type="range" id="r-space" min="0" max="6" step="0.5" value="${settings.letterSpacing}">
        </div>

        <div class="acc-section-title">✨ Especial Niños</div>
        <div class="acc-grid">
          <div class="acc-tile" id="btn-guide"><span class="ico">📏</span><span>Guía Lectura</span></div>
          <div class="acc-tile" id="btn-super"><span class="ico">🔘</span><span>Súper Botones</span></div>
          <div class="acc-tile" id="btn-cursor"><span class="ico">🪄</span><span>Varita Mágica</span></div>
          <div class="acc-tile" id="btn-voice"><span class="ico">🎙️</span><span>Narrador</span></div>
        </div>

        <div class="acc-section-title">🎨 Colores y Vista</div>
        <div class="acc-grid">
          <div class="acc-tile" id="btn-p"><span class="ico">🍎</span><span>Daltónico 1</span></div>
          <div class="acc-tile" id="btn-d"><span class="ico">🍏</span><span>Daltónico 2</span></div>
          <div class="acc-tile" id="btn-anim"><span class="ico">⏸️</span><span>Pausar Web</span></div>
          <div class="acc-tile" onclick="window.ttsFull()"><span class="ico">🔊</span><span>Leer Todo</span></div>
        </div>

        <div class="acc-section-title">📝 Alineación</div>
        <div class="acc-grid">
          <div class="acc-tile" id="btn-al"><span class="ico">⬅️</span><span>Izquierda</span></div>
          <div class="acc-tile" id="btn-ac"><span class="ico">⬅️➡️</span><span>Centrado</span></div>
        </div>

        <div class="acc-section-title">🖍️ Papel de Color</div>
        <div class="acc-grid">
          <div class="acc-tile" style="background:#dbeafe" onclick="setAccC('#bbdefb')"><span>Azul</span></div>
          <div class="acc-tile" style="background:#fce7f3" onclick="setAccC('#f8bbd0')"><span>Rosa</span></div>
          <div class="acc-tile" style="background:#fff" onclick="setAccC('none')"><span>Normal</span></div>
        </div>

        <div style="margin-top:20px; display:flex; gap:10px;">
          <button id="btn-pos" style="flex:1; padding:10px; border-radius:12px; border:1px solid #ddd; cursor:pointer;">Mover Botón</button>
          <button id="btn-res" style="flex:1; padding:10px; border-radius:12px; border:none; background:#ff4d4f; color:white; font-weight:bold; cursor:pointer;">Reiniciar 🔄</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Eventos
    fab.onclick = () => { panel.classList.add('open'); speak("Menú abierto"); };
    $('#accClose').onclick = () => panel.classList.remove('open');

    const upd = () => { applyAll(); sync(); };
    
    $('#r-font').oninput = (e) => { settings.fontSize = e.target.value; upd(); };
    $('#r-space').oninput = (e) => { settings.letterSpacing = e.target.value; upd(); };
    
    $('#btn-guide').onclick = () => { settings.readingGuide = !settings.readingGuide; speak("Guía de lectura"); upd(); };
    $('#btn-super').onclick = () => { settings.superBtns = !settings.superBtns; speak("Súper botones"); upd(); };
    $('#btn-cursor').onclick = () => { settings.bigCursor = !settings.bigCursor; upd(); };
    $('#btn-voice').onclick = () => { settings.voiceFeedback = !settings.voiceFeedback; speak("Narrador activo"); upd(); };
    $('#btn-anim').onclick = () => { settings.stopAnimations = !settings.stopAnimations; upd(); };
    
    $('#btn-al').onclick = () => { settings.align = settings.align === 'left' ? 'none' : 'left'; upd(); };
    $('#btn-ac').onclick = () => { settings.align = settings.align === 'center' ? 'none' : 'center'; upd(); };

    $('#btn-p').onclick = () => { settings.daltonic = settings.daltonic === 'protanopia' ? 'none' : 'protanopia'; upd(); };
    $('#btn-d').onclick = () => { settings.daltonic = settings.daltonic === 'deuteranopia' ? 'none' : 'deuteranopia'; upd(); };

    window.setAccC = (c) => { settings.overlayColor = c; upd(); };
    window.ttsFull = () => { speak(document.body.innerText.substring(0, 1000)); };

    $('#btn-pos').onclick = () => { settings.position = settings.position === 'left' ? 'right' : 'left'; upd(); };
    $('#btn-res').onclick = () => { if(confirm("¿Reiniciar?")){ settings = Object.assign({}, defaults); upd(); } };

    function sync() {
      $('#btn-guide').classList.toggle('active', settings.readingGuide);
      $('#btn-super').classList.toggle('active', settings.superBtns);
      $('#btn-cursor').classList.toggle('active', settings.bigCursor);
      $('#btn-voice').classList.toggle('active', settings.voiceFeedback);
      $('#btn-anim').classList.toggle('active', settings.stopAnimations);
      $('#btn-p').classList.toggle('active', settings.daltonic === 'protanopia');
      $('#btn-d').classList.toggle('active', settings.daltonic === 'deuteranopia');
      $('#btn-al').classList.toggle('active', settings.align === 'left');
      $('#btn-ac').classList.toggle('active', settings.align === 'center');
    }
    upd();
  }

  if(document.readyState !== 'loading') buildUI();
  else document.addEventListener('DOMContentLoaded', buildUI);
})();