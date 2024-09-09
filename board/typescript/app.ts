/** This file is part of King Thirteen.
 * https://github.com/mvasilkov/board2024
 * @license Proprietary | Copyright (c) 2024 Mark Vasilkov
 */
'use strict'

import { beginSavedState, createMenu, createStyles } from './rendering.js'

// Disable the context menu
document.addEventListener('contextmenu', event => {
    event.preventDefault()
})

createStyles()
createMenu()

beginSavedState()
