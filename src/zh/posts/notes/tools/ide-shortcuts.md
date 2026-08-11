---
lang: zh-CH
title: IDE快捷键
description: IDE 快捷键汇总
date: 2026-08-10
updated: 2026-08-10
category:
  - 后端开发
  - 软件工程
tag:
  - 开发效率
---

## IDE快捷键

### Jetbrains

#### Windows

- 查找所有引用 Alt + F7

- shift+F6 重构

- `ctrl` + `shift` + `r` 全局替换

- `ctrl` + `p` 查看函数/方法参数

- `Ctrl` + `q` 弹出一个包含 Javadoc 或源代码注释的窗口，提供函数的详细描述、参数、返回值等。

- `Ctrl` + `Shift + I` 不跳转，直接在小窗口中查看类、方法或字段的定义。

- `Ctrl + B` / `Ctrl` + `鼠标左键` 跳转到类、方法或变量的定义位置。

- `ctrl` + `h` 查看该接口实现类

- `ctrl` + `F12` 查看类中所有方法

- `ctrl`+`alt`+`l` 格式化代码块

- `ctrl`+`alt`+`o` 优化导入

- `ctrl`+`alt`+`v` 生成一个变量替换

- `ctrl`+`x`把这一行剪切

- ctrl+shift+"`-"` 收起所有方法

- `alt` + `insert` 创建构造方法

- `alt` + `enter` 测试、实现类

- `alt` + `⬅` 切换标签页

#### Mac

1. Edit 编辑
- command + / 注释
- command + W 快速选择
- command + C Copy, 复制
- command + shift + C 复制路径
- command + V 粘贴
- command + shift + V 从剪贴板中粘贴
- command + Y 删除整行
- shift + Backspace 删除整行
- Alt + Backspace 删除整个单词
- command + X 剪切
- command + Z 撤回修改
- command + shift + Z 重做修改
- command + D Duplicate, 重复内容
- Tab 缩进代码
- shift + Tab 取消缩进
- command + shift + ⬆ / ⬇ 移动代码 / 代码块
- command + . 展开收回代码块
- command + +/- 展开折叠代码
- command + shift + +/- 展开 / 折叠所有代码
- command + shift + 8 启用列选择模式
- command + Alt + J 用 Live Template 包围代码
- ctrl + shift + J Join, 两行代码合并为一行
- Alt + Enter 快速 Import 缺失的包, 单双引号转换, 测试正则表达式
2. Refactor 重构
- command + Alt + L 格式化代码
- command + Alt + T 代码块包围(Try Except 等)
- shift + F6 重命名
- command + shift + Alt + T 变量名重构
- command + Alt + V Extract Variable, 提取变量
- command + Alt + P Extract Parameter, 提取参数 (在Function方法中使用)
- command + Alt + C Extract Constant, 提取常量
- command + Alt + M Extract Method, 提取方法
- command + Alt + F Extract Field 提取字段 (在 class 类中使用)
3. File 文件
ctrl + N 新建文件
F5 复制文件到某处
F6 移动文件到某处
command + Alt + Y Synchronize, 同步 Workspace
command + S Save all, 保存所有
4. Navigation 导航
command + < / > 跳转到行首 / 行尾 command + [] 跳转至代码块首 / 尾 command + PageUp / PageDown 跳转至当前屏幕页首 / 页尾 command + Home / End 跳转至文件首 / 尾 command + 7 文件结构窗口 command + 9 打开 VCS 版本控制 command + Alt + ← / → 跳转至上一次 / 下一次编辑的地方 command + shift + Backspace 跳转至上一次编辑处 command + G Go to Line 跳转到某行 Alt + Home 进入顶部文件导航栏 F2 下一个错误或警告 shift + F2 上一个错误或警告
5. Run / Debug 运行与调试
- ctrl + F5 重新运行
- ctrl + R Run 运行
- ctrl + D Debug 调试
- shift + F9 Debug 调试
- shift + F10 Run 运行
- shift + Alt + F10 选择要运行的文件
- F7 Step into, 进入子函数调试
- F8 Step over, 单步调试不进入子函数
- F9 继续执行程序
- Alt + F9 调试时运行至光标处
- command + F2 Stop 停止运行
- command + F8 添加 / 取消断点
- command + shift + F8 查看所有断点
- command + shift + F4 关闭正在进行的Run运行任务, 搜索等
- command + shift + Alt 启用多光标选择
6. 窗口操作
- command + F4 关闭标签
- command + Tab 切换标签
- command + Q Quit, 退出 PyCharm
- shift + F4 开启代码独立窗口
- command + F12 文件结构
- command + 1 展开收回 Project 窗口
- command + , Preference, 偏好设置
- command + R Replace, 替换
- command + E Recent Files
- command + F Find, 查找
- command + shift + F 全局搜索
- command + shift + R 全局替换
- command + shift + F12 收起所有工具窗口(编辑窗口最大化)
- Esc 退出工具窗口进入代码编辑器
- shift + F4 开启代码独立窗口
- Alt + F12 打开 Terminal 终端
- command + ctrl + F 全屏幕
- command + ctrl + +/= Zoom Editor, 编辑器尺寸
7. 版本控制VCS
- shift + Alt + ctrl + ⬆ / ⬇ 查看本地与版本控制 VCS 的区别
- command + T 从版本控制 (VCS) 更新代码
- command + K Commit, 提交代码
- shift + Alt + C Recent Changes, 最近的修改(本地)
- shift + Alt + ctrl + ⬆ / ⬇ 查看本地与版本控制 VCS 的区别
- command + Alt + Z Revert Commit 从版本控制中撤回修改
- command + Alt + A Add 添加到 VCS 版本控制中
8. 代码信息
- ctrl + J 快速查看文档
- command + Click 进入源码
- command + B 查看定义源码
- command + P 查看参数
- Alt + F7 查看变量等使用情况
- Alt + F1 快速查看文件 / 文件夹结构
- ctrl + shift + Q 显示当前代码上下文信息 (属于哪个函数, 属于哪个 Html 标签等)
- ctrl + H Hierarchy 查看继承关系
9. 其他
- ctrl + ~ 切换主题
- main Live Template, 快速键入if name == 'main:'


### VS code

#### Windows

- 查找所有引用

    - `shift` + `F12` 查看某个函数名、变量名或导入的模块名在当前文件的位置

    - `Alt` + `Shift` + `F12` 查看某个函数名、变量名或导入的模块名在项目所有文件的位置

- 转到定义 `F12`

- 查看函数/方法参数 `Ctrl + Shift + Space`

- 快速修复（import） `Ctrl` + `.`

#### Mac

1. 光标移动
- 移动到单词的最前面：option + ←
- 移动到单词最末尾：option + →
- 将当前行代码移动到上一行：option + ↑
- 将当前行代码移动到下一行：option + ↓
- 移动到当前行最前面：cmd + ←
- 移动到当前行最末尾：cmd + →
- 花括号之间跳转：cmd + shift +
- 移动到文档第一行或最后一行：cmd + ↑ / cmd + ↓

2. 删除操作
- 删除当前行光标后的所有字符：cmd + fn + delete
- 删除当前行光标前的所有字符：cmd + delete
- 删除当前单词光标后的字符：option + fn + delete
- 把当前单词光标前的字符删除：option + delete

3. 添加注释
- 注释一行代码：cmd + /
- 注释一整段代码：option + shift + A

4. 格式化代码
- 格式化代码：option + shift + F
- 格式化选中行代码：cmd + K cmd + F
- 代码缩进：cmd + shift + P

5. 文件、符号、代码之间的快速跳转
- control + tab(同时按住)，继续按着control键，松开tab键： 打开当前打开文件的列表，选择要打开文件，松开control就能打开对应文件
- cmd + P打开最近打开文件列表，同时列表顶部出现搜索框，搜索文件名，回车（enter），可以再当前窗口打开对应文件；使用cmd + enter会在新的编辑器窗口打开这个文件
- control + G：行跳转，输入对应数字回车，可以跳转到当前文件的当前行
- cmd + P(输入文件名 + “:” + 行数)：跳转到指定文件的指定行数
- cmd + shift + O：调出当前文件的符号（函数名等），使用方向键或者搜索，回车，就能跳转到你想要的符号；如果输入“:”可以对当前文件的所有符号进行分类
- cmd + T：打开多个文件，搜索多个文件中的符号
- F12：跳转到函数的定义处
- cmd + F12：跳转到函数的实现位置；注：js中没有接口的概念，定义和实现是相同的，所以js中的F12和Cmd + F12效果是一样的
- shift + F12：打开函数引用的预览（把光标放在函数或者类上，按shift+F12可以打开一个引用列表和内嵌编辑器）

6. 全局
- Command + Shift + P / F1 显示命令面板
- Command + P 快速打开
- Command + Shift + N 打开新窗口
- Command + W 关闭窗口

7. 基本
- Command + X 剪切（未选中文本的情况下，剪切光标所在行）
- Command + C 复制（未选中文本的情况下，复制光标所在行）

- Option + Up 向上移动行
- Option + Down 向下移动行
- Option + Shift + Up 向上复制行
- Option + Shift + Down 向下复制行

- Command + Shift + K 删除行
- Command + Enter 下一行插入
- Command + Shift + Enter 上一行插入
- Command + Shift + \ 跳转到匹配的括号
- Command + [ 减少缩进
- Command + ] 增加缩进
- Home 跳转至行首
- End 跳转到行尾
- Command + Up 跳转至文件开头
- Command + Down 跳转至文件结尾
- Ctrl + PgUp 按行向上滚动
- Ctrl + PgDown 按行向下滚动
- Command + PgUp 按屏向上滚动
- Command + PgDown 按屏向下滚动
- Command + Shift + [ 折叠代码块
- Command + Shift + ] 展开代码块
- Command + K Command + [ 折叠全部子代码块
- Command + K Command + ] 展开全部子代码块
- Command + K Command + 0 折叠全部代码块
- Command + K Command + J 展开全部代码块
- Command + K Command + C 添加行注释
- Command + K Command + U 移除行注释
- Command + / 添加、移除行注释
- Option + Shift + A 添加、移除块注释
- Option + Z 自动换行、取消自动换行

8. 多光标与选择
- Option + 点击 插入多个光标
- Command + Option + Up 向上插入光标
- Command + Option + Down 向下插入光标
- Command + U 撤销上一个光标操作
- Option + Shift + I 在所选行的行尾插入光标
- Command + I 选中当前行
- Command + Shift + L 选中所有与当前选中内容相同部分
- Command + F2 选中所有与当前选中单词相同的单词
- Command + Ctrl + Shift + Left 折叠选中
- Command + Ctrl + Shift + Right 展开选中
- Alt + Shift + 拖动鼠标 选中代码块
- Command + Shift + Option + Up 列选择 向上
- Command + Shift + Option + Down 列选择 向下
- Command + Shift + Option + Left 列选择 向左
- Command + Shift + Option + Right 列选择 向右
- Command + Shift + Option + PgUp 列选择 向上翻页
- Command + Shift + Option + PgDown 列选择 向下翻页

9. 查找替换
- Command + F 查找
- Command + Option + F 替换
- Command + G 查找下一个
- Command + Shift + G 查找上一个
- Option + Enter 选中所有匹配项
- Command + D 向下选中相同内容
- Command + K Command + D 移除前一个向下选中相同内容

10. 进阶
- Ctrl + Space 打开建议
- Command + Shift + Space 参数提示
- Tab Emmet插件缩写补全
- Option + Shift + F 格式化
- Command + K Command + F 格式化选中内容
- F12 跳转到声明位置
- Option + F12 查看具体声明内容
- Command + K F12 分屏查看具体声明内容
- Command + . 快速修复
- Shift + F12 显示引用
- F2 重命名符号
- Command + Shift + . 替换为上一个值
- Command + Shift + , 替换为下一个值
- Command + K Command + X 删除行尾多余空格
- Command + K M 更改文件语言

11. 导航
- Command + T 显示所有符号
- Ctrl + G 跳转至某行
- Command + P 跳转到某个文件
- Command + Shift + O 跳转到某个符号
- Command + Shift + M 打开问题面板
- F8 下一个错误或警告位置
- Shift + F8 上一个错误或警告位置
- Ctrl + Shift + Tab 编辑器历史记录
- Ctrl + - 后退
- Ctrl + Shift + - 前进
- Ctrl + Shift + M Tab 切换焦点

12. 编辑器管理
- Command + W 关闭编辑器
- Command + K F 关闭文件夹
- Command + \ 编辑器分屏
- Command + 1 切换到第一分组
- Command + 2 切换到第二分组
- Command + 3 切换到第三分组
- Command + K Command + Left 切换到上一分组
- Command + K Command + Right 切换到下一分组
- Command + K Command + Shift + Left 左移编辑器
- Command + K Command + Shift + Right 右移编辑器
- Command + K Left 激活左侧编辑组
- Command + K Right 激活右侧编辑组

13. 文件管理
- Command + N 新建文件
- Command + O 打开文件
- Command + S 保存文件
- Command + Shift + S 另存为
- Command + Option + S 全部保存
- Command + W 关闭
- Command + K Command + W 全部关闭
- Command + Shift + T 重新打开被关闭的编辑器
- Command + K Enter 保持打开
- Ctrl + Tab 打开下一个
- Ctrl + Shift + Tab 打开上一个
- Command + K P 复制当前文件路径
- Command + K R 在资源管理器中查看当前文件
Command + K O 新窗口打开当前文件

14. 显示
- Command + Ctrl + F 全屏、退出全屏
- Command + Option + 1 切换编辑器分屏方式（横、竖）
- Command + + 放大
- Command + - 缩小
- Command + B 显示、隐藏侧边栏
- Command + Shift + E 显示资源管理器 或 切换焦点
- Command + Shift + F 显示搜索框
- Ctrl + Shift + G 显示Git面板
- Command + Shift + D 显示调试面板
- Command + Shift + X 显示插件面板
- Command + Shift + H 全局搜索替换
- Command + Shift + J 显示、隐藏高级搜索
- Command + Shift + C 打开新终端
- Command + Shift + U 显示输出面板
- Command + Shift + V Markdown预览窗口
- Command + K V 分屏显示 Markdown预览窗口

15. 调试
- Command + F9 设置 或 取消断点
- Command + F5 开始 或 继续
- Command + F11 进入
- Shift + F11 跳出
- Command + F10 跳过
- Command + K Command + I 显示悬停信息

16. 集成终端
- Ctrl + 显示终端 Ctrl + Shift + 新建终端
- Command + Up 向上滚动
- Command + Down 向下滚动
- PgUp 向上翻页
- PgDown 向下翻页
- Command + Home 滚动到顶部
- Command + End 滚动到底部

![alt text](src/.vuepress/public/assets/images/swe/workflow-tools/vscodemac.png)