with open('scratch/yaas_home.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(\.[a-zA-Z0-9_-]*(?:scenario|arc|screen2)[a-zA-Z0-9_-]*\s*\{[^}]*\})', text)
print('CSS in home:', len(matches))

# Let's search in all scratch files for CSS of scenario-card-iso
for fname in ['search_yaas_css.cjs', 'yaas_home.js', 'parse_yaas_css.cjs']:
    try:
        with open('scratch/' + fname, 'r', encoding='utf-8') as f:
            c = f.read()
            if 'scenario-card-iso' in c:
                print('Found scenario-card-iso in', fname)
    except Exception:
        pass

