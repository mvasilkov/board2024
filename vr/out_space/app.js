'use strict';
import { startMainloop } from '../node_modules/natlib/scheduling/mainloop.js';
import { createParticles, paintParticles } from './debug/debug.js';
import { con, scene } from './prelude.js';
const update = () => {
    scene.update();
};
const render = (t) => {
    con.fillStyle = "#000" /* Palette.space */;
    con.fillRect(0, 0, 960 /* Settings.screenWidth */, 540 /* Settings.screenHeight */);
    scene.vertices.forEach(v => v.interpolate(t));
    paintParticles();
};
createParticles();
startMainloop(update, render);
