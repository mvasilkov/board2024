'use strict'

import type { Body } from '../../node_modules/natlib/verlet/Body'
import type { Constraint } from '../../node_modules/natlib/verlet/Constraint'

import type { Particle } from './Particle'

export class ParticleScene {
    readonly vertices: Particle[]
    readonly constraints: Constraint[]
    readonly bodies: Body[]

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
}
