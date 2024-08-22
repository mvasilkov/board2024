'use strict'

import { Vec2 } from '../../node_modules/natlib/Vec2.js'

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
