'use strict'

import { startMainloop } from '../node_modules/natlib/scheduling/mainloop.js'

import { createParticles, paintParticles } from './debug/debug.js'
import { Settings, con, scene } from './prelude.js'
import { Character } from './verlet/Character.js'

const update = () => {
    scene.update()
}

const render = (t: number) => {
    con.fillStyle = '#000'
    con.fillRect(0, 0, Settings.screenWidth, Settings.screenHeight)

    scene.vertices.forEach(v => v.interpolate(t))

    paintParticles()
}

createParticles()

new Character(scene, 0.5 * Settings.screenWidth, 0.5 * Settings.screenHeight, 3)

startMainloop(update, render)
