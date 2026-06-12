import socket, subprocess, sys
port = 8180
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
in_use = s.connect_ex(('127.0.0.1', port)) == 0
s.close()
if in_use:
    if sys.platform == 'win32':
        out = subprocess.check_output('netstat -ano', shell=True).decode()
        for line in out.splitlines():
            if f':{port}' in line and 'LISTENING' in line:
                pid = line.strip().split()[-1]
                subprocess.run(f'taskkill /F /PID {pid}', shell=True)
    else:
        subprocess.run(f'fuser -k {port}/tcp', shell=True)
