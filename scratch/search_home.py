with open('scratch/yaas_home.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

idx = code.find("qt=\"This isn't about")
print(code[idx:idx + 5000])
