# CW随手练

一款面向新手 HAM 的 CW（莫尔斯码）学习与听写微信小程序。通过字形、声音和音节记忆建立字符印象，并逐步练习单字符和单词抄收。

## 功能

- **字母学习**：支持 A–Z、0–9 自由点播；字母配有 SVG 图像记忆法和音节记忆法。
- **字母听写**：随机播放字母或数字，支持重播、快捷输入、自动核对和答对后自动下一题。
- **单词听写**：可设置 2–8 个字母，随机生成对应长度的常用 CW 单词进行抄收。
- **结果统计**：显示题目数量、正确数量和正确率，重新进入训练页面时自动清零。
- **播放设置**：支持 5–60 WPM 和 400–900 Hz 调节；点、划、字符间隔、单词间隔采用标准 `1:3:3:7` 时值。

## 界面截图

| 主页 | 字母学习 |
| --- | --- |
| <img src="https://raw.githubusercontent.com/wutao667/ham-cw-mini-program/5637374d0b88b2df1087c6978c671c2a181c970f/docs/screenshots/home.png" width="280" alt="CW随手练主页"> | <img src="https://raw.githubusercontent.com/wutao667/ham-cw-mini-program/5637374d0b88b2df1087c6978c671c2a181c970f/docs/screenshots/letter-learning.png" width="280" alt="字母学习页面"> |

| 字母听写 | 单词听写 |
| --- | --- |
| <img src="https://raw.githubusercontent.com/wutao667/ham-cw-mini-program/5637374d0b88b2df1087c6978c671c2a181c970f/docs/screenshots/letter-copy.png" width="280" alt="字母听写页面"> | <img src="https://raw.githubusercontent.com/wutao667/ham-cw-mini-program/5637374d0b88b2df1087c6978c671c2a181c970f/docs/screenshots/word-copy.png" width="280" alt="单词听写页面"> |

## 本地运行

1. 使用微信开发者工具导入本项目目录。
2. 根据需要在 `project.config.json` 中配置自己的小程序 AppID。
3. 点击微信开发者工具中的“编译”即可预览。

## 作者

- **BA4VWS**
- <wutao667@gmail.com>
