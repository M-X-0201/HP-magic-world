// 日历和心情记录功能

// 心情数据
const MOODS = ['🌤️ 平静', '✨ 闪耀', '🌧️ 低落', '🌿 治愈', '🔥 动力'];

// 获取心情键
function getMoodKey(date) {
    const d = date || new Date();
    return 'mood_' + d.getFullYear() + '_' + (d.getMonth()+1) + '_' + d.getDate();
}

// 获取指定日期的心情
function getMoodsForDate(date) {
    const key = getMoodKey(date);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// 保存心情到本地存储
function saveMoodForDate(date, moodText, toggle = false) {
    const key = getMoodKey(date);
    const existing = getMoodsForDate(date);
    
    if (toggle) {
        const existingIndex = existing.findIndex(item => item.mood === moodText);
        if (existingIndex > -1) {
            existing.splice(existingIndex, 1);
        } else {
            const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
            existing.push({ mood: moodText, time: time });
        }
    } else {
        const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        existing.push({ mood: moodText, time: time });
    }
    
    localStorage.setItem(key, JSON.stringify(existing));
}

// 获取番茄键
function getTomatoKey() {
    const d = new Date();
    return 'tomato_' + d.getFullYear() + '_' + (d.getMonth()+1) + '_' + d.getDate();
}

// 获取专注键
function getFocusKey(date) {
    const d = date || new Date();
    return 'focus_' + d.getFullYear() + '_' + (d.getMonth()+1) + '_' + d.getDate();
}

// 加载番茄钟数量
function loadTomatoCount() {
    const count = localStorage.getItem(getTomatoKey());
    if (count) {
        tomatoes = parseInt(count);
        document.getElementById('tCount').textContent = tomatoes;
    }
}

// 保存番茄钟数量
function saveTomatoCount() {
    localStorage.setItem(getTomatoKey(), tomatoes.toString());
}

// 保存专注时长
function saveFocusDuration(durationMinutes) {
    const key = getFocusKey();
    const existing = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, (existing + durationMinutes).toString());
}

// 获取专注时长
function getFocusDuration(date) {
    const key = getFocusKey(date);
    return parseInt(localStorage.getItem(key) || '0');
}

// 渲染心情选择列表
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

// 选择心情
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

// 更新今日心情显示
function updateTodayMoodDisplay() {
    const moods = getMoodsForDate(new Date());
    const countEl = document.getElementById('moodCountDisplay');
    const historyEl = document.getElementById('todayMoodHistory');
    
    if (countEl) {
        if (moods.length > 0) {
            countEl.innerHTML = '今日已记录 <span>' + moods.length + '</span> 种心情';
        } else {
            countEl.innerHTML = '今天还没有记录心情哦～';
        }
    }
    
    if (historyEl) {
        if (moods.length > 0) {
            historyEl.innerHTML = moods.map(m => 
                '<div class="mood-history-item"><span>' + m.mood + '</span><span class="time">' + m.time + '</span></div>'
            ).join('');
        } else {
            historyEl.innerHTML = '';
        }
    }
}

// 打开日历
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

// 关闭日历
function closeCalendar(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('calendarOverlay').style.display = 'none';
}

// 显示指定日期的心情
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
                html += '<div class="mood-history-item"><span>' + m.mood + '</span><span class="time">' + m.time + '</span></div>';
            });
        }
        
        html += '</div>';
    } else if (theaters.length === 0) {
        html += '<div style="text-align:center; color:var(--light-text); padding:40px;">这一天还没有记录</div>';
    }
    
    if (isToday) {
        html += '<div style="margin-top:30px; padding-top:20px; border-top:1px solid rgba(154,154,224,0.2);">';
        html += '<h4 style="margin:0 0 15px 0; color:var(--ravenclaw-blue);">添加今日心情</h4>';
        html += '<div style="display:flex; flex-wrap:wrap; gap:10px;">';
        MOODS.forEach(m => {
            html += '<div style="padding:10px 15px; border-radius:15px; border:1px solid rgba(154,154,224,0.3); cursor:pointer; font-size:14px; transition:all 0.2s; background:transparent;" onclick="addMoodFromCalendar(\'' + m + '\')">' + m + '</div>';
        });
        html += '</div></div>';
    }
    
    html += '</div>';
    document.getElementById('calendarBody').innerHTML = html;
}

// 从日历添加心情
function addMoodFromCalendar(moodText) {
    const today = new Date();
    saveMoodForDate(today, moodText);
    showToast('已添加今日心情：' + moodText);
    showDayMoods(today.getFullYear(), today.getMonth(), today.getDate());
}
