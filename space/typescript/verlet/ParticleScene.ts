'use strict'

import { register0, register1 } from '../../node_modules/natlib/Vec2.js'

import type { Particle } from './Particle'
import type { ParticleBody } from './ParticleBody'
import type { ParticleConstraint } from './ParticleConstraint'

export class ParticleScene {
    readonly vertices: Particle[]
    readonly constraints: ParticleConstraint[]
    readonly bodies: ParticleBody[]

    height: number
    width: number
    iterationCount: number

    constructor(width: number, height: number, iterationCount: number) {
        this.vertices = []
        this.constraints = []
        this.bodies = []

        this.height = height
        this.width = width
        this.iterationCount = iterationCount
    }

    /** Update the scene. */
    update() {
        // Verlet integration
        this.vertices.forEach(v => v.integrate())

        // Solve constraints and collisions
        for (let n = 0; n < this.iterationCount; ++n) {
            this.constraints.forEach(c => c.solve())

            for (let i = this.vertices.length; --i > 0;) {
                const v0 = this.vertices[i]!

                for (let j = i; --j >= 0;) {
                    const v1 = this.vertices[j]!

                    if (findCollision(v0, v1)) {
                        resolveCollision(v0, v1)
                    }
                }
            }
        }
    }
}

const findCollision = (v0: Particle, v1: Particle) =>
    v0.position.distanceSquared(v1.position) < (v0.radius + v1.radius) ** 2

const resolveCollision = (v0: Particle, v1: Particle) => {
    const pos0 = v0.position
    const pos1 = v1.position

    const contactLine = register0 // .Alias
    const contactDistance = contactLine.copy(pos1).subtract(pos0).length() - v0.radius - v1.radius

    // Mass fractions
    const totalMass = v0.gravity + v1.gravity
    const w0 = v0.gravity / totalMass
    const w1 = v1.gravity / totalMass

    // Contact line points from v0 to v1
    pos0.add(register1.setMultiplyScalar(contactLine.normalize(), w1 * contactDistance))
    pos1.subtract(register1.setMultiplyScalar(contactLine, w0 * contactDistance))
}
