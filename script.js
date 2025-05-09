// script.js — updated: reading response no longer auto-redirects

const paletteColors = [
  { name: "HTML/CSS", color: "#C94E98", icon: "🌐" },
  { name: "JavaScript", color: "#9969CC", icon: "👨‍💻" },
  { name: "p5.js", color: "#63d5ce", icon: "🌍" },
  { name: "Reading Response", color: "#6DC68D", icon: "📖" }
];

const detailedProjects = [
  {
    id: "homepage",
    name: "Nick & Judy",
    formula: ["HTML/CSS"],
    color: "#C94E98",
    icon: "🐰",
    link: "nick&judy.html",
    category: "HTML/CSS"
  },
  {
    id: "RecreateImage",
    name: "Recreatation of A Scene",
    formula: ["HTML/CSS"],
    color: "#C94E10",
    icon: "💿",
    link: "recreation.html",
    category: "HTML/CSS"
  },
  {
    id: "SpaceExploration",
    name: "Rachel's Space",
    formula: ["JavaScript"],
    color: "#9969CC",
    icon: "🛰️",
    link: "rachel's space.html",
    category: "JavaScript"
  },
  {
    id: "ClicktoMakeDecesion",
    name: "Decide My Day!",
    formula: ["JavaScript"],
    color: "#582192",
    icon: "🤷",
    link: "decidemyday.html",
    category: "JavaScript"
  },
  {
    id: "IFTTT",
    name: "Rainy Day Protocol",
    formula: ["JavaScript"],
    color: "#b52c29",
    icon: "📱",
    link: "rainydayprotocol.html",
    category: "JavaScript"
  },
  {
    id: "Loop",
    name: "Looooping",
    formula: ["JavaScript"],
    color: "#6bd563",
    icon: "➿",
    link: "looping.html",
    category: "JavaScript"
  },
  {
    id: "TimeMachine",
    name: "CandyCountDown",
    formula: ["p5.js"],
    color: "#63d5ce",
    icon: "🍬",
    link: "candycountdown.html",
    category: "p5.js"
  },
  {
    id: "reading-visual",
    name: "ReadResponses",
    formula: ["Reading Response"],
    color: "#6DC68D",
    icon: "📖",
    link: "reading-response.html",
    category: "Reading Response"
  }
];

let palette = [];
let demoMode = true;
let demoTimeout;

const catContainer = document.getElementById('categories');
const projContainer = document.getElementById('projects');
const demoOverlay = document.getElementById('demo-overlay');
const demoText = document.getElementById('demo-text');
const skipButton = document.getElementById('skip-demo');

const paletteDiv = document.createElement('section');
paletteDiv.id = 'palette';
paletteDiv.innerHTML = '<div class="palette-container"></div><div id="unlock-status"></div>';
paletteDiv.style.display = 'flex';
paletteDiv.style.flexDirection = 'column';
paletteDiv.style.justifyContent = 'center';
paletteDiv.style.alignItems = 'center';
paletteDiv.style.padding = '2rem 0';
document.body.insertBefore(paletteDiv, projContainer);

const paletteContainer = document.querySelector('.palette-container');
const unlockStatus = document.getElementById('unlock-status');

paletteColors.forEach(p => {
  const bubble = document.createElement('div');
  bubble.className = 'color-bubble';
  bubble.style.backgroundColor = p.color;
  bubble.innerHTML = `<span class="icon">${p.icon}</span><span>${p.name}</span>`;
  bubble.onclick = () => {
    if (!demoMode) addToPalette(p);
  };
  catContainer.appendChild(bubble);
});

function addToPalette(p) {
  if (palette.length < 2 && !palette.includes(p)) {
    palette.push(p);
  } else if (palette.length === 2) {
    palette = [p];
  }
  renderPalette();
  renderProjectList();
}

function renderPalette() {
  paletteContainer.innerHTML = '';
  palette.forEach((c, i) => {
    const swatch = document.createElement('div');
    swatch.className = `color-bubble bubble-${i}`;
    swatch.style.backgroundColor = c.color;
    swatch.innerHTML = `<span class="icon">${c.icon}</span>`;
    paletteContainer.appendChild(swatch);
  });

  const unlocked = detailedProjects.filter(p =>
    p.formula.every(f => palette.some(pc => pc.name.includes(f)))
  );
  unlockStatus.innerHTML = `<p>🔓 Unlocked ${unlocked.length} / ${detailedProjects.length} projects</p>`;
}

function renderProjectList() {
  let listSection = document.getElementById('project-list');
  if (!listSection) {
    listSection = document.createElement('section');
    listSection.id = 'project-list';
    listSection.innerHTML = '<h2>Project Lists</h2><div class="category-group"></div>';
    document.body.appendChild(listSection);
  }
  const group = listSection.querySelector('.category-group');
  group.innerHTML = '';

  const grouped = {};
  detailedProjects.forEach(p => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  Object.entries(grouped).forEach(([category, projects]) => {
    const block = document.createElement('div');
    block.className = 'category-block';
    const title = document.createElement('h3');
    title.textContent = category;
    block.appendChild(title);

    const row = document.createElement('div');
    row.className = 'bubble-row';

    projects.forEach(p => {
      const isUnlocked = p.formula.every(f => palette.some(pc => pc.name.includes(f)));
      const circle = document.createElement('div');
      circle.className = 'project-circle';
      circle.style.backgroundColor = isUnlocked ? p.color : '#bbb';
      circle.innerHTML = `<span class="icon">${p.icon}</span>`;
      if (isUnlocked) {
        circle.style.cursor = 'pointer';
        circle.onclick = () => window.open(p.link, '_blank');
      }
      row.appendChild(circle);
    });

    block.appendChild(row);
    group.appendChild(block);
  });
}

function runDemoStep() {
  const pair = [paletteColors[0], paletteColors[2]];
  palette = [];
  renderPalette();
  demoText.textContent = `Start Clicking! ${pair[0].name} → Palette`;

  simulateDrag(pair[0], () => {
    palette.push(pair[0]);
    renderPalette();
    demoText.textContent = `Click ${pair[1].name} → Palette`;

    setTimeout(() => {
      simulateDrag(pair[1], () => {
        palette.push(pair[1]);
        renderPalette();
        renderProjectList();
        demoText.textContent = `Now Your Turn!`;
        demoTimeout = setTimeout(() => {
          if (demoMode) {
            palette = [];
            renderPalette();
            demoText.textContent = `Click the genres that interests you!`;
          }
        }, 3000);
      });
    }, 1000);
  });
}

function simulateDrag(colorObj, callback) {
  const bubble = [...document.querySelectorAll('.color-bubble')].find(b =>
    b.textContent.includes(colorObj.name)
  );
  if (!bubble) return;

  const ghost = bubble.cloneNode(true);
  ghost.style.position = 'absolute';
  ghost.style.left = bubble.getBoundingClientRect().left + 'px';
  ghost.style.top = bubble.getBoundingClientRect().top + 'px';
  ghost.style.zIndex = 999;
  document.body.appendChild(ghost);

  const paletteRect = paletteContainer.getBoundingClientRect();
  const destX = paletteRect.left + 50;
  const destY = paletteRect.top + 20;

  ghost.animate([
    { transform: 'translate(0, 0)' },
    { transform: `translate(${destX - bubble.getBoundingClientRect().left}px, ${destY - bubble.getBoundingClientRect().top}px)` }
  ], {
    duration: 1000,
    easing: 'ease-in-out'
  }).onfinish = () => {
    ghost.remove();
    callback();
  };
}

skipButton.onclick = () => {
  demoMode = false;
  clearTimeout(demoTimeout);
  demoOverlay.style.display = 'none';
  palette = [];
  renderPalette();
  renderProjectList();
};

renderPalette();
renderProjectList();
runDemoStep();
