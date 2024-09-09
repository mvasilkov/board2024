/** This file is part of King Thirteen.
 * https://github.com/mvasilkov/board2024
 * @license Proprietary | Copyright (c) 2024 Mark Vasilkov
 */
'use strict'

import { audioHandle, initializeAudio } from './audio/audio.js'
import { beginSavedState, createMenu, createStyles } from './rendering.js'

// Disable the context menu
document.addEventListener('contextmenu', event => {
    event.preventDefault()
})

// https://html.spec.whatwg.org/multipage/interaction.html#activation-triggering-input-event

document.addEventListener('mousedown', () => {
    if (audioHandle.initialized) return
    audioHandle.initialize(initializeAudio)
}, { once: true })

document.addEventListener('touchend', () => {
    if (audioHandle.initialized) return
    audioHandle.initialize(initializeAudio)
}, { once: true })

createStyles()
createMenu()

beginSavedState()
