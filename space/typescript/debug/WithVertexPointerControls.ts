'use strict'

// This file is adapted from natlib's Verlet integration code.
// See https://github.com/mvasilkov/natlib/tree/master/typescript/verlet
// for a fully-featured version.

import type { Pointer } from '../../node_modules/natlib/controls/Pointer'
import { register0 } from '../../node_modules/natlib/Vec2.js'

import type { Particle } from '../verlet/Particle'
import type { ParticleScene } from '../verlet/ParticleScene'

type MetaScene = new (...a: any) => ParticleScene

/** Enable scene's vertices to be controlled by the pointer. */
export const WithVertexPointerControls = <T extends MetaScene>(Parent: T, pointer: Pointer, r: number, stiffness = 1) => {
    return class PointerScene extends Parent {
        controlledVertex?: Particle | null

        /** Update the scene. */
        override update() {
            // Set the controlled vertex.
            if (pointer.held) {
                if (!this.controlledVertex) {
                    this.vertices.some(v => v.position.distanceSquared(pointer) < (v.radius + r) ** 2 &&
                        (this.controlledVertex = v))
                }
            }
            else {
                this.controlledVertex = null
            }

            super.update()

            // Set the controlled vertex position.
            this.controlledVertex?.position.add(
                register0.setSubtract(pointer, this.controlledVertex.position).scale(stiffness))
        }
    }
}
