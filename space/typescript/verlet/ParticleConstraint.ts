'use strict'

// This file is adapted from natlib's Verlet integration code.
// See https://github.com/mvasilkov/natlib/tree/master/typescript/verlet
// for a fully-featured version.

import { register0, type Vec2 } from '../../node_modules/natlib/Vec2.js'

import type { Particle } from './Particle'
import type { ParticleBody } from './ParticleBody'

export class ParticleConstraint {
    readonly body: ParticleBody
    readonly v0: Particle
    readonly v1: Particle
    /** Position of v0 */
    readonly p0: Vec2
    /** Position of v1 */
    readonly p1: Vec2

    lengthSquared: number
    stiffness: number

    constructor(body: ParticleBody, v0: Particle, v1: Particle, stiffness: number) {
        this.body = body
        this.v0 = v0
        this.v1 = v1
        this.p0 = v0.position // .InlineExp
        this.p1 = v1.position // .InlineExp

        this.lengthSquared = this.p0.distanceSquared(this.p1)
        this.stiffness = stiffness

        if (!this.lengthSquared) throw Error('Overlapping vertices')

        body.constraints.push(this)
        body.scene.constraints.push(this)
    }

    /** Solve the constraint. */
    solve() {
        // Algorithm by Thomas Jakobsen (2001)
        register0.setSubtract(this.p0, this.p1).scale(
            // Approximate the square root function.
            (this.lengthSquared / (register0.dot(register0) + this.lengthSquared) - 0.5) * this.stiffness)

        this.p0.add(register0)
        this.p1.subtract(register0)
    }
}
