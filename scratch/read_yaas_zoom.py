with open('scratch/yaas_home.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('const S=vt(Te(A/Ye))')
print('=== YAAS SPIN & ZOOM SEQUENCE ===')
print(text[idx-50:idx+800])

