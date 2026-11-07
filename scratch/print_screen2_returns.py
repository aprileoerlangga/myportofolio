with open('scratch/yaas_home.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find return statements of ur() and hr()
idx_ur_return = text.find('r.jsxs("section",{className:"screen2-arc"')
print('=== UR RETURN JSX ===')
print(text[idx_ur_return:idx_ur_return+1200])

idx_hr_return = text.find('r.jsx("section",{className:"scenario-cards-iso"')
print('=== HR RETURN JSX ===')
print(text[idx_hr_return:idx_hr_return+1200])

