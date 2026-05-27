// --- Global Declarations ---
const introContainer = document.getElementById('introContainer');
const mainContent = document.getElementById('mainContent');
const yesContent = document.getElementById('yesContent');

// --- 1. INTRO TO MAIN TRANSITION ---
introContainer.addEventListener('click', () => {
    // Add the exit class to trigger the center-to-top animation
    introContainer.classList.add('exit');
    
    // Make the main background and content fade in
    mainContent.classList.add('visible');

    // Completely hide the intro container from the DOM layout after animations finish
    setTimeout(() => {
        introContainer.style.display = 'none';
        // Allow the page to scroll normally if content overflows
        document.body.style.overflow = 'auto'; 
        document.documentElement.style.overflow = 'auto';
    }, 1000); // 1000ms matches the transition durations safely
});

// --- 2. DOM CONTENT LOADED (MAIN INTERACTIONS & TRAIN SETUP) ---
document.addEventListener("DOMContentLoaded", () => {
    const yesButton = document.getElementById("yes");
    const noButton = document.getElementById("no");
    
    const yesImage = document.getElementById("image-yes");
    const noImage = document.getElementById("image-no");

    const contentBox = document.querySelector('.content-box');

    // --- AUTOMATIC TRAIN IMAGES CLONING (ADDED HERE) ---
    function setupInfiniteTrain() {
        const topGroup = document.getElementById('topGroup');
        const bottomGroup = document.getElementById('bottomGroup');

        if (topGroup) {
            const cloneTop = topGroup.cloneNode(true);
            cloneTop.removeAttribute('id'); // Avoid duplicate IDs
            cloneTop.setAttribute('aria-hidden', 'true');
            topGroup.parentNode.appendChild(cloneTop);
        }

        if (bottomGroup) {
            const cloneBottom = bottomGroup.cloneNode(true);
            cloneBottom.removeAttribute('id');
            cloneBottom.setAttribute('aria-hidden', 'true');
            bottomGroup.parentNode.appendChild(cloneBottom);
        }
    }
    
    // Run the clone setup immediately so the loops are ready
    setupInfiniteTrain();


    // --- NO BUTTON DODGE MECHANICS ---
    function slideButton(e) {
        // Prevent default behavior (especially important for mobile taps)
        e.preventDefault();

        // If this is the first click, lock its current position and switch to absolute
        if (noButton.style.position !== 'absolute') {
            const currentLeft = noButton.offsetLeft;
            const currentTop = noButton.offsetTop;
            
            noButton.style.left = `${currentLeft}px`;
            noButton.style.top = `${currentTop}px`;
            noButton.style.position = 'absolute';
            
            // A tiny timeout ensures the browser registers the initial position 
            // before executing the movement slide
            setTimeout(move, 10);
        } else {
            move();
        }
    }

    function move() {
        const boxWidth = contentBox.clientWidth;
        const boxHeight = contentBox.clientHeight;

        const buttonWidth = noButton.offsetWidth;
        const buttonHeight = noButton.offsetHeight;

        const padding = 20;

        // Calculate safe boundaries inside the content box
        const maxX = boxWidth - buttonWidth - padding;
        const maxY = boxHeight - buttonHeight - padding;

        // Generate random coordinates
        const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
        const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

        // Apply new coordinates (CSS transition handles the smooth glide)
        noButton.style.left = `${randomX}px`;
        noButton.style.top = `${randomY}px`;
    }


    // --- CONFETTI EFFECT ---
    function fireConfetti() {
        // Left side burst (Moved inward to 0.2)
        confetti({
            particleCount: 100,
            spread: 70,
            scalar: 1.6, // Slightly upscaled size
            origin: { x: 0.2, y: 1 }
        });

        // Right side burst (Moved inward to 0.8)
        confetti({
            particleCount: 100,
            spread: 70,
            scalar: 1.6, // Slightly upscaled size
            origin: { x: 0.8, y: 1 }
        });
    }


    // --- YES BUTTON CLICK ACTION (TRANSITION TO POP + TRAIN RUN) ---
    yesButton.addEventListener('click', () => {
        // 1. Instantly remove the hover image at the bottom so it doesn't linger
        if (yesImage) {
            yesImage.classList.remove('active');
        }

        // 2. Hide the original main content layout
        mainContent.classList.remove('visible');
        
        // 3. Reveal the matching Yes content screen seamlessly (Pops via CSS)
        yesContent.classList.add('visible');

        // 4. Blast the upscaled confetti
        fireConfetti();

        // 5. Kickstart the marquee train loops synchronized
        const groups = yesContent.querySelectorAll('.marq-group');
        groups.forEach(group => {
            group.style.animationPlayState = 'running';
        });
    });


    // --- HOVER ACTION TRIGGERS ---
    
    // YES Hover behaviors
    yesButton.addEventListener("mouseenter", () => yesImage.classList.add("active"));
    yesButton.addEventListener("mouseleave", () => yesImage.classList.remove("active"));

    // NO Hover behaviors
    noButton.addEventListener("mouseenter", () => noImage.classList.add("active"));
    noButton.addEventListener("mouseleave", () => noImage.classList.remove("active"));
    
    // NO Click behavior
    noButton.addEventListener('click', slideButton);
});
