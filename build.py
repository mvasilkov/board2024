#!/usr/bin/env python3
import json
from os.path import abspath
from pathlib import Path
import sys

OUR_ROOT = Path(abspath(__file__)).parent

NATLIB_LICENSE = '''
/** This file is part of natlib.
 * https://github.com/mvasilkov/natlib
 * @license MIT | Copyright (c) 2022, 2023, 2024 Mark Vasilkov
 */
'use strict'
'''.strip()

FILE_LICENSE = '''
/** This file is part of King Thirteen.
 * https://github.com/mvasilkov/board2024
 * @license Proprietary | Copyright (c) 2024 Mark Vasilkov
 */
'use strict'
'''.strip()

OUT_FILE = f'''
{FILE_LICENSE}

export const value = %s
export const width = %d
export const height = %d
export const cardinality = %d
export const palette = %s
'''.lstrip()

BUILD_DIR = OUR_ROOT / 'build'

HTML_LINK_CSS = '<link rel=stylesheet href=./app.css>'
HTML_INLINE_CSS = '<style>%s</style>'
HTML_LINK_JS = '<script type=module src=./app.js></script>'
HTML_INLINE_JS = '<script>%s</script>'

MANIFEST_IN = OUR_ROOT / 'out' / 'app.json'
MANIFEST_OUT = BUILD_DIR / 'app.json'


def build_inline():
    index = (BUILD_DIR / 'index.html').read_text(encoding='utf-8')
    app_css = (BUILD_DIR / 'app.opt.css').read_text(encoding='utf-8')
    app_js = (BUILD_DIR / 'app.opt.js').read_text(encoding='utf-8')

    app_js = app_js.replace('</', '<\\x2f')

    # https://html.spec.whatwg.org/multipage/parsing.html#rawtext-state
    assert '</' not in app_css
    # https://html.spec.whatwg.org/multipage/parsing.html#script-data-state
    assert '</' not in app_js
    assert '<!' not in app_js

    assert HTML_LINK_CSS in index
    index = index.replace(HTML_LINK_CSS, HTML_INLINE_CSS % app_css, 1)
    assert HTML_LINK_JS in index
    index = index.replace(HTML_LINK_JS, HTML_INLINE_JS % app_js, 1)

    (BUILD_DIR / 'index.html').write_text(index, encoding='utf-8', newline='\n')


def build_validate():
    for file in list(OUR_ROOT.glob('out/**/*.js')):
        content = file.read_text(encoding='utf-8')
        if not content.startswith(FILE_LICENSE) and not content.startswith(NATLIB_LICENSE):
            raise RuntimeError(f'Invalid file header: {file.relative_to(OUR_ROOT)}')

        if '// .' in content:
            raise RuntimeError(f'Leftover Michikoid syntax: {file.relative_to(OUR_ROOT)}')


def build_manifest():
    obj = json.loads(MANIFEST_IN.read_text(encoding='utf-8'))
    MANIFEST_OUT.write_text(json.dumps(obj, separators=(',', ':')), encoding='utf-8', newline='\n')


if __name__ == '__main__':
    if len(sys.argv) != 2 or sys.argv[1] not in ('pictures', 'inline', 'validate', 'levels', 'manifest'):
        print('Usage: build.py <inline | validate | manifest>')
        print('To rebuild the entire thing, run `build.sh` instead.')
        sys.exit(-1)

    match sys.argv[1]:
        case 'inline':
            build_inline()
        case 'validate':
            build_validate()
        case 'manifest':
            build_manifest()
