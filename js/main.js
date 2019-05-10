window.onload = () => {
    var posX = posY = null;

    var gradient = {
        0.5: 'blue',
        0.6: 'cyan',
        0.8: 'lime',
        0.9: 'yellow',
        1.0: 'white'
    }

    var display = new Canvas(document.body, gradient);

    document.getElementById('canvas').onmousemove = event => {
        posX = event.layerX;
        posY = event.layerY;
    }
    document.getElementById('canvas').onmouseleave = event => posX = posY = null;

    var frame = () => {
        if (posX && posY) display.particles.push(new Particle(
            new Vector2D(posX, posY),
            parseInt(document.getElementById("radius").value),
            parseInt(document.getElementById("blur").value),
            parseInt(document.getElementById("intensity").value) / 100,
            parseInt(document.getElementById("volatility").value) / 100));
        display.draw();
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame)
}