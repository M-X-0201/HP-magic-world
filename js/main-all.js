
// 核心功能和初始化

// 魔法粒子效果
function createStars() {
    const starField = document.getElementById('star-field');
    const starCount = 150;
    
    for (let i = 0; i &lt; starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = (Math.random() * 3 + 1) + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 2 + 2) + 's';
        starField.appendChild(star);
    }
}

function createParticles() {
    const particleField = document.getElementById('particle-field');
    const particleCount = 50;
    
    for (let i = 0; i &lt; particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        particleField.appendChild(particle);
    }
}

function createSmoke() {
    const smokeEffect = document.getElementById('smoke-effect');
    const smokeCount = 20;
    
    for (let i = 0; i &lt; smokeCount; i++) {
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        smoke.style.left = Math.random() * 100 + '%';
        smoke.style.bottom = '0';
        smoke.style.width = (Math.random() * 200 + 100) + 'px';
        smoke.style.height = smoke.style.width;
        smoke.style.animationDelay = Math.random() * 15 + 's';
        smoke.style.animationDuration = (Math.random() * 10 + 10) + 's';
        smokeEffect.appendChild(smoke);
    }
}

// 音乐管理器
let musicList = [];
let currentAudio = null;
let currentMusicIndex = -1;
let isPlaying = false;
let isMuted = false;

const DEFAULT_MUSIC_LIST = [
    { id: 'every-time-we-touch', name: 'Every Time We Touch', url: 'assets/music/Dream Tunes - Every Time We Touch.mp3', isDefault: true },
    { id: 'days-and-moons', name: 'Days And Moons', url: 'assets/music/Elsa Kopf - Days And Moons.mp3', isDefault: true },
    { id: 'marshmallow-campfire', name: 'Marshmallow Roasting Campfire', url: 'assets/music/Nature Sound Series - Marshmallow Roasting Campfire.mp3', isDefault: true },
    { id: 'holland', name: 'Holland', url: 'assets/music/Novo Amor - Holland.mp3', isDefault: true },
    { id: 'city-of-stars', name: 'City Of Stars', url: 'assets/music/Ryan Gosling,Emma Stone - City Of Stars (From La La Land Soundtrack).mp3', isDefault: true },
    { id: 'rain-totoro', name: 'Rain, Totoro Forest', url: 'assets/music/The Nature Sounds Society Japan - Rain, Totoro Forest.mp3', isDefault: true },
    { id: 'moonlight', name: '月光', url: 'assets/music/水仙LONE,Running johnny - 月光.mp3', isDefault: true }
];

function initMusicManager() {
    musicList = DEFAULT_MUSIC_LIST.map(m =&gt; ({ ...m }));
    currentAudio = document.getElementById('bgAudio');
    currentAudio.volume = 0.3;
    changeVolume(30);
    updateMusicList();
    
    currentAudio.addEventListener('ended', () =&gt; {
        if (musicList.length &gt; 1 &amp;&amp; currentMusicIndex &lt; musicList.length - 1) {
            selectMusic(currentMusicIndex + 1);
            playMusic();
        } else if (musicList.length &gt; 0) {
            currentAudio.currentTime = 0;
            currentAudio.play();
        }
    });

    currentAudio.addEventListener('error', () =&gt; {
        showToast('音乐加载失败，可能是链接不可用');
    });
}

function toggleMusicPanel() {
    const panel = document.getElementById('music-panel');
    panel.classList.toggle('active');
}

function handleMusicUpload(event) {
    const files = event.target.files;
    
    for (let i = 0; i &lt; files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('audio/')) {
            const musicData = {
                id: Date.now() + i,
                name: file.name.replace(/\.[^/.]+$/, ''),
                file: file,
                url: URL.createObjectURL(file),
                isDefault: false
            };
            musicList.push(musicData);
        }
    }
    
    updateMusicList();
    event.target.value = '';
    showToast('音乐已添加到列表');
}

function updateMusicList() {
    const listContainer = document.getElementById('music-list');
    
    if (musicList.length === 0) {
        listContainer.innerHTML = '&lt;div class="no-music"&gt;暂无音乐&lt;/div&gt;';
        document.getElementById('playPauseBtn').disabled = true;
        return;
    }
    
    document.getElementById('playPauseBtn').disabled = false;
    listContainer.innerHTML = '';
    
    musicList.forEach((music, index) =&gt; {
        const item = document.createElement('div');
        item.className = 'music-item' + (index === currentMusicIndex ? ' active' : '');
        
        const deleteBtn = music.isDefault 
            ? '' 
            : `&lt;button class="music-item-delete" onclick="deleteMusic(${index}, event)" title="删除"&gt;✕&lt;/button&gt;`;
        
        item.innerHTML = `
            &lt;div class="music-item-info" onclick="selectMusic(${index})"&gt;
                &lt;span class="music-item-icon"&gt;🎵&lt;/span&gt;
                &lt;span class="music-item-name"&gt;${music.name}&lt;/span&gt;
            &lt;/div&gt;
            ${deleteBtn}
        `;
        listContainer.appendChild(item);
    });
}

function selectMusic(index) {
    if (currentMusicIndex === index &amp;&amp; isPlaying) {
        return;
    }
    
    currentMusicIndex = index;
    const music = musicList[index];
    
    currentAudio.src = music.url;
    currentAudio.load();
    
    if (isPlaying) {
        playMusic();
    }
    
    updateMusicList();
    showToast('已选择：' + music.name);
}

function togglePlayPause() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    if (musicList.length === 0) return;
    
    if (currentMusicIndex === -1) {
        selectMusic(0);
    }
    
    currentAudio.play().then(() =&gt; {
        isPlaying = true;
        updatePlayButton();
        document.getElementById('musicToggleBtn').classList.add('playing');
    }).catch(e =&gt; {
        console.log('播放失败:', e);
        showToast('音乐播放失败，请尝试其他音乐');
    });
}

function pauseMusic() {
    currentAudio.pause();
    isPlaying = false;
    updatePlayButton();
    document.getElementById('musicToggleBtn').classList.remove('playing');
}

function updatePlayButton() {
    const btn = document.getElementById('playPauseBtn');
    btn.textContent = isPlaying ? '⏸ 暂停' : '▶ 播放';
    btn.classList.toggle('playing', isPlaying);
}

function changeVolume(value) {
    currentAudio.volume = value / 100;
    document.getElementById('volumeValue').textContent = value + '%';
    const icon = document.querySelector('.volume-icon');
    if (value == 0) {
        icon.textContent = '🔇';
    } else if (value &lt; 30) {
        icon.textContent = '🔈';
    } else if (value &lt; 70) {
        icon.textContent = '🔉';
    } else {
        icon.textContent = '🔊';
    }
}

function deleteMusic(index, event) {
    event.stopPropagation();
    
    const music = musicList[index];
    if (music.isDefault) return;
    
    if (currentMusicIndex === index) {
        pauseMusic();
        currentMusicIndex = -1;
    } else if (currentMusicIndex &gt; index) {
        currentMusicIndex--;
    }
    
    if (!music.isDefault &amp;&amp; music.url.startsWith('blob:')) {
        URL.revokeObjectURL(music.url);
    }
    
    musicList.splice(index, 1);
    updateMusicList();
    showToast('音乐已删除');
}

// 导航功能
function enterMagicWorld() {
    document.querySelector('header').style.display = 'none';
    document.querySelector('nav').style.display = 'block';
    document.getElementById('music-manager').style.display = 'block';
    showSection('home');
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section =&gt; {
        section.style.display = 'none';
    });
    
    document.getElementById(sectionId).style.display = 'block';
}

function showIntro() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section =&gt; {
        section.style.display = 'none';
    });
    
    document.querySelector('header').style.display = 'flex';
    document.querySelector('nav').style.display = 'none';
    document.getElementById('music-manager').style.display = 'none';
}

function showArticle(articleId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section =&gt; {
        section.style.display = 'none';
    });
    
    document.getElementById(articleId).style.display = 'block';
}

// 鼠标粒子效果
document.addEventListener('mousemove', function(e) {
    if (Math.random() &lt; 0.1) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.animation = 'float 2s ease-out forwards';
        document.getElementById('particle-field').appendChild(particle);
        
        setTimeout(() =&gt; {
            particle.remove();
        }, 2000);
    }
});

// 初始化
function init() {
    createStars();
    createParticles();
    createSmoke();
    initMusicManager();
    updateDateTime();
    setInterval(updateDateTime, 60000);
    requestLocationAndWeather();
    setInterval(requestLocationAndWeather, 3600000);
    initNote();
    renderMoods();
    loadTomatoCount();
    initTools();
    initTheater();
    
    // 自动弹出今日小剧场
    const today = new Date();
    const dateStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    const theaters = getTheatersForDate(dateStr);
    if (theaters.length &gt; 0) {
        setTimeout(function() {
            openTheaterModal(dateStr);
        }, 500);
    }
}

// 页面加载完成后初始化
window.onload = init;

