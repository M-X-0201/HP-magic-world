
// 工具功能：番茄钟、便签、天气等

// 便签数据
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
    { t: '"Honey life is just a classroom. Cause baby I could build a castle out of all the bricks they threw me."', a: "Taylor Swift · New Romantics" },
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

// 番茄钟状态常量
const TOMATO_FOCUS = 'focus';
const TOMATO_BREAK = 'break';

// 计时器状态
let timer = null;
let isRest = false;
let timeLeft = 25 * 60;
let tomatoes = 0;
let fMin, bMin, timeLabel, progress, ring;

function updateUI() {
    const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
    timeLabel.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    const total = (isRest ? bMin.value : fMin.value) * 60;
    progress.style.strokeDashoffset = 283 * (1 - timeLeft / total);
}

function showRandomQuote() {
    const q = FOCUS_DB[Math.floor(Math.random() * FOCUS_DB.length)];
    document.getElementById('focusQuote').textContent = q.name ? `「${q.txt}」 —— ${q.name}` : `「${q.txt}」`;
}

function initTimerElements() {
    fMin = document.getElementById('fMin');
    bMin = document.getElementById('bMin');
    timeLabel = document.getElementById('timeLabel');
    progress = document.getElementById('progress');
    ring = document.getElementById('timerRing');
}

function setupTimerEvents() {
    fMin.oninput = bMin.oninput = () =&gt; {
        if(!timer) {
            timeLeft = (isRest?bMin.value:fMin.value)*60;
            updateUI();
            showRandomQuote();
        }
    };

    document.getElementById('toggleBtn').onclick = function() {
        if (timer) {
            clearInterval(timer); timer = null; this.textContent = "继续专注";
            ring.classList.remove('breathing');
        } else {
            ring.classList.add('breathing');
            showRandomQuote();
            timer = setInterval(() =&gt; {
                timeLeft--; updateUI();
                if (timeLeft &lt;= 0) {
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
}

// 便签功能
function initNote() {
    const dayIdx = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const note = IRIS_NOTES[dayIdx % IRIS_NOTES.length];
    document.getElementById('noteTxt').textContent = note.t;
    document.getElementById('noteAuth').textContent = '—— ' + note.a;
}

// 天气功能
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
    if (temp &lt; 0) return '厚羽绒服+围巾+帽子';
    if (temp &lt; 5) return '羽绒服+围巾';
    if (temp &lt; 10) return '羽绒服+毛衣';
    if (temp &lt; 15) return '薄外套+毛衣';
    if (temp &lt; 20) return '卫衣+长裤';
    if (temp &lt; 25) return 'T恤+薄外套';
    if (temp &lt; 30) return '短袖短裤';
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
        .then(response =&gt; {
            console.log('响应状态:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data =&gt; {
            console.log('获取到的天气数据:', data);
            if (data.daily &amp;&amp; data.daily.temperature_2m_min &amp;&amp; data.daily.temperature_2m_max) {
                const minTemp = data.daily.temperature_2m_min[0];
                const maxTemp = data.daily.temperature_2m_max[0];
                const currentTemp = data.current ? data.current.temperature_2m : (minTemp + maxTemp) / 2;
                const weatherCode = data.current ? data.current.weather_code || 3 : 3;
                updateWeatherDisplayWithRange(minTemp, maxTemp, weatherCode);
                console.log('成功获取真实天气数据:', { minTemp, maxTemp, currentTemp, weatherCode });
            } else if (data.current &amp;&amp; typeof data.current.temperature_2m === 'number') {
                const temp = data.current.temperature_2m;
                const weatherCode = data.current.weather_code || 3;
                updateWeatherDisplay(temp, weatherCode);
                console.log('成功获取真实天气数据(仅当前温度):', { temp, weatherCode });
            } else {
                throw new Error('无效的天气数据');
            }
        })
        .catch(error =&gt; {
            console.log('获取天气失败，使用备用天气数据:', error);
            updateWithFallbackWeather();
        });
}

function requestLocationAndWeather() {
    if ('geolocation' in navigator) {
        console.log('正在尝试获取地理位置...');
        navigator.geolocation.getCurrentPosition(
            (position) =&gt; {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log('成功获取地理位置:', { lat, lon });
                getRealTimeWeather(lat, lon);
            },
            (error) =&gt; {
                console.log('无法获取位置，使用备用天气数据:', error);
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
        getRealTimeWeather(39.9042, 116.4074);
    }
}

function updateWithFallbackWeather() {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();
    
    let baseTemp;
    if (month &gt;= 2 &amp;&amp; month &lt;= 4) {
        baseTemp = 10 + (month - 2) * 4 + Math.min(day, 15) / 5;
    } else if (month &gt;= 5 &amp;&amp; month &lt;= 7) {
        baseTemp = 22 + (month - 5) * 5 + Math.min(day, 20) / 4;
    } else if (month &gt;= 8 &amp;&amp; month &lt;= 10) {
        baseTemp = 32 - (month - 8) * 4 - Math.min(day, 20) / 5;
    } else if (month &gt;= 11 || month == 0) {
        baseTemp = 8 - (month == 0 ? 0 : month - 11) * 5 - Math.min(day, 15) / 3;
    } else {
        baseTemp = 15;
    }
    
    const randomVariation = (Math.random() - 0.5) * 4;
    const temp = baseTemp + randomVariation;
    
    let weatherCode;
    if (temp &lt; 0) {
        weatherCode = 71;
    } else if (temp &lt; 10) {
        weatherCode = 3;
    } else if (temp &lt; 20) {
        weatherCode = 1;
    } else if (temp &lt; 30) {
        weatherCode = 0;
    } else {
        weatherCode = 95;
    }
    
    updateWeatherDisplay(temp, weatherCode);
}

function getWeatherByMonth(month) {
    const weatherData = [
        { temp: '-2-5°C', outfit: '厚羽绒服+围巾', icon: '❄️' },
        { temp: '0-8°C', outfit: '羽绒服+毛衣', icon: '☁️' },
        { temp: '8-15°C', outfit: '薄外套+长袖', icon: '🌤️' },
        { temp: '14-22°C', outfit: '卫衣+长裤', icon: '🌸' },
        { temp: '20-28°C', outfit: 'T恤+薄外套', icon: '☀️' },
        { temp: '25-35°C', outfit: '短袖短裤', icon: '🌞' },
        { temp: '28-38°C', outfit: '短袖+空调衫', icon: '🌻' },
        { temp: '26-35°C', outfit: '短袖短裤', icon: '🌤️' },
        { temp: '20-28°C', outfit: '长袖+薄外套', icon: '🍂' },
        { temp: '14-22°C', outfit: '卫衣+长裤', icon: '🍁' },
        { temp: '8-15°C', outfit: '薄外套+毛衣', icon: '☁️' },
        { temp: '0-8°C', outfit: '羽绒服+围巾', icon: '❄️' }
    ];
    return weatherData[month];
}

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

function initTools() {
    initTimerElements();
    setupTimerEvents();
    updateUI();
    showRandomQuote();
}

