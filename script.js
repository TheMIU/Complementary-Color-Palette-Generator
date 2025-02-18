document.addEventListener("DOMContentLoaded", () => {
    const colorPicker = document.getElementById("colorPicker");
    const colorHex = document.getElementById("colorHex");
    const mainColorBox = document.getElementById("mainColor");
    const complementaryColorBox = document.getElementById("complementaryColor");
    const mainColorHex = document.getElementById("mainColorHex");
    const complementaryColorHex = document.getElementById("complementaryColorHex");

    const mainShadesContainer = document.getElementById("mainShades");
    const compShadesContainer = document.getElementById("compShades");

    function hexToRgb(hex) {
        hex = hex.replace("#", "");
        if (hex.length !== 6) return null;
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        return { r, g, b };
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    function getComplementaryColor(hex) {
        let rgb = hexToRgb(hex);
        if (!rgb) return "#000000";
        return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
    }

    function generateShadesTints(hex) {
        let rgb = hexToRgb(hex);
        if (!rgb) return [];

        let shades = [], tints = [];
        for (let i = 1; i <= 3; i++) {
            let factor = i * 0.2;
            shades.push(rgbToHex(
                Math.max(0, rgb.r * (1 - factor)),
                Math.max(0, rgb.g * (1 - factor)),
                Math.max(0, rgb.b * (1 - factor))
            ));
            tints.push(rgbToHex(
                Math.min(255, rgb.r + (255 - rgb.r) * factor),
                Math.min(255, rgb.g + (255 - rgb.g) * factor),
                Math.min(255, rgb.b + (255 - rgb.b) * factor)
            ));
        }
        return [...tints, hex, ...shades]; 
    }

    function updateColors(hex) {
        if (!hexToRgb(hex)) return;

        colorPicker.value = hex;
        colorHex.value = hex;
        mainColorBox.style.backgroundColor = hex;
        mainColorHex.textContent = hex;

        let complementary = getComplementaryColor(hex);
        complementaryColorBox.style.backgroundColor = complementary;
        complementaryColorHex.textContent = complementary;

        renderShades(mainShadesContainer, hex);
        renderShades(compShadesContainer, complementary);
    }

    function renderShades(container, hex) {
        container.innerHTML = "";
        let colors = generateShadesTints(hex);
        let shadesContainer = document.createElement("div");
        shadesContainer.classList.add("shades-container");

        colors.forEach(color => {
            let div = document.createElement("div");
            div.classList.add("shade");
            div.style.backgroundColor = color;
            div.innerHTML = `<span>${color}</span>`;
            div.onclick = () => {
                navigator.clipboard.writeText(color);
                alert("Copied: " + color);
            };
            shadesContainer.appendChild(div);
        });

        container.appendChild(shadesContainer);
    }

    // Listen for changes
    colorPicker.addEventListener("input", (e) => updateColors(e.target.value));
    colorHex.addEventListener("input", (e) => {
        if (e.target.value.length === 7) {
            updateColors(e.target.value);
        }
    });
    colorHex.addEventListener("change", (e) => updateColors(e.target.value));

    updateColors("#0099ff");
});


document.getElementById("exportBtn").addEventListener("click", () => {
    const paletteContainer = document.getElementById("paletteContainer");
    
    html2canvas(paletteContainer, {
        backgroundColor: "#fff" 
    }).then(canvas => {
        let link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "color_palette.png";
        link.click();
    });
});

/* document.getElementById("exportSVGBtn").addEventListener("click", () => {
    const mainColorHex = document.getElementById("mainColorHex").innerText;
    const complementaryColorHex = document.getElementById("complementaryColorHex").innerText;

    // SVG template structure
    const svgContent = `
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="180" height="50" fill="${mainColorHex}" />
            <text x="20" y="40" font-size="18" fill="white">${mainColorHex}</text>
            <rect x="10" y="80" width="180" height="50" fill="${complementaryColorHex}" />
            <text x="20" y="110" font-size="18" fill="white">${complementaryColorHex}</text>
        </svg>
    `;

    // Create a Blob and download it as SVG
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "color_palette.svg";
    link.click();
});
 */