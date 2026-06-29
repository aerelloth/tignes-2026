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

function normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
}

function spin() {
    const selected = pickWeightedSegment();
    const selectedIndex = segments.indexOf(selected);

    button.disabled = true;
    button.hidden = true;
    status.textContent = "La roue tourne... verdict imminent 👀";

    const selectedMiddleAngle = selectedIndex * segmentAngle + segmentAngle / 2;
    const randomFineTuning = (Math.random() - 0.5) * (segmentAngle * 0.2);
    
    // À ajuster si la flèche est décalée visuellement.
    // 0 = flèche en haut avec conic-gradient(from -90deg)
    const pointerOffset = -120 + segmentAngle / 2;

    const desiredModulo = normalizeAngle(
        pointerOffset - selectedMiddleAngle + randomFineTuning
    );

    const currentModulo = normalizeAngle(currentRotation);
    const deltaToTarget = normalizeAngle(desiredModulo - currentModulo);

    const fullTurns = 6 + Math.floor(Math.random() * 4);

    currentRotation += fullTurns * 360 + deltaToTarget;

    wheel.style.transform = `rotate(${currentRotation}deg)`;

    window.setTimeout(() => {
        status.textContent = `Résultat : ${selected.label}. Redirection...`;
    }, 4200);

    window.setTimeout(() => {
        window.location.href = selected.url;
    }, 5200);
}

buildWheel();
button.addEventListener("click", spin);