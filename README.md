# 使用说明书
## &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这是一个电子练习系统，当前的功能较少。里面包含了一个例子。
# 版本信息
当前版本：乾
（本软件使用六十四卦顺序作为版本号）  
授权协议：MIT
# 构成
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在本系统中，所有题目及与其的交互使用Paper类进行管理。通过Paper类，你可以方便地添加题目。Paper类的构造函数需要一个用于显示题目内容的HTML元素。  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;具体的题目管理，则由_Question类负责。同时为了能够较为准确地显示图片、代码和大块文字等的内容，使用_Resource作为附加资源进行管理。  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;src子目录为该程序（src.js）和Demo（main.js）的源代码，预留目录dist和tools分别为src.js的压缩版本和相关工具，例如将csv文件转换为相应的JavaScript代码，这些内容以后再写
# 使用
    let p=new Paper(document.getElementById("app")); // 新建练习册
    p.addQue(1,"题目",["选项1",0,"选项2",1],该题满分); // 第一个参数为题目类型，数组中的数字是对应选项的赋分
    p.start(); // 从欢迎页开始显示
# 题目类型和说明
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(当前版本仅支持类型1、3、5、6,且有部分功能未完善)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;大类A：1——单项选择，2——多项选择，3——客观填空，4——主观填空，5——简答，6——解答  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;大类B：7——翻译，8——分析，9——写作  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;大类C：10——证明，11——程序设计
# 回答判断规则
（1）对于单项选择题，选择最高分答案为完全正确，选择0分答案为错误，选择非0分答案为部分正确（此类情况主要在阅读理解类题目中发生）  
（2）对于多项选择题，多选、错选、漏选都不得分，暂不支持  
（3）客观填空题，每空得分累计  
（4）对于简答和解答，不进行判断，得分不累计
# 特色
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;首行缩进；即答即解。
