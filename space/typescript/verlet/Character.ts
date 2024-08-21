'use strict'

import { Particle } from './Particle.js'
import { ParticleBody } from './ParticleBody.js'
import type { ParticleScene } from './ParticleScene'

export class Character extends ParticleBody {
    constructor(scene: ParticleScene, x0: number, y0: number, bodyLength: number) {
        super(scene)

        new Particle(this, x0, y0, 20, 1, 0.8)

        let p: Particle
        let y = y0 + 20

        for (let n = bodyLength; --n;) {
            p = new Particle(this, x0, y += 20, 20, 1, 0.8)
            y += 20
        }
    }
}
