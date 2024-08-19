'use strict'

import { Settings } from './definitions.js'
import { knightSVG } from './pieces.js'
import { cellRefs, getColors } from './rendering.js'

export const renderBoard = () => {
    for (let y = 0; y < Settings.boardHeight; ++y) {
        for (let x = 0; x < Settings.boardWidth; ++x) {
            // Piece value (debug)
            const value = (x + y * Settings.boardWidth) % 12 + 1
            const colors = getColors(value)

            const cell = cellRefs[y]![x]!
            const piece = document.createElement('div')

            piece.className = 'p'
            piece.innerHTML = knightSVG(...colors)

            // Outline
            const g = piece.firstChild!.firstChild!
            const path = g.firstChild!
            const copy = path.cloneNode() as SVGPathElement

            copy.setAttribute('class', 'st')

            g.insertBefore(copy, path)

            // Value
            const val = document.createElement('div')

            val.className = `n n${value}`
            val.textContent = '' + 2 ** value
            val.style.backgroundColor = colors[1] + '90'
            val.style.color = colors[2]

            piece.appendChild(val)

            cell.appendChild(piece)
        }
    }
}
