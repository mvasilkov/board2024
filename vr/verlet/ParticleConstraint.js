'use strict';
// This file is adapted from natlib's Verlet integration code.
// See https://github.com/mvasilkov/natlib/tree/master/typescript/verlet
// for a fully-featured version.
import { register0 } from '../../node_modules/natlib/Vec2.js';
export class ParticleConstraint {
    body;
    v0;
    v1;
    /** Position of v0 */
    p0;
    /** Position of v1 */
    p1;
    lengthSquared;
    stiffness;
    constructor(body, v0, v1, stiffness) {
        this.body = body;
        this.v0 = v0;
        this.v1 = v1;
        this.p0 = v0.position; // .InlineExp
        this.p1 = v1.position; // .InlineExp
        this.lengthSquared = this.p0.distanceSquared(this.p1);
        this.stiffness = stiffness;
        if (!this.lengthSquared)
            throw Error('Overlapping vertices');
        body.constraints.push(this);
        body.scene.constraints.push(this);
    }
    /** Solve the constraint. */
    solve() {
        // Algorithm by Thomas Jakobsen (2001)
        register0.setSubtract(this.p0, this.p1).scale(
        // Approximate the square root function.
        (this.lengthSquared / (register0.dot(register0) + this.lengthSquared) - 0.5) * this.stiffness);
        this.p0.add(register0);
        this.p1.subtract(register0);
    }
}
