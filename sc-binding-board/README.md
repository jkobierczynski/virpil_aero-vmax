# Star Citizen Binding Board

A small, dependency-free web page that turns your Star Citizen bindings into a
readable binding chart, one card per physical button, laid over a picture of
your HOTAS.

- Reads the game's **`actionmaps.xml`** or an exported layout.
- Optionally reads a **Joystick Gremlin profile** and follows every physical
  button through Gremlin → vJoy → game action, including modifier layers,
  Gremlin modes, tempo long-presses and macros.
- **Three chart pages:** *Left hand*, *Right hand* and *Both* side by side.
  Pick any device for either hand (throttle + stick, two sticks, or just one).
  Each page remembers its own card positions and leader-line pins.
- **Find tab:** type what you want to do (“quantum”, “doors”, “js2 button 5”)
  or press a key or HOTAS button, and see the binding, grouped by the
  *Options › Keybindings* page it is on in the game. Click a result to jump to
  that card on the chart. Searches understand everyday words (boost →
  afterburner, flares → decoys, landing gear → landing system).
- **Press a HOTAS button, push a hat or move an axis on a chart page** and
  its card and leader line flash yellow for 3 seconds; a moved axis also
  gets a live position bar (−100% … +100%) in its card header. Axes react
  only to a clear movement (20% of travel), not to jitter. Uses the browser's controller support, which
  counts buttons from 1 like the game does; the stick or throttle is matched
  by name. With Joystick Gremlin running, the browser usually sees only
  Gremlin's vJoy devices; a vJoy button is then traced back through the
  loaded Gremlin profile to the physical button that drives it. If the other
  hand lights up, use **swap vJoy order** under the file list. (Browsers only
  report a controller after its first button press.)
- **Compare** with another Star Citizen bindings file (for example a newer
  Subliminal export): bindings that differ from the loaded ones turn red on
  the charts, in *All bindings* and in *Find*; bindings only in the other
  file show struck through on the button they use, followed through
  Joystick Gremlin to the physical button. "Only show differences" hides the
  rest.
- Colour-coded categories (combat, flight, power, mining, salvage…), search,
  and a sortable table of every binding.
- Everything runs in the browser. Files are never uploaded anywhere; the last
  files and your layouts are kept in the browser's local storage.

## Use it

Open `index.html` in a browser (or host the folder on GitHub Pages), then drop
in your files:

| File | Where to find it |
|---|---|
| `actionmaps.xml` | `…\StarCitizen\LIVE\user\client\0\Profiles\default\actionmaps.xml` (only your changes from the defaults) |
| Full export | In game: *Options → Keybindings → Advanced Controls Customization → Save/Export*, tick “export complete profile”. Lands in `…\LIVE\user\client\0\controls\mappings\` |
| Gremlin profile | The `.xml` you open in Joystick Gremlin |

With a Gremlin profile loaded, check the **vJoy → game** row: by default vJoy 1
is matched to the game's `js1`, vJoy 2 to `js2`, and so on.

### Tags

| Tag | Meaning |
|---|---|
| `[H]` | Hold (game activation mode, or a Gremlin tempo long-press) |
| `[DT]` | Double tap |
| `[T]` | Tap |
| `[LP]` | Long press (game) |
| `[M·RALT]` | Game binding with a keyboard modifier |
| `[M]` | Gremlin modifier layer (a mode reached with a temporary mode switch) |

On the vJoy pages, a Gremlin modifier layer that sends each button to a second
vJoy button (for example button 16 → 56) is shown on one card: the second
button's bindings join the first button's card, tagged `[M]`, and the card
header says `[M] 56`. The pairs are read from the Gremlin profile. Use the link
in the *vJoy → game* row to show them as separate cards again.
| `[NAV]`, `[AUX]`, … | Other Gremlin modes (only shown where they differ from the base mode) |
| `[REL]` / `[MACRO]` | Fired by a Gremlin macro, on release / on press |

### Making a chart

1. Open *Left hand*, *Right hand* or *Both*.
2. Press **Arrange**.
3. Drag cards where you want them, and drag each card's orange pin onto the
   physical button to draw a leader line. Double-click a pin to detach it.
4. **Layout JSON** copies all layouts so you can back them up or share them.

Pictures: VIRPIL VMAX throttle and Aeromax-R stick are built in (two views
each). Any other device can use an uploaded picture.

### Default layout, view and bindings

Put a `default-layout.json` next to `index.html` and the page starts from it:

```json
{
 "app": "sc-binding-board",
 "version": 1,
 "bindings": ["layout_KJ_481_LIVE_VMAX_AERO_exported.xml",
              "Joystick Gremlin Profile [ENH][VMAX+AERO][4.5.0]-KJ.xml"],
 "tab": "both",
 "sides": {"left": "vpc cdt-vmax throttle", "right": "right vpc cdt-aeromax"},
 "layouts": { … }
}
```

- Easiest way to make one: arrange your charts, open **Layout JSON**, press
  **Copy** and save it as `default-layout.json`. The copy includes
  everything below: the loaded bindings files, the open page, the hands, and
  every device's layout (card positions, pins, picture, mirroring).
- `bindings` (optional) lists the files to show until a visitor drops their
  own. Paths are relative to `index.html`, so keep the files **inside this
  folder**; only this folder gets deployed to a website.
  They are fetched fresh each visit and never stored.
- `tab` (optional) is the page that opens: `both`, `left`, `right`, `find`,
  `all`, or a device id such as `js1`.
- `sides` (optional) says which device is in which hand, by device name in
  lower case (the same names used as keys in `layouts`).
- When `default-layout.json` changes, every browser applies it again on its
  next visit, replacing its stored layouts, view and hands. Between changes,
  a visitor's own arrangement is kept. The **Defaults** button (top right)
  goes back to the defaults at any time, including the default bindings.
- The file is fetched, so the page has to be served over http(s). Opened
  straight from disk, the defaults are skipped.

## Project layout

```
index.html                 page markup
default-layout.json        default layouts, view, hands and bindings
layout_KJ_481_…xml         default game bindings (KJ 4.8.1 export)
Joystick Gremlin Profile … default Gremlin profile (KJ 4.5.0)
*.xml                      default bindings files named in default-layout.json
css/style.css              styles
js/app.js                  parser, Gremlin resolver and board UI
assets/virpil/*.webp       device pictures (background removed)
examples/                  sample actionmaps.xml
```

## Credits

Product images © VIRPIL Controls, used to illustrate their hardware.
Star Citizen is a trademark of Cloud Imperium Rights LLC. This is an
unofficial fan tool, not affiliated with CIG or VIRPIL.

Inspired by the community binding charts; the layout and code here are
original.
