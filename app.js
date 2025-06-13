// Variables globales del sistema de historia
let currentScene = 0;
let isStoryPlaying = false;
let storyTimer = null;
let currentCameraView = 0;
let isModalOpen = false;

// Configuración de escenas optimizada
const storyScenes = [
    {
        id: 0,
        title: "El Trabajo Diligente",
        description: "Un granjero trabajaba diligentemente cuando un conejo corrió hacia el tocón...",
        duration: 9000,
        cameraPosition: "0 1.7 6",
        cameraRotation: "0 0 0"
    },
    {
        id: 1,
        title: "El Golpe de Suerte",
        description: "El granjero decide abandonar su trabajo y esperar junto al tocón...",
        duration: 7000,
        cameraPosition: "4 2.5 -1",
        cameraRotation: "-10 -45 0"
    },
    {
        id: 2,
        title: "La Espera Inútil",
        description: "Los campos se llenan de maleza mientras el granjero espera inútilmente...",
        duration: 9000,
        cameraPosition: "-6 3.5 -2",
        cameraRotation: "-20 90 0"
    },
    {
        id: 3,
        title: "La Ruina Final",
        description: "El granjero pierde toda su cosecha por depender de la suerte.",
        duration: 12000,
        cameraPosition: "0 5 0",
        cameraRotation: "-35 0 0"
    }
];

// Componente de estabilización para objetos
AFRAME.registerComponent('stable-object', {
    init: function() {
        this.el.setAttribute('animation-mixer', 'timeScale: 1');
        this.originalPosition = this.el.getAttribute('position');
        this.stabilize();
    },
    
    stabilize: function() {
        // Aplicar suavizado a transformaciones
        this.el.addEventListener('componentchanged', (evt) => {
            if (evt.detail.name === 'position' || evt.detail.name === 'rotation') {
                this.smoothTransform();
            }
        });
    },
    
    smoothTransform: function() {
        // Implementar suavizado de movimientos
        const duration = 100;
        this.el.setAttribute('animation__smooth', {
            property: 'position',
            dur: duration,
            easing: 'easeOutQuad'
        });
    }
});

// Componente de rig de cámara estabilizado
AFRAME.registerComponent('stable-camera-rig', {
    init: function() {
        this.setupVRStabilization();
        this.setupMobileOptimization();
    },
    
    setupVRStabilization: function() {
        // Configuración específica para VR[10]
        const camera = this.el.querySelector('[camera]');
        if (camera) {
            camera.setAttribute('look-controls', {
                enabled: true,
                magicWindowTrackingEnabled: true,
                pointerLockEnabled: false,
                touchEnabled: true,
                mouseEnabled: true,
                reverseMouseDrag: false,
                reverseTouchDrag: false
            });
        }
    },
    
    setupMobileOptimization: function() {
        // Optimización para dispositivos móviles[2]
        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.el.setAttribute('movement-controls', {
                fly: false,
                constrainToNavMesh: false,
                camera: '#main-camera'
            });
        }
    }
});

// Componente de control del conejo estabilizado
AFRAME.registerComponent('rabbit-controller', {
    init: function() {
        this.startPosition = this.el.getAttribute('position');
        this.isAnimating = false;
        this.el.setAttribute('stable-object', '');
    },
    
    startRunning: function() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const rabbit = this.el;
        
        console.log('🐰 Conejo iniciando carrera estabilizada');
        
        // Animación suave sin tiemblos[7]
        rabbit.setAttribute('animation__run', {
            property: 'position',
            to: '3.5 0.25 -4',
            dur: 4000,
            easing: 'easeInOutQuad'
        });
        
        rabbit.setAttribute('animation__turn', {
            property: 'rotation',
            to: '0 -90 0',
            dur: 1500,
            easing: 'easeInOutSine'
        });
        
        setTimeout(() => {
            this.simulateImpact();
        }, 4000);
    },
    
    simulateImpact: function() {
        const rabbit = this.el;
        const deadRabbit = document.querySelector('#dead-rabbit');
        const dustParticles = document.querySelector('#dust-particles');
        
        console.log('💥 Impacto suave del conejo');
        
        // Efectos visuales estabilizados
        if (dustParticles) {
            dustParticles.setAttribute('visible', true);
            dustParticles.setAttribute('animation__dust', {
                property: 'scale',
                from: '0.1 0.1 0.1',
                to: '2.5 2.5 2.5',
                dur: 1000,
                easing: 'easeOutQuart'
            });
            
            setTimeout(() => {
                dustParticles.setAttribute('visible', false);
                dustParticles.setAttribute('scale', '1 1 1');
                dustParticles.removeAttribute('animation__dust');
            }, 2500);
        }
        
        // Transición suave entre conejos
        rabbit.setAttribute('animation__fadeout', {
            property: 'opacity',
            to: 0,
            dur: 500,
            easing: 'easeInQuad'
        });
        
        setTimeout(() => {
            rabbit.setAttribute('visible', false);
            if (deadRabbit) {
                deadRabbit.setAttribute('visible', true);
                deadRabbit.setAttribute('animation__fadein', {
                    property: 'opacity',
                    from: 0,
                    to: 1,
                    dur: 500,
                    easing: 'easeOutQuad'
                });
            }
        }, 500);
        
        this.isAnimating = false;
        
        // Mostrar popup informativo después del impacto
        setTimeout(() => {
            showModal3D();
        }, 2000);
        
        setTimeout(() => {
            nextScene();
        }, 6000);
    },
    
    reset: function() {
        const rabbit = this.el;
        const deadRabbit = document.querySelector('#dead-rabbit');
        
        rabbit.setAttribute('position', this.startPosition);
        rabbit.setAttribute('rotation', '0 0 0');
        rabbit.setAttribute('visible', true);
        rabbit.setAttribute('opacity', 1);
        rabbit.removeAttribute('animation__run');
        rabbit.removeAttribute('animation__turn');
        rabbit.removeAttribute('animation__fadeout');
        
        if (deadRabbit) {
            deadRabbit.setAttribute('visible', false);
            deadRabbit.removeAttribute('animation__fadein');
        }
        
        this.isAnimating = false;
    }
});

// Componente de personajes de la historia
AFRAME.registerComponent('story-character', {
    init: function() {
        this.originalPosition = this.el.getAttribute('position');
        this.isWorking = true;
        this.el.setAttribute('stable-object', '');
    },
    
    startWorking: function() {
        if (!this.isWorking) return;
        
        const tool = this.el.querySelector('#farming-tool');
        if (tool) {
            tool.setAttribute('animation__work', {
                property: 'rotation',
                from: '0 0 40',
                to: '0 0 -10',
                dur: 2000,
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
            tool.setAttribute('rotation', '0 0 40');
        }
    },
    
    moveToStump: function() {
        this.el.setAttribute('animation__move', {
            property: 'position',
            to: '1.5 0 -3',
            dur: 4000,
            easing: 'easeInOutQuart'
        });
        
        this.el.setAttribute('animation__turn', {
            property: 'rotation',
            to: '0 60 0',
            dur: 3000,
            easing: 'easeInOutQuart'
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

// Componente de popup modal 3D
AFRAME.registerComponent('story-popup', {
    init: function() {
        this.isVisible = false;
    },
    
    show: function() {
        if (this.isVisible) return;
        
        this.isVisible = true;
        this.el.setAttribute('visible', true);
        
        // Animación de aparición suave
        this.el.setAttribute('animation__appear', {
            property: 'scale',
            from: '0.1 0.1 0.1',
            to: '1 1 1',
            dur: 800,
            easing: 'easeOutBack'
        });
        
        const background = this.el.querySelector('#modal-background');
        if (background) {
            background.setAttribute('animation__fade', {
                property: 'opacity',
                from: 0,
                to: 0.8,
                dur: 600,
                easing: 'easeOutQuad'
            });
        }
    },
    
    hide: function() {
        if (!this.isVisible) return;
        
        this.isVisible = false;
        
        this.el.setAttribute('animation__disappear', {
            property: 'scale',
            to: '0.1 0.1 0.1',
            dur: 400,
            easing: 'easeInBack'
        });
        
        const background = this.el.querySelector('#modal-background');
        if (background) {
            background.setAttribute('animation__fadeout', {
                property: 'opacity',
                to: 0,
                dur: 400,
                easing: 'easeInQuad'
            });
        }
        
        setTimeout(() => {
            this.el.setAttribute('visible', false);
            this.el.removeAttribute('animation__disappear');
            if (background) {
                background.removeAttribute('animation__fadeout');
            }
        }, 400);
    }
});

// Componente de cursor listener para interacciones
AFRAME.registerComponent('cursor-listener', {
    init: function() {
        this.el.addEventListener('click', this.onClick.bind(this));
        this.el.addEventListener('fusing', this.onFusing.bind(this));
        this.el.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    },
    
    onClick: function() {
        const id = this.el.id;
        console.log('🖱️ Click en:', id);
        
        switch(id) {
            case 'restart-3d-btn':
                restartStory();
                break;
            case 'camera-3d-btn':
                changeCameraView();
                break;
            case 'info-3d-btn':
                toggleModal3D();
                break;
            case 'close-button':
                hideModal3D();
                break;
        }
    },
    
    onFusing: function() {
        // Feedback visual durante fusing en VR
        this.el.setAttribute('animation__fuse', {
            property: 'scale',
            to: '1.05 1.05 1.05',
            dur: 100
        });
    },
    
    onMouseLeave: function() {
        this.el.removeAttribute('animation__fuse');
    }
});

// Funciones del sistema de historia
function initializeStory() {
    console.log('🎬 Inicializando sistema estabilizado del chengyu 守株待兔');
    currentScene = 0;
    isStoryPlaying = false;
    isModalOpen = false;
    updateUI();
    
    setupComponents();
}

function setupComponents() {
    const rabbit = document.querySelector('#rabbit');
    const farmer = document.querySelector('#farmer');
    const modal = document.querySelector('#modal-3d');
    
    if (rabbit && !rabbit.hasAttribute('rabbit-controller')) {
        rabbit.setAttribute('rabbit-controller', '');
    }
    
    if (farmer && !farmer.hasAttribute('story-character')) {
        farmer.setAttribute('story-character', '');
    }
    
    if (modal && !modal.hasAttribute('story-popup')) {
        modal.setAttribute('story-popup', '');
    }
    
    // Configurar listeners de cursor
    const clickableElements = ['restart-3d-btn', 'camera-3d-btn', 'info-3d-btn', 'close-button'];
    clickableElements.forEach(id => {
        const element = document.querySelector(`#${id}`);
        if (element && !element.hasAttribute('cursor-listener')) {
            element.setAttribute('cursor-listener', '');
        }
    });
}

function startStory() {
    if (isStoryPlaying) return;
    
    console.log('▶️ Iniciando historia automática estabilizada');
    isStoryPlaying = true;
    currentScene = 0;
    
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
    
    updateSceneUI(sceneIndex);
    updateCamera(scene.cameraPosition, scene.cameraRotation);
    
    switch(sceneIndex) {
        case 0:
            executeScene0();
            break;
        case 1:
            executeScene1();
            break;
        case 2:
            executeScene2();
            break;
        case 3:
            executeScene3();
            break;
    }
    
    if (sceneIndex < storyScenes.length - 1) {
        storyTimer = setTimeout(() => {
            currentScene++;
            executeScene(currentScene);
        }, scene.duration);
    } else {
        storyTimer = setTimeout(() => {
            restartStory();
        }, scene.duration);
    }
}

function executeScene0() {
    const farmer = document.querySelector('#farmer');
    const rabbit = document.querySelector('#rabbit');
    
    if (farmer && farmer.components['story-character']) {
        farmer.components['story-character'].startWorking();
    }
    
    setTimeout(() => {
        if (rabbit && rabbit.components['rabbit-controller']) {
            rabbit.components['rabbit-controller'].startRunning();
        }
    }, 3000);
}

function executeScene1() {
    const farmer = document.querySelector('#farmer');
    
    if (farmer && farmer.components['story-character']) {
        farmer.components['story-character'].stopWorking();
        setTimeout(() => {
            farmer.components['story-character'].moveToStump();
        }, 1500);
    }
}

function executeScene2() {
    const weeds = document.querySelector('#weeds');
    if (weeds) {
        weeds.setAttribute('visible', true);
        weeds.setAttribute('animation__grow', {
            property: 'scale',
            from: '0.1 0.1 0.1',
            to: '1 1 1',
            dur: 4000,
            easing: 'easeOutQuart'
        });
    }
}

function executeScene3() {
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
        setTimeout(() => restartStory(), 4000);
    }
}

function updateSceneUI(sceneIndex) {
    // Actualizar barra de progreso 3D
    const progressFill = document.querySelector('#progress-fill-3d');
    if (progressFill) {
        const progressWidth = ((sceneIndex + 1) / storyScenes.length) * 6;
        progressFill.setAttribute('animation__progress', {
            property: 'width',
            to: progressWidth,
            dur: 1000,
            easing: 'easeOutQuad'
        });
    }
}

function updateCamera(position, rotation) {
    const cameraRig = document.querySelector('#camera-rig');
    if (cameraRig) {
        // Movimiento suave de cámara[11]
        cameraRig.setAttribute('animation__position', {
            property: 'position',
            to: position,
            dur: 2500,
            easing: 'easeInOutQuart'
        });
        
        cameraRig.setAttribute('animation__rotation', {
            property: 'rotation',
            to: rotation,
            dur: 2500,
            easing: 'easeInOutQuart'
        });
    }
}

function showModal3D() {
    if (isModalOpen) return;
    
    const modal = document.querySelector('#modal-3d');
    if (modal && modal.components['story-popup']) {
        modal.components['story-popup'].show();
        isModalOpen = true;
        
        // Auto-cerrar después de 8 segundos
        setTimeout(() => {
            hideModal3D();
        }, 8000);
    }
}

function hideModal3D() {
    if (!isModalOpen) return;
    
    const modal = document.querySelector('#modal-3d');
    if (modal && modal.components['story-popup']) {
        modal.components['story-popup'].hide();
        isModalOpen = false;
    }
}

function toggleModal3D() {
    if (isModalOpen) {
        hideModal3D();
    } else {
        showModal3D();
    }
}

function changeCameraView() {
    const cameraViews = [
        { position: '0 1.7 6', rotation: '0 0 0' },
        { position: '8 3 0', rotation: '0 -90 0' },
        { position: '-8 3 -2', rotation: '0 90 0' },
        { position: '3 6 -6', rotation: '-20 0 0' }
    ];
    
    currentCameraView = (currentCameraView + 1) % cameraViews.length;
    const newView = cameraViews[currentCameraView];
    
    updateCamera(newView.position, newView.rotation);
}

function restartStory() {
    console.log('🔄 Reiniciando historia estabilizada');
    
    if (storyTimer) {
        clearTimeout(storyTimer);
        storyTimer = null;
    }
    
    hideModal3D();
    
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
    
    currentScene = 0;
    isStoryPlaying = false;
    updateSceneUI(currentScene);
    
    setTimeout(() => {
        startStory();
    }, 3000);
}

// Event Listeners principales
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Chengyu 守株待兔 VR Experience cargado (versión estabilizada)');
    
    // Configurar eventos de VR
    const scene = document.querySelector('#scene');
    if (scene) {
        scene.addEventListener('enter-vr', function() {
            document.body.classList.add('vr-mode');
            console.log('🥽 Modo VR activado con estabilización');
        });
        
        scene.addEventListener('exit-vr', function() {
            document.body.classList.remove('vr-mode');
            console.log('🖥️ Modo VR desactivado');
        });
    }
    
    setTimeout(() => {
        initializeStory();
        startStory();
    }, 1500);
});

// Optimización de rendimiento
window.addEventListener('load', function() {
    // Verificar compatibilidad VR[6]
    if (navigator.xr) {
        navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
            console.log('VR Soportado:', supported);
        });
    }
    
    // Optimizar para dispositivos móviles
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log('📱 Optimizaciones móviles activadas');
        const scene = document.querySelector('#scene');
        if (scene) {
            scene.setAttribute('renderer', 'antialias: false; logarithmicDepthBuffer: true');
        }
    }
});

console.log('🐰 Sistema estabilizado del chengyu 守株待兔 inicializado correctamente');

