// Alec Rizzo
// HW 1 Bestagon
// Did not setup bounds but everything else is in working order I believe.
// Also I left funny speed slider from one of the github examples I was
// messing around with.

"use strict";

let canvas;
let gl;

let colors = [];
let vertices = [];

var speed = 100;
var direction = true;
var theta = 0.0;
var scale = 1.0;
var thetaLoc;
var scaleLoc;
var increment = 0.1;

var moveX = 0;
var moveXLoc;
var moveY = 0;
var moveYLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    vertices = [
      vec2(0.00, 0.00),
      vec2(0.50, 0.87),
      vec2(1.00, 0.00),
      vec2(0.50, -0.87),
      vec2(-0.50, -0.87),
      vec2(-1.00, 0.00),
      vec2(-0.50, 0.87),
      vec2(0.50, 0.87)
    ]

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0, 0, 0, 1.0 );

    //  Load shaders and initialize attribute buffers
    let program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    let bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    let vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");
    scaleLoc = gl.getUniformLocation(program, "scale");
    moveXLoc = gl.getUniformLocation(program, "moveX");
    moveYLoc = gl.getUniformLocation(program, "moveY");

    document.getElementById("slider").onchange = function(event) {
        speed = 100 - event.target.value;
    };

    // left in this example for funny speed adjustments
    /*window.onkeydown = function( event ) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case '1':
            direction = !direction;
            break;

          case '2':
            speed /= 2.0;
            break;

          case '3':
            speed *= 2.0;
            break;
        }
    };*/

    render();
};

/// use of onkeypress instead of onkeydown will avoid some case issues.
window.onkeypress = function( event ) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case 'a': //if Direction is false, the direction can be changed
            if (direction == false){ direction = !direction; }
            break;

          case 'd': //if Direction is true, the direction can be changed
            if (direction == true){ direction = !direction; }
            break;

          case 's':
           // vertices /= 1.1;
            if(scale >= 0.11)
            {
              scale -= .1;
            }

            break;

          case 'w':
           if(scale < 1)
           {
            scale += .1;
           }
            break;
        }
};

window.onkeydown = function( event ) {
    switch( event.keyCode ) {
      case 38:  // Up Arrow
        moveY += 0.1;
        break;

      case 40:  // Down Arrow
        moveY -= 0.1;
        break;

      case 37:  // Left Arrow
        moveX -= 0.1;
        break;

      case 39:  // Right Arrow
        moveX += 0.1
        break;
    }
};


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += (direction ? .1 : -.1);
    gl.uniform1f( thetaLoc, theta );

    gl.uniform1f(scaleLoc, scale);
    gl.uniform1f(moveXLoc, moveX);
    gl.uniform1f(moveYLoc, moveY);

    gl.drawArrays( gl.TRIANGLE_FAN, 0, vertices.length );

    setTimeout(
        function () {requestAnimFrame( render );}, speed
    );

}
