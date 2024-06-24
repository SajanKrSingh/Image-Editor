document.addEventListener('DOMContentLoaded', () => {
    const chooseImageButton = document.querySelector('.choose-img');
    const imageInput = document.getElementById('image-input');
    const previewImg = document.getElementById('preview-img');
    const filterButtons = document.querySelectorAll('.filters button');
    const filterSlider = document.getElementById('filter-slider');
    const rotateButtons = document.querySelectorAll('.rotate-flip button');
    const saveImageButton = document.querySelector('.save-img');
    const resetFilterButton = document.querySelector('.reset-filter');

    let currentFilter = 'brightness';
    let filterValues = {
        brightness: 100,
        saturation: 100,
        grayscale: 0,
        inversion: 0
    };
    let rotateDegree = 0;
    let flipHorizontal = 1;
    let flipVertical = 1;

    // Image upload handling
    chooseImageButton.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                previewImg.src = reader.result;
                previewImg.style.filter = getFilterString();
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a valid image file.');
        }
    });

    // Filter adjustments
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.id;
            filterSlider.value = filterValues[currentFilter];
        });
    });

    filterSlider.addEventListener('input', () => {
        filterValues[currentFilter] = filterSlider.value;
        previewImg.style.filter = getFilterString();
    });

    // Rotation and flipping
    rotateButtons.forEach(button => {
        button.addEventListener('click', () => {
            switch (button.id) {
                case 'left':
                    rotateDegree -= 90;
                    break;
                case 'right':
                    rotateDegree += 90;
                    break;
                case 'horizontal':
                    flipHorizontal *= -1;
                    break;
                case 'vertical':
                    flipVertical *= -1;
                    break;
            }
            applyTransformations();
        });
    });

    // Save image
    saveImageButton.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = previewImg.src;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.filter = getFilterString();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotateDegree * Math.PI) / 180);
            ctx.scale(flipHorizontal, flipVertical);
            ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2);
            const link = document.createElement('a');
            link.download = 'edited-image.jpg';
            link.href = canvas.toDataURL('image/jpeg');
            link.click();
        };
    });

    // Reset filters
    resetFilterButton.addEventListener('click', () => {
        filterValues = { brightness: 100, saturation: 100, grayscale: 0, inversion: 0 };
        rotateDegree = 0;
        flipHorizontal = 1;
        flipVertical = 1;
        filterSlider.value = 100;
        currentFilter = 'brightness';
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById('brightness').classList.add('active');
        previewImg.style.filter = getFilterString();
        applyTransformations();
    });

    function getFilterString() {
        return `brightness(${filterValues.brightness}%) 
                saturate(${filterValues.saturation}%) 
                grayscale(${filterValues.grayscale}%) 
                invert(${filterValues.inversion}%)`;
    }

    function applyTransformations() {
        previewImg.style.transform = `rotate(${rotateDegree}deg) scale(${flipHorizontal}, ${flipVertical})`;
    }
});
