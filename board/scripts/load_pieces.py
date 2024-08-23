#!/usr/bin/env python3

from pathlib import Path
import re

ts_start = '''
'use strict'
'''.lstrip()

ts_function = '''
export const %sSVG = (color: string, outline: string, highlight: string, lowlight: string, _lowlight2: string) =>
    `%s`
'''.lstrip()


def replace_colors(svg: str) -> str:
    svg_opening_pos = re.match('<svg.*?>', svg).end()
    svg_closing_pos = svg.rfind('</svg>')

    if not re.match('<g\\b', svg[svg_opening_pos : svg_opening_pos + 3]):
        svg = svg[:svg_closing_pos] + '</g>' + svg[svg_closing_pos:]
        svg = svg[:svg_opening_pos] + '<g>' + svg[svg_opening_pos:]

    result = (
        svg.replace(' width="50mm"', '')
        .replace(' height="50mm"', '')
        .replace('fill="#e9e9e9"', 'fill="${color}"')
        .replace('stroke="#2a2a2a"', 'stroke="${outline}"')
        .replace('fill="#fff"', 'fill="${highlight}" style="mix-blend-mode:lighten"')
        .replace('opacity=".2" stroke="#000"', 'fill="${lowlight}" stroke="${lowlight}" style="mix-blend-mode:darken"')
        .replace('opacity=".2"', 'fill="${lowlight}" style="mix-blend-mode:darken"')
        .replace('fill="#010101" opacity=".25"', 'fill="${lowlight}" style="mix-blend-mode:darken"')
        .replace('opacity=".5"', 'fill="${_lowlight2}" style="mix-blend-mode:darken"')
        .replace('stroke-width="1.5"', 'stroke-width="1.2"')
    )
    return result


def load_pieces():
    parent_dir = Path(__file__).parents[1].resolve()

    knight_svg_file = parent_dir / 'pieces' / 'wN.svg'
    knight_svg = knight_svg_file.read_text(encoding='utf-8')

    bishop_svg_file = parent_dir / 'pieces' / 'wB.svg'
    bishop_svg = bishop_svg_file.read_text(encoding='utf-8')

    rook_svg_file = parent_dir / 'pieces' / 'wR.svg'
    rook_svg = rook_svg_file.read_text(encoding='utf-8')

    queen_svg_file = parent_dir / 'pieces' / 'wQ.svg'
    queen_svg = queen_svg_file.read_text(encoding='utf-8')

    king_svg_file = parent_dir / 'pieces' / 'wK.svg'
    king_svg = king_svg_file.read_text(encoding='utf-8')

    assert '`' not in knight_svg
    knight_fn = ts_function % ('knight', replace_colors(knight_svg))

    assert '`' not in bishop_svg
    bishop_fn = ts_function % ('bishop', replace_colors(bishop_svg))

    assert '`' not in rook_svg
    rook_fn = ts_function % ('rook', replace_colors(rook_svg))

    assert '`' not in queen_svg
    queen_fn = ts_function % ('queen', replace_colors(queen_svg))

    assert '`' not in king_svg
    king_fn = ts_function % ('king', replace_colors(king_svg))

    outfile = parent_dir / 'typescript' / 'pieces.ts'
    outfile_text = '\n'.join([ts_start, knight_fn, bishop_fn, rook_fn, queen_fn, king_fn])
    outfile.write_text(outfile_text, encoding='utf-8', newline='\n')


if __name__ == '__main__':
    load_pieces()
