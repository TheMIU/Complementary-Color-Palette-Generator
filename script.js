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
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function getComplementaryColor(hex) {
    let { r, g, b } = hexToRgb(hex);
    return rgbToHex(255 - r, 255 - g, 255 - b);
}

function generateShadesTints(hex) {
    let { r, g, b } = hexToRgb(hex);
    let shades = [];
    let tints = [];

    for (let i = 1; i <= 3; i++) {
        let factor = i * 0.2;
        shades.push(rgbToHex(Math.max(0, r * (1 - factor)), Math.max(0, g * (1 - factor)), Math.max(0, b * (1 - factor))));
        tints.push(rgbToHex(Math.min(255, r + (255 - r) * factor), Math.min(255, g + (255 - g) * factor), Math.min(255, b + (255 - b) * factor)));
    }
    return [...tints, ...shades]; // Returns 3 tints + 3 shades
}

function updateColors(hex) {
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
    const colors = generateShadesTints(hex);
    const shadesContainer = document.createElement("div");
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

colorPicker.addEventListener("input", (e) => updateColors(e.target.value));
colorHex.addEventListener("input", (e) => updateColors(e.target.value));

updateColors("#3498db"); // Default color
