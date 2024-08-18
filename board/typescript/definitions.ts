'use strict'

import type { IVec2 } from '../node_modules/natlib/Vec2'
import { ShortBool, type ExtendedBool } from '../node_modules/natlib/prelude.js'
import { Mulberry32 } from '../node_modules/natlib/prng/Mulberry32.js'
import { randomUint32LessThan, type IPrng32 } from '../node_modules/natlib/prng/prng.js'

export const enum Settings {
    boardWidth = 4,
    boardHeight = 4,
}

type Optional<T> = T | null | undefined
type BoardRow = [Optional<number>, Optional<number>, Optional<number>, Optional<number>]
type Board = [BoardRow, BoardRow, BoardRow, BoardRow]

const createBoard = (): Board => {
    return [
        [, , , ,],
        [, , , ,],
        [, , , ,],
        [, , , ,],
    ]
}

let board: Board
let selected: Optional<IVec2>
let ended: ExtendedBool
let prng: IPrng32

export const reset = (seed?: number) => {
    board = createBoard()
    selected = null
    ended = ShortBool.FALSE
    prng = new Mulberry32(seed ?? Date.now())
}

reset()

export const spawn = () => {
    const vacant: IVec2[] = []

    for (let y = 0; y < Settings.boardHeight; ++y) {
        for (let x = 0; x < Settings.boardWidth; ++x) {
            if (!board[y]![x]) {
                vacant.push({ x, y })
            }
        }
    }

    if (!vacant.length) {
        ended = ShortBool.TRUE
        return
    }

    const { x, y } = vacant[randomUint32LessThan(prng, vacant.length)]!
    board[y]![x] = 2
}

export const getMoves = (x0: number, y0: number): IVec2[] => {
    const moves: IVec2[] = []

    const putMove = (Δx: number, Δy: number) => {
        const x = x0 + Δx
        const y = y0 + Δy

        if (x >= 0 && x < Settings.boardWidth &&
            y >= 0 && y < Settings.boardHeight &&
            (!board[y]![x] || board[y]![x] === board[y0]![x0])) {

            moves.push({ x, y })
        }
    }

    putMove(-2, -1)
    putMove(-2, 1)
    putMove(-1, -2)
    putMove(-1, 2)
    putMove(1, -2)
    putMove(1, 2)
    putMove(2, -1)
    putMove(2, 1)

    return moves
}

export const getMovesTable = (x0: number, y0: number): Board => {
    const moves = createBoard()

    getMoves(x0, y0).forEach(({ x, y }) => {
        moves[y]![x] = ShortBool.TRUE
    })

    return moves
}

export const interact = (x: number, y: number) => {
    // Select
    if (!selected) {
        if (board[y]![x]) selected = { x, y }
    }

    // Deselect
    else if (selected.x === x && selected.y === y) {
        selected = null
    }

    // Move
    else if (!board[y]![x]) {
        const moves = getMovesTable(selected.x, selected.y)

        if (moves[y]![x]) {
            board[y]![x] = board[selected.y]![selected.x]
            board[selected.y]![selected.x] = null
            selected = null

            spawn()
            spawn()
        }
        else {
            // Move isn't possible, deselect instead
            selected = null
        }
    }

    // Merge
    else if (board[y]![x] === board[selected.y]![selected.x]) {
        const moves = getMovesTable(selected.x, selected.y)

        if (moves[y]![x]) {
            board[y]![x] *= 2
            board[selected.y]![selected.x] = null
            selected = null

            const nextMove = getMoves(x, y).some(move => board[move.y]![move.x] === board[y]![x])
            if (nextMove) {
                // The piece can continue the chain. Select it
                // and don't spawn new pieces.
                selected = { x, y }
            }
            else {
                spawn()
                spawn()
            }
        }
        else {
            // Merge isn't possible, select instead
            selected = { x, y }
        }
    }

    // Select
    else if (board[y]![x]) {
        selected = { x, y }
    }
}
