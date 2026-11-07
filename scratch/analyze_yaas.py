import re

with open('scratch/yaas_home.js', 'r', encoding='utf-8') as f:
    text = f.read()

screens = re.findall(r'className:"([^"]*screen[^"]*)"', text)
print('Screen classes:', set(screens))

headings = re.findall(r'className:"([^"]*head[^"]*)"', text)
print('Heading classes:', set(headings))

