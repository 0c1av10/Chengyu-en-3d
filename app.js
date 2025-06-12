// Variables globales para el sistema de historia
let currentScene = 0;
let isStoryPlaying = false;
let storyTimer = null;
let currentCameraView = 0;

// Configuración de escenas del chengyu
const storyScenes = [
    {
        id: 0,
        title: "El Trabajo Diligente",
        description: "Un granjero trabajaba diligentemente en sus campos cuando un conejo corrió hacia un tocón de árbol y murió al impactar...",
        duration: 8000, // 8 segundos
        cameraPosition: "0 1.6 5",
        cameraRotation: "0 0 0"
    },
    {
        id: 1,
        title: "El Golpe de Suerte",
        description: "El granjero, emocionado por su buena suerte, decidió abandonar su trabajo y sentarse junto al tocón esperando más conejos...",
        duration: 6000, // 6 segundos
        cameraPosition: "3 2 -1",
        cameraRotation: "0 -45 0"
    },
    {
        id: 2,
        title: "La Espera Inútil",
        description: "Día tras día, el granjero esperaba junto al tocón, mientras sus campos se llenaban de maleza y se arruinaban...",
        duration: 8000, // 8 segundos
        cameraPosition: "-5 3 -2",
        cameraRotation: "-15 90 0"
    },
    {
        id: 3,
        title: "La Ruina Final",
        description: "Al final, no llegaron más conejos, y el granjero perdió toda su cosecha por su pereza y dependencia de la suerte.",
        duration: 10000, // 10 segundos
        cameraPosition: "0 4 0",
        cameraRotation: "-30 0 0"
    }
];

// Componente personalizado para control del conejo
AFRAME.registerComponent('rabbit-controller', {
    init: function() {
        this.startPosition = this.el.getAttribute('position');
        this.isAnimating = false;
        this.el.setAttribute('visible', true);
    },
    
    startRunning: function() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const rabbit = this.el;
        
        // Sonido de carrera
        playSound('rabbit-run');
        
        // Animación de movimiento hacia el tocón
        rabbit.setAttribute('animation__run', {
            property: 'position',
            to: '2.5 0.2 -3',
            dur: 3000,
            easing: 'easeInQuad'
        });
        
        // Rotación hacia el tocón
        rabbit.setAttribute('animation__turn', {
            property: 'rotation',
            to: '0 -90 0',
            dur: 1000,
            easing: 'linear'
        });
        
        // Programar el impacto
        setTimeout(() => {
            this.simulateImpact();
        }, 3000);
    },
    
    simulateImpact: function() {
        const rabbit = this.el;
        const deadRabbit = document.querySelector('#dead-rabbit');
        const dustParticles = document.querySelector('#dust-particles');
        
        // Sonido de impacto
        playSound('impact-sound');
        
        // Mostrar efectos de polvo
        if (dustParticles) {
            dustParticles.setAttribute('visible', true);
            dustParticles.setAttribute('animation__dust', {
                property: 'scale',
                from: '0 0 0',
                to: '2 2 2',
                dur: 800,
                easing: 'easeOutQuad'
            });
            
            setTimeout(() => {
                dustParticles.setAttribute('visible', false);
                dustParticles.removeAttribute('animation__dust');
            }, 2000);
        }
        
        // Ocultar conejo vivo y mostrar conejo muerto
        rabbit.setAttribute('visible', false);
        if (deadRabbit) {
            deadRabbit.setAttribute('visible', true);
        }
        
        this.isAnimating = false;
        
        // Avanzar a la siguiente escena después del impacto
        setTimeout(() => {
            nextScene();
        }, 2000);
    },
    
    reset: function() {
        const rabbit = this.el;
        const deadRabbit = document.querySelector('#dead-rabbit');
        
        rabbit.setAttribute('position', this.startPosition);
        rabbit.setAttribute('rotation', '0 0 0');
        rabbit.setAttribute('visible', true);
        rabbit.removeAttribute('animation__run');
        rabbit.removeAttribute('animation__turn');
        
        if (deadRabbit) {
            deadRabbit.setAttribute('visible', false);
        }
        
        this.isAnimating = false;
    }
});

// Componente para personajes de la historia
AFRAME.registerComponent('story-character', {
    init: function() {
        this.originalPosition = this.el.getAttribute('position');
        this.isWorking = true;
    },
    
    startWorking: function() {
        if (!this.isWorking) return;
        
        const tool = this.el.querySelector('#farming-tool');
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
    },
    
    stopWorking: function() {
        this.isWorking = false;
        const tool = this.el.querySelector('#farming-tool');
        if (tool) {
            tool.removeAttribute('animation__work');
            tool.setAttribute('rotation', '0 0 45');
        }
    },
    
    moveToStump: function() {
        this.el.setAttribute('animation__move', {
            property: 'position',
            to: '1 0 -2',
            dur: 3000,
            easing: 'easeInOutQuad'
        });
        
        this.el.setAttribute('animation__turn', {
            property: 'rotation',
            to: '0 45 0',
            dur: 2000,
            easing: 'easeInOutQuad'
        });
    },
    
    reset: function() {
        this.el.setAttribute('position', this.originalPosition);
        this.el.setAttribute('rotation', '0 0 0');
        this.el.removeAttribute('animation__move');
        this.el.removeAttribute('animation__turn');
        this.isWorking = true;
        this.startWorking();
    }
});

// Funciones del sistema de historia
function initializeStory() {
    console.log('🎬 Inicializando sistema de historia del chengyu 守株待兔');
    currentScene = 0;
    isStoryPlaying = false;
    updateUI();
    
    // Configurar componentes personalizados
    const rabbit = document.querySelector('#rabbit');
    const farmer = document.querySelector('#farmer');
    
    if (rabbit && !rabbit.hasAttribute('rabbit-controller')) {
        rabbit.setAttribute('rabbit-controller', '');
    }
    
    if (farmer && !farmer.hasAttribute('story-character')) {
        farmer.setAttribute('story-character', '');
    }
}

function startStory() {
    if (isStoryPlaying) return;
    
    console.log('▶️ Iniciando historia automática');
    isStoryPlaying = true;
    currentScene = 0;
    
    // Iniciar la primera escena
    executeScene(currentScene);
}

function executeScene(sceneIndex) {
    if (sceneIndex >= storyScenes.length) {
        console.log('✅ Historia completada');
        isStoryPlaying = false;
        return;
    }
    
    const scene = storyScenes[sceneIndex];
    console.log(`🎭 Ejecutando escena ${sceneIndex}: ${scene.title}`);
    
    // Actualizar UI
    updateSceneUI(sceneIndex);
    
    // Actualizar cámara
    updateCamera(scene.cameraPosition, scene.cameraRotation);
    
    // Ejecutar acciones específicas de la escena
    switch(sceneIndex) {
        case 0:
            executeScene0(); // Trabajo y llegada del conejo
            break;
        case 1:
            executeScene1(); // Granjero se mueve al tocón
            break;
        case 2:
            executeScene2(); // Aparece la maleza
            break;
        case 3:
            executeScene3(); // Vista final de la ruina
            break;
    }
    
    // Programar la siguiente escena
    if (sceneIndex < storyScenes.length - 1) {
        storyTimer = setTimeout(() => {
            currentScene++;
            executeScene(currentScene);
        }, scene.duration);
    } else {
        // Reiniciar automáticamente después de completar la historia
        storyTimer = setTimeout(() => {
            restartStory();
        }, scene.duration);
    }
}

function executeScene0() {
    // Escena 1: Granjero trabajando, conejo corriendo hacia el tocón
    const farmer = document.querySelector('#farmer');
    const rabbit = document.querySelector('#rabbit');
    
    if (farmer && farmer.components['story-character']) {
        farmer.components['story-character'].startWorking();
    }
    
    // Comenzar animación del conejo después de 2 segundos
    setTimeout(() => {
        if (rabbit && rabbit.components['rabbit-controller']) {
            rabbit.components['rabbit-controller'].startRunning();
        }
    }, 2000);
}

function executeScene1() {
    // Escena 2: Granjero deja de trabajar y se mueve al tocón
    const farmer = document.querySelector('#farmer');
    
    if (farmer && farmer.components['story-character']) {
        farmer.components['story-character'].stopWorking();
        setTimeout(() => {
            farmer.components['story-character'].moveToStump();
        }, 1000);
    }
}

function executeScene2() {
    // Escena 3: Aparece la maleza en los campos abandonados
    const weeds = document.querySelector('#weeds');
    if (weeds) {
        weeds.setAttribute('visible', true);
        weeds.setAttribute('animation__grow', {
            property: 'scale',
            from: '0 0 0',
            to: '1 1 1',
            dur: 3000,
            easing: 'easeOutQuad'
        });
    }
}

function executeScene3() {
    // Escena 4: Vista final mostrando la ruina total
    console.log('📖 Escena final: La moraleja del chengyu');
}

function nextScene() {
    if (!isStoryPlaying) return;
    
    if (storyTimer) {
        clearTimeout(storyTimer);
    }
    
    currentScene++;
    if (currentScene < storyScenes.length) {
        executeScene(currentScene);
    } else {
        isStoryPlaying = false;
        setTimeout(() => restartStory(), 3000);
    }
}

function updateSceneUI(sceneIndex) {
    // Actualizar indicador de progreso
    const progressFill = document.querySelector('#progress-fill');
    const progressPercent = ((sceneIndex + 1) / storyScenes.length) * 100;
    if (progressFill) {
        progressFill.style.width = progressPercent + '%';
    }
    
    // Actualizar etiquetas de escena
    const sceneLabels = document.querySelectorAll('.scene-label');
    sceneLabels.forEach((label, index) => {
        label.classList.remove('active', 'completed');
        if (index === sceneIndex) {
            label.classList.add('active');
        } else if (index < sceneIndex) {
            label.classList.add('completed');
        }
    });
    
    // Actualizar texto de la historia
    const storyText = document.querySelector('#current-story');
    if (storyText && storyScenes[sceneIndex]) {
        storyText.style.opacity = '0';
        setTimeout(() => {
            storyText.textContent = storyScenes[sceneIndex].description;
            storyText.style.opacity = '1';
        }, 300);
    }
}

function updateCamera(position, rotation) {
    const cameraRig = document.querySelector('#camera-rig');
    if (cameraRig) {
        cameraRig.setAttribute('animation__position', {
            property: 'position',
            to: position,
            dur: 2000,
            easing: 'easeInOutQuad'
        });
        
        cameraRig.setAttribute('animation__rotation', {
            property: 'rotation',
            to: rotation,
            dur: 2000,
            easing: 'easeInOutQuad'
        });
    }
}

function restartStory() {
    console.log('🔄 Reiniciando historia del chengyu');
    
    // Limpiar timers
    if (storyTimer) {
        clearTimeout(storyTimer);
        storyTimer = null;
    }
    
    // Resetear elementos
    const rabbit = document.querySelector('#rabbit');
    const farmer = document.querySelector('#farmer');
    const deadRabbit = document.querySelector('#dead-rabbit');
    const weeds = document.querySelector('#weeds');
    const dustParticles = document.querySelector('#dust-particles');
    
    if (rabbit && rabbit.components['rabbit-controller']) {
        rabbit.components['rabbit-controller'].reset();
    }
    
    if (farmer && farmer.components['story-character']) {
        farmer.components['story-character'].reset();
    }
    
    if (deadRabbit) {
        deadRabbit.setAttribute('visible', false);
    }
    
    if (weeds) {
        weeds.setAttribute('visible', false);
        weeds.removeAttribute('animation__grow');
        weeds.setAttribute('scale', '1 1 1');
    }
    
    if (dustParticles) {
        dustParticles.setAttribute('visible', false);
    }
    
    // Resetear UI
    currentScene = 0;
    isStoryPlaying = false;
    updateUI();
    
    // Reiniciar historia después de 3 segundos
    setTimeout(() => {
        startStory();
    }, 3000);
}

function updateUI() {
    updateSceneUI(currentScene);
}

// Funciones de utilidad
function playSound(soundId) {
    const audio = document.querySelector(`#${soundId}`);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => {
            console.log(`Audio ${soundId} no pudo reproducirse:`, e);
        });
    }
}

function changeCameraView() {
    const cameraViews = [
        { position: '0 1.6 5', rotation: '0 0 0' },
        { position: '6 2 0', rotation: '0 -90 0' },
        { position: '-6 2 -2', rotation: '0 90 0' },
        { position: '2 3 -6', rotation: '-15 0 0' }
    ];
    
    currentCameraView = (currentCameraView + 1) % cameraViews.length;
    const newView = cameraViews[currentCameraView];
    
    updateCamera(newView.position, newView.rotation);
}

function enterVR() {
    const scene = document.querySelector('#scene');
    if (scene) {
        scene.enterVR().catch(err => {
            console.log('Error al entrar en VR:', err);
            alert('Tu navegador o dispositivo no soporta VR. Intenta con Chrome en un dispositivo compatible.');
        });
    }
}

function resetAll() {
    console.log('🔄 Reinicio completo solicitado por el usuario');
    window.location.reload();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Chengyu 守株待兔 VR Experience cargado');
    
    // Configurar botones
    const restartBtn = document.querySelector('#restart-btn');
    const cameraBtn = document.querySelector('#camera-btn');
    const vrBtn = document.querySelector('#vr-btn');
    
    if (restartBtn) {
        restartBtn.addEventListener('click', resetAll);
    }
    
    if (cameraBtn) {
        cameraBtn.addEventListener('click', changeCameraView);
    }
    
    if (vrBtn) {
        vrBtn.addEventListener('click', enterVR);
    }
    
    // Eventos de VR
    const scene = document.querySelector('#scene');
    if (scene) {
        scene.addEventListener('enter-vr', function() {
            document.body.classList.add('vr-mode');
            console.log('🥽 Modo VR activado');
        });
        
        scene.addEventListener('exit-vr', function() {
            document.body.classList.remove('vr-mode');
            console.log('🖥️ Modo VR desactivado');
        });
    }
    
    // Inicializar y comenzar historia automáticamente
    setTimeout(() => {
        initializeStory();
        startStory();
    }, 1000);
});

// Verificar compatibilidad VR
window.addEventListener('load', function() {
    if (navigator.xr) {
        navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
            const vrBtn = document.querySelector('#vr-btn');
            if (!supported && vrBtn) {
                vrBtn.textContent = 'VR No Disponible';
                vrBtn.disabled = true;
                vrBtn.style.opacity = '0.5';
            }
        });
    }
});

console.log('🐰 Sistema de historia del chengyu 守株待兔 inicializado correctamente');
