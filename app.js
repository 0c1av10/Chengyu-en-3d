// Variables globales
let currentAct = 0;
const totalActs = 4;

// Datos actualizados de los actos con formato mejorado
const storyActs = [
    {
        title: "HISTORIA • ACTO 1 DE 4",
        text: "Historia:&#10;Un granjero vivía trabajando duro en los campos antiguos de China.&#10;&#10;Moraleja:&#10;Enseña sobre los peligros de depender de la suerte en lugar&#10;del trabajo duro. No se debe abandonar el esfuerzo esperando&#10;que la casualidad se repita.&#10;&#10;Contexto Cultural:&#10;Este chengyu se usa para criticar a personas que confían&#10;en golpes de suerte en lugar de mostrar iniciativa propia.",
        cameraPosition: "0 1.7 6",
        showElements: ['farmer', 'farm-field'],
        hideElements: ['dead-rabbit', 'weeds'],
        progressWidth: 1.5
    },
    {
        title: "HISTORIA • ACTO 2 DE 4",
        text: "Historia:&#10;Un conejo corrió hacia un tocón y murió. El granjero se emocionó&#10;por esta suerte inesperada y decidió abandonar su trabajo.&#10;&#10;Moraleja:&#10;Muestra cómo un evento fortuito puede hacer que las personas&#10;abandonen sus responsabilidades esperando más suerte.&#10;&#10;Contexto Cultural:&#10;Representa la mentalidad de quienes prefieren esperar&#10;oportunidades fáciles en lugar de crear su propio éxito.",
        cameraPosition: "4 2.5 -1",
        showElements: ['dead-rabbit'],
        hideElements: ['rabbit'],
        progressWidth: 3.0
    },
    {
        title: "HISTORIA • ACTO 3 DE 4",
        text: "Historia:&#10;El granjero esperaba junto al tocón mientras sus campos&#10;se llenaban de maleza y se arruinaban por falta de cuidado.&#10;&#10;Moraleja:&#10;Ilustra las consecuencias de abandonar el trabajo constante&#10;por confiar en eventos casuales que pueden no repetirse.&#10;&#10;Contexto Cultural:&#10;Critica la pereza disfrazada de esperanza y la falta&#10;de planificación a largo plazo en la vida.",
        cameraPosition: "-6 3.5 -2",
        showElements: ['weeds'],
        hideElements: [],
        progressWidth: 4.5
    },
    {
        title: "HISTORIA • ACTO 4 DE 4",
        text: "Historia:&#10;Nunca llegaron más conejos. El granjero perdió toda su cosecha&#10;por depender de la suerte en lugar del trabajo duro.&#10;&#10;Moraleja Final:&#10;El éxito verdadero viene del esfuerzo constante y la planificación&#10;cuidadosa, no de esperar golpes de suerte casuales.&#10;&#10;Enseñanza:&#10;Este chengyu nos recuerda que debemos ser proactivos&#10;y trabajadores, no reactivos y perezosos.",
        cameraPosition: "0 5 0",
        showElements: ['weeds'],
        hideElements: [],
        progressWidth: 6.0
    }
];

// Inicialización cuando la escena está lista
document.addEventListener('DOMContentLoaded', function() {
    const scene = document.querySelector('a-scene');
    
    if (scene.hasLoaded) {
        initializeStory();
    } else {
        scene.addEventListener('loaded', initializeStory);
    }
});

function initializeStory() {
    console.log('🎬 Inicializando historia del chengyu con texto mejorado');
    
    setupClickEvents();
    displayAct(0);
}

function setupClickEvents() {
    const continueBtn = document.querySelector('#continue-btn');
    const restartBtn = document.querySelector('#restart-btn');
    
    if (continueBtn) {
        continueBtn.addEventListener('click', nextAct);
        continueBtn.addEventListener('mouseenter', function() {
            this.setAttribute('animation__hover', 'property: scale; to: 1.05 1.05 1.05; dur: 200');
        });
        continueBtn.addEventListener('mouseleave', function() {
            this.setAttribute('animation__unhover', 'property: scale; to: 1 1 1; dur: 200');
        });
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', restartStory);
        restartBtn.addEventListener('mouseenter', function() {
            this.setAttribute('animation__hover', 'property: scale; to: 1.05 1.05 1.05; dur: 200');
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
    const progressBar = document.querySelector('#progress-bar');
    
    if (actIndicator) {
        actIndicator.setAttribute('value', act.title);
    }
    
    if (mainText) {
        mainText.setAttribute('value', act.text);
    }
    
    // Actualizar barra de progreso
    if (progressBar) {
        progressBar.setAttribute('animation__progress', {
            property: 'width',
            to: act.progressWidth,
            dur: 800,
            easing: 'easeOutQuart'
        });
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
    
    // Resetear barra de progreso
    const progressBar = document.querySelector('#progress-bar');
    if (progressBar) {
        progressBar.setAttribute('width', '1.5');
    }
}

console.log('📖 Sistema mejorado del chengyu 守株待兔 cargado');
