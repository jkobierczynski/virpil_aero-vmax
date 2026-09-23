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

## Project layout

```
index.html                 page markup
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
