import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';

// ── Constants ──────────────────────────────────────────────────────────────────
const CW = 860, CH = 540, PR = 14;
const LETTERS = ['A','B','C','D'];

const ROOM_BACKGROUNDS = {
  foret: '/images/citadelle/bg_foret_clay.jpg',
  pont: '/images/citadelle/bg_pont.jpg',
  cour: '/images/citadelle/bg_cour.jpg',
  armurerie: '/images/citadelle/bg_armurerie.jpg',
  grande_salle: '/images/citadelle/bg_grande_salle.jpg',
  donjon: '/images/citadelle/bg_donjon.jpg',
};
const KNIGHT_SPRITE_SRC = '/images/citadelle/knight_clay.jpg';

// ── World data ─────────────────────────────────────────────────────────────────
const ROOMS = {
  foret:{
    id:'foret',name:"L'Orée de la Forêt Paisible",theme:'Gérer la surcharge de travail',
    sL:'#446340',sD:'#334d30',mort:'#223320',wTop:'#2c442a',wSide:'#1e331d',tint:'rgba(134,239,172,0.12)',
    torches:[{x:160,y:175},{x:390,y:190},{x:610,y:180},{x:155,y:310},{x:605,y:310}],
    obstacles:[
      // Top Ancient Oak Canopy (blocks top boundary)
      {x:0,y:0,w:860,h:185,type:'hedgewall'},
      // Bottom-Left Dense Thicket
      {x:0,y:340,w:260,h:200,type:'hedgewall'},
      // Maze Obstacle: Fallen Clay Trunk blocking direct central path on the road
      // (Forces student to detour through the cozy campfire clearing to get through!)
      {x:440,y:185,w:30,h:110,type:'log'},
      // Campfire & Logs in South-Central Clearing
      {x:340,y:390,w:75,h:55,type:'altar'},
      {x:290,y:360,w:75,h:28,type:'log'},
      {x:285,y:440,w:75,h:28,type:'log'},
      // South-Center Bushes & Signposts
      {x:485,y:360,w:165,h:180,type:'hedgewall'},
      // Bottom-Right Autumn Tree & Thicket
      {x:670,y:340,w:190,h:200,type:'hedgewall'},
      // Lampposts along path
      {x:145,y:215,w:22,h:30,type:'pillar'},
      {x:375,y:230,w:22,h:30,type:'pillar'},
      {x:595,y:220,w:22,h:30,type:'pillar'},
      {x:140,y:305,w:22,h:30,type:'pillar'},
      {x:590,y:305,w:22,h:30,type:'pillar'},
    ],
    q:'Tu as trois devoirs ce soir et tu te sens dépassé(e). Pour décompresser sainement, quel conseil choisis-tu ?',
    opts:['Tu devrais prendre une pause de 10 minutes avant de reprendre.',
          'Il est certain que tu finiras tout en une seule minute.',
          'Tu dois paniquer immédiatement et tout abandonner.',
          "Tu serais incapable d'apprendre quoi que ce soit ce soir."],
    ok:0,hint:"Rappel : Le conditionnel présent (Tu devrais...) formule un conseil bienveillant.",
    fb:"Bravo ! 'Tu devrais' est le conditionnel présent — un conseil pratique sans pression.",
    exits:{
      east:{
        target:'pont',x:680,y:440,
        door:{x:800,y:210,w:45,h:100,dir:'east',arrow:'→'}
      }
    },
  },
  pont:{
    id:'pont',name:'Le Pont des Émotions',theme:'Reconnaître le stress physique',
    sL:'#52647c',sD:'#3e4e63',mort:'#283445',wTop:'#334154',wSide:'#232f3e',tint:'rgba(186,230,253,0.12)',
    torches:[{x:720,y:80},{x:540,y:80},{x:220,y:80},{x:80,y:80},{x:720,y:450},{x:380,y:450}],
    obstacles:[
      // Maze Stone Rampart Walls (Generous 120-150px corridors)
      {x:630,y:140,w:24,h:370,type:'stonewall'},
      {x:480,y:30,w:24,h:340,type:'stonewall'},
      {x:330,y:140,w:24,h:370,type:'stonewall'},
      {x:180,y:30,w:24,h:340,type:'stonewall'},
      // Dead End 1 (East parapet balcony - tucked in corner)
      {x:780,y:160,w:34,h:32,type:'chest'},
      // Dead End 2 (Central watchpost - tucked against bottom)
      {x:550,y:460,w:20,h:45,type:'rack'},
      // Dead End 3 (West chasm lookout - tucked in corner)
      {x:55,y:450,w:34,h:32,type:'chest'},
    ],
    q:"Complète : « Pour apaiser ton esprit avant un examen, il faut que tu ______ de respirer profondément. »",
    opts:['essaies','essayeras','essayais','essaierais'],
    ok:0,hint:"Rappel : 'il faut que tu...' → subjonctif présent (-es pour les verbes en -er).",
    fb:"Excellent ! 'Il faut que tu...' exige le subjonctif présent ('essaies').",
    exits:{
      south:{
        target:'foret',x:760,y:260,
        door:{x:650,y:506,w:120,h:32,dir:'south',arrow:'↓'}
      },
      north:{
        target:'cour',x:100,y:450,
        door:{x:50,y:2,w:120,h:32,dir:'north',arrow:'↑'}
      }
    },
  },
  cour:{
    id:'cour',name:'La Cour de la Déconnexion',theme:'Les écrans et le sommeil',
    sL:'#5c4c6e',sD:'#473956',mort:'#2e2439',wTop:'#3b2d48',wSide:'#271d32',tint:'rgba(233,213,255,0.12)',
    torches:[{x:80,y:80},{x:760,y:80},{x:80,y:460},{x:760,y:460},{x:430,y:120}],
    obstacles:[
      // Grand central courtyard fountain
      {x:360,y:210,w:140,h:120,type:'fountain'},
      // Ornamental hedge maze walls (Wide openings > 110px)
      {x:200,y:130,w:24,h:380,type:'hedgewall'},
      {x:650,y:140,w:24,h:370,type:'hedgewall'},
      // Dead End 1 (North-West meditation garden - tucked in corner)
      {x:60,y:50,w:65,h:30,type:'table'},
      // Dead End 2 (North garden alcove above fountain)
      {x:390,y:50,w:75,h:30,type:'table'},
      // Dead End 3 (South-East bench alcove - tucked in corner)
      {x:730,y:450,w:65,h:30,type:'table'},
    ],
    q:"Les écrans perturbent le sommeil. Que suggères-tu ? « À ta place, je ______ mon téléphone 30 min avant de dormir. »",
    opts:['éteindrais','éteins','éteindrai','aie éteint'],
    ok:0,hint:"Rappel : 'À ta place, je...' → conditionnel présent (terminaison en -ais).",
    fb:"Parfait ! 'Éteindrais' est le conditionnel présent — suggestion empathique.",
    exits:{
      south:{
        target:'pont',x:100,y:80,
        door:{x:50,y:506,w:120,h:32,dir:'south',arrow:'↓'}
      },
      west:{
        target:'armurerie',x:740,y:400,
        door:{x:2,y:360,w:32,h:110,dir:'west',arrow:'←'}
      },
      east:{
        target:'grande_salle',x:90,y:420,
        door:{x:826,y:50,w:32,h:110,dir:'east',arrow:'→'}
      }
    },
  },
  armurerie:{
    id:'armurerie',name:"L'Armurerie de la Résilience",theme:"L'autocompassion et les erreurs",
    sL:'#8a4b2c',sD:'#6c371e',mort:'#442010',wTop:'#542915',wSide:'#3c1b0d',tint:'rgba(254,215,170,0.14)',
    torches:[{x:100,y:70},{x:760,y:70},{x:440,y:70},{x:740,y:460},{x:240,y:460}],
    obstacles:[
      // Fortified armory walls (Separates spawn 740,400 from East door 826,50)
      {x:630,y:220,w:200,h:24,type:'stonewall'},
      {x:480,y:130,w:24,h:380,type:'stonewall'},
      {x:320,y:30,w:24,h:350,type:'stonewall'},
      {x:160,y:130,w:24,h:380,type:'stonewall'},
      // Dead End 1 (Master forge chamber - tucked in top-left corner)
      {x:45,y:45,w:75,h:65,type:'forge'},
      // Dead End 2 (Shield & armor vault - tucked in bottom-left corner)
      {x:45,y:440,w:34,h:32,type:'chest'},
      {x:95,y:440,w:20,h:45,type:'rack'},
      // Dead End 3 (Munitions reserve - tucked against bottom wall)
      {x:380,y:460,w:60,h:36,type:'barrel'},
    ],
    q:"Quand tu fais une erreur, il est essentiel que tu ne ______ pas trop dur envers toi-même.",
    opts:['sois','es','seras','serais'],
    ok:0,hint:"Rappel : 'il est essentiel que...' → subjonctif présent de être (tu sois).",
    fb:"Très bien ! 'Sois' est le subjonctif présent de être avec 'tu'.",
    exits:{
      east:{
        target:'cour',x:80,y:400,
        door:{x:826,y:50,w:32,h:110,dir:'east',arrow:'→'}
      }
    },
  },
  grande_salle:{
    id:'grande_salle',name:"La Grande Salle de l'Écoute",theme:'Parler à un proche de confiance',
    sL:'#745432',sD:'#583e23',mort:'#382613',wTop:'#463018',wSide:'#31200e',tint:'rgba(253,230,138,0.14)',
    torches:[{x:80,y:70},{x:770,y:70},{x:430,y:70},{x:770,y:450},{x:280,y:450}],
    obstacles:[
      // Mahogany bookcase walls (Blocks SW spawn from NW gate, but has 120px open corridor east)
      {x:30,y:220,w:170,h:24,type:'bookshelfwall'},
      {x:200,y:120,w:24,h:270,type:'bookshelfwall'}, // Ends at y:390, leaving y:390..510 (120px) open!
      {x:420,y:30,w:24,h:320,type:'bookshelfwall'},  // Ends at y:350, leaving y:350..430 open!
      {x:640,y:130,w:24,h:380,type:'bookshelfwall'}, // Top gap y:30..130 (100px) open!
      // Banquet tables (tucked safely along bottom wall)
      {x:280,y:450,w:110,h:32,type:'table'},
      {x:480,y:450,w:110,h:32,type:'table'},
      // Dead End 1 (Restricted archives - tucked in bottom-right corner)
      {x:740,y:450,w:34,h:32,type:'chest'},
      // Dead End 2 (Cartographer study - tucked in top-right corner)
      {x:720,y:50,w:75,h:32,type:'table'},
    ],
    q:"Ton ami semble triste cette semaine. Comment lui proposer ton aide avec bienveillance ?",
    opts:["« Si tu veux, on pourrait en parler ensemble autour d'un chocolat chaud. »",
          '« Tu as l\'obligation stricte de tout me raconter immédiatement. »',
          "« Tu aurais dû me prévenir avant que je ne m'inquiète ! »",
          '« Il faut que tu ignores tes sentiments pour aller mieux. »'],
    ok:0,hint:"Rappel : 'on pourrait' (conditionnel) offre une écoute ouverte sans forcer la personne.",
    fb:"Bravo ! 'On pourrait' permet d'offrir une oreille attentive avec douceur.",
    exits:{
      west:{
        target:'cour',x:780,y:100,
        door:{x:2,y:360,w:32,h:110,dir:'west',arrow:'←'}
      },
      north:{
        target:'donjon',x:100,y:450,
        door:{x:60,y:2,w:120,h:32,dir:'north',arrow:'↑'}
      }
    },
  },
  donjon:{
    id:'donjon',name:'Le Donjon du Bien-Être (Sanctum Final)',theme:"L'équilibre de vie global",
    sL:'#58366d',sD:'#422553',mort:'#291636',wTop:'#351d42',wSide:'#23122e',tint:'rgba(254,240,138,0.15)',
    torches:[{x:100,y:80},{x:760,y:80},{x:100,y:450},{x:760,y:450},{x:330,y:170},{x:530,y:170},{x:330,y:340},{x:530,y:340}],
    obstacles:[
      // Sacred Altar of Serenity (Center destination)
      {x:388,y:228,w:84,h:84,type:'altar'},
      // Inner Sanctum enclosure (East entrance wide open: 192px tall)
      {x:300,y:150,w:24,h:240,type:'stonewall'},
      {x:324,y:150,w:180,h:24,type:'stonewall'},
      {x:324,y:366,w:180,h:24,type:'stonewall'},
      // Outer labyrinth walls (Spacious 140-150px corridors)
      {x:180,y:120,w:24,h:300,type:'stonewall'},
      {x:660,y:120,w:24,h:300,type:'stonewall'},
      {x:204,y:120,w:120,h:24,type:'stonewall'},
      {x:204,y:420,w:456,h:24,type:'stonewall'},
      // Dead End 1 (Crystal Sanctuary - tucked in top-left corner)
      {x:50,y:50,w:34,h:32,type:'chest'},
      {x:95,y:50,w:24,h:50,type:'pillar'},
      // Dead End 2 (Stargazer balcony - tucked in top-right corner)
      {x:745,y:50,w:34,h:32,type:'chest'},
      {x:700,y:50,w:24,h:50,type:'pillar'},
      // Dead End 3 (Crypt vault - tucked in bottom-right corner)
      {x:745,y:450,w:34,h:32,type:'chest'},
      {x:700,y:440,w:24,h:50,type:'pillar'},
    ],
    q:"Complète : « Pour que nous ______ en bonne santé mentale, le repos est tout aussi important que le travail. »",
    opts:['soyons','sommes','serions','serons'],
    ok:0,hint:"Rappel : 'Pour que...' → subjonctif présent avec nous (nous soyons).",
    fb:"Magnifique ! 'Pour que' gouverne le subjonctif ('soyons'). Le Sanctum s'ouvre !",
    isFinal:true,
    exits:{
      south:{
        target:'grande_salle',x:100,y:80,
        door:{x:60,y:506,w:120,h:32,dir:'south',arrow:'↓'}
      }
    },
  },
};

// ── Door hitboxes ──────────────────────────────────────────────────────────────
function getDoorBox(room, dir) {
  if (room && room.exits && room.exits[dir] && room.exits[dir].door) {
    return room.exits[dir].door;
  }
  if (dir==='north') return {x:360,y:2,  w:120,h:32,dir:'north',arrow:'↑'};
  if (dir==='south') return {x:360,y:506,w:120,h:32,dir:'south',arrow:'↓'};
  if (dir==='west')  return {x:2,  y:205,w:32, h:120,dir:'west',arrow:'←'};
  if (dir==='east')  return {x:826,y:205,w:32, h:120,dir:'east',arrow:'→'};
  return {x:0,y:0,w:0,h:0,dir:'',arrow:''};
}

// ── Collision ──────────────────────────────────────────────────────────────────
function hitsObstacle(nx, ny, obstacles) {
  for (const ob of obstacles) {
    const cx = Math.max(ob.x, Math.min(nx, ob.x+ob.w));
    const cy = Math.max(ob.y, Math.min(ny, ob.y+ob.h));
    if (Math.hypot(nx-cx, ny-cy) < PR+2) return true;
  }
  return false;
}

// ── Canvas Drawing Helpers: Handcrafted Pixar-Inspired Claymation / Play-Doh Shader Pipeline ──

// Helper: Stamped / thumb-pressed spiral clay impression
function drawClayThumbprint(ctx, cx, cy, radius, opacity = 0.16) {
  ctx.save();
  ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 1.2})`;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.85, 0.3, Math.PI * 1.45);
  ctx.stroke();

  ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 1.5})`;
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.arc(cx - 0.8, cy - 0.8, radius * 0.52, 0.5, Math.PI * 1.6);
  ctx.stroke();

  ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.9})`;
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.arc(cx + 0.5, cy + 0.5, radius * 0.25, 0.8, Math.PI * 1.8);
  ctx.stroke();
  ctx.restore();
}

// Helper: Subtle uneven seam where two hand-pressed clay slabs meet
function drawClaySlabSeam(ctx, x1, y1, x2, y2) {
  ctx.save();
  // Dark indented groove
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.32)';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  const mx = (x1 + x2) / 2 + ((Math.sin(x1 * 3 + y1 * 5) * 2.5));
  const my = (y1 + y2) / 2 + ((Math.cos(x1 * 5 + y1 * 3) * 2.5));
  ctx.quadraticCurveTo(mx, my, x2, y2);
  ctx.stroke();

  // Adjacent soft highlight ridge (subsurface rim)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x1 + 1.2, y1 - 1.2);
  ctx.quadraticCurveTo(mx + 1.2, my - 1.2, x2 + 1.2, y2 - 1.2);
  ctx.stroke();
  ctx.restore();
}

// ── 1. Adaptive Clay Flooring ───────────────────────────────────────────────────
// Reskins the walking surfaces into individual molded clay flagstones and cobblestones
// that contour around existing maze walls with soft-edged grout indentations.
function drawFloor(ctx, room, obstacles = []) {
  const TW = 52, TH = 40;
  // Deep clay grout bed
  ctx.fillStyle = room.mort;
  ctx.fillRect(0, 0, CW, CH);

  const numRows = Math.ceil(CH / TH) + 1;
  const numCols = Math.ceil(CW / TW) + 2;

  for (let r = -1; r <= numRows; r++) {
    for (let c = -1; c <= numCols; c++) {
      const stagger = (Math.abs(r) % 2) * (TW * 0.5);
      let tx = c * TW + stagger - TW * 0.5;
      let ty = r * TH;

      // Pseudo-random deterministic jitter for organic hand-molded variation
      const h1 = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
      const rnd1 = h1 - Math.floor(h1);
      const h2 = Math.cos(r * 4.898 + c * 33.123) * 23421.631;
      const rnd2 = h2 - Math.floor(h2);

      // Check proximity to nearest maze wall to physically contour flagstones around corridors
      let pushX = 0, pushY = 0;
      for (let i = 0; i < obstacles.length; i++) {
        const ob = obstacles[i];
        if (ob.type.endsWith('wall')) {
          const cx = Math.max(ob.x, Math.min(tx + TW * 0.5, ob.x + ob.w));
          const cy = Math.max(ob.y, Math.min(ty + TH * 0.5, ob.y + ob.h));
          const dist = Math.hypot((tx + TW * 0.5) - cx, (ty + TH * 0.5) - cy);
          if (dist > 0 && dist < 42) {
            const factor = (42 - dist) / 42;
            pushX += (((tx + TW * 0.5) - cx) / dist) * factor * 5;
            pushY += (((ty + TH * 0.5) - cy) / dist) * factor * 4;
          }
        }
      }

      const fx = tx + 3.5 + (rnd1 - 0.5) * 4 + pushX;
      const fy = ty + 3.5 + (rnd2 - 0.5) * 3 + pushY;
      const fw = TW - 7 + (rnd2 - 0.5) * 5;
      const fh = TH - 7 + (rnd1 - 0.5) * 4;

      const isWarm = ((r * 3 + c * 7) % 5) < 3;
      const baseCol = isWarm ? room.sL : room.sD;

      // 1. Soft-edged clay grout indentation (ambient depth)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.roundRect(fx + 1.5, fy + 2, fw, fh, 9);
      ctx.fill();

      // 2. Individual molded clay flagstone body (soft rounded bevel)
      ctx.fillStyle = baseCol;
      ctx.beginPath();
      ctx.roundRect(fx, fy, fw, fh, 8);
      ctx.fill();

      // 3. Subsurface Scattering (SSS) / Pillowy cushion highlight (Pixar studio key light from top-left)
      const sssGrad = ctx.createLinearGradient(fx, fy, fx + fw * 0.55, fy + fh * 0.55);
      sssGrad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
      sssGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.08)');
      sssGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sssGrad;
      ctx.beginPath();
      ctx.roundRect(fx + 1.5, fy + 1.5, fw - 3, fh - 3, 7);
      ctx.fill();

      // 4. Bottom-right soft plasticine bevel shadow
      const bevelShad = ctx.createLinearGradient(fx + fw * 0.45, fy + fh * 0.45, fx + fw, fy + fh);
      bevelShad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      bevelShad.addColorStop(0.8, 'rgba(0, 0, 0, 0.22)');
      bevelShad.addColorStop(1, 'rgba(0, 0, 0, 0.42)');
      ctx.fillStyle = bevelShad;
      ctx.beginPath();
      ctx.roundRect(fx + 1.5, fy + 1.5, fw - 3, fh - 3, 7);
      ctx.fill();

      // 5. Tactile thumbprint impression on selected stones
      if ((r * 5 + c * 11) % 7 === 0) {
        drawClayThumbprint(ctx, fx + fw * 0.52, fy + fh * 0.48, Math.min(fw, fh) * 0.32, 0.14);
      }
    }
  }

  // 6. Ambient Occlusion (AO) contact pass where walls meet the floor
  for (let i = 0; i < obstacles.length; i++) {
    const ob = obstacles[i];
    if (ob.type.endsWith('wall')) {
      const aoPad = 14;
      const aoGrad = ctx.createRadialGradient(
        ob.x + ob.w / 2, ob.y + ob.h / 2, Math.max(ob.w, ob.h) * 0.35,
        ob.x + ob.w / 2, ob.y + ob.h / 2, Math.max(ob.w, ob.h) * 0.55 + aoPad
      );
      aoGrad.addColorStop(0, 'rgba(0, 0, 0, 0.38)');
      aoGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = aoGrad;
      ctx.beginPath();
      ctx.roundRect(ob.x - aoPad, ob.y - aoPad, ob.w + aoPad * 2, ob.h + aoPad * 2, 16);
      ctx.fill();
    }
  }
}

// ── 2. Structural Maze Integration & Props ──────────────────────────────────────
// Reskins walls and obstacles using identical clay material language with rounded bevels,
// thumb-pressed indentations, and subtle uneven seams.
function drawObstacle(ctx, ob) {
  const { x, y, w, h, type } = ob;
  const cx = x + w / 2, cy = y + h / 2;
  ctx.save();

  // Contact ambient occlusion shadow underneath all props
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(cx + 2, y + h - Math.min(8, h * 0.15), Math.max(10, w * 0.52), Math.max(4, h * 0.24), 0, 0, Math.PI * 2);
  ctx.fill();

  switch(type) {
    // ── Structural Maze Walls: Thick tactile plasticine slabs matching exact collision
    case 'stonewall': {
      // 1. Base clay slab mass with ambient depth
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(x - 2, y - 2, w + 4, h + 4, 10);
      ctx.fill();

      // 2. Thick hand-sculpted slate plasticine body
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 8);
      ctx.fill();

      // 3. Top-cap clay bevel with Subsurface Scattering (warm studio key light)
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.roundRect(x + 2, y + 2, Math.max(2, w - 4), Math.max(2, h - 4), 6);
      ctx.fill();

      // 4. Pillowy SSS highlight along top-left edge
      const sssH = ctx.createLinearGradient(x, y, x + w * 0.45, y + h * 0.45);
      sssH.addColorStop(0, 'rgba(255, 255, 255, 0.38)');
      sssH.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)');
      sssH.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sssH;
      ctx.beginPath();
      ctx.roundRect(x + 2, y + 2, Math.max(2, w - 4), Math.max(2, h - 4), 6);
      ctx.fill();

      // 5. Uneven seams where modeling clay slabs were joined together
      if (w > h) {
        for (let bx = x + 36; bx < x + w - 14; bx += 38) {
          drawClaySlabSeam(ctx, bx, y + 2, bx + (Math.sin(bx) * 2), y + h - 2);
        }
      } else {
        for (let by = y + 36; by < y + h - 14; by += 38) {
          drawClaySlabSeam(ctx, x + 2, by, x + w - 2, by + (Math.cos(by) * 2));
        }
      }

      // 6. Thumbprint impressions pressed into the clay wall surfaces
      const thumbDist = Math.max(26, Math.min(w, h));
      if (w > h) {
        for (let tx = x + 18; tx < x + w - 10; tx += 48) {
          drawClayThumbprint(ctx, tx, cy, 6.5, 0.16);
        }
      } else {
        for (let ty = y + 18; ty < y + h - 10; ty += 48) {
          drawClayThumbprint(ctx, cx, ty, 6.5, 0.16);
        }
      }
      break;
    }

    case 'hedgewall': {
      // Sculpted pliable evergreen modeling clay with thumb dimples & berries
      ctx.fillStyle = '#0f2411';
      ctx.beginPath();
      ctx.roundRect(x - 2, y - 2, w + 4, h + 4, 12);
      ctx.fill();

      ctx.fillStyle = '#1b3819';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 10);
      ctx.fill();

      ctx.fillStyle = '#2d5a27';
      ctx.beginPath();
      ctx.roundRect(x + 2, y + 2, Math.max(2, w - 4), Math.max(2, h - 4), 8);
      ctx.fill();

      // Pillowy plasticine highlight
      const hgGrad = ctx.createLinearGradient(x, y, x + (w > h ? 0 : w), y + (w > h ? h : 0));
      hgGrad.addColorStop(0, '#4ade80');
      hgGrad.addColorStop(0.4, '#22c55e');
      hgGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');
      ctx.fillStyle = hgGrad;
      if (w > h) {
        ctx.beginPath();
        ctx.roundRect(x + 3, y + 2, w - 6, Math.min(8, h * 0.4), 5);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 3, Math.min(8, w * 0.4), h - 6, 5);
        ctx.fill();
      }

      // Thumb impressions along the hedge
      const tStep = Math.min(36, Math.max(20, Math.min(w, h)));
      for (let lx = x + 10; lx < x + w - 6; lx += tStep) {
        for (let ly = y + 10; ly < y + h - 6; ly += tStep) {
          drawClayThumbprint(ctx, lx, ly, 6, 0.18);
        }
      }

      // Tiny hand-rolled yellow & coral Play-Doh berries
      const bCols = ['#fbbf24', '#f87171', '#f59e0b', '#ec4899'];
      let bIdx = 0;
      for (let bx = x + 12; bx < x + w - 8; bx += Math.max(26, tStep * 1.4)) {
        for (let by = y + 10; by < y + h - 6; by += Math.max(26, tStep * 1.4)) {
          ctx.fillStyle = bCols[bIdx++ % bCols.length];
          ctx.beginPath();
          ctx.arc(bx, by, 3.0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(bx - 0.8, by - 0.8, 1.0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }

    case 'bookshelfwall': {
      // Thick mahogany clay bookcase partitions with colorful hand-rolled Play-Doh books
      ctx.fillStyle = '#270e03';
      ctx.beginPath();
      ctx.roundRect(x - 2, y - 2, w + 4, h + 4, 8);
      ctx.fill();

      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 6);
      ctx.fill();

      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.roundRect(x + 2, y + 2, Math.max(2, w - 4), Math.max(2, h - 4), 5);
      ctx.fill();

      const bookCols = ['#dc2626', '#2563eb', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#ea580c'];
      if (w > h) {
        // Shelf dividers
        ctx.fillStyle = '#92400e';
        ctx.fillRect(x + 2, y + h * 0.48, w - 4, 3);
        let bi = 0;
        for (let bx = x + 4; bx < x + w - 9; bx += 8) {
          const col = bookCols[bi++ % bookCols.length];
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.roundRect(bx, y + 3, 6, Math.max(4, h * 0.40), 2);
          ctx.fill();
          ctx.beginPath();
          ctx.roundRect(bx, y + h * 0.54, 6, Math.max(4, h * 0.38), 2);
          ctx.fill();
          // Comb tool book spine grooves
          ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
          ctx.fillRect(bx + 1, y + 4, 1.5, Math.max(3, h * 0.36));
        }
      } else {
        const shH = 28;
        let bi = 0;
        for (let sy = y + 4; sy < y + h - shH; sy += shH) {
          ctx.fillStyle = '#92400e';
          ctx.fillRect(x + 2, sy + shH - 3, w - 4, 3);
          for (let bx = x + 3; bx < x + w - 7; bx += 6) {
            const col = bookCols[bi++ % bookCols.length];
            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.roundRect(bx, sy + 3, 5, shH - 7, 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.fillRect(bx + 1, sy + 4, 1.2, shH - 9);
          }
        }
      }
      break;
    }

    case 'parapet': {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath(); ctx.roundRect(x - 1, y - 1, w + 2, h + 2, 7); ctx.fill();
      ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 6); ctx.fill();
      ctx.fillStyle = '#475569';
      ctx.beginPath(); ctx.roundRect(x + 2, y + 2, Math.max(1, w - 4), Math.max(1, h - 4), 5); ctx.fill();
      ctx.fillStyle = '#1e293b';
      if (w > h) {
        for (let pcx = x + 8; pcx < x + w - 12; pcx += 22) {
          ctx.beginPath(); ctx.roundRect(pcx, y, 10, Math.min(6, h * 0.4), 3); ctx.fill();
        }
      } else {
        for (let pcy = y + 8; pcy < y + h - 12; pcy += 22) {
          ctx.beginPath(); ctx.roundRect(x, pcy, Math.min(6, w * 0.4), 10, 3); ctx.fill();
        }
      }
      break;
    }

    // ── Obstacles & Props: Boulders, Traps, Chests, Logs, Altars ─────────────────
    case 'rock': {
      // Mottled hand-rolled sphere of gray modeling clay with thumb indents
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.48, h * 0.48, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Hand-pressed clay shading with Subsurface Scattering
      const rockSSS = ctx.createRadialGradient(cx - w * 0.15, cy - h * 0.18, 2, cx, cy, w * 0.48);
      rockSSS.addColorStop(0, '#94a3b8');
      rockSSS.addColorStop(0.4, '#64748b');
      rockSSS.addColorStop(1, '#334155');
      ctx.fillStyle = rockSSS;
      ctx.beginPath();
      ctx.ellipse(cx, cy, w * 0.45, h * 0.45, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Mottled mossy clay fleck
      ctx.fillStyle = '#4d7c0f';
      ctx.beginPath();
      ctx.ellipse(cx - w * 0.12, cy - h * 0.1, w * 0.26, h * 0.22, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Authentic thumbprint impression pressed into the boulder
      drawClayThumbprint(ctx, cx + w * 0.1, cy + h * 0.08, w * 0.22, 0.22);

      // Pillowy plasticine specular shine (Pixar key light)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
      ctx.beginPath();
      ctx.arc(cx - w * 0.15, cy - h * 0.2, Math.max(2, w * 0.14), 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'trap':
    case 'spikes': {
      // Stubby molded clay cones with rounded tips & concentric clay base rings
      const numCones = Math.max(1, Math.floor(w / 16));
      const coneW = w / numCones;
      for (let i = 0; i < numCones; i++) {
        const kx = x + i * coneW + coneW / 2;
        const ky = y + h * 0.85;
        // Clay base ring
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.ellipse(kx, ky, coneW * 0.42, h * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Molded cone body
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(kx - coneW * 0.35, ky);
        ctx.quadraticCurveTo(kx - coneW * 0.1, y + h * 0.15, kx, y + h * 0.12);
        ctx.quadraticCurveTo(kx + coneW * 0.1, y + h * 0.15, kx + coneW * 0.35, ky);
        ctx.closePath();
        ctx.fill();

        // Rounded pliable tip
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(kx, y + h * 0.16, coneW * 0.15, 0, Math.PI * 2);
        ctx.fill();

        // Specular highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(kx - 1, y + h * 0.22, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'chest': {
      // Soft-edged clay block with comb-tool woodgrain lines and stamped metallic gold clasp
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.roundRect(x, y + h * 0.22, w, h * 0.78, 6);
      ctx.fill();

      // Rounded clay chest lid
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.roundRect(x + 1, y, w - 2, h * 0.48, 7);
      ctx.fill();

      // Comb-tool woodgrain lines
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + h * 0.24);
      ctx.lineTo(x + w - 4, y + h * 0.24);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 4, y + h * 0.65);
      ctx.lineTo(x + w - 4, y + h * 0.65);
      ctx.stroke();

      // Stamped metallic gold clay reinforcement straps
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.roundRect(x + 4, y + 2, 4.5, h - 4, 2); ctx.fill();
      ctx.beginPath(); ctx.roundRect(x + w - 8.5, y + 2, 4.5, h - 4, 2); ctx.fill();

      // Stamped gold clasp with keyhole
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx, y + h * 0.48, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(cx, y + h * 0.48, 2, 0, Math.PI * 2);
      ctx.fill();

      // Soft pillowy studio highlight on top of lid
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.roundRect(x + 3, y + 2, w - 6, 3, 1.5);
      ctx.fill();
      break;
    }

    case 'log': {
      // Hand-rolled brown clay cylinder with combed grain and spiral growth rings
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.roundRect(x, y + h * 0.15, w, h * 0.70, 8);
      ctx.fill();

      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.roundRect(x + 2, y + h * 0.18, w - 4, h * 0.64, 7);
      ctx.fill();

      // Combed bark grooves
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.6;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x + 16, y + h * 0.2 + i * (h * 0.58 / 4));
        ctx.lineTo(x + w - 16, y + h * 0.2 + i * (h * 0.58 / 4));
        ctx.stroke();
      }

      // Spiral growth rings stamped into the cut clay ends
      ctx.fillStyle = '#b45309';
      ctx.beginPath(); ctx.ellipse(x + 8, cy, 6, h * 0.28, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x + w - 8, cy, 6, h * 0.28, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.ellipse(x + 8, cy, 3, h * 0.15, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x + w - 8, cy, 3, h * 0.15, 0, 0, Math.PI * 2); ctx.stroke();
      break;
    }

    case 'pillar': {
      // Hand-rolled cylindrical clay column with donut rings
      ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.roundRect(x + 1, y + 4, w - 2, h - 8, 6); ctx.fill();
      ctx.fillStyle = '#64748b';
      ctx.beginPath(); ctx.roundRect(x + 2, y + 5, w - 4, h - 10, 5); ctx.fill();

      // Rounded clay base & capital rings
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath(); ctx.roundRect(x - 2, y, w + 4, 9, 4); ctx.fill();
      ctx.beginPath(); ctx.roundRect(x - 2, y + h - 9, w + 4, 9, 4); ctx.fill();

      // Plasticine cylindrical SSS highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.fillRect(x + 4, y + 7, Math.max(3, w * 0.25), h - 14);
      break;
    }

    case 'fountain': {
      // Multi-tiered sculpted clay basin in cobalt slate with swirling turquoise clay water
      ctx.fillStyle = '#1e293b';
      ctx.beginPath(); ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.ellipse(cx, cy, w / 2 - 3, h / 2 - 3, 0, 0, Math.PI * 2); ctx.fill();

      // Swirling glossy turquoise clay water with white studio reflection
      ctx.fillStyle = '#0284c7';
      ctx.beginPath(); ctx.ellipse(cx, cy, w / 2 - 10, h / 2 - 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.ellipse(cx - 6, cy - 5, w * 0.26, h * 0.22, -0.4, 0, Math.PI * 2); ctx.fill();

      // Center bouncing clay droplet with Pixar studio shine
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath(); ctx.arc(cx, cy - 4, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(cx - 2, cy - 6, 2.5, 0, Math.PI * 2); ctx.fill();
      break;
    }

    case 'altar': {
      // Sacred stepped royal plum clay dais with glowing amber crystal
      ctx.fillStyle = '#2e1065';
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 14); ctx.fill();
      ctx.fillStyle = '#581c87';
      ctx.beginPath(); ctx.roundRect(x + 3, y + 3, w - 6, h - 6, 10); ctx.fill();
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath(); ctx.roundRect(x + 7, y + 7, w - 14, h - 14, 8); ctx.fill();

      // Golden mystical clay rune ring
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.32, 0, Math.PI * 2);
      ctx.stroke();

      // Glowing amber sacred crystal with warm SSS pulse
      const ag = ctx.createRadialGradient(cx, cy, 3, cx, cy, w * 0.44);
      ag.addColorStop(0, '#fef08a');
      ag.addColorStop(0.35, 'rgba(245, 158, 11, 0.85)');
      ag.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = ag;
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.44, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'forge': {
      ctx.fillStyle = '#431407'; ctx.beginPath(); ctx.roundRect(x - 2, y - 2, w + 4, h + 4, 12); ctx.fill();
      ctx.fillStyle = '#7c2d12'; ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fill();
      const fg = ctx.createRadialGradient(cx, cy + 4, 3, cx, cy + 4, w * 0.38);
      fg.addColorStop(0, '#fef08a');
      fg.addColorStop(0.35, '#f97316');
      fg.addColorStop(0.7, '#ea580c');
      fg.addColorStop(1, 'rgba(124, 45, 18, 0)');
      ctx.fillStyle = fg;
      ctx.beginPath(); ctx.ellipse(cx, cy + 4, w * 0.38, h * 0.34, 0, 0, Math.PI * 2); ctx.fill();
      // Miniature gray clay anvil
      ctx.fillStyle = '#64748b'; ctx.beginPath(); ctx.roundRect(cx - 14, y - 10, 28, 14, 4); ctx.fill();
      break;
    }

    case 'barrel': {
      const bw = Math.min(w, 36), bh = Math.min(h, 44);
      ctx.fillStyle = '#451a03';
      ctx.beginPath(); ctx.roundRect(x + (w - bw) / 2, y + (h - bh) / 2, bw, bh, bw / 3); ctx.fill();
      ctx.fillStyle = '#92400e';
      ctx.beginPath(); ctx.roundRect(x + (w - bw) / 2 + 1, y + (h - bh) / 2 + 1, bw - 2, bh - 2, bw / 3); ctx.fill();
      ctx.strokeStyle = '#270e03'; ctx.lineWidth = 2.5;
      for (let i = 1; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(x + (w - bw) / 2, y + (h - bh) / 2 + i * (bh / 3));
        ctx.lineTo(x + (w - bw) / 2 + bw, y + (h - bh) / 2 + i * (bh / 3));
        ctx.stroke();
      }
      break;
    }

    case 'table': {
      ctx.fillStyle = '#451a03'; ctx.beginPath(); ctx.roundRect(x, y, w, h, 7); ctx.fill();
      ctx.fillStyle = '#78350f'; ctx.beginPath(); ctx.roundRect(x + 2, y + 2, w - 4, h - 4, 6); ctx.fill();
      ctx.fillStyle = '#92400e'; ctx.beginPath(); ctx.roundRect(x + 3, y + 3, w - 6, h * 0.42, 4); ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.beginPath(); ctx.roundRect(x + 5, y + 4, w - 10, 3, 1.5); ctx.fill();
      break;
    }

    case 'rack': {
      ctx.fillStyle = '#451a03'; ctx.beginPath(); ctx.roundRect(x, y, w, h, 4); ctx.fill();
      ctx.fillStyle = '#94a3b8';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x + 3 + i * ((w - 6) / 2), y + 4, 2, h - 8);
      }
      break;
    }

    default: {
      ctx.fillStyle = '#475569';
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 6); ctx.fill();
      break;
    }
  }
  ctx.restore();
}

// ── 3. Stylized Claymation Knight Character Model ──────────────────────────────
// Remaps player to a charming Pixar clay knight preserving exact collision box (PR=14)
// and origin point (pl.x, pl.y), with stop-motion bob, bouncy plume, and lantern SSS.
function drawKnight(ctx, pl) {
  const { x: px, y: py, wc, mv, face: f } = pl;

  // Stop-motion claymation stepping quantization (12fps feel)
  const stepFrame = Math.floor(wc * 2.5) % 4;
  const clayBob = mv ? (stepFrame % 2 === 0 ? 3.5 : 0) : Math.sin(Date.now() * 0.003) * 0.8;
  const cy = py - clayBob;
  const legSwing = mv ? (stepFrame === 0 ? 5 : stepFrame === 2 ? -5 : 0) : 0;

  // 1. Ambient Occlusion (soft contact shadow puddle on the clay flagstones)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
  ctx.beginPath();
  ctx.ellipse(px, py + 18, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Chunky molded clay boots & legs
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.roundRect(px - 8 + legSwing, cy + 7, 7, 13, 3); ctx.fill();
  ctx.beginPath(); ctx.roundRect(px + 1 - legSwing, cy + 7, 7, 13, 3); ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.ellipse(px - 5 + legSwing, cy + 19, 5.5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(px + 4 - legSwing, cy + 19, 5.5, 3.5, 0, 0, Math.PI * 2); ctx.fill();

  // 3. Pliable Play-Doh royal blue tunic
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath(); ctx.roundRect(px - 10, cy - 11, 20, 21, 6); ctx.fill();
  ctx.fillStyle = '#2563eb';
  ctx.beginPath(); ctx.roundRect(px - 9, cy - 10, 18, 19, 5); ctx.fill();

  // Subsurface scattering gradient on tunic (warm light penetration)
  const tunicSSS = ctx.createLinearGradient(px - 8, cy - 10, px + 8, cy + 8);
  tunicSSS.addColorStop(0, 'rgba(96, 165, 250, 0.45)');
  tunicSSS.addColorStop(0.6, 'rgba(37, 99, 235, 0.1)');
  tunicSSS.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
  ctx.fillStyle = tunicSSS;
  ctx.beginPath(); ctx.roundRect(px - 9, cy - 10, 18, 19, 5); ctx.fill();

  // 4. Gold clay belt & chest emblem
  ctx.fillStyle = '#78350f';
  ctx.fillRect(px - 8, cy + 5, 16, 2.5);
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.arc(px, cy - 2, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(px - 2.5, cy + 4, 5, 4.5);
  ctx.fillStyle = '#451a03';
  ctx.fillRect(px - 1, cy + 5.5, 2, 2);

  // 5. Stamped plasticine shield (crimson with beveled yellow clay star)
  const shX = px - f * 14;
  ctx.fillStyle = '#7f1d1d';
  ctx.beginPath(); ctx.ellipse(shX, cy - 1, 7, 9.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#dc2626';
  ctx.beginPath(); ctx.ellipse(shX, cy - 2, 6, 8, 0, 0, Math.PI * 2); ctx.fill();
  // Beveled yellow clay star
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.arc(shX, cy - 2, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.beginPath(); ctx.arc(shX - 0.8, cy - 2.8, 1.2, 0, Math.PI * 2); ctx.fill();

  // 6. Smooth rounded clay helmet & visor
  const hx = px, hy = cy - 19;
  ctx.fillStyle = '#334155';
  ctx.beginPath(); ctx.arc(hx, hy, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#64748b';
  ctx.beginPath(); ctx.arc(hx - 0.8, hy - 0.8, 8, 0, Math.PI * 2); ctx.fill();

  // Specular sheen on helmet
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath(); ctx.arc(hx - 2.5, hy - 3.5, 2.8, 0, Math.PI * 2); ctx.fill();

  // Play-Doh face cutout with cute shiny clay bead eyes
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath(); ctx.ellipse(hx + f * 2.2, hy + 2, 4.8, 3.8, 0, 0, Math.PI * 2); ctx.fill();

  // Two tiny glossy black clay eyes with white highlight
  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.arc(hx + f * 2.2 - 1.6, hy + 1.6, 1.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(hx + f * 2.2 + 1.6, hy + 1.6, 1.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(hx + f * 2.2 - 1.9, hy + 1.3, 0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(hx + f * 2.2 + 1.3, hy + 1.3, 0.5, 0, Math.PI * 2); ctx.fill();

  // Cute blushing cheeks
  ctx.fillStyle = 'rgba(244, 63, 94, 0.55)';
  ctx.beginPath(); ctx.arc(hx + f * 2.2 - 2.6, hy + 3.2, 1.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(hx + f * 2.2 + 2.6, hy + 3.2, 1.3, 0, Math.PI * 2); ctx.fill();

  // 7. Tiny hand-rolled clay feather plume with spring bounce physics
  const plumeAngle = mv ? Math.sin(wc * 2.2) * 4 : Math.sin(Date.now() * 0.004) * 1.5;
  ctx.save();
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.moveTo(hx, hy - 8);
  ctx.quadraticCurveTo(hx + plumeAngle * 1.8 + 6, hy - 21, hx + plumeAngle * 2.5 + 11, hy - 17);
  ctx.quadraticCurveTo(hx + plumeAngle + 4, hy - 10, hx, hy - 7);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(hx, hy - 8);
  ctx.quadraticCurveTo(hx + plumeAngle * 1.5 + 5, hy - 19, hx + plumeAngle * 2.2 + 9, hy - 16);
  ctx.quadraticCurveTo(hx + plumeAngle * 0.8 + 3, hy - 10, hx, hy - 7);
  ctx.closePath();
  ctx.fill();

  // Plume ridges (combed tool lines)
  ctx.strokeStyle = '#fca5a5';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(hx + 2, hy - 10);
  ctx.lineTo(hx + plumeAngle * 1.5 + 7, hy - 16);
  ctx.stroke();
  ctx.restore();

  // 8. Molded brass clay lantern casting warm Subsurface Scattering bounce light
  const lx = px + f * 15, ly = cy + 1;
  ctx.fillStyle = '#451a03';
  ctx.beginPath(); ctx.roundRect(lx - 4, ly + 2, 8, 12, 3); ctx.fill();
  ctx.fillStyle = '#78350f';
  ctx.beginPath(); ctx.roundRect(lx - 3, ly + 3, 6, 10, 2); ctx.fill();

  // Translucent glowing teardrop amber flame
  ctx.fillStyle = '#fef08a';
  ctx.beginPath(); ctx.ellipse(lx, ly + 7, 3, 4.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f97316';
  ctx.beginPath(); ctx.arc(lx, ly + 8, 2, 0, Math.PI * 2); ctx.fill();

  // Warm studio bounce light from lantern
  const lg = ctx.createRadialGradient(lx, ly + 7, 2, lx, ly + 7, 38);
  lg.addColorStop(0, 'rgba(251, 191, 36, 0.55)');
  lg.addColorStop(0.45, 'rgba(249, 115, 22, 0.18)');
  lg.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = lg;
  ctx.beginPath(); ctx.arc(lx, ly + 7, 38, 0, Math.PI * 2); ctx.fill();
}

// ── React Component ────────────────────────────────────────────────────────────
export default function CitadelleBienEtre({ onBack }) {
  const canvasRef   = useRef(null);
  const keysRef     = useRef({});
  const playerRef   = useRef({ x:90, y:270, spd:3.5, wc:0, mv:false, face:1, flicker:0 });
  const roomIdRef   = useRef('foret');
  const clearedRef  = useRef({});          // { [id]: true }
  const pausedRef   = useRef(false);
  const tgtRef      = useRef(null);        // pending transition
  const encActiveRef= useRef(false);       // guard: don't re-trigger encounter
  const bgImagesRef = useRef({});
  const knightCanvasRef = useRef(null);

  const motesRef    = useRef(
    Array.from({length:40}, ()=>({
      x:Math.random()*CW, y:Math.random()*CH,
      dx:(Math.random()-.5)*.5, dy:(Math.random()-.5)*.5,
      r:Math.random()*1.6+.5,
    }))
  );

  // Preload Diorama Backgrounds & Process Pixar Knight Sprite with clean transparency
  useEffect(() => {
    // 1. Room Backgrounds
    Object.entries(ROOM_BACKGROUNDS).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => { bgImagesRef.current[key] = img; };
    });

    // 2. Knight Sprite
    const kImg = new Image();
    kImg.src = KNIGHT_SPRITE_SRC;
    kImg.onload = () => {
      try {
        const offCanvas = document.createElement('canvas');
        const w = kImg.naturalWidth || kImg.width;
        const h = kImg.naturalHeight || kImg.height;
        offCanvas.width = w;
        offCanvas.height = h;
        const offCtx = offCanvas.getContext('2d');
        offCtx.drawImage(kImg, 0, 0);
        const imgData = offCtx.getImageData(0, 0, w, h);
        const d = imgData.data;

        // BFS flood-fill from 4 outer edges to remove studio white backdrop
        const visited = new Uint8Array(w * h);
        const queue = [];
        const isWhiteBg = (x, y) => {
          const idx = (y * w + x) * 4;
          return d[idx] > 218 && d[idx + 1] > 218 && d[idx + 2] > 218;
        };

        for (let x = 0; x < w; x++) {
          if (isWhiteBg(x, 0)) { queue.push(x, 0); visited[x] = 1; }
          if (isWhiteBg(x, h - 1)) { queue.push(x, h - 1); visited[(h - 1) * w + x] = 1; }
        }
        for (let y = 0; y < h; y++) {
          if (isWhiteBg(0, y) && !visited[y * w]) { queue.push(0, y); visited[y * w] = 1; }
          if (isWhiteBg(w - 1, y) && !visited[y * w + w - 1]) { queue.push(w - 1, y); visited[y * w + w - 1] = 1; }
        }

        let head = 0;
        while (head < queue.length) {
          const cx = queue[head++];
          const cy = queue[head++];
          const pIdx = (cy * w + cx) * 4;
          d[pIdx + 3] = 0;

          const neighbors = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
          for (let i = 0; i < 4; i++) {
            const nx = neighbors[i][0], ny = neighbors[i][1];
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const nIdx = ny * w + nx;
              if (!visited[nIdx] && isWhiteBg(nx, ny)) {
                visited[nIdx] = 1;
                queue.push(nx, ny);
              }
            }
          }
        }

        // Soft edge antialiasing pass
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = (y * w + x) * 4;
            if (d[idx + 3] > 0) {
              const hasZero = (
                d[((y - 1) * w + x) * 4 + 3] === 0 ||
                d[((y + 1) * w + x) * 4 + 3] === 0 ||
                d[(y * w + x - 1) * 4 + 3] === 0 ||
                d[(y * w + x + 1) * 4 + 3] === 0
              );
              if (hasZero) {
                const avg = (d[idx] + d[idx + 1] + d[idx + 2]) / 3;
                if (avg > 195) {
                  d[idx + 3] = Math.max(0, Math.min(255, (255 - avg) * 4));
                }
              }
            }
          }
        }

        offCtx.putImageData(imgData, 0, 0);
        knightCanvasRef.current = offCanvas;
      } catch (err) {
        console.warn('Offscreen sprite generation fallback', err);
      }
    };
  }, []);

  // UI state
  const [hudName,    setHudName]    = useState(ROOMS.foret.name);
  const [hudProg,    setHudProg]    = useState('Salles : 0 / 6');
  const [encounter,  setEncounter]  = useState(null);  // null | roomId string
  const [victory,    setVictory]    = useState(false);
  const [selIdx,     setSelIdx]     = useState(null);
  const [feedback,   setFeedback]   = useState(null);  // null | { ok, msg }
  const [cardShake,  setCardShake]  = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  // Fade tutorial after 5s
  useEffect(() => {
    const t = setTimeout(() => setShowTutorial(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // ── Keyboard ─────────────────────────────────────────────────────────────────
  // Direct listeners on window — no iframe, always works
  useEffect(() => {
    const onDown = (e) => {
      const k = e.key.toLowerCase();
      if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))
        e.preventDefault();
      keysRef.current[k] = true;
    };
    const onUp = (e) => { keysRef.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', onDown, { passive: false });
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  // ── HUD refresh ──────────────────────────────────────────────────────────────
  const refreshHud = useCallback((rid) => {
    const room = ROOMS[rid];
    setHudName(room.name);
    const n = Object.keys(clearedRef.current).length;
    setHudProg(`Salles : ${n} / 6`);
  }, []);

  // ── Room transition ───────────────────────────────────────────────────────────
  const goTo = useCallback((id, sx, sy) => {
    roomIdRef.current = id;
    playerRef.current.x = sx;
    playerRef.current.y = sy;
    encActiveRef.current = false;
    refreshHud(id);
  }, [refreshHud]);

  // ── Modal handlers ────────────────────────────────────────────────────────────
  const openEncounter = useCallback((roomId) => {
    pausedRef.current = true;
    encActiveRef.current = true;
    setSelIdx(null);
    setFeedback(null);
    setCardShake(false);
    setEncounter(roomId);
  }, []);

  const handleSelect = useCallback((i) => {
    setSelIdx(i);
    setFeedback(null);
  }, []);

  const handleValidate = useCallback(() => {
    if (selIdx === null) return;
    const room = ROOMS[encounter];
    if (selIdx === room.ok) {
      clearedRef.current[encounter] = true;
      setFeedback({ ok: true, msg: '✨ ' + room.fb });
    } else {
      setCardShake(true);
      setTimeout(() => setCardShake(false), 400);
      setFeedback({ ok: false, msg: '⚠️ Ce n\'est pas tout à fait cela. ' + room.hint });
    }
  }, [selIdx, encounter]);

  const handleAdvance = useCallback(() => {
    const room = ROOMS[encounter];
    setEncounter(null);
    pausedRef.current = false;
    encActiveRef.current = false;
    refreshHud(roomIdRef.current);
    if (room.isFinal) {
      setVictory(true);
    } else if (tgtRef.current) {
      goTo(tgtRef.current.target, tgtRef.current.x, tgtRef.current.y);
      tgtRef.current = null;
    }
  }, [encounter, goTo, refreshHud]);

  const handleReset = useCallback(() => {
    clearedRef.current = {};
    roomIdRef.current = 'foret';
    playerRef.current = { x:90, y:270, spd:3.5, wc:0, mv:false, face:1, flicker:0 };
    tgtRef.current = null;
    encActiveRef.current = false;
    pausedRef.current = false;
    setVictory(false);
    setEncounter(null);
    setSelIdx(null);
    setFeedback(null);
    refreshHud('foret');
  }, [refreshHud]);

  // ── Game loop ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId;

    function step() {
      if (pausedRef.current) return;
      const pl   = playerRef.current;
      const rid  = roomIdRef.current;
      const room = ROOMS[rid];
      const keys = keysRef.current;
      let dx=0, dy=0;
      if (keys['arrowup']   ||keys['w']||keys['z']) dy-=1;
      if (keys['arrowdown'] ||keys['s'])             dy+=1;
      if (keys['arrowleft'] ||keys['a']||keys['q'])  dx-=1;
      if (keys['arrowright']||keys['d'])             dx+=1;
      pl.mv = dx!==0 || dy!==0;
      if (pl.mv) {
        if (dx!==0) pl.face = dx>0?1:-1;
        pl.wc += .22;
        const n = Math.hypot(dx,dy);
        const nx = pl.x+(dx/n)*pl.spd;
        const ny = pl.y+(dy/n)*pl.spd;
        if      (!hitsObstacle(nx,ny,room.obstacles)) { pl.x=nx; pl.y=ny; }
        else if (!hitsObstacle(nx,pl.y,room.obstacles)) { pl.x=nx; }
        else if (!hitsObstacle(pl.x,ny,room.obstacles)) { pl.y=ny; }
      }
      pl.x = Math.max(30, Math.min(830, pl.x));
      pl.y = Math.max(30, Math.min(510, pl.y));
      pl.flicker = Math.sin(Date.now()*.007)*4 + Math.cos(Date.now()*.013)*2;
      motesRef.current.forEach(m=>{ m.x=(m.x+m.dx+CW)%CW; m.y=(m.y+m.dy+CH)%CH; });

      // Door detection
      for (const [dir, ex] of Object.entries(room.exits)) {
        const b = getDoorBox(room, dir);
        if (pl.x>b.x && pl.x<b.x+b.w && pl.y>b.y && pl.y<b.y+b.h) {
          if (!clearedRef.current[rid] && !encActiveRef.current) {
            tgtRef.current = ex;
            openEncounter(rid);
          } else if (clearedRef.current[rid]) {
            goTo(ex.target, ex.x, ex.y);
          }
          break;
        }
      }

      // Donjon Sacred Altar encounter trigger
      if (rid === 'donjon' && !clearedRef.current['donjon'] && !encActiveRef.current) {
        const altarOb = room.obstacles.find(o => o.type === 'altar');
        if (altarOb) {
          const acx = altarOb.x + altarOb.w / 2;
          const acy = altarOb.y + altarOb.h / 2;
          if (Math.hypot(pl.x - acx, pl.y - acy) < 70) {
            openEncounter('donjon');
          }
        }
      }
    }

    function draw() {
      const pl   = playerRef.current;
      const rid  = roomIdRef.current;
      const room = ROOMS[rid];
      const now  = Date.now();

      // 1. Render Pre-rendered Handcrafted Diorama Backdrop
      const bgImg = bgImagesRef.current[rid];
      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, 0, 0, CW, CH);
      } else {
        // Fallback procedural adaptive floor and walls while image loads
        drawFloor(ctx, room, room.obstacles);
        room.obstacles.forEach(ob => drawObstacle(ctx, ob));
      }

      // 2. Interactive Portal Archways & Magical Shimmer
      const dArrow = { north: '↑', south: '↓', west: '←', east: '→' };
      const isCleared = !!clearedRef.current[rid];
      for (const [dir] of Object.entries(room.exits)) {
        const b = getDoorBox(room, dir);
        const pulse = Math.sin(now * 0.005) * 0.25 + 0.75;
        const bx2 = b.x + b.w / 2, by2 = b.y + b.h / 2;

        ctx.save();
        // Swirling magical halo
        const g = ctx.createRadialGradient(bx2, by2, 4, bx2, by2, 58);
        g.addColorStop(0, isCleared ? 'rgba(52, 211, 153, 0.82)' : 'rgba(251, 191, 36, 0.78)');
        g.addColorStop(0.45, isCleared ? 'rgba(16, 185, 129, 0.40)' : 'rgba(245, 158, 11, 0.35)');
        g.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(bx2, by2, 58, 0, Math.PI * 2);
        ctx.fill();

        // Molded portal ring
        ctx.strokeStyle = isCleared ? '#34d399' : '#f59e0b';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.ellipse(bx2, by2, b.w * 0.45, b.h * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Inner glowing core
        ctx.fillStyle = isCleared ? `rgba(16, 185, 129, ${0.40 * pulse + 0.2})` : `rgba(245, 158, 11, ${0.38 * pulse + 0.18})`;
        ctx.beginPath();
        ctx.ellipse(bx2, by2, b.w * 0.40, b.h * 0.40, 0, 0, Math.PI * 2);
        ctx.fill();

        // Direction rune arrow
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Inter, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(b.arrow || dArrow[dir] || '✦', bx2, by2);
        ctx.restore();
      }

      // 3. Relic (Sacred crystal on altar in Donjon)
      if (room.isFinal) {
        const p = Math.sin(now * 0.005) * 4;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.roundRect(408 - p / 2, 242 - p / 2, 44 + p, 44 + p, 8); ctx.fill();
        ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('✦', 430, 264);
        ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      }

      // 4. Knight Character Model: Pixar Clay Sprite Cutout
      const kSprite = knightCanvasRef.current;
      const bob = pl.mv ? (Math.floor(pl.wc * 2.5) % 2 === 0 ? 3.5 : 0) : Math.sin(now * 0.003) * 1;
      const cy = pl.y - bob;

      // Contact shadow puddle on ground
      ctx.fillStyle = 'rgba(0, 0, 0, 0.44)';
      ctx.beginPath();
      ctx.ellipse(pl.x, pl.y + 16, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Warm amber lantern light pool around knight
      const lg = ctx.createRadialGradient(pl.x + pl.face * 16, cy + 2, 3, pl.x + pl.face * 16, cy + 2, 72);
      lg.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      lg.addColorStop(0.45, 'rgba(245, 158, 11, 0.15)');
      lg.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.arc(pl.x + pl.face * 16, cy + 2, 72, 0, Math.PI * 2);
      ctx.fill();

      if (kSprite) {
        ctx.save();
        ctx.translate(pl.x, cy);
        if (pl.face === -1) {
          ctx.scale(-1, 1);
        }
        // Draw the charming clay knight (width 54px, height 62px)
        ctx.drawImage(kSprite, -27, -50, 54, 62);
        ctx.restore();
      } else {
        // Fallback procedural knight while image loads
        drawKnight(ctx, pl);
      }

      // 5. Proximity prompt for portals
      for (const [dir, ex] of Object.entries(room.exits)) {
        const b = getDoorBox(room, dir);
        const bx2 = b.x + b.w / 2, by2 = b.y + b.h / 2;
        const dist = Math.hypot(pl.x - bx2, pl.y - by2);
        if (dist < 115 && !isCleared) {
          const alpha = Math.max(0, 1 - dist / 115);
          ctx.fillStyle = `rgba(255, 243, 199, ${alpha * 0.95})`;
          ctx.font = 'bold 13px Inter, sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('Approche le portail pour le défi !', bx2,
            dir === 'north' ? by2 + 34 : dir === 'south' ? by2 - 34 : by2 - 28);
          ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        }
      }

      // Donjon Altar prompt
      if (rid === 'donjon' && !isCleared) {
        const altarOb = room.obstacles.find(o => o.type === 'altar');
        if (altarOb) {
          const acx = altarOb.x + altarOb.w / 2;
          const acy = altarOb.y + altarOb.h / 2;
          const dist = Math.hypot(pl.x - acx, pl.y - acy);
          if (dist < 130) {
            const alpha = Math.max(0, 1 - dist / 130);
            ctx.fillStyle = `rgba(255, 235, 150, ${alpha * 0.95})`;
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText("Approche de l'Autel Sacré pour le défi final !", acx, acy - 54);
            ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
          }
        }
      }

      // 6. Warm Pixar Studio Lighting & Gentle Vignette (No pitch-black gloom!)
      const topSun = ctx.createLinearGradient(0, 0, 0, 85);
      topSun.addColorStop(0, 'rgba(254, 243, 199, 0.12)');
      topSun.addColorStop(1, 'rgba(254, 243, 199, 0)');
      ctx.fillStyle = topSun;
      ctx.fillRect(0, 0, CW, 85);

      const vignette = ctx.createRadialGradient(CW / 2, CH / 2, CH * 0.50, CW / 2, CH / 2, CW * 0.72);
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(0.8, 'rgba(0, 0, 0, 0.08)');
      vignette.addColorStop(1, 'rgba(15, 23, 42, 0.30)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, CW, CH);

      // Golden ambient motes
      motesRef.current.forEach(m => {
        ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function loop() {
      step();
      draw();
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [openEncounter, goTo]);

  // ── Room data for modal ───────────────────────────────────────────────────────
  const encRoom = encounter ? ROOMS[encounter] : null;
  const correctAnswered = feedback?.ok === true;

  // ── Styles (inline, no CSS file needed) ──────────────────────────────────────
  const S = {
    gold: '#d4af37', ink: '#2a334a', em: '#10b981', rb: '#ef4444',
    card: { background:'rgba(11,14,24,0.97)', border:'1px solid #d4af37', borderRadius:12,
      width:'100%', maxWidth:580, padding:'20px 24px',
      boxShadow:'0 20px 55px rgba(0,0,0,.9),0 0 26px rgba(212,175,55,0.35)',
      transform: cardShake?undefined:'none',
      animation: cardShake?'shake .38s ease both':undefined },
  };

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:'100%',gap:10,paddingBottom:16}}>
      {/* Header */}
      <div style={{width:CW,maxWidth:'100%',display:'flex',alignItems:'center',gap:10,paddingTop:8}}>
        <button onClick={onBack} style={{
          display:'flex',alignItems:'center',gap:6,
          background:'rgba(212,175,55,0.10)',border:'1px solid rgba(212,175,55,0.30)',
          color:'#d4af37',padding:'6px 14px',borderRadius:6,cursor:'pointer',
          fontSize:13,fontWeight:600,fontFamily:'Inter,sans-serif',transition:'all .18s',
        }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(212,175,55,0.20)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(212,175,55,0.10)'}
        >
          <ArrowLeft size={14}/>Retour aux Jeux
        </button>
        <span style={{fontFamily:"'Cinzel',serif",fontSize:13,color:'#4a5568',letterSpacing:'0.8px'}}>
          La Citadelle de la Sérénité — Unité 2 : Santé Mentale &amp; Bien-Être
        </span>
      </div>

      {/* Game area */}
      <div style={{position:'relative',width:CW,height:CH,borderRadius:10,overflow:'hidden',
        boxShadow:'0 20px 50px rgba(0,0,0,.85),0 0 28px rgba(212,175,55,.10)',
        border:'2px solid #1e2536',background:'#111'}}>

        <canvas ref={canvasRef} width={CW} height={CH} style={{display:'block'}}/>

        {/* HUD */}
        <div style={{position:'absolute',top:11,left:13,right:13,display:'flex',
          justifyContent:'space-between',alignItems:'center',pointerEvents:'none',zIndex:10}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:12,letterSpacing:'1.5px',
            color:'#d4af37',background:'rgba(6,8,14,.90)',border:'1px solid #2a334a',
            padding:'6px 13px',borderRadius:6,backdropFilter:'blur(6px)',
            textTransform:'uppercase',fontWeight:700}}>{hudName}</div>
          <div style={{fontSize:12,fontWeight:700,color:'#e2e8f0',
            background:'rgba(6,8,14,.90)',border:'1px solid #2a334a',
            padding:'6px 12px',borderRadius:6,backdropFilter:'blur(6px)'}}>{hudProg}</div>
        </div>

        {/* Tutorial hint */}
        {showTutorial && (
          <div style={{position:'absolute',bottom:14,left:'50%',transform:'translateX(-50%)',
            background:'rgba(6,8,14,.92)',border:'1px solid #d4af37',borderRadius:8,
            padding:'9px 18px',zIndex:20,pointerEvents:'none',textAlign:'center',
            boxShadow:'0 0 18px rgba(212,175,55,0.35)',whiteSpace:'nowrap'}}>
            <span style={{fontSize:12.5,color:'#f1f5f9'}}>
              Déplace le chevalier avec <b style={{color:'#d4af37'}}>↑↓←→</b> ou <b style={{color:'#d4af37'}}>WASD</b> —
              contourne les obstacles et marche vers les <span style={{color:'#10b981',fontWeight:600}}>portails lumineux</span> pour déclencher un défi !
            </span>
          </div>
        )}

        {/* Encounter modal */}
        {encounter && encRoom && (
          <div style={{position:'absolute',inset:0,background:'rgba(3,4,8,.84)',
            backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',
            padding:16,zIndex:50}}>
            <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`}</style>
            <div style={{...S.card, animation:cardShake?'shake .38s ease both':undefined}}>
              {/* Header */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:10.5,letterSpacing:'2px',
                  color:'#d4af37',textTransform:'uppercase',fontWeight:700}}>Défi du Sanctuaire</div>
                <div style={{fontSize:10.5,color:'#94a3b8',background:'rgba(42,51,74,.6)',
                  padding:'2px 8px',borderRadius:9999,border:'1px solid rgba(212,175,55,.28)'}}>{encRoom.theme}</div>
              </div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:15,color:'#fff',
                marginBottom:8,fontWeight:700}}>{encRoom.name}</div>
              <p style={{fontSize:13.5,lineHeight:1.65,marginBottom:13,color:'#f1f5f9',
                background:'rgba(6,10,20,.75)',padding:'10px 12px',borderRadius:7,
                borderLeft:'3px solid #d4af37'}}>{encRoom.q}</p>
              {/* Choices */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:10}}>
                {encRoom.opts.map((opt,i)=>{
                  let bg='rgba(18,24,42,.95)',border='1px solid #2a334a',color='#e2e8f0';
                  if(correctAnswered && i===encRoom.ok){bg='rgba(16,185,129,.20)';border='1px solid #10b981';color='#a7f3d0';}
                  else if(feedback && !feedback.ok && i===selIdx){bg='rgba(239,68,68,.20)';border='1px solid #ef4444';color='#fecaca';}
                  else if(i===selIdx){bg='rgba(212,175,55,.13)';border='1px solid #d4af37';color='#fff';}
                  return (
                    <button key={i} disabled={correctAnswered} onClick={()=>handleSelect(i)} style={{
                      background:bg,border,color,padding:'8px 10px',fontSize:12.5,fontWeight:500,
                      borderRadius:7,cursor:correctAnswered?'default':'pointer',textAlign:'left',
                      lineHeight:1.4,display:'flex',alignItems:'center',gap:6,transition:'all .16s ease'}}>
                      <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',
                        width:18,height:18,borderRadius:'50%',background:'rgba(255,255,255,.07)',
                        fontSize:9.5,fontWeight:700,flexShrink:0,color:'#d4af37'}}>{LETTERS[i]}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
              {/* Feedback */}
              {feedback && (
                <div style={{padding:'7px 11px',borderRadius:7,fontSize:12,lineHeight:1.4,
                  display:'flex',alignItems:'center',gap:6,marginBottom:10,
                  background:feedback.ok?'rgba(16,185,129,.17)':'rgba(239,68,68,.17)',
                  border:`1px solid ${feedback.ok?'#10b981':'#ef4444'}`,
                  color:feedback.ok?'#6ee7b7':'#fca5a5'}}>{feedback.msg}</div>
              )}
              {/* Action */}
              <div style={{display:'flex',justifyContent:'flex-end'}}>
                {!correctAnswered ? (
                  <button disabled={selIdx===null} onClick={handleValidate} style={{
                    background:'linear-gradient(135deg,#d4af37,#8c6d12)',border:'none',color:'#07090e',
                    padding:'7px 18px',fontSize:12.5,fontWeight:700,borderRadius:6,
                    cursor:selIdx===null?'not-allowed':'pointer',fontFamily:"'Cinzel',serif",
                    letterSpacing:'.8px',opacity:selIdx===null?.38:1,transition:'all .2s'}}>Valider</button>
                ) : (
                  <button onClick={handleAdvance} style={{
                    background:'linear-gradient(135deg,#d4af37,#8c6d12)',border:'none',color:'#07090e',
                    padding:'7px 18px',fontSize:12.5,fontWeight:700,borderRadius:6,
                    cursor:'pointer',fontFamily:"'Cinzel',serif",letterSpacing:'.8px'}}>
                    {encRoom.isFinal?'Réclamer la Relique ✦':'Franchir le Portail →'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Victory */}
        {victory && (
          <div style={{position:'absolute',inset:0,background:'rgba(4,5,10,.97)',display:'flex',
            flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',
            padding:34,zIndex:60,backdropFilter:'blur(10px)'}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:26,color:'#d4af37',marginBottom:8,
              letterSpacing:'2px',textShadow:'0 0 22px rgba(212,175,55,.5)'}}>Victoire : La Clef de la Sérénité !</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:14,color:'#93c5fd',marginBottom:14,letterSpacing:'1px'}}>
              Sanctum de la Santé Mentale Atteint</div>
            <p style={{fontSize:13.5,color:'#cbd5e1',maxWidth:460,lineHeight:1.7,marginBottom:20}}>
              Félicitations ! Tu as maîtrisé le <strong>conditionnel de bienveillance</strong> et le{' '}
              <strong>subjonctif d'obligation</strong>, et déverrouillé tous les portails de la résilience.
            </p>
            <button onClick={handleReset} style={{
              background:'linear-gradient(135deg,#d4af37,#8c6d12)',border:'none',color:'#07090e',
              padding:'9px 24px',fontSize:12.5,fontWeight:700,borderRadius:6,
              cursor:'pointer',fontFamily:"'Cinzel',serif",letterSpacing:'.8px'}}>
              Recommencer l'Exploration
            </button>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div style={{fontSize:11,color:'#374151',letterSpacing:'.4px',textAlign:'center'}}>
        Déplacement : <b style={{color:'#4b5563'}}>↑ ↓ ← →</b> ou <b style={{color:'#4b5563'}}>W A S D</b>
      </div>
    </div>
  );
}
