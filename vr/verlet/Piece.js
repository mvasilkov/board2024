'use strict';
import { Particle } from './Particle.js';
import { ParticleBody } from './ParticleBody.js';
export const pieceColors = [
    "#ffcd75" /* Palette.orangeHighlight */,
    "#a7f070" /* Palette.greenHighlight */,
    "#73eff7" /* Palette.blueHighlight */,
    "#94b0c2" /* Palette.grayHighlight */,
];
export class Piece extends Particle {
    color;
    constructor(color, body, x, y, radius) {
        super(body, x, y, radius, 1, 1);
        this.color = color;
        body.coloredPieces[color].push(this);
    }
}
export class Collection extends ParticleBody {
    coloredPieces;
    constructor(scene) {
        super(scene);
        this.coloredPieces = {
            [0 /* PieceColor.orange */]: [],
            [1 /* PieceColor.green */]: [],
            [2 /* PieceColor.blue */]: [],
            [3 /* PieceColor.gray */]: [],
        };
    }
}
