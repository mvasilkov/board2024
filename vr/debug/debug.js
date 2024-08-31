'use strict';
import { Mulberry32 } from '../node_modules/natlib/prng/Mulberry32.js';
import { randomUint32LessThan } from '../node_modules/natlib/prng/prng.js';
import { Particle } from '../verlet/Particle.js';
import { ParticleBody } from '../verlet/ParticleBody.js';
import { scene } from '../prelude.js';
export let collection;
export const createParticles = () => {
    const prng = new Mulberry32(999);
    collection = new ParticleBody(scene);
    for (let n = 0; n < 13; ++n) {
        const x = randomUint32LessThan(prng, 960 /* Settings.screenWidth */);
        const y = randomUint32LessThan(prng, 540 /* Settings.screenHeight */);
        new Particle(collection, x, y, 22, 1, 1);
    }
};
