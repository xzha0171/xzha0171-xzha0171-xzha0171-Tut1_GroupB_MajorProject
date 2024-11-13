
let sky, sea, reflection, main;
let size = 10; // Size of rectangle (You can change rectangle's size here)
let skyRects = []; // Store rectangles for the sky part
let seaRects = []; // Store rectangles for the sea part
let mainRects = []; // Store rectangles for the main part
let reflectionRects = []; // Store rectangles for the reflection part
let camZ=0
let camSpd=0

function preload() {
   // Preload image assets for different parts of the scene
    sky = loadImage('assets/sky.png');
    sea = loadImage('assets/sea.png');
    reflection = loadImage('assets/reflection.png');
    main = loadImage('assets/main.png');
}

function setup() {
    // Set up canvas size and basic drawing parameters
    createCanvas(600, 500, WEBGL); // Set canvas size and enable 3D rendering
    noFill(); // Disable fill for shapes by default
    textAlign(CENTER, CENTER);  // Center text alignment
    angleMode(DEGREES); // Set angle mode to degrees
    rectMode(CENTER); // Draw rectangles from their center point
    noStroke(); // Disable outline for shapes
    rectInit(); // Initialize rectangles based on image data
}

function rectInit() {
    // Initialize rectangles and extract data from images
    sky.resize(width, height);
    sea.resize(width, height);
    reflection.resize(width, height);
    main.resize(width, height);
    
    // Load pixel data for each image
    sky.loadPixels();
    sea.loadPixels();
    reflection.loadPixels();
    main.loadPixels();

    // Iterate over the entire canvas to create rectangles based on pixel data
    for (let x = 0; x < width; x += size / 2 ) {
        for (let y = 0; y < height; y += size / 2) {
            let index = (x + y * width) * 4; // Calculate the index in the pixel array

            // Sky Rectangles
            if (sky.pixels[index + 3] > 0) { // Check if the alpha value is greater than 0
                // This is to speed up the operation so that the program does not have to calculate the blank part of the image
                skyRects.push(new Rect(
                    x, y,
                    sky.pixels[index],
                    sky.pixels[index + 1],
                    sky.pixels[index + 2],
                    sky.pixels[index + 3],
                    "sky"
                ));
            }

            // Sea Rectangles
            if (sea.pixels[index + 3] > 0) {
                seaRects.push(new Rect(
                    x, y,
                    sea.pixels[index],
                    sea.pixels[index + 1],
                    sea.pixels[index + 2],
                    sea.pixels[index + 3],
                    "sea"
                ));
            }

            // Reflection Rectangles
            if (reflection.pixels[index + 3] > 0) {
                reflectionRects.push(new Rect(
                    x, y,
                    reflection.pixels[index],
                    reflection.pixels[index + 1],
                    reflection.pixels[index + 2],
                    reflection.pixels[index + 3],
                    "reflection"
                ));
            }

            // Main Rectangles
            if (main.pixels[index + 3] > 0) {
                mainRects.push(new Rect(
                    x, y,
                    main.pixels[index],
                    main.pixels[index + 1],
                    main.pixels[index + 2],
                    main.pixels[index + 3],
                    "main"
                ));
            }
        }
    }
}

function draw() {
    background(0); // Set background color to black
    //translate(-width / 2, -height / 2); // Adjust origin for 3D transformations
    rotateY(mouseX * 0.05); // Rotate scene based on mouse movement

    // Draw all rectangles representing the sky part
    for (let i = 0; i < skyRects.length; i++) {
        skyRects[i].move(); // Implement rectangle movement logic (if needed)
        skyRects[i].drawRect(); // Draw the rectangle
    }

    // Draw all rectangles representing the sea part
    for (let i = 0; i < seaRects.length; i++) {
        seaRects[i].move();
        seaRects[i].drawRect();
    }

    // Draw all rectangles representing the reflection part
    for (let i = 0; i < reflectionRects.length; i++) {
        reflectionRects[i].move();
        reflectionRects[i].drawRect();
    }

    // Draw all rectangles representing the main part
    for (let i = 0; i < mainRects.length; i++) {
        mainRects[i].move();
        mainRects[i].drawRect();
    }

    print (camZ)
    // Print the total count of all rectangles
    // print(skyRects.length + seaRects.length + reflectionRects.length + mainRects.length);
    if (keyIsPressed){
        if (keyCode===UP_ARROW){
            camSpd= Lerp(camSpd,40, 1)
        } else if (keyCode=== DOWN_ARROW) {
            camSpd = lerp(camSpd,-40, 1)
        }
    } else {
        camSpd = lerp(camSpd, 0, 0.1)
    }
    camZ += camSpd;
}
function keyPressed() {

}

// Rectangle class, used to store data for each rectangle and implement drawing and movement logic
class Rect {
    constructor(x, y, r, g, b, a, part) {
        this.x = x - width/ 2; // x-coordinate of the rectangle
        this.y = y - height/ 2; // y-coordinate of the rectangle
        this.r = r; // Red value
        this.g = g; // Green value
        this.b = b; // Blue value        
        let bri = brightness(color(r, g, b));//0-255
        this.z = map(bri, 0, 255, 100, -1500);
        this.a = a; // Alpha (transparency) value
        this.part = part; // Part of the image the rectangle belongs to
        }
    
    move() {
        // If we want to add movement to the rectangle, we can add it here
        // For the personal part later
    }

    drawRect() {
        push(); // Save the current drawing settings
        noStroke(); // No border for the rectangle
        translate(this.x, this.y, this.z + camZ); // Move to rectangle's position
        rotate(45);// Rotate the degrees of the rectangle
        fill(this.r, this.g, this.b); // Set the fill color
        box(size); // Draw a 3D box (cube)
        pop(); // Restore the previous drawing settings
    }
}
