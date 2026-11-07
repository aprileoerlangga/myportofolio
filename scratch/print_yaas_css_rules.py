with open('scratch/yaas_index.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
matches = re.findall(r'(\.[^{}]*(?:screen2|scenario-card)[^{}]*\{[^{}]*\})', css)
print(f"Found {len(matches)} CSS rules:")
for m in matches:
    print('---')
    print(m)

