// Basic interactions for the Car Damage AI page

const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');

hamburger?.addEventListener('click', () => {
    navMenu?.classList.toggle('open');
});

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
}

const imageInput = document.getElementById('imageInput');
const uploadArea = document.getElementById('uploadArea');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const resultsPlaceholder = document.getElementById('resultsPlaceholder');
const resultsContent = document.getElementById('resultsContent');

function resetDetector() {
    if (!imageInput) return;
    imageInput.value = '';
    previewSection.style.display = 'none';
    resultsPlaceholder.style.display = 'flex';
    resultsContent.style.display = 'none';
}

function showPreview(file) {
    if (!file || !previewImage || !previewSection) return;
    const reader = new FileReader();
    reader.onload = () => {
        previewImage.src = reader.result;
        previewSection.style.display = 'block';
        resultsPlaceholder.style.display = 'flex';
        resultsContent.style.display = 'none';
        // Simulate analysis for demo purposes
        setTimeout(() => {
            resultsPlaceholder.style.display = 'none';
            resultsContent.style.display = 'block';
            document.getElementById('damageType').textContent = 'Dent';
            document.getElementById('severity').textContent = 'Moderate';
            document.getElementById('confidence').textContent = '88%';
            document.getElementById('area').textContent = 'Front bumper';
            document.getElementById('recommendations').textContent = 'Take the car to a repair shop for a detailed inspection and quote.';
        }, 1200);
    };
    reader.readAsDataURL(file);
}

imageInput?.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    showPreview(file);
});

// Allow drag & drop onto upload area
uploadArea?.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea?.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea?.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadArea.classList.remove('dragover');

    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    imageInput.value = '';
    showPreview(file);
});
