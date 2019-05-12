class Canvas {
    constructor(parent, gradient, zoom, width, height) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'canvas';
        this.cx = this.canvas.getContext('2d');
        this.zoom = zoom;
        this.canvas.width = width * this.zoom;
        this.canvas.height = height * this.zoom;
        parent.appendChild(this.canvas);
        this.cx.scale(this.zoom, this.zoom);

        this.particles = [];
        this.gradient = gradient;
        this.roughness;

        this.calculPoint = (radius, blur) => {
            var point = document.createElement('canvas');
            var cx = point.getContext('2d');
            point.radius = radius + blur;
    
            cx.shadowOffsetX = cx.shadowOffsetY = point.radius * 2;
            cx.shadowBlur = blur;
            cx.shadowColor = 'black';
    
            cx.beginPath();
            cx.arc(-point.radius, -point.radius, radius, 0, Math.PI * 2);
            cx.closePath();
            cx.fill();
    
            return point;
        }

        this.calculGradient = grad => {
            var canvas = document.createElement('canvas');
            var cx = canvas.getContext('2d');
            var gradient = cx.createLinearGradient(0, 0, 0, 256);
    
            canvas.width = 1;
            canvas.height = 256;
    
            for (var i in grad) gradient.addColorStop(+i, grad[i]);
    
            cx.fillStyle = gradient;
            cx.fillRect(0, 0, 1, 256);
    
            return cx.getImageData(0, 0, 1, 256).data;
        }

        this.draw = () => {
            this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.particles.forEach(particle => {
                var point = this.calculPoint(particle.radius, particle.blur);
                particle.intensity >= particle.volatility ? particle.intensity -= particle.volatility : particle.intensity = 0;
                this.cx.globalAlpha = Math.min(particle.intensity, 1);
                this.cx.drawImage(point, particle.pos.x - point.radius, particle.pos.y - point.radius);
            });
            this.particles = this.particles.filter(particle => particle.intensity > 0);
            
            var gradient = this.calculGradient(this.gradient);
            var colored = this.cx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.colorize(colored.data, gradient);
            this.cx.putImageData(colored, 0, 0);
        }

        this.colorize = (pixels, gradient) => {
            for (var i = 0, j; i < pixels.length; i += 4) {
                j = pixels[i + 3] * 4;
                if (j) {
                    if ((Math.floor((i / 4 % this.canvas.width) / this.zoom) % 2  === Math.floor(Math.floor(i / 4 / this.canvas.height) / this.zoom) % 2) && j / 4 < 128) pixels[i + 3] = 0;
                    else {
                        pixels[i] = gradient[j];
                        pixels[i + 1] = gradient[j + 1];
                        pixels[i + 2] = gradient[j + 2];
                        if (pixels[i + 3] > this.roughness) pixels[i + 3] = 255;
                    }
                }
            }
        }
    }
}
