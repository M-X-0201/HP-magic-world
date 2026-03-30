# Harry Potter 魔法世界 - 项目说明

## 📂 项目结构

```
harry-potter-magic-world/
├── index.html              # 主HTML文件
├── README.md               # 这个说明文档
├── css/                    # 样式文件夹（可选）
│   └── styles.css          # 所有样式
├── js/                     # JavaScript文件夹（可选）
│   ├── main.js             # 主入口和页面控制
│   ├── content.js          # 内容管理（同人文+小剧场）
│   ├── tools.js            # 工具（番茄钟+便签+天气）
│   ├── calendar.js         # 日历功能
│   └── utils.js            # 通用工具函数
└── assets/                 # 资源文件夹
    ├── images/             # 图片（装饰图案等）
    └── music/              # 音乐文件
```

---

## 🎯 快速开始

### 如何运行
直接用浏览器打开 `index.html` 即可！

---

## 📝 各模块说明

### 1. index.html（主文件）
**作用**：网页的骨架，包含所有HTML结构

**你可以改的地方**：
- 修改标题
- 添加/删除页面section
- 修改导航栏

**不要改的地方**：
- script标签的顺序
- 重要的ID名称

---

### 2. content.js（内容管理）
**作用**：管理同人文和小剧场

**数据位置**：
```javascript
const THEATER_DATA = [
    { date: '2025-03-10', author: 'cathy', content: '你的内容' },
    // 在这里添加新的小剧场
];
```

**如何添加小剧场**：
1. 找到 `THEATER_DATA` 数组
2. 复制一行，修改日期、作者和内容
3. 作者类型：
   - `cathy` → 蓝色卡片
   - `sarah` → 绿色卡片
   - `collab` → 粉色卡片

---

### 3. tools.js（工具箱）
**作用**：番茄钟、每日便签、天气显示

**如何修改便签**：
```javascript
const IRIS_NOTES = [
    { t: '你的便签内容', a: '作者' },
    // 在这里添加新便签
];
```

**如何修改番茄钟**：
- 默认专注25分钟，休息5分钟
- 用户可以在页面上直接调整

---

### 4. calendar.js（日历）
**作用**：心情日历、专注记录、小剧场标记

**数据存储**：使用浏览器的localStorage
- 刷新页面数据不会丢失
- 清除浏览器缓存会清空数据

---

### 5. utils.js（通用工具）
**作用**：一些大家都能用的小函数
- showToast() - 显示提示消息
- 其他通用工具

---

## 🎨 如何修改样式

### CSS变量（在:root里）
```css
:root {
    --primary-color: #9A9AE0;      /* 主色调 */
    --accent-color: #5D76CB;        /* 强调色 */
    --theater-cathy-blue: ...;      /* 凯希小剧场颜色 */
    --theater-sarah-green: ...;     /* 塞拉小剧场颜色 */
    --theater-collab-pink: ...;      /* 联动小剧场颜色 */
}
```

### 小剧场卡片样式
在 `.theater-card` 相关的CSS里修改

---

## 🔄 如何更新到GitHub

### 第一步：安装Git（如果还没）
1. 去 https://git-scm.com 下载
2. 安装（一路下一步就行）

### 第二步：创建GitHub仓库
1. 去 https://github.com 注册/登录
2. 点击 "New repository"
3. 填名字，选Public/Private
4. 点击 "Create repository"

### 第三步：上传代码
在项目文件夹里右键 → "Open in Terminal"，然后输入：
```bash
git init
git add .
git commit -m "初始提交"
git remote add origin 你的仓库地址
git push -u origin main
```

---

## 💡 常见问题

### Q: 想改小剧场卡片颜色怎么办？
A: 在CSS的 `:root` 里找到 `--theater-xxx` 变量修改

### Q: 怎么添加新的装饰图案？
A: 把图片放到 `assets/images/`，然后在CSS里引用

### Q: 数据会丢吗？
A: 心情和番茄钟数据存在浏览器里，刷新不会丢，但换电脑/清除缓存会丢

### Q: 可以在手机上看吗？
A: 可以！已经做了响应式适配

---

## 📞 需要帮助？
有问题就找我！😊

---

## 📅 版本历史
- v1.0 - 初始版本，小剧场功能完成
