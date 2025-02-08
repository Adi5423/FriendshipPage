document.addEventListener("DOMContentLoaded", function () {
    /* ---------- CONFIGURATION TO ENABLE/DISABLE ENTRY PAGE ---------- */
    const ENTRY_PAGE_ENABLED = false; // Set to false to skip the entry page

    /* ---------- DOM ELEMENTS ---------- */
    const splashOverlay = document.getElementById("splash-overlay");
    const lightbulb = document.getElementById("lightbulb");
    const handleContainer = document.getElementById("handle-container");
    const handleKnob = document.getElementById("handle-knob");
    const container = document.getElementById("tiles-container");

    /* ---------- MAIN LANDING PAGE (TILES) ---------- */
    const letters = ["A", "B", "C", "D", "E"];
    let tiles = [];

    function createTiles() {
        // Clear existing tiles (if any)
        container.innerHTML = "";
        tiles = []; // Reset tiles array
        
        // Generate tiles dynamically in FIFO order
        for (let i = 0; i < letters.length; i++) {
            let tile = document.createElement("div");
            tile.classList.add("tile");
            tile.textContent = letters[i];
            // Assign a z-index so that the first tile gets the highest value
            tile.style.zIndex = letters.length - i; // A gets highest z-index
            container.appendChild(tile);
            tiles.push(tile);
        }
    }    


    if (!ENTRY_PAGE_ENABLED) {
        /* ---------- SKIP ENTRY PAGE ---------- */
        // If entry page is disabled, hide splash elements and show the landing page immediately
        splashOverlay.style.display = "none";
        lightbulb.style.display = "none";
        handleContainer.style.display = "none";
    } else {
        /* ---------- ENTRY PAGE FLOW ---------- */
        // Initially, the lightbulb is visible, and the handle is hidden.
        lightbulb.addEventListener("click", () => {
            lightbulb.style.opacity = "0";
            setTimeout(() => {
                lightbulb.style.display = "none";
                handleContainer.style.display = "flex"; // Show handle
            }, 500);
        });

        /* ---------- DRAG-TO-REVEAL LOGIC ---------- */
        let isDragging = false;
        let startY = 0;
        let currentTranslateY = 0;

        handleKnob.addEventListener("mousedown", (e) => {
            isDragging = true;
            startY = e.clientY;
            handleKnob.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            let deltaY = e.clientY - startY;
            if (deltaY < 0) deltaY = 0; // Prevent upward dragging
            currentTranslateY = deltaY;
            splashOverlay.style.transform = `translateY(${currentTranslateY}px)`;
        });

        document.addEventListener("mouseup", () => {
            if (!isDragging) return;
            isDragging = false;
            handleKnob.style.cursor = "grab";
            const vh = window.innerHeight;

            if (currentTranslateY > vh / 2) {
                // If dragged more than half the screen, slide the overlay off
                splashOverlay.style.transition = "transform 0.5s ease";
                splashOverlay.style.transform = `translateY(${vh}px)`;
                setTimeout(() => {
                    splashOverlay.style.display = "none";
                }, 500);
            } else {
                // Otherwise, revert back to full screen
                splashOverlay.style.transition = "transform 0.5s ease";
                splashOverlay.style.transform = "translateY(0)";
                setTimeout(() => {
                    splashOverlay.style.transition = "";
                }, 500);
            }
        });
    }

    /* ---------- REMOVE TILES USING RIGHT ARROW KEY ---------- */
    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight" && tiles.length > 0) {
            let topTile = tiles.shift(); // Remove first tile instead of last
            topTile.style.opacity = "0";
            topTile.style.transform =
                "translateX(50%) translateY(-50%) translateZ(-50px) rotateY(20deg)";
            setTimeout(() => {
                container.removeChild(topTile);
            }, 500);
        }
    });

    /* ---------- INITIALIZE TILES ---------- */
    createTiles(); // Ensure tiles are always present regardless of ENTRY_PAGE_ENABLED
});