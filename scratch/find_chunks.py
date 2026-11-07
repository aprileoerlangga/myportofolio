import re

with open('scratch/yaas_index.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

chunks = re.findall(r'assets/[a-zA-Z0-9_\-\.]+\.js', code)
print("Unique chunks:", sorted(list(set(chunks))))

