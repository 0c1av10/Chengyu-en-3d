// Variables globales
let currentAct = 0;
const totalActs = 4;

// Datos de los actos
const storyActs = [
    {
        title: "ACTO 1 DE 4",
        text: "En los campos de la antigua China, vivía un granjero muy trabajador.&#10;&#10;Cada día, desde el amanecer hasta el atardecer, cultivaba sus tierras&#10;con dedicación y esfuerzo constante. Sus campos eran prósperos&#10;gracias a su trabajo duro y planificación cuidadosa.&#10;&#10;Un día, mientras trabajaba, vio algo inesperado...",
        cameraPosition: "0 1.7 6",
        showElements: ['farmer', 'farm-field'],
        hideElements: ['dead-rabbit', 'weeds']
    },
    {
        title: "ACTO 2 DE 4",
        text: "¡Un conejo corrió directamente hacia un tocón de árbol y murió!&#10;&#10;El granjero se emocionó mucho por esta buena suerte inesperada.&#10;'¡Qué fácil fue obtener carne sin esfuerzo!' pensó.&#10;&#10;Decidió abandonar su trabajo en los campos y sentarse&#10;junto al tocón, esperando que más conejos vinieran&#10;y se mataran de la misma manera.",
        cameraPosition: "4 2.5 -1",
        showElements: ['dead-rabbit'],
        hideElements: ['rabbit']
    },
    {
        title: "ACTO 3 DE 4",
        text: "Día tras día, el granjero se sentaba junto al tocón esperando.&#10;&#10;Mientras él esperaba más conejos, sus campos comenzaron&#10;a llenarse de maleza. Las plantas que había cultivado&#10;con tanto esfuerzo se arruinaron por falta de cuidado.&#10;&#10;Pero el granjero siguió esperando, confiando en que&#10;la suerte le traería más conejos sin esfuerzo...",
        cameraPosition: "-6 3.5 -2",
        showElements: ['weeds'],
        hideElements: []
    },
    {
        title: "ACTO 4 DE 4",
        text: "Nunca llegaron más conejos al tocón.&#10;&#10;El granjero perdió toda su cosecha por abandonar el trabajo duro&#10;y depender únicamente de la suerte. Sus campos prósperos&#10;se convirtieron en terrenos baldíos llenos de maleza.&#10;&#10;MORALEJA DEL CHENGYU:&#10;'No confíes en golpes de suerte casuales.&#10;El éxito verdadero viene del esfuerzo constante&#10;y la planificación cuidadosa.'",
        cameraPosition: "0 5 0",
        showElements: ['weeds'],
        hideElements: []
    }
];

// Inicialización cuando la escena está lista
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que A-Frame esté completamente cargado
    const scene = document.querySelector('a-scene');
    
    if (scene.hasLoaded) {
        initializeStory();
    } else {
        scene.addEventListener('loaded', initializeStory);
    }
});

function initializeStory() {
    console.log('🎬 Inicializando historia del chengyu');
    
    // Configurar eventos de click
    setupClickEvents();
    
    // Mostrar primer acto
    displayAct(0);
}

function setupClickEvents() {
    const continueBtn = document.querySelector('#continue-btn');
    const restartBtn = document.querySelector('#restart-btn');
    
    if (continueBtn) {
        continueBtn.addEventListener('click', nextAct);
        continueBtn.addEventListener('mouseenter', function() {
            this.setAttribute('animation__hover', 'property: scale; to: 1.1 1.1 1.1; dur: 200');
        });
        continueBtn.addEventListener('mouseleave', function() {
            this.setAttribute('animation__unhover', 'property: scale; to: 1 1 1; dur: 200');
        });
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', restartStory);
        restartBtn.addEventListener('mouseenter', function() {
            this.setAttribute('animation__hover', 'property: scale; to: 1.1 1.1 1.1; dur: 200');
        });
        restartBtn.addEventListener('mouseleave', function() {
            this.setAttribute('animation__unhover', 'property: scale; to: 1 1 1; dur: 200');
        });
    }
}

function nextAct() {
    console.log('📖 Avanzando al siguiente acto');
    
    if (currentAct < totalActs - 1) {
        currentAct++;
        displayAct(currentAct);
    }
}

function restartStory() {
    console.log('🔄 Reiniciando historia');
    
    currentAct = 0;
    resetScene();
    displayAct(0);
}

function displayAct(actIndex) {
    const act = storyActs[actIndex];
    
    // Actualizar textos
    const actIndicator = document.querySelector('#act-indicator');
    const mainText = document.querySelector('#main-story-text');
    
    if (actIndicator) {
        actIndicator.setAttribute('value', act.title);
    }
    
    if (mainText) {
        mainText.setAttribute('value', act.text);
    }
    
    // Actualizar cámara
    updateCamera(act.cameraPosition);
    
    // Mostrar/ocultar elementos
    updateSceneElements(act);
    
    // Mostrar botón apropiado
    updateButtons(actIndex === totalActs - 1);
    
    console.log(`🎭 Mostrando ${act.title}`);
}

function updateCamera(position) {
    const cameraRig = document.querySelector('#camera-rig');
    if (cameraRig) {
        cameraRig.setAttribute('animation', {
            property: 'position',
            to: position,
            dur: 2000,
            easing: 'easeInOutQuart'
        });
    }
}

function updateSceneElements(act) {
    // Mostrar elementos
    if (act.showElements) {
        act.showElements.forEach(elementId => {
            const element = document.querySelector(`#${elementId}`);
            if (element) {
                element.setAttribute('visible', true);
                if (elementId === 'weeds') {
                    element.setAttribute('animation__grow', {
                        property: 'scale',
                        from: '0.1 0.1 0.1',
                        to: '1 1 1',
                        dur: 2000,
                        easing: 'easeOutQuart'
                    });
                }
            }
        });
    }
    
    // Ocultar elementos
    if (act.hideElements) {
        act.hideElements.forEach(elementId => {
            const element = document.querySelector(`#${elementId}`);
            if (element) {
                element.setAttribute('visible', false);
            }
        });
    }
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
        const element = document.querySelector(`#${elementId}`);
        if (element) {
            element.setAttribute('visible', false);
            element.removeAttribute('animation__grow');
            element.setAttribute('scale', '1 1 1');
        }
    });
    
    // Mostrar elementos iniciales
    const rabbit = document.querySelector('#rabbit');
    if (rabbit) {
        rabbit.setAttribute('visible', true);
    }
}

console.log('📖 Sistema de navegación del chengyu 守株待兔 cargado');
