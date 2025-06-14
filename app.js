const storyData = [
    {
        text: "Acto 1/4\n\nUn granjero trabajaba diligentemente en sus campos. Cada día cultivaba con dedicación, manteniendo sus tierras prósperas.",
        elements: { farmer: true, rabbit: true, tree: false },
        animation: () => animateFarmerWorking(true)
    },
    {
        text: "Acto 2/4\n\nUn día, un conejo corrió hacia el tocón y murió. El granjero, emocionado, abandonó su trabajo para esperar más conejos.",
        elements: { farmer: false, rabbit: false, tree: true },
        animation: () => animateRabbitImpact()
    },
    {
        text: "Acto 3/4\n\nLos campos se llenaron de maleza mientras el granjero esperaba en vano. La negligencia destruyó sus cosechas.",
        elements: { weeds: true },
        animation: () => animateWeedsGrowth()
    },
    {
        text: "Acto 4/4\n\nMoraleja: 守株待兔\nEl éxito viene del esfuerzo constante, no de depender de la suerte casual. 淮南子, siglo II a.C.",
        elements: { all: false },
        animation: () => showFinalMoral()
    }
];

let currentAct = 0;

document.querySelector('a-scene').addEventListener('loaded', () => {
    setupEventListeners();
    updateScene();
});

function setupEventListeners() {
    document.querySelector('#next-btn').addEventListener('click', nextAct);
    document.querySelector('a-scene').addEventListener('touchstart', handleTouch);
    document.querySelector('a-scene').addEventListener('enter-vr', () => {
        document.querySelector('.vr-notice').style.display = 'block';
    });
}

function updateScene() {
    const act = storyData[currentAct];
    
    // Actualizar texto
    document.querySelector('#story-text').setAttribute('value', act.text);
    
    // Actualizar progreso
    document.querySelector('#progress-fill').setAttribute('width', (currentAct / 3) * 2);
    
    // Controlar visibilidad de elementos
    document.querySelectorAll('[class^="act"]').forEach(el => el.setAttribute('visible', false));
    document.querySelector(`.act${currentAct + 1}`)?.setAttribute('visible', true);
    
    // Ejecutar animación
    act.animation();
}

function nextAct() {
    if(currentAct < 3) {
        currentAct++;
        updateScene();
    }
}

function animateFarmerWorking(start) {
    const farmer = document.querySelector('#farmer');
    if(start) {
        farmer.setAttribute('animation', {
            property: 'rotation',
            to: '0 360 0',
            loop: true,
            dur: 10000
        });
    } else {
        farmer.removeAttribute('animation');
    }
}

function animateRabbitImpact() {
    const rabbit = document.querySelector('#rabbit');
    rabbit.setAttribute('animation', {
        property: 'position',
        to: '5 0 0',
        dur: 2000,
        easing: 'easeInQuad'
    });
}

// Funciones restantes de animación y control táctil...

