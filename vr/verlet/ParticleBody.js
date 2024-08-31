'use strict';
export class ParticleBody {
    scene;
    vertices;
    constraints;
    /** Positions of vertices */
    positions;
    constructor(scene) {
        this.scene = scene;
        this.vertices = [];
        this.constraints = [];
        this.positions = [];
        scene.bodies.push(this);
    }
}
