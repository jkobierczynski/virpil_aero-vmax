# VIRPIL Config for VPC CDT-VMAX Throttle + RIGHT VPC CDT-AEROMAX Joystick Combination

This configuration is based on **Subliminal's Virpil VMAX Throttle + Aeromax-R Enhanced Star Citizen Bindings**, available at:  
[https://store.subliminal.gg/en-eur/products/virpil-vmax-throttle-aeromax-r-enhanced-star-citizen-bindings-joystick-gremlin-required](https://store.subliminal.gg/en-eur/products/virpil-vmax-throttle-aeromax-r-enhanced-star-citizen-bindings-joystick-gremlin-required)

After testing the original bindings, the following changes were made:

## Joystick Gremlin Changes
- Did not like the **NAV/SCM overlay** on Throttle Button 21 and the **AUX overlay** on Button 22 as much as the **Missile overlay** on AEROMAX Button 3.
- Kept the Missile overlay to maintain flip trigger switching between Missile mode and Gun mode.
- Removed the NAV/SCM overlay from these buttons to prevent accidental mode switching.

## Star Citizen Changes
### Axis & Mode Adjustments
- Switched **Y** and **Z** axes (Yaw ↔ Roll)
- Set **Brake** to the former Master Mode Cycle position on the Throttle
- Moved **Master Mode Cycle** to the former Auxiliary Mode Cycle position
- Moved **Auxiliary Mode Cycle** to the former Decoy button position
- Moved **Decoy** to the former Decouple button position
- Moved **Decouple** to the former VTOL Cycle button position
- Moved **VTOL Cycle** to the former Open Door Toggle position
- Changed **Capacitor Reset** to no longer require a Modifier key

### Camera & View Changes
- Moved **Cycle Camera View** from **F4** to **Z**
- Set **Mouse Button 3** (middle mouse) for Freelook
- Set **Right Alt** for 3rd-person Freelook
- Assigned **Numpad 4–9** for camera XYZ movement

### Miscellaneous
- **-** (minus) key for VoIP
- **=** (equals) key to toggle Tobii eye tracking
- Corrected **Eject** binding on **[M]** (previously conflicting with Shield Cap Decrease)
