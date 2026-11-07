import math

cardWidth = 420 # px
Kt = 22 # deg

for h in [-2, -1, 0, 1, 2]:
    rotY = -h * Kt
    # recede backward (negative Z)
    depth = -(abs(h) ** 1.35) * 95
    x = h * (cardWidth * 0.82)
    scale = 1 - abs(h) * 0.07
    opacity = max(0.2, 1 - abs(h) * 0.22)
    print(f"h={h:+d}: X={x:+7.1f}px, rotY={rotY:+5.1f}deg, transZ={depth:+7.1f}px, scale={scale:.2f}, opacity={opacity:.2f}")

