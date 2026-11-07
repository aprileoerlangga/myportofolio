import subprocess
import time

proc = subprocess.Popen([
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless=new',
    '--window-size=1366,768',
    '--screenshot=C:\\Users\\APRILEOERLANGGA\\my-portofolio\\scratch\\web_view_1366.png',
    'http://localhost:5173/projects'
])
time.sleep(4)
proc.terminate()
print('Captured!')

