
        // Create Star Field
        function createStars() {
            const starField = document.getElementById('star-field');
            const starCount = 150;
            
            for (let i = 0; i < starCount; i++) {
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

        // Create Magic Particles
        function createParticles() {
            const particleField = document.getElementById('particle-field');
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
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

        // Create Smoke Effect
        function createSmoke() {
            const smokeEffect = document.getElementById('smoke-effect');
            const smokeCount = 20;
            
            for (let i = 0; i < smokeCount; i++) {
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

        // Music Manager
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
            { id: 'moonlight', name: '月光', url: 'assets/music/水仙LONE,Running johnny - 月光.mp3', isDefault: true },
            { id: 'coastline', name: 'Coastline', url: 'assets/music/Hollow Coves-Coastline.mp3', isDefault: true }
        ];

        function initMusicManager() {
            musicList = DEFAULT_MUSIC_LIST.map(m => ({ ...m }));
            currentAudio = document.getElementById('bgAudio');
            currentAudio.volume = 0.3;
            changeVolume(30);
            updateMusicList();
            
            currentAudio.addEventListener('ended', () => {
                if (musicList.length > 1 && currentMusicIndex < musicList.length - 1) {
                    selectMusic(currentMusicIndex + 1);
                    playMusic();
                } else if (musicList.length > 0) {
                    currentAudio.currentTime = 0;
                    currentAudio.play();
                }
            });

            currentAudio.addEventListener('error', () => {
                showToast('音乐加载失败，可能是链接不可用');
            });
        }

        function toggleMusicPanel() {
            const panel = document.getElementById('music-panel');
            panel.classList.toggle('active');
        }

        function handleMusicUpload(event) {
            const files = event.target.files;
            
            for (let i = 0; i < files.length; i++) {
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
                listContainer.innerHTML = '<div class="no-music">暂无音乐</div>';
                document.getElementById('playPauseBtn').disabled = true;
                return;
            }
            
            document.getElementById('playPauseBtn').disabled = false;
            listContainer.innerHTML = '';
            
            musicList.forEach((music, index) => {
                const item = document.createElement('div');
                item.className = 'music-item' + (index === currentMusicIndex ? ' active' : '');
                
                const deleteBtn = music.isDefault 
                    ? '' 
                    : `<button class="music-item-delete" onclick="deleteMusic(${index}, event)" title="删除">✕</button>`;
                
                item.innerHTML = `
                    <div class="music-item-info" onclick="selectMusic(${index})">
                        <span class="music-item-icon">🎵</span>
                        <span class="music-item-name">${music.name}</span>
                    </div>
                    ${deleteBtn}
                `;
                listContainer.appendChild(item);
            });
        }

        function selectMusic(index) {
            if (currentMusicIndex === index && isPlaying) {
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
            
            currentAudio.play().then(() => {
                isPlaying = true;
                updatePlayButton();
                document.getElementById('musicToggleBtn').classList.add('playing');
            }).catch(e => {
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
            } else if (value < 30) {
                icon.textContent = '🔈';
            } else if (value < 70) {
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
            } else if (currentMusicIndex > index) {
                currentMusicIndex--;
            }
            
            if (!music.isDefault && music.url.startsWith('blob:')) {
                URL.revokeObjectURL(music.url);
            }
            
            musicList.splice(index, 1);
            updateMusicList();
            showToast('音乐已删除');
        }



        // Navigation Functions
        function enterMagicWorld() {
            document.querySelector('header').style.display = 'none';
            document.querySelector('nav').style.display = 'block';
            document.getElementById('music-manager').style.display = 'block';
            showSection('home');
        }

        function showSection(sectionId) {
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            document.getElementById(sectionId).style.display = 'block';
        }

        function showIntro() {
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            document.querySelector('header').style.display = 'flex';
            document.querySelector('nav').style.display = 'none';
            document.getElementById('music-manager').style.display = 'none';
        }

        function showArticle(articleId) {
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            document.getElementById(articleId).style.display = 'block';
        }

        // Mouse Particle Effect
        document.addEventListener('mousemove', function(e) {
            if (Math.random() < 0.1) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = e.clientX + 'px';
                particle.style.top = e.clientY + 'px';
                particle.style.width = '4px';
                particle.style.height = '4px';
                particle.style.animation = 'float 2s ease-out forwards';
                document.getElementById('particle-field').appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 2000);
            }
        });

        // Initialize
        createStars();
        createParticles();
        createSmoke();
        initMusicManager();
        
        function updateDateTime() {
            const dateEl = document.getElementById('currentDate');
            
            if (dateEl) {
                const now = new Date();
                const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
                const dateStr = now.toLocaleDateString('zh-CN', dateOptions);
                const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
                dateEl.textContent = dateStr + ' ' + timeStr;
            }
        }
        
        function getWeatherIconByCode(code) {
            const weatherCodes = {
                0: '☀️',
                1: '🌤️',
                2: '⛅',
                3: '☁️',
                45: '🌫️',
                48: '🌫️',
                51: '🌧️',
                53: '🌧️',
                55: '🌧️',
                56: '🌧️',
                57: '🌧️',
                61: '🌧️',
                63: '🌧️',
                65: '🌧️',
                66: '🌧️',
                67: '🌧️',
                71: '❄️',
                73: '❄️',
                75: '❄️',
                77: '❄️',
                80: '🌦️',
                81: '🌦️',
                82: '🌦️',
                85: '🌨️',
                86: '🌨️',
                95: '⛈️',
                96: '⛈️',
                99: '⛈️'
            };
            return weatherCodes[code] || '☁️';
        }
        
        function getOutfitAdvice(temp) {
            if (temp < 0) return '厚羽绒服+围巾+帽子';
            if (temp < 5) return '羽绒服+围巾';
            if (temp < 10) return '羽绒服+毛衣';
            if (temp < 15) return '薄外套+毛衣';
            if (temp < 20) return '卫衣+长裤';
            if (temp < 25) return 'T恤+薄外套';
            if (temp < 30) return '短袖短裤';
            return '短袖+空调衫';
        }
        
        function updateWeatherDisplay(temp, weatherCode) {
            const weatherIconEl = document.getElementById('weatherIcon');
            const weatherTempEl = document.getElementById('weatherTemp');
            const outfitTextEl = document.getElementById('outfitAdvice');
            
            if (weatherIconEl) {
                weatherIconEl.textContent = getWeatherIconByCode(weatherCode);
            }
            
            if (weatherTempEl) {
                const minTemp = Math.round(temp - 3);
                const maxTemp = Math.round(temp + 3);
                weatherTempEl.textContent = minTemp + '-' + maxTemp + '°C';
            }
            
            if (outfitTextEl) {
                outfitTextEl.textContent = getOutfitAdvice(temp);
            }
        }
        
        function updateWeatherDisplayWithRange(minTemp, maxTemp, weatherCode) {
            const weatherIconEl = document.getElementById('weatherIcon');
            const weatherTempEl = document.getElementById('weatherTemp');
            const outfitTextEl = document.getElementById('outfitAdvice');
            
            if (weatherIconEl) {
                weatherIconEl.textContent = getWeatherIconByCode(weatherCode);
            }
            
            if (weatherTempEl) {
                const roundedMin = Math.round(minTemp);
                const roundedMax = Math.round(maxTemp);
                weatherTempEl.textContent = roundedMin + '-' + roundedMax + '°C';
            }
            
            if (outfitTextEl) {
                const avgTemp = (minTemp + maxTemp) / 2;
                outfitTextEl.textContent = getOutfitAdvice(avgTemp);
            }
        }
        
        function getRealTimeWeather(lat, lon) {
            console.log('正在获取天气数据...', { lat, lon });
            const url = 'https://api.open-meteo.com/v1/forecast';
            const params = new URLSearchParams({
                latitude: lat,
                longitude: lon,
                current: 'temperature_2m,weather_code',
                daily: 'temperature_2m_max,temperature_2m_min',
                timezone: 'auto',
                forecast_days: 1
            });
            
            const fullUrl = `${url}?${params.toString()}`;
            console.log('请求URL:', fullUrl);
            
            fetch(fullUrl)
                .then(response => {
                    console.log('响应状态:', response.status);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('获取到的天气数据:', data);
                    if (data.daily && data.daily.temperature_2m_min && data.daily.temperature_2m_max) {
                        const minTemp = data.daily.temperature_2m_min[0];
                        const maxTemp = data.daily.temperature_2m_max[0];
                        const currentTemp = data.current ? data.current.temperature_2m : (minTemp + maxTemp) / 2;
                        const weatherCode = data.current ? data.current.weather_code || 3 : 3;
                        updateWeatherDisplayWithRange(minTemp, maxTemp, weatherCode);
                        console.log('成功获取真实天气数据:', { minTemp, maxTemp, currentTemp, weatherCode });
                    } else if (data.current && typeof data.current.temperature_2m === 'number') {
                        const temp = data.current.temperature_2m;
                        const weatherCode = data.current.weather_code || 3;
                        updateWeatherDisplay(temp, weatherCode);
                        console.log('成功获取真实天气数据(仅当前温度):', { temp, weatherCode });
                    } else {
                        throw new Error('无效的天气数据');
                    }
                })
                .catch(error => {
                    console.log('获取天气失败，使用备用天气数据:', error);
                    updateWithFallbackWeather();
                });
        }
        
        function requestLocationAndWeather() {
            if ('geolocation' in navigator) {
                console.log('正在尝试获取地理位置...');
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        console.log('成功获取地理位置:', { lat, lon });
                        getRealTimeWeather(lat, lon);
                    },
                    (error) => {
                        console.log('无法获取位置，使用备用天气数据:', error);
                        // 即使获取位置失败，也尝试使用默认位置获取天气
                        // 使用北京的默认位置作为备选
                        getRealTimeWeather(39.9042, 116.4074);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 300000
                    }
                );
            } else {
                console.log('浏览器不支持地理位置，使用默认位置获取天气');
                // 使用北京的默认位置作为备选
                getRealTimeWeather(39.9042, 116.4074);
            }
        }
        
        function updateWithFallbackWeather() {
            const now = new Date();
            const month = now.getMonth();
            const day = now.getDate();
            
            // 根据月份和日期计算一个更接近实际的温度
            let baseTemp;
            if (month >= 2 && month <= 4) {
                baseTemp = 10 + (month - 2) * 4 + Math.min(day, 15) / 5;
            } else if (month >= 5 && month <= 7) {
                baseTemp = 22 + (month - 5) * 5 + Math.min(day, 20) / 4;
            } else if (month >= 8 && month <= 10) {
                baseTemp = 32 - (month - 8) * 4 - Math.min(day, 20) / 5;
            } else if (month >= 11 || month == 0) {
                baseTemp = 8 - (month == 0 ? 0 : month - 11) * 5 - Math.min(day, 15) / 3;
            } else {
                baseTemp = 15;
            }
            
            // 添加一些随机变化，使温度看起来更真实
            const randomVariation = (Math.random() - 0.5) * 4;
            const temp = baseTemp + randomVariation;
            
            // 根据温度选择天气代码
            let weatherCode;
            if (temp < 0) {
                weatherCode = 71; // 雪
            } else if (temp < 10) {
                weatherCode = 3; // 多云
            } else if (temp < 20) {
                weatherCode = 1; // 晴间多云
            } else if (temp < 30) {
                weatherCode = 0; // 晴天
            } else {
                weatherCode = 95; // 雷雨
            }
            
            updateWeatherDisplay(temp, weatherCode);
        }
        
        function getWeatherByMonth(month) {
            const weatherData = [
                { temp: '-2-5°C', outfit: '厚羽绒服+围巾', icon: '❄️' },    // 1月
                { temp: '0-8°C', outfit: '羽绒服+毛衣', icon: '☁️' },       // 2月
                { temp: '8-15°C', outfit: '薄外套+长袖', icon: '🌤️' },    // 3月
                { temp: '14-22°C', outfit: '卫衣+长裤', icon: '🌸' },       // 4月
                { temp: '20-28°C', outfit: 'T恤+薄外套', icon: '☀️' },      // 5月
                { temp: '25-35°C', outfit: '短袖短裤', icon: '🌞' },          // 6月
                { temp: '28-38°C', outfit: '短袖+空调衫', icon: '🌻' },      // 7月
                { temp: '26-35°C', outfit: '短袖短裤', icon: '🌤️' },        // 8月
                { temp: '20-28°C', outfit: '长袖+薄外套', icon: '🍂' },     // 9月
                { temp: '14-22°C', outfit: '卫衣+长裤', icon: '🍁' },         // 10月
                { temp: '8-15°C', outfit: '薄外套+毛衣', icon: '☁️' },      // 11月
                { temp: '0-8°C', outfit: '羽绒服+围巾', icon: '❄️' }        // 12月
            ];
            return weatherData[month];
        }
        
        updateDateTime();
        setInterval(updateDateTime, 60000);
        requestLocationAndWeather();
        setInterval(requestLocationAndWeather, 3600000);

        /* ===== 迁移的功能 ===== */

        // 数据定义
        const IRIS_NOTES = [
            { t: '"I wanna be defined by the things that I love. Not the things I\'m afraid of."', a: "Taylor Swift · Daylight" },
            { t: '"I\'m still a believer, but I don\'t know why. I\'ve never been a natural, all I do is try, try, try."', a: "Taylor Swift · Mirrorball" },
            { t: '"I\'d like to be my old self again, but I\'m still trying to find it."', a: "Taylor Swift · All Too Well" },
            { t: '"This is me trying."', a: "Taylor Swift · this is me trying" },
            { t: '"You drew stars around my scars, but now I\'m bleeding."', a: "Taylor Swift · Cardigan" },
            { t: '"Long live all the mountains we moved, I had the time of my life fighting dragons with you."', a: "Taylor Swift · Long Live" },
            { t: '"She lost him, but she found herself, and somehow that was everything."', a: "Taylor Swift · Out of the Woods" },
            { t: '"It\'s a new soundtrack I could dance to this beat. The lights are so bright But they never blind me."', a: "Taylor Swift · Welcome to New York" },
            { t: '"The best people in life are free."', a: "Taylor Swift · New Romantics" },
            { t: '"Honey life is just a classroom. Cause baby I could build a castle out of all the bricks they threw at me."', a: "Taylor Swift · New Romantics" },
            { t: '"The rest of the world was black and white. But we were in screaming color."', a: "Taylor Swift · Out of the Woods" },
            { t: '"But the monsters turned out to be just trees."', a: "Taylor Swift · Out of the Woods" },
            { t: '"我把细微的事物收集起来，好在未来贫瘠的日子里，让过去的微光带给我温暖。"', a: "安德烈·艾席蒙" },
            { t: '"纵使天光终将熄灭，我们也要歌颂太阳。"', a: "巴尔蒙特" },
            { t: '"生命有点像一阵风，虽然我们看不见，却能感受风吹来的那一刻。"', a: "肖纳·英尼斯" },
            { t: '"是的，我很重要。我们每一个人都应该有勇气这样说。重要并不是伟大的同义词，它是心灵对生命的允诺。"', a: "毕淑敏" },
            { t: '"人们赞美而认为成功的生活，只不过是生活中的这么一种。为什么我们要夸耀这一种而贬低别一种生活呢？"', a: "亨利·戴维·梭罗" },
            { t: '"乍展芭蕉。欲眠杨柳，微谢樱桃。谁把春光，平分一半，最惜今朝。"', a: "顾贞观" },
            { t: '"智慧不是关于死亡的默念，而是对于生命的沉思。"', a: "巴鲁赫·斯宾诺莎" },
            { t: '"如果你总是和别人一起做他们做的事，你又怎么能知道自己是谁呢？"', a: "厄休拉·勒古恩" },
            { t: '"我缓缓步入我的内心，穿过一片铠甲林立的森林。"', a: "托马斯·特朗斯特罗姆" }
        ];

        const FOCUS_DB = [
            { name: "", txt: "专注地爱你自己。" },
            { name: "Blaise", txt: "效率是唯一的优雅。别让杂念浪费你的时间。" },
            { name: "Sarah", txt: "慢慢来也可以。" },
            { name: "Noah", txt: "五分钟就行。别跟脑子吵架，先动起来！" }
        ];

        const MOODS = ['🌤️ 平静', '✨ 闪耀', '🌧️ 低落', '🌿 治愈', '🔥 动力'];

        const THEATER_DATA = [
            { date: '2024-03-10', author: 'collab', content: '如想完整观看，请点击：作品-同人文-City of stars\n\n凯瑟琳看见塞拉有些难受的样子，以及听见她的叹息声，心痛无比。"得找个法子让她开心点。"凯瑟琳嘟囔着，于是她找到了那个"小心眼"的别人，索要了点东西，并在精心准备的食物旁留下了纸条。\n"Hope the food can make you better."\n\nDear Sarah,\nMerry Christmas.\nOh, there\'s another thing. Next time, don\'t bring your friend to OUR PLACE, or I\'ll break your legs.\nNoah.' },
            { date: '2024-03-26', author: 'cathy', content: '根据"可靠消息来源"，诺亚思考片刻拿过桌上的牛皮纸：\nIf you truly feel tired, just rest for some time.That doesn\'t matter!And I\n"改成我们！"冰凉的魔杖抵在诺亚下颌处，他听见对方"恶狠狠"地说，"改了，不然我现在就把你杀了！"\n诺亚毫不遮掩地翻了个白眼："要不是因为你是她好朋友。"他将羽毛笔握得更紧了点。\nAnd WE will always be by your side!///(^v^)\\\\\\\n凯瑟琳意满离。\n\n塞拉收到纸条后十分感动，决定将纸条郑重地收纳起来，小剧场时代就此拉开帷幕～' },
            { date: '2024-03-28', author: 'cathy', content: '关于塞拉因洗澡姗姗来迟时，大家的反应：\n\n凯瑟琳：Hello, beautiful girl!(内心OS：好可爱好可爱好可爱🥰)\n塞拉：（优雅得体，谦虚道谢）Thank you~\n\n某诺：Hello, beautiful girl~\n塞拉：（脸红害羞，不知所措）\n凯瑟琳：（乱入）（误听）（用书本重重击打某诺头部）（咆哮）少撩我家小塞拉！\n塞拉：（无奈）（扶额）（退出群聊）\n\n-To Be Continued-' },
            { date: '2024-03-29', author: 'cathy', content: '关于塞拉退出群聊后的后续：\nC：（攻击）昏昏倒地\nN：（成功躲避）（攻击）霹雳一闪\nC：（防御）盔甲护身（中文防御）金钟罩、铁布衫（语言攻击）诺亚小贼！吃我一击！（使用肉体武力攻击）\nN：（皱眉）你在说什么鬼东西？（停止攻击）\nC：（面色神秘）The great Chinese magic~\nN：（好奇）（想知道）（碍于面子不想问）\nC：（趁机攻击）飞鸟群群！（逃跑）幻影移形\nN：（黑脸）Fucken!（攻击攻击他的小鸟）\n\n某诺情绪不佳，回到休息室，发现塞拉。\nS：（抬头）你挂彩了，亲爱的。\nN：（咬牙切齿）我迟早有一天把她给杀了\n\n-over-' },
            { date: '2024-03-30', author: 'cathy', content: '关于放假如何回家：\n"小塞拉，"凯瑟琳抱住塞拉的手臂，一脸谄媚，"怎么说，是不是要跟我一起坐\'小飞车\'回家？！"\n"emmmm……"塞拉略显尴尬，面露愁容。\n"她跟我一起坐地铁，你别想了。"\n"什么？？！！"凯瑟琳不可思议地看向她可爱的室友并狂叫，"又被他捷足先登了？！"\n但凯瑟琳迅速转向诺亚。"是你！肯定是你搞的鬼！"她从口袋里拿出魔杖，"你是不是偷偷给她喝迷情剂了？！"\n"不！"她表现得痛彻心扉，"我们小白菜被猪拱了！"凯瑟琳脱口而出的中文让塞拉"扑哧"一下笑出来。\n某诺一头雾水："什么？她又在说什么咒语？"\n"没，她夸你帅。"' },
            { date: '2024-03-31', author: 'cathy', content: '"塞拉，宾斯教授说了啥？我刚刚睡……"凯瑟琳转过头发现对方正闭着眼睛，安详地靠在诺亚肩上。\n想刀一个人的眼神是藏不住的。\n「她怎么靠在你身上？！」凯瑟琳面目狰狞，对某诺做口型。\n诺亚挑了挑眉。「因为我帅」（假笑）（继续听课）' },
            { date: '2024-04-01', author: 'cathy', order: 1, content: '凯瑟琳：\n"Dearest Sarah,\nI\'m not a DOCTOR.BUT I can be a prayer that wish you can get better soon."\n\n"你在偷偷干什么？"诺亚挑眉问道。\n"撬你墙角。"\n\n-To Be Continued-' },
            { date: '2024-04-01', author: 'cathy', order: 2, content: '关于某诺发现凯瑟琳在撬他墙角的后续：\n诺亚趁其不备，抽走凯瑟琳手中的纸条，露出得逞的笑容："把我加上，不然杀了你。"\n冰冷的魔杖抵在凯瑟琳后脖颈，她觉得自己的生命真的受到了威胁。\n（咬牙切齿）"……好，你还给我，我加上。"凯瑟琳拿过纸条刚要坐下，突然看向休息室门口，并招手，"塞拉！这边！"\n诺亚立刻转过头："她不在啊，你看……"\n他皱着眉再转回来，对方早不见了踪影。\n"……好好好，真是好样的。"\n再看到那个"可恶的"家伙时，是塞拉挽着她说说笑笑地走进来。\n凯瑟琳：（邪魅一笑）' },
            { date: '2024-04-02', author: 'cathy', order: 1, content: '塞拉对于身旁两个人，一人挽着她的一个胳膊、默不作声且并排走在走廊里，感到异常奇怪。\n很显然，两个人都心怀鬼胎。\n"……你们……今天怎么都不说话？"\nC：（保持沉默）（伺机而动）\nN：（保持沉默）（伺机而动）\nS：……我真服了。\n终于走到宾斯教授的教室，趁着诺亚和另一个同学争论究竟谁才是好莱坞最好的影星之际，凯瑟琳以迅雷不及掩耳之势将准备好的纸条塞给塞拉。\n"I\'ve heard that this color can make one feel better."' },
            { date: '2024-04-02', author: 'cathy', order: 2, content: '此时医疗翼的门口有一男一女两名巫师面面相觑。\n"你怎么也在这里？"\n"你怎么也在这里？"\n诺亚翻了个白眼："为什么哪都有你？"\n"笑死，我也想问这个问题。"\n不过，他们似乎很快达成了统一战线。\n塞拉尽量放轻声音以图蒙混过关："emmm，我可以不……"\n"不可以！""不行！"\n塞拉欲哭无泪："呵呵，你们真的都是我的\'好\'朋友。"（咬牙切齿）\n在两个"监视器"的监视下，塞拉觉得自己快要喝成苦瓜大王了。\n等监视器们去上课后，塞拉发现床头有一颗薄荷糖和一颗麻花。\n\n中国人懂中国胃\nC.' },
            { date: '2024-04-06', author: 'cathy', content: '关于住院期间的小插曲：\n"一会上课了，你好好休息，"凯瑟琳帮塞拉整理了下身上的被子，"放心，我会好好记笔记的！到时候你就看我的！"\n"哦？你是说边睡边记吗？那你还是算了吧，"诺亚没好气地说，"别到时候啥都没记上却给我的女朋友呈上你最新鲜的口水。"\n被中伤的凯瑟琳开启怒发冲冠技能："我不能生气！生气不值得！我不生气！"\n\n当天弗利维教授的课一结束，凯瑟琳就立刻冲到他面前。\nC：（充满求知欲）（两眼放光）教授，怎么样才能悄无声息地嘎掉一个人？！' },
            { date: '2024-04-07', author: 'cathy', order: 1, content: '国际巫师及巫师联合署考虑到中国新年于远渡重洋的中国学子的非凡意义，将中国新年也设为学校的法定假日之一。\n某诺以司德里安夫妇不顾自己死活为由坚决要跟塞拉……好吧是塞拉和凯瑟琳一起"回"中国。\n\n"啊啊啊啊啊！我～亲～爱～的～火～锅～"凯瑟琳恨不得将自己炙热的吻严丝合缝地奉献给炙热的汤锅。\n"疯子。"哦，熟悉的白眼。\n塞拉将牛肉在辣锅里涮了涮，"好心"地夹给诺亚。\n「她果然很爱我。」没有丝毫迟疑的下咽看得其余两人眉毛一抽。\n"怎么样，好吃吧？"\n诺·辣得说不出话·亚「……她果然很"爱"我」' },
            { date: '2024-04-07', author: 'cathy', order: 2, content: '"喂，大哥，看啥呢这么出神？"凯瑟琳敏锐地发现某人的耳朵正在变红，立即拉响警报，迅速从口袋里掏出魔杖，"好啊！你是不是把我家小塞拉给绿了？！我弄死你！！"\n诺亚这次好心地没有翻白眼，看了眼凯瑟琳身后："你先管好你自己吧。"\n\n"Hello,beautiful……不行，这个用过了。"\n"My beauty? … Jesus，太油腻了。"\n"你在嘀咕什么呢？"诺亚感到有人轻拍他的肩膀。\nN：（僵硬）（脸红）（心口小鹿乱撞）……你今天美翻了，亲爱的。\n（C：我也这么觉得！！！）' },
            { date: '2024-04-09', author: 'cathy', order: 1, content: '"小姐们！来一张吗？很便宜！只要三个铜纳特！"小伙热情地招呼。\n两个女孩很爽快地给了钱。\n"三，二，一！"\n塞拉突然感觉有什么东西飞过去了……\n"嗯？怎么是你？凯希呢？"塞拉看着照片里的一男一女，感到奇怪。\n「难道飞出去的东西是凯希？」\n"她？她刚刚去找那个斯莱特林了。"\n"跑这么快……"\n"你帅气的男朋友还在这里，就不要再想别人了。"\n塞拉：（脸红）\n此时此刻，被推在墙角的凯瑟琳：\n"司德里安！你下次再推我一次试试看呢？！？！"（死亡微笑）\n\n-To Be Continued-' },
            { date: '2024-04-09', author: 'cathy', order: 2, content: '没过多久塞拉就看见凯瑟琳举着魔杖，怒气冲冲地向她们走来："来吧！司德里安！我们决斗！"\n某诺一脸无辜，表示疑惑。哦，他往塞拉身后躲了躲。\n"为什么处处与我作对？！你今天必须跟我道歉！！！"\n"如果我不道呢？"\n塞拉觉得凯瑟琳离变身绿色浩克已经不远了。\nC：（咬牙切齿）……那我也不能拿你怎么样……但你还欠我三个铜纳特！！\n\n—over—' },
            { date: '2024-04-10', author: 'cathy', content: '"弗洛伊毛虫与曼德拉草放入坩埚加热混合会得到什么？"斯内普话音一落，空旷的教室鸦雀无声。\n"泰勒小姐，你看上去已经胸有成竹了，你来回答。"\n"会……会得到……"\n"石化解药的汤底！"塞拉小声提醒。\n"得到……得到石化……石化……"凯瑟琳平生第一次恨自己只长了两只耳朵，就要听清的那一刻！\n"得到石化解药的汤底。"尽管感到他可爱的女朋友狠狠掐了他一下，他还是没忍住。\n"这个知识点回去抄五遍，泰勒小姐你应该好好复习复习，你昨天的作业质量是我从教这么多年见过最差的。"\n"还有，谢谢你的提醒，司德里安先生。但下次没有我的允许请不要在我的课上随意张开你的嘴巴。"\n心如死灰的凯瑟琳不禁转向某诺：「为什么害我？！？」\n「嫉妒使人面目全非。」\n「靠！可是你根本不需要提醒！」' },
            { date: '2024-04-11', author: 'cathy', content: '薄荷绿的裙摆在草坪上方飞舞。\n诺亚极不自然地咳了一声。\n"哟，你还有娇羞的一天啊。"\n"你别忘了答应我的事。"\n"放心放心，绝对忘不了，"凯瑟琳看了眼不远处四处张望的塞拉，"你赶紧去吧，别让我家小塞拉等急了。"\n\n塞拉能感受到有熟悉的茉莉香在靠近，转过头，果然——\n"等急了？"\n"……没有。"\n清香在一瞬间涌入鼻腔，不似平日他衬衫上的香水味，是鲜花的香气。\n诺亚将塞拉接过花束，拉过她的手跑过前方的拱门。在通过的一刹那，有洁白的茉莉花瓣从空中落下。\n"想好什么时候成为司德里安太太了吗？"\n\n远处。\nC：（？？！！）（瞪作者）磕CP呢！怎么还有我镜头？！\n\n有情人终成眷属。' },
            { date: '2024-04-15', author: 'cathy', content: '塞拉一觉醒来，只觉腰部酸痛\n「生理期和睡姿叠buff，真是天要我亡」，目光扫到桌上的小纸条\nSorry for not accompanying you!\n"肯定去找扎比尼了，"塞拉撇了撇嘴，"见色忘友。"\n"那你也见色忘友不就好了？"诺亚将冒着热气的杯子放在桌上，手上还有一包不知是什么东西。\n"特制姜片茉莉花茶，有功效，无姜味，尝尝看？"\n塞拉有些怀疑地看向他。\n"这可是你帅气无比的男朋友亲手熬制的，不许吐出来，不然打断你的腿。"\n"还有这个，艾灸贴，睡觉前贴一个，"他把塞拉圈进怀里，吻落在她的发顶，"不舒服就别写了，明天用我的。早点休息，晚安。"\n塞拉躺在床上，摸了摸自己仍有些发烫的脸。「aaaaa！太没出息了！！！」' },
            { date: '2024-04-19', author: 'cathy', content: '有很多时候，她觉得"爱"这个字就要被脱口而出了。但仿佛咒语一般，总跨不过最后一条线。\n"怎么不去跳舞？"\n小花园很清静，只有零星的几声蝉鸣。\n"……我不会。"\n"这有什么？"诺亚上前牵起塞拉的手，"重在尽兴，不在乎动作。"\n月光之下，塞拉看见地上的影子分分合合。\n剪影绘出独属于两个人的故事。\n"教得不错，"塞拉停顿一秒，只有一秒，"男朋友。"\n\n[拉文克劳男生寝室]\n"司德里安？怎么了？"杰德被这位每天回到寝室只有爆脾气的男孩罕见的笑容吓坏了。\n"哎，这新婚的感觉竟该死的甜美。"本来还想说些什么，但最后只拍了拍杰德，"算了，我说了你也体会不到。"\n？？？不是，哥们你秀恩爱也就算了，攻击我算几个意思？' },
            { date: '2024-04-23', author: 'cathy', content: 'Picnic DAY\n四人小分队中很显然有部分"消极分子"对"四人行"的安排极不满意。\nC：（两眼放光）塞拉！想不想吃冰淇淋？！（苍蝇搓手）\nS：走！冲！\n剩下的两个人大眼瞪小眼。\nN：你还欠我女朋友上次的跑腿费。\nB：你还欠我女朋友三个铜纳特。\n买完冰淇淋的凯瑟琳和塞拉看着不远处"相谈甚欢"的两个人。\nC：（津津有味）我好像有点磕他们了。\nS：（津津有味too）嗯，我也是。' },
            { date: '2024-04-28', author: 'cathy', content: '"究竟是谁给你灌了迷魂汤，让你对魁地奇跃跃欲试。"\n"可是凯希说这真的……"\n"哦，我就知道是她。"诺亚翻了个白眼，"Jesus，她真该去格兰芬多而不是呆在拉文克劳。"\n此时此刻正在家里补魔药论文的凯瑟琳打了个喷嚏："谁又在骂我？"\n尽管说着阻止的话，诺亚还是为塞拉准备好护具并仔仔细细检查头盔和护具的安全性。\n"你要是敢从扫帚上摔下来，"诺亚挑了挑眉，"你帅气无比的男朋友就敢在下面接住你。"\n「梅林，他一定觉得自己帅呆了。」' },
            { date: '2024-05-09', author: 'cathy', content: '快问快答专栏「诺亚场」\n本台记者：大佐痱子（下称大佐）\n大佐：第一次相遇的……\nN：1992年8月27日下午4点01分，丽痕书店进门向右的拐角处，主要是因为我太帅了（被人拧了腰而突然面目狰狞但没有放弃说话）所以她一直盯着我看。\n大佐：「kswl」最开心的时刻？\nN：她第一次喊我男朋友的时候。\n大佐：最想和对方做的事情？（意味深长）\nN：（瞄了眼塞拉）（思索片刻）（耳朵莫名变红）咳，环游世界。\n某诺内心OS：Come to bed！Come to bed！Come to bed！\n本台记者大佐报道。' },
            { date: '2024-05-10', author: 'cathy', content: '"You\'ll know what we mean."\n\nTHE BRIGHT DAYS AREN\'T FAR AWAY.' },
            { date: '2024-05-20', author: 'cathy', content: '"没想到中国文化已经流行到这个地步了？！"塞拉看着被拐走的一脸花痴的凯瑟琳，再一次感叹中华文化的魅力无穷。\n无奈回到休息室，一想到还有三篇十二寸的论文，塞拉就头疼。刚准备去图书馆的动作却被眼前墨绿色的礼物盒打断。\n"不拆不准走。"听语气真的很无赖，于是塞拉给了他一拳。不过不得不承认，诺亚眼光确实不错。草绿的发带两边镶了米白的蕾丝花边，正中间是一朵栩栩如生的茉莉花。\n哦，还有不可忽视的花的清香。\n"我看你头发长长了，用发带应该会更漂亮。"诺亚边说边帮塞拉将头发拢起。\n"花上施了咒，香味会持续很长时间，这样，我不在的时候你就不会太寂寞，除了会更想我……"\n很好，恭喜司德里安先生再获铁拳一枚。' },
            { date: '2024-05-25', author: 'cathy', content: '走廊。\n"姐姐，你知道魔药教室在哪吗？"\n塞拉回头看见一个洋娃娃一样的小女孩正拉着自己袍子的一角，脸上是明显的焦急。\n「大概快迟到了」塞拉想。\n谁能拒绝一个美丽可爱又有礼貌的小姑娘啊！\n塞拉当下就给她指了指不远处的拐角。\n"前面拐弯后右手边就是。"\n"好的，谢谢姐姐！"\n看着她跑远的身影，塞拉脸上露出自己都没察觉的温柔慈祥。等回过头只见诺亚正用奇怪的眼神看向自己。\nN：（面红耳赤有些狰狞）你……喜欢这种？\nS：「？？？」什么喜欢？\n对方似乎下了很大的决心才说出："喜欢叫你姐姐的。"\n塞拉白给诺亚一脸吃了鼻涕虫的表情，说："什么啊！我才不喜欢！"' },
            { date: '2024-05-31', author: 'cathy', content: '为了给上黑魔法防御术课里足够决斗的场地，学生们纷纷起身移动书桌。\n很多拉文克劳的学生选择用魔杖解决，但眼看到处乱飞的书桌，塞拉和凯瑟琳相视一眼还是决定脚踏实地地实行"地面经济"。\n不过仍没能阻止意外发生。下台阶的过程中沉重的书桌呈现倾斜状不幸压到了塞拉的脚。凯瑟琳刚想开口询问，却只见一个身影迅速靠近并同时摆好了桌子。\n看着诺亚硬生生隔在自己和塞拉之间，凯瑟琳只觉前所未有的无语。\nC：我又不会吃了她……（小声辩解）\nN：你再靠近我就告诉扎比尼你晚上梦游嘴里喊着别的男人的名字。\nC：（黑脸）（忍无可忍）喂！可是那是我爸！\nS：其实我的脚趾挺好的，还没有骨折……\nC：（高举手）教授，我现在要和司德里安决斗！' },
            { date: '2024-06-05', author: 'collab', content: '「高中最后一场」\n（前提：中国旅游四人组）\n"有古筝！塞拉！"凯瑟琳向走进来的塞拉做了个"请"的姿势，"大师，请弹～"\n塞拉回她一个曲膝礼："这家店主真有情调。"话音刚落，悠扬的琴声顿时充斥整间房屋，高潮如高山流水般宏大，结尾泛音灵动如空谷幽兰。\n曲毕，C"泣"，N"亦泣"。\n"Jesus……""梅林……"\nC："仙女下凡了，我毫不夸张。"\nN："不是仙女，是神女。"\nC："好，你这次说得对。"\nN："我建议霍格沃兹把每年的校歌时间改为我女朋友的独奏。"\nC："臣附议！"\nB："暴民①，你如果还有点人性，就应该过来跟我一起搬行李，而不是一脸花痴地在原地生根发芽。"（咬牙切齿）（但微笑）\n注：①此处"暴民"指司德里安，出处见《一千零三万（上）》\n\nNotice\n善始善终。\n高中小剧场到今天将告一段落，\n但不是永别！\n您或将开启新的篇章，\n但霍格沃兹的大门永远向你敞开。\n凯希也将继续陪伴塞拉。❤️\n\nS：两年后回看，你的确做到啦～\n(*＾∀＾)人(＾∀＾*)' },
            { date: '2025-05-20', author: 'sarah', order: 1, content: '温室是个好地方，奇花异草应有尽有。此刻塞拉和诺亚像两个采花大盗，不放过任何一盆花草地巡视着。起因是塞拉某次草药课出温室时闻到一股无比清新舒心的香味，这个香味萦绕许久不散，具有探究精神的塞拉发誓一定要找到是什么植物。\n至于为什么是这一天，因为这一天有一个免费劳动力，而且温室可以躲避随处可见的小情侣！\n两个人勤勤恳恳地边闻边记录下可疑对象，一直到第五间温室，某个角落的幽香一下子激发了塞拉的普鲁斯特效应，她当即冲过去惊呼天助我也，接着开始大口呼吸。\n身后的茉莉香渐渐钻入鼻腔。\nN：这就是你要找的？栀子花？\nS：Yesyes！千真万确，记忆犹新！\nN：So？接下来呢？\nS：（人类的本质是复读机）So?\nN：（沉默是今晚的黑湖）陪你找了半天，你竟然真的只是单纯找东西？我想象中给我的惊喜呢？甚至你最后找的还不是茉莉花。\nS：惊喜？（绷不住）你不是自己说在想象里吗？\nN：不管，我要补偿。（面对面凑近）不给我就自己创造惊喜。' },
            { date: '2025-05-20', author: 'sarah', order: 2, content: '凯希认为自己还是低估了布雷斯的实践力。此刻，霍格沃茨礼堂举行的5•20特别派对盛况空前，甚至有堪比情人节的势头，毕竟谁会放弃利用一切节日狂欢的机会？而这两个人，竟然一反众人的潮流，在船上感受着真正的潮流。\nC：泛舟黑湖，这对吗？\nB：不对吗？（露出无害的微笑）\n布雷斯先用魔杖给双方施了一个防水防湿咒，然后把魔杖探入湖面之下，船身突然开始剧烈摇晃起来。\n混乱之间，凯希仿佛听见塞拉那句"好危险啊"从记忆中很浅的地方传来。随着一道咒语的白光闪过，凯希在落入水中前被布雷斯及时拽住了胳膊。\n于是……两个人一起掉进了黑湖。\nB：（笑出声）紧张什么，我以为你曾经已经看过这个电影了。（被打）想说话可以说，刚刚给你施了泡头咒。\nC：（开麦反问）掉进黑湖浪漫的点在……？\nB：（拉近）不浪漫，但可以创造浪漫的机会。\n距离喧闹的礼堂几百米的水下，有人发现了接吻不必换气的天才方法。\nC：这算是人工呼吸吗？\nB：不算，只是单纯想亲你。\n\nP.S.泡头咒的主要功能是在施法者的头部生成一个透明的气泡状物体，这个气泡能够提供足够的氧气，使施法者能够在水下正常呼吸。施法者可以在气泡内自由呼吸，就像在空气中一样，不会感到窒息或缺氧。个人理解，氧气的供给是按需提供，所以想要多少氧气就会产生多少。' }
        ];

        // 番茄钟状态常量
        const TOMATO_FOCUS = 'focus';
        const TOMATO_BREAK = 'break';

        // 计时器状态
        let timer = null;
        let isRest = false;
        let timeLeft = 25 * 60;
        let tomatoes = 0;
        const fMin = document.getElementById('fMin');
        const bMin = document.getElementById('bMin');
        const timeLabel = document.getElementById('timeLabel');
        const progress = document.getElementById('progress');
        const ring = document.getElementById('timerRing');

        function updateUI() {
            const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
            timeLabel.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            const total = (isRest ? bMin.value : fMin.value) * 60;
            progress.style.strokeDashoffset = 283 * (1 - timeLeft / total);
        }

        fMin.oninput = bMin.oninput = () => {
            if(!timer) {
                timeLeft = (isRest?bMin.value:fMin.value)*60;
                updateUI();
                showRandomQuote();
            }
        };

        function showRandomQuote() {
            const q = FOCUS_DB[Math.floor(Math.random() * FOCUS_DB.length)];
            document.getElementById('focusQuote').textContent = q.name ? `「${q.txt}」 —— ${q.name}` : `「${q.txt}」`;
        }

        document.getElementById('toggleBtn').onclick = function() {
            if (timer) {
                clearInterval(timer); timer = null; this.textContent = "继续专注";
                ring.classList.remove('breathing');
            } else {
                ring.classList.add('breathing');
                showRandomQuote();
                timer = setInterval(() => {
                    timeLeft--; updateUI();
                    if (timeLeft <= 0) {
                        clearInterval(timer); timer = null;
                        isRest = !isRest;
                        if(!isRest) { 
                            tomatoes++; 
                            document.getElementById('tCount').textContent = tomatoes;
                            saveTomatoCount();
                            saveFocusDuration(parseInt(fMin.value));
                        }
                        timeLeft = (isRest ? bMin.value : fMin.value) * 60;
                        showToast(isRest ? "辛苦了，喝杯红茶休息一下吧。" : "休息结束，我们开始下一段。", 4000);
                        updateUI(); this.textContent = "开始专注";
                        ring.classList.remove('breathing');
                        showRandomQuote();
                    }
                }, 1000);
                this.textContent = "暂停";
            }
        };

        // 便签功能
        function initNote() {
            const dayIdx = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
            const note = IRIS_NOTES[dayIdx % IRIS_NOTES.length];
            document.getElementById('noteTxt').textContent = note.t;
            document.getElementById('noteAuth').textContent = '—— ' + note.a;
        }

        // 心情功能
        function getMoodKey(date) {
            const d = date || new Date();
            return 'mood_' + d.getFullYear() + '_' + (d.getMonth()+1) + '_' + d.getDate();
        }

        function getMoodsForDate(date) {
            const key = getMoodKey(date);
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        }

        function saveMoodForDate(date, moodText, toggle = false) {
            const key = getMoodKey(date);
            const existing = getMoodsForDate(date);
            
            if (toggle) {
                const existingIndex = existing.findIndex(item => item.mood === moodText);
                if (existingIndex > -1) {
                    existing.splice(existingIndex, 1);
                } else {
                    existing.push({ mood: moodText });
                }
            } else {
                existing.push({ mood: moodText });
            }
            
            localStorage.setItem(key, JSON.stringify(existing));
        }

        function getTomatoKey() {
            const d = new Date();
            return 'tomato_' + d.getFullYear() + '_' + (d.getMonth()+1) + '_' + d.getDate();
        }

        function getFocusKey(date) {
            const d = date || new Date();
            return 'focus_' + d.getFullYear() + '_' + (d.getMonth()+1) + '_' + d.getDate();
        }

        function loadTomatoCount() {
            const count = localStorage.getItem(getTomatoKey());
            if (count) {
                tomatoes = parseInt(count);
                document.getElementById('tCount').textContent = tomatoes;
            }
        }

        function saveTomatoCount() {
            localStorage.setItem(getTomatoKey(), tomatoes.toString());
        }

        function saveFocusDuration(durationMinutes) {
            const key = getFocusKey();
            const existing = parseInt(localStorage.getItem(key) || '0');
            localStorage.setItem(key, (existing + durationMinutes).toString());
        }

        function getFocusDuration(date) {
            const key = getFocusKey(date);
            return parseInt(localStorage.getItem(key) || '0');
        }

        function renderMoods() {
            const today = new Date();
            const existingMoods = getMoodsForDate(today);
            const existingMoodTexts = existingMoods.map(item => item.mood);
            
            document.getElementById('moodList').innerHTML = MOODS.map(m => {
                const isSelected = existingMoodTexts.includes(m);
                return '<div style="padding:10px 15px; border-radius:15px; border:1px solid rgba(154, 154, 224, 0.3); cursor:pointer; font-size:14px; transition:all 0.2s; ' + (isSelected ? 'background:var(--accent-color); color:white;' : 'background:transparent;') + '" onclick="selectMood(this, \'' + m + '\')">' + m + '</div>';
            }).join('');
            updateTodayMoodDisplay();
        }

        function selectMood(el, moodText) {
            const today = new Date();
            const existingMoods = getMoodsForDate(today);
            const isSelected = existingMoods.some(item => item.mood === moodText);
            
            saveMoodForDate(today, moodText, true);
            
            if (isSelected) {
                el.style.background = 'transparent';
                el.style.color = '';
                showToast('已取消今日心情：' + moodText);
            } else {
                el.style.background = 'var(--accent-color)';
                el.style.color = 'white';
                showToast('已记录今日心情：' + moodText);
            }
            
            updateTodayMoodDisplay();
        }

        function updateTodayMoodDisplay() {
            const moods = getMoodsForDate(new Date());
            const countEl = document.getElementById('moodCountDisplay');
            const historyEl = document.getElementById('todayMoodHistory');
            
            if (moods.length > 0) {
                countEl.innerHTML = '今日已记录 <span>' + moods.length + '</span> 种心情';
                historyEl.innerHTML = moods.map(m => 
                    '<div class="mood-history-item"><span>' + m.mood + '</span><span class="time">' + m.time + '</span></div>'
                ).join('');
            } else {
                countEl.innerHTML = '今天还没有记录心情哦～';
                historyEl.innerHTML = '';
            }
        }

        // 日历功能
        function openCalendar() {
            const overlay = document.getElementById('calendarOverlay');
            overlay.style.display = 'flex';
            
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const today = now.getDate();
            
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
            let html = '<div style="padding:20px;">';
            
            html += '<div style="text-align:center; margin-bottom:20px; font-size:18px; font-weight:600; color:var(--ravenclaw-blue);">' + year + '年' + (month+1) + '月</div>';
            
            html += '<div class="cal-grid" style="margin-bottom:10px;">';
            weekDays.forEach(d => {
                html += '<div style="text-align:center; font-size:12px; color:var(--light-text); padding:5px;">' + d + '</div>';
            });
            html += '</div>';
            
            html += '<div class="cal-grid">';
            
            for (let i = 0; i < firstDay; i++) {
                html += '<div class="cal-cell" style="opacity:0.3;"></div>';
            }
            
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const moods = getMoodsForDate(date);
                const focusMinutes = getFocusDuration(date);
                const theaterCount = getTheaterCountForDate(date);
                const isToday = day === today;
                
                let moodIcons = '';
                if (moods.length > 0) {
                    const uniqueMoods = [...new Set(moods.map(m => m.mood.split(' ')[0]))];
                    moodIcons = '<div class="mood-icons">' + uniqueMoods.slice(0, 3).join('') + (moods.length > 3 ? '…' : '') + '</div>';
                }
                
                let theaterIcons = '';
                if (theaterCount > 0) {
                    theaterIcons = '<div class="mood-icons">' + '🎭'.repeat(Math.min(theaterCount, 3)) + (theaterCount > 3 ? '…' : '') + '</div>';
                }
                
                html += '<div class="cal-cell' + (isToday ? ' today' : '') + '" onclick="showDayMoods(' + year + ', ' + month + ', ' + day + ')">';
                html += '<b>' + day + '</b>' + moodIcons + theaterIcons;
                
                let bottomText = [];
                if (moods.length > 0) {
                    bottomText.push(moods.length + '种');
                }
                if (focusMinutes > 0) {
                    bottomText.push('⏱' + focusMinutes + '分');
                }
                if (theaterCount > 0) {
                    bottomText.push('🎭' + theaterCount);
                }
                if (bottomText.length > 0) {
                    html += '<div style="font-size:9px; color:var(--accent-color); line-height:1.2;">' + bottomText.join(' ') + '</div>';
                }
                
                html += '</div>';
            }
            
            html += '</div></div>';
            document.getElementById('calendarBody').innerHTML = html;
        }

        function closeCalendar(event) {
            if (event && event.target !== event.currentTarget) return;
            document.getElementById('calendarOverlay').style.display = 'none';
        }

        function showDayMoods(year, month, day) {
            const date = new Date(year, month, day);
            const moods = getMoodsForDate(date);
            const today = new Date();
            const isToday = date.toDateString() === today.toDateString();
            
            let html = '<div style="padding:20px;">';
            html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">';
            html += '<span style="font-size:16px; color:var(--ravenclaw-blue);">' + (month+1) + '月' + day + '日</span>';
            html += '<span style="cursor:pointer; font-size:12px; color:var(--light-text);" onclick="openCalendar()">← 返回日历</span>';
            html += '</div>';
            
            const focusMinutes = getFocusDuration(date);
            const dateStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
            const theaters = getTheatersForDate(dateStr);
            
            if (theaters.length > 0) {
                html += '<div style="margin-bottom:20px;">';
                html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">';
                html += '<span style="font-size:14px; color:var(--ravenclaw-blue); font-weight:600;">🎭 小剧场 (' + theaters.length + '篇)</span>';
                html += '<button style="padding:8px 16px; border-radius:12px; border:1px solid rgba(154,154,224,0.3); background:rgba(255,255,255,0.8); color:var(--ravenclaw-blue); font-family:\'Cinzel\', serif; cursor:pointer;" onclick="openTheaterModal(\'' + dateStr + '\'); closeCalendar();">查看 →</button>';
                html += '</div>';
                html += '</div>';
            }
            
            if (focusMinutes > 0 || moods.length > 0) {
                html += '<div style="display:flex; flex-direction:column; gap:12px;">';
                
                if (focusMinutes > 0) {
                    html += '<div style="padding:15px; background:rgba(154,154,224,0.1); border-radius:15px; text-align:center;">';
                    html += '<div style="font-size:32px; margin-bottom:5px;">⏱</div>';
                    html += '<div style="font-size:14px; color:var(--light-text);">专注时长</div>';
                    html += '<div style="font-size:20px; font-weight:600; color:var(--ravenclaw-blue);">' + focusMinutes + ' 分钟</div>';
                    html += '</div>';
                }
                
                if (moods.length > 0) {
                    html += '<div style="font-size:14px; color:var(--light-text); margin-bottom:5px;">心情记录</div>';
                    moods.forEach(m => {
                        html += '<div class="mood-history-item" style="font-size:16px; padding:15px;">';
                        html += '<span style="font-size:24px;">' + m.mood.split(' ')[0] + '</span>';
                        html += '<span style="flex:1;">' + m.mood.split(' ')[1] + '</span>';
                        html += '</div>';
                    });
                }
                
                html += '</div>';
            } else if (theaters.length === 0) {
                html += '<div style="text-align:center; color:var(--light-text); padding:40px;">这一天还没有记录</div>';
            }
            
            if (isToday) {
                html += '<div style="margin-top:30px; padding-top:20px; border-top:1px solid rgba(154, 154, 224, 0.2);">';
                html += '<h4 style="margin:0 0 15px 0; color:var(--ravenclaw-blue);">添加今日心情</h4>';
                html += '<div style="display:flex; flex-wrap:wrap; gap:10px;">';
                MOODS.forEach(m => {
                    html += '<div style="padding:10px 15px; border-radius:15px; border:1px solid rgba(154, 154, 224, 0.3); cursor:pointer; font-size:14px; transition:all 0.2s; background:transparent;" onclick="addMoodFromCalendar(\'' + m + '\')">' + m + '</div>';
                });
                html += '</div></div>';
            }
            
            html += '</div>';
            document.getElementById('calendarBody').innerHTML = html;
        }

        function addMoodFromCalendar(moodText) {
            const today = new Date();
            saveMoodForDate(today, moodText);
            showToast('已记录心情：' + moodText);
            updateTodayMoodDisplay();
            showDayMoods(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        }

        // Toast提示
        function showToast(msg, duration = 3000) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), duration);
        }

        function getTheatersForDate(dateStr) {
            return THEATER_DATA.filter(t => t.date === dateStr);
        }

        function getUniqueDates() {
            const dates = [...new Set(THEATER_DATA.map(t => t.date))];
            return dates.sort((a, b) => new Date(b) - new Date(a));
        }

        function getAuthorLabel(author) {
            const labels = { cathy: '凯希', sarah: '塞拉', collab: '联动' };
            return labels[author] || author;
        }

        function smartPunctuationConvert(text) {
            if (!text) return text;
            
            function hasChinese(str) {
                return /[\u4e00-\u9fff]/.test(str);
            }
            
            const paragraphs = text.split(/\n+/);
            
            const convertedParagraphs = paragraphs.map(paragraph => {
                const trimmedPara = paragraph.trim();
                
                if (!trimmedPara) {
                    return paragraph;
                }
                
                if (!hasChinese(trimmedPara)) {
                    return paragraph;
                }
                
                let converted = paragraph;
                
                let doubleQuoteCount = 0;
                converted = converted.replace(/"/g, function() {
                    doubleQuoteCount++;
                    return doubleQuoteCount % 2 === 1 ? '“' : '”';
                });
                
                let singleQuoteCount = 0;
                converted = converted.replace(/'/g, function() {
                    singleQuoteCount++;
                    return singleQuoteCount % 2 === 1 ? '‘' : '’';
                });
                
                const fullWidthMap = {
                    ',': '，',
                    '.': '。',
                    '!': '！',
                    '?': '？',
                    ';': '；',
                    ':': '：',
                    '(': '（',
                    ')': '）',
                    '[': '【',
                    ']': '】',
                    '{': '｛',
                    '}': '｝',
                    '-': '—',
                    '~': '～'
                };
                
                for (let [half, full] of Object.entries(fullWidthMap)) {
                    converted = converted.replace(new RegExp(half.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), full);
                }
                
                return converted;
            });
            
            return convertedParagraphs.join('\n');
        }

        function getTheaterCardStyle(author) {
            const styles = {
                cathy: { bg: 'var(--theater-cathy-blue)', border: 'var(--theater-cathy-blue-border)' },
                sarah: { bg: 'var(--theater-sarah-green)', border: 'var(--theater-sarah-green-border)' },
                collab: { bg: 'var(--theater-collab-pink)', border: 'var(--theater-collab-pink-border)' }
            };
            return styles[author] || styles.cathy;
        }

        function initTheaterMonthFilter() {
            const select = document.getElementById('theater-month-filter');
            const dates = getUniqueDates();
            const months = [...new Set(dates.map(d => d.substring(0, 7)))];
            months.sort().reverse();
            select.innerHTML = '<option value="all">全部月份</option>';
            months.forEach(month => {
                const [y, m] = month.split('-');
                select.innerHTML += `<option value="${month}">${y}年${parseInt(m)}月</option>`;
            });
        }

        function renderTheaterList() {
            const monthFilter = document.getElementById('theater-month-filter').value;
            const authorFilter = document.getElementById('theater-author-filter').value;
            const orderFilter = document.getElementById('theater-order-filter').value;
            
            const container = document.getElementById('theater-date-list');
            let html = '<div class="book-grid">';
            
            let filteredData = THEATER_DATA.filter(theater => {
                if (monthFilter !== 'all' && !theater.date.startsWith(monthFilter)) return false;
                if (authorFilter !== 'all' && theater.author !== authorFilter) return false;
                return true;
            });
            
            if (orderFilter === 'asc') {
                filteredData.sort((a, b) => {
                    const dateCompare = a.date.localeCompare(b.date);
                    if (dateCompare !== 0) return dateCompare;
                    return (a.order || 0) - (b.order || 0);
                });
            } else {
                filteredData.sort((a, b) => {
                    const dateCompare = b.date.localeCompare(a.date);
                    if (dateCompare !== 0) return dateCompare;
                    return (b.order || 0) - (a.order || 0);
                });
            }
            
            filteredData.forEach((theater, idx) => {
                const [y, m, d] = theater.date.split('-');
                const orderText = theater.order ? ` (第${theater.order}篇)` : '';
                const orderParam = theater.order ? `, ${theater.order}` : '';
                html += `<div class="book-item" onclick="openTheaterModal('${theater.date}'${orderParam})">
                    <div class="book-title">${parseInt(m)}月${parseInt(d)}日${orderText}</div>
                    <div class="book-meta">小剧场</div>
                    <span class="book-link">查看 →</span>
                </div>`;
            });
            
            html += '</div>';
            container.innerHTML = html;
        }

        function openTheaterModal(dateStr, order) {
            let theaters = getTheatersForDate(dateStr);
            
            if (order) {
                theaters = theaters.filter(t => t.order === order);
            }
            
            const [y, m, d] = dateStr.split('-');
            
            const orderText = order ? ` (第${order}篇)` : '';
            document.getElementById('theaterModalTitle').textContent = `${y}年${parseInt(m)}月${parseInt(d)}日 小剧场${orderText}`;
            
            const container = document.getElementById('theaterModalBody');
            let html = '<div style="display:flex; flex-direction:column; gap:20px;">';
            
            theaters.forEach((theater, idx) => {
                const style = getTheaterCardStyle(theater.author);
                
                html += `<div style="padding:35px; border-radius:20px; border:2px solid ${style.border}; background:${style.bg}; backdrop-filter:blur(10px); position:relative; max-width:700px; margin:0 auto;">`;
                
                let content = theater.content;
                
                const signaturePattern = /(Noah\.?|凯希\.?|塞拉\.?|Cathy\.?|Sarah\.?)\s*$/i;
                let signature = '';
                if (signaturePattern.test(content)) {
                    const match = content.match(signaturePattern);
                    signature = match[0].trim();
                    content = content.replace(signaturePattern, '').trim();
                }
                
                const lines = content.split('\n');
                let currentPara = '';
                let lastHadChinese = false;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) {
                        if (currentPara) {
                            const hasChinese = /[\u4e00-\u9fff]/.test(currentPara);
                            const fontFamily = hasChinese 
                                ? "'Noto Serif SC', 'Source Han Serif CN', serif" 
                                : "'Times New Roman', serif";
                            html += `<p style="line-height:2; color:rgba(38, 38, 68, 0.97); font-size:18px; letter-spacing:0.6px; font-family:${fontFamily}; white-space:pre-wrap; text-align:left; margin:0 0 20px 0; vertical-align:baseline;">${smartPunctuationConvert(currentPara)}</p>`;
                            
                            lastHadChinese = hasChinese;
                            currentPara = '';
                        }
                        continue;
                    }
                    
                    if (currentPara) {
                        const currentHasChinese = /[\u4e00-\u9fff]/.test(currentPara);
                        const lineHasChinese = /[\u4e00-\u9fff]/.test(line);
                        if (currentHasChinese === lineHasChinese) {
                            currentPara += '\n' + line;
                        } else {
                            const fontFamily = currentHasChinese 
                                ? "'Noto Serif SC', 'Source Han Serif CN', serif" 
                                : "'Times New Roman', serif";
                            html += `<p style="line-height:2; color:rgba(38, 38, 68, 0.97); font-size:18px; letter-spacing:0.6px; font-family:${fontFamily}; white-space:pre-wrap; text-align:left; margin:0 0 20px 0; vertical-align:baseline;">${smartPunctuationConvert(currentPara)}</p>`;
                            
                            lastHadChinese = currentHasChinese;
                            currentPara = line;
                        }
                    } else {
                        currentPara = line;
                    }
                }
                
                if (currentPara) {
                    const hasChinese = /[\u4e00-\u9fff]/.test(currentPara);
                    const fontFamily = hasChinese 
                        ? "'Noto Serif SC', 'Source Han Serif CN', serif" 
                        : "'Times New Roman', serif";
                    html += `<p style="line-height:2; color:rgba(38, 38, 68, 0.97); font-size:18px; letter-spacing:0.6px; font-family:${fontFamily}; white-space:pre-wrap; text-align:left; margin:0 0 20px 0; vertical-align:baseline;">${smartPunctuationConvert(currentPara)}</p>`;
                }
                
                if (signature) {
                    html += `<p style="line-height:2; color:rgba(38, 38, 68, 0.97); font-size:18px; letter-spacing:0.6px; font-family:'Times New Roman', serif; text-align:right; margin:20px 0 0 0;">${signature}</p>`;
                }
                
                html += `</div>`;
            });
            
            html += '</div>';
            container.innerHTML = html;
            document.getElementById('theaterOverlay').style.display = 'flex';
        }

        function closeTheaterModal(event) {
            if (event && event.target !== event.currentTarget) return;
            document.getElementById('theaterOverlay').style.display = 'none';
        }

        function initTheater() {
            initTheaterMonthFilter();
            renderTheaterList();
        }

        function showTodayTheater() {
            const today = new Date().toISOString().split('T')[0];
            const theaters = getTheatersForDate(today);
            if (theaters.length > 0) {
                openTheaterModal(today);
            } else {
                showToast('今天没有小剧场哦～');
            }
        }

        function getTheaterCountForDate(date) {
            const dateStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
            return getTheatersForDate(dateStr).length;
        }

        // 初始化
        loadTomatoCount();
        updateUI();
        initNote();
        renderMoods();
        initTheater();
        
        // 自动弹出今日小剧场
        (function() {
            const today = new Date();
            const dateStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
            const theaters = getTheatersForDate(dateStr);
            if (theaters.length > 0) {
                setTimeout(function() {
                    openTheaterModal(dateStr);
                }, 500);
            }
        })();
    