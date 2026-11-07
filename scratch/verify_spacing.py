card_w = 340
spacing = 300

for i, name in enumerate(["Fish AI", "Rosa Store", "Iwakmart", "IoT GPS", "Portfolio"]):
    h = i - 2 # when center is index 2 (Iwakmart) or index 0 (Fish AI)
    rotY = -h * 18
    transZ = -abs(h)**1.3 * 85
    x = h * spacing
    scale = 1 - abs(h) * 0.06
    print(f"{name:12s}: h={h:+2d}, X={x:+5d}px, rotY={rotY:+3d}deg, transZ={transZ:+5.1f}px, scale={scale:.2f}")

