<p align="center">
  <img alt="Dynamic_Vertex_Renderer" src="https://github.com/SgtR0ck/Dynamic-Vertex-Renderer/assets/8111664/22e0dd29-d036-4224-b04a-b039dd4a8e36"
</p>
<h1 align="center"> 
  Dynamic Vertex Renderer
</h1>

<p align="center">
  <a href="https://github.com/SgtR0ck/City_Simulator">
    <img src="https://img.shields.io/badge/version-1.0.0-green.svg?style=plastic">
  </a>
  <img src="https://img.shields.io/badge/language-JavaScript-323330.svg?style=plastic&logo=JavaScript">
  <img src="https://img.shields.io/badge/language-OpenGL ES Shading Language-323330.svg?style=plastic">
  <img src="https://img.shields.io/badge/API-WebGL-orange.svg?style=plastic">
  <a href="https://github.com/SgtR0ck/City_Simulator/blob/main/LICENSE.md">
    <img src="https://img.shields.io/badge/license-MIT-green.svg?style=plastic">
  </a>
</p>

## Table of Contents
  - [Introduction](#introduction)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Running](#running)
  - [Authors](#authors)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)


## Introduction

This is a JavaScript based program, a WebGL renderer that dynamically creates a triangle mesh from a coded constant 'k' (face count), then calculates the z height for every vertex using an x/y bivariate function.

## Getting Started

### Prerequisites

Be sure to have web browser that supports WebGL ([Google Chrome](https://www.google.com/chrome/dr/download/?brand=WDIF&geo=US&gclid=CjwKCAjww7KmBhAyEiwA5-PUSk5IaWLaU5hqvwYj5HBtElwc0bECwi_kyaY1m_xxEj4aGptzp7s2PBoCxd8QAvD_BwE&gclsrc=aw.ds), [Firefox](https://www.mozilla.org/en-US/firefox/new/), [Opera](https://www.opera.com/?utm_campaign=%2302%20-%20UK%20-%20Search%20-%20EN%20-%20Branded&utm_content=153219686314&gclid=CjwKCAjww7KmBhAyEiwA5-PUSk-mtBSzj5EAgUMz4M2XTfL_dW7admPKRoS73h6eLxuQvboyC6RI9xoCPEAQAvD_BwE), [Microsoft Edge](https://www.microsoft.com/en-us/edge?exp=e544&form=MM146H&ef_id=_k_CjwKCAjww7KmBhAyEiwA5-PUSkjeZMHAyIrRSJDnaL5IcMU_hbHMwoc_UGATuR1vhOdh9UlQsFf5kBoCXVwQAvD_BwE_k_&OCID=AIDcmmm6jz4jsn_SEM__k_CjwKCAjww7KmBhAyEiwA5-PUSkjeZMHAyIrRSJDnaL5IcMU_hbHMwoc_UGATuR1vhOdh9UlQsFf5kBoCXVwQAvD_BwE_k_&gad=1&gclid=CjwKCAjww7KmBhAyEiwA5-PUSkjeZMHAyIrRSJDnaL5IcMU_hbHMwoc_UGATuR1vhOdh9UlQsFf5kBoCXVwQAvD_BwE), [etc.](https://en.wikipedia.org/wiki/WebGL))
. If you wish to edit the 'K' constant, any text editor would work, however it is still recommended to utilize something like Visual Studio Code. Try following this guide for [Visual Studio Code](https://code.visualstudio.com/docs/languages/javascript)

![image](https://github.com/SgtR0ck/Dynamic-Vertex-Renderer/assets/8111664/cb7142c7-fbbd-4306-a77d-8f1655eff465)

Additionally, make sure to have the "lib" folder and included files local to the .js and .html file.

### Running

In order to run this program, just double click on the html file to open in your supported web browser of choice. The program should run on its own and you should be presented with a rotating image of the triangle mesh (final shape is variable based on the 'k' factor)

![image](https://github.com/SgtR0ck/Dynamic-Vertex-Renderer/assets/8111664/22b2af61-b59f-4e27-9a2c-d0d7049fbf6d)

'k' factor of 64


## Authors

* **Chet Lockwood** - [Atoms-x](https://github.com/Atoms-x)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/SgtR0ck/Dynamic-Vertex-Renderer/blob/main/LICENSE.md) file for details

## Acknowledgments

* Thank you to the book "WebGL Programming Guide" authored by Matsuda and Lea
