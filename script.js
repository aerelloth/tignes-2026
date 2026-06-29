const segments = [
    { label: "La vraie histoire", url: "pages/histoire.html", weight: 50, color: "#fde68a" },
    { label: "Météo sur place", url: "pages/meteo.html", weight: 15, color: "#fdba74" },
    { label: "Fortune cookie", url: "pages/fortune.html", weight: 10, color: "#fbcfe8" },
    { label: "Spoiler chanson", url: "pages/spoiler.html", weight: 10, color: "#c4b5fd" },
    { label: "Rick Roll", url: "pages/rickroll.html", weight: 15, color: "#99f6e4" },
    { label: "Les nudes exclusifs", url: "pages/nudes.html", weight: 0, color: "#bfdbfe" }
];

const wheel = document.querySelector("#wheel");
const button = document.querySelector("#spinButton");
const status = document.querySelector("#status");
const oddsList = document.querySelector("#oddsList");

let currentRotation = 0;
const segmentAngle = 360 / segments.length;

function buildWheel() {
    const gradientParts = segments.map((segment, index) => {
        const start = index * segmentAngle;
        const end = (index + 1) * segmentAngle;
        return `${segment.color} ${start}deg ${end}deg`;
    });

    wheel.style.background = `conic-gradient(from -90deg, ${gradientParts.join(", ")})`;

    segments.forEach((segment, index) => {
        const label = document.createElement("div");
        label.className = "segment-label";
        label.textContent = segment.label;

        const middleAngle = index * segmentAngle + segmentAngle / 2;
        label.style.transform = `rotate(${middleAngle}deg) translateY(-50%)`;

        if (middleAngle > 90 && middleAngle < 270) {
            label.style.paddingLeft = "0";
            label.style.paddingRight = "16%";
            label.style.transform = `rotate(${middleAngle + 180}deg) translateX(-100%) translateY(-50%)`;
        }

        wheel.appendChild(label);
    });

    const totalWeight = segments.reduce((sum, segment) => sum + segment.weight, 0);
    segments.forEach(segment => {
        const item = document.createElement("li");
        const percent = totalWeight ? Math.round((segment.weight / totalWeight) * 100) : 0;
        item.textContent = `${segment.label} : ${percent}%${segment.weight === 0 ? " — impossible à tirer" : ""}`;
        oddsList.appendChild(item);
    });
}

function pickWeightedSegment() {
    const candidates = segments.filter(segment => segment.weight > 0);
    const totalWeight = candidates.reduce((sum, segment) => sum + segment.weight, 0);
    let random = Math.random() * totalWeight;

    for (const segment of candidates) {
        random -= segment.weight;
        if (random <= 0) return segment;
    }

    return candidates[candidates.length - 1];
}

function spin() {
    spinButton.disabled = true;
    spinButton.classList.add("hidden");

    const selected = getRandomSegment();
    const selectedIndex = segments.indexOf(selected);

    const segmentAngle = 360 / segments.length;

    // Centre du segment dans la roue, avec le même repère que conic-gradient(from -90deg)
    const selectedCenterAngle = selectedIndex * segmentAngle + segmentAngle / 2;

    // Petit hasard pour ne pas toujours tomber pile au centre
    const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.5;

    // Comme la flèche est en haut, et que la roue tourne dans le sens horaire :
    const finalAngle = 360 - selectedCenterAngle + randomOffset;

    const fullTurns = 6 + Math.floor(Math.random() * 3);

    currentRotation = fullTurns * 360 + finalAngle;

    wheel.style.transform = `rotate(${currentRotation}deg)`;

    resultText.textContent = `Résultat : ${selected.label}`;

    setTimeout(() => {
        window.location.href = selected.url;
    }, 4200);
}

buildWheel();
button.addEventListener("click", spin);