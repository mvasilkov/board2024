'use strict'

import type { Vec2 } from '../../node_modules/natlib/Vec2'

import { con } from '../prelude.js'
import { Particle } from './Particle.js'
import { ParticleBody } from './ParticleBody.js'
import { ParticleConstraint } from './ParticleConstraint.js'
import type { ParticleScene } from './ParticleScene'

export class Character extends ParticleBody {
    bodyLength: number

    constructor(scene: ParticleScene, x0: number, y0: number, bodyLength: number) {
        super(scene)

        this.bodyLength = bodyLength

        new Particle(this, x0, y0, 20, 1, 0.8)

        let p: Particle
        let y = y0 + 20

        for (let n = bodyLength; --n;) {
            p = new Particle(this, x0, y += 20, 20, 1, 0.8)
            y += 20

            new ParticleConstraint(this, this.vertices.at(-2)!, p, 0.9)
        }
    }

    paint() {
        con.beginPath()

        wavyLine(this, 0, this.bodyLength)

        con.lineWidth = 2
        con.strokeStyle = '#fff'
        con.stroke()
    }
}

const wavyLine = ({ positions }: { positions: Vec2[] }, start: number, end: number) => {
    const points = positions.slice(start, end)

    let p0 = points[0]!
    let p1 = points[1]!

    con.moveTo(p0.x, p0.y)

    for (let n = 1; n < points.length - 2; ++n) {
        p0 = p1
        p1 = points[n + 1]!

        con.quadraticCurveTo(p0.x, p0.y, 0.5 * (p0.x + p1.x), 0.5 * (p0.y + p1.y))
    }

    p0 = p1
    p1 = points.at(-1)!

    con.quadraticCurveTo(p0.x, p0.y, p1.x, p1.y)
}
