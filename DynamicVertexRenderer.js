"use strict";
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Chet Lockwood
// 21 Jul 2021
// Description - A program that renders a bivariate function across a triangle mesh based on a constant K
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// MultiAttributeSize.js
// Vertex shader program
var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +                                   // Surface Base Color
    'attribute vec4 a_Normal;\n' +                                  // Surface Orientation
    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_NormalMatrix;\n' +
    'uniform vec3 u_LightColor;\n' +                                // Light color
    'uniform vec3 u_LightDirection;\n' +                            // Light Direction (world coordinate, normalized)
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_Position = u_MvpMatrix * a_Position;\n' + 
    '   vec4 normal = u_NormalMatrix * a_Normal;\n' +               // Make the length of the normal 1.0
    '   float nDotL = max(dot(u_LightDirection, normalize(normal.xyz)), 0.0);\n' + // Dot product of light direction and orientation of a surface
    '   vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;\n' +   // Calculate the color due to diffuse refelction
    '   v_Color = vec4(diffuse, a_Color.a);\n' +               
    '}\n';

// Fragment shader program
var FSHADER_SOURCE = 
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_FragColor = v_Color;\n' + // Set the color
    '}\n';

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

var K = 50

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    /** @type {WebGLRenderingContext} */
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders');
        return; 
    }

    // Set the positions of vertices
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {
        console.log('Failed to get the storage location of u_MvpMatrix');
        return;
    }
     
    var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    if (!u_LightColor) {
        console.log('Failed to get the storage location of u_LightColor');
        return;
    }

    var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
    if (!u_LightDirection) {
        console.log('Failed to get the stroage location of u_LightDirection');
        return;
    }

    var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if (!u_NormalMatrix) {
        console.log('Failed to get the stroage location of u_NormalMatrix');
        return;
    }

    gl.enable(gl.DEPTH_TEST);

    // Set the light color (white)
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    // Set the light direction (in the world coordinate)
    var lightDirection = new Vector3([0.5, 3.0, 4.0]);
    lightDirection.normalize(); //Normalize
    gl.uniform3fv(u_LightDirection, lightDirection.elements);

    var mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(20, canvas.width/canvas.height, 1, 100);
    //mvpMatrix.lookAt(0, -5, 2, 0, 5, -2, 0, 1, 0);
    mvpMatrix.lookAt(-4.0, 3.2, 2.4, 5.0, -4.0, -3.0, 0, 0, 1);

    var currentAngle = 0.0;
    var modelMatrix = new Matrix4();
    var animMatrix = new Matrix4();
    var normalMatrix = new Matrix4();

    var tick = function() {
        currentAngle = animate(currentAngle);

        modelMatrix.setRotate(currentAngle, 0, 0, 1);
        modelMatrix.translate(-0.5, -0.5, 0, 1);
        animMatrix.set(mvpMatrix).multiply(modelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix, false, animMatrix.elements);

        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

        // Set the color for clearing <canvas>
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(tick, canvas);
    };
    tick();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

function initVertexBuffers(gl) {
    
    var verticesA = Create2DAarray(Math.pow(K+1, 2));
    var trianglesA = Create2DAarray(2*Math.pow((K),2));
    var normalsA = Create2DAarray(Math.pow(K+1, 2));
    
    fillArray(normalsA);
    vertexGenerator(verticesA);
    triangleGenerator(trianglesA);
    normalGenerator(normalsA, verticesA, trianglesA);

    var vertices = new Float32Array(3*Math.pow(K+1, 2));
    var colors = new Float32Array(3*Math.pow(K+1, 2));
    var normals = new Float32Array(3*Math.pow(K+1, 2))
    var indices = new Uint16Array(6*Math.pow((K),2))

    parseV(verticesA, vertices);
    parseN(normalsA, normals);
    parseI(trianglesA, indices);
    parseC(colors);

    
    // Create a buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.log('Failed to create the index object');
        return -1;
    }

    // Write the vertex coordinates and color to the buffer object
    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
        return -1;
    if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) {
        return -1;
    }
    if (!initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal')) {
        return -1;
    }

    // Write the indices to the buffer boject
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return false;
    }

    // Write data into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    // Assign the buffer object to the attribute variable
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }

    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object ot the attribute variable
    gl.enableVertexAttribArray(a_attribute);

    return true;
}

function f(x, y) {
    return (0.5 * Math.exp(-0.04 * Math.sqrt(Math.pow((80*x - 40), 2) + Math.pow((90*y - 45), 2))) * Math.cos(0.15 * Math.sqrt(Math.pow((80*x -40), 2) + Math.pow((90*y - 45), 2))));
}

// Rotation angle (degrees/second)
var ANGLE_STEP = 30.0;
// Last time that this function was called
var g_last = Date.now();
function animate(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}

function Create2DAarray(rows) {
    var arr = [];

    for (var i = 0; i < rows; i++){
        arr[i] = [];
    }

    return arr;
}

function fillArray(normalsA) {
    for(var j = 0; j < (Math.pow(K+1, 2)); j++){
        for(var i = 0; i < 3; i++){
            normalsA[j][i] = 0;
        }
    }
}

function vertexGenerator(verticesA) {
    var h = 1.0/K;
    var vertexNum = 0;
    for (let j = 0; j <= K; j++ ){
        var y = j*h;
        for (let i = 0; i <= K; i++){
            var x = i*h;
            verticesA[vertexNum][0] = x;
            verticesA[vertexNum][1] = y;
            verticesA[vertexNum][2] = f(x, y);
            vertexNum = vertexNum + 1;
        }
    }
}

function triangleGenerator(trianglesA) {
    var triangleNum = 0;
    for (let j = 0; j < K; j++ ){
        for (let i = 0; i < K; i++){
            var vertexNum = j*(K+1)+i;

            trianglesA[triangleNum][0] = vertexNum;
            trianglesA[triangleNum][1] = vertexNum+1;
            trianglesA[triangleNum][2] = vertexNum+K+2;

            trianglesA[triangleNum+1][0] = vertexNum;
            trianglesA[triangleNum+1][1] = vertexNum+K+2;
            trianglesA[triangleNum+1][2] = vertexNum+K+1;
            triangleNum = triangleNum + 2;
        }
    }
}

function normalGenerator(normalsA, verticesA, trianglesA) {
    for(var triangleNum = 0; triangleNum < (2*Math.pow(K, 2)); triangleNum++){
        var i1 = trianglesA[triangleNum][0];
        var i2 = trianglesA[triangleNum][1];
        var i3 = trianglesA[triangleNum][2];

        var tNorm = [[], [], []];
        var temp = 0.0;

        tNorm[1] = (verticesA[i2][1] - verticesA[i1][1]) * (verticesA[i3][2] - verticesA[i1][2]) - (verticesA[i2][2] - verticesA[i1][2]) * (verticesA[i3][1] - verticesA[i1][1]);
        tNorm[2] = (verticesA[i2][2] - verticesA[i1][2]) * (verticesA[i3][0] - verticesA[i1][0]) - (verticesA[i2][0] - verticesA[i1][0]) * (verticesA[i3][2] - verticesA[i1][2]);
        tNorm[3] = (verticesA[i2][0] - verticesA[i1][0]) * (verticesA[i3][1] - verticesA[i1][1]) - (verticesA[i2][1] - verticesA[i1][1]) * (verticesA[i3][0] - verticesA[i1][0]);

        normalize(tNorm);

        temp = parseFloat(normalsA[i1][0]) + tNorm[1];
        normalsA[i1][0] = temp;
        temp = parseFloat(normalsA[i2][0]) + tNorm[1];
        normalsA[i2][0] = temp;
        temp = parseFloat(normalsA[i3][0]) + tNorm[1];
        normalsA[i3][0] = temp;

        temp = parseFloat(normalsA[i1][1]) + tNorm[2];
        normalsA[i1][1] = temp;
        temp = parseFloat(normalsA[i2][1]) + tNorm[2];
        normalsA[i2][1] = temp;
        temp = parseFloat(normalsA[i3][1]) + tNorm[2];
        normalsA[i3][1] = temp;

        temp = parseFloat(normalsA[i1][2]) + tNorm[3];
        normalsA[i1][2] = temp;
        temp = parseFloat(normalsA[i2][2]) + tNorm[3];
        normalsA[i2][2] = temp;
        temp = parseFloat(normalsA[i3][2]) + tNorm[3];
        normalsA[i3][2] = temp;
    }
}

function parseN(array, floatArray) {
    var counter = 0;
    var n = 1;
    var m = 0;
    for (var j = 0; j < (Math.pow(K+1, 2)); j++){
        for(var i = 0; i < 3; i++){
            if (j == 0 ||  j == (Math.pow(K+1, 2)-1)) {
                floatArray[counter] = array[j][i];
                floatArray[counter] = floatArray[counter]/2;
                counter++; 
            } else if (j > 0 && j < K) {
                floatArray[counter] = array[j][i];
                floatArray[counter] = floatArray[counter]/3;
                counter++; 
            } else if (j == (Math.pow(K+1, 2))-K-1 || j == K) {
                floatArray[counter] = array[j][i];
                counter++;
            } else if (j >= (Math.pow(K+1, 2))-K-1 && j < (Math.pow(K+1, 2))-1) {
                floatArray[counter] = array[j][i];
                floatArray[counter] = floatArray[counter]/3;
                counter++;
            } else if (j % (m*(K+1)) == 0 || j % (n*(K+1)-1) == 0) {
                floatArray[counter] = array[j][i];
                floatArray[counter] = floatArray[counter]/3;
                counter++; 
            } else {
                floatArray[counter] = array[j][i];
                floatArray[counter] = floatArray[counter]/6;
                counter++;
            }
        }
        if (j == n*(K+1)-1) {
            n++;
            m++;
        }
    }
}

function parseV(array, floatArray) {
    var counter = 0;
    for (var j = 0; j < (Math.pow(K+1, 2)); j++){
        for(var i = 0; i < 3; i++){
            floatArray[counter] = array[j][i];
            counter++;
        }
    }
}

function parseI(array, intArray) {
    var counter = 0;
    for (var j = 0; j < (2*Math.pow((K),2)); j++){
        for(var i = 0; i < 3; i++){
            intArray[counter] = array[j][i];
            counter++;
        }
    }
}

function parseC(floatArray) {
    var counter = 0;
    for (var i = 0; i < (3*Math.pow(K+1, 2)); i++){
        if (i%3 == 0) {
            floatArray[counter] = 1;
            counter++; 
        } else if (i%3 == 1) {
            floatArray[counter] = 0;
            counter++;
        } else {
            floatArray[counter] = 0;
            counter++;
        }
    }
}

function normalize(tnorm) {
    var magnitude = Math.sqrt(Math.pow(tnorm[1], 2) + Math.pow(tnorm[2], 2) + Math.pow(tnorm[3], 2));
    tnorm[1] = tnorm[1]/magnitude;
    tnorm[2] = tnorm[2]/magnitude;
    tnorm[3] = tnorm[3]/magnitude;
}