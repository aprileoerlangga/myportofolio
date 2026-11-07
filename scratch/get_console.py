import subprocess
import json
import urllib.request
import time
import asyncio
import sys

# Write a simple node script or python with websockets or simple urllib
import urllib.request

proc = subprocess.Popen([
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless=new',
    '--remote-debugging-port=9292',
    '--user-data-dir=C:\\Users\\APRILEOERLANGGA\\.gemini\\antigravity\\brain\\b483387a-7d2c-424b-95f6-cfff3297c331\\scratch\\chrome-diag',
    '--disable-gpu',
    'http://localhost:5173/projects'
])

time.sleep(3)

try:
    f = urllib.request.urlopen('http://localhost:9292/json')
    data = json.loads(f.read().decode())
    print('Tabs:', len(data))
    for t in data:
        print('Tab:', t.get('title'), t.get('url'))
        if 'webSocketDebuggerUrl' in t:
            print('WS:', t['webSocketDebuggerUrl'])
finally:
    proc.terminate()

