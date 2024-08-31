'use strict';
import { CanvasHandle } from '../node_modules/natlib/canvas/CanvasHandle.js';
import { Pointer } from '../node_modules/natlib/controls/Pointer.js';
import { WithVertexPointerControls } from './debug/WithVertexPointerControls.js';
import { ParticleScene } from './verlet/ParticleScene.js';
// Output
export const canvas = new CanvasHandle(document.querySelector('canvas'), 960 /* Settings.screenWidth */, 540 /* Settings.screenHeight */);
export const con = canvas.con;
// Input
export const pointer = new Pointer(canvas.canvas);
pointer.addEventListeners(document);
// Physics
const PScene = WithVertexPointerControls(ParticleScene, pointer, 2, 0.5);
export const scene = new PScene(960 /* Settings.screenWidth */, 540 /* Settings.screenHeight */, 4 /* Settings.iterationCount */);
