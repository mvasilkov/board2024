'use strict';
import { CanvasHandle } from '../node_modules/natlib/canvas/CanvasHandle.js';
import { ParticleScene } from './verlet/ParticleScene.js';
// Output
export const canvas = new CanvasHandle(document.querySelector('canvas'), 960 /* Settings.screenWidth */, 540 /* Settings.screenHeight */);
export const con = canvas.con;
// Physics
export const scene = new ParticleScene(960 /* Settings.screenWidth */, 540 /* Settings.screenHeight */, 4 /* Settings.iterationCount */);
