import re

with open('scratch/yaas_index.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

# Search for the heading
idx = code.find("THIS ISN'T ABOUT")
if idx == -1:
    idx = code.find("LOCKED IN")
if idx == -1:
    idx = code.find("hyping")
print("Index:", idx)

if idx != -1:
    start = max(0, idx - 1500)
    end = min(len(code), idx + 2500)
    print("--- SNIPPET ---")
    print(code[start:end])
else:
    print("Searching lowercase...")
    m = re.search(r'hyping|schedule.*100%|own thing', code, re.IGNORECASE)
    if m:
        idx = m.start()
        print("Found at:", idx)
        print(code[max(0, idx-1000):min(len(code), idx+2000)])

