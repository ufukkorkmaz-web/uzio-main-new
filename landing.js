(function(){
  var root=document.documentElement;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Magnetic hover: buttons lean toward the pointer ---------- */
  (function(){
    if(reduce || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    var els = [document.getElementById('startBtn'), document.getElementById('tryBtn')].filter(Boolean);
    els.forEach(function(el){ el.classList.add('magnetic'); });

    function strengthFor(el){
      if(el.classList.contains('bubble')) return {move:8, tilt:3.2};
      if(el.classList.contains('round-btn')) return {move:5, tilt:4};
      if(el.classList.contains('menu-item')) return {move:4, tilt:2.5};
      return {move:7, tilt:4.5};
    }

    els.forEach(function(el){
      el.addEventListener('pointermove', function(e){
        var r=el.getBoundingClientRect();
        var nx=((e.clientX-r.left)/r.width-.5)*2;
        var ny=((e.clientY-r.top)/r.height-.5)*2;
        var st=strengthFor(el);
        el.classList.add('is-magnetic');

        if(el.classList.contains('bubble')){
          el.style.translate=(nx*st.move).toFixed(2)+'px '+(ny*st.move).toFixed(2)+'px';
          el.style.rotate=(-nx*st.tilt).toFixed(2)+'deg';
        }else{
          var tx=(nx*st.move).toFixed(2);
          var ty=(ny*st.move).toFixed(2);
          var rx=(-ny*st.tilt).toFixed(2);
          var ry=(nx*st.tilt).toFixed(2);
          el.style.transform='perspective(650px) translate3d('+tx+'px,'+ty+'px,0) rotateX('+rx+'deg) rotateY('+ry+'deg) scale(1.018)';
        }
      });

      el.addEventListener('pointerleave', function(){
        el.classList.remove('is-magnetic');
        if(el.classList.contains('bubble')){
          el.style.translate='0 0';
          el.style.rotate='0deg';
        }else{
          el.style.transform='';
        }
      });
    });
  })();

  /* ---------- Menus ---------- */
  var langPop=document.getElementById('langPop'),morePop=document.getElementById('morePop');
  var langBtn=document.getElementById('langBtn'),moreBtn=document.getElementById('moreBtn');
  var langMenu=document.getElementById('langMenu'),moreMenu=document.getElementById('moreMenu');
  function setPop(pop,btn,menu,on){pop.classList.toggle('open',on);btn.setAttribute('aria-expanded',String(on));menu.inert=!on}
  langBtn.addEventListener('click',function(){var on=!langPop.classList.contains('open');setPop(morePop,moreBtn,moreMenu,false);setPop(langPop,langBtn,langMenu,on)});
  moreBtn.addEventListener('click',function(){var on=!morePop.classList.contains('open');setPop(langPop,langBtn,langMenu,false);setPop(morePop,moreBtn,moreMenu,on)});
  document.addEventListener('pointerdown',function(e){if(!langPop.contains(e.target))setPop(langPop,langBtn,langMenu,false);if(!morePop.contains(e.target))setPop(morePop,moreBtn,moreMenu,false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){setPop(langPop,langBtn,langMenu,false);setPop(morePop,moreBtn,moreMenu,false)}});

  /* ---------- Language ---------- */
  var copy={
    en:{code:'EN',headline:'Meet <span class="grad">Uzio.</span><br>Your game master.',lead:'Play, compete, unlock rewards and let Uzio build challenges that adapt to you.',start:'Enter the game',try:'Quick play',p1:'⚡ Quick rounds',p2:'🎯 Adaptive challenges',p3:'🏆 XP & rewards',b1:'2–5 min',b2:'Beat your best',b3:'Protect your streak',enter:'Enter the game',theme:'Dark mode'},
    tr:{code:'TR',headline:'<span class="grad">Uzio</span> ile tanış.<br>Sana ayak uyduran İngilizce.',lead:'Oyna, pratik yap, izle ve konuş. Sana uyum sağlayan görevlerle İngilizceni geliştir.',start:'Öğrenmeye başla',try:'Hızlı bir oyun dene',p1:'⚡ Kısa etkinlikler',p2:'🎯 Kişiye uyarlanan pratik',p3:'💬 Gerçek İngilizce',b1:'2–5 dk',b2:'Özgüvenini geliştir',b3:'Serini sürdür',enter:'Uzio’ya gir',theme:'Karanlık mod'},
    fr:{code:'FR',headline:'Découvre <span class="grad">Uzio.</span><br>Un anglais qui s’adapte à toi.',lead:'Joue, entraîne-toi, regarde et parle pour progresser en anglais avec des défis qui s’adaptent à toi.',start:'Commencer',try:'Essayer un jeu rapide',p1:'⚡ Activités rapides',p2:'🎯 Entraînement adaptatif',p3:'💬 Anglais authentique',b1:'2–5 min',b2:'Prends confiance',b3:'Garde ta série',enter:'Entrer dans Uzio',theme:'Mode sombre'},
    de:{code:'DE',headline:'Lerne <span class="grad">Uzio</span> kennen.<br>Englisch, das sich dir anpasst.',lead:'Spiele, übe, schau zu und sprich dich zu besserem Englisch – mit Aufgaben, die sich an dich anpassen.',start:'Jetzt lernen',try:'Schnelles Spiel testen',p1:'⚡ Kurze Aktivitäten',p2:'🎯 Adaptives Üben',p3:'💬 Echtes Englisch',b1:'2–5 Min.',b2:'Selbstvertrauen stärken',b3:'Serie fortsetzen',enter:'Uzio öffnen',theme:'Dunkelmodus'}
  };
  function applyLang(l){if(!copy[l])l='en';var c=copy[l];root.lang=l;document.getElementById('langCode').textContent=c.code;document.getElementById('headline').innerHTML=c.headline;document.getElementById('lead').textContent=c.lead;document.getElementById('startBtn').innerHTML=c.start+' <span aria-hidden="true">→</span>';document.getElementById('tryBtn').textContent=c.try;document.getElementById('proof1').textContent=c.p1;document.getElementById('proof2').textContent=c.p2;document.getElementById('proof3').textContent=c.p3;document.getElementById('bubble1').textContent=c.b1;document.getElementById('bubble2').textContent=c.b2;document.getElementById('bubble3').textContent=c.b3;document.getElementById('menuEnter').textContent=c.enter;document.getElementById('themeLabel').textContent=c.theme;langMenu.querySelectorAll('[data-lang]').forEach(function(b){b.setAttribute('aria-current',String(b.getAttribute('data-lang')===l))});try{localStorage.setItem('uzio-language',l)}catch(e){} }
  langMenu.addEventListener('click',function(e){var b=e.target.closest('[data-lang]');if(!b)return;applyLang(b.getAttribute('data-lang'));setPop(langPop,langBtn,langMenu,false)});
  var saved='en';try{saved=localStorage.getItem('uzio-language')||'en'}catch(e){}applyLang(saved);

  /* ---------- Theme (saved so the main page matches) ---------- */
  function isDark(){var t=root.getAttribute('data-theme');return t?t==='dark':matchMedia('(prefers-color-scheme:dark)').matches}
  function syncTheme(){document.getElementById('themeToggle').setAttribute('aria-pressed',String(isDark()))}
  document.getElementById('themeToggle').addEventListener('click',function(){
    var next=isDark()?'light':'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('uzio-theme',next)}catch(e){}
    syncTheme();
  });
  syncTheme();

  /* ---------- Uzio orb: raw WebGL, no libraries ---------- */
  (function () {
    var link = document.querySelector('.uzio-orb');
    var cv = document.getElementById('uzioOrb');
    if (!link || !cv) return;
    var gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) { link.classList.add('no-gl'); return; }

    var VS = 'attribute vec2 a;varying vec2 vUv;void main(){vUv=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
    var FS = [
'precision highp float;',
'uniform vec2 uRes;uniform float uTime;uniform vec2 uGaze;uniform float uBlink;uniform float uWink;uniform float uHappy;uniform float uSpin;uniform float uDark;',
'varying vec2 vUv;',
'const vec3 C0=vec3(.118,.655,1.);const vec3 C1=vec3(1.,.176,.459);const vec3 C2=vec3(.722,1.,.122);',
'const vec3 C3=vec3(.706,.302,1.);const vec3 C4=vec3(1.,.631,.102);',
'const vec3 D0=vec3(.16,.56,1.);const vec3 D1=vec3(1.,.3,.54);const vec3 D2=vec3(.3,.82,.4);',
'const vec3 D3=vec3(.66,.36,1.);const vec3 D4=vec3(1.,.66,.16);',
'vec3 field(vec3 s,float t,out float ws){',
'  vec3 acc=vec3(0.);ws=0.;',
'  for(int i=0;i<5;i++){',
'    float fi=float(i);',
'    vec3 c=.58*vec3(sin(t*.55+fi*1.26+.3),cos(t*.47+fi*2.1),sin(t*.63+fi*.93+1.1));',
'    vec3 d=s-c;float w=exp(-dot(d,d)*3.0);',
'    vec3 cn=i==0?C0:(i==1?C1:(i==2?C2:(i==3?C3:C4)));',
'    vec3 cl=i==0?D0:(i==1?D1:(i==2?D2:(i==3?D3:D4)));',
'    vec3 col=mix(cl,cn,uDark);',
'    acc+=col*w;ws+=w;',
'  }',
'  return acc;',
'}',
'void main(){',
'  vec2 p=vUv*2.-1.;',
'  float t=uTime;',
'  float R=.74*(1.+.012*sin(t*1.7));',
'  float r=length(p);',
'  float aa=3./uRes.y;',
'  float ws;',
'  vec3 hacc=field(vec3(p/R*.62,0.),t,ws);',
'  vec3 hcol=hacc/(ws+.2);',
'  float halo=exp(-max(r-R,0.)*7.5)*mix(.3,.36,uDark)*smoothstep(0.,.25,ws+.15)*smoothstep(.98,.8,r);',
'  vec3 outc=hcol*halo;float outa=halo*.8;',
'  float edge=1.-smoothstep(R-aa,R+aa,r);',
'  if(edge<=0.){gl_FragColor=vec4(outc,outa);return;}',
'  vec2 q=p/R;float rr=min(length(q),1.);float z=sqrt(max(1.-rr*rr,0.));',
'  vec3 n=vec3(q,z);',
'  vec3 s=vec3(q*.95,z*.55-.25);s.xy+=n.xy*.12*sin(t*.8);',
'  float cs=cos(uSpin),sn=sin(uSpin);s.xz=vec2(cs*s.x+sn*s.z,-sn*s.x+cs*s.z);',
'  vec3 acc=field(s,t,ws);',
'  vec3 inner=acc/(ws+.16);',
'  float glow=clamp(ws,0.,1.5);',
'  vec3 base=mix(mix(vec3(.50,.58,.92),vec3(.10,.12,.32),uDark),inner,smoothstep(0.,.8,glow));',
'  vec3 c=base*(.78+.5*pow(z,.8))+inner*.12*glow;',
'  float fres=pow(1.-z,2.4);',
'  c=mix(c,mix(mix(inner*.85,vec3(1.),.3),mix(vec3(1.),inner,.45),uDark),fres*.6);',
'  c=mix(c,vec3(dot(c,vec3(.3,.59,.11))),.22);',
'  c=mix(c,vec3(.80,.83,.96),mix(.1,.2,uDark));',
'  vec3 f=normalize(vec3(uGaze.x*.62,uGaze.y*.5,1.));f=vec3(cs*f.x+sn*f.z,f.y,-sn*f.x+cs*f.z);',
'  vec3 rt=normalize(cross(vec3(0.,1.,0.),f));vec3 up=cross(f,rt);',
'  float u=dot(n,rt),v=dot(n,up),w=dot(n,f);',
'  float fm=smoothstep(.12,.42,w);',
'  vec3 ink=vec3(.055,.065,.16);',
'  float bl=max(uBlink,.07);',
'  for(int k=0;k<2;k++){',
'    float sx=k==0?-1.:1.;',
'    vec2 b=vec2(u-sx*.46,v+.045)/vec2(.115,.068);',
'    c=mix(c,vec3(1.,.38,.55),exp(-dot(b,b)*1.1)*.55*fm);',
'  }',
'  for(int k=0;k<2;k++){',
'    float sx=k==0?-1.:1.;',
'    vec2 e=vec2(u-sx*.29,v-.105);',
'    float d=length(e/vec2(.098,.145*bl));',
'    float ea=smoothstep(1.,.88,d)*fm;',
'    c=mix(c,ink,ea);',
'    float h1=smoothstep(1.,.6,length((e-vec2(-.024,.052*bl))/vec2(.034,.034*bl+.001)));',
'    float h2=smoothstep(1.,.6,length((e-vec2(.03,-.05*bl))/vec2(.017,.017*bl+.001)));',
'    c=mix(c,vec3(1.),max(h1,h2*.85)*ea*smoothstep(.2,.6,bl));',
'  }',
'  vec2 m=vec2(u,v+.185);',
'  float s1=m.x/.125;',
'  float line=smoothstep(.019,.011,abs(m.y-(.03*s1*s1-.03)))*smoothstep(1.,.82,abs(s1));',
'  vec2 me=m-vec2(0.,-.035);',
'  float od=length(me/vec2(.07+.02*uHappy,.012+.06*uHappy));',
'  float open=smoothstep(1.,.86,od);',
'  float mk=mix(line,open,smoothstep(.12,.5,uHappy))*fm;',
'  c=mix(c,ink,mk);',
'  float tongue=open*smoothstep(.1,.5,uHappy)*smoothstep(-.012,-.04,me.y)*fm;',
'  c=mix(c,vec3(1.,.42,.58),tongue);',
'  c+=vec3(1.)*smoothstep(1.,0.,length((q-vec2(-.4,.5))/vec2(.3,.14)))*.6;',
'  c+=vec3(1.)*smoothstep(1.,0.,length((q-vec2(.42,-.55))/vec2(.2,.06)))*.22;',
'  c=clamp(c,0.,1.);',
'  vec3 rgb=outc*(1.-edge)+c*edge;',
'  float a=outa*(1.-edge)+edge;',
'  gl_FragColor=vec4(rgb,a);',
'}'
    ].join('\n');

    function sh(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    }
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) { link.classList.add('no-gl'); return; }
    var pr = gl.createProgram();
    gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { link.classList.add('no-gl'); return; }
    gl.useProgram(pr);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ['uRes', 'uTime', 'uGaze', 'uBlink', 'uWink', 'uHappy', 'uSpin', 'uDark'].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });
    gl.clearColor(0, 0, 0, 0);

    function fit() {
      var d = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.round(cv.clientWidth * d);
      if (w && cv.width !== w) { cv.width = w; cv.height = w; }
      gl.viewport(0, 0, cv.width, cv.height);
    }
    window.addEventListener('resize', fit);
    fit();

    /* cursor tracking: the face turns toward the pointer anywhere on the page */
    var px = null, py = null, lastMove = 0, hov = 0, hovT = 0, press = 0;
    window.addEventListener('pointermove', function (e) { px = e.clientX; py = e.clientY; lastMove = performance.now(); }, { passive: true });
    window.addEventListener('pointerdown', function (e) { px = e.clientX; py = e.clientY; lastMove = performance.now(); }, { passive: true });
    link.addEventListener('pointerenter', function () {
      hovT = 1;
      /* someone showed up: a hat politely pops off instead of staying on */
      if (mv && mv.n === 'hat' && (performance.now() - mv.t0) / MOVES.hat.d < .86) mv.t0 = performance.now() - MOVES.hat.d * .88;
    });
    link.addEventListener('pointerleave', function () { hovT = 0; });
    link.addEventListener('focus', function () { hovT = 1; });
    link.addEventListener('blur', function () { hovT = 0; });
    link.addEventListener('click', function () { press = 1; }); /* happy burst, then the link opens */

    var body = document.getElementById('orbBody');
    var hatEl = document.getElementById('orbHat');
    var hatOn = false;

    /* Funny hats, drawn in a 128-unit box: the sphere's top sits near y=17, centred on x=64 */
    var HATS = {
      party: `<svg viewBox="0 0 128 128"><g transform="rotate(-11 64 28)"><path d="M43 29 L64 -6 L85 29 Z" fill="#ff2d55"/><polygon points="51.4,15 76.6,15 80.8,22 47.2,22" fill="#ffd60a"/><circle cx="61" cy="5" r="2" fill="#fff"/><circle cx="67" cy="9" r="1.7" fill="#fff"/><ellipse cx="64" cy="29" rx="22" ry="4.5" fill="#ff9f0a"/><circle cx="64" cy="-6" r="6" fill="#ffd60a"/></g></svg>`,
      wizard: `<svg viewBox="0 0 128 128"><g transform="rotate(8 64 28)"><path d="M41 30 L61 -16 Q67 -20 70 -8 L87 30 Z" fill="#5e5ce6"/><ellipse cx="64" cy="30" rx="27" ry="5.5" fill="#4442c4"/><circle cx="58" cy="12" r="2.4" fill="#ffd60a"/><circle cx="69" cy="18" r="1.9" fill="#ffd60a"/><circle cx="63" cy="0" r="1.6" fill="#fff"/></g></svg>`,
      crown: `<svg viewBox="0 0 128 128"><g transform="rotate(-6 64 28)"><path d="M43 29 L44 5 L55 16 L64 0 L73 16 L84 5 L85 29 Z" fill="#ffcc00" stroke="#e29a00" stroke-width="1.5" stroke-linejoin="round"/><rect x="43" y="23" width="42" height="6.5" rx="2" fill="#f0a000"/><circle cx="44" cy="5" r="2.8" fill="#ff375f"/><circle cx="64" cy="0" r="3" fill="#ff375f"/><circle cx="84" cy="5" r="2.8" fill="#ff375f"/><circle cx="53" cy="26.2" r="2.2" fill="#0a84ff"/><circle cx="64" cy="26.2" r="2.2" fill="#30d158"/><circle cx="75" cy="26.2" r="2.2" fill="#bf5af2"/></g></svg>`,
      propeller: `<svg viewBox="0 0 128 128"><g transform="rotate(7 64 28)"><path d="M42 30 Q42 9 64 9 Q86 9 86 30 Z" fill="#30b0c7"/><path d="M64 9 L64 30 M53 11 Q50 20 51 30 M75 11 Q78 20 77 30" stroke="#1e8aa0" stroke-width="1.4" fill="none"/><rect x="40" y="28" width="48" height="5.5" rx="2.7" fill="#ff375f"/><rect x="62.5" y="3" width="3" height="7" fill="#555"/><circle cx="64" cy="9" r="2.6" fill="#ffd60a"/><g class="prop"><ellipse cx="64" cy="3" rx="21" ry="3" fill="#ff9f0a"/></g></g></svg>`,
      chef: `<svg viewBox="0 0 128 128"><defs><g id="chefg"><circle cx="49" cy="15" r="10"/><circle cx="64" cy="9" r="12"/><circle cx="79" cy="15" r="10"/><rect x="47" y="15" width="34" height="14"/></g></defs><g transform="rotate(-5 64 28)"><use href="#chefg" fill="#fff" stroke="#cfcfd8" stroke-width="3.2" stroke-linejoin="round"/><use href="#chefg" fill="#fff"/><path d="M56 17 V27 M64 14 V27 M72 17 V27" stroke="#e3e3ea" stroke-width="1.4"/><rect x="45" y="27" width="38" height="6" rx="3" fill="#f2f2f7" stroke="#cfcfd8" stroke-width="1"/></g></svg>`
    };
    var HAT_NAMES = ['party', 'wizard', 'crown', 'propeller', 'chef'], lastHat = '';

    var dk = isDark() ? 1 : 0; /* 0 = light theme, 1 = dark theme; eases when the theme changes */
    var gx = 0, gy = 0, blinkAt = 1800, blinkStart = -1, forcedWinkStart = -1, last = performance.now(), T = reduce ? 3 : 0;
    var ease = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
    var c01 = function (x) { return Math.max(0, Math.min(1, x)); };
    var PI = Math.PI, sin = Math.sin;

    /* Landing CTAs: Uzio gives a single-eye wink, then the link opens. */
    ['startBtn', 'tryBtn'].forEach(function (id) {
      var btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        var href = btn.href;
        forcedWinkStart = performance.now();
        setTimeout(function () { window.location.href = href; }, 210);
      });
    });

    /* Little moves. Each one tweaks the orb for progress ph (0..1) through the object o. */
    var MOVES = {
      spin:   { d: 1050, f: function (ph, o, m) { o.spin = m.dir * PI * 2 * ease(ph); o.jy = -15 * sin(PI * c01(ph * 1.05)); o.sy = 1 + .07 * sin(PI * ph); o.sx = 1 - .04 * sin(PI * ph); o.happy = .8 * sin(PI * ph); } },
      wiggle: { d: 900,  f: function (ph, o) { o.rot = 10 * sin(ph * PI * 6) * (1 - ph); o.happy = .55 * sin(PI * ph); } },
      yawn:   { d: 2300, f: function (ph, o) { var b = c01(sin(PI * ph) * 2.2); o.blink = 1 - .93 * b; o.happy = b; o.sy = 1 + .05 * b; o.sx = 1 - .03 * b; o.gyo = .25 * b; } },
      look:   { d: 2800, f: function (ph, o) { o.gx = sin(ph * PI * 2) * .95; o.gy = .25 * sin(ph * PI * 4) + .1; } },
      bounce: { d: 1200, f: function (ph, o) { var a = Math.abs(sin(ph * PI * 2)); o.jy = -13 * a; o.sy = 1 + .06 * a - .05 * (1 - a) * sin(PI * ph); o.sx = 1 - (o.sy - 1) * .6; o.happy = .6 * sin(PI * ph); } },
      /* giggle fit: eyes squeezed, mouth wide open, little shakes */
      laugh:  { d: 2400, f: function (ph, o) {
        var env = Math.min(1, ph * 8, (1 - ph) * 5), t = ph * PI * 2 * 5;
        o.happy = env; o.blink = 1 - .55 * env;
        o.jy = -5 * Math.abs(sin(t)) * env;
        o.rot = 5 * sin(ph * PI * 14) * env;
        o.sy = 1 + .05 * sin(t) * env; o.sx = 1 - (o.sy - 1) * .6;
      } },
      /* loses its balance: wobbles, looks up, rolls backwards, then rocks back to its feet */
      tipover: { d: 3400, f: function (ph, o) {
        var rot = 0, jx = 0, jy = 0, happy = 0, gy = 0;
        if (ph < .24) {
          var a = ph / .24;
          rot = 7 * sin(a * PI * 3) * a; happy = .15 * a; gy = .6 * a;
        } else if (ph < .52) {
          var b = (ph - .24) / .28, e = ease(b);
          rot = -62 * e; jx = -30 * e; jy = -6 * sin(PI * b);
          happy = .15 + .55 * c01(b * 4); gy = .6 + .3 * b;
        } else {
          var u = (ph - .52) / .48, dmp = Math.exp(-4.2 * u), cs2 = Math.cos(u * PI * 3.2);
          rot = -62 * dmp * cs2; jx = -30 * dmp * cs2;
          jy = -9 * Math.abs(sin(u * PI * 2.4)) * (1 - u);
          happy = c01(.7 + .2 * sin(u * PI * 6) - u * .6); gy = .9 * (1 - u);
          o.sy = 1 - .06 * Math.abs(sin(u * PI * 2.4)) * (1 - u); o.sx = 1 + (1 - o.sy) * .6;
        }
        o.rot = rot; o.jx = jx; o.jy += jy; o.happy = happy; o.gx = 0; o.gy = gy;
      } },
      /* a hat drops in, bounces on, gets a laugh and a wiggle, then pops off */
      hat:    { d: 6400, f: function (ph, o) {
        var h = { x: 0, y: 0, r: 0, a: 1 }, land = .1, out = .88;
        if (ph < land) {
          var p = ph / land;
          h.y = -90 * (1 - p * p); h.r = -30 * (1 - p); h.a = c01(p * 3);
          o.gx = 0; o.gy = .85;
        } else if (ph < land + .08) {
          var q = (ph - land) / .08;
          h.y = 5 * sin(q * PI); o.sy = 1 - .07 * sin(q * PI); o.sx = 1 + .04 * sin(q * PI); o.happy = .75 * q;
          o.gx = 0; o.gy = .85 * (1 - q * .6);
        } else if (ph < out) {
          var t = (ph - land - .08) / (out - land - .08);
          h.r = 4 * sin(t * PI * 6);
          o.rot = 3 * sin(t * PI * 5);
          o.happy = .6 + .3 * sin(t * PI * 4);
          if (t > .3 && t < .55) { /* giggle while wearing it */
            var g = sin((t - .3) / .25 * PI);
            o.happy = 1; o.blink = 1 - .5 * g; o.jy = -4 * Math.abs(sin(t * PI * 18)) * g;
            o.rot = 5 * sin(t * PI * 26) * g; h.r = 7 * sin(t * PI * 26) * g;
          } else o.jy = -2 * Math.abs(sin(t * PI * 3));
        } else {
          var w = (ph - out) / (1 - out);
          h.y = -110 * ease(w); h.r = 240 * w; h.a = 1 - c01((w - .5) * 2); o.happy = .6 * (1 - w);
        }
        o.hat = h;
      } },
      sleepy: { d: 3200, f: function (ph, o) { var s = sin(PI * ph); o.blink = 1 - .88 * s * s; o.gyo = -.45 * s; o.rot = 4 * sin(ph * PI * 2) * s; } }
    };
    var BORED = ['wiggle', 'yawn', 'look', 'bounce', 'sleepy', 'laugh', 'laugh', 'tipover'];
    var mv = null, lastBored = '';
    var nextSpin = last + 10000 + Math.random() * 6000, nextBored = last + 5000;
    function start(name, now) {
      mv = { n: name, t0: now, dir: Math.random() < .5 ? 1 : -1 };
      if (name === 'hat') {
        var pool = HAT_NAMES.filter(function (n) { return n !== lastHat; });
        lastHat = pool[Math.floor(Math.random() * pool.length)];
        hatEl.innerHTML = HATS[lastHat];
      }
    }

    function frame(now) {
      requestAnimationFrame(frame);
      if (document.hidden) { last = now; return; }
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!reduce) T += dt;

      /* schedule: a spin every 10-18s, and when nobody has touched it for 6s it gets bored */
      if (!reduce && !mv && hov < .2 && press === 0) {
        if (now > nextSpin) { start('spin', now); nextSpin = now + 10000 + Math.random() * 8000; }
        else if (now - lastMove > 4000 && now > nextBored) {
          var pool = BORED.filter(function (n) { return n !== lastBored; });
          lastBored = pool[Math.floor(Math.random() * pool.length)];
          start(lastBored, now);
          nextBored = now + 3500 + Math.random() * 3500;
        }
      }
      var o = { spin: 0, jx: 0, jy: 0, sx: 1, sy: 1, rot: 0, happy: 0, blink: 1, gx: null, gy: null, gyo: 0, hat: null };
      if (mv) {
        var ph = (now - mv.t0) / MOVES[mv.n].d;
        if (ph >= 1) mv = null; else MOVES[mv.n].f(ph, o, mv);
      }

      var tx = 0, ty = 0;
      if (px !== null && now - lastMove < 5000) {
        var r = cv.getBoundingClientRect();
        var dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2);
        var dist = Math.hypot(dx, dy) || 1, m = Math.min(1, dist / 240);
        tx = dx / dist * m; ty = -dy / dist * m;
      } else if (!reduce) { /* idle: look around lazily */
        tx = sin(T * .5) * .55; ty = sin(T * .37 + 1) * .3;
      }
      if (o.gx !== null) { tx = o.gx; ty = o.gy; }
      ty += o.gyo;
      var k = 1 - Math.exp(-dt * 9);
      gx += (tx - gx) * k; gy += (ty - gy) * k;
      hov += (hovT - hov) * (1 - Math.exp(-dt * 10));
      press = Math.max(0, press - dt * 2.2);
      var happy = Math.min(1, hov * .75 + press + o.happy);
      var blink = 1;
      if (!reduce) {
        if (blinkStart < 0 && now > blinkAt) blinkStart = now;
        if (blinkStart >= 0) {
          var bp = (now - blinkStart) / 170;
          if (bp >= 1) { blinkStart = -1; blinkAt = now + 1800 + Math.random() * 3200; }
          else blink = 1 - sin(PI * bp);
        }
      }
      var wink = 1;
      if (forcedWinkStart >= 0) {
        var fp = (now - forcedWinkStart) / 190;
        if (fp >= 1) forcedWinkStart = -1;
        else wink = 1 - sin(PI * fp);
      }
      blink = Math.min(blink, o.blink);
      if (o.hat) {
        var hk = body.clientWidth / 128;
        hatOn = true;
        hatEl.style.opacity = o.hat.a.toFixed(3);
        hatEl.style.transform = 'translate(' + (o.hat.x * hk).toFixed(2) + 'px,' + (o.hat.y * hk).toFixed(2) + 'px) rotate(' + o.hat.r.toFixed(2) + 'deg)';
      } else if (hatOn) { hatOn = false; hatEl.style.opacity = '0'; }
      var hs = 1 + .08 * hov;
      body.style.translate = o.jx.toFixed(2) + 'px ' + o.jy.toFixed(2) + 'px';
      body.style.scale = (o.sx * hs).toFixed(3) + ' ' + (o.sy * hs).toFixed(3);
      body.style.rotate = o.rot.toFixed(2) + 'deg';
      dk += ((isDark() ? 1 : 0) - dk) * (1 - Math.exp(-dt * 3.5));
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U.uDark, dk);
      gl.uniform2f(U.uRes, cv.width, cv.height);
      gl.uniform1f(U.uTime, T);
      gl.uniform2f(U.uGaze, gx, gy);
      gl.uniform1f(U.uBlink, blink);
      gl.uniform1f(U.uWink, wink);
      gl.uniform1f(U.uHappy, happy);
      gl.uniform1f(U.uSpin, o.spin);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(frame);
  })();
})();
