import React from 'react';

const GAME_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Le Donjon du Passé : Héros & Légendes</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{background:#0a0a0f;font-family:'Georgia',serif;overflow:hidden;user-select:none;}
  #canvas-container{position:fixed;inset:0;}
  canvas{display:block;width:100%!important;height:100%!important;}
  #hud{position:fixed;top:0;left:0;right:0;z-index:10;pointer-events:none;}
  #hud-top{display:flex;align-items:center;justify-content:space-between;padding:10px 18px;background:linear-gradient(180deg,rgba(0,0,0,.85) 0%,transparent 100%);}
  #chamber-label{color:#f5c842;font-size:14px;font-variant:small-caps;letter-spacing:2px;text-shadow:0 0 8px #f5c84299;}
  #progress-bar{display:flex;gap:6px;}
  .pip{width:18px;height:18px;border-radius:50%;border:2px solid #f5c842;background:transparent;transition:background .4s;}
  .pip.done{background:#f5c842;}
  #hud-bottom{position:fixed;bottom:0;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:8px;padding:8px 16px 14px;background:linear-gradient(0deg,rgba(0,0,0,.95) 0%,rgba(0,0,0,.7) 70%,transparent 100%);}
  #context-box{background:rgba(30,10,50,.85);border:1px solid #7a3fa0;border-radius:8px;padding:8px 16px;max-width:860px;width:100%;text-align:center;color:#e0c8ff;font-size:12.5px;line-height:1.5;pointer-events:none;}
  #context-box strong{color:#f5c842;}

  #sentence-preview{background:rgba(15,5,30,0.85);border:1px solid #9f7fd4;border-radius:8px;padding:8px 16px;color:#f3e8ff;font-size:13.5px;max-width:860px;width:100%;text-align:center;pointer-events:none;box-shadow:0 0 12px rgba(124,58,237,0.25);line-height:1.4;}
  #sentence-preview em{color:#f5c842;font-style:normal;font-weight:bold;margin-right:4px;}
  .preview-blank{color:#a78bfa;border-bottom:2px dashed #a78bfa;padding:0 6px;}
  .preview-filled{color:#fef08a;font-weight:bold;text-shadow:0 0 6px rgba(254,240,138,0.4);}

  #slots-row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:900px;pointer-events:auto;}
  .slot{min-width:120px;max-width:240px;padding:10px 14px;border-radius:8px;border:2px dashed #7a3fa0;background:rgba(30,10,50,.7);color:#cbd5e1;font-size:12px;text-align:center;cursor:pointer;transition:all .25s;position:relative;margin-top:18px;line-height:1.3;box-shadow:0 2px 6px rgba(0,0,0,0.3);}
  .slot.filled{border-color:#f5c842;background:rgba(60,40,10,.75);color:#fef08a;border-style:solid;}
  .slot-label{position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:10px;color:#c084fc;white-space:nowrap;font-variant:small-caps;letter-spacing:1px;font-weight:bold;}

  #palette{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;max-width:900px;pointer-events:auto;}
  .rune{padding:7px 12px;border-radius:6px;border:1px solid #7a3fa0;background:rgba(90,20,140,.45);color:#e9d5ff;font-size:12px;cursor:pointer;transition:all .2s;font-family:'Georgia',serif;}
  .rune:hover{background:rgba(130,40,200,.6);border-color:#c07aff;color:#fff;transform:translateY(-2px);box-shadow:0 0 10px rgba(192,122,255,0.4);}
  .rune.used{opacity:.25;cursor:default;transform:none;}

  #action-row{display:flex;gap:12px;pointer-events:auto;margin-top:2px;}
  .action-btn{padding:8px 22px;border-radius:7px;border:none;font-size:12.5px;font-family:'Georgia',serif;cursor:pointer;letter-spacing:1px;font-variant:small-caps;transition:all .2s;}
  #btn-validate{background:linear-gradient(135deg,#7b2ff7,#4f0e9c);color:#fff;border:1px solid #b06aff;box-shadow:0 0 12px rgba(123,47,247,0.4);}
  #btn-validate:hover{background:linear-gradient(135deg,#9b4fff,#6b1fd0);transform:scale(1.03);}
  #btn-reset{background:rgba(40,10,80,.6);color:#c090f0;border:1px solid #5a2f8a;}
  #btn-reset:hover{background:rgba(60,20,100,.7);}

  #feedback{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:50;max-width:580px;width:90%;border-radius:12px;padding:22px 28px;text-align:center;display:none;pointer-events:auto;box-shadow:0 20px 50px rgba(0,0,0,0.8);}
  #feedback.success{background:rgba(15,45,20,.96);border:2px solid #4ade80;color:#bbf7d0;}
  #feedback.error{background:rgba(55,10,10,.96);border:2px solid #f87171;color:#fecaca;}
  #feedback h3{font-size:18px;margin-bottom:10px;}
  #feedback p{font-size:13.5px;line-height:1.6;margin-bottom:14px;}
  #feedback button{padding:8px 22px;border-radius:6px;border:none;cursor:pointer;font-size:13px;font-family:'Georgia',serif;font-weight:bold;transition:all .2s;}
  #feedback.success button{background:#16a34a;color:#fff;}
  #feedback.success button:hover{background:#15803d;}
  #feedback.error button{background:#b91c1c;color:#fff;}
  #feedback.error button:hover{background:#991b1b;}

  #victory{position:fixed;inset:0;z-index:100;background:rgba(5,2,20,.96);display:none;flex-direction:column;align-items:center;justify-content:center;gap:18px;text-align:center;padding:30px;}
  #victory h1{color:#f5c842;font-size:32px;text-shadow:0 0 20px #f5c84299;letter-spacing:3px;}
  #victory p{color:#d8c090;font-size:15px;max-width:560px;line-height:1.7;}
  #victory button{padding:12px 30px;border-radius:8px;border:1px solid #f5c842;background:rgba(60,40,0,.8);color:#f5c842;font-size:15px;cursor:pointer;letter-spacing:2px;font-family:'Georgia',serif;}

  #flicker{position:fixed;inset:0;pointer-events:none;z-index:2;animation:flick 0.08s infinite alternate;}
  @keyframes flick{from{opacity:0}to{opacity:.025}}
</style>
</head>
<body>
<div id="canvas-container"><canvas id="c"></canvas></div>
<div id="flicker"></div>
<div id="hud">
  <div id="hud-top">
    <div id="chamber-label">⚔ Chambre I</div>
    <div id="progress-bar">
      <div class="pip" id="pip0"></div>
      <div class="pip" id="pip1"></div>
      <div class="pip" id="pip2"></div>
      <div class="pip" id="pip3"></div>
    </div>
  </div>
  <div id="hud-bottom">
    <div id="context-box">Chargement…</div>
    <div id="sentence-preview"></div>
    <div id="slots-row"></div>
    <div id="palette"></div>
    <div id="action-row">
      <button class="action-btn" id="btn-reset">↺ Réinitialiser</button>
      <button class="action-btn" id="btn-validate">⚡ Valider la formule</button>
    </div>
  </div>
</div>
<div id="feedback">
  <h3 id="fb-title"></h3>
  <div id="fb-body"></div>
  <button id="fb-btn"></button>
</div>
<div id="victory">
  <h1>🏆 Évasion Réussie !</h1>
  <p>Vous maîtrisez l'art subtil du passé composé et de l'imparfait dans les récits héroïques !<br>Le donjon des héros vous ouvre ses portes — vous êtes une légende vivante !</p>
  <p style="font-size:13px;color:#a89060;margin-top:6px;">Vocabulaire : héros · anti-héros · bravoure · sacrifice · exploit · vaillant · triompher · dilemme moral</p>
  <button id="btn-rejouer">↺ Rejouer le Donjon</button>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
const CHAMBERS = [
  {
    id: 1,
    title: "Chambre I — Contexte (Imparfait) & Action Soudaine (PC)",
    theme: "⚔️ La Garde des Remparts",
    context: "Chaque nuit, le héros <strong>surveillait</strong> la forteresse. Soudain, un ennemi masqué est apparu et a attaqué les remparts.",
    instruction: "Reconstituez la phrase complète : action d'arrière-plan continue (imparfait) rompue par une action soudaine (passé composé) :",
    slots: [
      { label: "1. Contexte (Imparfait)", answer: "Alors que le héros surveillait la forteresse," },
      { label: "2. Rupture temporelle", answer: "soudain" },
      { label: "3. Sujet de l'action", answer: "l'ennemi masqué" },
      { label: "4. Action soudaine (PC)", answer: "a attaqué les remparts." }
    ],
    runes: [
      "Alors que le héros surveillait la forteresse,",
      "soudain",
      "l'ennemi masqué",
      "a attaqué les remparts.",
      "Alors que le héros a surveillé la forteresse,",
      "attaquait les remparts.",
      "a attaquée les remparts.",
      "pendant toujours"
    ],
    feedback_error: "⚠ Attention au contraste ! L'action continue en arrière-plan exige l'imparfait (« surveillait »). L'événement soudain et ponctuel qui rompt la routine exige le passé composé (« a attaqué » sans accord).",
    feedback_success: "✔ Parfait ! « Surveillait » est à l'imparfait (action continue d'arrière-plan) et « a attaqué » est au passé composé (action soudaine qui fait progresser l'histoire) !"
  },
  {
    id: 2,
    title: "Chambre II — Habitude (Imparfait) & Découverte Unique (PC)",
    theme: "🛡️ L'Appel de la Quête",
    context: "La jeune héroïne s'entraînait chaque matin dans la cour du château. Mais un jour précis, elle a découvert l'épée sacrée.",
    instruction: "Distinguez l'entraînement routinier répété (imparfait) et l'événement unique qui déclenche la quête (passé composé) :",
    slots: [
      { label: "1. Habitude (Imparfait)", answer: "Chaque matin, la jeune héroïne s'entraînait," },
      { label: "2. Événement précis", answer: "mais hier" },
      { label: "3. Pronom sujet", answer: "elle" },
      { label: "4. Découverte (PC)", answer: "a découvert l'épée sacrée." }
    ],
    runes: [
      "Chaque matin, la jeune héroïne s'entraînait,",
      "mais hier",
      "elle",
      "a découvert l'épée sacrée.",
      "Chaque matin, la jeune héroïne s'est entraînée,",
      "découvrait l'épée sacrée.",
      "a découvrit l'épée sacrée.",
      "a découverte l'épée sacrée."
    ],
    feedback_error: "⚠ Vérifiez les repères temporels ! « Chaque matin » impose l'imparfait (« s'entraînait ») pour l'habitude. « Mais hier » impose le passé composé (« a découvert ») pour la découverte ponctuelle.",
    feedback_success: "✔ Bravo ! « Chaque matin » indique une habitude répétée dans le passé → Imparfait (s'entraînait). « Hier » marque un événement précis → Passé composé (a découvert) !"
  },
  {
    id: 3,
    title: "Chambre III — État d'Esprit (Imparfait) & Décision Décisive (PC)",
    theme: "🔥 La Menace sur la Cité",
    context: "La peur régnait chez les villageois face au monstre. C'est alors que les braves héros ont pris les armes pour défendre leur peuple.",
    instruction: "L'état durable ou le sentiment en arrière-plan s'exprime à l'imparfait ; l'action concrète et ponctuelle se conjugue au passé composé :",
    slots: [
      { label: "1. État d'esprit (Imparfait)", answer: "Puisque les villageois avaient peur du monstre," },
      { label: "2. Sujet pluriel", answer: "les braves héros" },
      { label: "3. Action décisive (PC)", answer: "ont pris les armes" },
      { label: "4. Complément de but", answer: "pour défendre la cité." }
    ],
    runes: [
      "Puisque les villageois avaient peur du monstre,",
      "les braves héros",
      "ont pris les armes",
      "pour défendre la cité.",
      "Puisque les villageois ont eu peur du monstre,",
      "prenaient les armes",
      "sont pris les armes",
      "ont prises les armes"
    ],
    feedback_error: "⚠ Attention à la fonction des temps ! L'état d'esprit durable en arrière-plan s'exprime à l'imparfait (« avaient peur »). La décision d'action concrète et ponctuelle s'exprime au passé composé (« ont pris »).",
    feedback_success: "✔ Magnifique ! « Avaient peur » décrit l'état émotionnel continu à l'imparfait. « Ont pris les armes » est l'action décisive et achevée au passé composé !"
  },
  {
    id: 4,
    title: "Chambre IV — Séquence d'Actions (PC) & Accord du Participe Passé",
    theme: "🏆 La Victoire et la Rédemption",
    context: "Le héros a vu les captives enfermées dans la tour. Sans hésiter, il les a libérées avec un courage admirable.",
    instruction: "Racontez l'action successive et accordez correctement le participe passé avec le pronom COD placé devant :",
    slots: [
      { label: "1. Action passée (PC)", answer: "Dès que le héros a aperçu les captives," },
      { label: "2. Sujet + COD antéposé", answer: "il les" },
      { label: "3. PC accordé avec COD", answer: "a libérées" },
      { label: "4. Manière héroïque", answer: "avec un immense courage." }
    ],
    runes: [
      "Dès que le héros a aperçu les captives,",
      "il les",
      "a libérées",
      "avec un immense courage.",
      "Dès que le héros apercevait les captives,",
      "a libéré",
      "a libérés",
      "les a libérer"
    ],
    feedback_error: "⚠ Règle d'or de l'accord : le pronom COD « les » représente « les captives » (féminin pluriel) et se trouve DEVANT l'auxiliaire avoir → le participe passé s'accorde obligatoirement au féminin pluriel : « a libérées » (-ées) !",
    feedback_success: "✔ Magistral ! « Dès que » introduit une action achevée au passé composé (« a aperçu »). Le pronom COD « les » (féminin pluriel) précède « avoir » → accord obligatoire : « a libérées » !"
  }
];

const W=()=>window.innerWidth, H=()=>window.innerHeight;
const renderer=new THREE.WebGLRenderer({canvas:document.getElementById('c'),antialias:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setSize(W(),H());
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputEncoding=THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=0.85;

const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0x070310,0.055);
scene.background=new THREE.Color(0x050208);

const camera=new THREE.PerspectiveCamera(65,W()/H(),0.1,80);
camera.position.set(0,2.4,7);
camera.lookAt(0,1.2,0);

scene.add(new THREE.AmbientLight(0x1a0a2e,0.6));

function makeTorch(x,y,z){
  const l=new THREE.PointLight(0xff8800,2.2,9);
  l.position.set(x,y,z);
  l.castShadow=true;
  l.shadow.mapSize.width=256;
  l.shadow.mapSize.height=256;
  scene.add(l);
  const f=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.18,6),new THREE.MeshBasicMaterial({color:0xff6600}));
  f.position.set(x,y+0.09,z);
  scene.add(f);
  const s=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.06,0.2,8),new THREE.MeshStandardMaterial({color:0x3a2010,roughness:0.9}));
  s.position.set(x,y-0.1,z);
  scene.add(s);
  return l;
}
const torchLights=[makeTorch(-3.5,2.6,0),makeTorch(3.5,2.6,0),makeTorch(0,2.6,-4)];

function stoneTex(w,h,dark){
  const c=document.createElement('canvas');
  c.width=w;c.height=h;
  const ctx=c.getContext('2d');
  ctx.fillStyle=dark?'#1a1225':'#2a1e3a';
  ctx.fillRect(0,0,w,h);
  for(let i=0;i<400;i++){
    const px=Math.random()*w,py=Math.random()*h,r=Math.random()*4+1,v=Math.floor(Math.random()*30)+(dark?8:15);
    ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);
    ctx.fillStyle='rgb('+v+','+(v*.7|0)+','+(v*1.1|0)+')';ctx.fill();
  }
  ctx.strokeStyle=dark?'#0d0818':'#150f22';ctx.lineWidth=2;
  for(let row=0;row<h;row+=40){
    const off=(row/40%2)*60;
    for(let col=off;col<w+80;col+=120){ctx.beginPath();ctx.rect(col,row,110,36);ctx.stroke();}
  }
  return new THREE.CanvasTexture(c);
}

function makeWall(w,h,x,y,z,ry){
  const mat=new THREE.MeshStandardMaterial({map:stoneTex(512,256,false),roughness:0.95,metalness:0});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);
  mesh.position.set(x,y,z);mesh.rotation.y=ry;mesh.receiveShadow=true;scene.add(mesh);
}

const floorMat=new THREE.MeshStandardMaterial({map:stoneTex(512,512,true),roughness:1,metalness:0});
floorMat.map.wrapS=floorMat.map.wrapT=THREE.RepeatWrapping;
floorMat.map.repeat.set(3,3);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(18,18),floorMat);
floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);

const ceilMat=new THREE.MeshStandardMaterial({map:stoneTex(256,256,true),roughness:1,metalness:0});
const ceil=new THREE.Mesh(new THREE.PlaneGeometry(18,18),ceilMat);
ceil.rotation.x=Math.PI/2;ceil.position.y=5.5;scene.add(ceil);

makeWall(18,6,0,2.75,-5.5,0);
makeWall(18,6,0,2.75,9,Math.PI);
makeWall(11,6,-9,2.75,0,Math.PI/2);
makeWall(11,6,9,2.75,0,-Math.PI/2);

function buildDoor(){
  const g=new THREE.Group();
  const door=new THREE.Mesh(new THREE.BoxGeometry(1.8,3.2,0.15),new THREE.MeshStandardMaterial({color:0x2a1508,roughness:0.8,metalness:0.3}));
  g.add(door);
  const bm=new THREE.MeshStandardMaterial({color:0x1a1a1a,metalness:0.9,roughness:0.2});
  [-0.9,0,0.9].forEach(dy=>{const b=new THREE.Mesh(new THREE.BoxGeometry(1.85,0.12,0.2),bm);b.position.y=dy;g.add(b);});
  const rune=new THREE.Mesh(new THREE.CircleGeometry(0.18,16),new THREE.MeshBasicMaterial({color:0x8b00ff}));
  rune.position.set(0,0.4,0.1);g.add(rune);
  g.position.set(0,1.6,-5.3);scene.add(g);return g;
}
const vaultDoor=buildDoor();

const pedestals=[];
function makePedestal(x,z){
  const pm=new THREE.MeshStandardMaterial({color:0x1e0a30,roughness:0.7,metalness:0.2});
  const base=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.3,0.7),pm);
  base.position.set(x,0.15,z);base.castShadow=true;base.receiveShadow=true;scene.add(base);
  const top=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.05,0.6),pm);
  top.position.set(x,0.32,z);scene.add(top);
  const cm=new THREE.MeshStandardMaterial({color:0x6600cc,emissive:0x3300aa,emissiveIntensity:0.8,roughness:0.1,metalness:0.3});
  const crystal=new THREE.Mesh(new THREE.OctahedronGeometry(0.14,0),cm);
  crystal.position.set(x,0.52,z);scene.add(crystal);
  pedestals.push({base,top,crystal});
}
[-4.5,-1.5,1.5,4.5].forEach(x=>makePedestal(x,1.5));

function makePillar(x,z){
  const mat=new THREE.MeshStandardMaterial({map:stoneTex(128,256,false),roughness:0.9,metalness:0});
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.35,4.5,8),mat);
  shaft.position.set(x,2.25,z);shaft.castShadow=true;scene.add(shaft);
  const cap=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.3,0.9),mat);
  cap.position.set(x,4.65,z);scene.add(cap);
}
[[-3.5,-1],[-3.5,3],[3.5,-1],[3.5,3]].forEach(([x,z])=>makePillar(x,z));

const pCount=120;
const pGeo=new THREE.BufferGeometry();
const pPos=new Float32Array(pCount*3);
for(let i=0;i<pCount;i++){pPos[i*3]=(Math.random()-.5)*16;pPos[i*3+1]=Math.random()*5;pPos[i*3+2]=(Math.random()-.5)*10;}
pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
const particles=new THREE.Points(pGeo,new THREE.PointsMaterial({color:0xaa66ff,size:0.04,transparent:true,opacity:0.45}));
scene.add(particles);

let runeBlocks=[];
let chamberIndex=0;
let slotValues=[];

function makeRuneBlock(label,i,total){
  const angle=(i/total)*Math.PI*1.8-Math.PI*0.9;
  const radius=2.8+(i%2)*0.4;
  const x=Math.sin(angle)*radius;
  const z=-0.5+Math.cos(angle)*radius*0.35;
  const y=0.6+Math.sin(i*1.3)*0.3;
  const mat=new THREE.MeshStandardMaterial({color:0x3a1060,emissive:0x1a0040,emissiveIntensity:0.5,roughness:0.4,metalness:0.4});
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.35,0.15),mat);
  mesh.position.set(x,y,z);mesh.castShadow=true;scene.add(mesh);
  return{mesh,label,x,y,z,baseY:y};
}

function animateRuneToSlot(rb,tx,ty,tz){
  const sx=rb.mesh.position.x,sy=rb.mesh.position.y,sz=rb.mesh.position.z;
  const dur=0.5,t0=performance.now();
  function step(t){
    const p=Math.min((t-t0)/(dur*1000),1),e=1-Math.pow(1-p,3);
    rb.mesh.position.set(sx+(tx-sx)*e,sy+(ty-sy)*e,sz+(tz-sz)*e);
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function updateSentencePreview(){
  const ch=CHAMBERS[chamberIndex];
  const parts=ch.slots.map((s,i)=>{
    if(slotValues[i]){
      return '<span class="preview-filled">'+slotValues[i]+'</span>';
    }
    return '<span class="preview-blank">[ '+s.label+' ]</span>';
  });
  document.getElementById('sentence-preview').innerHTML =
    '<em>Formule assemblée :</em> « ' + parts.join(' ') + ' »';
}

function loadChamber(idx){
  chamberIndex=idx;
  const ch=CHAMBERS[idx];
  document.getElementById('chamber-label').textContent='⚔ '+ch.title.split('—')[0].trim();
  for(let i=0;i<4;i++)document.getElementById('pip'+i).classList.toggle('done',i<idx);
  document.getElementById('context-box').innerHTML=
    '<strong style="color:#f5c842;font-size:11.5px;letter-spacing:1px;font-variant:small-caps;">'+ch.theme+'</strong><br>'+
    '<em>'+ch.instruction+'</em><br><span style="opacity:0.9;">'+ch.context+'</span>';
  slotValues=ch.slots.map(()=>null);
  renderSlots();
  renderPalette(ch);
  updateSentencePreview();
  runeBlocks.forEach(rb=>scene.remove(rb.mesh));
  runeBlocks=ch.runes.map((label,i)=>makeRuneBlock(label,i,ch.runes.length));
  pedestals.forEach(p=>{p.crystal.material.color.setHex(0x6600cc);p.crystal.material.emissive.setHex(0x3300aa);});
  vaultDoor.position.x=0;vaultDoor.rotation.y=0;
}

function renderSlots(){
  const ch=CHAMBERS[chamberIndex];
  const row=document.getElementById('slots-row');
  row.innerHTML='';
  ch.slots.forEach((s,i)=>{
    const div=document.createElement('div');
    div.className='slot'+(slotValues[i]?' filled':'');
    div.innerHTML='<span class="slot-label">'+s.label+'</span>'+(slotValues[i]||'<span style="opacity:0.4;">[ Emplacement vide ]</span>');
    div.title=slotValues[i] ? "Cliquez pour retirer cette rune" : "Emplacement pour : " + s.label;
    div.addEventListener('click',()=>{
      if(slotValues[i]){
        slotValues[i]=null;
        renderSlots();
        renderPalette(CHAMBERS[chamberIndex]);
        updateSentencePreview();
      }
    });
    row.appendChild(div);
  });
}

function renderPalette(ch){
  const pal=document.getElementById('palette');
  pal.innerHTML='';
  ch.runes.forEach((label,ri)=>{
    const used=slotValues.includes(label);
    const btn=document.createElement('button');
    btn.className='rune'+(used?' used':'');
    btn.textContent=label;
    btn.disabled=used;
    btn.title=used ? "Rune déjà placée" : "Cliquez pour placer dans la formule";
    btn.addEventListener('click',()=>{
      if(used)return;
      const emptyIdx=slotValues.indexOf(null);
      if(emptyIdx===-1)return;
      slotValues[emptyIdx]=label;
      renderSlots();
      renderPalette(ch);
      updateSentencePreview();
      const rb=runeBlocks[ri];
      if(rb)animateRuneToSlot(rb,(emptyIdx-1.5)*1.0,0.5,-2);
      if(pedestals[emptyIdx]){
        pedestals[emptyIdx].crystal.material.color.setHex(0xffcc00);
        pedestals[emptyIdx].crystal.material.emissive.setHex(0x886600);
      }
    });
    pal.appendChild(btn);
  });
}

function openDoor(){
  const sx=vaultDoor.position.x,t0=performance.now();
  function step(t){const p=Math.min((t-t0)/700,1);vaultDoor.position.x=sx-2.2*(1-Math.pow(1-p,2));if(p<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);
}

function showFeedback(type,title,bodyHtml,btnLabel){
  const fb=document.getElementById('feedback');
  fb.className=type;
  document.getElementById('fb-title').textContent=title;
  document.getElementById('fb-body').innerHTML=bodyHtml;
  document.getElementById('fb-btn').textContent=btnLabel;
  fb.style.display='block';
  document.getElementById('fb-btn').onclick=()=>{
    fb.style.display='none';
    if(type==='success'){chamberIndex<3?loadChamber(chamberIndex+1):showVictory();}
  };
}

function showVictory(){document.getElementById('victory').style.display='flex';}

document.getElementById('btn-validate').addEventListener('click',()=>{
  const ch=CHAMBERS[chamberIndex];
  if(slotValues.includes(null)){
    showFeedback(
      'error',
      '🪄 Formule incomplète !',
      '<p>Placez une rune dans chacun des <strong>4 emplacements</strong> pour former la phrase complète avant de valider.</p>',
      'Continuer'
    );
    return;
  }
  const isAllExact = ch.slots.every((s,i)=>slotValues[i]===s.answer);
  if(isAllExact){
    pedestals.forEach(p=>{p.crystal.material.color.setHex(0x00ff88);p.crystal.material.emissive.setHex(0x00aa44);});
    openDoor();
    const correctSentence = ch.slots.map(s => s.answer).join(' ');
    showFeedback(
      'success',
      '✨ Formule Magique Parfaite !',
      '<div style="background:rgba(0,0,0,0.4);border:1px solid #4ade80;border-radius:8px;padding:10px 14px;margin-bottom:12px;color:#fef08a;font-size:14px;font-weight:bold;">« ' + correctSentence + ' »</div><p>' + ch.feedback_success + '</p>',
      chamberIndex < 3 ? 'Chambre suivante →' : '🏆 Terminer l\'Évasion !'
    );
  } else {
    pedestals.forEach(p=>{p.crystal.material.color.setHex(0xff2200);p.crystal.material.emissive.setHex(0xaa1100);});
    setTimeout(()=>pedestals.forEach(p=>{p.crystal.material.color.setHex(0x6600cc);p.crystal.material.emissive.setHex(0x3300aa);}),800);
    const attemptedSentence = slotValues.join(' ');
    showFeedback(
      'error',
      '❌ Formule Invalide !',
      '<div style="background:rgba(0,0,0,0.4);border:1px solid #f87171;border-radius:8px;padding:10px 14px;margin-bottom:12px;color:#fecaca;font-size:13px;">Votre essai : « ' + attemptedSentence + ' »</div><p>' + ch.feedback_error + '</p>',
      'Réessayer la formule'
    );
  }
});

document.getElementById('btn-reset').addEventListener('click',()=>loadChamber(chamberIndex));
document.getElementById('btn-rejouer').addEventListener('click',()=>{document.getElementById('victory').style.display='none';loadChamber(0);});

let t=0;
function animate(){
  requestAnimationFrame(animate);t+=0.016;
  torchLights.forEach((l,i)=>{l.intensity=2.0+Math.sin(t*7+i*2.3)*0.4+Math.sin(t*13+i)*0.15;});
  pedestals.forEach((p,i)=>{p.crystal.position.y=0.52+Math.sin(t*1.8+i)*0.04;p.crystal.rotation.y+=0.012;});
  runeBlocks.forEach((rb,i)=>{rb.mesh.position.y=rb.baseY+Math.sin(t*1.2+i*0.9)*0.06;rb.mesh.rotation.y=Math.sin(t*0.5+i)*0.15;});
  const dr=vaultDoor.children[vaultDoor.children.length-1];
  if(dr&&dr.material)dr.material.color.setHSL(0.75,1,0.45+Math.sin(t*3)*0.15);
  const pa=pGeo.attributes.position.array;
  for(let i=0;i<pCount;i++){pa[i*3+1]+=0.004;if(pa[i*3+1]>5.2)pa[i*3+1]=0;}
  pGeo.attributes.position.needsUpdate=true;
  camera.position.x=Math.sin(t*0.15)*0.12;
  camera.position.y=2.4+Math.sin(t*0.22)*0.06;
  renderer.render(scene,camera);
}

window.addEventListener('resize',()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H());});
loadChamber(0);
animate();
</script>
</body>
</html>`;

export default function DonjonDesHeros({ onBack }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#050208' }}>
      <button
        onClick={onBack}
        style={{
          position: 'fixed', top: 12, right: 16, zIndex: 2000,
          background: 'rgba(30,10,60,0.85)', border: '1px solid #7a3fa0',
          color: '#d8a0ff', padding: '6px 14px', borderRadius: 6,
          cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: 13,
          fontVariant: 'small-caps', letterSpacing: 1
        }}
      >
        ✕ Quitter le Donjon
      </button>
      <iframe
        srcDoc={GAME_HTML}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        title="Le Donjon du Passé : Héros & Légendes"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
