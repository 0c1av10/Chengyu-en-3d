const acts = [
    {
        text: "Acto 1: Granjero trabajando diligentemente\n\nUn agricultor trabajaba duro cada día en sus campos.",
        elements: {
            farmer: true,
            rabbit: false
        }
    },
    {
        text: "Acto 2: Evento inesperado\n\nUn conejo corrió hacia el tocón y murió accidentalmente.",
        elements: {
            farmer: false,
            rabbit: true
        }
    }
];

let currentAct = 0;

document.querySelector('a-scene').addEventListener('loaded', () => {
    setupEventListeners();
    updateScene();
});

function setupEventListeners() {
    document.querySelector('#next-btn').addEventListener('click', nextAct);
}

function updateScene() {
    const act = acts[currentAct];
    
    // Actualizar texto
    document.querySelector('#story-text').setAttribute('value', act.text);
    
    // Controlar elementos
    document.querySelector('#farmer').setAttribute('visible', act.elements.farmer);
    document.querySelector('#rabbit').setAttribute('visible', act.elements.rabbit);
}

function nextAct() {
    if(currentAct < acts.length - 1) {
        currentAct++;
        updateScene();
    }
}

