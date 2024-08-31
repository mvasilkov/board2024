'use strict';
// This file is adapted from natlib's Verlet integration code.
// See https://github.com/mvasilkov/natlib/tree/master/typescript/verlet
// for a fully-featured version.
import { Vec2 } from '../../node_modules/natlib/Vec2.js';
import { lerp } from '../../node_modules/natlib/interpolation.js';
export class Particle {
    body;
    position;
    oldPosition;
    interpolated;
    radius;
    gravity;
    viscosity;
    constructor(body, x, y, radius, gravity, viscosity) {
        this.body = body;
        this.position = new Vec2(x, y);
        this.oldPosition = new Vec2(x, y);
        this.interpolated = new Vec2(x, y);
        this.radius = radius;
        this.gravity = gravity;
        this.viscosity = viscosity;
        body.vertices.push(this);
        body.positions.push(this.position);
        body.scene.vertices.push(this);
    }
    /** Verlet integration */
    integrate() {
        const pos = this.position;
        const old = this.oldPosition;
        const x = pos.x;
        const y = pos.y;
        pos.x += (x - old.x) * this.viscosity;
        pos.y += (y - old.y) * this.viscosity;
        old.set(x, y);
        // Scene bounds
        const { height, width } = this.body.scene;
        if (pos.y < this.radius)
            pos.y = this.radius;
        else if (pos.y > height - this.radius) {
            pos.y = height - this.radius;
        }
        if (pos.x < this.radius)
            pos.x = this.radius;
        else if (pos.x > width - this.radius) {
            pos.x = width - this.radius;
        }
    }
    /** Interpolate the vertex position. */
    interpolate(t) {
        this.interpolated.set(lerp(this.oldPosition.x, this.position.x, t), lerp(this.oldPosition.y, this.position.y, t));
    }
}
