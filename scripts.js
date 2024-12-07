const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const FIXED_WIDTH = 200;
const FIXED_HEIGHT = 200;
let originalImageData = null;

upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                canvas.width = FIXED_WIDTH;
                canvas.height = FIXED_HEIGHT;
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing new image
                ctx.drawImage(img, 0, 0, FIXED_WIDTH, FIXED_HEIGHT);
                originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('grayscale').addEventListener('click', () => {
    applyFilter((r, g, b) => {
        let avg = (r + g + b) / 3;
        return [avg, avg, avg];
    });
});

document.getElementById('sepia').addEventListener('click', () => {
    applyFilter((r, g, b) => {
        return [
            r * 0.393 + g * 0.769 + b * 0.189,
            r * 0.349 + g * 0.686 + b * 0.168,
            r * 0.272 + g * 0.534 + b * 0.131
        ];
    });
});

document.getElementById('blur').addEventListener('click', () => {
    ctx.filter = 'blur(5px)';
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

document.getElementById('invert').addEventListener('click', () => {
    applyFilter((r, g, b) => {
        return [255 - r, 255 - g, 255 - b];
    });
});

document.getElementById('brightness').addEventListener('click', () => {
    applyFilter((r, g, b) => {
        let factor = 1.2; // Increase brightness by 20%
        return [r * factor, g * factor, b * factor];
    });
});

document.getElementById('decrease-brightness').addEventListener('click', () => {
    applyFilter((r, g, b) => {
        let factor = 0.8; // Decrease brightness by 20%
        return [r * factor, g * factor, b * factor];
    });
});

document.getElementById('contrast').addEventListener('click', () => {
    applyFilter((r, g, b) => {
        let factor = 1.5; // Increase contrast by 50%
        return [(r - 128) * factor + 128, (g - 128) * factor + 128, (b - 128) * factor + 128];
    });
});

document.getElementById('green-filter').addEventListener('click', () => {
    applyFilter((r, g, b) => {
        return [r * 0.5, g, b * 0.5];
    });
});

document.getElementById('purple-filter').addEventListener('click', () => {
    applyFilter((r, g, b) => {
        return [r * 0.5, g * 0.5, b];
    });
});

document.getElementById('reset').addEventListener('click', () => {
    if (originalImageData) {
        canvas.width = FIXED_WIDTH;
        canvas.height = FIXED_HEIGHT;
        ctx.putImageData(originalImageData, 0, 0);
    }
});

document.getElementById('download').addEventListener('click', () => {
    const format = document.getElementById('image-format').value;
    const link = document.createElement('a');
    link.download = `edited-image.${format}`;
    if (format === 'jpeg') {
        link.href = canvas.toDataURL('image/jpeg');
    } else {
        link.href = canvas.toDataURL('image/png');
    }
    link.click();
});

function applyFilter(filterFunction) {
    if (!originalImageData) return;
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        let r = imageData.data[i];
        let g = imageData.data[i + 1];
        let b = imageData.data[i + 2];
        [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]] = filterFunction(r, g, b);
    }
    ctx.putImageData(imageData, 0, 0);
}
