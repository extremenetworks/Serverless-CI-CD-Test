import re
import time
import threading
import subprocess
from prettytable import PrettyTable

def postTest(isPass):
    if isPass:
        subprocess.Popen(["cf_export", 'CF_UNIT_TEST_STATUS=SUCCESS'])
    else:
        subprocess.Popen(["cf_export", 'CF_UNIT_TEST_STATUS=FAILED'])

def createTestOutput(case, result, out, tab):
    method, path = re.findall(".*\.(.*)\(\"(.*)\"\).*", case)[0]
    tab.add_row([path, method.upper(), result, out])

def outputReader(proc):
    isPass = True
    _count = 0
    cases = [line for line in open("test.js", "r")]
    num = len(cases)
    tab = PrettyTable(['PATH', 'METHOD', 'RESULT', 'RESPONSE'])
    for line in iter(proc.stdout.readline, b''):
        decodedLine = line.decode('utf-8')
        if "RESPONSE" in decodedLine:
            if decodedLine.find('200') >= 0 or decodedLine.find("201")>=0:
                createTestOutput(cases[_count], 'SUCCESS', decodedLine, tab)
            else:
                createTestOutput(cases[_count], 'FAILED', decodedLine, tab)
                isPass = False
            _count += 1
        if _count == num:
            postTest(isPass)
            proc.stdout.close()
            proc.terminate()
            print(tab)
            break

def main():
    cmd = "firebase functions:shell < test.js"
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stdin=subprocess.PIPE, shell=True)
    th = threading.Thread(target=outputReader, args=(proc, ))
    th.start()
    time.sleep(20)
    exit()

if __name__ == '__main__':
    main()
