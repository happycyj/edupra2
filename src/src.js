/*
    edupra Version 乾
*/
class _Resource{
    constructor(){
        this.resources=[];
        this.size=0;
    }
    createNewId(type=0){
        this.size+=1;
        return this.size;
    }
    add(content,type=0){
        let nid=this.createNewId();
        this.resources.push({id:nid,type:type,content:content});
    }
    getResource(id){
        return this.resources[id-1];
    }
    parseResource(res){
        // 功能：转换为html代码
        // res为具体的一个Resource
        let result="";
        let content=res.content;
        if(res.type=="image_url"){
            // URL式图片
            result=`<img src="${content}" />`;
        }else if(res.type=="code_show"){
            // 显示代码
            result=`<pre>${content}</pre>`;
        }
        return result;
    }
}

class _Question{
    constructor(){
        this.questions=[];
        this.size=0;
        this.userscores=[];
    }
    createNewId(){
        this.size+=1;
        return this.size;
    }
    add(qtype,title,answer,maxscore,details){
        let nid=this.createNewId();
        this.questions.push({id:nid,qtype:qtype,title:title,answer:answer,maxscore:maxscore,details:details});
        this.userscores.push(-1);
    }
    parseText(src){
        // 将部分转义内容转换为HTML代码
        let dst=src;
        let tmp="";

        // 填空类型替换
        let hasBlank=/\$_blank/.test(dst);
        if(hasBlank==true){
            let arr=dst.split("$_blank");
            for(let i=0;i<arr.length;i++){
                if(i==arr.length-1) break;
                tmp+=arr[i];
                tmp+=`<span style="font-style:italic;text-decoration:underline;font-weight:bolder">&nbsp;&nbsp;&nbsp;${i+1}&nbsp;&nbsp;&nbsp;</span>`;
            }
            dst=tmp;
        }
        
        return dst;
    }
    parseQuestion(qid){
        // 将一个问题转换为HTML代码
        let que=this.questions[qid-1];
        let result=`<div id="question">`;
        result+=`<p style="font-style:italic;color:grey">第${qid}题</p>`;

        // 显示问题的内容
        result+=`<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${this.parseText(que.title)}</p>`;
        window.nowque=this;

        // 回答区域
        if(que.qtype=="1"){
            // 单项选择或多项选择，添加选项按钮
            for(let i=0;i<que.answer.length;i++){
                result+=`<p><button class="selection" id="selection_${i}" onclick="window.nowque.judgeQuestion(${qid},${i})">${this.parseText(que.answer[i].text)}</button></p>`;
            }
        }else if(que.qtype=="3"){
            // 客观填空
            let blanksnum=que.answer.length; // 此时的赋分为每空回答正确可得多少分
            for(let i=0;i<blanksnum;i++){
                result+=`<p><span>&nbsp;${i+1}&nbsp;</span><input class="blank_answer" /><span class="blank_judge"></span></p>`;   
            }
            result+=`<p><button onclick="window.nowque.judgeBlank(${qid})">提交回答</button></p>`;
        }else{
            // 简答和解答（5、6）和其它情况
            result+=`<p><button onclick="window.nowque.cannotjudge(${qid})">显示解析</button></p>`;
        }

        result+=`</div><div id="details">`;

        return result+"</div>";
    }
    judgeQuestion(qid,sindex){
        // 判断回答正误，并返回得分
        //console.log("judge");

        let que=this.questions[qid-1];
        
        let selAnswer=que.answer[sindex];

        let detailsEle=document.getElementById("details");
        let det="";
        
        if(selAnswer.score==que.maxscore){
            det+=`<p>回答情况：<span style="color:green">完全正确！</span></p>`;    
        }else if(selAnswer.score==0){
            det+=`<p>回答情况：<span style="color:red">错误</span></p>`;  
        }else{
            det+=`<p>回答情况：<span style="color:orange">部分正确！</span></p>`;  
        }

        det+=`<p>解析：</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${que.details}</p>`;
        detailsEle.innerHTML=det;
        
        if(this.userscores[qid-1]==-1){
            this.userscores[qid-1]=selAnswer.score;
            //console.log(`Score+${selAnswer.score}`);
        }
    }
    cannotjudge(qid){
        // 此种情况不计算分数
        let que=this.questions[qid-1];
        let detailsEle=document.getElementById("details");
        let det="";
        det+=`<p>参考答案：</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${que.answer}</p>`;
        det+=`<p>解析：</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${que.details}</p>`;
        detailsEle.innerHTML=det;
    }
    judgeBlank(qid){
        // 客观填空题判断正误
        let que=this.questions[qid-1];
        let detailsEle=document.getElementById("details");
        let det="";

        let blankEles=document.getElementsByClassName("blank_answer");

        let judgeShowEles=document.getElementsByClassName("blank_judge");
        let tmpScore=0;
        for(let i=0;i<judgeShowEles.length;i++){
            let judgeResult=""; // 显示的结果
            let correct=que.answer[i].text; // 正确的
            let complete=blankEles[i].value; // 回答的 
            if(complete==correct){
                judgeResult=`<span style="color:green">正确！</span>`;
                tmpScore+=que.answer[i].score;
            }else{
                judgeResult=`<span style="color:red">错误！</span>`;
            }
            judgeShowEles[i].innerHTML=judgeResult;
        }

        if(this.userscores[qid-1]==-1){
            this.userscores[qid-1]=tmpScore;
        }
        //console.log(`Score+${tmpScore}`);

        //det+=`<p>参考答案：</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${que.answer}</p>`;
        det+=`<p>解析：</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${que.details}</p>`;
        detailsEle.innerHTML=det;
    }
}

class Paper{
    constructor(parent){
        this.res=new _Resource();
        this.que=new _Question();
        this.nowid=0;
        this.parent=parent;
        this.indexpage="";
        this.lastpage="";
    }
    setIndexPage(content){
        //console.log(content)
        for(let i=0;i<content.length;i++){
            this.indexpage+=`<p style="text-align:center">${content[i]}</p>`;
        }
    }
    setLastPage(content){
        for(let i=0;i<content.length;i++){
            this.lastpage+=`<p style="text-align:center">${content[i]}</p>`;
        }
    }
    show(qid){
        let result="";
        if(qid==0){
            // 封面
            result+=this.indexpage;
        }else if(qid>this.que.size){
            // 结束页面，显示最终统计结果
            result+=this.lastpage;
            result+=`<p>得分：${this.getTotalScore()}&nbsp;满分：${this.getMaxScore()}</p><p>（仅计算客观题）</p>`;
        }else{
            //console.log("OK")
            // 显示题目,qid从1开始数，对应
            result+=this.que.parseQuestion(qid);
        }
        window.paper=this;
        result+=`<p><button class="page_prev" onclick="window.paper.prev(${qid})">上一页</button><button class="page_next" onclick="window.paper.next(${qid})">下一页</button></p>`;
        this.parent.innerHTML=result;
    }
    next(qid){
        if(qid<=this.que.size){
            this.show(qid+1);
        }
    }
    prev(qid){
        if(qid!=0){
            this.show(qid-1);
        }
    }
    addQue(qtype,title,answer,details="暂无"){
        // answer为一个数组
        let cvtanswer=[];
        let tmptext="";
        if(qtype==1 || qtype==3){
            for(let i=0;i<answer.length;i++){
                if(i%2==0){
                    tmptext=answer[i];
                }else{
                    let tmp={};
                    tmp.text=tmptext;
                    tmp.score=answer[i];
                    cvtanswer.push(tmp);
                }
            }
        }else{
            cvtanswer=answer;
        }

        // 最大得分的计算
        let maxscore=0;
        let scores=[];
        if(answer instanceof Array){
            for(let i=0;i<answer.length;i++){
                if(i%2==1){
                    scores.push(answer[i]);
                }
            }
            if(qtype=="1"){
                // 单项选择为最大的
                maxscore=Math.max.apply(null,scores);
            }else if(qtype==3){
                // 客观填空，累计求和
                for(let i=0;i<scores.length;i++){
                    maxscore+=scores[i];
                }
            }
        }
        
        this.que.add(qtype,title,cvtanswer,maxscore,details);
    }
    start(){
        this.show(0);
    }
    getTotalScore(){
        let score=0;
        for(let i=0;i<this.que.userscores.length;i++){
            if(this.que.userscores[i]>=0){
                score+=this.que.userscores[i];
            }
        }
        return score;
    }
    getQuestionsNum(type="total"){
        // 获得题目数量
        let ques=this.que.questions;
        if(type=="total"){
            // 包括主观题在内的所有题目数量
            return ques.length;
        }else if(type=="nototal"){
            // 仅包含支持判断的客观题的数量
            //console.log("No Total")
            let sum=0;
            for(let i=0;i<ques.length;i++){
                if(ques[i].qtype=="1" || ques[i].qtype=="3"){
                    sum+=1;
                }
            }
            return sum;
        }else{
            // 获取具体类型的题目数量
            let sum=0;
            for(let i=0;i<ques.length;i++){
                if(ques[i].qtype==type){
                    sum+=1;
                }
            }
            return sum;
        }
    }
    getMaxScore(){
        let score=0;
        for(let i=0;i<this.que.questions.length;i++){
            score+=this.que.questions[i].maxscore;
        }
        return score;
    }
}