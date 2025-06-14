// Variables globales del sistema
let currentAct = 0;
const totalActs = 4;
let isAnimating = false;

// Configuracion de los actos del chengyu (SIN ACENTOS)
const storyActs = [
    {
        title: "ACTO 1 DE 4",
        content: "Un granjero trabajaba diligentemente en sus campos cada dia.&#10;Con esfuerzo constante mantenia prosperas sus tierras.&#10;&#10;Un dia, mientras trabajaba, algo inesperado sucedio...",
        showElements: ['farmer', 'farm-area', 'rabbit'],
        hideElements: ['dead-rabbit', 'weeds'],
        animations: ['farmerWorking']
    },
    {
        title: "ACTO 2 DE 4", 
        content: "Un conejo corrio directamente hacia el tocon y murio!&#10;El granjero se emociono por esta suerte inesperada.&#10;&#10;Decidio abandonar su trabajo y esperar junto al tocon&#10;esperando que mas conejos hicieran lo mismo.",
        showElements: ['dead-rabbit'],
        hideElements: ['rabbit'],
        animations: ['rabbitRun', 'showDeadRabbit']
    },
    {
        title: "ACTO 3 DE 4",
        content: "Dia tras dia, el granjero esperaba junto al tocon.&#10;Mientras tanto, sus campos se llenaron de maleza.&#10;&#10;Las plantas que habia cultivado con tanto esfuerzo&#10;se arruinaron por falta de cuidado y atencion.",
        showElements: ['weeds'],
        hideElements: [],
        animations: ['growWeeds', 'farmerSitting']
    },
    {
        title: "ACTO 4 DE 4",
        content: "Nunca llegaron mas conejos al tocon.&#10;El granjero perdio toda su cosecha por abandonar&#10;el trabajo duro y depender de la suerte.&#10;&#10;MORALEJA: 守株待兔&#10;No confies en golpes de suerte casuales.&#10;El exito viene del esfuerzo constante.",
        showElements: ['weeds'],
        hideElements: [],
        animations: ['finalView']
    }
];

// Inicializacion cuando la escena esta lista
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando aplicacion del Chengyu');
    
    const scene = document.querySelector('a-scene');
    
    if (scene.hasLoaded) {
        initializeApp();
    } else {
        scene.addEventListener('loaded', initializeApp);
    }
});

function initializeApp() {
    console.log('Inicializando sistema del chengyu');
    
    setupEventListeners();
    displayCurrentAct();
}

function setupEventListeners() {
    const continueBtn = document.querySelector('#continue-btn');
    const restartBtn = document.querySelector('#restart-btn');
    
    if (continueBtn) {
        continueBtn.addEventListener('click', nextAct);
        continueBtn.addEventListener('mouseenter', function() {
            this.setAttribute('animation__hover', {
                property: 'scale',
                to: '1.1 1.1 1.1',
                dur: 200
            });
        });
        continueBtn.addEventListener('mouseleave', function() {
            this.setAttribute('animation__unhover', {
                property: 'scale', 
                to: '1 1 1',
                dur: 200
            });
        });
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', restartStory);
        restartBtn.addEventListener('mouseenter', function() {
            this.setAttribute('animation__hover', {
                property: 'scale',
                to: '1.1 1.1 1.1', 
                dur: 200
            });
        });
        restartBtn.addEventListener('mouseleave', function() {
            this.setAttribute('animation__unhover', {
                property: 'scale',
                to: '1 1 1',
                dur: 200
            });
        });
    }
    
    // Eventos VR
    const scene = document.querySelector('a-scene');
    if (scene) {
        scene.addEventListener('enter-vr', function() {
            console.log('Entrando en modo VR');
        });
        
        scene.addEventListener('exit-vr', function() {
            console.log('Saliendo del modo VR');
        });
    }
    
    console.log('Event listeners configurados');
}

function nextAct() {
    if (isAnimating) return;
    
    console.log('Avanzando al siguiente acto');
    
    if (currentAct < totalActs - 1) {
        currentAct++;
        displayCurrentAct();
    }
}

function restartStory() {
    if (isAnimating) return;
    
    console.log('Reiniciando historia');
    
    currentAct = 0;
    resetScene();
    displayCurrentAct();
}

function displayCurrentAct() {
    if (isAnimating) return;
    
    isAnimating = true;
    const act = storyActs[currentAct];
    
    console.log('Mostrando ' + act.title);
    
    // Actualizar textos
    updateUI(act);
    
    // NO HAY CAMBIOS DE CAMARA - SE MANTIENE FIJA
    
    // Mostrar/ocultar elementos
    updateSceneElements(act);
    
    // Ejecutar animaciones especificas
    if (act.animations) {
        executeAnimations(act.animations);
    }
    
    // Mostrar boton apropiado
    updateButtons(currentAct === totalActs - 1);
    
    setTimeout(() => {
        isAnimating = false;
    }, 1000);
}

function updateUI(act) {
    const actNumber = document.querySelector('#act-number');
    const storyContent = document.querySelector('#story-content');
    const progressBar = document.querySelector('#progress-bar');
    
    if (actNumber) {
        actNumber.setAttribute('value', act.title);
    }
    
    if (storyContent) {
        storyContent.setAttribute('value', act.content);
    }
    
    // Actualizar barra de progreso
    if (progressBar) {
        const progressWidth = ((currentAct + 1) / totalActs) * 6;
        progressBar.setAttribute('animation__progress', {
            property: 'width',
            to: progressWidth,
            dur: 800,
            easing: 'easeOutQuart'
        });
    }
}

// CAMARA FIJA - NO SE LLAMA ESTA FUNCION
function updateCamera() {
    // FUNCION REMOVIDA - LA CAMARA PERMANECE FIJA
    console.log('Camara permanece fija en posicion original');
}

function updateSceneElements(act) {
    // Mostrar elementos especificos
    if (act.showElements) {
        act.showElements.forEach(elementId => {
            const element = document.querySelector('#' + elementId);
            if (element) {
                element.setAttribute('visible', true);
            }
        });
    }
    
    // Ocultar elementos especificos
    if (act.hideElements) {
        act.hideElements.forEach(elementId => {
            const element = document.querySelector('#' + elementId);
            if (element) {
                element.setAttribute('visible', false);
            }
        });
    }
}

function executeAnimations(animations) {
    animations.forEach(animationName => {
        switch(animationName) {
            case 'farmerWorking':
                animateFarmerWorking();
                break;
            case 'rabbitRun':
                animateRabbitRun();
                break;
            case 'showDeadRabbit':
                showDeadRabbit();
                break;
            case 'growWeeds':
                animateWeedsGrowth();
                break;
            case 'farmerSitting':
                animateFarmerSitting();
                break;
            case 'finalView':
                showFinalView();
                break;
        }
    });
}

function animateFarmerWorking() {
    const tool = document.querySelector('#tool');
    if (tool) {
        tool.setAttribute('animation__work', {
            property: 'rotation',
            from: '0 0 45',
            to: '0 0 -15',
            dur: 1500,
            easing: 'easeInOutSine',
            loop: true,
            dir: 'alternate'
        });
    }
}

function animateRabbitRun() {
    const rabbit = document.querySelector('#rabbit');
    if (rabbit) {
        rabbit.setAttribute('animation__run', {
            property: 'position',
            to: '6.5 0.2 -2',
            dur: 3000,
            easing: 'easeInQuad'
        });
        
        setTimeout(() => {
            rabbit.setAttribute('visible', false);
        }, 3000);
    }
}

function showDeadRabbit() {
    setTimeout(() => {
        const deadRabbit = document.querySelector('#dead-rabbit');
        if (deadRabbit) {
            deadRabbit.setAttribute('visible', true);
        }
    }, 3200);
}

function animateWeedsGrowth() {
    const weeds = document.querySelector('#weeds');
    if (weeds) {
        weeds.setAttribute('visible', true);
        weeds.setAttribute('animation__grow', {
            property: 'scale',
            from: '0.1 0.1 0.1',
            to: '1 1 1',
            dur: 3000,
            easing: 'easeOutQuart'
        });
    }
}

function animateFarmerSitting() {
    const farmer = document.querySelector('#farmer');
    if (farmer) {
        farmer.setAttribute('animation__move', {
            property: 'position',
            to: '5 0 -1',
            dur: 3000,
            easing: 'easeInOutQuart'
        });
        
        farmer.setAttribute('animation__turn', {
            property: 'rotation',
            to: '0 45 0',
            dur: 2000,
            easing: 'easeInOutQuart'
        });
        
        // Detener animacion de trabajo
        const tool = document.querySelector('#tool');
        if (tool) {
            tool.removeAttribute('animation__work');
            tool.setAttribute('rotation', '0 0 45');
        }
    }
}

function showFinalView() {
    console.log('Mostrando vista final con moraleja');
}

function updateButtons(isLastAct) {
    const continueBtn = document.querySelector('#continue-btn');
    const restartBtn = document.querySelector('#restart-btn');
    
    if (isLastAct) {
        if (continueBtn) continueBtn.setAttribute('visible', false);
        if (restartBtn) restartBtn.setAttribute('visible', true);
    } else {
        if (continueBtn) continueBtn.setAttribute('visible', true);
        if (restartBtn) restartBtn.setAttribute('visible', false);
    }
}

function resetScene() {
    // Resetear elementos visuales
    const elementsToHide = ['dead-rabbit', 'weeds'];
    elementsToHide.forEach(elementId => {
        const element = document.querySelector('#' + elementId);
        if (element) {
            element.setAttribute('visible', false);
            element.removeAttribute('animation__grow');
            element.setAttribute('scale', '1 1 1');
        }
    });
    
    // Mostrar elementos iniciales
    const elementsToShow = ['rabbit', 'farmer', 'farm-area'];
    elementsToShow.forEach(elementId => {
        const element = document.querySelector('#' + elementId);
        if (element) {
            element.setAttribute('visible', true);
        }
    });
    
    // Resetear posiciones
    const rabbit = document.querySelector('#rabbit');
    if (rabbit) {
        rabbit.setAttribute('position', '15 0.2 -2');
        rabbit.removeAttribute('animation__run');
    }
    
    const farmer = document.querySelector('#farmer');
    if (farmer) {
        farmer.setAttribute('position', '-8 0 -2');
        farmer.setAttribute('rotation', '0 0 0');
        farmer.removeAttribute('animation__move');
        farmer.removeAttribute('animation__turn');
    }
    
    // Resetear herramienta de trabajo
    const tool = document.querySelector('#tool');
    if (tool) {
        tool.removeAttribute('animation__work');
        tool.setAttribute('rotation', '0 0 45');
    }
    
    // Resetear barra de progreso
    const progressBar = document.querySelector('#progress-bar');
    if (progressBar) {
        progressBar.setAttribute('width', '1.5');
    }
    
    console.log('Escena reseteada correctamente');
}

console.log('Sistema completo del chengyu inicializado correctamente');
