/** This file is part of natlib.
 * https://github.com/mvasilkov/natlib
 * @license MIT | Copyright (c) 2022, 2023, 2024 Mark Vasilkov
 */
'use strict';

/** Canvas handle class */
class CanvasHandle {
  constructor(canvas, width, height, supersampling = 2, ini) {
    canvas ??= document.createElement('canvas');
    this.canvas = canvas;
    this.con = canvas.getContext('2d');
    this.height = height;
    this.width = width;
    canvas.height = supersampling * height;
    canvas.width = supersampling * width;
    this.con.scale(supersampling, supersampling);
    ini?.(this.con, width, height);
  }
}
