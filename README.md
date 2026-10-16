# CW随手练

一款面向新手 HAM 的 CW（莫尔斯码）学习与听写微信小程序。通过字形、声音和音节记忆建立字符印象，并逐步练习单字符和单词抄收。

## 功能

- **字母学习**：支持 A–Z、0–9 自由点播；字母配有 SVG 图像记忆法和音节记忆法。
- **字母听写**：随机播放字母或数字，支持重播、快捷输入、自动核对和答对后自动下一题。
- **单词与通联听写**：支持定长单词（2–8 字母）、模拟呼号、通联短语、句子和混合训练；内置 320 种通联模板与数百个单词，提供 16 类场景和 3 档难度。
- **结果统计**：显示题目数量、正确数量和正确率，重新进入训练页面时自动清零。
- **播放设置**：支持 5–60 WPM 和 400–900 Hz 调节；点、划、字符间隔、单词间隔采用标准 `1:3:3:7` 时值。

## 通联训练（v1.2.0）

在“单词听写”中选择单词、呼号、短语、句子或混合类型。单词保留字母数选择；其他类型可选择入门、进阶、挑战，短语与句子还可按场景练习。

场景包含呼叫应答、信号报告、姓名呼号、台址网格、设备功率、天线架设、天气温度、传播干扰、慢发重发、竞赛交换、户外低功率、频率约定、日志确认、结束通联、日常交流和操作练习。每个场景有 10 种短语及 10 种句子模板。模板随机填入呼号、姓名、QTH、网格、RST、设备、功率、时间及频率等参数，同一题中重复的字段保持一致。

支持多行抄收、停止/重播，揭晓后显示答案和缩写提示。核对时忽略大小写、首尾空白及重复空格，保留词间边界和标点。呼号含 `/P`、`/M` 等后缀时需完整填写；标点 `/ ? . , = + -` 均会实际播发。题目使用的是模拟通联资料，生成的呼号可能与真实电台相同。

生成器会降低近期模板的重复概率。呼号地区、QTH、网格和 CQ 分区使用配套资料，信号报告与描述、波段与频率、天气与温度、设备与功率等参数按合理范围生成。没有联网生成或上传训练输入。

模板为自行编写的练习内容，用语参考 [SKCC 初学者通联资料](https://www.skccgroup.com/member_services/beginners_corner/)、[CWops 缩写表](https://cwops.org/wp-content/uploads/2023/09/CW-Abbreviations.pdf)；字符和标点时值参考 [ITU-R M.1677-1](https://www.itu.int/dms_pubrec/itu-r/rec/m/r-rec-m.1677-1-200910-i!!pdf-e.pdf)。

开发验证：运行 `node scripts/test-qso-generator.js`、`node scripts/test-cw-audio.js` 和 `node scripts/test-word-page.js`。这些脚本不会打入小程序包。

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
