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
        reader.onerror = () => {
            alert('خطا در بارگذاری تصویر. لطفاً مجدداً تلاش کنید.');
        };
    }
});

document.getElementById('grayscale').addEventListener('input', () => {
    applyFilters();
});

document.getElementById('sepia').addEventListener('input', () => {
    applyFilters();
});

document.getElementById('blur').addEventListener('input', () => {
    applyFilters();
});

document.getElementById('brightness').addEventListener('input', () => {
    applyFilters();
});

document.getElementById('contrast').addEventListener('input', () => {
    applyFilters();
});

document.getElementById('invert').addEventListener('input', () => {
    applyFilters();
});

document.getElementById('green-filter').addEventListener('input', () => {
    applyFilters();
});

document.getElementById('purple-filter').addEventListener('input', () => {
    applyFilters();
});

document.getElementById('reset').addEventListener('click', () => {
    if (originalImageData) {
        canvas.width = FIXED_WIDTH;
        canvas.height = FIXED_HEIGHT;
        ctx.putImageData(originalImageData, 0, 0);
        resetFilters();
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

function applyFilters() {
    if (!originalImageData) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before applying filters
    ctx.putImageData(originalImageData, 0, 0); // Restore the original image

    let grayscaleValue = document.getElementById('grayscale').value;
    let sepiaValue = document.getElementById('sepia').value;
    let blurValue = document.getElementById('blur').value;
    let brightnessValue = document.getElementById('brightness').value;
    let contrastValue = document.getElementById('contrast').value;
    let invertValue = document.getElementById('invert').value;
    let greenFilterValue = document.getElementById('green-filter').value;
    let purpleFilterValue = document.getElementById('purple-filter').value;

    ctx.filter = `grayscale(${grayscaleValue}%) sepia(${sepiaValue}%) blur(${blurValue}px) brightness(${brightnessValue}%) contrast(${contrastValue}%) invert(${invertValue}%)`;
    ctx.drawImage(canvas, 0, 0); // Apply the filter to the current canvas content

    // Apply green and purple filters separately as they are not supported by CSS filter
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    // Green Filter
    for (let i = 0; i < data.length; i += 4) {
        data[i + 1] = data[i + 1] * (1 + greenFilterValue / 100);
    }

    // Purple Filter
    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] * (1 + purpleFilterValue / 100);
        data[i + 2] = data[i + 2] * (1 + purpleFilterValue / 100);
    }

    ctx.putImageData(imageData, 0, 0); // Apply green and purple filter changes
}

function resetFilters() {
    document.getElementById('grayscale').value = 0;
    document.getElementById('sepia').value = 0;
    document.getElementById('blur').value = 0;
    document.getElementById('brightness').value = 100;
    document.getElementById('contrast').value = 100;
    document.getElementById('invert').value = 0;
    document.getElementById('green-filter').value = 0;
    document.getElementById('purple-filter').value = 0;
}
