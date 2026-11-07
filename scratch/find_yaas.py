import re

with open(r'C:\Users\APRILEOERLANGGA\.gemini\antigravity\brain\b483387a-7d2c-424b-95f6-cfff3297c331\.system_generated\steps\9589\output.txt', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

scripts = re.findall(r'src=["\']([^"\']+\.js)["\']', text)
print("Scripts found:", scripts)

