'use strict'

import { ShortBool } from '../node_modules/natlib/prelude.js'

import { board, spawn } from './definitions.js'
import { renderBoard } from './rendering.js'
// import { renderBoard } from './debug.js'
import { createStyles } from './rendering.js'

createStyles()

// King
board[3][0] = -1

spawn()
spawn()

renderBoard(ShortBool.TRUE)
