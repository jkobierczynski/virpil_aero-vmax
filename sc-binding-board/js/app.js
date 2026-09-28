(() => {
"use strict";
const W = 1600, MIN_H = 900, CW = 210, GAP = 16, MARGIN = 30;
/* Product photos supplied by the user (VIRPIL official imagery), background removed. */
const IMG = {sA:"assets/virpil/aeromax-r-view1.webp", sB:"assets/virpil/aeromax-r-view2.webp", tA:"assets/virpil/vmax-throttle-view1.webp", tB:"assets/virpil/vmax-throttle-view2.webp"};
const AR = {sA:393/502, sB:393/516, tA:539/571, tB:542/548};
const PRESETS = {
  "virpil-stick":      {name:"Aeromax-R stick · both views", src:[IMG.sA, IMG.sB], ar:[AR.sA, AR.sB]},
  "virpil-stick-a":    {name:"Aeromax-R stick · view 1",     src:[IMG.sA],         ar:[AR.sA]},
  "virpil-stick-b":    {name:"Aeromax-R stick · view 2",     src:[IMG.sB],         ar:[AR.sB]},
  "virpil-throttle":   {name:"VMAX throttle · both views",   src:[IMG.tA, IMG.tB], ar:[AR.tA, AR.tB]},
  "virpil-throttle-a": {name:"VMAX throttle · view 1",       src:[IMG.tA],         ar:[AR.tA]},
  "virpil-throttle-b": {name:"VMAX throttle · view 2",       src:[IMG.tB],         ar:[AR.tB]},
};
function detectPreset(dev){
  const p = (dev.product||"").toLowerCase();
  if (!p || !/^(js|g)\d/.test(dev.id)) return null;
  if (/throttle|vmax|\bthr\b|cm3 thr/.test(p)) return {preset:"virpil-throttle", mirror:false};
  if (/stick|aero|alpha|mongoos|warbrd|constellation|grip|joystick/.test(p))
    return {preset:"virpil-stick", mirror:/^(l-|left\b|l\s)/.test(p.trim())};
  return null;
}
const imageFor = lay => lay.preset === "custom" ? (lay.image ? [lay.image] : null) : (lay.preset && PRESETS[lay.preset] ? PRESETS[lay.preset].src : null);

/* ------------------------------------------------------------ categories */
const CATS = [
  {id:"combat",  name:"Combat"},
  {id:"flight",  name:"Flight Control"},
  {id:"turret",  name:"Turret"},
  {id:"power",   name:"Power"},
  {id:"mining",  name:"Mining"},
  {id:"salvage", name:"Salvage"},
  {id:"camera",  name:"Camera"},
  {id:"misc",    name:"Miscellaneous"},
  {id:"foot",    name:"On Foot"},
  {id:"vehicle", name:"Ground Vehicle"},
  {id:"gremlin", name:"Joystick Gremlin"},
  {id:"unbound", name:"Unbound"},
];
const CAT_ORDER = Object.fromEntries(CATS.map((c,i)=>[c.id,i]));
function categorize(map, action){
  const s = (map + " " + action).toLowerCase();
  if (/mining|mine_|extract|fracture|disintegrat/.test(s)) return "mining";
  if (/salvage|tractor/.test(s)) return "salvage";
  if (/turret/.test(s)) return "turret";
  if (/^vehicle|ground_vehicle|mfd_vehicle/.test(map.toLowerCase())) return "vehicle";
  if (/^(player|prone|zero_gravity|fps|character|incapacitated|eva)/.test(map.toLowerCase())) return "foot";
  if (/power|shield|_capacitor|_cap_/.test(s)) return "power";
  if (/spaceship_view|_view|zoom|freelook|look_behind|headtrack|head_track|camera|cinematic/.test(s)) return "camera";
  if (/weapon|missile|target|attack|countermeasure|defensive|gimbal|decoy|noise|_pip|emp|qig|combat/.test(s)) return "combat";
  if (/movement|strafe|pitch|yaw|roll|ifcs|afterburner|brake|boost|quantum|qdrive|landing|autoland|vtol|dock|throttle|speed|cruise|decouple|esp|gforce|spaceship_hud|flight/.test(s)) return "flight";
  return "misc";
}

/* ------------------------------------------------------------ action names */
const NAMES = {
  v_attack1_group1:"Fire Weapon Group 1", v_attack1_group2:"Fire Weapon Group 2", v_attack1_group3:"Fire Weapon Group 3",
  v_weapon_launch_missile:"Launch Missile", v_weapon_toggle_arm_missiles:"Arm Missiles", v_weapon_arm_missile:"Arm Missiles",
  v_weapon_cycle_missile_fwd:"Missile Type Next", v_weapon_cycle_missile_back:"Missile Type Previous",
  v_weapon_increase_max_missiles:"Raise Missile Count", v_weapon_decrease_max_missiles:"Lower Missile Count", v_weapon_reset_max_missiles:"Reset Missile Count",
  v_weapon_countermeasure_decoy_launch:"Launch Decoy", v_weapon_countermeasure_decoy_launch_panic:"Panic Decoy", v_weapon_countermeasure_noise_launch:"Launch Noise",
  v_weapon_toggle_lead_lag_pip:"Lead/Lag Pip Toggle", v_weapon_gimbal_toggle:"Gimbal Mode Toggle", v_weapon_cycle_gimbal_mode:"Gimbal Cycle Fixed/Auto",
  v_target_cycle_hostile_fwd:"Hostile Target Forward", v_target_cycle_hostile_back:"Hostile Target Backward", v_target_cycle_hostile_reset:"Hostile Target Closest",
  v_target_cycle_all_fwd:"All Target Forward", v_target_cycle_all_back:"All Target Backward", v_target_cycle_all_reset:"All Target Closest",
  v_target_cycle_attacker_fwd:"Attacker Target Forward", v_target_cycle_attacker_back:"Attacker Target Backward", v_target_cycle_attacker_reset:"Attacker Target Closest",
  v_target_cycle_subitem_fwd:"Sub-target Next", v_target_cycle_subitem_back:"Sub-target Previous", v_target_cycle_subitem_reset:"Sub-target Reset",
  v_target_reticle_focus:"Target Under Reticle", v_target_under_reticle:"Target Under Reticle", v_target_unlock:"Unlock Target", v_target_unlock_selected:"Unlock Current Target",
  v_toggle_missile_mode:"Missile Operator Mode", v_toggle_guns_mode:"Guns Operator Mode", v_toggle_scan_mode:"Scanning Mode", v_toggle_mining_mode:"Mining Mode",
  v_toggle_salvage_mode:"Salvage Mode", v_toggle_quantum_mode:"Quantum Mode", v_toggle_qdrive_engagement:"Engage Quantum", v_toggle_qdrive_spooling:"Spool Quantum",
  v_afterburner:"Boost", v_brake:"Space Brake", v_ifcs_toggle_cruise_control:"Cruise Control", v_ifcs_toggle_vector_decoupling:"Decoupled Mode",
  v_ifcs_toggle_esp:"ESP Toggle", v_ifcs_toggle_gforce_safety:"G-Force Safety Toggle", v_ifcs_toggle_speed_limiter:"Speed Limiter Toggle",
  v_ifcs_speed_limiter_increase:"Speed Limiter Up", v_ifcs_speed_limiter_decrease:"Speed Limiter Down", v_ifcs_speed_limiter_abs:"Speed Limiter (abs)",
  v_speed_range_up:"Speed Limiter Up", v_speed_range_down:"Speed Limiter Down", v_ifcs_throttle_swap_mode:"Throttle Mode Swap",
  v_strafe_up:"Strafe Up", v_strafe_down:"Strafe Down", v_strafe_left:"Strafe Left", v_strafe_right:"Strafe Right",
  v_strafe_forward:"Strafe Forward", v_strafe_back:"Strafe Backward",
  v_strafe_vertical:"Strafe Up / Down", v_strafe_lateral:"Strafe Left / Right", v_strafe_longitudinal:"Throttle Forward / Back",
  v_pitch:"Pitch", v_yaw:"Yaw", v_roll:"Roll", v_pitch_up:"Pitch Up", v_pitch_down:"Pitch Down", v_yaw_left:"Yaw Left", v_yaw_right:"Yaw Right",
  v_roll_left:"Roll Left", v_roll_right:"Roll Right",
  v_toggle_landing_system:"Landing Gear", v_autoland:"Auto Land", v_toggle_vtol:"VTOL Toggle",
  v_power_toggle:"Power On / Off", v_power_toggle_thrusters:"Thruster Power Toggle", v_power_toggle_shields:"Shields Power Toggle",
  v_power_toggle_weapons:"Weapon Power Toggle", v_flightready:"Flight Ready",
  v_shield_raise_level_front:"Shields Front", v_shield_raise_level_back:"Shields Aft", v_shield_raise_level_left:"Shields Left",
  v_shield_raise_level_right:"Shields Right", v_shield_raise_level_top:"Shields Top", v_shield_raise_level_bottom:"Shields Bottom", v_shield_reset_level:"Shields Reset",
  v_view_cycle_fwd:"Cycle Camera View", v_view_look_behind:"Look Behind", v_view_freelook_mode:"Freelook", v_view_zoom_in:"Zoom In", v_view_zoom_out:"Zoom Out",
  v_view_dynamic_zoom_toggle:"Dynamic Zoom", v_eject:"Eject", v_exit:"Exit Seat", v_emergency_exit:"Emergency Exit", v_self_destruct:"Self Destruct",
  v_lock_all_doors:"Lock All Doors", v_unlock_all_doors:"Unlock All Doors", v_open_all_doors:"Open All Doors", v_close_all_doors:"Close All Doors",
  v_toggle_all_doors:"Toggle Doors", v_lights:"Lights Toggle", v_invoke_ping:"Scan Ping", v_scanning_trigger_scan:"Activate Scan",
  v_toggle_mining_laser_fire:"Fire Mining Laser", v_toggle_mining_laser_type:"Mining Laser Type", v_increase_mining_throttle:"Mining Power Up",
  v_decrease_mining_throttle:"Mining Power Down", v_mining_use_consumable1:"Mining Module 1", v_mining_use_consumable2:"Mining Module 2", v_mining_use_consumable3:"Mining Module 3",
  v_salvage_toggle_fire_focused:"Fire Salvage Beam", v_salvage_toggle_fire_left:"Fire Left Tool", v_salvage_toggle_fire_right:"Fire Right Tool",
  v_salvage_cycle_modifiers_structural:"Cycle Structural Modes",
  turret_recenter:"Recenter Turret", turret_pitch:"Turret Pitch", turret_yaw:"Turret Yaw", turret_toggle_mouse_mode:"Turret Mouse Mode",
  foip_pushtotalk:"VOIP Push-to-Talk", pc_interaction_mode:"Interaction Mode", pc_personal_thought:"Inner Thought", ui_toggle_map:"Starmap",
  v_atc_request:"Request Landing", v_request_docking:"Request Docking", v_toggle_docking_mode:"Docking Mode", v_dock_toggle_view:"Toggle Docking Camera",
  v_capacitor_assignment_reset:"Capacitor Reset",
};
const ABBR = {ifcs:"IFCS",esp:"ESP",mfd:"MFD",hud:"HUD",atc:"ATC",vtol:"VTOL",scm:"SCM",emp:"EMP",qed:"QED",qdrive:"Quantum Drive",fwd:"Forward",back:"Back",
  abs:"(abs)",rel:"(rel)",voip:"VOIP",foip:"FOIP",ui:"UI",pip:"Pip",ptt:"PTT",fps:"FPS",lmb:"LMB",rmb:"RMB",ads:"ADS",aa:"AA",ir:"IR",em:"EM",cs:"CS",
  tractorbeam:"Tractor Beam",gforce:"G-Force",pc:"",v:""};
function prettyAction(a){
  if (NAMES[a]) return NAMES[a];
  const words = a.replace(/^(v_|pc_|ui_)/,"").split(/_+/).filter(Boolean)
    .map(w => (w in ABBR) ? ABBR[w] : (/^\d+$/.test(w) ? w : w[0].toUpperCase()+w.slice(1)))
    .filter(Boolean);
  return words.join(" ") || a;
}

/* ------------------------------------------------------------ inputs */
const MODKEYS = new Set(["lalt","ralt","lctrl","rctrl","lshift","rshift","lwin","rwin"]);
const KEYNAMES = {lalt:"L ALT",ralt:"R ALT",lctrl:"L CTRL",rctrl:"R CTRL",lshift:"L SHIFT",rshift:"R SHIFT",space:"SPACE",enter:"ENTER",
  backspace:"BKSP",escape:"ESC",tab:"TAB",capslock:"CAPS",up:"↑",down:"↓",left:"←",right:"→",pgup:"PG UP",pgdn:"PG DN",insert:"INS",
  delete:"DEL",home:"HOME",end:"END",mouse1:"MOUSE 1",mouse2:"MOUSE 2",mouse3:"MOUSE 3",mouse4:"MOUSE 4",mouse5:"MOUSE 5",
  mwheel_up:"WHEEL ↑",mwheel_down:"WHEEL ↓",maxis_x:"MOUSE X",maxis_y:"MOUSE Y",x:"X AXIS",y:"Y AXIS",z:"Z AXIS",rotx:"ROT X",roty:"ROT Y",rotz:"ROT Z",
  slider1:"SLIDER 1",slider2:"SLIDER 2",throttle:"THROTTLE"};
const DIRS = {up:"▲",down:"▼",left:"◀",right:"▶",neg:"−",pos:"+"};
const VAXES = {1:"x",2:"y",3:"z",4:"rotx",5:"roty",6:"rotz",7:"slider1",8:"slider2"};
const DIR_ORDER = {up:0,right:1,down:2,left:3,"":4,neg:5,pos:6};
const TAG_ORDER = {"":0,T:1,H:2,LP:3,DT:4,ST:5,R:6};
function prettyKey(k){
  if (KEYNAMES[k]) return KEYNAMES[k];
  let m;
  if ((m = /^button(\d+)$/.exec(k))) return "BTN " + m[1];
  if ((m = /^hat(\d+)$/.exec(k))) return "HAT " + m[1];
  if ((m = /^axis(\d+)$/.exec(k))) return "AXIS " + m[1] + (VAXES[m[1]] ? " · " + VAXES[m[1]].toUpperCase() : "");
  if ((m = /^np_(.+)$/.exec(k))) return "NUM " + m[1].toUpperCase();
  return k.replace(/_/g," ").toUpperCase();
}
function nodeKind(node){
  if (/^button\d+$/.test(node)) return "button";
  if (/^hat\d+$/.test(node)) return "hat";
  if (/^(x|y|z|rotx|roty|rotz|slider\d|throttle|maxis_[xy]|axis\d+)$/.test(node)) return "axis";
  return "key";
}
function modeTag(mode, multiTap){
  const m = (mode||"").toLowerCase();
  if (m.includes("double_tap") || String(multiTap) === "2") return "DT";
  if (m.includes("hold")) return "H";
  if (m === "delayed_press" || m === "delayed_press_medium" || m === "delayed_press_long") return "LP";
  if (m === "tap" || m === "tap_quicker") return "T";
  if (m === "smart_toggle") return "ST";
  if (m === "release") return "R";
  return "";
}

/* ------------------------------------------------------------ parser */
function parseActionMaps(text){
  const doc = new DOMParser().parseFromString(text, "application/xml");
  if (doc.getElementsByTagName("parsererror").length) throw new Error("That file isn’t valid XML. Pick actionmaps.xml or a layout exported from the game.");
  const root = doc.documentElement;
  if (!/actionmaps/i.test(root.nodeName)) throw new Error("No <ActionMaps> found. This doesn’t look like a Star Citizen bindings file.");
  const profiles = [...root.getElementsByTagName("ActionProfiles")];
  const prof = profiles.find(p => p.getAttribute("profileName") === "default") || profiles[0] || root;
  const hdr = root.getElementsByTagName("CustomisationUIHeader")[0];
  const profileName = prof.getAttribute("profileName") || root.getAttribute("profileName") || (hdr && hdr.getAttribute("label")) || "profile";

  const devInfo = {};
  for (const o of prof.getElementsByTagName("options")){
    const type = (o.getAttribute("type")||"").toLowerCase();
    const inst = o.getAttribute("instance") || "1";
    const prefix = {joystick:"js",keyboard:"kb",mouse:"mo",gamepad:"gp",xboxpad:"gp"}[type];
    if (!prefix) continue;
    const product = (o.getAttribute("Product")||"").replace(/\{[^}]*\}/g,"").trim();
    devInfo[prefix+inst] = {product, type};
  }
  const bindings = [];
  for (const am of prof.getElementsByTagName("actionmap")){
    const map = am.getAttribute("name") || "";
    for (const act of am.getElementsByTagName("action")){
      const name = act.getAttribute("name") || "";
      for (const rb of act.getElementsByTagName("rebind")){
        const raw = (rb.getAttribute("input")||"");
        const m = /^(js|kb|mo|gp)(\d+)_(.*)$/i.exec(raw.trim());
        if (!m) continue;
        const rest = m[3].trim();
        if (!rest) continue;                          // explicitly cleared
        const toks = rest.split("+").map(s=>s.trim().toLowerCase()).filter(Boolean);
        const key = toks.pop();
        const mods = toks;
        let node = key, dir = "";
        const h = /^(hat\d+)_(up|down|left|right)$/.exec(key);
        if (h){ node = h[1]; dir = h[2]; }
        const dev = m[1].toLowerCase() + m[2];
        bindings.push({
          dev, node, dir, key, mods, raw,
          mode: rb.getAttribute("activationMode") || "",
          tag: modeTag(rb.getAttribute("activationMode"), rb.getAttribute("multiTap")),
          action: name, map, label: prettyAction(name), cat: categorize(map, name),
        });
      }
    }
  }
  if (!bindings.length) throw new Error("The file parsed, but it contains no bindings. The live actionmaps.xml only stores changes from the defaults — try a complete-profile export.");
  const devices = {};
  for (const b of bindings){
    if (!devices[b.dev]){
      const info = devInfo[b.dev] || {};
      const pfx = b.dev.slice(0,2), n = b.dev.slice(2);
      const generic = {js:"Joystick "+n, kb:"Keyboard", mo:"Mouse", gp:"Gamepad"}[pfx];
      devices[b.dev] = {id:b.dev, product: info.product || "", title: shortProduct(info.product) || generic, generic, bindings:[]};
    }
    devices[b.dev].bindings.push(b);
  }
  return {profileName, devices, bindings};
}
function shortProduct(p){
  if (!p) return "";
  return p.replace(/\s+/g," ").trim();
}

/* ------------------------------------------------------------ storage */
const STORAGE_OK = (() => { try { const k = "scbb.__probe"; localStorage.setItem(k, "1"); const ok = localStorage.getItem(k) === "1"; localStorage.removeItem(k); return ok; } catch { return false; } })();
const store = {
  get(k, d){ try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
};
let layouts = store.get("scbb.layouts", {});
function layoutKey(dev){ return dev.lkey || (dev.product || dev.id).toLowerCase(); }
// Two devices can report the same name (both vJoy devices are "vJoy Device"; a physical stick can show up
// both through Gremlin and in the game). Give every device a key that is unique within the loaded files.
function assignLayoutKeys(devices){
  const count = {};
  const base = d => (d.product || d.id).toLowerCase();
  for (const d of Object.values(devices)) count[base(d)] = (count[base(d)]||0) + 1;
  for (const d of Object.values(devices)){
    const b = base(d);
    d.lkey = (count[b] > 1 && !/^g\d/.test(d.id)) ? b + "#" + d.id : b;
  }
}
function saveLayouts(){
  if (!store.set("scbb.layouts", layouts)) toast("Couldn’t save the layout in this browser (storage full or blocked). Use Layout JSON to keep a copy.", true);
}

/* ------------------------------------------------------------ state */
const S = {
  data:null, fileName:"", isExample:false, scDefault:false, grDefault:false, cmp:null, onlyDiff:false,
  tab: store.get("scbb.tab", null),
  off: new Set(store.get("scbb.off", [])),
  q:"", arrange:false, sort:{col:"dev",dir:1},
  sides:{left:null,right:null}, sc:null, scName:"", gr:null, grName:"", vmap: store.get("scbb.vmap", {1:"js1",2:"js2",3:"js3",4:"js4"}),
};
const $ = s => document.querySelector(s);
const el = (tag, attrs={}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)){
    if (k === "class") e.className = v; else if (k === "style") e.setAttribute("style", v);
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v); else if (v !== false && v != null) e.setAttribute(k, v === true ? "" : v);
  }
  for (const c of kids.flat()) if (c != null) e.append(c.nodeType ? c : document.createTextNode(c));
  return e;
};
function toast(msg, err, ms){
  document.querySelectorAll(".toast").forEach(t=>t.remove());
  const t = el("div",{class:"toast"+(err?" err":""), role:"status"}, msg);
  document.body.append(t); setTimeout(()=>t.remove(), ms || (err ? 6000 : 2600));
}

function sniff(text){
  const head = text.slice(0, 4000);
  if (/<ActionMaps/i.test(head)) return "sc";
  if (/<profile[\s>]/.test(head) && /<devices>/.test(text)) return "gremlin";
  return null;
}
function load(text, fileName, isExample, quiet, isDefault){
  try{
    const kind = sniff(text);
    if (kind === "gremlin"){
      S.gr = parseGremlin(text); S.grName = fileName; S.grDefault = !!isDefault;
      if (!isDefault){
        store.set("scbb.gremlin", {text, fileName});
        if (S.scDefault){ S.sc = null; S.scDefault = false; S.scName = ""; }   // your own profile replaces the shipped pair
      }
      if (S.isExample){ S.sc = null; S.isExample = false; S.scName = ""; }
      if (!S.sc){ const sv = store.get("scbb.xml", null); if (sv && sv.text){ try { S.sc = parseActionMaps(sv.text); S.scName = sv.fileName; } catch {} } }
      S.tab = "both";
      if (!quiet) toast(`Loaded Gremlin profile: ${S.gr.devices.length} physical device${S.gr.devices.length>1?"s":""}` + (S.sc ? "" : " — now drop your actionmaps.xml to resolve game actions"));
    } else if (kind === "sc"){
      S.sc = parseActionMaps(text); S.scName = fileName; S.isExample = !!isExample; S.scDefault = !!isDefault;
      if (isExample){ S.gr = null; S.grDefault = false; }
      else if (isDefault){}
      else {
        if (S.grDefault){ S.gr = null; S.grDefault = false; S.grName = ""; }
        store.set("scbb.xml", {text, fileName});
        if (!S.gr){ const gv = store.get("scbb.gremlin", null); if (gv && gv.text){ try { S.gr = parseGremlin(gv.text); S.grName = gv.fileName; } catch {} } }
      }
      if (!isExample && !isDefault && !quiet) toast(`Loaded ${S.sc.bindings.length} bindings from ${fileName}`);
    } else throw new Error("That file is neither a Star Citizen bindings file (<ActionMaps>) nor a Joystick Gremlin profile (<profile>).");
    rebuild();
  } catch(e){ toast(e.message, true); }
}
function rebuild(){
  S.data = buildData();
  if (S.data){
    resolveSides();
    const ids = Object.keys(S.data.devices);
    const ok = ids.includes(S.tab) && S.tab !== S.sides.left && S.tab !== S.sides.right;
    if (!ok && !["all","find","left","right","both"].includes(S.tab)) S.tab = preferredTab(S.data);
    if (S.tab === "both" && !(S.sides.left && S.sides.right)) S.tab = preferredTab(S.data);
  }
  renderAll();
}
function preferredTab(data){
  if (S.sides && S.sides.left && S.sides.right) return "both";
  if (S.sides && (S.sides.left || S.sides.right)) return S.sides.left ? "left" : "right";
  return Object.keys(data.devices).sort(devSort)[0];
}
const devPfx = id => id.replace(/\d+$/,"");
function devSort(a,b){
  const o = {g:-1,js:0,kb:1,mo:2,gp:3};
  return (o[devPfx(a)]-o[devPfx(b)]) || (+a.replace(/^\D+/,"") - +b.replace(/^\D+/,""));
}

/* ------------------------------------------------------------ Joystick Gremlin */
const SCANCODES = {1:"escape",2:"1",3:"2",4:"3",5:"4",6:"5",7:"6",8:"7",9:"8",10:"9",11:"0",14:"backspace",15:"tab",16:"q",17:"w",18:"e",19:"r",20:"t",21:"y",22:"u",23:"i",24:"o",25:"p",28:"enter",29:"lctrl",30:"a",31:"s",32:"d",33:"f",34:"g",35:"h",36:"j",37:"k",38:"l",42:"lshift",44:"z",45:"x",46:"c",47:"v",48:"b",49:"n",50:"m",54:"rshift",56:"lalt",57:"space",58:"capslock",59:"f1",60:"f2",61:"f3",62:"f4",63:"f5",64:"f6",65:"f7",66:"f8",67:"f9",68:"f10",87:"f11",88:"f12"};
const kids = (e, tag) => [...e.children].filter(c => c.tagName === tag);
function parseGremlin(text){
  const doc = new DOMParser().parseFromString(text, "application/xml");
  if (doc.getElementsByTagName("parsererror").length) throw new Error("That Gremlin profile isn’t valid XML.");
  const root = doc.documentElement;
  const devsEl = kids(root, "devices")[0];
  if (root.tagName !== "profile" || !devsEl) throw new Error("No Joystick Gremlin <profile><devices> found in that file.");
  const devices = [];
  const allModifierModes = new Set([...root.getElementsByTagName("temporary-mode-switch")].map(t=>t.getAttribute("name")));
  for (const d of kids(devsEl, "device")){
    if ((d.getAttribute("type")||"") !== "joystick") continue;
    const modes = kids(d, "mode");
    if (!modes.length) continue;
    const modifierModes = allModifierModes;
    const inheritCount = {};
    modes.forEach(m => { const i = m.getAttribute("inherit"); if (i) inheritCount[i] = (inheritCount[i]||0)+1; });
    const roots = modes.filter(m => !m.getAttribute("inherit"));
    const base = roots.sort((a,b)=>(inheritCount[b.getAttribute("name")]||0)-(inheritCount[a.getAttribute("name")]||0))[0] || modes[0];
    const baseName = base.getAttribute("name");
    const entries = [];
    for (const m of modes){
      const name = m.getAttribute("name");
      const isBase = name === baseName, isMod = modifierModes.has(name);
      const layer = isBase ? 0 : isMod ? 1 : 2;
      const modeTag = isBase ? "" : isMod ? "M" : name.replace(/\s*mode\s*$/i,"").trim().toUpperCase().slice(0,6) || name;
      for (const inp of m.children){
        const cont = kids(inp, "container");
        if (!cont.length) continue;
        entries.push({mode:name, layer, modeTag, kind:inp.tagName, id:inp.getAttribute("id"), desc:(inp.getAttribute("description")||"").trim(), containers:cont});
      }
    }
    devices.push({name:(d.getAttribute("name")||"Device").trim(), guid:d.getAttribute("device-guid"), baseName, modifierModes, entries});
  }
  if (!devices.length) throw new Error("The Gremlin profile has no joystick devices with actions.");
  const vjoyCount = kids(kids(root,"vjoy-devices")[0] || root, "vjoy-device").length;
  return {devices, vjoyCount};
}
function entryOutputs(entry, gdev){
  const outs = [];
  for (const c of entry.containers){
    const vb = kids(c, "virtual-button")[0];
    let dir = "";
    if (vb){ const lo = parseFloat(vb.getAttribute("lower-limit")), hi = parseFloat(vb.getAttribute("upper-limit")); dir = (lo + hi) / 2 < 0 ? "neg" : "pos"; }
    const type = c.getAttribute("type") || "basic";
    kids(c, "action-set").forEach((as, i) => {
      const trig = type === "tempo" ? (i === 0 ? "short" : "long") : type === "chain" ? "chain" + (i+1) : "";
      const tts = kids(as, "text-to-speech").map(t=>t.getAttribute("text")).filter(Boolean)[0] || "";
      const add = o => outs.push(Object.assign({trig, dir, tts}, o));
      for (const a of as.children){
        switch (a.tagName){
          case "remap": {
            const vjoy = a.getAttribute("vjoy");
            if (a.hasAttribute("button")) add({kind:"button", vjoy, id:a.getAttribute("button")});
            else if (a.hasAttribute("axis")) add({kind:"axis", vjoy, id:a.getAttribute("axis")});
            else if (a.hasAttribute("hat")) add({kind:"hat", vjoy, id:a.getAttribute("hat")});
            break; }
          case "macro": {
            const rel = !!a.querySelector('condition[comparison="released"]');
            const note = rel ? "REL" : "MACRO";
            for (const v of a.getElementsByTagName("vjoy")){
              if (v.getAttribute("value") !== "True" || v.getAttribute("input-type") !== "button") continue;
              add({kind:"button", vjoy:v.getAttribute("vjoy-id"), id:v.getAttribute("input-id"), note});
            }
            for (const k of a.getElementsByTagName("key")){
              if (k.getAttribute("press") !== "True") continue;
              add({kind:"key", scan:+k.getAttribute("scan-code"), note});
            }
            break; }
          case "temporary-mode-switch": {
            const n = a.getAttribute("name");
            add({kind:"g", label: gdev.modifierModes.has(n) && /modif/i.test(n) ? "MODIFIER (hold)" : "Hold for " + n}); break; }
          case "switch-mode": add({kind:"g", label:"Switch to " + a.getAttribute("name")}); break;
          case "cycle-modes": add({kind:"g", label:"Cycle to " + [...a.getElementsByTagName("mode")].map(m=>m.getAttribute("name")).join(" / ")}); break;
          case "map-to-mouse": {
            const motion = a.getAttribute("motion-input") === "True", dirDeg = +a.getAttribute("direction");
            add({kind:"g", label: motion ? "Mouse " + ((dirDeg % 180) === 90 ? "X" : "Y") + " (virtual mouse)" : "Mouse button " + a.getAttribute("button-id")}); break; }
          case "text-to-speech": break;
          case "response-curve": case "deadzone": break;
          case "previous-mode": break;
          default: break;
        }
      }
    });
  }
  return outs;
}
function mergeGremlin(devices, bindings, sc, gr, vjoyRev){
  const scIndex = new Map();
  for (const b of (sc ? sc.bindings : [])){
    const k = b.dev + "|" + b.node;
    if (!scIndex.has(k)) scIndex.set(k, []);
    scIndex.get(k).push(b);
  }
  gr.devices.forEach((gd, gi) => {
    const id = "g" + (gi+1);
    const dev = {id, product: gd.name, title: gd.name, generic: gd.name, physical:true, bindings:[]};
    const seen = new Set(), baseSeen = new Set();
    const push = b => {
      const k = [b.node,b.dir,b.label,(b.pre||[]).join(),b.tag,b.mods.join()].join("|");
      if (seen.has(k)) return; seen.add(k);
      // a mode line that just repeats the base-mode behaviour adds nothing
      const bk = [b.node,b.dir,b.label,(b.pre||[]).filter(t => t !== b._modeTag).join(),b.tag,b.mods.join()].join("|");
      if (b.layer === 0) baseSeen.add(bk); else if (baseSeen.has(bk)) return;
      dev.bindings.push(b); bindings.push(b);
    };
    for (const en of [...gd.entries].sort((a,b)=>a.layer-b.layer)){
      const node = en.kind + en.id;
      const ttsDone = new Set();
      for (const o of entryOutputs(en, gd)){
        if (o.kind === "button" && o.vjoy && vjoyRev){
          const k = o.vjoy + "|button" + o.id;
          (vjoyRev[k] || (vjoyRev[k] = [])).push({dev:id, node, layer:en.layer});
        }
        const pre = [];
        if (en.modeTag) pre.push(en.modeTag);
        if (o.trig === "long") pre.push("H");
        if (o.trig.startsWith("chain")) pre.push("C" + o.trig.slice(5));
        if (o.note) pre.push(o.note);
        const base = {dev:id, node, dir:o.dir||"", key:node, mods:[], pre, layer:en.layer, _modeTag:en.modeTag, tag:"", mode:"",
                      raw:`Gremlin · ${en.mode} · ${en.kind} ${en.id}${o.trig ? " ("+o.trig+" press)" : ""}${en.desc ? "\n“"+en.desc+"”" : ""}`};
        if (o.tts && !ttsDone.has(o.trig)){
          ttsDone.add(o.trig);
          push(Object.assign({}, base, {label:"“" + o.tts + "”", cat:"gremlin", action:"Joystick Gremlin", map:en.mode}));
        }
        if (o.kind === "g"){
          push(Object.assign({}, base, {label:o.label, cat:"gremlin", action:"Joystick Gremlin", map:en.mode}));
          continue;
        }
        let scDev, scNode, via;
        if (o.kind === "key"){
          const kname = SCANCODES[o.scan];
          scDev = "kb1"; scNode = kname || ("scan" + o.scan);
          via = `key ${kname ? kname.toUpperCase() : "scan " + o.scan}`;
        } else {
          scDev = S.vmap[o.vjoy] || ("js" + o.vjoy);
          scNode = o.kind === "axis" ? (VAXES[o.id] || "axis" + o.id) : o.kind + o.id;
          via = `vJoy ${o.vjoy} ${prettyKey(scNode)}`;
        }
        const matches = scIndex.get(scDev + "|" + scNode) || [];
        const raw = base.raw + "\n→ " + via;
        if (matches.length){
          for (const m of matches) push(Object.assign({}, base, {
            dir: base.dir || m.dir, label:m.label, cat:m.cat, tag:m.tag, mods:m.mods, action:m.action, map:m.map, mode:m.mode, sc:m,
            raw: raw + " → " + m.raw}));
        } else if (en.layer === 0 || o.tts || o.note) {
          push(Object.assign({}, base, {label: o.kind === "key" ? "Key " + via.slice(4) : `vJoy ${o.vjoy} · ${prettyKey(scNode)}`,
            cat: sc ? "unbound" : "gremlin", action: sc ? "(not bound in game)" : "(load actionmaps.xml to resolve)", map:"", raw}));
        }
      }
    }
    if (dev.bindings.length) devices[id] = dev;
  });
}
function buildData(){
  if (!S.sc && !S.gr) return null;
  const devices = {}, bindings = [];
  if (S.sc) for (const [k,d] of Object.entries(S.sc.devices)){
    const vj = /vjoy/i.test(d.product);
    devices[k] = Object.assign({}, d, vj ? {generic: d.generic + " · vJoy"} : {});
    bindings.push(...d.bindings);
  }
  const vjoyRev = {};
  if (S.gr) mergeGremlin(devices, bindings, S.sc, S.gr, vjoyRev);
  assignLayoutKeys(devices);
  const data = {profileName: S.sc ? S.sc.profileName : "Gremlin profile", devices, bindings, vjoyRev};
  applyCompare(data);
  return data;
}

/* ------------------------------------------------------------ search vocabulary (shared by every page) */
/* In-game Options › Keybindings section for each action map. Names follow the game's list as closely as known;
   the internal map name is always shown next to it because that never changes between patches. */
const PAGES = {
  seat_general:"Vehicles – Seats and General", spaceship_general:"Vehicles – Seats and General",
  spaceship_view:"Vehicles – View", spaceship_movement:"Flight – Movement", spaceship_quantum:"Flight – Quantum Travel",
  spaceship_docking:"Flight – Docking", spaceship_targeting:"Targeting", spaceship_targeting_advanced:"Targeting – Advanced",
  spaceship_target_hailing:"Targeting – Hailing", spaceship_weapons:"Weapons", spaceship_missiles:"Missiles",
  spaceship_defensive:"Defensive – Countermeasures", spaceship_power:"Power Management", spaceship_radar:"Radar",
  spaceship_scanning:"Scanning", spaceship_ping:"Scanning", spaceship_hud:"HUD", spaceship_mining:"Mining",
  spaceship_salvage:"Salvage", spaceship_auto_weapons:"Turrets – Auto Weapons", lights_controller:"Lights",
  vehicle_general:"Ground Vehicles – General", vehicle_driver:"Ground Vehicles – Driving", vehicle_mfd:"Vehicles – MFD",
  turret_movement:"Turrets – Movement", turret_main:"Turrets – Movement", player:"On Foot", prone:"On Foot – Prone",
  zero_gravity_eva:"EVA", zero_gravity_traversal:"EVA", player_emotes:"Social – Emotes", player_choice:"Interaction",
  player_input_optical_tracking:"Head Tracking", ui_textfield:"mobiGlas & Menus", mobiglas:"mobiGlas & Menus",
  mapui:"Star Map", ui_starmap:"Star Map", tractor_beam:"Tractor Beam", ship_tractor_beam:"Tractor Beam",
  stopwatch:"Stopwatch", spectator:"Spectator", flycam:"Camera – Free Cam", view_director_mode:"Camera – Director",
  character_customizer:"Character Editor", incapacitated:"Incapacitated", hacking:"Hacking",
  RemoteRigidEntityController:"Remote Control", default:"General", debug:"Debug" };
function pageName(map){
  if (!map) return "";
  if (PAGES[map]) return PAGES[map];
  const h = prettyAction(map.replace(/^spaceship_/,""));
  return map.startsWith("spaceship_") ? "Flight – " + h : h;
}
const SYN = [
  ["quantum","qdrive","quantum"],["qt","quantum","qdrive"],["jump","quantum","qdrive"],
  ["gear","landing"],["land","landing"],["door","door"],["doors","door"],
  ["decouple","decoupl"],["decoupled","decoupl"],["coupled","decoupl"],
  ["boost","afterburner","boost"],["afterburner","afterburner","boost"],
  ["cruise","speed_limiter","cruise","speed limiter"],["limiter","speed_limiter","limiter"],
  ["countermeasure","countermeasure","decoy","noise"],["cm","countermeasure","decoy","noise"],["flare","decoy"],["chaff","noise"],
  ["missile","missile"],["torpedo","missile","torpedo"],["gun","attack","weapon"],["guns","attack","weapon"],["fire","attack","fire"],["shoot","attack"],
  ["headlights","light"],["eject","eject"],["leave","exit"],["ready","flightready","flight ready"],
  ["start","flightready","power"],["mobi","mobiglas"],["ping","ping","scan"],["mine","mining"],
  ["look","look","view","freelook"],["camera","view","camera"],["gsafe","gforce","gsafe"],["stop","brake"],["hover","vtol"],
  ["interact","interaction"],["inner","personal_thought","interaction"],["hail","hail","comms"],["voip","voip","foip"]
];
function expandTerm(term){
  const set = new Set([term]);
  for (const [k,...v] of SYN) if (k === term || (term.length >= 4 && k.startsWith(term))) v.forEach(x => set.add(x));
  return [...set];
}
function normalizeQuery(q){
  // "js2 button 5" → "js2_button5", "button 5" → "button5", "hat 1" → "hat1"
  return q.toLowerCase().replace(/\b(button|hat|slider)\s+(\d+)/g,"$1$2").replace(/\b(js|kb|mo|gp)(\d)\s+/g,"$1$2_").trim();
}
let _qc = {q:null, terms:[]};
function qTerms(){
  if (_qc.q !== S.q) _qc = {q:S.q, terms: normalizeQuery(S.q||"").split(/\s+/).filter(Boolean).map(expandTerm)};
  return _qc.terms;
}
function hayOf(b){
  return b._hay || (b._hay = [b.label, b.action, b.raw, prettyKey(b.node), b.map, pageName(b.map), b.dev+"_"+b.node,
    (b.mods||[]).join(" "), (b.pre||[]).join(" ")].join(" ").toLowerCase());
}

/* ------------------------------------------------------------ Find page */
let listen = null;          // null | "kb" | "pad"
let hits = null;            // Set of bindings that match the pressed key/button
function findGroups(){
  const groups = new Map();
  for (const b of S.data.bindings){
    if (!visibleCat(b) || b.cat === "unbound") continue;
    const k = b.action === "Joystick Gremlin" ? "jg|" + b.map + "|" + b.label : b.map + "|" + b.action;
    if (!groups.has(k)) groups.set(k, {key:k, map:b.map, action:b.action, label:b.label, jg:b.action === "Joystick Gremlin", list:[]});
    groups.get(k).list.push(b);
  }
  const terms = qTerms();
  const out = [];
  for (const g of groups.values()){
    let s = 0;
    if (hits){ if (!g.list.some(b => hits.has(b))) continue; s = 1; }
    else if (terms.length){
      for (const alts of terms){
        let best = 0;
        const lab = g.label.toLowerCase(), act = (g.action||"").toLowerCase();
        for (const t of alts){
          if (lab.startsWith(t)) best = Math.max(best, 5);
          else if (lab.includes(t)) best = Math.max(best, 4);
          else if (act.includes(t)) best = Math.max(best, 3);
          else if (g.list.some(b => (b.raw||"").toLowerCase() === t || (b.dev+"_"+b.node) === t)) best = Math.max(best, 6);
          else if (g.list.some(b => hayOf(b).includes(t))) best = Math.max(best, 1);
        }
        if (!best){ s = 0; break; }
        s += best;
      }
      if (!s) continue;
    } else s = 1;
    g.score = s; g.page = g.jg ? "Joystick Gremlin · " + g.map : pageName(g.map);
    out.push(g);
  }
  return out;
}
function chipFor(b){
  const tags = [...(b.pre||[])]; if (b.tag) tags.push(b.tag);
  const tagEl = tags.length ? el("span",{class:"tag"}, tags.map(t=>"["+t+"]").join("")) : null;
  const d = S.data.devices[b.dev];
  const pfx = devPfx(b.dev);
  const title = `${d ? d.generic : b.dev}\n${b.raw}${b.mode ? "\nmode: "+b.mode : ""}\nClick to show it on the chart`;
  const hit = hits && hits.has(b);
  const diffCls = b.diff ? " diff" : "";
  if (pfx === "kb"){
    const keys = [...b.mods, b.key].map(k => el("kbd",{}, prettyKey(k)));
    const parts = []; keys.forEach((k,i) => { if (i) parts.push(el("span",{class:"plus"},"+")); parts.push(k); });
    return el("button",{class:"fchip kb"+(hit?" hit":"")+diffCls, title, onclick:()=>jumpTo(b)}, parts, tagEl);
  }
  const mods = b.mods.length ? el("span",{class:"fmods"}, b.mods.map(m=>prettyKey(m)).join("+") + " +") : null;
  return el("button",{class:"fchip "+(pfx==="mo"?"mo":"js")+(hit?" hit":"")+diffCls, title, onclick:()=>jumpTo(b)},
    el("span",{class:"fdev"}, pfx === "g" ? "JG · " + (d ? d.generic : b.dev) : pfx === "mo" ? "Mouse" : b.dev + (d && d.product ? " · " + d.generic : "")),
    mods, el("span",{class:"finp"}, prettyKey(b.node) + (b.dir ? " " + DIRS[b.dir] : "")), tagEl);
}
function renderFind(v){
  const inp = el("input",{class:"fsearch", id:"fq", type:"search", autocomplete:"off", spellcheck:"false",
    placeholder:"What do you want to do? quantum, landing gear, doors, missiles, js2 button 5…", "aria-label":"Find a binding"});
  inp.value = S.q || "";
  inp.addEventListener("input", ()=>{ stopListen(); S.q = inp.value.trim(); $("#q").value = inp.value; renderFindResults(); });
  const kbBtn = el("button",{class:"btn"+(listen==="kb"?" on":""), id:"listenKb", "aria-pressed":String(listen==="kb"), onclick:()=>setListen(listen==="kb"?null:"kb")}, "Press a key");
  const padBtn = el("button",{class:"btn"+(listen==="pad"?" on":""), id:"listenPad", "aria-pressed":String(listen==="pad"), onclick:()=>setListen(listen==="pad"?null:"pad")}, "Press a HOTAS button");
  v.append(el("div",{class:"toolbar"}, el("div",{class:"devname"}, "Find a binding",
      el("small",{}, "Search by what you want to do, or press the key or button to see what it does")), kbBtn, padBtn));
  v.append(inp, el("p",{class:"hint", id:"findHint"}, listenHint || "Each result shows the settings page it is on in Options › Keybindings. Click a binding to see it on the chart."));
  v.append(el("div",{id:"findResults", class:"fresults"}));
  renderFindResults();
  if (!listen) requestAnimationFrame(()=>{ if (S.tab === "find" && document.activeElement === document.body) inp.focus({preventScroll:true}); });
}
const CHIP_RANK = {g:0, kb:1, js:2, mo:3, gp:4};  // physical (Gremlin) buttons first
function renderFindResults(){
  const box = $("#findResults"); if (!box) return;
  const fi = $("#fq"); if (fi && document.activeElement !== fi) fi.value = S.q || "";
  box.textContent = "";
  const rows = findGroups();
  if (!rows.length){
    box.append(el("div",{class:"empty"}, hits ? "That input isn’t bound to anything in the loaded files."
      : S.q ? `Nothing matches “${S.q}”. The live actionmaps.xml only stores bindings you changed, so this action may still be on its game default.`
      : "No bindings loaded yet."));
    return;
  }
  const sorted = (S.q || hits) ? rows.sort((a,b)=> b.score-a.score || a.label.localeCompare(b.label))
                               : rows.sort((a,b)=> a.page.localeCompare(b.page) || a.label.localeCompare(b.label));
  const pages = new Map();
  for (const g of sorted){ if (!pages.has(g.page)) pages.set(g.page, []); pages.get(g.page).push(g); }
  for (const [page, list] of pages){
    const sec = el("section",{class:"fgroup"},
      el("h2",{}, el("span",{class:"crumb"},"Options › Keybindings ›"), " ", el("span",{class:"fpage"}, page),
        list[0].jg ? null : el("small",{title:"Internal action map name"}, list[0].map)));
    const rowsEl = el("div",{class:"frows"});
    for (const g of list){
      const cat = g.list[0].cat;
      rowsEl.append(el("div",{class:"frow"+(hits && g.list.some(b=>hits.has(b)) ? " hit" : "")},
        el("div",{class:"fact"}, el("div",{class:"flabel", style:`--c:var(--c-${cat})`}, g.label),
          el("div",{class:"fraw"}, g.jg ? "Joystick Gremlin output" : g.action)),
        el("div",{class:"fbinds"}, [...g.list].sort((a,b)=> (CHIP_RANK[devPfx(a.dev)]??9)-(CHIP_RANK[devPfx(b.dev)]??9) || devSort(a.dev,b.dev)).map(chipFor))));
    }
    sec.append(rowsEl); box.append(sec);
  }
}
function tabForDev(dev){
  if (dev === S.sides.left) return "left";
  if (dev === S.sides.right) return "right";
  return S.data.devices[dev] ? dev : "all";
}
function jumpTo(b){
  stopListen();
  S.tab = tabForDev(b.dev); store.set("scbb.tab", S.tab);
  S.q = b.action && b.action !== "Joystick Gremlin" ? b.action : b.label;
  $("#q").value = S.q;
  renderTabs(); renderView();
  setTimeout(()=>{ const h = document.querySelector(".card.hit"); if (h) h.scrollIntoView({block:"center", inline:"center", behavior:"smooth"}); }, 60);
  toast(`Showing “${b.label}” — clear the search box to see everything again`);
}

/* listening: keyboard */
let listenHint = "";
const CODEMAP = {Space:"space",Enter:"enter",Escape:"escape",Tab:"tab",Backspace:"backspace",CapsLock:"capslock",
  ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",Insert:"insert",Delete:"delete",Home:"home",End:"end",
  PageUp:"pgup",PageDown:"pgdn",Minus:"minus",Equal:"equals",BracketLeft:"lbracket",BracketRight:"rbracket",
  Semicolon:"semicolon",Quote:"apostrophe",Comma:"comma",Period:"period",Slash:"slash",Backslash:"backslash",Backquote:"grave",
  NumpadAdd:"np_add",NumpadSubtract:"np_subtract",NumpadMultiply:"np_multiply",NumpadDivide:"np_divide",NumpadDecimal:"np_period",
  NumpadEnter:"np_enter",PrintScreen:"print",Pause:"pause",ScrollLock:"scrolllock",NumLock:"numlock",
  ShiftLeft:"lshift",ShiftRight:"rshift",ControlLeft:"lctrl",ControlRight:"rctrl",AltLeft:"lalt",AltRight:"ralt"};
function codeToSc(code){
  if (CODEMAP[code]) return CODEMAP[code];
  let m;
  if ((m=/^Key([A-Z])$/.exec(code))) return m[1].toLowerCase();
  if ((m=/^Digit(\d)$/.exec(code))) return m[1];
  if ((m=/^Numpad(\d)$/.exec(code))) return "np_"+m[1];
  if ((m=/^F(\d+)$/.exec(code))) return "f"+m[1];
  return null;
}
const held = new Set();
function setHint(t){ listenHint = t; const h = $("#findHint"); if (h) h.textContent = t || "Each result shows the settings page it is on in Options › Keybindings. Click a binding to see it on the chart."; }
function stopListen(){ if (!listen && !hits) return; listen = null; hits = null; setHint("");
  document.querySelectorAll("#listenKb,#listenPad").forEach(b=>{ b.classList.remove("on"); b.setAttribute("aria-pressed","false"); }); }
function setListen(mode){
  stopListen();
  if (!mode){ renderFindResults(); return; }
  listen = mode; S.q = ""; $("#q").value = ""; const fi = $("#fq"); if (fi) fi.value = "";
  const btn = $(mode === "kb" ? "#listenKb" : "#listenPad"); if (btn){ btn.classList.add("on"); btn.setAttribute("aria-pressed","true"); }
  if (mode === "kb") setHint("Press a key or key combination. Esc stops listening.");
  else startPad();
  renderFindResults();
}
document.addEventListener("keydown", e => {
  if (listen !== "kb" || S.tab !== "find") return;
  if (e.code === "Escape"){ stopListen(); renderFindResults(); return; }
  e.preventDefault();
  const k = codeToSc(e.code); if (!k) return;
  held.add(k);
  const isMod = MODKEYS.has(k);
  const mods = isMod ? [] : [...held].filter(x => MODKEYS.has(x));
  const want = [...mods, k].sort().join("+"), plain = k;
  hits = new Set(S.data.bindings.filter(b => devPfx(b.dev) === "kb" && (
    [...b.mods, b.key].sort().join("+") === want || (mods.length && !b.mods.length && b.key === plain))));
  setHint("You pressed " + [...mods, k].map(prettyKey).join(" + ") + ". Esc stops listening.");
  renderFindResults();
});
document.addEventListener("keyup", e => { const k = codeToSc(e.code); if (k) held.delete(k); });
window.addEventListener("blur", () => held.clear());

/* listening: HOTAS through the browser's Gamepad API (buttons counted from 1, as DirectInput does) */
let padRaf = 0, padPrev = {};
const normName = s => (s||"").toLowerCase().replace(/\(.*?\)/g,"").replace(/[^a-z0-9]/g,"");
function startPad(){
  if (!navigator.getGamepads){ setHint("This browser can’t read game controllers here. Search for the button instead, for example js2 button 5."); listen = null; return; }
  setHint("Press a button on your stick or throttle. If nothing happens, press any button once so the browser notices the device.");
}
/* One controller poller for the whole page: on the Find page (while listening) a press shows what the
   button does; on a chart page it flashes that button's card and leader line. */
let padBlocked = false;
function padTick(){
  let pads = [];
  try { pads = [...navigator.getGamepads()].filter(Boolean); }
  catch { padBlocked = true; if (listen === "pad") setHint("Controller access is blocked here. Search for the button instead, for example js2 button 5."); return; }
  for (const p of pads){
    const was = padPrev[p.index] || [];
    p.buttons.forEach((b,i) => { if (b.pressed && !was[i]) padPress(p, i+1); });
    padPrev[p.index] = p.buttons.map(b => b.pressed);
  }
  padRaf = requestAnimationFrame(padTick);
}
function padPress(pad, n){
  if (S.tab === "find"){ if (listen === "pad") onPadButton(pad, n); }
  else if (board) flashButton(pad, n);
}
if (navigator.getGamepads) padRaf = requestAnimationFrame(padTick);

/* Which control was pressed? A physical stick is matched by name. With Joystick Gremlin running (and
   usually HidHide), the browser only sees Gremlin's "vJoy - Virtual Joystick" devices, so a vJoy button is
   traced back through the Gremlin profile to the physical button(s) that drive it, and to the game device
   the vJoy device is mapped to (the "vJoy → game" row). All vJoy devices report the same name; they are
   numbered in the order the browser lists them, and the other numbers are tried if that finds nothing.
   Returns candidate sets of {dev, node}, best first, and a label for messages. */
const FLASH_MS = 3000;
const HOTAS_TOAST_MS = 8000;   // messages about a HOTAS press stay up long enough to read while looking at the stick
let flashTimer = 0, vjoyHinted = false;
const padName = pad => pad.id.replace(/\(.*$/,"").trim() || "Controller";
function sameDevice(pad, dev){
  const pn = normName(pad.id), dn = normName(dev.product || dev.title);
  return !!dn && (pn.includes(dn.slice(0,12)) || dn.includes(pn.slice(0,12)));
}
function padTargets(pad, n){
  const node = "button" + n;
  if (!/vjoy/i.test(pad.id)){
    const devs = Object.values(S.data.devices).filter(d => /^(js|g)\d/.test(d.id) && !/vjoy/i.test(d.product || "") && sameDevice(pad, d));
    return {label: `${padName(pad)} button ${n}`, sets: [devs.map(d => ({dev:d.id, node}))], physical:true};
  }
  let vpads = [];
  try { vpads = [...navigator.getGamepads()].filter(p => p && /vjoy/i.test(p.id)).sort((a,b) => a.index - b.index); } catch {}
  if (store.get("scbb.vjoySwap", false)) vpads.reverse();
  const guess = Math.max(1, vpads.findIndex(p => p.index === pad.index) + 1);
  const count = Math.max(vpads.length, S.gr ? (S.gr.vjoyCount || 2) : 2, guess);
  const order = [guess, ...Array.from({length:count}, (_,i) => i+1).filter(v => v !== guess)];
  const sets = order.map(v => {
    const t = (S.data.vjoyRev && S.data.vjoyRev[v + "|" + node] || []).slice().sort((a,b) => (a.layer||0) - (b.layer||0));
    const js = S.vmap[v] || ("js" + v);
    if (S.data.devices[js]) t.push({dev:js, node});
    return t;
  });
  return {label: `vJoy ${guess} button ${n}`, sets};
}

/* chart pages: flash the pressed control's card and leader line in yellow for 3 seconds */
function flashButton(pad, n){
  if (!board) return;
  const {label, sets, physical} = padTargets(pad, n);
  const onPage = set => [...new Set(set.flatMap(t => board.parts.filter(p => p.dev.id === t.dev).map(p => p.prefix + t.node)))]
    .filter(k => board.cards[k] && !board.cards[k].el.hidden);
  for (const set of sets){ const keys = onPage(set); if (keys.length){
    flashCards(keys);
    if (/vjoy/i.test(pad.id) && !vjoyHinted){ vjoyHinted = true;
      toast(`${label} → ${keys.map(k => board.cards[k].part.dev.title + " " + prettyKey(k.replace(/^[LR]:/,""))).join(", ")}. Wrong hand? Use “swap vJoy order” under the file list.`, false, HOTAS_TOAST_MS); }
    return; } }
  if (physical){
    // A physical device the page doesn't know by name: with one physical device shown, assume it's that one.
    const phys = board.parts.filter(p => !/vjoy/i.test(p.dev.product || ""));
    if (phys.length === 1){ const k = phys[0].prefix + "button" + n; if (board.cards[k] && !board.cards[k].el.hidden) return flashCards([k]); }
  }
  toast(`${label}: nothing on this page uses it.` + (/vjoy/i.test(pad.id) && !S.gr ? " Load your Joystick Gremlin profile to trace vJoy buttons back to your stick." : ""), false, HOTAS_TOAST_MS);
}
function flashCards(keys){
  clearFlash();
  board.flash = new Set(keys);
  for (const k of keys) board.cards[k].el.classList.add("flash");
  board.svg.querySelectorAll("[data-card]").forEach(e => { if (board.flash.has(e.dataset.card)) e.classList.add("flash"); });
  const first = board.cards[keys[0]].el;
  const r = first.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) first.scrollIntoView({block:"center", behavior:"smooth"});
  flashTimer = setTimeout(clearFlash, FLASH_MS);
}
function clearFlash(){
  clearTimeout(flashTimer);
  if (!board || !board.flash) return;
  board.flash = null;
  board.stage.querySelectorAll(".flash").forEach(e => e.classList.remove("flash"));
}
function onPadButton(pad, n){
  const {label, sets} = padTargets(pad, n);
  const hitSet = set => { const want = new Set(set.map(t => t.dev + "|" + t.node));
    return S.data.bindings.filter(b => want.has(b.dev + "|" + b.node)); };
  let found = [];
  for (const set of sets){ found = hitSet(set); if (found.length) break; }
  hits = new Set(found);
  setHint(label + (found.length ? "" : " isn’t used by any binding") + ". Click the button again to stop.");
  renderFindResults();
}


/* ------------------------------------------------------------ compare with another bindings file */
/* A game binding is "the same" when the other file binds the same action, in the same action map, to the
   same device, input, key modifiers and activation (hold, double tap…). Anything else is a difference:
   red on the charts, the table and Find. Bindings only in the other file are shown as struck-through
   "ghost" lines on the card of the button they use (followed through Gremlin to the physical button). */
const bkey = b => [b.map, b.action, b.dev, b.key, [...(b.mods||[])].sort().join("+"), b.tag || ""].join("|");
function applyCompare(data){
  const scOnes = data.bindings.filter(b => !b.sc && b.action !== "Joystick Gremlin" && /^(kb|js|mo|gp)\d/.test(b.dev));
  if (!S.cmp){ for (const b of data.bindings) b.diff = false; data.cmpOnly = null; data.ghosts = null; return; }
  const theirs = new Set(S.cmp.bindings.map(bkey));
  for (const b of scOnes) b.diff = !theirs.has(bkey(b));
  for (const b of data.bindings) if (b.sc) b.diff = !!b.sc.diff;
  const ours = new Set(scOnes.map(bkey));
  data.cmpOnly = S.cmp.bindings.filter(cb => !ours.has(bkey(cb)));
  data.cmpDiff = scOnes.filter(b => b.diff).length;
  // where to show each binding that is only in the other file
  const ghosts = new Map(), add = (dev, node, cb) => { const k = dev + "|" + node; if (!ghosts.has(k)) ghosts.set(k, []); ghosts.get(k).push(cb); };
  const vjoyOf = {}; for (const [v, js] of Object.entries(S.vmap)) vjoyOf[js] = v;
  for (const cb of data.cmpOnly){
    add(cb.dev, cb.node, cb);
    const v = vjoyOf[cb.dev] || (/^js\d+$/.test(cb.dev) ? cb.dev.slice(2) : null);
    for (const r of (v && data.vjoyRev && data.vjoyRev[v + "|" + cb.node]) || []) add(r.dev, r.node, cb);
  }
  data.ghosts = ghosts;
}
function loadCompare(text, fileName){
  try {
    if (sniff(text) !== "sc") throw new Error("Compare needs a Star Citizen bindings file (actionmaps.xml or an exported layout).");
    const parsed = parseActionMaps(text);
    S.cmp = {name:fileName, bindings: parsed.bindings};
    rebuild();
    toast(`Comparing with ${fileName}: ${S.data.cmpDiff} binding${S.data.cmpDiff===1?"":"s"} differ, ${S.data.cmpOnly.length} only in ${fileName}.`, false, 8000);
  } catch(e){ toast(e.message, true); }
}
function stopCompare(){ S.cmp = null; S.onlyDiff = false; rebuild(); }
const isCmpVisible = b => !S.onlyDiff || b.diff || b.ghost;

/* ------------------------------------------------------------ filtering */
function matchQ(b){
  if (!S.q) return true;
  const h = hayOf(b);
  return qTerms().every(alts => alts.some(t => h.includes(t)));
}
const visibleCat = b => !S.off.has(b.cat);

/* ------------------------------------------------------------ render: chrome */
function renderAll(){ renderInfo(); renderCats(); renderTabs(); renderView(); }

function renderInfo(){
  const box = $("#dropInfo"); box.textContent = "";
  const files = el("div",{class:"files"}); box.append(files);
  if (!STORAGE_OK) files.append(el("div",{class:"fileline warn"}, el("span",{class:"kindlbl"},"Not saved"),
    "This view blocks browser storage, so hand choices, pictures and card positions last only until the page reloads. Open the page in a normal browser tab to keep them."));
  if (!S.sc && !S.gr){ files.append("Drop your actionmaps.xml and/or Joystick Gremlin profile here, or use Open XML."); return; }
  // Star Citizen line
  const scLine = el("div",{class:"fileline"}, el("span",{class:"kindlbl"},"Star Citizen"));
  if (S.sc){
    if (S.isExample) scLine.append(el("span",{class:"example-flag"},"Example"));
    if (S.scDefault) scLine.append(el("span",{class:"example-flag"},"Default"));
    const devs = Object.keys(S.sc.devices).length;
    scLine.append(el("strong",{}, S.sc.profileName), el("span",{class:"meta"}, `${S.scName} · ${S.sc.bindings.length} bindings · ${devs} device${devs>1?"s":""}`));
    if (S.isExample) scLine.append(el("span",{},"sample data — drop your own actionmaps.xml to replace it."));
    else if (S.scDefault) scLine.append(el("span",{},"shipped with this page — drop your own actionmaps.xml to replace it."));
    else scLine.append(el("button",{class:"linkbtn", onclick:()=>{ S.sc=null; store.set("scbb.xml", null); rebuild(); }},"remove"));
  } else scLine.append(el("span",{},"not loaded — drop actionmaps.xml to turn vJoy buttons into game actions."));
  files.append(scLine);
  // Compare line
  if (S.cmp){
    const cl = el("div",{class:"fileline cmp"}, el("span",{class:"kindlbl"},"Compare with"),
      el("strong",{}, S.cmp.name),
      el("span",{class:"meta"}, `${S.data ? S.data.cmpDiff : 0} differ (red) · ${S.data && S.data.cmpOnly ? S.data.cmpOnly.length : 0} only in this file (struck through)`),
      el("label",{class:"linkbtn"}, el("input",{type:"checkbox", id:"onlyDiff", checked:S.onlyDiff?true:null,
        onchange:e=>{ S.onlyDiff = e.target.checked; renderView(); }}), " only show differences"),
      el("button",{class:"linkbtn", onclick:stopCompare},"stop comparing"));
    files.append(cl);
  }
  // Gremlin line
  const grLine = el("div",{class:"fileline"}, el("span",{class:"kindlbl"},"Joystick Gremlin"));
  if (S.gr){
    if (S.grDefault) grLine.append(el("span",{class:"example-flag"},"Default"));
    grLine.append(el("strong",{}, S.grName), el("span",{class:"meta"}, S.gr.devices.map(d=>d.name).join(" · ")),
      el("button",{class:"linkbtn", onclick:()=>{ S.gr=null; store.set("scbb.gremlin", null); rebuild(); }},"remove"));
    files.append(grLine);
    const vm = el("div",{class:"vmap"}, el("span",{class:"kindlbl"},"vJoy → game"));
    const js = S.sc ? Object.keys(S.sc.devices).filter(k=>k.startsWith("js")).sort(devSort) : [];
    const n = Math.max(S.gr.vjoyCount || 2, 2);
    for (let i=1;i<=n;i++){
      const sel = el("select",{id:"vmap"+i, "aria-label":`Game device for vJoy ${i}`});
      const opts = new Set([...js, "js1","js2","js3","js4"].slice(0));
      for (const o of [...opts].sort(devSort)){
        const d = S.sc && S.sc.devices[o];
        sel.append(el("option",{value:o}, o + (d && d.product ? " · " + d.product.slice(0,22) : "")));
      }
      sel.value = S.vmap[i] || ("js"+i);
      sel.addEventListener("change", ()=>{ S.vmap[i] = sel.value; store.set("scbb.vmap", S.vmap); rebuild(); });
      vm.append(el("label",{}, `vJoy ${i} `, sel));
    }
    const swapped = !!store.get("scbb.vjoySwap", false);
    vm.append(el("button",{class:"linkbtn", title:"Your browser lists the vJoy devices without numbers. If pressing a button flashes the other hand, swap the order.",
      onclick:()=>{ store.set("scbb.vjoySwap", !swapped); renderInfo(); toast(!swapped ? "vJoy order swapped for HOTAS button presses" : "vJoy order back to normal"); }},
      swapped ? "HOTAS presses: vJoy order swapped (undo)" : "wrong hand flashing? swap vJoy order"));
    files.append(vm);
  } else {
    grLine.append(el("span",{},"optional — drop your Gremlin profile to see bindings per physical button."));
    files.append(grLine);
  }
}
function renderCats(){
  const box = $("#cats"); box.textContent = "";
  const counts = {};
  for (const b of (S.data?.bindings||[])) counts[b.cat] = (counts[b.cat]||0)+1;
  for (const c of CATS){
    if (!counts[c.id]) continue;
    const off = S.off.has(c.id);
    box.append(el("button",{class:"cat"+(off?" off":""), style:`--c:var(--c-${c.id})`, "aria-pressed": String(!off),
      title: off ? "Show "+c.name : "Hide "+c.name,
      onclick:()=>{ off ? S.off.delete(c.id) : S.off.add(c.id); store.set("scbb.off",[...S.off]); renderCats(); refreshFilter(); }},
      c.name, el("span",{class:"n"}, String(counts[c.id]))));
  }
}
/* ------------------------------------------------------------ chart pages: left / right / both */
const isStickish = d => !!d && (/^g\d/.test(d.id) || (/^js\d/.test(d.id) && !(S.gr && /vjoy/i.test(d.product))));
function chartCandidates(){
  if (!S.data) return [];
  const all = Object.values(S.data.devices).filter(d => /^(g|js)\d/.test(d.id)).sort((a,b)=>devSort(a.id,b.id));
  const phys = all.filter(isStickish);
  return phys.length ? phys : all;
}
function resolveSides(){
  const cands = chartCandidates();
  const saved = store.get("scbb.sides", null);
  const byKey = k => k && cands.find(d => layoutKey(d) === k);
  let L = saved ? byKey(saved.left) : null, R = saved ? byKey(saved.right) : null;
  if (!saved || (saved.left && !L) || (saved.right && !R)){
    const kind = d => (detectPreset(d)||{}).preset || "";
    const thr = cands.find(d => kind(d) === "virpil-throttle");
    const sticks = cands.filter(d => kind(d) === "virpil-stick");
    const leftStick = sticks.find(d => /^(l-|left\b|l\s)/i.test((d.product||"").trim()));
    L = thr || leftStick || cands[0] || null;
    R = sticks.find(d => d !== L) || cands.find(d => d !== L) || null;
  }
  S.sides = {left: L ? L.id : null, right: R ? R.id : null};
}
function setSide(side, id){
  S.sides[side] = id || null;
  const k = x => x && S.data.devices[x] ? layoutKey(S.data.devices[x]) : null;
  store.set("scbb.sides", {left:k(S.sides.left), right:k(S.sides.right)});
  if (S.tab === "both" && !(S.sides.left && S.sides.right)) S.tab = side;
  renderTabs(); renderView();
}
function sideSelect(side){
  const sel = el("select",{class:"imgsel", id:"side-"+side, "aria-label":(side==="left"?"Left":"Right")+" hand device"},
    el("option",{value:""},"— none —"),
    chartCandidates().map(d => el("option",{value:d.id}, d.generic)));
  const want = S.sides[side] || "";
  sel.value = want;
  requestAnimationFrame(() => { if (sel.value !== (S.sides[side] || "")) sel.value = S.sides[side] || ""; });
  sel.addEventListener("change", ()=>setSide(side, sel.value));
  return el("label",{class:"sidelbl"}, side === "left" ? "Left hand" : "Right hand", sel);
}

function renderTabs(){
  const box = $("#tabs"); box.textContent = "";
  if (!S.data) return;
  const tab = (id, kids, extra="") => el("button",{class:"tab"+(S.tab===id?" active":"")+extra,
    onclick:()=>{S.tab=id; store.set("scbb.tab",id); renderTabs(); renderView();}}, kids);
  const L = S.data.devices[S.sides.left], R = S.data.devices[S.sides.right];
  box.append(tab("find", ["Find", el("small",{}, "search")]));
  box.append(tab("left", [el("span",{class:"src"},"L"), L ? L.generic : "Left hand"], " phys"));
  box.append(tab("right", [el("span",{class:"src"},"R"), R ? R.generic : "Right hand"], " phys"));
  if (L && R) box.append(tab("both", [el("span",{class:"src"},"L+R"), "Both"], " phys"));
  for (const id of Object.keys(S.data.devices).sort(devSort)){
    if (id === S.sides.left || id === S.sides.right) continue;
    const d = S.data.devices[id];
    box.append(tab(id, [d.physical ? el("span",{class:"src", title:"Physical device via Joystick Gremlin"},"JG") : null, d.generic, el("small",{}, String(d.bindings.length))]));
  }
  box.append(tab("all", ["All bindings", el("small",{}, String(S.data.bindings.length))]));
}
function renderView(){
  const v = $("#view"); v.textContent = ""; board = null;
  if (!S.data){ v.append(el("div",{class:"empty"},"No bindings loaded yet.")); return; }
  if (S.tab !== "find") stopListen();
  if (S.tab === "find") return renderFind(v);
  if (S.tab === "all") return renderTable(v);
  if (S.tab === "left" || S.tab === "right"){
    const d = S.data.devices[S.sides[S.tab]];
    if (!d){ v.append(el("div",{class:"toolbar"}, el("div",{class:"devname"}, S.tab === "left" ? "Left hand" : "Right hand"), sideSelect(S.tab)),
                   el("div",{class:"empty"},"Pick the device you hold in this hand.")); return; }
    return renderSingle(v, d, S.tab);
  }
  if (S.tab === "both"){
    const L = S.data.devices[S.sides.left], R = S.data.devices[S.sides.right];
    if (L && R) return renderBoth(v, L, R);
  }
  const d = S.data.devices[S.tab];
  if (d) return renderSingle(v, d, null);
  S.tab = preferredTab(S.data); renderTabs(); renderView();
}
function refreshFilter(){
  if (S.tab === "all") renderView(); else if (S.tab === "find") renderFindResults(); else applyBoardFilter();
}

/* ------------------------------------------------------------ board */
let board = null;

function groupNodes(dev){
  const g = new Map();
  for (const b of dev.bindings){
    if (!g.has(b.node)) g.set(b.node, []);
    g.get(b.node).push(b);
  }
  for (const list of g.values()) list.sort((a,b)=> (DIR_ORDER[a.dir]-DIR_ORDER[b.dir]) || ((a.layer||0)-(b.layer||0)) || ((a.pre||[]).join().localeCompare((b.pre||[]).join())) || (CAT_ORDER[a.cat]-CAT_ORDER[b.cat]) || (TAG_ORDER[a.tag]??9)-(TAG_ORDER[b.tag]??9) || a.mods.length-b.mods.length);
  const kindRank = {button:0, hat:1, axis:2, key:3};
  return [...g.entries()].sort(([a],[b]) => {
    const ka = nodeKind(a), kb = nodeKind(b);
    if (ka !== kb) return kindRank[ka]-kindRank[kb];
    const na = +(a.match(/\d+/)||[0])[0], nb = +(b.match(/\d+/)||[0])[0];
    return (na-nb) || a.localeCompare(b);
  });
}

function cardFor(key, node, list, ghosts){
  const kind = nodeKind(node);
  const hasDir = list.some(b => b.dir) || (ghosts||[]).some(b => b.dir);
  const ul = el("ul");
  const theirs = S.cmp ? S.cmp.name : "";
  for (const b of [...list, ...(ghosts||[]).map(g => Object.assign({}, g, {ghost:true}))]){
    const tags = [...(b.pre||[])];
    if (b.mods.length) tags.push("M·"+b.mods.map(m=>prettyKey(m).replace(/\s/g,"")).join("+"));
    if (b.tag) tags.push(b.tag);
    const li = el("li",{class:(b.diff ? "diff" : "") + (b.ghost ? " ghost" : ""), style:`--c:var(--c-${b.cat})`,
      title:(b.ghost ? `Only in ${theirs}\n` : b.diff ? `Not in ${theirs}\n` : "") + `${b.action}\n${b.map}\n${b.raw}${b.mode?"\nmode: "+b.mode:""}`},
      hasDir ? el("span",{class:"dir"}, DIRS[b.dir]||"") : null,
      tags.length ? el("span",{class:"tag"}, tags.map(t=>"["+t+"]").join("")) : null,
      el("span",{class:"lbl"}, b.label));
    li._b = b;
    ul.append(li);
  }
  const anyDiff = list.some(b => b.diff) || (ghosts && ghosts.length);
  return el("div",{class:"card" + (anyDiff ? " hasdiff" : ""), "data-node":key},
    el("div",{class:"card-h"}, el("span",{class:"inp"}, prettyKey(node)), el("span",{class:"kind"}, kind === "key" ? "" : kind)),
    ul);
}

function devLayout(dev){
  const key = layoutKey(dev);
  const lay = layouts[key] || (layouts[key] = {cards:{}});
  if (!lay.cards) lay.cards = {};
  if (lay.preset === undefined){
    if (lay.image) lay.preset = "custom";
    else { const d = detectPreset(dev); lay.preset = d ? d.preset : "none"; lay.mirror = d ? d.mirror : false; }
    saveLayouts();
  }
  return lay;
}
const arrangeBtn = () => el("button",{class:"btn"+(S.arrange?" on":""), id:"btnArrange", "aria-pressed":String(S.arrange), onclick:()=>{S.arrange=!S.arrange; renderView();}}, S.arrange ? "Done arranging" : "Arrange");
const colsFrom = (x0, n) => Array.from({length:n}, (_,i) => x0 + i*(CW+GAP));
// Re-place every card next to its pin (pins are kept); cards without a pin go to the tray below.
const autoBtn = st => el("button",{class:"btn", title:"Place every card beside its pin; unpinned cards go below the picture", onclick:()=>{
  for (const c of Object.values(st.cards)){ c.auto = true; delete c.x; delete c.y; }
  saveLayouts(); renderView(); toast("Cards arranged around their pins");
}}, "Auto-arrange");

function renderSingle(v, dev, side){
  const lay = devLayout(dev);
  v.append(el("div",{class:"toolbar"},
    el("div",{class:"devname"}, dev.title, el("small",{}, dev.physical ? `physical device via Joystick Gremlin · ${dev.bindings.length} lines` : `${dev.id} · ${dev.bindings.length} bindings`)),
    side ? sideSelect(side) : null,
    arrangeBtn(),
    imageSelect(dev, lay),
    imageFor(lay) ? el("button",{class:"btn"+(lay.mirror?" on":""), "aria-pressed":String(!!lay.mirror), onclick:()=>{ lay.mirror = !lay.mirror; saveLayouts(); renderView(); }}, "Mirror") : null,
    autoBtn(lay),
    el("button",{class:"btn", onclick:()=>openLayoutModal()}, "Layout JSON")));
  hint(v, "this page");
  mountBoard(v, {W:1600, store:lay, parts:[{
    dev, prefix:"", dlay:lay, box:{x:470,y:60,w:660,h:900}, legacyBox:{x:500,y:80,w:600,h:740},
    region:[0,1600], tray:colsFrom(10,7)}]});
}

function renderBoth(v, L, R){
  const lL = devLayout(L), lR = devLayout(R);
  const key = "both|" + layoutKey(L) + "|" + layoutKey(R);
  const st = layouts[key] || (layouts[key] = {cards:{}});
  v.append(el("div",{class:"toolbar"},
    el("div",{class:"devname"}, "Both hands", el("small",{}, `${L.generic} + ${R.generic} · layout saved for this pair`)),
    sideSelect("left"), sideSelect("right"),
    arrangeBtn(),
    autoBtn(st),
    el("button",{class:"btn", onclick:()=>openLayoutModal()}, "Layout JSON")));
  hint(v, "this pair", "Pictures and mirroring come from each device’s own Left / Right page.");
  const W2 = 2440;
  mountBoard(v, {W:W2, store:st, parts:[
    {dev:L, prefix:"L:", dlay:lL, box:{x:250,y:60,w:720,h:920}, legacyBox:{x:520,y:90,w:620,h:730},
     region:[0,1220], tray:colsFrom(16,5), label:"Left · " + L.generic},
    {dev:R, prefix:"R:", dlay:lR, box:{x:1470,y:60,w:720,h:920}, legacyBox:{x:1300,y:90,w:620,h:730},
     region:[1220,2440], tray:colsFrom(1236,5), label:"Right · " + R.generic},
  ]});
}
function hint(v, where, extra){
  v.append(el("p",{class:"hint"}, S.arrange
    ? [el("b",{},"Arranging: "), `drag cards to move them; drag a card’s orange pin onto the physical button to draw a leader line; double-click a pin to detach it. Auto-arrange puts every pinned card beside the picture near its button. Positions are saved for ${where}.`]
    : ["Hover a line for the raw action name. Press ", el("b",{},"Arrange"), " to move cards and pin them to buttons.",
       navigator.getGamepads ? " Press a button on your stick or throttle to flash its card." : "", extra ? " " + extra : ""]));
}

function mountBoard(v, spec){
  const stage = el("div",{class:"stage"+(S.arrange?" arrange":""), style:`width:${spec.W}px`});
  const wrap = el("div",{class:"stage-wrap"}, stage);
  const scroller = el("div",{class:"scroller"}, wrap);
  v.append(scroller);
  for (const p of spec.parts){
    const src = imageFor(p.dlay), ars = aspectsFor(p.dlay);
    p.hasImg = !!src;
    p.rects = src ? viewRects(p.box, ars) : null;
    if (src){
      const b = p.box;
      stage.append(el("div",{class:"devglow", style:`left:${b.x-100}px;top:${b.y-30}px;width:${b.w+200}px;height:${b.h+60}px`}));
      src.forEach((u,i) => { const r = p.rects[i];
        stage.append(el("img",{class:"devimg"+(p.dlay.mirror?" mirror":""), src:u, alt:"",
          style:`left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px`})); });
    }
    if (p.label) stage.append(el("div",{class:"devlabel", style:`left:${p.box.x}px;width:${p.box.w}px`}, p.label));
  }
  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("class","lines"); stage.append(svg);
  board = {W:spec.W, lay:spec.store, parts:spec.parts, stage, wrap, scroller, svg, cards:{}, H:MIN_H, scale:1};
  const order = [];
  for (const p of spec.parts){
    for (const [node, list] of groupNodes(p.dev)){
      const key = p.prefix + node;
      const c = cardFor(key, node, list, S.data.ghosts ? S.data.ghosts.get(p.dev.id + "|" + node) : null);
      stage.append(c);
      board.cards[key] = {el:c, h:0, list, part:p};
      order.push(key);
    }
  }
  for (const k of order) board.cards[k].h = board.cards[k].el.offsetHeight;
  migrateAnchors(order);
  placeUnplaced(order);
  for (const k of order){
    const c = board.cards[k], p = board.lay.cards[k];
    c.el.style.left = p.x+"px"; c.el.style.top = p.y+"px";
    wireCard(k);
  }
  applyBoardFilter();
  fit();
}

/* Picture geometry. Pins are stored relative to the drawn picture (view index + u/v in 0..1),
   so they stay on the right button when the page layout, picture size or mirroring changes. */
function aspectsFor(lay){
  if (lay.preset === "custom") return lay.image ? [lay.imageAR || 1] : null;
  const p = lay.preset && PRESETS[lay.preset];
  return p ? p.ar : null;
}
function viewRects(box, ars){
  const n = ars.length, w = box.w / n;
  return ars.map((ar, i) => {
    let rw = w, rh = w / ar;
    if (rh > box.h){ rh = box.h; rw = rh * ar; }
    return {x: box.x + i*w + (w - rw)/2, y: box.y + (box.h - rh)/2, w: rw, h: rh};
  });
}
function anchorXY(p, part){
  if (!p || !p.anchor) return null;
  if (p.u != null && part.rects){
    const r = part.rects[Math.min(p.view||0, part.rects.length-1)];
    const u = part.dlay.mirror ? 1 - p.u : p.u;
    return {x: r.x + u*r.w, y: r.y + p.v*r.h};
  }
  return p.ax != null ? {x:p.ax, y:p.ay} : null;
}
function toRel(x, y, part){
  // pick the view whose rect is closest to the point
  let best = 0, bd = Infinity;
  part.rects.forEach((r,i) => {
    const dx = Math.max(r.x - x, 0, x - (r.x+r.w)), dy = Math.max(r.y - y, 0, y - (r.y+r.h));
    const d = dx*dx + dy*dy; if (d < bd){ bd = d; best = i; }
  });
  const r = part.rects[best];
  let u = clamp((x - r.x)/r.w, -0.15, 1.15), v = clamp((y - r.y)/r.h, -0.15, 1.15);
  if (part.dlay.mirror) u = 1 - u;
  return {view:best, u:+u.toFixed(4), v:+v.toFixed(4)};
}

// Old layouts stored pins as absolute stage coordinates of an earlier page geometry. Convert them once.
function migrateAnchors(order){
  let changed = false;
  for (const k of order){
    const p = board.lay.cards[k], part = board.cards[k].part;
    if (!p || !p.anchor || p.u != null || p.ax == null || !part.hasImg || !part.legacyBox) continue;
    const legacy = Object.assign({}, part, {rects: viewRects(part.legacyBox, aspectsFor(part.dlay))});
    Object.assign(p, toRel(p.ax, p.ay, legacy)); delete p.ax; delete p.ay; changed = true;
  }
  if (changed) saveLayouts();
}

/* ---- picture silhouettes: which parts of the picture are the device (alpha), so cards can use the empty corners */
const MASKS = {};
function maskFor(src){
  const m = MASKS[src];
  if (m) return m.ready ? m : null;
  const nm = MASKS[src] = {ready:false};
  const img = new Image();
  img.onload = () => {
    try {
      const w = 160, h = Math.max(1, Math.round(160 * img.naturalHeight / img.naturalWidth));
      const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
      const ctx = cv.getContext("2d"); ctx.drawImage(img, 0, 0, w, h);
      const d = ctx.getImageData(0, 0, w, h).data, a = new Uint8Array(w*h);
      for (let i = 0; i < w*h; i++) a[i] = d[i*4+3];
      Object.assign(nm, {w, h, a, ready:true});
    } catch { Object.assign(nm, {w:1, h:1, a:new Uint8Array([255]), ready:true}); } // unreadable: treat the whole picture as device
    if (board) renderView();
  };
  img.onerror = () => { Object.assign(nm, {w:1, h:1, a:new Uint8Array([255]), ready:true}); };
  img.src = src;
  return null;
}

function placeUnplaced(order){
  const lay = board.lay, C = 10;                    // grid cell size in stage px
  for (const n of order){ const c = lay.cards[n] || (lay.cards[n] = {auto:true}); if (c.auto !== false){ c.auto = true; delete c.x; delete c.y; } }
  const H = n => board.cards[n].h;
  const put = (n, x, y) => Object.assign(lay.cards[n], {x: Math.round(x), y: Math.round(y), auto:true});
  const imgBottom = Math.max(MIN_H, ...board.parts.map(p => p.hasImg ? p.box.y + p.box.h : 0));
  const GW = Math.ceil(board.W / C), GH = Math.ceil((imgBottom + 700) / C);
  const blocked = new Uint8Array(GW*GH);
  const mark = (x0, y0, x1, y1) => {
    for (let gy = Math.max(0, Math.floor(y0/C)); gy < Math.min(GH, Math.ceil(y1/C)); gy++)
      for (let gx = Math.max(0, Math.floor(x0/C)); gx < Math.min(GW, Math.ceil(x1/C)); gx++) blocked[gy*GW+gx] = 1;
  };
  // device silhouettes (+ a small margin)
  for (const part of board.parts){
    if (!part.hasImg) continue;
    const srcs = imageFor(part.dlay);
    part.rects.forEach((r, i) => {
      const m = maskFor(srcs[i]);
      for (let gy = Math.floor(r.y/C); gy < Math.ceil((r.y+r.h)/C); gy++)
        for (let gx = Math.floor(r.x/C); gx < Math.ceil((r.x+r.w)/C); gx++){
          if (gy < 0 || gy >= GH || gx < 0 || gx >= GW) continue;
          let u = ((gx+.5)*C - r.x)/r.w, v = ((gy+.5)*C - r.y)/r.h;
          if (u < 0 || u > 1 || v < 0 || v > 1) continue;
          if (part.dlay.mirror) u = 1 - u;
          const solid = m ? m.a[Math.min(m.h-1, Math.floor(v*m.h))*m.w + Math.min(m.w-1, Math.floor(u*m.w))] > 50 : true;
          if (solid) mark(gx*C - C, gy*C - C, gx*C + 2*C, gy*C + 2*C);
        }
    });
    if (part.label) mark(part.box.x, 0, part.box.x + part.box.w, 34);
  }
  // pins, and cards the user placed by hand
  const anchors = {};
  for (const n of order){
    const a = anchorXY(lay.cards[n], board.cards[n].part);
    if (a){ anchors[n] = a; mark(a.x-14, a.y-14, a.x+14, a.y+14); }
    const p = lay.cards[n];
    if (!p.auto) mark(p.x - C, p.y - C, p.x + CW + C, p.y + H(n) + C);
  }
  const lines = [];   // placed leader lines, as segments
  const cardRects = order.filter(n => !lay.cards[n].auto).map(n => ({x:lay.cards[n].x, y:lay.cards[n].y, w:CW, h:H(n)}));
  const segHitsRect = (s, r) => {
    for (let t = 0; t <= 1; t += 0.04){ const x = s.x1 + (s.x2-s.x1)*t, y = s.y1 + (s.y2-s.y1)*t;
      if (x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h) return true; }
    return false;
  };
  const cross = (a, b) => {
    const d = (p,q,r) => (q.x-p.x)*(r.y-p.y) - (q.y-p.y)*(r.x-p.x);
    const A={x:a.x1,y:a.y1},B={x:a.x2,y:a.y2},P={x:b.x1,y:b.y1},Q={x:b.x2,y:b.y2};
    return d(A,B,P)*d(A,B,Q) < 0 && d(P,Q,A)*d(P,Q,B) < 0;
  };
  const leader = (x, y, h, a) => {
    const sx = a.x < x ? x : a.x > x + CW ? x + CW : clamp(a.x, x+12, x+CW-12);
    const sy = (a.x < x || a.x > x + CW) ? clamp(a.y, y+12, y+h-12) : (a.y < y ? y : y + h);
    return {x1:sx, y1:sy, x2:a.x, y2:a.y};
  };

  for (const part of board.parts){
    const mine = order.filter(n => board.cards[n].part === part && lay.cards[n].auto);
    const pinned = mine.filter(n => anchors[n] && part.hasImg), loose = mine.filter(n => !pinned.includes(n));
    const rx0 = part.region ? part.region[0] : 0, rx1 = part.region ? part.region[1] : board.W;
    const top = MARGIN + (part.label ? 24 : 0);
    // big cards first: they are the hardest to fit
    pinned.sort((a,b) => H(b) - H(a) || anchors[a].y - anchors[b].y);
    for (const n of pinned){
      // summed-area table of the current grid
      const S = new Int32Array((GW+1)*(GH+1));
      for (let gy = 0; gy < GH; gy++){ let row = 0;
        for (let gx = 0; gx < GW; gx++){ row += blocked[gy*GW+gx]; S[(gy+1)*(GW+1)+gx+1] = S[gy*(GW+1)+gx+1] + row; } }
      const free = (gx, gy, w, h) => S[(gy+h)*(GW+1)+gx+w] - S[gy*(GW+1)+gx+w] - S[(gy+h)*(GW+1)+gx] + S[gy*(GW+1)+gx] === 0;
      const a = anchors[n], h = H(n), wc = Math.ceil(CW/C), hc = Math.ceil(h/C);
      const cands = [];
      for (let gy = Math.ceil(top/C); gy + hc < GH; gy++)
        for (let gx = Math.ceil((rx0+6)/C); (gx + wc)*C <= rx1 - 6; gx++){
          if (!free(gx, gy, wc, hc)) continue;
          const x = gx*C, y = gy*C;
          const dx = a.x < x ? x - a.x : a.x > x + CW ? a.x - (x + CW) : 0;
          const dy = a.y < y ? y - a.y : a.y > y + h ? a.y - (y + h) : 0;
          cands.push({x, y, cost: Math.hypot(dx, dy*1.2) + (dx === 0 ? 40 : 0)});
        }
      if (!cands.length){ loose.push(n); continue; }
      cands.sort((p,q) => p.cost - q.cost);
      let best = null;
      for (const c of cands.slice(0, 200)){
        const s = leader(c.x, c.y, h, a); let pen = c.cost;
        for (const l of lines) if (cross(s, l)) pen += 120;
        for (const r of cardRects) if (segHitsRect(s, r)) pen += 400;
        const me = {x:c.x, y:c.y, w:CW, h};
        for (const l of lines) if (segHitsRect(l, me)) pen += 400;
        if (!best || pen < best.pen) best = {x:c.x, y:c.y, pen, s};
      }
      put(n, best.x, best.y);
      mark(best.x - C, best.y - C, best.x + CW + C, best.y + h + C);
      lines.push(best.s); cardRects.push({x:best.x, y:best.y, w:CW, h});
    }
    // cards without a pin: rows below everything of this part
    let bottom = part.hasImg ? part.box.y + part.box.h : top;
    for (const n of order) if (board.cards[n].part === part && lay.cards[n].x != null) bottom = Math.max(bottom, lay.cards[n].y + H(n));
    const colY = part.tray.map(() => bottom + GAP*2);
    loose.sort((a,b) => order.indexOf(a) - order.indexOf(b));
    for (const n of loose){
      let ci = 0; for (let i=1;i<colY.length;i++) if (colY[i] < colY[ci] - 1) ci = i;
      put(n, part.tray[ci], colY[ci]); colY[ci] += H(n) + GAP;
    }
  }
  saveLayouts();
}

function stageHeight(){
  let h = board.parts.some(p=>p.hasImg) ? MIN_H : 0;
  for (const [n,c] of Object.entries(board.cards)){
    const p = board.lay.cards[n]; if (!p) continue;
    const a = anchorXY(p, c.part);
    h = Math.max(h, p.y + c.h + MARGIN, a ? a.y + MARGIN : 0);
  }
  return Math.max(h, 300);
}
function fit(){
  if (!board) return;
  const avail = board.scroller.clientWidth;
  board.scale = Math.max(avail / board.W, 0.45);
  board.H = stageHeight();
  board.stage.style.height = board.H + "px";
  board.stage.style.transform = `scale(${board.scale})`;
  board.wrap.style.width = (board.W*board.scale) + "px";
  board.wrap.style.height = (board.H*board.scale) + "px";
  board.svg.setAttribute("width", board.W); board.svg.setAttribute("height", board.H);
  board.svg.setAttribute("viewBox", `0 0 ${board.W} ${board.H}`);
  drawLines();
}
new ResizeObserver(()=>fit()).observe(document.body);

function cardBox(n){
  const p = board.lay.cards[n], c = board.cards[n];
  return {x:p.x, y:p.y, w:CW, h:c.el.offsetHeight || c.h};
}
function drawLines(){
  const svg = board.svg; svg.textContent = "";
  const NS = "http://www.w3.org/2000/svg";
  for (const [n,c] of Object.entries(board.cards)){
    const p = board.lay.cards[n];
    const bx = cardBox(n);
    const pin = c.pin;
    const A = anchorXY(p, c.part);
    if (!A){ if (pin){ pin.style.left = bx.x+"px"; pin.style.top = (bx.y+12)+"px"; pin.classList.add("docked"); } continue; }
    if (c.el.hidden) continue;
    const ax = A.x, ay = A.y;
    let sx, sy, ex;
    if (ax < bx.x){ sx = bx.x; sy = clamp(ay, bx.y+12, bx.y+bx.h-12); ex = sx - 26; }
    else if (ax > bx.x+bx.w){ sx = bx.x+bx.w; sy = clamp(ay, bx.y+12, bx.y+bx.h-12); ex = sx + 26; }
    else { sx = clamp(ax, bx.x+12, bx.x+bx.w-12); sy = ay < bx.y ? bx.y : bx.y+bx.h; ex = null; }
    const path = document.createElementNS(NS,"path");
    const mid = ex == null ? `L ${sx} ${sy + (ay<sy?-18:18)}` : `L ${ex} ${sy}`;
    path.setAttribute("d", `M ${sx} ${sy} ${mid} L ${ax} ${ay}`);
    svg.append(path);
    const fl = board.flash && board.flash.has(n);
    const ring = document.createElementNS(NS,"circle");
    ring.setAttribute("cx",ax); ring.setAttribute("cy",ay); ring.setAttribute("r",9); svg.append(ring);
    for (const e of [path, ring]){ e.dataset.card = n; if (fl) e.classList.add("flash"); }
    const dot = document.createElementNS(NS,"circle");
    dot.setAttribute("class","dot"); dot.setAttribute("cx",ax); dot.setAttribute("cy",ay); dot.setAttribute("r",3.5); svg.append(dot);
    dot.dataset.card = n; if (fl) dot.classList.add("flash");
    if (pin){ pin.style.left = ax+"px"; pin.style.top = ay+"px"; pin.classList.remove("docked"); }
  }
}
const clamp = (v,a,b) => Math.min(Math.max(v,a),b);
const snap = v => Math.round(v/5)*5;

function wireCard(n){
  const c = board.cards[n], p = board.lay.cards[n];
  const pin = el("div",{class:"pin", title:"Drag onto the physical button · double-click to detach"});
  board.stage.append(pin); c.pin = pin;
  c.el.addEventListener("pointerdown", e=>{
    if (!S.arrange || e.button !== 0) return;
    e.preventDefault();
    c.el.setPointerCapture(e.pointerId);
    const sx = e.clientX, sy = e.clientY, ox = p.x, oy = p.y;
    c.el.style.zIndex = 4;
    const move = ev => {
      p.auto = false;
      p.x = snap(clamp(ox + (ev.clientX-sx)/board.scale, 0, board.W-CW));
      p.y = snap(Math.max(0, oy + (ev.clientY-sy)/board.scale));
      c.el.style.left = p.x+"px"; c.el.style.top = p.y+"px";
      drawLines();
    };
    const up = () => { c.el.removeEventListener("pointermove",move); c.el.removeEventListener("pointerup",up); c.el.style.zIndex = ""; saveLayouts(); fit(); };
    c.el.addEventListener("pointermove",move); c.el.addEventListener("pointerup",up);
  });
  pin.addEventListener("pointerdown", e=>{
    if (e.button !== 0) return;
    e.preventDefault(); e.stopPropagation();
    pin.setPointerCapture(e.pointerId);
    const move = ev => {
      const r = board.stage.getBoundingClientRect();
      const x = clamp((ev.clientX - r.left)/board.scale, 0, board.W), y = Math.max(0,(ev.clientY - r.top)/board.scale);
      p.anchor = true;
      if (c.part.hasImg){ Object.assign(p, toRel(x, y, c.part)); delete p.ax; delete p.ay; }
      else { p.ax = snap(x); p.ay = snap(y); }
      drawLines();
    };
    const up = () => { pin.removeEventListener("pointermove",move); pin.removeEventListener("pointerup",up); saveLayouts();
      if (p.auto) renderView(); else fit(); };
    pin.addEventListener("pointermove",move); pin.addEventListener("pointerup",up);
  });
  pin.addEventListener("dblclick", ()=>{ p.anchor = false; delete p.ax; delete p.ay; delete p.u; delete p.v; delete p.view; saveLayouts(); if (p.auto) renderView(); else drawLines(); });
}

function applyBoardFilter(){
  if (!board) return;
  for (const c of Object.values(board.cards)){
    let any = false, hit = false;
    for (const li of c.el.querySelectorAll("li")){
      const vis = visibleCat(li._b) && isCmpVisible(li._b);
      li.hidden = !vis;
      if (vis){ any = true; const m = matchQ(li._b); li.classList.toggle("dim", !!S.q && !m); if (m) hit = true; }
    }
    c.el.hidden = !any;
    if (c.pin) c.pin.hidden = !any;
    c.el.classList.toggle("dim", !!S.q && !hit);
    c.el.classList.toggle("hit", !!S.q && hit);
  }
  drawLines();
}

/* ------------------------------------------------------------ device image */
function pickImage(dev){
  const inp = el("input",{type:"file", accept:"image/*"});
  inp.addEventListener("change", ()=>{
    const f = inp.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, 1600/img.width, 1200/img.height);
        const cv = document.createElement("canvas");
        cv.width = Math.round(img.width*k); cv.height = Math.round(img.height*k);
        const ctx = cv.getContext("2d");
        ctx.fillStyle = "#121417"; ctx.fillRect(0,0,cv.width,cv.height);
        ctx.drawImage(img,0,0,cv.width,cv.height);
        const lay = layouts[layoutKey(dev)];
        lay.image = cv.toDataURL("image/jpeg", 0.85);
        lay.imageAR = cv.width / cv.height;
        switchImage(lay, "custom"); S.arrange = true;
      };
      img.onerror = () => toast("That image couldn’t be read. Try a PNG or JPEG.", true);
      img.src = r.result;
    };
    r.readAsDataURL(f);
  });
  inp.click();
}

function hasPins(lay){ return Object.values(lay.cards).some(c=>c.anchor); }
function switchImage(lay, preset){
  lay.preset = preset;
  if (!hasPins(lay)) lay.cards = {};       // re-flow cards around the new picture
  saveLayouts(); renderView();
}
function imageSelect(dev, lay){
  const sel = el("select",{class:"imgsel", id:"imgsel", "aria-label":"Device picture"},
    el("option",{value:"none"},"No picture"),
    Object.entries(PRESETS).map(([k,p])=>el("option",{value:k}, p.name)),
    lay.image ? el("option",{value:"custom"},"My uploaded picture") : null,
    el("option",{value:"__upload"},"Upload a picture…"));
  sel.value = lay.preset || "none";
  requestAnimationFrame(() => { if (sel.value !== (lay.preset || "none")) sel.value = lay.preset || "none"; });
  sel.addEventListener("change", ()=>{
    if (sel.value === "__upload"){ sel.value = lay.preset || "none"; pickImage(dev); return; }
    switchImage(lay, sel.value);
  });
  return sel;
}

/* ------------------------------------------------------------ layout modal */
/* Everything a default-layout.json needs: the loaded bindings files, the open page, which device is in
   which hand, and every device's layout (card positions, pins, picture and mirroring). Bindings are
   written as file names; the files must sit next to index.html for the page to load them. */
function layoutExport(){
  const out = {app:"sc-binding-board", version:1};
  const pathFor = name => {
    const d = DEFAULTS && Array.isArray(DEFAULTS.bindings) ? DEFAULTS.bindings : [];
    const hit = d.find(b => (typeof b === "string" ? b.split("/").pop() : b.name) === name);
    return hit ? (typeof hit === "string" ? hit : hit.path || hit.name) : name;
  };
  const files = [];
  if (S.sc && !S.isExample && S.scName) files.push(pathFor(S.scName));
  if (S.gr && S.grName) files.push(pathFor(S.grName));
  if (files.length) out.bindings = files;
  if (S.tab) out.tab = S.tab;
  const key = id => id && S.data && S.data.devices[id] ? layoutKey(S.data.devices[id]) : null;
  if (S.sides && (S.sides.left || S.sides.right)) out.sides = {left:key(S.sides.left), right:key(S.sides.right)};
  out.layouts = layouts;
  return out;
}
function openLayoutModal(){
  const json = JSON.stringify(layoutExport(), null, 1);
  const ta = el("textarea",{id:"layoutJson", spellcheck:"false"}); ta.value = json;
  const close = () => m.remove();
  const m = el("div",{class:"modal", onclick:e=>{ if (e.target === m) close(); }},
    el("div",{class:"modal-box", role:"dialog", "aria-modal":"true", "aria-label":"Layout JSON"},
      el("h2",{},"Layout JSON"),
      el("p",{},"Card positions, pins and pictures for every device, plus the loaded bindings files, the open page and which device is in which hand. Copy it to keep a backup, or save it as default-layout.json next to index.html to make it what visitors see first (put the bindings files there too). Paste a saved layout and apply it to restore it."),
      ta,
      el("div",{class:"modal-row"},
        el("button",{class:"btn", onclick:close},"Close"),
        el("button",{class:"btn", onclick:()=>{
          const inp = el("input",{type:"file", accept:".json,.txt,application/json,text/plain"});
          inp.addEventListener("change", ()=>{ const f = inp.files[0]; if (!f) return; const r = new FileReader();
            r.onload = () => { ta.value = String(r.result); toast("Layout file loaded — press Apply"); }; r.readAsText(f); });
          inp.click();
        }},"Open layout file…"),
        el("button",{class:"btn", onclick:async()=>{
          try { await navigator.clipboard.writeText(ta.value); toast("Layout copied"); }
          catch { ta.focus(); ta.select(); toast("Select-all is ready — press Ctrl+C to copy."); }
        }},"Copy"),
        DEFAULTS && DEFAULTS.layouts ? el("button",{class:"btn", title:"Replace every layout with the one in default-layout.json", onclick:()=>{
          close(); resetToDefaults();
        }},"Reset to defaults") : null,
        el("button",{class:"btn primary", onclick:()=>{
          try{
            const o = JSON.parse(ta.value);
            const l = o.layouts || o;
            if (typeof l !== "object") throw 0;
            layouts = Object.assign(layouts, l); saveLayouts();
            if (o.sides){ store.set("scbb.sides", {left:o.sides.left||null, right:o.sides.right||null}); if (S.data) resolveSides(); }
            if (o.tab){ S.tab = o.tab; store.set("scbb.tab", S.tab); }
            close(); if (S.data) rebuild(); else renderView(); toast("Layout applied");
          } catch { toast("That text isn’t a valid layout JSON.", true); }
        }},"Apply pasted layout"))));
  document.body.append(m); ta.focus();
  document.addEventListener("keydown", function esc(e){ if (e.key==="Escape"){ close(); document.removeEventListener("keydown",esc);} });
}

/* ------------------------------------------------------------ table */
const COLS = [
  {id:"dev", name:"Device", get:b=>b.dev},
  {id:"input", name:"Input", get:b=>(b.mods.length? b.mods.map(prettyKey).join(" + ")+" + ":"") + prettyKey(b.node) + (b.dir? " "+DIRS[b.dir]:"")},
  {id:"label", name:"Action", get:b=>b.label},
  {id:"cat", name:"Category", get:b=>CATS[CAT_ORDER[b.cat]].name},
  {id:"mode", name:"Activation", get:b=>b.mode || "press"},
  {id:"map", name:"Context", get:b=>b.map},
];
function renderTable(v){
  const ghostRows = (S.data.cmpOnly || []).map(cb => Object.assign({}, cb, {ghost:true}));
  const rows = [...S.data.bindings, ...ghostRows].filter(b=>visibleCat(b) && matchQ(b) && isCmpVisible(b));
  const col = COLS.find(c=>c.id===S.sort.col);
  rows.sort((a,b)=>{
    if (S.sort.col === "dev") return devSort(a.dev,b.dev) || nat(a.node,b.node);
    if (S.sort.col === "input") return devSort(a.dev,b.dev) || nat(a.node,b.node);
    return S.sort.dir * col.get(a).localeCompare(col.get(b));
  });
  if (S.sort.dir < 0 && (S.sort.col==="dev"||S.sort.col==="input")) rows.reverse();
  const head = el("tr",{}, COLS.map(c => el("th",{class:S.sort.col===c.id?"sorted":"", scope:"col",
    onclick:()=>{ S.sort = {col:c.id, dir: S.sort.col===c.id ? -S.sort.dir : 1}; renderView(); }},
    c.name + (S.sort.col===c.id ? (S.sort.dir>0?" ↑":" ↓") : ""))));
  const body = rows.map(b => el("tr",{class:(b.diff ? "diff" : "") + (b.ghost ? " ghost" : ""), title: b.ghost ? "Only in " + S.cmp.name : b.diff ? "Not in " + S.cmp.name : ""},
    el("td",{class:"mono"}, (S.data.devices[b.dev] || {generic:b.dev}).generic + (b.ghost ? " · only in " + S.cmp.name : "")),
    el("td",{class:"mono"}, COLS[1].get(b)),
    el("td",{style:`color:var(--c-${b.cat})`}, b.label, el("span",{class:"raw"}, b.action)),
    el("td",{}, COLS[3].get(b)),
    el("td",{class:"mono"}, [...(b.pre||[]), ...(b.tag?[b.tag]:[])].map(t=>"["+t+"]").join("") + " " + (b.mode||"press")),
    el("td",{class:"mono"}, b.map)));
  v.append(el("div",{class:"toolbar"}, el("div",{class:"devname"}, "All bindings", el("small",{}, `${rows.length} shown of ${S.data.bindings.length}`))));
  v.append(el("div",{class:"tablewrap"}, el("table",{}, el("thead",{},head), el("tbody",{},body))));
  board = null;
}
const nat = (a,b) => { const na=+(a.match(/\d+/)||[0])[0], nb=+(b.match(/\d+/)||[0])[0]; return a.replace(/\d+/,"").localeCompare(b.replace(/\d+/,"")) || na-nb; };

/* ------------------------------------------------------------ file input */
function readFile(f){
  if (!f) return;
  const r = new FileReader();
  r.onload = () => load(String(r.result), f.name, false);
  r.onerror = () => toast("Couldn’t read that file.", true);
  r.readAsText(f);
}
$("#btnOpen").addEventListener("click", ()=>$("#file").click());
$("#file").addEventListener("change", e=>{ [...e.target.files].forEach(readFile); e.target.value=""; });
$("#btnDemo").addEventListener("click", ()=>load(DEMO, "example_layout.xml", true));
$("#btnCompare").addEventListener("click", ()=>$("#fileCmp").click());
$("#fileCmp").addEventListener("change", e=>{ const f = e.target.files[0]; e.target.value = ""; if (!f) return;
  const r = new FileReader(); r.onload = () => loadCompare(String(r.result), f.name); r.onerror = () => toast("Couldn’t read that file.", true); r.readAsText(f); });
$("#btnDefaults").addEventListener("click", ()=>resetToDefaults());
const drop = $("#drop");
["dragenter","dragover"].forEach(t=>document.addEventListener(t, e=>{ if ([...(e.dataTransfer?.types||[])].includes("Files")){ e.preventDefault(); drop.classList.add("drag"); } }));
["dragleave","drop"].forEach(t=>document.addEventListener(t, e=>{ if (t==="dragleave" && e.relatedTarget) return; drop.classList.remove("drag"); }));
document.addEventListener("drop", e=>{ e.preventDefault(); [...(e.dataTransfer?.files||[])].forEach(readFile); });
document.addEventListener("paste", e=>{
  if (e.target.closest && e.target.closest("input,textarea")) return;
  const t = e.clipboardData?.getData("text"); if (t && sniff(t)) load(t, "pasted.xml", false);
});
let qTimer; $("#q").addEventListener("input", e=>{ clearTimeout(qTimer); qTimer = setTimeout(()=>{ stopListen(); S.q = e.target.value.trim(); refreshFilter(); }, 120); });

/* ------------------------------------------------------------ example data */
const DEMO = `<?xml version="1.0"?>
<ActionMaps version="1" optionsVersion="2" rebindVersion="2" profileName="example_hosas">
 <CustomisationUIHeader label="example_hosas" description="" image="">
  <devices><keyboard instance="1"/><mouse instance="1"/><joystick instance="1"/><joystick instance="2"/></devices>
 </CustomisationUIHeader>
 <options type="keyboard" instance="1" Product="Keyboard  {6F1D2B61-D5A0-11CF-BFC7-444553540000}"/>
 <options type="joystick" instance="1" Product=" L-VPC Throttle (example)  {01234567-0000-0000-0000-504944564944}"/>
 <options type="joystick" instance="2" Product=" R-VPC Stick (example)  {89ABCDEF-0000-0000-0000-504944564944}"/>
 <actionmap name="spaceship_movement">
  <action name="v_strafe_longitudinal"><rebind input="js1_z"/></action>
  <action name="v_strafe_vertical"><rebind input="js1_slider1"/></action>
  <action name="v_pitch"><rebind input="js2_y"/></action>
  <action name="v_yaw"><rebind input="js2_rotz"/></action>
  <action name="v_roll"><rebind input="js2_x"/></action>
  <action name="v_strafe_up"><rebind input="js1_hat1_up"/></action>
  <action name="v_strafe_down"><rebind input="js1_hat1_down"/></action>
  <action name="v_strafe_left"><rebind input="js1_hat1_left"/></action>
  <action name="v_strafe_right"><rebind input="js1_hat1_right"/></action>
  <action name="v_afterburner"><rebind input="js1_button3"/></action>
  <action name="v_brake"><rebind input="js1_button4"/></action>
  <action name="v_ifcs_toggle_cruise_control"><rebind input="js1_button5" activationMode="tap"/></action>
  <action name="v_ifcs_toggle_speed_limiter"><rebind input="js1_button5" activationMode="hold"/></action>
  <action name="v_ifcs_toggle_vector_decoupling"><rebind input="js2_button7"/></action>
  <action name="v_ifcs_toggle_esp"><rebind input="js2_button7" activationMode="double_tap"/></action>
  <action name="v_ifcs_toggle_gforce_safety"><rebind input="kb1_ralt+g"/></action>
  <action name="v_toggle_landing_system"><rebind input="js1_button10" activationMode="tap"/></action>
  <action name="v_autoland"><rebind input="js1_button10" activationMode="hold"/></action>
  <action name="v_toggle_vtol"><rebind input="js1_button11" activationMode="double_tap"/></action>
 </actionmap>
 <actionmap name="spaceship_quantum">
  <action name="v_toggle_qdrive_engagement"><rebind input="js2_button2" activationMode="hold"/></action>
 </actionmap>
 <actionmap name="spaceship_general">
  <action name="v_flightready"><rebind input="js1_button14"/></action>
  <action name="v_lights"><rebind input="js1_button11"/></action>
  <action name="v_toggle_mining_mode"><rebind input="js1_button25"/></action>
  <action name="v_toggle_salvage_mode"><rebind input="js1_button25" activationMode="double_tap"/></action>
  <action name="v_eject"><rebind input="kb1_ralt+y" activationMode="hold"/></action>
  <action name="v_exit"><rebind input="kb1_y" activationMode="hold"/></action>
  <action name="v_self_destruct"><rebind input="kb1_backspace" activationMode="hold"/></action>
  <action name="v_open_all_doors"><rebind input="kb1_k"/></action>
  <action name="v_lock_all_doors"><rebind input="kb1_k" activationMode="double_tap"/></action>
  <action name="v_atc_request"><rebind input="kb1_lalt+n"/></action>
 </actionmap>
 <actionmap name="spaceship_power">
  <action name="v_power_toggle_weapons"><rebind input="js1_button12"/></action>
  <action name="v_power_toggle_shields"><rebind input="js1_button13"/></action>
  <action name="v_power_toggle_thrusters"><rebind input="js1_button15"/></action>
  <action name="v_power_toggle"><rebind input="js1_button14" activationMode="double_tap"/></action>
 </actionmap>
 <actionmap name="spaceship_shields">
  <action name="v_shield_raise_level_front"><rebind input="js2_hat2_up"/></action>
  <action name="v_shield_raise_level_back"><rebind input="js2_hat2_down"/></action>
  <action name="v_shield_raise_level_left"><rebind input="js2_hat2_left"/></action>
  <action name="v_shield_raise_level_right"><rebind input="js2_hat2_right"/></action>
  <action name="v_shield_reset_level"><rebind input="js2_button9" activationMode="hold"/></action>
 </actionmap>
 <actionmap name="spaceship_weapons">
  <action name="v_attack1_group1"><rebind input="js2_button1"/></action>
  <action name="v_attack1_group2"><rebind input="js2_button3"/></action>
  <action name="v_weapon_cycle_gimbal_mode"><rebind input="js2_button8"/></action>
 </actionmap>
 <actionmap name="spaceship_missiles">
  <action name="v_toggle_missile_mode"><rebind input="js2_button4"/></action>
  <action name="v_weapon_launch_missile"><rebind input="js2_button1" activationMode="press"/></action>
  <action name="v_weapon_increase_max_missiles"><rebind input="js2_button5"/></action>
  <action name="v_weapon_reset_max_missiles"><rebind input="js2_button5" activationMode="hold"/></action>
  <action name="v_weapon_cycle_missile_fwd"><rebind input="js2_hat3_right"/></action>
  <action name="v_weapon_cycle_missile_back"><rebind input="js2_hat3_left"/></action>
 </actionmap>
 <actionmap name="spaceship_defensive">
  <action name="v_weapon_countermeasure_decoy_launch"><rebind input="js2_button6"/></action>
  <action name="v_weapon_countermeasure_noise_launch"><rebind input="js2_button6" activationMode="double_tap"/></action>
 </actionmap>
 <actionmap name="spaceship_targeting">
  <action name="v_target_cycle_hostile_fwd"><rebind input="js2_hat1_right"/></action>
  <action name="v_target_cycle_hostile_back"><rebind input="js2_hat1_left"/></action>
  <action name="v_target_cycle_hostile_reset"><rebind input="js2_hat1_down"/></action>
  <action name="v_target_reticle_focus"><rebind input="js2_hat1_up"/></action>
  <action name="v_target_cycle_all_fwd"><rebind input="js2_hat1_right" activationMode="double_tap"/></action>
  <action name="v_target_cycle_all_back"><rebind input="js2_hat1_left" activationMode="double_tap"/></action>
  <action name="v_target_unlock_selected"><rebind input="js2_hat1_up" activationMode="double_tap"/></action>
  <action name="v_target_cycle_subitem_fwd"><rebind input="js2_hat3_up"/></action>
  <action name="v_target_cycle_subitem_back"><rebind input="js2_hat3_down"/></action>
 </actionmap>
 <actionmap name="spaceship_view">
  <action name="v_view_look_behind"><rebind input="js1_button20" activationMode="hold"/></action>
  <action name="v_view_freelook_mode"><rebind input="js1_button21"/></action>
  <action name="v_view_cycle_fwd"><rebind input="js1_button21" activationMode="double_tap"/></action>
  <action name="v_view_zoom_in"><rebind input="mo1_mwheel_up"/></action>
  <action name="v_view_zoom_out"><rebind input="mo1_mwheel_down"/></action>
 </actionmap>
 <actionmap name="spaceship_mining">
  <action name="v_toggle_mining_laser_fire"><rebind input="js2_button1"/></action>
  <action name="v_mining_use_consumable1"><rebind input="js2_hat4_up"/></action>
  <action name="v_mining_use_consumable2"><rebind input="js2_hat4_left"/></action>
  <action name="v_mining_use_consumable3"><rebind input="js2_hat4_right"/></action>
  <action name="v_increase_mining_throttle"><rebind input="js1_button22"/></action>
  <action name="v_decrease_mining_throttle"><rebind input="js1_button23"/></action>
 </actionmap>
 <actionmap name="spaceship_salvage">
  <action name="v_salvage_toggle_fire_focused"><rebind input="js2_button1"/></action>
  <action name="v_salvage_toggle_fire_left"><rebind input="js2_hat3_left" activationMode="hold"/></action>
  <action name="v_salvage_toggle_fire_right"><rebind input="js2_hat3_right" activationMode="hold"/></action>
 </actionmap>
 <actionmap name="turret_main">
  <action name="turret_recenter"><rebind input="js2_button8" activationMode="hold"/></action>
  <action name="turret_toggle_mouse_mode"><rebind input="js2_button10"/></action>
 </actionmap>
 <actionmap name="spaceship_scanning">
  <action name="v_invoke_ping"><rebind input="js1_button6"/></action>
  <action name="v_scanning_trigger_scan"><rebind input="js2_button1" activationMode="hold"/></action>
 </actionmap>
 <actionmap name="player">
  <action name="foip_pushtotalk"><rebind input="js2_button12" activationMode="hold"/></action>
  <action name="pc_interaction_mode"><rebind input="kb1_f"/></action>
  <action name="ui_toggle_map"><rebind input="kb1_f2"/></action>
 </actionmap>
</ActionMaps>`;

/* ------------------------------------------------------------ defaults */
/* default-layout.json next to index.html sets what a first-time visitor sees:
     "layouts"  – card positions, pins, device pictures (same format as Layout JSON)
     "bindings" – optional list of actionmaps / Gremlin files (paths relative to index.html) shown
                  until the visitor drops their own.
   Layouts a visitor has arranged themselves are never overwritten. The file is fetched, so the page
   must be served over http(s) (GitHub Pages, or `python -m http.server`); opened from disk it is skipped. */
const DEFAULTS_URL = "default-layout.json";
let DEFAULTS = null;
async function fetchText(url){
  const r = await fetch(url.split("/").map(s => s === ".." || s === "." ? s : encodeURIComponent(s)).join("/"), {cache:"no-cache"});
  if (!r.ok) throw new Error(url + ": HTTP " + r.status);
  return r.text();
}
let DEFAULTS_STAMP = "";
async function loadDefaults(){
  let text = "";
  if (window.SCBB_DEFAULTS){ text = JSON.stringify(window.SCBB_DEFAULTS); }
  else if (location.protocol === "file:") return null;
  else { try { text = await fetchText(DEFAULTS_URL); } catch { return null; } }
  try {
    const d = window.SCBB_DEFAULTS || JSON.parse(text);
    let h = 0; for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
    DEFAULTS_STAMP = text.length + ":" + h;
    return d;
  } catch { toast("default-layout.json isn’t valid JSON, so the defaults were skipped.", true); return null; }
}
const untouched = lay => !lay || (!lay.image && Object.values(lay.cards||{}).every(c => c.auto !== false && !c.anchor));
/* force = true when default-layout.json is new or has changed since this browser last saw it:
   then its layouts, view and hands replace what the browser had stored. Otherwise defaults only fill gaps. */
function applyDefaults(force){
  if (!DEFAULTS) return;
  const d = DEFAULTS.layouts;
  if (d && typeof d === "object"){
    let changed = false;
    for (const [k, lay] of Object.entries(d)){
      if (force || untouched(layouts[k])){ layouts[k] = JSON.parse(JSON.stringify(lay)); changed = true; }
    }
    if (changed) saveLayouts();
  }
  if (DEFAULTS.sides && (force || !store.get("scbb.sides", null)))
    store.set("scbb.sides", {left: DEFAULTS.sides.left || null, right: DEFAULTS.sides.right || null});
  if (DEFAULTS.tab && (force || !store.get("scbb.tab", null))){ S.tab = DEFAULTS.tab; store.set("scbb.tab", S.tab); }
}
async function loadDefaultBindings(){
  const list = DEFAULTS && Array.isArray(DEFAULTS.bindings) ? DEFAULTS.bindings : [];
  const got = [], failed = [];
  for (const item of list){
    const path = typeof item === "string" ? item : (item.path || item.name || "file");
    try {
      const text = typeof item === "object" && item.text ? item.text : await fetchText(path);
      got.push({text, name: (typeof item === "object" && item.name) || path.split("/").pop()});
    } catch { failed.push(path); }
  }
  if (failed.length) toast("Couldn’t load the default bindings file" + (failed.length > 1 ? "s " : " ") + failed.join(", ") + ". Paths in default-layout.json are relative to index.html.", true);
  // game bindings first, so the Gremlin profile resolves against them
  got.sort((a,b) => (sniff(a.text) === "sc" ? 0 : 1) - (sniff(b.text) === "sc" ? 0 : 1));
  for (const f of got) load(f.text, f.name, false, true, true);
  if (got.length && DEFAULTS.tab){ S.tab = DEFAULTS.tab; rebuild(); }
  return got.length > 0;
}
async function resetToDefaults(){
  for (const k of ["scbb.xml","scbb.gremlin","scbb.tab","scbb.sides"]) store.set(k, null);
  S.sc = S.gr = null; S.scDefault = S.grDefault = S.isExample = false; S.q = ""; $("#q").value = "";
  layouts = {}; applyDefaults(true);
  if (!(await loadDefaultBindings())) rebuild();
  toast("Back to the default layout and bindings");
}

/* ------------------------------------------------------------ boot */
(async () => {
  DEFAULTS = await loadDefaults();
  if (DEFAULTS){
    const fresh = store.get("scbb.defaultsStamp", null) !== DEFAULTS_STAMP;
    applyDefaults(fresh);
    store.set("scbb.defaultsStamp", DEFAULTS_STAMP);
    const b = $("#btnDefaults"); if (b) b.hidden = false;
  }
  const saved = store.get("scbb.xml", null), savedGr = store.get("scbb.gremlin", null);
  try { if (saved && saved.text){ S.sc = parseActionMaps(saved.text); S.scName = saved.fileName || "actionmaps.xml"; } } catch {}
  try { if (savedGr && savedGr.text){ S.gr = parseGremlin(savedGr.text); S.grName = savedGr.fileName || "gremlin.xml"; } } catch {}
  if (S.sc || S.gr) rebuild();
  else if (!(await loadDefaultBindings())) load(DEMO, "example_layout.xml", true);
})();
})();
