vector-sketch
=============

A simple HTML5 app to transform images into svg and gcode for an etch-a-sketch bot

Instructions:
Download and run from a local server.

If you have python installed just enter on command line:
python -m simpleHTTPServer:8080

Then open a browser to localhost:8080 and load an image.

Copy the resulting gcode into a file, and then feed it to your etch-a-sketch bot.

NOTES: 

- Gcode currently rendering backwards and upside down. Probably because gcode origin Y axis is reverse that of canvas.

- FarsideOffset is calculating wrong, should not be using modulus.



