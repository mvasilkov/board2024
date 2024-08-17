'use strict'

import { CanvasHandle } from '../node_modules/natlib/canvas/CanvasHandle.js'

export const enum Settings {
    // Screen size
    screenWidth = 960,
    screenHeight = 540, // 16:9
}

// Output

export const canvas = new CanvasHandle(document.querySelector('canvas')!,
    Settings.screenWidth, Settings.screenHeight)

export const con = canvas.con
