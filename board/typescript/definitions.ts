'use strict'

import type { IVec2 } from '../node_modules/natlib/Vec2'
import { ShortBool, type ExtendedBool } from '../node_modules/natlib/prelude.js'
import { Mulberry32 } from '../node_modules/natlib/prng/Mulberry32.js'
import { randomUint32LessThan } from '../node_modules/natlib/prng/prng.js'

export const enum Settings {
    boardWidth = 4,
    boardHeight = 4,
    kingValue = 10,
    outOfBounds = 9,
    // Thresholds
    bishopThreshold = 4, // '16'
    rookThreshold = 6, // '64'
    queenThreshold = 8, // '256'
}

export const enum PieceSpecies {
    knight = 1,
    bishop,
    rook,
    queen,
    king,
}

type ReadonlyVec2 = Readonly<IVec2>
type Optional<T> = T | null | undefined
type Piece = { species: PieceSpecies, value: number }
type BoardRow<T> = [Optional<T>, Optional<T>, Optional<T>, Optional<T>]
export type Board<T> = [BoardRow<T>, BoardRow<T>, BoardRow<T>, BoardRow<T>]

const createBoard = <T>(): Board<T> => {
    return [
        [, , , ,],
        [, , , ,],
        [, , , ,],
        [, , , ,],
    ]
}

const copyBoard = <T>(board: Board<T>): Board<T> => {
    return [
        board[0].slice() as BoardRow<T>,
        board[1].slice() as BoardRow<T>,
        board[2].slice() as BoardRow<T>,
        board[3].slice() as BoardRow<T>,
    ]
}

export let board: Board<Piece>
/** Selected cell */
export let selected: Optional<ReadonlyVec2>
/** Cell vacated in the last turn */
export let vacated: Optional<ReadonlyVec2>
/** Cell occupied in the last turn */
export let occupied: Optional<ReadonlyVec2>
/** Position of the last spawned piece */
export let spawned: Optional<ReadonlyVec2>
/** Cell vacated by king */
export let kingVacated: Optional<ReadonlyVec2>
/** Cell occupied by king */
export let kingOccupied: Optional<ReadonlyVec2>
/** Highest value achieved */
export let highestValue: number
/** Highest species spawned */
export let highestSpecies: PieceSpecies
let ended: ExtendedBool
let prng: Mulberry32

export const reset = (seed?: number) => {
    board = createBoard()
    selected = null
    vacated = null
    occupied = null
    spawned = null
    kingVacated = null
    kingOccupied = null
    highestValue = 1
    highestSpecies = PieceSpecies.knight
    ended = ShortBool.FALSE
    prng = new Mulberry32(seed ?? Date.now())
}

reset()

type IState = [
    board: Board<Piece>,
    xVacated: number,
    yVacated: number,
    xOccupied: number,
    yOccupied: number,
    xSpawned: number,
    ySpawned: number,
    xKingVacated: number,
    yKingVacated: number,
    xKingOccupied: number,
    yKingOccupied: number,
    highestValue: number,
    highestSpecies: PieceSpecies,
    seed: number,
]

export const takeState = (): IState => {
    return [
        copyBoard(board),
        vacated?.x ?? Settings.outOfBounds,
        vacated?.y ?? Settings.outOfBounds,
        occupied?.x ?? Settings.outOfBounds,
        occupied?.y ?? Settings.outOfBounds,
        spawned?.x ?? Settings.outOfBounds,
        spawned?.y ?? Settings.outOfBounds,
        kingVacated?.x ?? Settings.outOfBounds,
        kingVacated?.y ?? Settings.outOfBounds,
        kingOccupied?.x ?? Settings.outOfBounds,
        kingOccupied?.y ?? Settings.outOfBounds,
        highestValue,
        highestSpecies,
        prng.state,
    ]
}

export const restoreState = (state: IState) => {
    const [
        _board,
        xVacated,
        yVacated,
        xOccupied,
        yOccupied,
        xSpawned,
        ySpawned,
        xKingVacated,
        yKingVacated,
        xKingOccupied,
        yKingOccupied,
        _highestValue,
        _highestSpecies,
        seed,
    ] = state

    reset(seed)

    board = copyBoard(_board)

    vacated = xVacated === Settings.outOfBounds ? null : { x: xVacated, y: yVacated }
    occupied = xOccupied === Settings.outOfBounds ? null : { x: xOccupied, y: yOccupied }
    spawned = xSpawned === Settings.outOfBounds ? null : { x: xSpawned, y: ySpawned }
    kingVacated = xKingVacated === Settings.outOfBounds ? null : { x: xKingVacated, y: yKingVacated }
    kingOccupied = xKingOccupied === Settings.outOfBounds ? null : { x: xKingOccupied, y: yKingOccupied }

    highestValue = _highestValue
    highestSpecies = _highestSpecies
}

const getRandomElement = <T>(array: T[]): Optional<T> => {
    switch (array.length) {
        case 0: return
        case 1: return array[0]
    }
    return array[randomUint32LessThan(prng, array.length)]
}

export const spawn = () => {
    const vacant: ReadonlyVec2[] = []

    for (let y = 0; y < Settings.boardHeight; ++y) {
        for (let x = 0; x < Settings.boardWidth; ++x) {
            if (!board[y]![x]) {
                // Move is still in progress, don't spawn there
                if (kingVacated && kingVacated.x === x && kingVacated.y === y) continue

                vacant.push({ x, y })
            }
        }
    }

    if (!vacant.length) {
        ended = ShortBool.TRUE
        return
    }

    let species = PieceSpecies.knight
    switch (randomUint32LessThan(prng, 9)) {
        case 0:
        case 1:
        case 2:
            // 33.3% chance
            if (highestValue >= Settings.bishopThreshold) species = PieceSpecies.bishop
            break

        case 3:
        case 4:
            // 22.2% chance
            if (highestValue >= Settings.rookThreshold) species = PieceSpecies.rook
            break

        case 5:
            // 11.1% chance
            if (highestValue >= Settings.queenThreshold) species = PieceSpecies.queen
    }

    // Guaranteed pieces
    if (highestValue >= Settings.queenThreshold && highestSpecies < PieceSpecies.queen) species = PieceSpecies.queen
    else if (highestValue >= Settings.rookThreshold && highestSpecies < PieceSpecies.rook) species = PieceSpecies.rook
    else if (highestValue >= Settings.bishopThreshold && highestSpecies < PieceSpecies.bishop) species = PieceSpecies.bishop

    if (species > highestSpecies) highestSpecies = species

    let value = 1
    switch (randomUint32LessThan(prng, 9)) {
        case 0:
        case 1:
            // 22.2% chance
            if (highestValue >= Settings.bishopThreshold) value = 2
            break

        case 2:
            // 11.1% chance
            if (highestValue >= Settings.rookThreshold) value = 3
    }

    const { x, y } = getRandomElement(vacant)!

    if (vacated && vacated.x === x && vacated.y === y) {
        const { x, y } = getRandomElement(vacant)!
        board[y]![x] = { species, value }
        spawned = { x, y }
        return
    }

    board[y]![x] = { species, value }
    spawned = { x, y }
}

export const setSpawned = (x: number, y: number) => {
    spawned = { x, y }
}

export const getMoves = (x0: number, y0: number): ReadonlyVec2[] => {
    const moves: ReadonlyVec2[] = []

    const putMove = (Δx: number, Δy: number): ExtendedBool => {
        const x = x0 + Δx
        const y = y0 + Δy

        let passable: boolean

        if (x >= 0 && x < Settings.boardWidth &&
            y >= 0 && y < Settings.boardHeight &&
            ((passable = !board[y]![x]) || board[y]![x].value === board[y0]![x0]?.value)) {

            moves.push({ x, y })

            return passable
        }

        return
    }

    const piece = board[y0]![x0]
    if (!piece) return moves

    const { species } = piece

    switch (species) {
        case PieceSpecies.knight:
            putMove(-2, -1)
            putMove(-2, 1)
            putMove(-1, -2)
            putMove(-1, 2)
            putMove(1, -2)
            putMove(1, 2)
            putMove(2, -1)
            putMove(2, 1)
            break

        case PieceSpecies.bishop:
            putMove(-1, -1) && putMove(-2, -2) && putMove(-3, -3)
            putMove(-1, 1) && putMove(-2, 2) && putMove(-3, 3)
            putMove(1, -1) && putMove(2, -2) && putMove(3, -3)
            putMove(1, 1) && putMove(2, 2) && putMove(3, 3)
            break

        case PieceSpecies.rook:
            putMove(-1, 0) && putMove(-2, 0) && putMove(-3, 0)
            putMove(0, -1) && putMove(0, -2) && putMove(0, -3)
            putMove(1, 0) && putMove(2, 0) && putMove(3, 0)
            putMove(0, 1) && putMove(0, 2) && putMove(0, 3)
            break

        case PieceSpecies.queen:
            putMove(-1, -1) && putMove(-2, -2) && putMove(-3, -3)
            putMove(-1, 1) && putMove(-2, 2) && putMove(-3, 3)
            putMove(1, -1) && putMove(2, -2) && putMove(3, -3)
            putMove(1, 1) && putMove(2, 2) && putMove(3, 3)

            putMove(-1, 0) && putMove(-2, 0) && putMove(-3, 0)
            putMove(0, -1) && putMove(0, -2) && putMove(0, -3)
            putMove(1, 0) && putMove(2, 0) && putMove(3, 0)
            putMove(0, 1) && putMove(0, 2) && putMove(0, 3)
    }

    return moves
}

export const getMovesTable = (x0: number, y0: number): Board<ShortBool> => {
    const moves = createBoard<ShortBool>()

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
            vacated = selected
            occupied = { x, y }
            selected = null

            playKing()
            spawn()
        }
        else {
            // Move isn't possible, deselect instead
            selected = null
        }
    }

    // Merge
    else if (board[y]![x].value === board[selected.y]![selected.x]?.value) {
        const moves = getMovesTable(selected.x, selected.y)

        if (moves[y]![x]) {
            board[y]![x] = board[selected.y]![selected.x]! // Copy species
            const value = ++board[y]![x].value
            board[selected.y]![selected.x] = null
            vacated = selected
            occupied = { x, y }
            selected = null

            if (value > highestValue) highestValue = value

            const nextMove = getMoves(x, y).some(move => board[move.y]![move.x]?.value === value)
            if (nextMove) {
                // The piece can continue the chain. Select it
                // and don't spawn new pieces.
                selected = { x, y }
            }
            else {
                playKing()
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

const pieceWorth = (piece: Piece): number =>
    piece.species + piece.value

export const playKing = () => {
    let x0: number = Settings.outOfBounds
    let y0: number = Settings.outOfBounds
    let availableCells = 0

    for (let y = 0; y < Settings.boardHeight; ++y) {
        for (let x = 0; x < Settings.boardWidth; ++x) {
            const piece = board[y]![x]
            if (!piece) {
                ++availableCells
            }
            else if (piece.species === PieceSpecies.king) {
                x0 = x
                y0 = y
            }
        }
    }

    // King not found, OR the board is full, OR it will be full after the next spawn.
    if (x0 === Settings.outOfBounds || availableCells === 0 || availableCells === 1) {
        kingVacated = null
        kingOccupied = null
        return
    }

    const possibleMoves: IVec2[] = []
    let possibleTakes: (IVec2 & { worth: number })[] = []

    const putMove = (Δx: number, Δy: number) => {
        const x = x0 + Δx
        const y = y0 + Δy

        if (x >= 0 && x < Settings.boardWidth &&
            y >= 0 && y < Settings.boardHeight) {

            const piece = board[y]![x]
            if (!piece) {
                possibleMoves.push({ x, y })
            }
            else {
                // Move is still in progress, don't take the piece
                if (occupied && occupied.x === x && occupied.y === y) return

                possibleTakes.push({ x, y, worth: pieceWorth(piece) })
            }
        }
    }

    putMove(-1, -1)
    putMove(-1, 0)
    putMove(-1, 1)
    putMove(0, -1)
    putMove(0, 1)
    putMove(1, -1)
    putMove(1, 0)
    putMove(1, 1)

    // Sort by worth, descending
    possibleTakes.sort((a, b) => b.worth - a.worth)

    const highestWorth = possibleTakes[0]?.worth ?? 0

    possibleTakes = possibleTakes.filter(({ worth }) => worth === highestWorth)

    // Take only when the target piece is present, AND the king is surrounded, AND the board isn't full.
    if (highestWorth && !possibleMoves.length /* && !boardFull */) {
        const { x, y } = getRandomElement(possibleTakes)!

        if (selected && selected.x === x && selected.y === y) selected = null

        board[y]![x] = board[y0]![x0]
        board[y0]![x0] = null
        kingVacated = { x: x0, y: y0 }
        kingOccupied = { x, y }
    }
    else if (possibleMoves.length) {
        const { x, y } = getRandomElement(possibleMoves)!

        board[y]![x] = board[y0]![x0]
        board[y0]![x0] = null
        kingVacated = { x: x0, y: y0 }
        kingOccupied = { x, y }
    }
}
