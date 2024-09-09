'use strict'

import { beginSavedState, createMenu, createStyles } from './rendering.js'

// Disable the context menu
document.addEventListener('contextmenu', event => {
    event.preventDefault()
})

createStyles()
createMenu()

beginSavedState()
