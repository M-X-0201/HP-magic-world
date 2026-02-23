
// 通用工具函数

// Toast提示
function showToast(msg, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() =&gt; toast.classList.remove('show'), duration);
}

// 获取唯一日期列表
function getUniqueDates(data) {
    const dates = [...new Set(data.map(t =&gt; t.date))];
    return dates.sort((a, b) =&gt; new Date(b) - new Date(a));
}

// 获取作者标签
function getAuthorLabel(author) {
    const labels = { cathy: '凯希', sarah: '塞拉', collab: '联动' };
    return labels[author] || author;
}

// 检查字符串是否包含中文
function hasChinese(str) {
    return /[\u4e00-\u9fff]/.test(str);
}

// 获取指定日期的小剧场数量
function getTheaterCountForDate(date) {
    const dateStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    return getTheatersForDate(dateStr).length;
}

