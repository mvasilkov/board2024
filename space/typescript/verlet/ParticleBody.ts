'use strict'

import { Vec2 } from '../../node_modules/natlib/Vec2.js'
import type { Constraint } from '../../node_modules/natlib/verlet/Constraint'
import type { Vertex } from '../../node_modules/natlib/verlet/Vertex'

import type { ParticleScene } from './ParticleScene'

export class ParticleBody {
    readonly scene: ParticleScene
    readonly vertices: Vertex[]
    readonly constraints: Constraint[]
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
