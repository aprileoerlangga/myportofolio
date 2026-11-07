with open('scratch/yaas_home.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('const gr="Why YAAS Beats')
print('=== AFTER SCREEN2 ===')
print(text[idx:idx+1500])

