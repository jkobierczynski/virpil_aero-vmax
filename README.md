# VIRPIL Config for VPC CDT-VMAX Throttle + RIGHT VPC CDT-AEROMAX Joystick Combination

This configuration is based on **Subliminal's Virpil VMAX Throttle + Aeromax-R Enhanced Star Citizen Bindings**, available at:  
https://subliminal.gg/bindings/virpil-vmax-aeromax-r

Joystick Gremlin is effectively required here: Star Citizen's missile controls don't map cleanly onto the Aeromax-R flip trigger, which emits only a press event with no separate signal on release. Gremlin bridges the gap by splitting the trigger's press and release into two distinct vJoy buttons.

After testing the original bindings, I made the following changes to accommodate some of my personal preferences:

## Joystick Gremlin Changes
- I did not like the **NAV/SCM overlay** on Throttle Button 21 and the **AUX overlay** on Button 22 as much as the **Missile overlay** on AEROMAX Button 3.
- Kept the Missile overlay to maintain flip trigger switching between Missile mode and Gun mode.
- Removed the NAV/SCM overlay from these buttons to bind switching between the modes directly inside Star Citizen.

## Star Citizen Changes
### Axis & Mode Adjustments (personal preferences)
- Switched **Y** and **Z** axes (Yaw ↔ Roll)
- Unbind Right Shift from **v_lock_rotation**
- Kept **Master Mode Cycle** on the Master Mode Cycle position on the Throttle using tap
- Moved **Quantum Drive engagement** also on the Master Mode Cycle position on the Throttle with hold to trigger
- Set **Brake** to the former Auxiliary Mode Cycle position
- Moved **Auxiliary Mode Cycle** to the former Decoy button position
- Moved **Operator Mode Cycle Forward** to former Decoy position
- Moved **Decoy** / **Noise** to the former Decouple button position + modifier button
- Moved **Decouple** to the former VTOL Cycle button position
- Moved **VTOL Cycle** to the former Open Door Toggle position, with no door buttons on joystick anymore

| Function | Now on (former position) | Notes |
|---|---|---|
| **Brake** | Auxiliary Mode Cycle | |
| **Auxiliary Mode Cycle** | Decoy | |
| **Operator Mode Cycle Forward** | Decoy | |
| **Decoy** / **Noise** | Decouple | + modifier button |
| **Decouple** | VTOL Cycle | |
| **VTOL Cycle** | Open Door Toggle | Door buttons removed from joystick |

- Changed **Capacitor Reset** to no longer require a Modifier key
- Moved **Engineering Assignment Reset** to no longer require a physical modifier button
- Unbound **Eject** (was on [M], removed to prevent accidental ejection).

### Camera & View Changes (my preferences for streaming with a left numberpad)
- Moved **Cycle Camera View** from **F4** to **Z**
- Set **Mouse Button 3** (middle mouse) for Freelook
- Set **Right Alt** for 3rd-person Freelook
- Removed **Numpad 1-9** for load/save views
- Assigned **Numpad 4–9** for camera XYZ movement

### Miscellaneous
- **-** (minus) key for VoIP
- **=** (equals) key to toggle Tobii eye tracking
- unbind Eject button
- set **Left shift + D key** to Close doors
- set **Right shift + D key** to Open doors
- set **Left shift + L key** to Lock doors
- set **Right shift + L key** to Unlock doors
  
