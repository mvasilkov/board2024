'use strict'

import { Mulberry32 } from '../../node_modules/natlib/prng/Mulberry32.js'
import { randomUint32LessThan } from '../../node_modules/natlib/prng/prng.js'

import { Settings, con, scene } from '../prelude.js'
import { ParticleBody } from '../verlet/ParticleBody.js'
import { Piece, PieceColor, pieceColors } from '../verlet/Piece.js'

export const createParticles = () => {
    const prng = new Mulberry32(999)
    const body = new ParticleBody(scene)

    for (let n = 0; n < 999; ++n) {
        const color = randomUint32LessThan(prng, PieceColor.gray + 1)
        const x = randomUint32LessThan(prng, Settings.screenWidth)
        const y = randomUint32LessThan(prng, Settings.screenHeight)

        new Piece(color, body, x, y, 11)
    }
}

export const paintParticles = () => {
    // con.beginPath()

    scene.vertices.forEach(v => {
        con.beginPath()

        con.moveTo(v.interpolated.x + v.radius, v.interpolated.y)
        con.arc(v.interpolated.x, v.interpolated.y, v.radius, 0, 2 * Math.PI)

        con.fillStyle = pieceColors[(<Piece>v).color]!
        con.fill()
    })

    // con.lineWidth = 2
    // con.strokeStyle = '#fff'
    // con.stroke()
}
