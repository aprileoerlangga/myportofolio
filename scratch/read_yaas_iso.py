with open('scratch/yaas_home.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('scenario-cards-iso')
print('=== scenario-cards-iso ===')
print(text[idx-200:idx+1500])

