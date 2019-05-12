var zoom = 4;
var width = 128;
var height = 128;
var gradient = {
    0.0: 'black',
    0.5: 'blue',
    0.6: 'cyan',
    0.8: 'lime',
    0.9: 'yellow',
    1.0: 'white'
}
var monochromeGradient = {
    1.0: '#fff'
}

window.onload = () => {
    var display = new Canvas(document.body, gradient, zoom, width, height);

    var step = 0;
    var posX = width / 4;
    var posY = height / 2;

    var frame = () => {
        if (display.zoom !== zoom) {
            display.zoom = zoom;
            display.canvas.width = width * display.zoom;
            display.canvas.height = height * display.zoom;
            display.cx.scale(display.zoom, display.zoom);
        }
        display.gradient = document.getElementById("monochrome").checked ? monochromeGradient : gradient;
        display.roughness = document.getElementById("roughness").value;
        display.particles.push(new Particle(
            new Vector2D(
                posX += Math.sin(step * 0.047) * 1.5,
                posY += Math.cos(step * 0.047) * 1.5),
            parseInt(document.getElementById("radius").value),
            parseInt(document.getElementById("blur").value),
            parseInt(document.getElementById("intensity").value) / 100,
            parseInt(document.getElementById("volatility").value) / 100));
        display.draw();
        step++;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}