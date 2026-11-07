import json
import urllib.request
import subprocess
import time
import os
import websocket # if available, or raw sockets

# Let's write a pure python websocket CDP screenshot script!
import socket
import base64
import hashlib

def run():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    port = 9988
    user_data = os.path.join(os.environ.get('TEMP', '.'), 'chrome_py_snap')
    
    proc = subprocess.Popen([
        chrome_path,
        '--headless=new',
        f'--remote-debugging-port={port}',
        '--window-size=1440,900',
        f'--user-data-dir={user_data}'
    ])
    
    try:
        # Wait for port
        target = None
        for _ in range(25):
            try:
                with urllib.request.urlopen(f'http://127.0.0.1:{port}/json/list') as resp:
                    targets = json.loads(resp.read().decode())
                    if targets:
                        target = targets[0]
                        break
            except Exception:
                time.sleep(0.2)
        
        if not target:
            print("Could not get target")
            return

        ws_url = target['webSocketDebuggerUrl']
        print("WS URL:", ws_url)
        
        # We can use simple urllib/websocket or python-websockets if installed
    finally:
        proc.terminate()

run()

