// Variables globales
let currentCameraView = 0;
let isAnimating = false;
let animationInterval;
let dustTimer;

// Posiciones de cámara predefinidas
const cameraViews = [
    { position: '0 1.6 5', rotation: '0 0 0' },      // Vista frontal
    { position: '6 2 0', rotation: '0 -90 0' },      // Vista lateral derecha
    { position: '-6 2 -2', rotation: '0 90 0' },     // Vista del granjero
    { position: '2 3 -6', rotation: '-15 0 0' }      // Vista aérea del tocón
];

// Textos de la historia para cada vista
const storyTexts = [
    "Un granjero trabajaba diligentemente en sus campos cuando un conejo corrió hacia un tocón de árbol y murió al impactar...",
    "El granjero, emocionado por su buena suerte, decidió abandonar su trabajo y sentarse junto al tocón esperando más conejos...",
    "Día tras día, el granjero esperaba junto al tocón, mientras sus campos se llenaban de maleza y se arruinaban...",
    "Al final, no llegaron más conejos, y el granjero perdió toda su cosecha por su pereza y dependencia de la suerte."
];

// Componente personalizado para animación del conejo
AFRAME.registerComponent('rabbit-animation', {
    init: function() {
        this.isRunning = false;
        this.startPosition = this.el.getAttribute('position');
        this.targetPosition = { x: 2.5, y: 0.2, z: -3 }; // Cerca del tocón
    },
    
    startAnimation: function() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const rabbit = this.el;
        
        // Sonido de carrera
        const runSound = document.querySelector('#rabbit-run');
        if (runSound) {
            runSound.currentTime = 0;
            runSound.play().catch(e => console.log('Audio play failed:', e));
        }
        
        // Animación de movimiento
        rabbit.setAttribute('animation', {
            property: 'position',
            to: `${this.targetPosition.x} ${this.targetPosition.y} ${this.targetPosition.z}`,
            dur: 3000,
            easing: 'easeInQuad'
        });
        
        // Animación de rotación (conejo mirando hacia el tocón)
        rabbit.setAttribute('animation__rotation', {
            property: 'rotation',
            to: '0 -90 0',
            dur: 1000,
            easing: 'linear'
        });
        
        // Simular el impacto después de 3 segundos
        setTimeout(() => {
            this.simulateImpact();
        }, 3000);
    },
    
    simulateImpact: function() {
        const rabbit = this.el;
        const impactSound = document.querySelector('#impact-sound');
        const dustParticles = document.querySelector('#dust-particles');
        
        // Sonido de impacto
        if (impactSound) {
            impactSound.currentTime = 0;
            impactSound.play().catch(e => console.log('Audio play failed:', e));
        }
        
        // Mostrar partículas de polvo
        if (dustParticles) {
            dustParticles.setAttribute('visible', true);
            dustParticles.setAttribute('animation', {
                property: 'scale',
                from: '0 0 0',
                to: '2 2 2',
                dur: 500,
                easing: 'easeOutQuad'
            });
            
            // Ocultar partículas después de 2 segundos
            setTimeout(() => {
                dustParticles.setAttribute('visible', false);
                dustParticles.setAttribute('scale', '1 1 1');
            }, 2000);
        }
        
        // Animación de "muerte" del conejo (caída)
        rabbit.setAttribute('animation__fall', {
            property: 'rotation',
            to: '0 -90 90',
            dur: 500,
            easing: 'easeInQuad'
        });
        
        rabbit.setAttribute('animation__falldown', {
            property: 'position',
            to: `${this.targetPosition.x} 0 ${this.targetPosition.z}`,
            dur: 500,
            easing: 'easeInQuad'
        });
        
        this.isRunning = false;
        
        // Reiniciar después de 5 segundos
        setTimeout(() => {
            this.resetRabbit();
        }, 5000);
    },
    
    resetRabbit: function() {
        const rabbit = this.el;
        
        // Volver a la posición inicial
        rabbit.setAttribute('position', this.startPosition);
        rabbit.setAttribute('rotation', '0 0 0');
        
        // Comenzar nueva animación después de 3 segundos
        setTimeout(() => {
            this.startAnimation();
        }, 3000);
    }
});

// Componente para animación del granjero
AFRAME.registerComponent('farmer-animation', {
    init: function() {
        this.startIdleAnimation();
    },
    
    startIdleAnimation: function() {
        const farmer = this.el;
        
        // Animación de respiración sutil
        farmer.setAttribute('animation__breathing', {
            property: 'scale',
            from: '1 1 1',
            to: '1 1.02 1',
            dur: 2000,
            easing: 'easeInOutSine',
            loop: true,
            dir: 'alternate'
        });
        
        // Movimiento ocasional de herramienta
        const tool = farmer.querySelector('a-cylinder[rotation="0 0 45"]');
        if (tool) {
            setTimeout(() => {
                tool.setAttribute('animation', {
                    property: 'rotation',
                    from: '0 0 45',
                    to: '0 0 30',
                    dur: 1500,
                    easing: 'easeInOutSine',
                    loop: true,
                    dir: 'alternate'
                });
            }, 1000);
        }
    }
});

// Inicialización cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeScene();
    setupEventListeners();
    startStoryAnimation();
});

function initializeScene() {
    const scene = document.querySelector('#scene');
    const rabbit = document.querySelector('#rabbit');
    const farmer = document.querySelector('#farmer');
    
    // Añadir componentes personalizados
    if (rabbit) {
        rabbit.setAttribute('rabbit-animation', '');
    }
    
    if (farmer) {
        farmer.setAttribute('farmer-animation', '');
    }
    
    console.log('Escena inicializada correctamente');
}

function setupEventListeners() {
    // Botón de reinicio
    const restartBtn = document.querySelector('#restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            resetStory();
        });
    }
    
    // Botón de cambio de cámara
    const cameraBtn = document.querySelector('#camera-btn');
    if (cameraBtn) {
        cameraBtn.addEventListener('click', function() {
            changeCameraView();
        });
    }
    
    // Botón de VR
    const vrBtn = document.querySelector('#vr-btn');
    if (vrBtn) {
        vrBtn.addEventListener('click', function() {
            enterVR();
        });
    }
    
    // Eventos del modo VR
    const scene = document.querySelector('#scene');
    if (scene) {
        scene.addEventListener('enter-vr', function() {
            document.body.classList.add('vr-mode');
            showVRIndicator();
        });
        
        scene.addEventListener('exit-vr', function() {
            document.body.classList.remove('vr-mode');
            hideVRIndicator();
        });
    }
}

function resetStory() {
    // Detener animaciones actuales
    if (animationInterval) {
        clearInterval(animationInterval);
    }
    if (dustTimer) {
        clearTimeout(dustTimer);
    }
    
    // Recargar la página para reinicio completo
    window.location.reload();
}

function changeCameraView() {
    currentCameraView = (currentCameraView + 1) % cameraViews.length;
    const cameraRig = document.querySelector('#camera-rig');
    const storyText = document.querySelector('#story-text p');
    
    if (cameraRig) {
        const newView = cameraViews[currentCameraView];
        
        // Animación suave de transición de cámara
        cameraRig.setAttribute('animation', {
            property: 'position',
            to: newView.position,
            dur: 1500,
            easing: 'easeInOutQuad'
        });
        
        cameraRig.setAttribute('animation__rotation', {
            property: 'rotation',
            to: newView.rotation,
            dur: 1500,
            easing: 'easeInOutQuad'
        });
    }
    
    // Actualizar texto de la historia
    if (storyText) {
        storyText.style.opacity = '0';
        setTimeout(() => {
            storyText.textContent = storyTexts[currentCameraView];
            storyText.style.opacity = '1';
        }, 300);
    }
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

function showVRIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'vr-indicator';
    indicator.textContent = 'MODO VR ACTIVO';
    indicator.id = 'vr-indicator';
    document.body.appendChild(indicator);
}

function hideVRIndicator() {
    const indicator = document.querySelector('#vr-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function startStoryAnimation() {
    // Comenzar la animación del conejo después de 2 segundos
    setTimeout(() => {
        const rabbit = document.querySelector('#rabbit');
        if (rabbit && rabbit.components['rabbit-animation']) {
            rabbit.components['rabbit-animation'].startAnimation();
        }
    }, 2000);
}

// Funciones de utilidad para efectos adicionales
function createParticleEffect(position, color = '#D2B48C') {
    const scene = document.querySelector('a-scene');
    const particle = document.createElement('a-sphere');
    
    particle.setAttribute('radius', '0.02');
    particle.setAttribute('color', color);
    particle.setAttribute('position', position);
    particle.setAttribute('opacity', '0.8');
    
    // Animación de partícula
    particle.setAttribute('animation', {
        property: 'position',
        to: `${position.x + (Math.random() - 0.5)} ${position.y + Math.random()} ${position.z + (Math.random() - 0.5)}`,
        dur: 1000,
        easing: 'easeOutQuad'
    });
    
    particle.setAttribute('animation__fade', {
        property: 'opacity',
        to: '0',
        dur: 1000,
        easing: 'linear'
    });
    
    scene.appendChild(particle);
    
    // Eliminar partícula después de la animación
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 1200);
}

// Manejo de errores de audio
function handleAudioError(audio, errorMsg) {
    console.warn('Error de audio:', errorMsg);
    // Continuar sin audio si hay problemas
}

// Verificar compatibilidad VR
function checkVRSupport() {
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
}

// Ejecutar verificación VR al cargar
window.addEventListener('load', function() {
    checkVRSupport();
});

// Manejo de resize para responsive
window.addEventListener('resize', function() {
    const scene = document.querySelector('#scene');
    if (scene) {
        // Ajustar altura en dispositivos móviles
        if (window.innerWidth <= 768) {
            scene.style.height = '50vh';
        } else {
            scene.style.height = '70vh';
        }
    }
});

console.log('🐰 Chengyu 守株待兔 - Aplicación VR cargada correctamente');
