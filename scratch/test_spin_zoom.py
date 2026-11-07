import math

def ease_in_out(t):
    return 2 * t * t if t < 0.5 else 1 - math.pow(-2 * t + 2, 2) / 2

for p in [0.0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.0]:
    # Spin progress (0 to 0.60)
    spin_raw = max(0.0, min(1.0, (p - 0.05) / 0.55))
    spin = ease_in_out(spin_raw)
    
    # Zoom progress (0.62 to 0.95)
    zoom_raw = max(0.0, min(1.0, (p - 0.62) / 0.33))
    zoom = ease_in_out(zoom_raw)
    
    # Current active offset: starts at 0, spins to 4 (the rightmost project)
    current_offset = spin * 4.0
    
    print(f"Scroll={p:.2f} | Spin={spin:.2f} (offset={current_offset:.2f}) | Zoom={zoom:.2f} (scale={1.0 + 0.35*zoom:.2f}, titleOpacity={1.0 - zoom:.2f})")

