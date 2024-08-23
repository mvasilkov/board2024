'use strict'

import { Palette } from '../prelude.js'
import { Particle } from './Particle.js'
import { ParticleBody } from './ParticleBody.js'
import type { ParticleScene } from './ParticleScene'

export const enum PieceColor {
    orange,
    green,
    blue,
    gray,
}

export const pieceColors = [
    Palette.orangeHighlight,
    Palette.greenHighlight,
    Palette.blueHighlight,
    Palette.grayHighlight,
]

export class Piece extends Particle {
    readonly color: PieceColor

    constructor(color: PieceColor, body: Collection, x: number, y: number, radius: number) {
        super(body, x, y, radius, 1, 1)

        this.color = color

        body.coloredPieces[color].push(this)
    }
}

export class Collection extends ParticleBody {
    readonly coloredPieces: Record<PieceColor, Piece[]>

    constructor(scene: ParticleScene) {
        super(scene)

        this.coloredPieces = {
            [PieceColor.orange]: [],
            [PieceColor.green]: [],
            [PieceColor.blue]: [],
            [PieceColor.gray]: [],
        }
    }
}
