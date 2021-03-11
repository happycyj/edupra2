let csv_str=`地一行\n第二行\n单项选择,测试,A,0,B,1,无`;
window.onload=main;
function main(){
    let p=new Paper(document.getElementById("app"));
    p.setLastPage(["恭喜你，完成练习！"]);
    p.readCSV(csv_str);

    /*p.addQue(1,"C语言中用于格式化输出的函数是（）。",["print()",20,"scanf()",0,"puts()",0],"print()是格式化输出函数，scanf()是格式化输入函数，puts()是输出非格式化字符串的函数。");
    p.addQue(1,"在下列描述中，对逻辑与描述正确的是（）。",["两边为假才为假",0,"两边为真才为真",20,"它是一个单目运算符",0]);
    p.addQue(5,"请简述C语言编译器是什么","C语言编译器是将C语言代码翻译为机器语言的程序");
    p.addQue(3,"请问1+1=$_blank，3+2=$_blank。",["2",20,"5",20]);
    p.addQue(3,"请问若有定义“int a=3,b=5;”，则“a>5 && b<3”的真值为$_blank（填“真”或“假”）。",["假",20]);
*/
    p.setIndexPage(["欢迎查看Demo演示，演示内容为：","C语言程序设计练习册",`共${p.getQuestionsNum()}题（包含客观题${p.getQuestionsNum("nototal")}题）`,`满分：${p.getMaxScore()}`]);
    p.start();
}
