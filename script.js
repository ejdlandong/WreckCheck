// ============================
// NAVIGATION
// ============================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });
}

// ============================
// IMAGE UPLOAD
// ============================

const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const selectImageBtn = document.getElementById('selectImageBtn');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');

const resultsPlaceholder = document.getElementById('resultsPlaceholder');
const resultsContent = document.getElementById('resultsContent');

// Click upload
uploadArea.addEventListener('click', () => imageInput.click());
selectImageBtn?.addEventListener('click', () => imageInput.click());

// Drag & drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
        handleImageUpload(e.dataTransfer.files[0]);
    }
});

// File select
imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleImageUpload(e.target.files[0]);
    }
});

// ============================
// HANDLE IMAGE
// ============================

function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert('Max file size is 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        previewSection.style.display = 'grid';

        analyzeImage(file);
    };
    reader.readAsDataURL(file);
}

// ============================
// FASTAPI CONNECTION
// ============================

async function analyzeImage(file) {
    resultsPlaceholder.style.display = 'block';
    resultsContent.style.display = 'none';

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/predict', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        // Fill UI
        document.getElementById('damageType').textContent = data.damage_type;
        document.getElementById('severity').textContent = data.severity;
        document.getElementById('confidence').textContent = data.confidence + "%";
        document.getElementById('status').textContent = data.status;
        document.getElementById('area').textContent = data.area;
        document.getElementById('recommendations').textContent = data.recommendation;

        resultsPlaceholder.style.display = 'none';
        resultsContent.style.display = 'block';

    } catch (error) {
        console.error(error);
        alert("Error connecting to backend. Make sure FastAPI is running.");
    }
}

// ============================
// RESET
// ============================

function resetDetector() {
    uploadArea.style.display = 'block';
    previewSection.style.display = 'none';
    imageInput.value = '';
}