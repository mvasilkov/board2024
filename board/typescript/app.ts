'use strict'

import { spawn } from './definitions.js'
// import { renderBoard } from './rendering.js'
import { renderBoard } from './debug.js'
import { createStyles } from './rendering.js'

createStyles()

spawn()
spawn()

renderBoard()
