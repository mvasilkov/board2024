'use strict'

import { Settings } from './definitions.js'

const getCellRefs = () => {
    const cellRefs: Element[][] = []
    const cells = document.querySelectorAll('.c')

    for (let y = 0; y < Settings.boardHeight; ++y) {
        cellRefs[y] = []

        for (let x = 0; x < Settings.boardWidth; ++x) {
            cellRefs[y]![x] = cells[4 * y + x]!
        }
    }

    return cellRefs
}

export const cellRefs = getCellRefs()

export const renderBoard = () => {
}
