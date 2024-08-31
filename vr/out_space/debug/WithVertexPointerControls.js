'use strict';
import { register0 } from '../../node_modules/natlib/Vec2.js';
/** Enable scene's vertices to be controlled by the pointer. */
export const WithVertexPointerControls = (Parent, pointer, r, stiffness = 1) => {
    return class PointerScene extends Parent {
        controlledVertex;
        /** Update the scene. */
        update() {
            // Set the controlled vertex.
            if (pointer.held) {
                if (!this.controlledVertex) {
                    this.vertices.some(v => v.position.distanceSquared(pointer) < (v.radius + r) ** 2 &&
                        (this.controlledVertex = v));
                }
            }
            else {
                this.controlledVertex = null;
            }
            super.update();
            // Set the controlled vertex position.
            this.controlledVertex?.position.add(register0.setSubtract(pointer, this.controlledVertex.position).scale(stiffness));
        }
    };
};
