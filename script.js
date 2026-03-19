<<<<<<< Updated upstream
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
=======
/* ============================
   SMOOTH SCROLLING & NAVIGATION
   ============================ */

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

/* ============================
   IMAGE UPLOAD & PREVIEW
   ============================ */

const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const selectImageBtn = document.getElementById('selectImageBtn');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');

// Drag and drop functionality
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#FF6B6B';
    uploadArea.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#4ECDC4';
    uploadArea.style.backgroundColor = 'rgba(78, 205, 196, 0.05)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#4ECDC4';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleImageUpload(files[0]);
    }
});

// Make the entire upload area clickable.
uploadArea.addEventListener('click', () => {
    imageInput.click();
});

// Support the "Choose Image" button on smaller screens.
if (selectImageBtn) {
    selectImageBtn.addEventListener('click', () => {
        imageInput.click();
    });
}

// File input change
imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleImageUpload(e.target.files[0]);
    }
});

// Handle image upload
function handleImageUpload(file) {
    // Validate file
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }

    // Read file
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        previewSection.style.display = 'grid';

        // Trigger analysis once the preview image is ready (provides correct dimensions)
        previewImage.onload = () => simulateAnalysis(file, previewImage);
>>>>>>> Stashed changes
    };
    reader.readAsDataURL(file);
}

<<<<<<< Updated upstream
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
=======
// FastAPI backend damage analysis
async function simulateAnalysis(file, image) {
    const resultsPlaceholder = document.getElementById('resultsPlaceholder');
    const resultsContent = document.getElementById('resultsContent');

    // Show loading state
    resultsPlaceholder.style.display = 'block';
    resultsContent.style.display = 'none';

    try {
        // Create FormData with the image file
        const formData = new FormData();
        formData.append('file', file);

        // Call the FastAPI predict endpoint
        const response = await fetch('/api/predict', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const analysis = await response.json();

        // Update UI with API response
        document.getElementById('damageType').textContent = analysis.damage_type || analysis.prediction;
        document.getElementById('severity').textContent = analysis.severity;
        document.getElementById('confidence').textContent = `${analysis.confidence}%`;

        const statusEl = document.getElementById('status');
        statusEl.textContent = analysis.status;
        statusEl.classList.remove('status-indeterminate', 'status-manual', 'status-confirmed');
        if (analysis.status.includes('Indeterminate')) {
            statusEl.classList.add('status-indeterminate');
        } else if (analysis.status.includes('Manual')) {
            statusEl.classList.add('status-manual');
        } else {
            statusEl.classList.add('status-confirmed');
        }

        document.getElementById('area').textContent = analysis.area || 'Analysis in progress';
        document.getElementById('recommendations').textContent = analysis.recommendation || 'Professional inspection recommended';

        const severityElement = document.getElementById('severity');
        severityElement.classList.remove('severity-minor', 'severity-moderate', 'severity-severe');
        severityElement.classList.add(`severity-${analysis.severity.toLowerCase()}`);

        // Show results
        resultsPlaceholder.style.display = 'none';
        resultsContent.style.display = 'flex';

    } catch (error) {
        console.error('Error:', error);
        alert(`Error analyzing image: ${error.message}`);
        resultsPlaceholder.style.display = 'none';
    }
}

// Rule-based evaluation logic for damage analysis
function evaluateDamage(file, image) {
    const filename = (file && file.name) ? file.name.toLowerCase() : '';

    const standardizedZones = [
        'Front Bumper', 'Rear Bumper', 'Hood', 'Roof', 'Trunk',
        'Driver-Side Front Door', 'Driver-Side Rear Door',
        'Passenger-Side Front Door', 'Passenger-Side Rear Door',
        'Windshield', 'Windows', 'Headlights/Taillights', 'Wheel/Tire'
    ];

    const typeMap = {
        scratch: 'Scratch',
        dent: 'Dent',
        crack: 'Crack',
        shattered: 'Shattered',
        broken: 'Shattered',
        missing: 'Missing Part',
        paint: 'Paint Damage',
        painted: 'Paint Damage',
        flat: 'Flat',
        punctured: 'Punctured',
        scraped: 'Scraped Rim',
        hubcap: 'Missing Hubcap',
        chipped: 'Chipped'
    };

    const damageTypes = Object.entries(typeMap)
        .filter(([keyword]) => filename.includes(keyword))
        .map(([, type]) => type);

    // Fallback guess based on common keywords
    if (damageTypes.length === 0) {
        if (filename.match(/glass|window|windshield|headlight|taillight/)) {
            damageTypes.push('Shattered');
        }
        if (filename.match(/body|panel|door|bumper/)) {
            damageTypes.push('Dent');
        }
        if (filename.match(/wheel|tire|rim/)) {
            damageTypes.push('Flat');
        }
    }

    // Hierarchical Part-First Logic: Apply part-specific constraints
    const allowedTypes = getAllowedDamageTypes(forcedArea);
    const filteredDamageTypes = damageTypes.filter(type => allowedTypes.includes(type));

    const uniqueTypes = [...new Set(filteredDamageTypes)];
    const primaryType = uniqueTypes.length === 0 ? 'Indeterminate' : uniqueTypes.sort((a, b) => (severityPriority[b] || 0) - (severityPriority[a] || 0))[0];

    const area = mapFilenameToZone(filename, standardizedZones);
    
    // Rule 1: Partial Data Extraction - If confidence will be medium, force area mapping
    let forcedArea = area;
    if (area === 'Unknown Area') {
        // Simulate ROI-based mapping: assume lower-right quadrant maps to rear
        const simulatedROI = simulateROIFromFilename(filename);
        forcedArea = simulatedROI || fallbackAreaFromROI(file, image, filename);
    }

    const sizePercent = estimateSizePercent(file, image);
    let severity = determineSeverity(sizePercent, primaryType, forcedArea);

    // Severity Overrides for Wear-and-Tear Parts
    if (forcedArea === 'Wheel/Tire' && primaryType === 'Flat') {
        severity = 'Moderate (Operational)';
    }

    let confidence = calculateConfidence({ filename, primaryType, area: forcedArea, sizePercent, uniqueTypes });

    const consistency = validateTypeAreaConsistency(primaryType, forcedArea);
    if (!consistency.isValid) {
        confidence = Math.min(confidence, 55);
    }

    const status = determineStatus(confidence, consistency);

    let displayType = buildDisplayType(primaryType, uniqueTypes, status);

    // Rule 2: Severe but Indeterminate Conflict
    if (severity === 'Severe' && displayType === 'Indeterminate') {
        displayType = 'Multiple/Complex Structural Damage';
    }

    const recommendation = generateRecommendation({ primaryType, severity, area: forcedArea, status });

    return {
        displayType,
        primaryType,
        severity,
        confidence,
        status,
        area: forcedArea,
        recommendation
    };
}

function getAllowedDamageTypes(area) {
    const constraints = {
        'Wheel/Tire': ['Flat', 'Punctured', 'Scraped Rim', 'Missing Hubcap'],
        'Windshield': ['Cracked', 'Shattered', 'Chipped'],
        'Windows': ['Cracked', 'Shattered', 'Chipped'],
        'Headlights/Taillights': ['Cracked', 'Shattered', 'Chipped'],
        // Default for body panels
        'Front Bumper': ['Dent', 'Scratch', 'Paint Damage', 'Missing Part'],
        'Rear Bumper': ['Dent', 'Scratch', 'Paint Damage', 'Missing Part'],
        'Hood': ['Dent', 'Scratch', 'Paint Damage', 'Crack'],
        'Roof': ['Dent', 'Scratch', 'Paint Damage'],
        'Trunk': ['Dent', 'Scratch', 'Paint Damage', 'Missing Part'],
        'Driver-Side Front Door': ['Dent', 'Scratch', 'Paint Damage'],
        'Driver-Side Rear Door': ['Dent', 'Scratch', 'Paint Damage'],
        'Passenger-Side Front Door': ['Dent', 'Scratch', 'Paint Damage'],
        'Passenger-Side Rear Door': ['Dent', 'Scratch', 'Paint Damage']
    };

    return constraints[area] || ['Dent', 'Scratch', 'Paint Damage', 'Crack', 'Shattered', 'Missing Part'];
}

function getFallbackTypesForArea(area) {
    const fallbacks = {
        'Wheel/Tire': ['Flat'],
        'Windshield': ['Cracked'],
        'Windows': ['Cracked'],
        'Headlights/Taillights': ['Shattered'],
        // Default
        'Front Bumper': ['Dent'],
        'Rear Bumper': ['Dent'],
        'Hood': ['Dent'],
        'Roof': ['Dent'],
        'Trunk': ['Dent'],
        'Driver-Side Front Door': ['Dent'],
        'Driver-Side Rear Door': ['Dent'],
        'Passenger-Side Front Door': ['Dent'],
        'Passenger-Side Rear Door': ['Dent']
    };

    return fallbacks[area] || ['Dent'];
}

function fallbackAreaFromROI(file, image, filename) {
    // Simulate ROI analysis: if filename suggests wheel/tire, or image is circular
    if (filename.match(/wheel|tire|rim|hubcap/)) {
        return 'Wheel/Tire';
    }

    // Simulate color/texture analysis: dark gray/black and circular/elliptical
    // For demo, assume if filename has 'dark' or 'black', it's wheel
    if (filename.match(/dark|black|gray/)) {
        return 'Wheel/Tire';
    }

    return 'Unknown Area';
}

function simulateROIFromFilename(filename) {
    // Simulate bounding box coordinates based on filename keywords
    // Assume lower-right quadrant maps to rear areas
    const lowerRightKeywords = ['rear', 'bumper', 'taillight', 'trunk', 'back'];
    if (lowerRightKeywords.some(k => filename.includes(k))) {
        return 'Rear Bumper/Taillight';
    }
    // Wheel/tire specific
    if (filename.match(/wheel|tire|rim|hubcap/)) {
        return 'Wheel/Tire';
    }
    // Add more heuristics as needed
    return null;
}

function mapFilenameToZone(filename, zones) {
    const normalized = filename.replace(/[-_.]/g, ' ');

    const zoneKeywords = {
        'Front Bumper': ['front bumper', 'frontbumper', 'front', 'bumper'],
        'Rear Bumper': ['rear bumper', 'rearbumper', 'rear', 'bumper'],
        'Hood': ['hood', 'bonnet'],
        'Roof': ['roof'],
        'Trunk': ['trunk', 'boot'],
        'Driver-Side Front Door': ['driver front door', 'driver-side front door', 'driver side front door', 'driver front'],
        'Driver-Side Rear Door': ['driver rear door', 'driver-side rear door', 'driver side rear door', 'driver rear'],
        'Passenger-Side Front Door': ['passenger front door', 'passenger-side front door', 'passenger side front door', 'passenger front'],
        'Passenger-Side Rear Door': ['passenger rear door', 'passenger-side rear door', 'passenger side rear door', 'passenger rear'],
        'Windshield': ['windshield', 'windscreen'],
        'Windows': ['window', 'windows', 'glass'],
        'Headlights/Taillights': ['headlight', 'taillight', 'headlights', 'taillights', 'light'],
        'Wheel/Tire': ['wheel', 'tire', 'rim', 'hubcap']
    };

    for (const zone of zones) {
        const keywords = zoneKeywords[zone] || [zone.toLowerCase()];
        if (keywords.some(k => normalized.includes(k))) {
            return zone;
        }
    }

    return 'Unknown Area';
}

function estimateSizePercent(file, image) {
    const fileSizeMb = file?.size ? file.size / (1024 * 1024) : 0;
    const fileSizeScore = Math.min(100, Math.round((fileSizeMb / 5) * 100));

    const imageArea = (image?.naturalWidth || 0) * (image?.naturalHeight || 0);
    const referenceArea = 1280 * 720;
    const resolutionScore = Math.min(100, Math.round((imageArea / referenceArea) * 100));

    return Math.round((resolutionScore * 0.7) + (fileSizeScore * 0.3));
}

function determineSeverity(sizePercent, primaryType, area) {
    if (primaryType === 'Shattered' || primaryType === 'Missing Part') {
        return 'Severe';
    }

    if (area === 'Wheel/Tire') {
        // Wear-and-tear parts have lower severity
        if (sizePercent < 20) return 'Minor';
        if (sizePercent < 50) return 'Moderate';
        return 'Severe';
    }

    if (sizePercent < 10) return 'Minor';
    if (sizePercent < 30) return 'Moderate';
    return 'Severe';
}

function calculateConfidence({ filename, primaryType, area, sizePercent, uniqueTypes }) {
    let confidence = 50;

    if (primaryType !== 'Indeterminate') {
        confidence += 20;
    }

    if (area !== 'Unknown Area') {
        confidence += 15;
    }

    if (uniqueTypes.length > 1) {
        confidence += 10;
    }

    confidence += Math.round((sizePercent - 40) / 2);

    confidence = Math.max(0, Math.min(100, confidence));

    return confidence;
}

function validateTypeAreaConsistency(type, area) {
    if (type === 'Indeterminate' || area === 'Unknown Area') {
        return { isValid: true, reason: null };
    }

    const areaSets = {
        'Shattered': ['Windshield', 'Windows', 'Headlights/Taillights'],
        'Dent': ['Front Bumper', 'Rear Bumper', 'Hood', 'Roof', 'Trunk', 'Driver-Side Front Door', 'Driver-Side Rear Door', 'Passenger-Side Front Door', 'Passenger-Side Rear Door'],
        'Scratch': ['Front Bumper', 'Rear Bumper', 'Hood', 'Roof', 'Trunk', 'Driver-Side Front Door', 'Driver-Side Rear Door', 'Passenger-Side Front Door', 'Passenger-Side Rear Door', 'Windshield', 'Windows', 'Headlights/Taillights'],
        'Crack': ['Windshield', 'Windows', 'Headlights/Taillights', 'Front Bumper', 'Rear Bumper', 'Hood', 'Roof', 'Trunk'],
        'Paint Damage': ['Front Bumper', 'Rear Bumper', 'Hood', 'Roof', 'Trunk', 'Driver-Side Front Door', 'Driver-Side Rear Door', 'Passenger-Side Front Door', 'Passenger-Side Rear Door'],
        'Missing Part': ['Front Bumper', 'Rear Bumper', 'Hood', 'Roof', 'Trunk', 'Driver-Side Front Door', 'Driver-Side Rear Door', 'Passenger-Side Front Door', 'Passenger-Side Rear Door', 'Windshield', 'Headlights/Taillights'],
        'Flat': ['Wheel/Tire'],
        'Punctured': ['Wheel/Tire'],
        'Scraped Rim': ['Wheel/Tire'],
        'Missing Hubcap': ['Wheel/Tire'],
        'Chipped': ['Windshield', 'Windows', 'Headlights/Taillights']
    };

    const allowed = areaSets[type];
    if (!allowed) {
        return { isValid: true, reason: null };
    }

    const isValid = allowed.includes(area);
    return {
        isValid,
        reason: isValid ? null : `Type "${type}" is unlikely on ${area}.`
    };
}

function determineStatus(confidence, consistency) {
    if (confidence < 60) {
        return 'Indeterminate (low confidence)';
    }

    if (!consistency.isValid) {
        return 'Requires Manual Verification';
    }

    if (confidence < 85) {
        return 'Requires Manual Verification';
    }

    return 'Confirmed';
}

function buildDisplayType(primaryType, types, status) {
    if (status.startsWith('Indeterminate')) {
        return 'Indeterminate';
    }

    const extras = types.filter(t => t !== primaryType);
    if (extras.length === 0) return primaryType;
    return `${primaryType} (also ${extras.join(', ')})`;
}

function generateRecommendation({ primaryType, severity, area, status }) {
    if (status.startsWith('Indeterminate')) {
        return 'Analysis unclear. Please upload a higher-quality image with the damage centered and well-lit.';
    }

    // Rule 4: Dynamic Recommendations for Edge Cases
    if (status === 'Requires Manual Verification' && severity === 'Severe') {
        return `High severity detected in ${area}, but exact damage type is obscured. Do not drive. Immediate physical inspection required.`;
    }

    if (primaryType === 'Missing Part') {
        return 'Order replacement part and schedule body shop installation.';
    }

    if (primaryType === 'Shattered' || ['Windshield', 'Windows', 'Headlights/Taillights'].includes(area)) {
        return 'Immediate full replacement is recommended. Do not drive until repaired.';
    }

    if (primaryType === 'Scratch') {
        if (severity === 'Minor') return 'Buffing and touch-up paint.';
        if (severity === 'Moderate') return 'Sand, prime, and repaint the affected panel.';
        return 'Replace panel and repaint to restore integrity.';
    }

    if (primaryType === 'Dent') {
        if (severity === 'Minor') return 'Paintless dent repair may be sufficient.';
        if (severity === 'Moderate') return 'Professional dent repair and possible repainting required.';
        return 'Body panel replacement recommended; check for underlying structural damage.';
    }

    if (primaryType === 'Crack') {
        if (severity === 'Minor') return 'Small cracks can be sealed; monitor for spread.';
        return 'Replace the cracked component to ensure safety.';
    }

    if (primaryType === 'Paint Damage') {
        if (severity === 'Minor') return 'Touch-up paint and clear coat may restore appearance.';
        return 'Repaint the affected panel after proper prep work.';
    }

    // New recommendations for wheel/tire
    if (area === 'Wheel/Tire') {
        if (primaryType === 'Flat') {
            return 'Flat tire detected. Mount the spare tire and proceed to a tire repair shop. Do not drive on the flat rim.';
        }
        if (primaryType === 'Punctured') {
            return 'Tire puncture detected. Repair or replace the tire at a service center.';
        }
        if (primaryType === 'Scraped Rim') {
            return 'Rim damage detected. Inspect for structural integrity and repair as needed.';
        }
        if (primaryType === 'Missing Hubcap') {
            return 'Missing hubcap. Cosmetic issue; replace if desired.';
        }
    }

    if (primaryType === 'Chipped') {
        return 'Minor chip detected. Repair with resin filler or replace if in critical area.';
    }

    return 'Please consult with a professional mechanic for a detailed assessment.';
}

// Reset detector
function resetDetector() {
    uploadArea.style.display = 'block';
    previewSection.style.display = 'none';
    imageInput.value = '';
    previewImage.src = '';

    // Reset analytics panel
    document.getElementById('damageType').textContent = '-';
    const severityEl = document.getElementById('severity');
    severityEl.textContent = '-';
    severityEl.classList.remove('severity-minor', 'severity-moderate', 'severity-severe');
    document.getElementById('confidence').textContent = '-';
    const statusEl = document.getElementById('status');
    statusEl.textContent = '-';
    statusEl.classList.remove('status-indeterminate', 'status-manual', 'status-confirmed');
    document.getElementById('area').textContent = '-';
    document.getElementById('recommendations').textContent = '-';
}

/* ============================
   CONTACT FORM
   ============================ */

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;

        // Validate
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Simulate sending
        const originalText = e.target.textContent;
        const submitBtn = contactForm.querySelector('.submit-btn');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
            contactForm.reset();
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }, 1500);
    });
}

/* ============================
   INITIAL PAGE SETUP
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
    // Fade in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and stat cards
    document.querySelectorAll('.feature-card, .stat-card, .category-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.5s ease';
        observer.observe(el);
    });
});

/* ============================
   UTILITY FUNCTIONS
   ============================ */

// Format large numbers
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Log analytics event (for integration with analytics service)
function trackEvent(eventName, eventData) {
    console.log(`Event: ${eventName}`, eventData);
    // TODO: Integrate with Firebase, Google Analytics, etc.
}
>>>>>>> Stashed changes
