#!/usr/bin/env python3

from pathlib import Path
import re

ts_start = '''
'use strict'
'''.lstrip()

ts_function = '''
export const %sSVG =
    `%s`
'''.lstrip()


def replace_svg(svg: str) -> str:
    return svg.replace(' width="1em" height="1em"', '', 1)


def load_icons():
    parent_dir = Path(__file__).parents[1].resolve()

    menu_svg_file = parent_dir / 'icons' / 'menu.svg'
    menu_svg = menu_svg_file.read_text(encoding='utf-8')

    music_svg_file = parent_dir / 'icons' / 'music.svg'
    music_svg = music_svg_file.read_text(encoding='utf-8')

    undo_svg_file = parent_dir / 'icons' / 'undo.svg'
    undo_svg = undo_svg_file.read_text(encoding='utf-8')

    assert '`' not in menu_svg
    menu_fn = ts_function % ('menu', replace_svg(menu_svg))

    assert '`' not in music_svg
    music_fn = ts_function % ('music', replace_svg(music_svg))

    assert '`' not in undo_svg
    undo_fn = ts_function % ('undo', replace_svg(undo_svg))

    outfile = parent_dir / 'typescript' / 'icons.ts'
    outfile_text = '\n'.join([ts_start, menu_fn, music_fn, undo_fn])
    outfile.write_text(outfile_text, encoding='utf-8', newline='\n')


if __name__ == '__main__':
    load_icons()
