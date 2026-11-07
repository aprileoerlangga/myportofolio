import math

Vt = 0.7
dollar_e = 0.35
Kt = 24
sr = 2.62
or_val = 0.06
mt = 3.2
Xe = 2.2
wt = 3.1

def Zt(n):
    return math.sqrt(n * n + dollar_e * dollar_e) - dollar_e

def lr(n, e, t):
    i = max(-mt, min(mt, n))
    s = -i * Kt * math.pi / 180
    c = Vt * e * Zt(i)
    o = e / 2
    u = math.cos(s)
    d = math.sin(s)
    g = t * 0.15
    f = o * u * t / max(t - c - o * d, g)
    l = o * u * t / max(t - c + o * d, g)
    return {"left": f, "right": l}

def dr(n, e, t):
    i = [lr(f, e, t) for f in n]
    s = or_val * e
    c = [0.0] * len(n)
    for f in range(1, len(n)):
        c[f] = c[f - 1] + i[f - 1]["right"] + s + i[f]["left"]
    
    o = 0
    while o < len(n) - 2 and n[o + 1] < 0:
        o += 1
    
    u = n[o + 1] - n[o]
    d = 0.0 if u == 0 else (0.0 - n[o]) / u
    g = c[o] + (c[o + 1] - c[o]) * d
    return [f - g for f in c]

# Test with 5 cards: h from -2 to +2
N = 340 # card width
te = sr * N # 890.8 px
ie = [-2, -1, 0, 1, 2]
ne = dr(ie, N, te)

for idx, h in enumerate(ie):
    L = ne[idx]
    j = Vt * N * Zt(h)
    rotY = -h * Kt
    print(f"h={h:+d}: L={L:+7.1f}px, translateZ={j:+6.1f}px, rotateY={rotY:+5.1f}deg")
