card_w = 300
card_h = 220
spacing = 270 # px between card centers

for i in range(5):
    h = i - 2 # 0, 1, 2, 3, 4 -> -2, -1, 0, 1, 2
    rotY = -h * 16 # -32, -16, 0, 16, 32 -> rotY = +32, +16, 0, -16, -32
    transZ = -abs(h)**1.25 * 60
    x = h * spacing
    scale = 1 - abs(h) * 0.05
    print(f"Card {i} (h={h:+d}): X={x:+5d}px, rotY={rotY:+3d}deg, transZ={transZ:+5.1f}px, scale={scale:.2f}")

