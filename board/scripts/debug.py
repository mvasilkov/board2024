#!/usr/bin/env python3

from io import StringIO

from but.scripts.batch import run_script

script = '''
--persistent tsc -- --watch --preserveWatchOutput
serve_static -h 127.0.0.1
'''

if __name__ == '__main__':
    script_file = StringIO(script)
    script_file.name = 'debug.py'
    run_script(script_file)
