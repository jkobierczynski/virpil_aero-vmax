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

Pictures: VIRPIL VMAX throttle, Aeromax-R stick and the left-hand Aeromax-L on
the OmniThrottle base are built in (two views each). A device whose name
starts with "LEFT"/"L-" and contains "Aeromax", or contains "Omni", gets the
Aeromax-L picture automatically. Any other device can use an uploaded picture.

### Setups: switch everything in one action

A layout JSON is a complete **setup**: it names the game bindings and the
Joystick Gremlin profile, and carries the device pictures, the card layout,
which device is in which hand, and the page that opens. Loading one switches
all of that at once:

- **Setup** (top of the page) lists the setups in this folder; choosing one
  loads it. The list comes from `"setups"` in `default-layout.json`:

  ```json
  "setups": [
    {"name": "VMAX throttle + Aeromax-R", "file": "default-layout.json"},
    {"name": "Aeromax-L + Aeromax-R",     "file": "laero-raero-layout.json"}
  ]
  ```

  The first entry is the default that visitors see. To add a setup, put its
  layout JSON and the two XML files it names in this folder and add a line.
- **Open…** or drag-and-drop accepts a layout JSON too. The XML files it names
  are taken from the same drop if they are there (the names don't have to
  match exactly), otherwise fetched from this folder. If one can't be found,
  the page says which.
- **Layout JSON → Copy** produces such a file for whatever is on screen;
  **Apply** there loads one the same way.
- The chosen setup is remembered in the browser. **Defaults** goes back to
  the default setup.

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

### Browsers and HOTAS buttons

- **Chrome (and Edge) report at most 32 buttons per controller.** vJoy
  buttons above 32 never reach the page, so they can't flash or be found
  with *Press a HOTAS button*. With a Gremlin modifier layer that sends
  buttons to vJoy 41 and up, the modifier layer is invisible in Chrome;
  the cards still show those bindings, marked `[M]`.
- **Firefox** has no 32-button limit, but only gives pages access to
  controllers over `https://` (or `http://localhost`); opened from disk or
  over plain `http://` it reports no controllers at all. If controllers
  still don't show, check in `about:config` that `dom.gamepad.enabled` is
  true, and try with privacy-hardening options (such as
  `privacy.resistFingerprinting`) switched off.
- Every browser only reports a controller after a button on it is pressed
  while the page has focus.
- The **Controllers** line under the file list shows what the browser
  actually reports: each device, its number of buttons and axes, and what is
  pressed right now. If a button never appears there, the page can't see it.

## Project layout

```
index.html                 page markup
default-layout.json        the default setup, and the list of setups
laero-raero-layout.json    setup: Aeromax-L + Aeromax-R (with its two XML files)
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
