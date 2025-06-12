// Story data
const storyData = {
    chinese_title: "塞翁失马",
    pinyin: "Sài Wēng Shī Mǎ", 
    spanish_title: "El viejo de la frontera pierde su caballo",
    full_saying: "塞翁失马，焉知非福",
    meaning: "Una aparente desgracia puede convertirse en bendición, y viceversa",
    scenes: [
        {
            scene_number: 1,
            title: "El caballo se escapa",
            spanish_description: "Un anciano que vivía cerca de la frontera pierde su caballo, que huye hacia tierras bárbaras. Los vecinos vienen a consolarlo, pero él dice: '¿Cómo saben que esto no es una bendición?'",
            chinese_text: "近塞上之人，有善術者，馬無故亡而入胡",
            key_elements: ["old_man", "horse", "village", "frontier_wall"]
        },
        {
            scene_number: 2, 
            title: "El caballo regresa con otros caballos",
            spanish_description: "Meses después, el caballo regresa trayendo consigo varios caballos de buena raza. Los vecinos lo felicitan, pero el anciano responde: '¿Cómo saben que esto no será una desgracia?'",
            chinese_text: "居數月，其馬將胡駿馬而歸",
            key_elements: ["multiple_horses", "celebration", "old_man_wisdom"]
        },
        {
            scene_number: 3,
            title: "El hijo se lesiona",
            spanish_description: "El hijo del anciano, aficionado a montar, se cae de uno de los nuevos caballos y se rompe la pierna. Los vecinos vienen a dar el pésame, pero el padre dice: '¿Cómo saben que esto no es una bendición?'",
            chinese_text: "其子好騎，墮而折其髀",
            key_elements: ["son", "accident", "broken_leg", "horse"]
        },
        {
            scene_number: 4,
            title: "La guerra y la salvación",
            spanish_description: "Un año después, los bárbaros invaden. Todos los jóvenes aptos deben ir a la guerra y muchos mueren. Solo el hijo del anciano se salva por tener la pierna rota.",
            chinese_text: "胡人大入塞，丁壯者引弦而戰，近塞之人，死者十九",
            key_elements: ["war", "soldiers", "salvation", "broken_leg_blessing"]
        }
    ],
    moral_lesson: "Esta historia enseña que los eventos que parecen desafortunados pueden llevar a resultados positivos, y que no debemos juzgar demasiado rápido si algo es bueno o malo. Refleja la filosofía taoísta de que la fortuna y la desgracia se transforman constantemente una en la otra.",
    cultural_context: "Este chengyu proviene del Huainanzi (淮南子), un texto taoísta del siglo II a.C. Es una de las expresiones idiomáticas chinas más conocidas y se usa para expresar la idea de 'no hay mal que por bien no venga'."
};

// Application state
let currentScene = 0;
let isTransitioning = false;

// DOM elements
let sceneTitle, sceneDescription, chineseText, nextButton, resetButton;
let scenes = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    updateUI();
    setupAFrameComponents();
});

function initializeElements() {
    sceneTitle = document.getElementById('scene-title');
    sceneDescription = document.getElementById('scene-description');
    chineseText = document.getElementById('chinese-text');
    nextButton = document.getElementById('next-scene');
    resetButton = document.getElementById('reset-story');
    
    // Get all scene entities
    for (let i = 1; i <= 4; i++) {
        scenes.push(document.getElementById(`scene${i}`));
    }
}

function setupEventListeners() {
    // Next scene button
    nextButton.addEventListener('click', nextScene);
    
    // Reset button
    resetButton.addEventListener('click', resetStory);
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyboard);
}

function setupAFrameComponents() {
    // Wait for A-Frame to be ready
    const scene = document.querySelector('a-scene');
    
    if (scene.hasLoaded) {
        initializeClickHandlers();
    } else {
        scene.addEventListener('loaded', initializeClickHandlers);
    }
}

function initializeClickHandlers() {
    // Setup click handlers for info panels
    const infoPanels = document.querySelectorAll('[id^="info-panel-"]');
    
    infoPanels.forEach((panel, index) => {
        panel.addEventListener('click', function() {
            if (!isTransitioning) {
                nextScene();
            }
        });
        
        // Also handle cursor-based clicks for VR
        panel.addEventListener('cursor-click', function() {
            if (!isTransitioning) {
                nextScene();
            }
        });
    });
    
    // Add hover effects for panels
    infoPanels.forEach(panel => {
        panel.addEventListener('mouseenter', function() {
            panel.setAttribute('material', 'color', '#FFF700');
        });
        
        panel.addEventListener('mouseleave', function() {
            panel.setAttribute('material', 'color', '#FFD700');
        });
    });
}

function updateUI() {
    if (currentScene === 0) {
        // Welcome screen
        sceneTitle.textContent = 'Bienvenido';
        sceneDescription.textContent = 'Use las teclas WASD para moverse y el mouse para mirar. Haga clic en los paneles dorados para avanzar en la historia.';
        chineseText.textContent = storyData.full_saying;
        nextButton.textContent = 'Comenzar Historia';
    } else if (currentScene <= storyData.scenes.length) {
        // Story scenes
        const scene = storyData.scenes[currentScene - 1];
        sceneTitle.textContent = `Escena ${scene.scene_number}: ${scene.title}`;
        sceneDescription.textContent = scene.spanish_description;
        chineseText.textContent = scene.chinese_text;
        
        if (currentScene === storyData.scenes.length) {
            nextButton.textContent = 'Ver Moraleja';
        } else {
            nextButton.textContent = 'Siguiente Escena';
        }
    } else {
        // Final moral lesson
        sceneTitle.textContent = 'Moraleja de la Historia';
        sceneDescription.textContent = storyData.moral_lesson;
        chineseText.textContent = storyData.cultural_context;
        nextButton.textContent = 'Reiniciar Historia';
    }
}

function nextScene() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    
    if (currentScene === 0) {
        // Start the story
        currentScene = 1;
        showScene(1);
        updateUI();
    } else if (currentScene < storyData.scenes.length) {
        // Move to next story scene
        hideScene(currentScene);
        currentScene++;
        setTimeout(() => {
            showScene(currentScene);
            updateUI();
        }, 500);
    } else if (currentScene === storyData.scenes.length) {
        // Show moral lesson
        currentScene++;
        updateUI();
    } else {
        // Restart from beginning
        resetStory();
        return;
    }
    
    setTimeout(() => {
        isTransitioning = false;
    }, 1000);
}

function resetStory() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    
    // Hide all scenes
    for (let i = 1; i <= 4; i++) {
        hideScene(i);
    }
    
    setTimeout(() => {
        currentScene = 0;
        showScene(1);
        updateUI();
        isTransitioning = false;
    }, 1000);
}

function showScene(sceneNumber) {
    if (sceneNumber >= 1 && sceneNumber <= 4) {
        const scene = scenes[sceneNumber - 1];
        if (scene) {
            scene.setAttribute('visible', 'true');
            scene.classList.add('fade-in');
            
            // Move camera to appropriate position for each scene
            moveCameraForScene(sceneNumber);
        }
    }
}

function hideScene(sceneNumber) {
    if (sceneNumber >= 1 && sceneNumber <= 4) {
        const scene = scenes[sceneNumber - 1];
        if (scene) {
            scene.classList.add('fade-out');
            setTimeout(() => {
                scene.setAttribute('visible', 'false');
                scene.classList.remove('fade-in', 'fade-out');
            }, 500);
        }
    }
}

function moveCameraForScene(sceneNumber) {
    const cameraRig = document.getElementById('cameraRig');
    if (!cameraRig) return;
    
    let newPosition;
    switch (sceneNumber) {
        case 1:
            newPosition = '5 1.6 5';
            break;
        case 2:
            newPosition = '8 1.6 -5';
            break;
        case 3:
            newPosition = '2 1.6 8';
            break;
        case 4:
            newPosition = '-5 1.6 5';
            break;
        default:
            newPosition = '5 1.6 5';
    }
    
    // Smooth camera transition
    cameraRig.setAttribute('animation', {
        property: 'position',
        to: newPosition,
        dur: 2000,
        easing: 'easeInOutQuart'
    });
}

function handleKeyboard(event) {
    if (isTransitioning) return;
    
    switch (event.code) {
        case 'Space':
        case 'Enter':
            event.preventDefault();
            nextScene();
            break;
        case 'KeyR':
            event.preventDefault();
            resetStory();
            break;
        case 'Escape':
            event.preventDefault();
            resetStory();
            break;
    }
}

// A-Frame custom components
AFRAME.registerComponent('cursor-click', {
    init: function() {
        this.el.addEventListener('click', function(evt) {
            // Emit custom event for VR cursor clicks
            this.emit('cursor-click');
        });
    }
});

// Enhanced horse animation component
AFRAME.registerComponent('horse-movement', {
    schema: {
        speed: {type: 'number', default: 1},
        direction: {type: 'vec3', default: {x: 0, y: 0, z: -1}}
    },
    
    init: function() {
        this.direction = new THREE.Vector3(
            this.data.direction.x,
            this.data.direction.y, 
            this.data.direction.z
        );
        this.speed = this.data.speed;
    },
    
    tick: function(time, timeDelta) {
        if (currentScene === 2) {
            const movement = this.direction.clone().multiplyScalar(this.speed * timeDelta * 0.001);
            const currentPosition = this.el.getAttribute('position');
            this.el.setAttribute('position', {
                x: currentPosition.x + movement.x,
                y: currentPosition.y + movement.y,
                z: currentPosition.z + movement.z
            });
        }
    }
});

// Add sound effects (simple beep sounds using Web Audio API)
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.setupAudio();
    }
    
    setupAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    playClickSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
    
    playTransitionSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
}

// Initialize sound manager
let soundManager;
document.addEventListener('DOMContentLoaded', function() {
    soundManager = new SoundManager();
    
    // Add sound effects to interactions
    document.addEventListener('click', function() {
        if (soundManager) soundManager.playClickSound();
    });
});

// Mobile touch controls enhancement
let touchStartY = 0;
let touchStartX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
});

document.addEventListener('touchend', function(e) {
    if (!touchStartY || !touchStartX) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    
    const diffY = touchStartY - touchEndY;
    const diffX = touchStartX - touchEndX;
    
    if (Math.abs(diffY) > Math.abs(diffX)) {
        if (Math.abs(diffY) > 50) {
            if (diffY > 0) {
                // Swipe up - next scene
                nextScene();
            } else {
                // Swipe down - reset
                resetStory();
            }
        }
    }
    
    touchStartY = 0;
    touchStartX = 0;
});

// Performance optimization for mobile
function optimizeForMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Reduce quality for mobile
        const scene = document.querySelector('a-scene');
        scene.setAttribute('renderer', 'antialias: false; colorManagement: true; sortObjects: true; physicallyCorrectLights: false; maxCanvasWidth: 1920; maxCanvasHeight: 1080');
        
        // Simplify fog for mobile
        scene.setAttribute('fog', 'type: linear; color: #EEE; near: 20; far: 60');
    }
}

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', optimizeForMobile);

// Debug info (can be removed in production)
function logSceneInfo() {
    console.log('Current Scene:', currentScene);
    console.log('Story Data:', storyData);
    console.log('Visible Scenes:', scenes.map((scene, index) => ({
        scene: index + 1,
        visible: scene.getAttribute('visible')
    })));
}

// Expose debug function globally
window.logSceneInfo = logSceneInfo;