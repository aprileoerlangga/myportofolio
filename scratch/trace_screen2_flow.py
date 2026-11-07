with open('scratch/yaas_home.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect the entire `screen2` component and its children!
idx = text.find('function pr()')
print('=== FUNCTION pr() (SCREEN2 COMPONENT) ===')
print(text[idx:idx+500])

# What are the children of screen2?
# r.jsx(ur,{}), r.jsx(hr,{})
# Let's inspect function ur() completely:
idx_ur = text.find('function ur()')
print('=== FUNCTION ur() ===')
print(text[idx_ur:idx_ur+2500])

# Let's inspect function hr() completely:
idx_hr = text.find('function hr()')
print('=== FUNCTION hr() ===')
print(text[idx_hr:idx_hr+2500])

