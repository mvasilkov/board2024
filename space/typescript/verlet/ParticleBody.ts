'use strict'

// This file is adapted from natlib's Verlet integration code.
// See https://github.com/mvasilkov/natlib/tree/master/typescript/verlet
// for a fully-featured version.

import type { Vec2 } from '../../node_modules/natlib/Vec2'

import type { Particle } from './Particle'
import type { ParticleConstraint } from './ParticleConstraint'
import type { ParticleScene } from './ParticleScene'

export class ParticleBody {
    readonly scene: ParticleScene
    readonly vertices: Particle[]
    readonly constraints: ParticleConstraint[]
    /** Positions of vertices */
    readonly positions: Vec2[]

    constructor(scene: ParticleScene) {
        this.scene = scene
        this.vertices = []
        this.constraints = []
        this.positions = []

        scene.bodies.push(this)
    }
}
