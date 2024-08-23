'use strict'

import { CanvasHandle } from '../node_modules/natlib/canvas/CanvasHandle.js'
import { Pointer } from '../node_modules/natlib/controls/Pointer.js'

import { WithVertexPointerControls } from './debug/WithVertexPointerControls.js'
import { ParticleScene } from './verlet/ParticleScene.js'

export const enum Settings {
    // Screen size
    screenWidth = 960,
    screenHeight = 540, // 16:9
    // Physics
    iterationCount = 4,
}

export const enum Palette {
    space = '#000',
}

// Output

export const canvas = new CanvasHandle(document.querySelector('canvas')!,
    Settings.screenWidth, Settings.screenHeight)

export const con = canvas.con

// Input

export const pointer = new Pointer(canvas.canvas)
pointer.addEventListeners(document)

// Physics

const PScene = WithVertexPointerControls(ParticleScene, pointer, 2, 0.5)

export const scene = new PScene(Settings.screenWidth, Settings.screenHeight,
    Settings.iterationCount)
