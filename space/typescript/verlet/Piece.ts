'use strict'

import { Palette } from '../prelude.js'
import { Particle } from './Particle.js'

import type { ParticleBody } from './ParticleBody'

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

    constructor(color: PieceColor, body: ParticleBody, x: number, y: number, radius: number) {
        super(body, x, y, radius, 1, 1)

        this.color = color
    }
}
