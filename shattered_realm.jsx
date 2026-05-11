import { useState, useEffect, useRef } from "react";

// ════════════════════════════════════════════
//  GAME DATA
// ════════════════════════════════════════════

const ITEMS = {
  rusty_sword:    { name:"Rusty Sword",        slot:"weapon",  type:"weapon",    atk:4,        desc:"A worn blade, better than nothing.",      value:10,  rarity:"common" },
  iron_sword:     { name:"Iron Sword",          slot:"weapon",  type:"weapon",    atk:9,        desc:"Standard military issue.",                value:55,  rarity:"common" },
  silver_blade:   { name:"Silver Blade",        slot:"weapon",  type:"weapon",    atk:15,       desc:"Effective against undead.",               value:170, rarity:"uncommon" },
  flamebrand:     { name:"Flamebrand",          slot:"weapon",  type:"weapon",    atk:22,       desc:"Enchanted with fire magic.",              value:420, rarity:"rare" },
  shadowfang:     { name:"Shadowfang",          slot:"weapon",  type:"weapon",    atk:30,       desc:"Forged from shadow essence.",             value:950, rarity:"epic" },
  voidreaver:     { name:"Voidreaver",          slot:"weapon",  type:"weapon",    atk:42,       desc:"A blade that tears through reality.",     value:2800,rarity:"legendary" },
  war_axe:        { name:"War Axe",             slot:"weapon",  type:"weapon",    atk:16,       desc:"Heavy but devastating.",                  value:210, rarity:"uncommon" },
  bone_staff:     { name:"Bone Staff",          slot:"weapon",  type:"weapon",    atk:18,mp:20, desc:"Carved from cursed bone.",                value:290, rarity:"rare" },
  cloth_robe:     { name:"Cloth Robe",          slot:"armor",   type:"armor",     def:2,        desc:"Minimal protection.",                     value:15,  rarity:"common" },
  leather_armor:  { name:"Leather Armor",       slot:"armor",   type:"armor",     def:6,        desc:"Flexible and light.",                     value:65,  rarity:"common" },
  chain_mail:     { name:"Chainmail",           slot:"armor",   type:"armor",     def:12,       desc:"Interlocked iron rings.",                 value:190, rarity:"uncommon" },
  plate_armor:    { name:"Plate Armor",         slot:"armor",   type:"armor",     def:19,agi:-1,desc:"Heavy but stalwart.",                     value:520, rarity:"rare" },
  shadow_cloak:   { name:"Shadow Cloak",        slot:"armor",   type:"armor",     def:15,agi:2, desc:"Woven from shadow threads.",              value:680, rarity:"epic" },
  dragonscale:    { name:"Dragonscale Hauberk", slot:"armor",   type:"armor",     def:26,       desc:"Nearly impenetrable scales.",             value:1900,rarity:"legendary" },
  leather_cap:    { name:"Leather Cap",         slot:"helmet",  type:"armor",     def:1,        desc:"Basic head protection.",                  value:20,  rarity:"common" },
  iron_helm:      { name:"Iron Helm",           slot:"helmet",  type:"armor",     def:5,        desc:"A solid iron helmet.",                    value:85,  rarity:"common" },
  knights_helm:   { name:"Knight's Helm",       slot:"helmet",  type:"armor",     def:10,       desc:"Full visor. Storied in battle.",          value:230, rarity:"uncommon" },
  crown_of_thorns:{ name:"Crown of Thorns",     slot:"helmet",  type:"armor",     def:8,atk:4,  desc:"A cursed crown of dark power.",           value:560, rarity:"rare" },
  veil_of_shadows:{ name:"Veil of Shadows",     slot:"helmet",  type:"armor",     def:12,agi:3, desc:"Shrouds the mind from magic.",            value:980, rarity:"epic" },
  leather_boots:  { name:"Leather Boots",       slot:"boots",   type:"armor",     def:1,agi:1,  desc:"Sturdy traveling boots.",                 value:25,  rarity:"common" },
  iron_sabatons:  { name:"Iron Sabatons",       slot:"boots",   type:"armor",     def:4,        desc:"Heavy armored footwear.",                 value:95,  rarity:"common" },
  swiftboots:     { name:"Swiftboots",          slot:"boots",   type:"armor",     def:2,agi:5,  desc:"Enchanted for speed.",                    value:270, rarity:"uncommon" },
  shadowstep:     { name:"Shadowstep Greaves",  slot:"boots",   type:"armor",     def:7,agi:7,  desc:"Move like a ghost.",                      value:790, rarity:"rare" },
  ring_of_health: { name:"Ring of Health",      slot:"ring",    type:"accessory", hp:30,        desc:"Pulses with vitality.",                   value:110, rarity:"uncommon" },
  ring_of_power:  { name:"Ring of Power",       slot:"ring",    type:"accessory", atk:5,        desc:"Your strikes hit harder.",                value:210, rarity:"rare" },
  ring_of_warding:{ name:"Ring of Warding",     slot:"ring",    type:"accessory", def:6,        desc:"A lingering magical barrier.",            value:225, rarity:"rare" },
  void_signet:    { name:"Void Signet",         slot:"ring",    type:"accessory", atk:7,def:4,hp:30, desc:"Resonates with dark power.",         value:920, rarity:"epic" },
  health_potion:  { name:"Health Potion",       type:"consumable", effect:"heal",     power:40,  desc:"Restores 40 HP.",  value:22,  rarity:"common" },
  greater_health: { name:"Greater Health Pot",  type:"consumable", effect:"heal",     power:95,  desc:"Restores 95 HP.",  value:65,  rarity:"uncommon" },
  elixir:         { name:"Elixir of Life",      type:"consumable", effect:"fullheal",  power:999, desc:"Fully restores HP.",value:230, rarity:"rare" },
  mp_potion:      { name:"Mana Potion",         type:"consumable", effect:"mana",     power:30,  desc:"Restores 30 MP.",  value:28,  rarity:"common" },
  antidote:       { name:"Antidote",            type:"consumable", effect:"cure",     power:0,   desc:"Cures poison.",    value:15,  rarity:"common" },
  realm_shard:    { name:"Realm Shard",         type:"quest",                                    desc:"A fragment of the shattered realm. It hums with broken power.", value:0, rarity:"legendary" },
};

const ENEMIES = {
  thornwood:[
    {name:"Dire Wolf",         maxHp:30,  atk:8,  def:2,  agi:6,  exp:20,  g:[3,11],  drops:["health_potion"],              dc:0.4},
    {name:"Forest Goblin",     maxHp:24,  atk:7,  def:1,  agi:5,  exp:15,  g:[4,13],  drops:["health_potion","mp_potion"],   dc:0.4},
    {name:"Dark Elf Scout",    maxHp:42,  atk:11, def:4,  agi:9,  exp:30,  g:[11,24], drops:["leather_boots","mp_potion"],   dc:0.35},
    {name:"Hollow Troll",      maxHp:70,  atk:14, def:6,  agi:2,  exp:52,  g:[19,33], drops:["chain_mail","greater_health"], dc:0.3},
    {name:"Sylvara, Corrupted Dryad", maxHp:140, atk:17, def:8, agi:7, exp:120, g:[48,68], drops:["realm_shard","silver_blade","ring_of_health"], dc:1, boss:true,
     bossQuote:"\"The forest… asked me to protect it. I became what I protected it from.\"",
     bossDesc:"A towering dryad, her bark-skin weeping black ichor. Roots writhe from her back like broken wings."},
  ],
  caldrath:[
    {name:"Risen Skeleton",    maxHp:36,  atk:10, def:5,  agi:3,  exp:24,  g:[5,15],  drops:["health_potion","iron_helm"],       dc:0.4},
    {name:"Plagued Zombie",    maxHp:52,  atk:12, def:4,  agi:1,  exp:32,  g:[8,20],  drops:["health_potion","antidote"],        dc:0.35},
    {name:"Howling Wraith",    maxHp:48,  atk:16, def:3,  agi:11, exp:40,  g:[13,29], drops:["mp_potion","bone_staff"],          dc:0.3},
    {name:"Ruin Golem",        maxHp:95,  atk:19, def:13, agi:1,  exp:65,  g:[24,40], drops:["plate_armor","greater_health"],    dc:0.25},
    {name:"Malzar the Defiled",maxHp:210, atk:23, def:11, agi:5,  exp:170, g:[68,98], drops:["realm_shard","knights_helm","ring_of_power"], dc:1, boss:true,
     bossQuote:"\"I promised them immortality. I simply forgot to mention what kind.\"",
     bossDesc:"A lich cloaked in rotting ceremonial robes. His eye sockets burn with green necromantic fire."},
  ],
  drowned:[
    {name:"Sea Serpent",       maxHp:58,  atk:16, def:7,  agi:8,  exp:40,  g:[11,22], drops:["health_potion","greater_health"],    dc:0.4},
    {name:"Tide Golem",        maxHp:105, atk:21, def:15, agi:2,  exp:70,  g:[19,34], drops:["chain_mail","iron_sabatons"],        dc:0.3},
    {name:"Krakling Warrior",  maxHp:65,  atk:19, def:9,  agi:7,  exp:48,  g:[15,28], drops:["war_axe","health_potion"],           dc:0.35},
    {name:"Drowned Knight",    maxHp:115, atk:23, def:16, agi:4,  exp:80,  g:[30,48], drops:["plate_armor","crown_of_thorns"],     dc:0.3},
    {name:"Lethara, Tide Witch",maxHp:295,atk:27, def:13, agi:10, exp:230, g:[95,135],drops:["realm_shard","shadow_cloak","ring_of_warding"], dc:1, boss:true,
     bossQuote:"\"The sea takes everything. In time, it will take you too.\"",
     bossDesc:"Half-submerged in an eternal tide. Saltwater tentacles arc from her fingertips like lightning."},
  ],
  shadowkeep:[
    {name:"Shadow Knight",     maxHp:95,  atk:25, def:15, agi:10, exp:65,  g:[24,40], drops:["greater_health","flamebrand"],       dc:0.35},
    {name:"Soul Eater",        maxHp:85,  atk:29, def:10, agi:14, exp:75,  g:[22,36], drops:["mp_potion","shadowstep"],            dc:0.35},
    {name:"Void Specter",      maxHp:100, atk:27, def:8,  agi:17, exp:80,  g:[26,44], drops:["ring_of_warding","veil_of_shadows"], dc:0.3},
    {name:"Lich Thrall",       maxHp:125, atk:31, def:17, agi:7,  exp:90,  g:[34,56], drops:["greater_health","shadow_cloak"],     dc:0.3},
    {name:"Malachar, the Void Lich",maxHp:480,atk:40,def:22,agi:12,exp:650,g:[240,340],drops:["realm_shard","voidreaver","dragonscale","void_signet"], dc:1, boss:true,
     bossQuote:"\"You carry the Shards. You've done half my work for me.\"",
     bossDesc:"The architect of the Shattering. His form barely contains the void within — darkness bleeds through the cracks in his body like light through broken glass."},
  ],
};

const DUNGEONS = {
  thornwood:{
    name:"Thornwood Forest", icon:"🌲", minLevel:1,
    intro:"The ancient forest has twisted with corruption. The trees remember when they were beautiful — and they grieve.",
    rooms:[
      {type:"story",   title:"The Whispering Path",     desc:"Twisted bark forms faces frozen in agony. The trees seem to watch you. You press deeper."},
      {type:"combat",  title:"Shadowed Hollow"},
      {type:"rest",    title:"Ancient Shrine",          desc:"A small mossy shrine pulses with faint light — the corruption hasn't reached it yet.", heal:0.35},
      {type:"combat",  title:"The Goblin Warren"},
      {type:"treasure",title:"Fallen Knight's Cache",   gold:[18,35]},
      {type:"trap",    title:"The Thorn Snare",         desc:"Vines snap around your ankles — thorn-whips! They lash before you sever them.", dmgMult:0.14},
      {type:"combat",  title:"Canopy of Shadows"},
      {type:"boss",    title:"The Heart-Tree",          desc:"A colossal corrupted tree pulses with void energy. Sylvara steps forward, her eyes hollow voids."},
    ],
  },
  caldrath:{
    name:"Ruins of Caldrath", icon:"🏚️", minLevel:5,
    intro:"The fallen necromancer-city of Caldrath. The dead here were denied their rest. Their grief has become hunger.",
    rooms:[
      {type:"story",   title:"The Shattered Gate",      desc:"The city seal: a serpent devouring its own tail. The inscription reads: \"Caldrath — Eternal in Death.\""},
      {type:"combat",  title:"The Bone Hall"},
      {type:"trap",    title:"The Crushing Corridor",   desc:"Walls close in! You hurl yourself through a crumbling section — but not without cost.", dmgMult:0.18},
      {type:"combat",  title:"Chamber of the Risen"},
      {type:"treasure",title:"Desecrated Tomb",         gold:[28,55]},
      {type:"story",   title:"Forgotten Scriptorium",   desc:"A diary page: \"We welcomed him as a healer. By the third night, the dead outnumbered the living.\""},
      {type:"rest",    title:"The Last Refuge",         desc:"A warded cell, somehow untouched. A dead adventurer's campfire still smoulders.", heal:0.35},
      {type:"combat",  title:"The Wraith Passage"},
      {type:"boss",    title:"The Necromancer's Sanctum",desc:"Malzar floats above a pit of screaming souls, their faces pressed against the floor of reality."},
    ],
  },
  drowned:{
    name:"The Drowned Depths", icon:"🌊", minLevel:10,
    intro:"An ancient coastal fortress swallowed by the sea. Beautiful. Deadly. The Tide Witch Lethara has hoarded a Realm Shard for centuries.",
    rooms:[
      {type:"story",   title:"The Brine Entrance",      desc:"Bioluminescent coral lines the flooded hallways. The light pulses like a heartbeat."},
      {type:"combat",  title:"Flooded Barracks"},
      {type:"trap",    title:"The Surge Vault",         desc:"A flooding chamber! Water surges from hidden vents. You fight against the current, barely escaping.", dmgMult:0.17},
      {type:"combat",  title:"The Serpent's Nest"},
      {type:"treasure",title:"Sunken Armory",           gold:[45,80]},
      {type:"rest",    title:"The Sealed Alcove",       desc:"An air pocket in a sealed chamber. The silence is total except for distant waves.", heal:0.35},
      {type:"story",   title:"The Carved History",      desc:"A relief carved into stone: a woman clutching a glowing shard while the sea rises around her."},
      {type:"combat",  title:"Tide Throne Approach"},
      {type:"boss",    title:"The Abyssal Throne",      desc:"Lethara rises from the black water on a throne of coral and bone. The Realm Shard pulses at her chest."},
    ],
  },
  shadowkeep:{
    name:"Shadowkeep", icon:"🏰", minLevel:15,
    intro:"The final stronghold of Malachar. The sky above has been consumed by shadow. The last Shard — and the Void Lich — await.",
    rooms:[
      {type:"story",   title:"Gates of Oblivion",       desc:"The keep's stones are not built — they are compressed darkness. Your footsteps echo like screams."},
      {type:"combat",  title:"The Shadow Barracks"},
      {type:"combat",  title:"Hall of Broken Mirrors"},
      {type:"trap",    title:"The Void Trap",           desc:"Void tendrils erupt from the floor, draining your life force before you sever them!", dmgMult:0.2},
      {type:"treasure",title:"A Fallen Hero's Pack",    gold:[65,110]},
      {type:"story",   title:"The Prisoner's Gallery",  desc:"Etched in dozens of hands: \"He broke the Realm not from malice, but from fear of his own death.\" The last line adds: \"Do not become him.\""},
      {type:"rest",    title:"The Heroes' Ward",        desc:"A consecrated circle carved by adventurers who came before. Their names are famous in old legends.", heal:0.4},
      {type:"combat",  title:"The Lich Guard"},
      {type:"combat",  title:"Void Throne Antechamber"},
      {type:"boss",    title:"The Void Throne Room",    desc:"Malachar rises from his throne. The air is absolute zero."},
    ],
  },
};

const WORLD = [
  {id:"ashenveil", name:"Ashenveil Village", icon:"🏘️", x:27, y:56, type:"town",   desc:"A village surviving at the edge of corruption. Traders, an inn, and hope.",    unlocked:true},
  {id:"thornwood", name:"Thornwood Forest",  icon:"🌲", x:48, y:42, type:"dungeon", dungeonKey:"thornwood", desc:"An ancient forest consumed by void corruption.", unlocked:true},
  {id:"caldrath",  name:"Ruins of Caldrath", icon:"🏚️",x:67, y:62, type:"dungeon", dungeonKey:"caldrath",  desc:"A fallen necromancer-city where the dead still walk.", unlocked:false},
  {id:"drowned",   name:"The Drowned Depths",icon:"🌊", x:75, y:34, type:"dungeon", dungeonKey:"drowned",   desc:"A sunken fortress ruled by the Tide Witch.", unlocked:false},
  {id:"shadowkeep",name:"Shadowkeep",        icon:"🏰", x:53, y:19, type:"dungeon", dungeonKey:"shadowkeep",desc:"The final citadel of the Void Lich.", unlocked:false},
];

const SHOP = {
  1:  ["iron_sword","leather_armor","leather_cap","leather_boots","health_potion","mp_potion","antidote"],
  5:  ["silver_blade","chain_mail","iron_helm","iron_sabatons","ring_of_health","greater_health","war_axe"],
  10: ["plate_armor","knights_helm","swiftboots","ring_of_power","ring_of_warding","flamebrand","bone_staff"],
  15: ["shadow_cloak","veil_of_shadows","shadowstep","void_signet","shadowfang","elixir"],
};

const RARITY = { common:"#9e9e9e", uncommon:"#66bb6a", rare:"#42a5f5", epic:"#ab47bc", legendary:"#ffa726" };

function expFor(lvl) { return Math.floor(65 * Math.pow(1.48, lvl - 1)); }

function calcStats(p, eq) {
  let atk=p.str, def=p.def, agi=p.agi, maxHp=p.maxHp, maxMp=p.maxMp;
  Object.values(eq).forEach(id => {
    if (!id) return; const it = ITEMS[id]; if (!it) return;
    if (it.atk) atk+=it.atk; if (it.def) def+=it.def; if (it.agi) agi+=it.agi;
    if (it.hp) maxHp+=it.hp; if (it.mp) maxMp+=it.mp;
  });
  return {atk,def,agi,maxHp,maxMp};
}

function rollDmg(atk, def) {
  const base = Math.max(1, atk - Math.floor(def*0.45));
  const v = Math.floor(base*0.28);
  return Math.max(1, base + Math.floor(Math.random()*(v*2+1))-v);
}

function genRooms(key) {
  const dun = DUNGEONS[key];
  const pool = ENEMIES[key];
  const nonBoss = pool.filter(e=>!e.boss);
  const boss = pool.find(e=>e.boss);
  // Shuffle non-boss combat rooms a bit while keeping order of other rooms
  let combatIdx = 0;
  const shuffledNonBoss = [...nonBoss].sort(()=>Math.random()-0.5);
  return dun.rooms.map((r,i)=>{
    const room = {...r, id:i, cleared:false};
    if (r.type==="combat") {
      const e = shuffledNonBoss[combatIdx % shuffledNonBoss.length]; combatIdx++;
      room.enemy = {...e, hp:e.maxHp};
    } else if (r.type==="boss") {
      room.enemy = {...boss, hp:boss.maxHp};
    } else if (r.type==="treasure") {
      const [gmin,gmax]=r.gold||[10,30];
      room.goldAmount = gmin+Math.floor(Math.random()*(gmax-gmin+1));
      const zoneDrops = pool.flatMap(e=>e.drops||[]).filter(id=>ITEMS[id]?.type!=="quest");
      room.itemDrop = Math.random()<0.42&&zoneDrops.length>0 ? zoneDrops[Math.floor(Math.random()*zoneDrops.length)] : null;
    }
    return room;
  });
}

// ════════════════════════════════════════════
//  CSS
// ════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#06030a;overflow-x:hidden;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:#0a060e;}
::-webkit-scrollbar-thumb{background:#3a2018;border-radius:3px;}
.gr{min-height:100vh;background:#06030a;color:#e4d0a8;font-family:'EB Garamond',Georgia,serif;font-size:16px;line-height:1.65;}
.cf{font-family:'Cinzel',serif;}
.ctd{font-family:'Cinzel Decorative',serif;}
.panel{background:linear-gradient(135deg,#100912 0%,#0b0710 100%);border:1px solid #2e1c10;border-radius:3px;}
.panel-g{border-color:#b8922088;}
.gt{color:#c9a030;}
.dim{color:#6a4828;}
.muted{color:#9a7a54;}
.hb{background:#180a0a;border-radius:2px;height:9px;overflow:hidden;}
.hf{background:linear-gradient(90deg,#7a0000,#bc3020);height:100%;border-radius:2px;transition:width .3s;}
.mb{background:#0a0a1a;border-radius:2px;height:9px;overflow:hidden;}
.mf{background:linear-gradient(90deg,#183870,#2474a8);height:100%;border-radius:2px;transition:width .3s;}
.eb{background:#100a1a;border-radius:2px;height:5px;overflow:hidden;}
.ef{background:linear-gradient(90deg,#420e6e,#6b14a0);height:100%;border-radius:2px;transition:width .3s;}
.btn{font-family:'Cinzel',serif;font-size:13px;letter-spacing:.04em;background:linear-gradient(180deg,#1c1006 0%,#110b04 100%);border:1px solid #4a3010;color:#c9a030;cursor:pointer;padding:8px 16px;border-radius:3px;transition:all .15s;white-space:nowrap;}
.btn:hover{background:linear-gradient(180deg,#281808 0%,#180e06 100%);border-color:#c9a030;}
.btn:active{transform:scale(.97);}
.btn-p{border-color:#c9a030;background:linear-gradient(180deg,#342010 0%,#221408 100%);}
.btn-p:hover{background:linear-gradient(180deg,#40280e 0%,#2c1a0c 100%);box-shadow:0 0 12px #c9a03030;}
.btn-r{border-color:#7a0000;color:#d03020;}
.btn-r:hover{border-color:#c03020;background:linear-gradient(180deg,#1e0606 0%,#140404 100%);}
.btn-g{border-color:#285010;color:#5a9030;}
.btn-g:hover{border-color:#5a9030;}
.btn-d{opacity:.38;cursor:not-allowed;pointer-events:none;}
.divider{border:none;border-top:1px solid #221408;margin:10px 0;}
.tag-c{color:#9e9e9e;}.tag-u{color:#66bb6a;}.tag-r{color:#42a5f5;}.tag-e{color:#ab47bc;}.tag-l{color:#ffa726;}
.room-card{padding:14px;cursor:pointer;transition:border-color .2s,background .2s;}
.room-card:hover{background:#140c10!important;border-color:#b8922088!important;}
.room-cleared{opacity:.4;cursor:default!important;}
.room-active{border-color:#c9a030!important;background:#180e0a!important;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.55;}}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
@keyframes slideIn{from{opacity:0;transform:translateX(-16px);}to{opacity:1;transform:translateX(0);}}
@keyframes glow{0%,100%{text-shadow:0 0 10px #c9a03060;}50%{text-shadow:0 0 28px #c9a03080,0 0 60px #c9a03030;}}
.fi{animation:fadeIn .45s ease forwards;}
.si{animation:slideIn .3s ease forwards;}
.blink{animation:pulse 1.8s infinite;}
@keyframes shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
.shake{animation:shake .3s ease;}
`;

// ════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════
export default function Game() {
  const [screen,   setScreen]   = useState("title");
  const [pname,    setPname]    = useState("");
  const [player,   setPlayer]   = useState(null);
  const [eq,       setEq]       = useState({weapon:"rusty_sword",armor:"cloth_robe",helmet:null,boots:"leather_boots",ring:null});
  const [inv,      setInv]      = useState(["health_potion","health_potion","mp_potion"]);
  const [gold,     setGold]     = useState(50);
  const [locs,     setLocs]     = useState(WORLD);
  const [dunKey,   setDunKey]   = useState(null);
  const [rooms,    setRooms]    = useState([]);
  const [rIdx,     setRIdx]     = useState(0);
  const [combat,   setCombat]   = useState(null);
  const [clog,     setClog]     = useState([]);
  const [cleared,  setCleared]  = useState([]);
  const [prevScr,  setPrevScr]  = useState("worldmap");
  const [notice,   setNotice]   = useState("");
  const [townTab,  setTownTab]  = useState("buy");
  const [invTab,   setInvTab]   = useState("equipment");
  const [combatAnim, setCombatAnim] = useState(false);
  const logRef = useRef(null);

  useEffect(()=>{
    if(logRef.current) logRef.current.scrollTop=logRef.current.scrollHeight;
  },[clog]);

  const gs = () => player ? calcStats(player,eq) : null;

  function mkPlayer(n){ return {name:n,level:1,hp:70,maxHp:70,mp:28,maxMp:28,str:9,def:4,agi:5,exp:0}; }

  function addItem(id){ setInv(v=>[...v,id]); }
  function remItem(id){ setInv(v=>{ const i=v.indexOf(id); return i<0?v:[...v.slice(0,i),...v.slice(i+1)]; }); }

  function useItem(id){
    const it=ITEMS[id]; if(!it||it.type!=="consumable") return null;
    const s=gs(); let nh=player.hp, nm=player.mp, msg="";
    if(it.effect==="heal"){    nh=Math.min(s.maxHp,player.hp+it.power); msg=`Restored ${nh-player.hp} HP.`;}
    if(it.effect==="fullheal"){nh=s.maxHp; msg="Fully restored HP!";}
    if(it.effect==="mana"){    nm=Math.min(s.maxMp,player.mp+it.power); msg=`Restored ${nm-player.mp} MP.`;}
    if(it.effect==="cure"){    msg="Cured status effects.";}
    setPlayer(p=>({...p,hp:nh,mp:nm})); remItem(id);
    return `Used ${it.name}. ${msg}`;
  }

  function equipItem(id){
    const it=ITEMS[id]; if(!it?.slot) return;
    const old=eq[it.slot];
    setEq(e=>({...e,[it.slot]:id})); remItem(id);
    if(old) addItem(old);
    const ne={...eq,[it.slot]:id}; const ns=calcStats(player,ne);
    setPlayer(p=>({...p,hp:Math.min(p.hp,ns.maxHp),mp:Math.min(p.mp,ns.maxMp)}));
  }

  function unequip(slot){ const id=eq[slot]; if(!id) return; setEq(e=>({...e,[slot]:null})); addItem(id); }

  function enterDungeon(key){
    setDunKey(key); setRooms(genRooms(key)); setRIdx(0); setNotice(""); setScreen("dungeon");
  }

  function processRoom(idx){
    const r=rooms[idx]; if(!r||r.cleared) return;
    if(r.type==="combat"||r.type==="boss"){
      setCombat({enemy:{...r.enemy},rIdx:idx,turn:"player",status:"active"});
      const lines=[`⚔️ ${r.enemy.name} emerges from the shadows!`];
      if(r.enemy.bossQuote) lines.push(`💬 ${r.enemy.bossQuote}`);
      if(r.enemy.bossDesc) lines.push(`👁 ${r.enemy.bossDesc}`);
      setClog(lines); setScreen("combat");
    } else if(r.type==="treasure"){
      let msgs=["You pry open the chest..."];
      if(r.goldAmount){ setGold(g=>g+r.goldAmount); msgs.push(`Found ${r.goldAmount} gold.`); }
      if(r.itemDrop){ addItem(r.itemDrop); msgs.push(`Found: ${ITEMS[r.itemDrop]?.name}!`); }
      if(!r.goldAmount&&!r.itemDrop) msgs.push("It is empty. Someone beat you to it.");
      setRooms(rs=>rs.map((x,i)=>i===idx?{...x,cleared:true}:x));
      setNotice("💰 "+msgs.join(" "));
    } else if(r.type==="rest"){
      const s=gs(); const healed=Math.floor(s.maxHp*(r.heal||0.35));
      setPlayer(p=>({...p,hp:Math.min(s.maxHp,p.hp+healed)}));
      setRooms(rs=>rs.map((x,i)=>i===idx?{...x,cleared:true}:x));
      setNotice(`🕯️ ${r.desc} You recover ${healed} HP.`);
    } else if(r.type==="trap"){
      const s=gs(); const dmg=Math.max(1,Math.floor(s.maxHp*(r.dmgMult||0.15)));
      setPlayer(p=>({...p,hp:Math.max(1,p.hp-dmg)}));
      setRooms(rs=>rs.map((x,i)=>i===idx?{...x,cleared:true}:x));
      setNotice(`⚠️ ${r.desc} You lose ${dmg} HP.`);
    } else {
      setRooms(rs=>rs.map((x,i)=>i===idx?{...x,cleared:true}:x));
      setNotice(`📜 ${r.desc}`);
    }
  }

  function combatAction(action){
    if(!combat||combat.turn!=="player"||combat.status!=="active") return;
    const s=gs(); let enemy={...combat.enemy}; let p={...player}; const log=[];

    if(action==="attack"){
      const d=rollDmg(s.atk,enemy.def); enemy.hp=Math.max(0,enemy.hp-d);
      log.push(`🗡️ You strike for ${d} damage.`);
    } else if(action==="heavy"){
      if(p.mp<5){ setClog(cl=>[...cl,"❌ Not enough MP!"]); return; }
      const d=Math.floor(rollDmg(s.atk,enemy.def)*1.95); enemy.hp=Math.max(0,enemy.hp-d); p.mp-=5;
      log.push(`💥 Heavy Strike! ${d} damage!`);
    } else if(action==="skill"){
      if(p.mp<14){ setClog(cl=>[...cl,"❌ Not enough MP! (Needs 14)"]); return; }
      const d=Math.floor(rollDmg(s.atk*1.7,enemy.def*0.25)); enemy.hp=Math.max(0,enemy.hp-d); p.mp-=14;
      log.push(`✨ Soul Slash! ${d} piercing damage!`);
    } else if(action==="flee"){
      const c=0.28+(s.agi*0.025);
      if(Math.random()<c){ setClog(cl=>[...cl,"🏃 You fled successfully!"]); setTimeout(()=>{setCombat(null);setScreen("dungeon");},900); return; }
      log.push("❌ Couldn't escape!");
    }

    if(enemy.hp<=0){
      const eG=combat.enemy.exp; const[gn,gx]=combat.enemy.g; const gA=gn+Math.floor(Math.random()*(gx-gn+1));
      log.push(`💀 ${enemy.name} defeated!`); log.push(`✨ +${eG} EXP  +${gA} Gold`);
      setGold(g=>g+gA);

      if(combat.enemy.boss){
        combat.enemy.drops.forEach(id=>{ addItem(id); log.push(`🎁 Obtained: ${ITEMS[id]?.name}!`); });
      } else if(combat.enemy.drops&&Math.random()<combat.enemy.dc){
        const id=combat.enemy.drops[Math.floor(Math.random()*combat.enemy.drops.length)];
        addItem(id); log.push(`🎁 Dropped: ${ITEMS[id]?.name}.`);
      }

      let np={...p,exp:p.exp+eG};
      while(np.exp>=expFor(np.level)){
        np.exp-=expFor(np.level); np.level++;
        np.str+=2; np.def+=1; np.agi+=1; np.maxHp+=15; np.maxMp+=7;
        np.hp=np.maxHp; np.mp=np.maxMp;
        log.push(`🌟 LEVEL UP! → Level ${np.level}  Stats increased!`);
      }
      setPlayer(np);
      setRooms(rs=>rs.map((x,i)=>i===combat.rIdx?{...x,cleared:true}:x));

      if(combat.enemy.boss){
        log.push(`🏆 Dungeon cleared!`);
        const nc=[...cleared,dunKey]; setCleared(nc);
        const unlock={thornwood:"caldrath",caldrath:"drowned",drowned:"shadowkeep"};
        if(unlock[dunKey]) setLocs(ls=>ls.map(l=>l.id===unlock[dunKey]?{...l,unlocked:true}:l));
        setClog(cl=>[...cl,...log]);
        setCombat(c=>({...c,enemy,status:"won",turn:"player"}));
        if(dunKey==="shadowkeep") setTimeout(()=>setScreen("victory"),2200);
        return;
      }
      setClog(cl=>[...cl,...log]);
      setCombat(c=>({...c,enemy,status:"won",turn:"player"})); return;
    }

    setPlayer(p); setCombat(c=>({...c,enemy,turn:"enemy"})); setClog(cl=>[...cl,...log]);

    setTimeout(()=>{
      const cs=calcStats(p,eq);
      const d=rollDmg(enemy.atk,cs.def); const ah=Math.max(0,p.hp-d);
      setClog(cl=>[...cl,`⚡ ${enemy.name} attacks for ${d}!`]);
      setCombatAnim(true); setTimeout(()=>setCombatAnim(false),350);
      if(ah<=0){
        setPlayer(pp=>({...pp,hp:0})); setClog(cl=>[...cl,"💔 You fall in battle..."]);
        setCombat(c=>({...c,status:"lost",turn:"player"}));
      } else { setPlayer(pp=>({...pp,hp:ah})); setCombat(c=>({...c,turn:"player"})); }
    },750);
  }

  function getShopItems(){
    const lvl=player?.level||1;
    const s=new Set();
    Object.entries(SHOP).forEach(([ml,ids])=>{ if(lvl>=Number(ml)) ids.forEach(id=>s.add(id)); });
    return [...s].map(id=>({id,...ITEMS[id]})).filter(Boolean);
  }

  // ════════════════════════════════════════════
  //  RENDER HELPERS
  // ════════════════════════════════════════════

  function Bar({cur,max,cls}){ return <div className={cls[0]}><div className={cls[1]} style={{width:`${Math.max(0,Math.min(100,(cur/max)*100))}%`}}/></div>; }

  function HUD(){
    const s=gs(); if(!s) return null;
    return (
      <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap",padding:"10px 16px",borderBottom:"1px solid #1a0e08",background:"#08040c"}}>
        <span className="cf gt" style={{fontSize:15,fontWeight:600,minWidth:80}}>{player.name}</span>
        <span className="dim cf" style={{fontSize:12}}>Lv.{player.level}</span>
        <div style={{display:"flex",alignItems:"center",gap:6,flex:"1 1 140px"}}>
          <span style={{color:"#b02818",fontSize:11,fontFamily:"Cinzel,serif",minWidth:20}}>HP</span>
          <Bar cur={player.hp} max={s.maxHp} cls={["hb","hf"]} />
          <span style={{color:"#c8b090",fontSize:12,minWidth:65,textAlign:"right"}}>{player.hp}/{s.maxHp}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,flex:"1 1 120px"}}>
          <span style={{color:"#2474a8",fontSize:11,fontFamily:"Cinzel,serif",minWidth:20}}>MP</span>
          <Bar cur={player.mp} max={s.maxMp} cls={["mb","mf"]} />
          <span style={{color:"#c8b090",fontSize:12,minWidth:55,textAlign:"right"}}>{player.mp}/{s.maxMp}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,minWidth:120}}>
          <span style={{color:"#6b14a0",fontSize:11,fontFamily:"Cinzel,serif"}}>EXP</span>
          <div style={{flex:1}}><Bar cur={player.exp} max={expFor(player.level)} cls={["eb","ef"]}/></div>
          <span style={{color:"#7a5c3a",fontSize:11}}>{player.exp}/{expFor(player.level)}</span>
        </div>
        <span className="gt" style={{marginLeft:"auto",fontSize:14}}>💰 {gold}</span>
      </div>
    );
  }

  function ItemCard({id,actions=[],style={}}){
    const it=ITEMS[id]; if(!it) return null;
    const tc="tag-"+(it.rarity||"common")[0];
    const statParts=[];
    if(it.atk) statParts.push(`ATK +${it.atk}`);
    if(it.def) statParts.push(`DEF ${it.def>0?"+":""}${it.def}`);
    if(it.agi) statParts.push(`AGI ${it.agi>0?"+":""}${it.agi}`);
    if(it.hp)  statParts.push(`HP +${it.hp}`);
    if(it.mp)  statParts.push(`MP +${it.mp}`);
    return (
      <div className="panel" style={{padding:"10px 12px",display:"flex",flexDirection:"column",gap:4,...style}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span className="cf" style={{fontSize:13,color:"#e4d0a8"}}>{it.name}</span>
          <span className={`cf ${tc}`} style={{fontSize:10,letterSpacing:".06em"}}>{(it.rarity||"").toUpperCase()}</span>
        </div>
        <div style={{fontSize:12,color:"#7a5c3a",fontStyle:"italic"}}>{it.desc}</div>
        {statParts.length>0&&<div style={{fontSize:12,color:"#9a7060",display:"flex",gap:8,flexWrap:"wrap"}}>{statParts.map(s=><span key={s}>{s}</span>)}</div>}
        {it.type==="consumable"&&<div style={{fontSize:12,color:"#5a8a3a"}}>{it.desc}</div>}
        {actions.length>0&&<div style={{display:"flex",gap:6,marginTop:4}}>
          {actions.map(a=><button key={a.label} className={`btn ${a.cls||""}`} style={{fontSize:11,padding:"4px 10px"}} onClick={a.fn}>{a.label}</button>)}
        </div>}
      </div>
    );
  }

  // ════════════════════════════════════════════
  //  SCREENS
  // ════════════════════════════════════════════

  if(screen==="title") return (
    <div className="gr" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"20px",background:"radial-gradient(ellipse at 50% 25%,#1c0a30 0%,#06030a 65%)"}}>
      <style>{CSS}</style>
      <div style={{textAlign:"center",maxWidth:520,width:"100%"}} className="fi">
        <div style={{fontSize:52,marginBottom:8}}>⚔️</div>
        <h1 className="ctd gt" style={{fontSize:"clamp(22px,5vw,36px)",letterSpacing:".06em",lineHeight:1.3,marginBottom:6,animation:"glow 2.5s infinite"}}>
          The Shattered Realm
        </h1>
        <p style={{color:"#6a3a1a",fontStyle:"italic",marginBottom:32,fontSize:14}}>A tale of void, valor, and the fragments of a broken world.</p>
        <div className="panel panel-g" style={{padding:"28px 32px",marginBottom:24}}>
          <p style={{fontSize:14,color:"#b8a080",lineHeight:1.85,marginBottom:22}}>
            The Void Lich <span className="gt">Malachar</span> shattered the Realm into four fragments.
            Dark creatures pour through the wounds in reality.
            You are the last wandering blade — recover the four <span className="gt">Realm Shards</span> before the world is consumed by shadow.
          </p>
          <label className="cf dim" style={{fontSize:11,letterSpacing:".1em",display:"block",marginBottom:8}}>YOUR NAME</label>
          <input value={pname} onChange={e=>setPname(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&pname.trim()&&(setPlayer(mkPlayer(pname.trim())),setScreen("worldmap"))}
            placeholder="Wanderer..."
            style={{width:"100%",background:"#0a0610",border:"1px solid #3a2018",color:"#e4d0a8",fontFamily:"'EB Garamond',serif",fontSize:15,padding:"10px 14px",borderRadius:3,outline:"none",marginBottom:14}}/>
          <button className="btn btn-p" style={{width:"100%",padding:"12px",fontSize:15}}
            onClick={()=>{ if(pname.trim()){ setPlayer(mkPlayer(pname.trim())); setScreen("worldmap"); }}}>
            Begin the Journey
          </button>
        </div>
        <div style={{display:"flex",gap:16,justifyContent:"center",fontSize:13,color:"#3a2018",flexWrap:"wrap"}}>
          <span>⚔️ Turn-based combat</span><span>🗺️ World map</span><span>🎲 Procedural dungeons</span><span>🛡️ Equipment system</span>
        </div>
      </div>
    </div>
  );

  if(screen==="victory"&&player) return (
    <div className="gr" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"radial-gradient(ellipse at 50% 30%,#1c0828 0%,#06030a 65%)"}}>
      <style>{CSS}</style>
      <div style={{textAlign:"center",maxWidth:500,padding:40}} className="fi">
        <div style={{fontSize:60,marginBottom:16}}>🔮</div>
        <h1 className="ctd gt" style={{fontSize:30,marginBottom:12,animation:"glow 2s infinite"}}>The Realm Restored</h1>
        <p style={{color:"#b8a080",lineHeight:1.9,marginBottom:24,fontSize:15}}>
          With the final Realm Shard recovered from the Void Throne, <span className="gt">{player.name}</span> returned the fragments to the Convergence Stone.
          The wounds in reality sealed. The darkness retreated.
          <br/><br/>
          <em style={{color:"#c9a030"}}>Malachar's last words echoed: "I only feared what all mortals fear." </em>
          <br/><br/>
          The world remembered what it was to have light.
        </p>
        <div className="panel panel-g" style={{padding:20,marginBottom:24,display:"flex",gap:24,justifyContent:"center",flexWrap:"wrap"}}>
          <span className="cf">Level <span className="gt">{player.level}</span></span>
          <span className="cf">Shards <span className="gt">4/4 🔮</span></span>
          <span className="cf">Gold <span className="gt">{gold}</span></span>
        </div>
        <button className="btn btn-p" style={{padding:"12px 32px",fontSize:14}}
          onClick={()=>{ setScreen("title"); setPlayer(null); setEq({weapon:"rusty_sword",armor:"cloth_robe",helmet:null,boots:"leather_boots",ring:null}); setInv(["health_potion","health_potion","mp_potion"]); setGold(50); setLocs(WORLD); setCleared([]); }}>
          Play Again
        </button>
      </div>
    </div>
  );

  if(!player) return <div className="gr"><style>{CSS}</style></div>;
  const stats=gs();

  // ── WORLD MAP ──────────────────────────────
  if(screen==="worldmap"){
    const shards=cleared.length;
    const storyLines=["The world is crumbling. Four Realm Shards are scattered across the corrupted lands. Begin in Thornwood.",
      "One shard recovered. The darkness retreats slightly. Seek the Ruins of Caldrath.",
      "Two shards secured. The power builds. The Drowned Depths await.",
      "Three shards! The final one lies within Shadowkeep. The Void Lich awaits his end.",
      "All four shards recovered! Travel to the Convergence Stone and restore the Realm!"];
    return (
      <div className="gr">
        <style>{CSS}</style>
        <HUD/>
        <div style={{maxWidth:900,margin:"0 auto",padding:"16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h2 className="cf gt" style={{fontSize:20}}>🗺️ World Map</h2>
            <div style={{display:"flex",gap:8}}>
              <button className="btn" onClick={()=>{ setPrevScr("worldmap"); setInvTab("equipment"); setScreen("inventory"); }}>⚔️ Equipment</button>
              <button className="btn" onClick={()=>{ setPrevScr("worldmap"); setInvTab("items"); setScreen("inventory"); }}>🎒 Items</button>
            </div>
          </div>
          <div className="panel" style={{padding:"12px 16px",borderColor:"#2a1808",fontSize:14,color:"#b8a080",fontStyle:"italic",marginBottom:14}}>
            📖 {storyLines[Math.min(shards,storyLines.length-1)]}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <span className="cf dim" style={{fontSize:12,letterSpacing:".08em"}}>REALM SHARDS:</span>
            {[0,1,2,3].map(i=><span key={i} style={{fontSize:22,filter:i<shards?"none":"grayscale(1) opacity(.25)"}}>🔮</span>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:12}}>
            {locs.map(loc=>{
              const isCleared=loc.dungeonKey&&cleared.includes(loc.dungeonKey);
              const ddata=loc.dungeonKey?DUNGEONS[loc.dungeonKey]:null;
              return (
                <div key={loc.id} className="panel room-card"
                  style={{opacity:loc.unlocked?1:.45,border:`1px solid ${isCleared?"#28501888":loc.type==="town"?"#3a2018":"#2a1808"}`,borderRadius:4,cursor:loc.unlocked?"pointer":"default"}}
                  onClick={()=>{ if(!loc.unlocked)return; if(loc.type==="town")setScreen("town"); else if(loc.type==="dungeon")enterDungeon(loc.dungeonKey); }}>
                  <div style={{fontSize:30,marginBottom:6}}>{loc.icon}</div>
                  <div className="cf gt" style={{fontSize:14,marginBottom:4}}>{loc.name}</div>
                  {ddata&&<div style={{fontSize:11,color:"#6a4828",marginBottom:4}}>Min Level {ddata.minLevel}</div>}
                  <div style={{fontSize:12,color:"#8a6040",lineHeight:1.5}}>
                    {!loc.unlocked?"🔒 Clear previous dungeon first":isCleared?"✅ Cleared":loc.type==="town"?"🏘️ Shop · Inn · Rest":"⚔️ Enter Dungeon"}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:14,fontSize:12,color:"#3a2018",textAlign:"center"}}>
            ATK {stats?.atk} · DEF {stats?.def} · AGI {stats?.agi} · Level {player.level}
          </div>
        </div>
      </div>
    );
  }

  // ── TOWN ───────────────────────────────────
  if(screen==="town"){
    const shopItems=getShopItems();
    return (
      <div className="gr">
        <style>{CSS}</style>
        <HUD/>
        <div style={{maxWidth:900,margin:"0 auto",padding:"16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h2 className="cf gt" style={{fontSize:20}}>🏘️ Ashenveil Village</h2>
            <button className="btn" onClick={()=>setScreen("worldmap")}>← World Map</button>
          </div>
          <div className="panel" style={{padding:"12px 16px",borderColor:"#2a1808",marginBottom:14,fontSize:14,color:"#b8a080",fontStyle:"italic"}}>
            The village blacksmith nods as you enter. The innkeeper eyes you with practiced indifference. Torchlight flickers against worn stone walls.
          </div>
          {/* Inn */}
          <div className="panel" style={{padding:"16px",marginBottom:14,border:"1px solid #2a1808"}}>
            <h3 className="cf" style={{color:"#c9a030",fontSize:15,marginBottom:8}}>🛏️ The Ashen Inn</h3>
            <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
              <p style={{fontSize:13,color:"#9a7a54",flex:1}}>Rest and fully restore HP & MP. Costs 20 gold.</p>
              <button className={`btn btn-g ${gold<20?"btn-d":""}`} onClick={()=>{ if(gold<20)return; setGold(g=>g-20); setPlayer(p=>({...p,hp:stats.maxHp,mp:stats.maxMp})); }}>
                Rest (20 💰)
              </button>
            </div>
          </div>
          {/* Shop tabs */}
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {["buy","sell","inventory"].map(t=>(
              <button key={t} className={`btn ${townTab===t?"btn-p":""}`} style={{fontSize:12}} onClick={()=>setTownTab(t)}>
                {t==="buy"?"🛒 Buy":t==="sell"?"💰 Sell":"🎒 Inventory"}
              </button>
            ))}
            <button className="btn" style={{marginLeft:"auto",fontSize:12}} onClick={()=>{ setPrevScr("town"); setInvTab("equipment"); setScreen("inventory"); }}>⚔️ Equipment</button>
          </div>

          {townTab==="buy"&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
              {shopItems.map(it=>{
                const canAfford=gold>=it.value;
                return (
                  <div key={it.id} className="panel" style={{padding:"12px",border:"1px solid #2a1808"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span className="cf" style={{fontSize:13,color:"#e4d0a8"}}>{it.name}</span>
                      <span className={`tag-${(it.rarity||"c")[0]}`} style={{fontSize:10,fontFamily:"Cinzel,serif"}}>{(it.rarity||"").toUpperCase()}</span>
                    </div>
                    <div style={{fontSize:11,color:"#7a5c3a",fontStyle:"italic",marginBottom:6}}>{it.desc}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span className="gt" style={{fontSize:13}}>💰 {it.value}</span>
                      <button className={`btn ${canAfford?"btn-p":"btn-d"}`} style={{fontSize:11,padding:"4px 10px"}}
                        onClick={()=>{ if(gold>=it.value){ setGold(g=>g-it.value); addItem(it.id); }}}>Buy</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {townTab==="sell"&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
              {inv.filter(id=>ITEMS[id]?.type!=="quest").length===0
                ? <p style={{color:"#6a4828",fontStyle:"italic",fontSize:14}}>Nothing to sell.</p>
                : [...new Set(inv.filter(id=>ITEMS[id]?.type!=="quest"))].map(id=>{
                    const it=ITEMS[id]; if(!it) return null;
                    const cnt=inv.filter(x=>x===id).length;
                    const sell=Math.floor(it.value*0.5);
                    return (
                      <div key={id} className="panel" style={{padding:"12px",border:"1px solid #2a1808"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                          <span className="cf" style={{fontSize:13,color:"#e4d0a8"}}>{it.name} {cnt>1?<span style={{color:"#6a4828"}}>x{cnt}</span>:""}</span>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{color:"#8a6040",fontSize:12}}>Sell: <span className="gt">{sell} 💰</span></span>
                          <button className="btn" style={{fontSize:11,padding:"4px 10px"}}
                            onClick={()=>{ remItem(id); setGold(g=>g+sell); }}>Sell</button>
                        </div>
                      </div>
                    );
                  })
              }
            </div>
          )}
          {townTab==="inventory"&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
              {inv.length===0
                ? <p style={{color:"#6a4828",fontStyle:"italic",fontSize:14}}>Inventory empty.</p>
                : [...new Set(inv)].map(id=>{
                    const it=ITEMS[id]; if(!it) return null;
                    const cnt=inv.filter(x=>x===id).length;
                    const acts=[];
                    if(it.type==="consumable") acts.push({label:"Use",fn:()=>useItem(id)});
                    if(it.slot) acts.push({label:"Equip",cls:"btn-p",fn:()=>equipItem(id)});
                    return <ItemCard key={id} id={id} actions={acts}/>;
                  })
              }
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── DUNGEON ────────────────────────────────
  if(screen==="dungeon"&&dunKey){
    const dun=DUNGEONS[dunKey];
    const currentR=rooms[rIdx];
    const allCleared=rooms.every(r=>r.cleared);
    const canAdvance=currentR?.cleared&&rIdx<rooms.length-1;
    const isLast=rIdx===rooms.length-1;
    return (
      <div className="gr">
        <style>{CSS}</style>
        <HUD/>
        <div style={{maxWidth:860,margin:"0 auto",padding:"16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h2 className="cf gt" style={{fontSize:18}}>{dun.icon} {dun.name}</h2>
            <div style={{display:"flex",gap:8}}>
              <button className="btn" onClick={()=>{ setPrevScr("dungeon"); setInvTab("items"); setScreen("inventory"); }}>🎒</button>
              <button className="btn btn-r" onClick={()=>{ setScreen("worldmap"); setNotice(""); }}>Retreat</button>
            </div>
          </div>

          {rIdx===0&&!currentR?.cleared&&(
            <div className="panel fi" style={{padding:"14px 16px",borderColor:"#3a2018",marginBottom:14,fontStyle:"italic",fontSize:14,color:"#b8a080",lineHeight:1.75}}>
              📖 {dun.intro}
            </div>
          )}

          {/* Room progress */}
          <div style={{display:"flex",gap:4,marginBottom:14,flexWrap:"wrap"}}>
            {rooms.map((r,i)=>(
              <div key={i} style={{
                width:28,height:28,borderRadius:3,border:`1px solid ${i===rIdx?"#c9a030":r.cleared?"#28501888":"#2a1808"}`,
                background:i===rIdx?"#2a1808":r.cleared?"#0a180a":"#0e080e",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,
                transition:"all .2s",cursor:"default"
              }} title={r.title}>
                {r.cleared?"✓":i===rIdx?"◆":r.type==="boss"?"☠":r.type==="treasure"?"💰":r.type==="rest"?"🕯":r.type==="trap"?"⚠":r.type==="story"?"📜":"⚔"}
              </div>
            ))}
          </div>

          {/* Current room */}
          {currentR&&(
            <div className="panel fi" style={{padding:"20px",border:`1px solid ${currentR.cleared?"#28501888":"#3a2018"}`,marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <h3 className="cf" style={{fontSize:16,color:"#e4d0a8"}}>{currentR.title}</h3>
                <span style={{fontSize:11,fontFamily:"Cinzel,serif",color:"#6a4828",letterSpacing:".06em"}}>
                  {currentR.type==="boss"?"BOSS":currentR.type==="combat"?"COMBAT":currentR.type==="treasure"?"TREASURE":currentR.type==="rest"?"SANCTUARY":currentR.type==="trap"?"DANGER":"LORE"}
                </span>
              </div>
              {currentR.desc&&<p style={{fontSize:14,color:"#9a7a54",fontStyle:"italic",lineHeight:1.75,marginBottom:12}}>{currentR.desc}</p>}
              {currentR.type==="combat"&&!currentR.cleared&&(
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <span style={{fontSize:22}}>👁️</span>
                  <span className="cf" style={{color:"#d04020",fontSize:14}}>{currentR.enemy?.name}</span>
                  <span style={{color:"#6a4828",fontSize:12}}>HP: {currentR.enemy?.maxHp} · ATK: {currentR.enemy?.atk}</span>
                </div>
              )}
              {currentR.type==="boss"&&!currentR.cleared&&(
                <div style={{background:"#100408",border:"1px solid #5a0a0a",borderRadius:3,padding:"10px 14px",marginBottom:12}}>
                  <div className="cf" style={{color:"#d04020",fontSize:15,marginBottom:4}}>⚠ BOSS: {currentR.enemy?.name}</div>
                  <div style={{fontSize:12,color:"#8a4a3a"}}>HP: {currentR.enemy?.maxHp} · ATK: {currentR.enemy?.atk} · DEF: {currentR.enemy?.def}</div>
                </div>
              )}
              {notice&&currentR.cleared&&<div style={{background:"#0a1208",border:"1px solid #28501888",borderRadius:3,padding:"10px 12px",fontSize:13,color:"#90b870",marginBottom:10}}>{notice}</div>}
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {!currentR.cleared&&(
                  <button className={`btn ${currentR.type==="boss"?"btn-r":currentR.type==="combat"?"btn-r":"btn-p"}`}
                    onClick={()=>processRoom(rIdx)}>
                    {currentR.type==="combat"||currentR.type==="boss"?"⚔️ Engage":currentR.type==="treasure"?"💰 Open Chest":currentR.type==="rest"?"🕯️ Rest Here":currentR.type==="trap"?"👣 Proceed":"📜 Investigate"}
                  </button>
                )}
                {canAdvance&&(
                  <button className="btn btn-p" onClick={()=>{ setRIdx(i=>i+1); setNotice(""); }}>
                    → Advance to Next Room
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Dungeon cleared */}
          {allCleared&&cleared.includes(dunKey)&&(
            <div className="panel fi" style={{padding:"16px",borderColor:"#28501888",textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:8}}>🏆</div>
              <div className="cf gt" style={{fontSize:18,marginBottom:8}}>Dungeon Cleared!</div>
              <p style={{color:"#8a8060",fontSize:13,marginBottom:12}}>The dungeon has been conquered. A new area has been unlocked on the World Map.</p>
              <button className="btn btn-p" onClick={()=>{ setScreen("worldmap"); setNotice(""); }}>Return to World Map</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── COMBAT ─────────────────────────────────
  if(screen==="combat"&&combat){
    const e=combat.enemy; const s=stats;
    const ehpPct=Math.max(0,(e.hp/e.maxHp)*100);
    const phpPct=Math.max(0,(player.hp/(s?.maxHp||1))*100);
    const isBusy=combat.turn==="enemy";
    const isDone=combat.status!=="active";
    return (
      <div className="gr" style={{minHeight:"100vh",background:"radial-gradient(ellipse at 50% 0%,#1a0808 0%,#06030a 60%)"}}>
        <style>{CSS}</style>
        <HUD/>
        <div style={{maxWidth:800,margin:"0 auto",padding:"16px"}}>
          <h2 className="cf" style={{color:"#d04020",fontSize:18,marginBottom:14}}>⚔️ Combat — {DUNGEONS[dunKey]?.name}</h2>

          {/* Combatants */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 60px 1fr",gap:12,marginBottom:16,alignItems:"center"}}>
            {/* Enemy */}
            <div className={`panel ${combatAnim?"shake":""}`} style={{padding:"16px",border:"1px solid #5a1010"}}>
              <div className="cf" style={{color:"#d04020",fontSize:15,marginBottom:2}}>{e.name}</div>
              {e.boss&&<div style={{fontSize:11,color:"#8a3020",fontStyle:"italic",marginBottom:4}}>{e.bossDesc?.slice(0,80)}...</div>}
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                <span style={{color:"#b02818",fontSize:11,fontFamily:"Cinzel,serif"}}>HP</span>
                <div className="hb" style={{flex:1}}><div className="hf" style={{width:`${ehpPct}%`}}/></div>
                <span style={{color:"#c8b090",fontSize:12}}>{e.hp}/{e.maxHp}</span>
              </div>
              <div style={{fontSize:12,color:"#6a4828"}}>ATK {e.atk} · DEF {e.def} · AGI {e.agi}</div>
            </div>
            <div style={{textAlign:"center",fontSize:24}}>⚡</div>
            {/* Player */}
            <div className="panel" style={{padding:"16px",border:"1px solid #2a5018"}}>
              <div className="cf gt" style={{fontSize:15,marginBottom:2}}>{player.name}</div>
              <div style={{fontSize:11,color:"#6a4828",marginBottom:4}}>Level {player.level}</div>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                <span style={{color:"#b02818",fontSize:11,fontFamily:"Cinzel,serif"}}>HP</span>
                <div className="hb" style={{flex:1}}><div className="hf" style={{width:`${phpPct}%`}}/></div>
                <span style={{color:"#c8b090",fontSize:12}}>{player.hp}/{s?.maxHp}</span>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                <span style={{color:"#2474a8",fontSize:11,fontFamily:"Cinzel,serif"}}>MP</span>
                <div className="mb" style={{flex:1}}><div className="mf" style={{width:`${Math.max(0,(player.mp/(s?.maxMp||1))*100)}%`}}/></div>
                <span style={{color:"#c8b090",fontSize:12}}>{player.mp}/{s?.maxMp}</span>
              </div>
              <div style={{fontSize:12,color:"#6a4828"}}>ATK {s?.atk} · DEF {s?.def} · AGI {s?.agi}</div>
            </div>
          </div>

          {/* Actions */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div className="panel" style={{padding:"12px",border:"1px solid #2a1808"}}>
                <div className="cf dim" style={{fontSize:11,letterSpacing:".08em",marginBottom:8}}>ACTIONS</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  <button className={`btn btn-r ${isDone||isBusy?"btn-d":""}`} onClick={()=>combatAction("attack")}>⚔️ Attack</button>
                  <button className={`btn ${isDone||isBusy||player.mp<5?"btn-d":""}`} style={{borderColor:"#603010",color:"#d08020"}} onClick={()=>combatAction("heavy")}>
                    💥 Heavy (5 MP)
                  </button>
                  <button className={`btn ${isDone||isBusy||player.mp<14?"btn-d":""}`} style={{borderColor:"#401878",color:"#a050d0"}} onClick={()=>combatAction("skill")}>
                    ✨ Soul Slash (14 MP)
                  </button>
                  <button className={`btn ${isDone||isBusy?"btn-d":""}`} style={{borderColor:"#284810",color:"#709050"}} onClick={()=>combatAction("flee")}>
                    🏃 Flee
                  </button>
                </div>
              </div>
              {/* Items in combat */}
              <div className="panel" style={{padding:"12px",border:"1px solid #2a1808"}}>
                <div className="cf dim" style={{fontSize:11,letterSpacing:".08em",marginBottom:6}}>USE ITEM</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {inv.filter(id=>ITEMS[id]?.type==="consumable").length===0
                    ? <span style={{fontSize:12,color:"#6a4828",fontStyle:"italic"}}>No usable items</span>
                    : [...new Set(inv.filter(id=>ITEMS[id]?.type==="consumable"))].map(id=>{
                        const it=ITEMS[id]; const cnt=inv.filter(x=>x===id).length;
                        return <button key={id} className={`btn btn-g ${isDone?"btn-d":""}`} style={{fontSize:11,padding:"4px 8px"}}
                          onClick={()=>{ const msg=useItem(id); if(msg) setClog(cl=>[...cl,`🧪 ${msg}`]); }}>
                          {it?.name} {cnt>1?`x${cnt}`:""}
                        </button>;
                      })
                  }
                </div>
              </div>
            </div>

            {/* Combat log */}
            <div className="panel" style={{padding:"12px",border:"1px solid #2a1808"}}>
              <div className="cf dim" style={{fontSize:11,letterSpacing:".08em",marginBottom:6}}>BATTLE LOG</div>
              <div ref={logRef} style={{height:160,overflowY:"auto",display:"flex",flexDirection:"column",gap:3}}>
                {clog.map((l,i)=>(
                  <div key={i} style={{fontSize:12,color:l.startsWith("💀")||l.startsWith("💔")?"#d04020":l.startsWith("🌟")?"#c9a030":l.startsWith("🎁")?"#66bb6a":l.startsWith("⚡")?"#e07040":"#b8a080",lineHeight:1.5,animation:"fadeIn .3s ease"}}>
                    {l}
                  </div>
                ))}
                {isBusy&&<div className="blink" style={{fontSize:12,color:"#6a4828"}}>Enemy is acting...</div>}
              </div>
            </div>
          </div>

          {/* Post-combat buttons */}
          {combat.status==="won"&&(
            <div className="panel fi" style={{padding:"14px",borderColor:"#28501888",textAlign:"center"}}>
              <button className="btn btn-g" onClick={()=>{ setCombat(null); setScreen("dungeon"); }}>Continue Exploring →</button>
            </div>
          )}
          {combat.status==="lost"&&(
            <div className="panel fi" style={{padding:"14px",borderColor:"#5a1010",textAlign:"center"}}>
              <p style={{color:"#d04020",marginBottom:12,fontSize:14}}>You have been defeated. Retreat to the village to recover.</p>
              <button className="btn btn-r" onClick={()=>{
                const s2=calcStats(player,eq);
                setPlayer(p=>({...p,hp:Math.floor(s2.maxHp*0.3),mp:Math.floor(s2.maxMp*0.3)}));
                setCombat(null); setScreen("worldmap");
              }}>Retreat (return with 30% HP)</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── INVENTORY / EQUIPMENT ──────────────────
  if(screen==="inventory"){
    const slots=[
      {k:"weapon",label:"Weapon",icon:"⚔️"},
      {k:"armor",label:"Armor",icon:"🛡️"},
      {k:"helmet",label:"Helmet",icon:"⛑️"},
      {k:"boots",label:"Boots",icon:"👢"},
      {k:"ring",label:"Ring",icon:"💍"},
    ];
    const invItems=[...new Set(inv)].map(id=>({id,...ITEMS[id]})).filter(x=>x.name);
    return (
      <div className="gr">
        <style>{CSS}</style>
        <HUD/>
        <div style={{maxWidth:900,margin:"0 auto",padding:"16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h2 className="cf gt" style={{fontSize:20}}>⚔️ Equipment & Items</h2>
            <button className="btn" onClick={()=>setScreen(prevScr)}>← Back</button>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <button className={`btn ${invTab==="equipment"?"btn-p":""}`} onClick={()=>setInvTab("equipment")}>Equipment Slots</button>
            <button className={`btn ${invTab==="items"?"btn-p":""}`} onClick={()=>setInvTab("items")}>Inventory ({inv.length})</button>
          </div>

          {invTab==="equipment"&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
              {slots.map(({k,label,icon})=>{
                const id=eq[k]; const it=id?ITEMS[id]:null;
                return (
                  <div key={k} className="panel" style={{padding:"14px",border:"1px solid #2a1808"}}>
                    <div className="cf dim" style={{fontSize:11,letterSpacing:".08em",marginBottom:8}}>{icon} {label.toUpperCase()}</div>
                    {it?(
                      <>
                        <div className="cf" style={{color:"#e4d0a8",fontSize:14,marginBottom:2}}>{it.name}</div>
                        <div style={{fontSize:11,color:"#7a5c3a",fontStyle:"italic",marginBottom:6}}>{it.desc}</div>
                        <div style={{fontSize:12,color:"#9a7060",marginBottom:8}}>
                          {it.atk?`ATK +${it.atk} `:""}{it.def?`DEF ${it.def>0?"+":""}${it.def} `:""}{it.agi?`AGI ${it.agi>0?"+":""}${it.agi} `:""}{it.hp?`HP +${it.hp} `:""}{it.mp?`MP +${it.mp}`:""}
                        </div>
                        <button className="btn btn-r" style={{fontSize:11,padding:"4px 10px"}} onClick={()=>unequip(k)}>Unequip</button>
                      </>
                    ):(
                      <div style={{color:"#3a2018",fontStyle:"italic",fontSize:13}}>— Empty slot —</div>
                    )}
                  </div>
                );
              })}
              {/* Total stats panel */}
              <div className="panel panel-g" style={{padding:"14px"}}>
                <div className="cf gt" style={{fontSize:12,letterSpacing:".08em",marginBottom:10}}>TOTAL STATS</div>
                {[["⚔️ ATK",stats?.atk],["🛡️ DEF",stats?.def],["💨 AGI",stats?.agi],["❤️ Max HP",stats?.maxHp],["💠 Max MP",stats?.maxMp]].map(([l,v])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                    <span style={{color:"#9a7a54"}}>{l}</span><span className="gt">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {invTab==="items"&&(
            <div>
              {invItems.length===0?(<p style={{color:"#6a4828",fontStyle:"italic",fontSize:14}}>Inventory is empty.</p>):(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
                  {invItems.map(({id})=>{
                    const it=ITEMS[id]; if(!it) return null;
                    const cnt=inv.filter(x=>x===id).length;
                    const acts=[];
                    if(it.type==="consumable") acts.push({label:"Use",fn:()=>{ const msg=useItem(id); if(msg) setNotice(msg); }});
                    if(it.slot) acts.push({label:"Equip",cls:"btn-p",fn:()=>equipItem(id)});
                    return (
                      <div key={id} className="panel" style={{padding:"12px",border:"1px solid #2a1808"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                          <span className="cf" style={{fontSize:13,color:"#e4d0a8"}}>{it.name} {cnt>1?<span style={{color:"#6a4828"}}>×{cnt}</span>:""}</span>
                          <span className={`tag-${(it.rarity||"c")[0]}`} style={{fontSize:10,fontFamily:"Cinzel,serif"}}>{(it.rarity||"").slice(0,3).toUpperCase()}</span>
                        </div>
                        <div style={{fontSize:11,color:"#7a5c3a",fontStyle:"italic",marginBottom:6}}>{it.desc}</div>
                        {acts.length>0&&<div style={{display:"flex",gap:6}}>{acts.map(a=><button key={a.label} className={`btn ${a.cls||""}`} style={{fontSize:11,padding:"4px 10px"}} onClick={a.fn}>{a.label}</button>)}</div>}
                      </div>
                    );
                  })}
                </div>
              )}
              {notice&&<div style={{marginTop:12,background:"#0a1208",border:"1px solid #285018",borderRadius:3,padding:"10px",fontSize:13,color:"#90b870"}}>{notice}</div>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return <div className="gr"><style>{CSS}</style><div style={{padding:20,color:"#6a4828"}}>Loading…</div></div>;
}
