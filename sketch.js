let sky, sea, reflection, main;
let size = 10; // Size of rectangle (You can change rectangle's size here)
let skyRects = []; // Store rectangles for the sky part
let seaRects = []; // Store rectangles for the sea part
let mainRects = []; // Store rectangles for the main part
let reflectionRects = []; // Store rectangles for the reflection part
let camZ = 0; // Camera Z position
let camSpd = 0; // Camera speed
let start = false; // Start flag for the animation
let font; // Font for the instruction text

function preload() {
    // Preload images
    sky = loadImage('assets/sky.png'); // Load sky image
    sea = loadImage('assets/sea.png'); // Load sea image
    reflection = loadImage('assets/reflection.png'); // Load reflection image
    main = loadImage('assets/main.png'); // Load main image
    font = loadFont("assets/Beyond.ttf"); // Add and load font style for instructions
}

function setup() {
    // Set up canvas size and basic drawing parameters
    createCanvas(600, 500, WEBGL); // Adding WebGL to create 3D view, new technique
    noFill(); // Disable fill for shapes
    textAlign(CENTER, CENTER); // Center align text
    textFont(font); // Set custom font for instructions
    angleMode(DEGREES); // Set angle mode to degrees
    rectMode(CENTER); // Set rectangle drawing mode to be centered
    noStroke(); // No border for rectangles
    rectInit(); // Initialize rectangles
}

function rectInit() {
    // Initialize rectangles and extract data from images
    sky.resize(width, height); // Resize sky image to canvas size
    sea.resize(width, height); // Resize sea image to canvas size
    reflection.resize(width, height); // Resize reflection image to canvas size
    main.resize(width, height); // Resize main image to canvas size

    // Load pixel data for each image
    sky.loadPixels(); 
    sea.loadPixels(); 
    reflection.loadPixels(); 
    main.loadPixels(); 

    // Get the pixel indices of a specific RGB value of an image and draw rectangles
    // We got the code reference from this website:
    // https://editor.p5js.org/iscodd/sketches/7-_pQbU9G 
    // https://stackoverflow.com/questions/24689403/index-a-pixel-using-one-loop-or-two-loops
    for (let x = 0; x < width; x += size / 2) {
        for (let y = 0; y < height; y += size / 2) {
            let index = (x + y * width) * 4; // Calculate the index in the pixel array

            // Sky Rectangles
            if (sky.pixels[index + 3] > 0) { // Check if the alpha value is greater than 0
                // Speed up the operation so that the program does not have to calculate the blank part of the image
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
    if (!start) {
        // Display instructions before starting
        background(0); // Black background
        fill(255); // White text
        textSize(20); // Instruction text size
        textAlign(CENTER, CENTER); // Center align text
        text("DRAG MOUSE TO ADJUST VIEW  \n UP ARROW TO FORWARD \n DOWN ARROW TO BACKWARD \n \n CLICK TO START", 0, 0); // Instruction text
        if (mouseIsPressed) {
            start = true; // Start animation on mouse click
        }
    } else {
        background(0); // Set the background to black to avoid overlap
        rotateY(mouseX * 0.05); // Rotate view based on mouse movement

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

        // Control camera movement using arrow keys
        if (keyIsPressed) {
            if (keyCode === UP_ARROW) {
                camSpd = lerp(camSpd, 40, 0.09); // Move forward
            } else if (keyCode === DOWN_ARROW) {
                camSpd = lerp(camSpd, -40, 0.09); // Move backward
            }
        } else {
            camSpd = lerp(camSpd, 0, 0.1); // Slow down when no key is pressed
        }
        camZ += camSpd; // Update camera position
    }
}

// Removed Print the total count of all rectangles
// print(skyRects.length + seaRects.length + reflectionRects.length + mainRects.length);

// Rectangle class, used to store data for each rectangle and implement drawing and movement logic
// We got the code reference from this website:
// https://editor.p5js.org/Jaekook/sketches/SywJ5wg57
// https://p5js.org/reference/p5/class/
class Rect {
    constructor(x, y, r, g, b, a, part) {
        this.x = x - width / 2; // Adjust x-coordinate of the rectangle
        this.y = y - height / 2; // Adjust y-coordinate of the rectangle
        this.r = r; // Red value
        this.g = g; // Green value
        this.b = b; // Blue value
        let bri = brightness(color(r, g, b)); // Calculate brightness value (0-255)
        this.z = map(bri, 0, 255, 100, -1500); // Map brightness to Z-axis for 3D depth
        this.a = a; // Alpha (transparency) value
        this.part = part; // Part of the image the rectangle belongs to

        if (this.part === 'sea') {
            this.z = map(this.y, -height / 2, height / 2, -1200, 0); // Adjust Z-axis for sea rectangles
            this.z += bri * 5; // Add brightness effect for sea
        }
        if (this.part === 'main') {
            this.z = map(bri, 0, 255, -200, 200); // Adjust Z-axis for main rectangles
        }
    }

    move() {
        // Placeholder for potential rectangle movement logic
    }

    drawRect() {
        push(); // Save the current drawing settings
        noStroke(); // No border for the rectangle
        translate(this.x, this.y, this.z + camZ); // Move to the position of the rectangle
        rotate(45); // Rotate the rectangle by 45 degrees
        fill(this.r, this.g, this.b); // Set the fill color
        box(size); // Draw the box for 3D effect
        pop(); // Restore the previous drawing settings
        // rect(0, 0, size, size); // removed draw rectangle
    }
}
