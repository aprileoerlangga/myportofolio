with open('scratch/yaas_home.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('screen2-arc')
print('=== AROUND screen2-arc ===')
print(text[idx-200:idx+1500])

