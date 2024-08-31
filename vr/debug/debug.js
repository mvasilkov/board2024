'use strict';
import { Mulberry32 } from '../../node_modules/natlib/prng/Mulberry32.js';
import { randomUint32LessThan } from '../../node_modules/natlib/prng/prng.js';
import { con, scene } from '../prelude.js';
import { Collection, Piece, pieceColors } from '../verlet/Piece.js';
let collection;
export const createParticles = () => {
    const prng = new Mulberry32(999);
    collection = new Collection(scene);
    for (let n = 0; n < 13; ++n) {
        const color = randomUint32LessThan(prng, pieceColors.length);
        const x = randomUint32LessThan(prng, 960 /* Settings.screenWidth */);
        const y = randomUint32LessThan(prng, 540 /* Settings.screenHeight */);
        new Piece(color, collection, x, y, 22);
    }
};
export const paintParticles = () => {
    for (let color = 0; color < pieceColors.length; ++color) {
        con.beginPath();
        collection.coloredPieces[color].forEach(p => {
            con.moveTo(p.interpolated.x + p.radius, p.interpolated.y);
            con.arc(p.interpolated.x, p.interpolated.y, p.radius, 0, 2 * Math.PI);
        });
        con.fillStyle = pieceColors[color];
        con.fill();
    }
};
