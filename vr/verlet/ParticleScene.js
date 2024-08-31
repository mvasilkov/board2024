'use strict';
// This file is adapted from natlib's Verlet integration code.
// See https://github.com/mvasilkov/natlib/tree/master/typescript/verlet
// for a fully-featured version.
import { register0, register1 } from '../../node_modules/natlib/Vec2.js';
export class ParticleScene {
    vertices;
    constraints;
    bodies;
    height;
    width;
    iterationCount;
    constructor(width, height, iterationCount) {
        this.vertices = [];
        this.constraints = [];
        this.bodies = [];
        this.height = height;
        this.width = width;
        this.iterationCount = iterationCount;
    }
    /** Update the scene. */
    update() {
        // Verlet integration
        this.vertices.forEach(v => v.integrate());
        // Solve constraints and collisions
        for (let n = 0; n < this.iterationCount; ++n) {
            this.constraints.forEach(c => c.solve());
            for (let i = this.vertices.length; --i > 0;) {
                const v0 = this.vertices[i];
                for (let j = i; --j >= 0;) {
                    const v1 = this.vertices[j];
                    if (findCollision(v0, v1)) {
                        resolveCollision(v0, v1);
                    }
                }
            }
        }
    }
}
const findCollision = (v0, v1) => v0.position.distanceSquared(v1.position) < (v0.radius + v1.radius) ** 2;
const resolveCollision = (v0, v1) => {
    const pos0 = v0.position;
    const pos1 = v1.position;
    const contactLine = register0; // .Alias
    const contactDistance = contactLine.copy(pos1).subtract(pos0).length() - v0.radius - v1.radius;
    // Mass fractions
    const totalMass = v0.gravity + v1.gravity;
    const w0 = v0.gravity / totalMass;
    const w1 = v1.gravity / totalMass;
    // Contact line points from v0 to v1
    pos0.add(register1.setMultiplyScalar(contactLine.normalize(), w1 * contactDistance));
    pos1.subtract(register1.setMultiplyScalar(contactLine, w0 * contactDistance));
};
