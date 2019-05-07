import re
import time
import threading
import subprocess
from prettytable import PrettyTable

def createTestOutput(case, result, tab):
    method, path = re.findall(".*\.(.*)\(\"(.*)\"\).*", case)[0]
    tab.add_row([path, method.upper(), result])

def outputReader(proc):
    _count = 0
    cases = [line for line in open("test.js", "r")]
    num = len(cases)
    tab = PrettyTable(['PATH', 'METHOD', 'RESULT'])
    for line in iter(proc.stdout.readline, b''):
        decodedLine = line.decode('utf-8')
        if "RESPONSE" in decodedLine:
            if '200' or '201' in decodedLine:
                createTestOutput(cases[_count], 'SUCCESS', tab)
            else:
                createTestOutput(cases[_count], 'FAILED', tab)
            _count += 1
        if _count == num:
            proc.stdout.close()
            proc.terminate()
            print(tab)
            break

def main():
    cmd = "sudo firebase functions:shell < test.js"
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stdin=subprocess.PIPE, shell=True)
    th = threading.Thread(target=outputReader, args=(proc, ))
    th.start()
    time.sleep(20)
    exit()

if __name__ == '__main__':
    main()
