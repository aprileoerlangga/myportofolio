with open('scratch/yaas_home.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('p.forEach((k,x)=>{')
print(text[idx:idx+1200])

