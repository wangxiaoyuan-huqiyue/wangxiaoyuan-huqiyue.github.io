/**
 * Created by Administrator on 2017/11/26.
 * author 375361172@qq.com
 * 基类
 * V1.0.00 (20171210) 明确版本的概念 2d对象 canvas对象 资源对象 动画对象 完成实例演示填色小游戏(http://www.jq22.com/jquery-info17223);
 * V1.0.01 (20171210) 编写镜头对象 完成实例演示天火决(http://www.jq22.com/yanshi17730)
 * V1.0.02 (20180123) 完善2d对象 canvas对象 新增全局变量 METHOD 备份一些方法 完成演示挖矿人(http://www.jq22.com/yanshi18187)
 * V1.0.03 (20180304) 修复旋转碰撞的一些bug 为对象增加阴影属性shadowColor:"",shadowBlur:0,shadowOffsetX:0,shadowOffsetY:0
 */
function empty(arr){
    if(!arr.length)return;
    arr.splice(0,arr.length);
}
function extend(O1,O2){
    if(typeof O2=="undefined"||typeof O1=="undefined")return;
    for(var i in O2){
        O1[i]=O2[i];
    }
}
function each(arr,f){
    for(var i = 0;i<arr.length;i++){
        f.call(arr[i],i,arr[i]);
    }
}
/*判断透明度是否执行函数*/
function dataInfo(Obj,x,y){
    var c=document.createElement("canvas");
    var txt= c.getContext("2d");
    c.width=Obj.img.width;
    c.height=Obj.img.height;
    txt.drawImage(Obj.img,0,0);
    var data=txt.getImageData(x-1,y-1,3,3);
    var num=0;
    for(var q=0;q<data.data.length;q+=4){
        num+=data.data[q+3];
    }
    num=num/9;
    return parseInt(num);
}
var HGAME=new Object();
var METHOD = new Object();
HGAME.version="1.0.01";
METHOD.showMethod=function(){
    if(!METHOD["SAY"])return;
    for(var i in METHOD){
        if(!METHOD["SAY"][i])continue;
        console.log(i+":"+METHOD["SAY"][i]);
    }
};

//两点之间的角度
METHOD.pointAngleInfo=function(point1,point2){
    if(point2.x==point1.x&&point2.y==point1.y){
        return 0;
    }
    if(point2.x>point1.x&&point2.y>point1.y){//第一象限
        return Math.atan((point2.y-point1.y)/(point2.x-point1.x))/Math.PI*180
    }else if(point2.x<point1.x&&point2.y>point1.y){
        return Math.atan((point1.x-point2.x)/(point2.y-point1.y))/Math.PI*180+90
    }else if(point2.x<point1.x&&point2.y<point1.y){
        return Math.atan((point1.y-point2.y)/(point1.x-point2.x))/Math.PI*180+180
    }else if(point2.x>point1.x&&point2.y<point1.y){
        return Math.atan((point2.x-point1.x)/(point1.y-point2.y))/Math.PI*180+270
    }
    if(point2.x==point1.x&&point2.y>point1.y){
        return 90;
    }else if(point2.x==point1.x&&point2.y<point1.y){
        return 270;
    }else if(point2.x>point1.x&&point2.y==point1.y){
        return 360;
    }else{
        return 180;
    }
};
/*创建img对象*/
METHOD.createImg=function(src){
    var img = new Image();
    img.src=src;
    return img;
};
/*随机获取数组中的一个元素*/
METHOD.getRandomItem=function(arr){
    return arr[parseInt(Math.random()*arr.length)];
};
/*字符串数组转化为img数组*/
METHOD.arrToImg=function(arr){
    var arrs=new Array();
    for(var i =0;i<arr.length;i++){
        arrs[i]=new Image();
        arrs[i].src= arr[i];
    }
    return arrs;
};
//极坐标位移
METHOD.polarCoordinates=function(point,angle,distance){
    angle=angle%360;
    var p2={x:0,y:0};
    if(angle>0&&angle<90){
        p2.x=point.x+Math.cos(angle*2*Math.PI/360)*distance;
        p2.y=point.y+Math.sin(angle*2*Math.PI/360)*distance;
    }else if(angle>90&&angle<180){
        p2.x=point.x-Math.sin((angle-90)*2*Math.PI/360)*distance;
        p2.y=point.y+Math.cos((angle-90)*2*Math.PI/360)*distance;
    }else if(angle>180&&angle<270){
        p2.x=point.x-Math.cos((angle-180)*2*Math.PI/360)*distance;
        p2.y=point.y-Math.sin((angle-180)*2*Math.PI/360)*distance;
    }else if(angle>270&&angle<360){
        p2.x=point.x+Math.sin((angle-270)*2*Math.PI/360)*distance;
        p2.y=point.y-Math.cos((angle-270)*2*Math.PI/360)*distance;
    }
    if(angle==0||angle==360){
        p2.x=point.x+distance;
        p2.y=point.y;
    }else if(angle==90){
        p2.x=point.x;
        p2.y=point.y+distance;
    }else if(angle==180){
        p2.x=point.x-distance;
        p2.y=point.y;
    }else if(angle==270){
        p2.x=point.x;
        p2.y=point.y-distance;
    }
    return p2;
};
//判断点是否在矩形里面
METHOD.inRect=function(point,Obj){
    if(point.x>=Obj.x&&Obj.x+Obj.w>=point.x&&point.y>=Obj.y&&Obj.y+Obj.h>=point.y)return true;
    return false
};
//贝塞尔曲线2次
METHOD.bezierCurve=function(O){
    var defaultObj={
        t:0,
        P0:0,
        P1:0,
        P2:0
    };
    extend(defaultObj,O);
    //defaultObj=null;
    return (1-defaultObj.t)*(1-defaultObj.t)*defaultObj.P0+2*defaultObj.t*(1-defaultObj.t)*defaultObj.P1+defaultObj.t*defaultObj.t*defaultObj.P2;
}
METHOD.getRotatePoint=function(O){
    var ang=O.angle%360;
    var x = O.CONST_BUF_X+ O.rotatePointX;
    var y = O.CONST_BUF_Y+ O.rotatePointY;
    var x2=0;
    var y2=0;
    if(ang!=0){
        var cos =Math.cos(Math.PI/180*ang);
        var sin =Math.sin(Math.PI/180*ang);

        var bufX = (-O.rotatePointX)*cos - sin*(-O.rotatePointY);
        var bufY = (-O.rotatePointX)*sin + cos*(-O.rotatePointY);
        x2=bufX;
        y2=bufY;
    }else if(ang==0){
        x = O.CONST_BUF_X;
        y = O.CONST_BUF_Y;
    }
    return {x:x+x2,y:y+y2}
};
METHOD.getPoint=function(arr,o){
    var ang = o.angle%360;
    var bufX = 0;
    var bufY = 0;
    var sin = Math.sin(Math.PI/180*(360-ang));
    var cos = Math.cos(Math.PI/180*(360-ang));
    for(var i = 0 ;i<arr.length;i++){
        bufX=(arr[i].x- o.CONST_BUF_X- o.rotatePointX)*cos - sin *(arr[i].y- o.CONST_BUF_Y- o.rotatePointY);
        bufY=(arr[i].x- o.CONST_BUF_X- o.rotatePointX)*sin + cos *(arr[i].y- o.CONST_BUF_Y- o.rotatePointY);
        arr[i].x=bufX;
        arr[i].y=bufY;
    }
};
//托管对象的属性
METHOD.defineEx=function(O,key,val,after,before){
    var buf=val;
    Object.defineProperty(O,key,{
        set:function(v){
            before&&before.call(O,buf);
            buf=v;
            after&&after.call(O,buf);
        },
        get:function(){
            return buf;
        }
    });
};
HGAME.event=new Object();//事件对象
HGAME.event.clickBuffer=new Array();//缓存要添加事件的节点 click buffer
HGAME.attr=new Object();
HGAME.attr.bufCanvs=document.createElement("canvas");//缓存一个canvas做一些旋转 放大的操作
HGAME.attr.bufTxt=HGAME.attr.bufCanvs.getContext("2d");
HGAME.animate=function(Obj){
    Obj=Obj||{};
    var defaultObj={
        time:30,//动画间隔
        frequency:-1,//动画次数 -1表示无限制
        action:function(){},//动画每一帧的动作
        lastAction:function(){},//最后一次动画执行完成触发函数
        aSecondAction:function(){//每隔一秒指向的函数

        }
    };
    extend(defaultObj,Obj);
    var THIS = this;
    var oldTime=new Date();
    var newTime=null;
    this.time=defaultObj.time;
    this.frequency=defaultObj.frequency;

    this.action=defaultObj.action;
    this.lastAction=defaultObj.lastAction;
    this.aSecondAction=defaultObj.aSecondAction;
    this._struct="animate";
    this.stop=function(){
        cancelAnimationFrame(THIS.INT_BUFFER);
    };



    /*FPS相关*/
    this.fpsDom=document.createElement("div");
    this.fpsInt=0;
    this.showFPS=function(){
        document.body.appendChild(this.fpsDom);
        this.fpsDom.style.cssText="position:fixed;left:0;top:0;z-index:1000;";
        this.showFPSBool=true;
    };
    this.showFPSBool=false;
    this.fpsTime=new Date();
    THIS.INT_BUFFER=0;
    THIS.aSecondTime=new Date();
    this.run=function(){
        THIS.INT_BUFFER=requestAnimationFrame(THIS.run);
        newTime=new Date();
        if(THIS.showFPSBool==true){
            THIS.fpsInt++;
            if(newTime-THIS.fpsTime>=1000){
                THIS.fpsTime=newTime;
                THIS.fpsDom.innerHTML="FPS:"+THIS.fpsInt;
                THIS.fpsInt=0;
            }
        }
        if(newTime-THIS.aSecondTime>=1000){
            THIS.aSecondTime=newTime;
            THIS.aSecondAction.call(THIS,THIS);
        }
        if(newTime-oldTime>THIS.time){

            oldTime=newTime;

            if(THIS.frequency!=-1){
                if(THIS.frequency-1==0){
                    THIS.frequency--;
                    THIS.action.call(THIS,THIS);
                    THIS.lastAction.call(THIS,THIS);
                    THIS.stop();
                    return;
                }
                if(THIS.frequency==0){
                    THIS.stop();
                    return;
                }
                THIS.frequency--;
                THIS.action.call(THIS,THIS);
            }else{
                THIS.action.call(THIS,THIS);
            }
        }
        //THIS.INT_BUFFER=0;
    };
    this.action=Obj.action;
    return this;
};
/**
 * 2d对象类型
 * x 对象的x坐标
 * y 对象的y坐标
 * w 对象的宽度
 * h 对象的高度
 * color 对象的颜色
 * img 对象的img
 * child 对象的子代 子代的x y会相对于父代
 * W_INT 当一张图出现多帧的时候需要使用
 * H_INT 当一张图出现多帧的时候需要使用
 * CONST_BUF_X 在画布上的x 不用修改 修改了也没用
 * CONST_BUF_Y 在画布上的y 不用修改 修改了也没用
 *
 * click相关
 * clickFun 点击
 * isClick 是否添加点击事件
 */
HGAME.Object2D=function(Obj){
    Obj=Obj||{};
    var defaultObj={
        x:0,
        y:0,
        w:20,
        h:20,
        lastDraw:false,
        W_INT:0,
        H_INT:0,
        color:"#cccccc",
        img:null,
        child:new Array(),
        CONST_BUF_X:0,
        CONST_BUF_Y:0,
        scale:1,
        clickFun:function(){},
        isClick:false,
        angle:0,//旋转角度
        faceAngle:0,//面向角度
        shadowColor:"",
        shadowBlur:0,
        shadowOffsetX:0,
        shadowOffsetY:0,
        repeatType:"none"
    };
    extend(defaultObj,Obj);
    extend(this,defaultObj);
    METHOD.defineEx(this,"angle",defaultObj.angle,function(){
        if(this.angle>360){
            this.angle=this.angle%360;
        }else if(this.angle<0){
            this.angle=this.angle%360+360;
        }
    });
    this.CONST_BUF_X=this.x;
    this.CONST_BUF_Y=this.y;
    this.rotatePointX=Obj.rotatePointX?Obj.rotatePointX:this.w/2;
    this.rotatePointY=Obj.rotatePointY?Obj.rotatePointY:this.h/2;
    this.rotateX=this.x;
    this.rotateY=this.y;
    this._struct="Object2D";
    if(this.isClick){
        HGAME.event.clickBuffer.push(this);
    }
    this.add=function(Obj){
        this.child.push(Obj);
        Obj.parent=this;
    };
    this.remove=function(o){
        var index= this.child.indexOf(o);
        if(index>-1){
            this.child.splice(index,1);
        }
    };
    this.empty=function(){
        each(this.child,function(){
            this.parent=null;
        });
        this.child.splice(0,this.child.length);
    }
};
/**
 * 画布类型
 * dom 节点
 * w 宽度
 * h 高度
 * clearColor 默认的颜色
 * child 对象的子代 子代的x y会相对于父代
 * W_INT 当一张图出现多帧的时候需要使用
 * H_INT 当一张图出现多帧的时候需要使用
 * x 画布的x 相对于画布来说x应该是不需要改变的
 * y 画布的y 相对于划不来说y应该是不需要改变的
 * CONST_BUF_X 在画布上的x 不用修改 修改了也没用
 * CONST_BUF_Y 在画布上的y 不用修改 修改了也没用
 */
HGAME.canvas=function(Obj){
    Obj=Obj||{};
    var defaultObj={
        dom:document.createElement("canvas"),
        w:500,
        h:500,
        W_INT:0,
        lastDraw:false,
        H_INT:0,
        color:"#cccccc",
        child:new Array(),
        x:0,
        y:0,
        scale:1,
        angle:0,//旋转角度
        faceAngle:0,//面向角度
        CONST_BUF_X:0,
        CONST_BUF_Y:0,
        shadowColor:"",
        shadowBlur:0,
        shadowOffsetX:0,
        shadowOffsetY:0,
        repeatType:"none"
    };
    var THIS = this;

    Object.defineProperty(this,"w",{
        set:function(a){
            THIS.dom.width=a;
        },
        get:function(){
            return THIS.dom.width;
        }
    });
    Object.defineProperty(this,"h",{
        set:function(a){
            THIS.dom.height=a;
        },
        get:function(){
            return THIS.dom.height;
        }
    });
    extend(defaultObj,Obj);
    extend(this,defaultObj);
    METHOD.defineEx(this,"angle",defaultObj.angle,function(){
        if(this.angle>360){
            this.angle=this.angle%360;
        }else if(this.angle<0){
            this.angle=this.angle%360+360;
        }
    });
    this.CONST_BUF_X=this.x;
    this.CONST_BUF_Y=this.y;
    this.rotateX=this.x;
    this.rotateY=this.y;
    this.rotatePointX=Obj.rotatePointX?Obj.rotatePointX:this.w/2;
    this.rotatePointY=Obj.rotatePointY?Obj.rotatePointY:this.h/2;
    this._struct="canvas";
    //由于canvas只兼容ie9及以上所以这里就不对事件进行兼容了
    this.dom.addEventListener("click",function(e){
        var event=typeof window.event!="undefined"?window.event:typeof e!="undefined"?e:event;
        var x =event.offsetX;
        var y =event.offsetY;
        var aX=0;
        var aY=0;
        var buf=null;
        for(var i =0;i<HGAME.event.clickBuffer.length;i++){
            buf=HGAME.event.clickBuffer[i];
            if(x>buf.x&&x<buf.x+buf.w&&y>buf.y&&y<buf.y+buf.h){
                if(buf.img){
                    aX=x-buf.x;
                    aY=y-buf.y;
                    if(dataInfo(buf,aX,aY)>80){
                        buf.clickFun.call(buf);
                    };
                }else{
                    buf.clickFun.call(buf);
                }
            }
        }
    });
    this.txt=this.dom.getContext("2d");

    this.txt.draw=function(O){
        var ang=O.angle%360;
        var x = O.CONST_BUF_X;
        var y = O.CONST_BUF_Y;
        var txt=THIS.txt;
        txt.save();
        txt.shadowColor=O.shadowColor,
        txt.shadowBlur=O.shadowBlur,
        txt.shadowOffsetX=O.shadowOffsetX,
        txt.shadowOffsetY=O.shadowOffsetY;
        if(ang!=0){
            txt.translate(O.rotatePointX, O.rotatePointY);
            txt.rotate(Math.PI/180*ang);
            txt.translate(-O.rotatePointX,-O.rotatePointY);
            var cos =Math.cos(Math.PI/180*(360-ang));
            var sin =Math.sin(Math.PI/180*(360-ang));
            var bufX = x*cos- sin*y;
            var bufY=x*sin+cos*y;
            x=bufX;
            y=bufY;
        }
        O.rotateX=x;
        O.rotateY=y;
        if(O.repeatType=="none"){
            if(O.img){
                txt.drawImage( O.img, O.w* O.W_INT,  O.h* O.H_INT, O.w, O.h, x, y, O.w* O.scale, O.h*O.scale);
            }else if(O.dom){
                txt.drawImage( O.dom, O.w* O.W_INT,  O.h* O.H_INT, O.w, O.h, x, y, O.w*O.scale, O.h*O.scale);
            }else{
                txt.fillStyle= O.color;
                txt.fillRect(x, y, O.w*O.scale, O.h*O.scale);
            }
            txt.shadowColor="";
            txt.shadowBlur=0;
            txt.shadowOffsetX=0;
            txt.shadowOffsetY=0;
            txt.restore();
        }else if(O.repeatType=="repeat"){
            txt.translate(x,y);
            txt.fillStyle=txt.createPattern(O.img,"repeat");
            txt.fillRect(0, 0, O.w*O.scale,O.h*O.scale);
            txt.shadowColor="",
            txt.shadowBlur=0,
            txt.shadowOffsetX=0,
            txt.shadowOffsetY=0;
            txt.restore();
        }

    };
    this.clear=function(){
        this.txt.clearRect(0,0,THIS.w,THIS.h);
    };
    this.lastDrawArr = [];
    this.render=function(){
        this.clear();
        this.txt.beginPath();

        function f(O){
            each(O.child,function(){
                this.CONST_BUF_X= O.CONST_BUF_X+this.x;
                this.CONST_BUF_Y= O.CONST_BUF_Y+this.y;
                if(this.lastDraw==true){
                    if(THIS.lastDrawArr.indexOf(this)==-1)THIS.lastDrawArr.push(this);
                    return;
                }
                THIS.txt.draw(this);
                if(this.child.length){
                    f(this);
                }
            });
        }
        f(THIS);
        each(THIS.lastDrawArr,function(){
            THIS.txt.draw(this);
            if(this.child.length){
                f(this);
            }
        });
        this.txt.closePath();
    };
    this.add=function(Obj){
        this.child.push(Obj);
        Obj.parent=this;
    };
    this.remove=function(o){
        var index= this.child.indexOf(o);
        if(index>-1){
            this.child.splice(index,1);
        }
        var index02= this.lastDrawArr.indexOf(o);
        if(index02>-1){
            this.lastDrawArr.splice(index02,1);
        }
    };
    this.empty=function(){
        each(this.child,function(){
            this.parent=null;
        });
        this.child.splice(0,this.child.length);
        this.lastDrawArr.splice(0,this.lastDrawArr.length);
    }
};
/**
 * 获取资源类型
 * data 一个资源字符串地址
 * loaded 所有资源加载完成
 * loadCall 加载资源的数字发生改变触发函数
 * loadNum 当前已经加载了多少资源
 * loadedSource 主动加载资源 当前资源对象的data会被改变 loadNum也会改变 触发的函数是第二个传入的参数
 * */
HGAME.source=function(Obj){
    Obj=Obj||{};
    var defaultObj={
        data:[],
        loaded:function(THIS){

        },
        loadCall:function(num,allNum){

        },
        loadNum:0
    };
    extend(defaultObj,Obj);
    extend(this,defaultObj);
    var THIS = this;
    var $valueBuff="";
    THIS._struct="source";
    Object.defineProperty(this,"loadNum",{
        get:function(){
            return $valueBuff;
        },
        set:function(v){
            if(THIS.data)THIS.loadCall.call(THIS,v,THIS.data.length);
            $valueBuff=v;
        }
    });
    var buf="";
    this.loadedSource=function(data,callBack){
        if(!THIS.data)return;
        THIS.data=data;
        THIS.loadNum=0;
        for(var i=0;i<THIS.data.length;i++){
            if(typeof this.data[i]=="string"){
                buf=THIS.data[i];
                THIS.data[i]=new Image();
                THIS.data[i].src=buf;
            }

        }
        for(i=0;i<THIS.data.length;i++){
            if(THIS.data[i].complete==true){
                THIS.data[i].width=parseInt(THIS.data[i].width);
                THIS.data[i].height=parseInt(THIS.data[i].height);
                THIS.loadNum++;
                if(THIS.loadNum==THIS.data.length){
                    callBack.call(THIS,THIS);
                }
            }else{
                THIS.data[i].onload=function(){
                    THIS.loadNum++;
                    if(THIS.loadNum==THIS.data.length){
                        callBack.call(THIS,THIS);
                    }
                    THIS.width=parseInt(THIS.width);
                    THIS.height=parseInt(THIS.height);
                };
                THIS.data[i].onerror=function(){
                    window.debuggerSource=THIS;
                }
            }
        }
    };
    for(var i=0;i<this.data.length;i++){
        if(typeof this.data[i]=="string"){
            buf=this.data[i];
            this.data[i]=new Image();
            this.data[i].src=buf;
        }
    }
    for(i=0;i<this.data.length;i++){
        if(this.data[i].complete==true){
            this.data[i].width=parseInt(this.data[i].width);
            this.data[i].height=parseInt(this.data[i].height);
            this.loadNum++;
            if(this.loadNum==this.data.length){
                console.log(this);
                console.log("not Load:"+this.loadNum);
                this.loadNum=0;
                this.loaded.call(this,this);
            }
        }else{
            this.data[i].onload=function(){
                THIS.loadNum++;
                if(THIS.loadNum==THIS.data.length){
                    console.log(THIS.loadNum);
                    console.log("Load:"+THIS.loadNum);
                    THIS.loadNum=0;
                    THIS.loaded.call(THIS,THIS);
                }
                this.width=parseInt(this.width);
                this.height=parseInt(this.height);
            };
            this.data[i].onerror=function(){
               // window.debuggerSource=THIS;
                console.log(THIS)
            }
        }
    }

};
/**
 * Camera 镜头对象
 * w 镜头节点的宽度
 * h 镜头节点的高度
 * x 镜头相对于源canvas的x
 * y 镜头相对于源canvas的y
 * child 整合的canvas对象
 * srcCanvas源canvas
 * 方法
 * this.render 着色 会自动着色child canvas对象里面的所有
 * this.initSrcCanvasWH 设置源canvas的宽高
 * this.initSrcCanvasImg 绘制源canvas
 * this.add 新增一个子canvas对象
 * */
HGAME.camera=function(Obj){
    Obj=Obj||{};
    var defaultObj={
        srcCanvas:null, //源canvas对象
        w:500,
        h:500,
        x:0,
        y:0,
        child:new Array()
    };
    extend(defaultObj,Obj);//深继承
    extend(this,defaultObj);
    this._struct="camera";
    this.canvas=new HGAME.canvas({
        w:this.w,
        h:this.h,
        x:this.x,
        y:this.y
    });//视图canvas 呈现canvas的canvas
    var keys=["w","h","x","y","dom"];
    var THIS = this;
    this.obj2d=new HGAME.Object2D({
        x:this.x,
        y:this.y
    });
    for(var i =0;i<keys.length;i++){
        (function(key){
            Object.defineProperty(THIS,key,{
                set:function(v){
                    THIS.canvas[key]=v;
                    if(key=="x"){
                        THIS.obj2d.x=v;
                    }else if(key=="y"){
                        THIS.obj2d.y=v;
                    }

                },
                get:function(){
                    return THIS.canvas[key];
                }
            });
        })(keys[i]);
    }
    this.srcCanvas=this.srcCanvas==null?new HGAME.canvas():this.srcCanvas;
    this.render=function(){
        if(this.srcCanvas==null)return console.log("srcCanvas is null");
        this.initSrcCanvasWH();
        this.initSrcCanvasImg();
        this.canvas.child[0]=this.obj2d;
        this.canvas.render();
    };
    this.getSrcWidth=function(){
        if(!this.child.length)return console.log("not find child");
        var bufMin=0;
        var bufMax=0;
        var bufW=0;
        for(var o =0;o<this.child.length;o++){
            if(this.child[o].x<bufMin){
                bufMin=this.child[o].x;
            }
            if(this.child[o].x>bufMax){
                bufMax=this.child[o].x;
            }
            if(this.child[o].w>bufW){
                bufW=this.child[o].w;
            }
        }
        bufMax=bufMax+bufW;
        return Math.abs(bufMin-bufMax);
    };
    this.getSrcHeight=function(){
        if(!this.child.length)return console.log("not find child");
        var bufMin=0;
        var bufMax=0;
        var bufH=0;
        for(var o =0;o<this.child.length;o++){
            if(this.child[o].y<bufMin){
                bufMin=this.child[o].y;
            }
            if(this.child[o].y>bufMax){
                bufMax=this.child[o].y;
            }
            if(this.child[o].h>bufH){
                bufH=this.child[o].h;
            }
        }
        bufMax=bufMax+bufH;
        return Math.abs(bufMin-bufMax);
    };
    this.initSrcCanvasWH=function(){
        this.srcCanvas.w=this.getSrcWidth();
        this.srcCanvas.h=this.getSrcHeight();
        this.obj2d.w=this.srcCanvas.w;
        this.obj2d.h=this.srcCanvas.h;
    };
    this.initSrcCanvasImg=function(){
        this.srcCanvas.child=this.child;
        this.srcCanvas.render();
        this.obj2d.img=this.srcCanvas.dom;
    };
    this.add=function(o){
        this.child.push(o);
        o.parent=this;
    };
    this.remove=function(o){
       var index= this.child.indexOf(o);
        if(index>-1){
            this.child.splice(index,1);
        }
    };
    this.empty=function(){
        each(this.child,function(){
            this.parent=null;
        });
        this.child.splice(0,this.child.length);
    }
};
/**
 * 碰撞对象
 *
 * */
HGAME.collision=function(Obj){
    Obj=Obj||{};
    var defaultObj={
        x1:"CONST_BUF_X",
        y1:"CONST_BUF_Y",
        x2:"CONST_BUF_X",
        y2:"CONST_BUF_Y",
        w1:"w",
        w2:"w",
        h1:"h",
        h2:"h"
    };
    extend(defaultObj,Obj);//深继承
    extend(this,defaultObj);
    this._struct="collision";
    /*非旋转碰撞AABB*/
    this.test=function(o1,o2){
            var o3={

            };
            extend(o3,this);
            var strQz="";
            var fun=function(){
                if(o1[o3.x1]>o2[o3.x2]&&o1[o3.x1]<o2[o3.x2]+o2[o3.w2]&&o1[o3.y1]>o2[o3.y2]&&o1[o3.y1]<o2[o3.y2]+o2[o3.h2]){
                    return strQz+"pzRT";//右顶部
                }else if(o1[o3.x1]+o1[o3.w1]>o2[o3.x2]&&o1[o3.x1]+o1[o3.w1]<o2[o3.x2]+o2[o3.w2]&&o1[o3.y1]>o2[o3.y2]&&o1[o3.y1]<o2[o3.y2]+o2[o3.h2]){
                    return strQz+"pzLT";//左顶部
                }else if(o1[o3.x1]>o2[o3.x2]&&o1[o3.x1]<o2[o3.x2]+o2[o3.w2]&&o1[o3.y1]+o1[o3.h1]>o2[o3.y2]&&o1[o3.y1]+o1[o3.h1]<o2[o3.y2]+o2[o3.h2]){
                    return strQz+"pzRB";//右底部
                }else if((o1[o3.x1]+o1[o3.w1]>o2[o3.x2]&&o1[o3.x1]+o1[o3.w1]<o2[o3.x2]+o2[o3.w2]&&o1[o3.y1]+o1[o3.h1]>o2[o3.y2]&&o1[o3.y1]+o1[o3.h1]<o2[o3.y2]+o2[o3.h2])){
                    return strQz+"pzLB";//左底部
                }else if((o1[o3.y1]+o1[o3.h1])==o2[o3.y2]&&o1[o3.x1]>o2[o3.x2]-o1[o3.w1]&&o1[o3.x1]<o2[o3.x2]+o2[o3.w2]){
                    return strQz+"pzBT";//顶部边框
                }else if(o1[o3.y1]==o2[o3.y2]+o2[o3.h2]&&o1[o3.x1]>o2[o3.x2]-o1[o3.w1]&&o1[o3.x1]<o2[o3.x2]+o2[o3.w2]){
                    return strQz+"pzBB";//底部边框
                }else if(o1[o3.x1]+o1[o3.w1]==o2[o3.x2]&&o1[o3.y1]>o2[o3.y2]-o1[o3.h1]&&o1[o3.y1]<o2[o3.y2]+o2[o3.h2]){
                    return strQz+"pzBL";//左部边框
                }else if(o1[o3.x1]==o2[o3.x2]+o2[o3.w2]&&o1[o3.y1]>o2[o3.y2]-o1[o3.h1]&&o1[o3.y1]<o2[o3.y2]+o2[o3.h2]){
                    return strQz+"pzBR";//右部边框
                }else{
                    return "pzNO"
                }
            };
        var str=fun();
        var O4=null;

        if(str=="pzNO"){
            O4=o1;
            o1=o2;
            o2=O4;
            strQz="jh";
            return fun();

        }else{
            return str;
        }

    };
    function changeVal(O1,O2){
        O2=O2||{a:"x0",b:"x1"};
        if(O1[O2.a]>O1[O2.b]){
            var buf = O1[O2.a];
            O1[O2.a]=O1[O2.b];
            O1[O2.b]=buf;
        }
    }
    /*旋转碰撞OBB*/
    this.rotateTest=function(o1,o2,txt){
        //获得矩形的八个点
        function a(o1,o2){
            var bool1=false;
            var bool2=false;
            var p1=METHOD.getRotatePoint(o1);//获取旋转的左顶点
            var p2=METHOD.polarCoordinates(p1,o1.angle,o1.w);//获取o1对象的右顶点
            var p3=METHOD.polarCoordinates(p1,o1.angle+90,o1.h);//获取o1对象的左底顶点
            var p4=METHOD.polarCoordinates(p3,o1.angle,o1.w);

            var p21=METHOD.getRotatePoint(o2);//获取旋转的左顶点
            var p22=METHOD.polarCoordinates(p21,o2.angle,o2.w);//获取o1对象的右顶点
            var p23=METHOD.polarCoordinates(p21,o2.angle+90,o2.h);//获取o1对象的左底顶点
            var p24=METHOD.polarCoordinates(p23,o2.angle,o2.w);
            var arr3=[p1,p2,p3,p4,p21,p22,p23,p24];
            METHOD.getPoint(arr3,o1);
          /*  txt.save();
            txt.translate(100,100);
            for(var w=0;w<arr3.length;w++){
                txt.beginPath();
                txt.arc(arr3[w].x,arr3[w].y,2,0,2*Math.PI);
                txt.fillText(w+"",arr3[w].x,arr3[w].y);
                txt.fill();
                txt.closePath();
            }
            txt.restore();
            txt.beginPath();
            txt.arc(o1.CONST_BUF_X+o1.w/2,o1.CONST_BUF_Y+o1.h/2,2,0,2*Math.PI);
            txt.fill();
            txt.closePath();*/
            var jxXxd={
                x0:Math.min(p1.x,p2.x,p3.x,p4.x),
                x1:Math.max(p1.x,p2.x,p3.x,p4.x)
            };
            var jxXxd2={
                x0:Math.min(p21.x,p22.x,p23.x,p24.x),
                x1:Math.max(p21.x,p22.x,p23.x,p24.x)
            };
            var jxYxd={
                x0:Math.min(p1.y,p2.y,p3.y,p4.y),
                x1:Math.max(p1.y,p2.y,p3.y,p4.y)
            };
            var jxYxd2={
                x0:Math.min(p21.y,p22.y,p23.y,p24.y),
                x1:Math.max(p21.y,p22.y,p23.y,p24.y)
            };
            if(jxXxd.x0<jxXxd2.x1&&jxXxd.x0>jxXxd2.x0){
                bool1=true;
            }else if(jxXxd.x1<jxXxd2.x1&&jxXxd.x1>jxXxd2.x0){
                bool1=true;
            }else if(jxXxd.x0>jxXxd2.x0&&jxXxd.x1<jxXxd2.x1){
                bool1=true;
            }else if(jxXxd2.x0<jxXxd.x1&&jxXxd2.x0>jxXxd.x0){
                bool1=true;
            }else if(jxXxd2.x1<jxXxd.x1&&jxXxd2.x1>jxXxd.x0){
                bool1=true;
            }else if(jxXxd2.x0>jxXxd.x0&&jxXxd2.x1<jxXxd.x1){
                bool1=true;
            }


            if(jxYxd.x0<jxYxd2.x1&&jxYxd.x0>jxYxd2.x0){
                bool2=true;
            }else if(jxYxd.x1<jxYxd2.x1&&jxYxd.x1>jxYxd2.x0){
                bool2=true;
            }else if(jxYxd.x0>jxYxd2.x0&&jxYxd.x1<jxYxd2.x1){
                bool2=true;
            }else if(jxYxd2.x0<jxYxd.x1&&jxYxd2.x0>jxYxd.x0){
                bool2=true;
            }else if(jxYxd2.x1<jxYxd.x1&&jxYxd2.x1>jxYxd.x0){
                bool2=true;
            }else if(jxYxd2.x0>jxYxd.x0&&jxYxd2.x1<jxYxd.x1){
                bool2=true;
            }

            if(bool1==true&&bool2==true){
                return true;
            }
            return false;
        }

        if(a(o1,o2)==true){
            return  a(o2,o1);
        }else{
            return false;
        }
    };
};



/*随机创建鱼类型*/
HGAME.fishStruct=function(Obj){
    this._struct="fishStruct";
    var defaultObj = {
        createFishArray:[],//创建的鱼
        method:[],
        method02:[],
        maxNum:10,//创建鱼的最大数量
        defaultAngle:-1,//默认的面向角度
        fishType:"",
        fishInfo:{},
        imgUrl:"",
        createTimeBufBuf:0,
        fishXInfo:[-50,0],
        fishYInfo:[-50,0],
        minAngleInfo:[10,30],
        maxAngleInfo:[80,100],
        w:0,
        h:0,
        createAllTime:"none",
        createAllTimeBuf:"none",
        moveSpeed:5,
        PH:1,
        addNum:1,
        deathNum:0.4,
        createTime:-10,
        createTimeBuf:2000,
        swimArr:[],//游动动画数组
        deathArray:[],//死亡动画数组
        createFishEnd:function(fish){}
    };
    extend(defaultObj,Obj);


    this.createFish=function(centerObj){
        if(this.createAllTime!="none"&&typeof this.createAllTime=="number"){
            if(this.createAllTime<=0){
                this.createAllTime=0;
                return;
            }else{
                this.createAllTime-=centerObj.animate.time;
            }
        }
        if(this.createFishArray.length>this.maxNum)return;
        if(this.createTime<0){this.createTime=this.createTimeBuf}else{this.createTime-=centerObj.animate.time;return;}
        var img = METHOD.createImg(this.imgUrl);
        var minAng=typeof this.minAngleInfo == "string"||typeof this.minAngleInfo == "number"?this.minAngleInfo:Math.random()*(this.minAngleInfo[1]-this.minAngleInfo[0])+this.minAngleInfo[0];
        var maxAng=typeof this.maxAngleInfo == "string"||typeof this.maxAngleInfo == "number"?this.maxAngleInfo:Math.random()*(this.maxAngleInfo[1]-this.maxAngleInfo[0])+this.maxAngleInfo[0];
        var xInfo=typeof this.fishXInfo == "string"||typeof this.fishXInfo == "number"?this.fishXInfo:Math.random()*(this.fishXInfo[1]-this.fishXInfo[0])+this.fishXInfo[0];
        var yInfo=typeof this.fishYInfo == "string"||typeof this.fishYInfo == "number"?this.fishYInfo:Math.random()*(this.fishYInfo[1]-this.fishYInfo[0])+this.fishYInfo[0];
        var PH =typeof this.PH == "string"||typeof this.PH == "number"?this.PH:parseInt(Math.random()*(this.PH[1]-this.PH[0])+this.PH[0]);
        this.fishInfo={
            x:xInfo,
            y:yInfo,
            minAngle:minAng,
            maxAngle:maxAng,
            img:img,
            moveSpeed:this.moveSpeed,
            deathNum:this.deathNum,
            w:this.w,
            h:this.h,
            PH:PH,
            fishType:this.fishType,
            addNum:this.addNum,
            method:this.method,
            method02:this.method02,
            belong:this,
            angle:this.defaultAngle==-1?minAng:this.defaultAngle,
            swimArr:this.swimArr,//游动动画数组
            deathArray:this.deathArray//死亡动画数组
        };
        var fish = new HGAME.fish(this.fishInfo);
        this.createFishArray.push(fish);
        centerObj.maxBox.add(fish);
        centerObj.fishArr.push(fish);
        this.createFishEnd.call(this,fish);
    };

    extend(this,defaultObj);


};
/*鱼类型*/
HGAME.fish = function(Obj){
    HGAME.Object2D.call(this,Obj);
    this._struct="fish";
    var defaultObj = {
        swimArr:[],//游动动画数组
        deathArray:[],//死亡动画数组
        deathTime:1000,//死亡时间
        death:false,//是否死亡
        belong:null,

        moveSpeed:5,//移动速度
        maxAngle:90,//当角度大于这个值的时候减少
        minAngle:20,//当角度小于这个值的时候增加
        addAngleType:1, //1增加角度 0减少角度
        addAngleVal:2,//角度改变的值
        deathNum:0.01,
        isChangeAngle:true,//是否改变角度
        isAdd:false,//是否一直增加角度
        isNoAdd:false//是否一直减小角度
    };
    extend(defaultObj,Obj);
    this.nowImgInfo = 0;
    this.changeAngeleForMoveA=function(){
        if(this.x+this.w>700){
            this.isChangeAngle=true;
            this.addAngleVal=0.5;
        }
    };
    this.changeAngeleForMoveB=function(){
        if(this.death==true){
            return;
        }
        if(this.y+this.h>600){
           this.angle-=0.5;
        }
    };
    this.changeAngeleForMoveC=function(){
        if(this.death==true){
            return;
        }
        if(typeof this.changeAngeleForMoveCAng=="undefined"){
            this.bufAng=0;
            this.changeAngeleForMoveCAng=false;
        }
        if(!this.changeAngeleForMoveCAng){
            this.bufAng+=0.25;
        }else{
            this.bufAng-=0.25;
        }
        if(this.bufAng>100){
            this.changeAngeleForMoveCAng=true;
        }else if(this.bufAng<-100){
            this.changeAngeleForMoveCAng=false;
        }
        this.angle=this.bufAng;
    };
    this.changeImgInfo=function(){
          if(this.death==false){
                if(!this.swimArr[this.nowImgInfo]){console.log(this.img.src);return;}
                this.H_INT=this.swimArr[this.nowImgInfo].h;
                this.W_INT=this.swimArr[this.nowImgInfo].w;
                if(this.nowImgInfo>=this.swimArr.length-1){
                    this.nowImgInfo=0;
                }else{
                    this.nowImgInfo++;
                }
          }else if(this.death==true){
              if(!this.deathArray[this.nowImgInfo]){console.log(this.img.src);return;}
              this.H_INT=this.deathArray[this.nowImgInfo].h;
              this.W_INT=this.deathArray[this.nowImgInfo].w;
              if(this.nowImgInfo>=this.deathArray.length-1){
                  this.nowImgInfo=0;
              }else{
                  this.nowImgInfo++;
              }
          }
    };
    this.createGold=function(centerObj){

        if(Math.random()>0.999){
            var gold22 = new HGAME.gold({
                targetRect:centerObj.goldInfo.targetRect,
                addNum:1,
                changeAttr:"wpNum",
                img:  centerObj.jnInfo.wpObj.img,
                imgAmtInfo:[{w:0,h:0}],
                w:106,
                h:106,
                x:this.x,
                y:this.y,
                scale:0.56603,
                fx:Math.random()
            });
            centerObj.goldArr.push(gold22);
            centerObj.maxBox.add(gold22);
            return;
        }
        var addNum = parseInt(this.addNum/10);
        var addNum2 = this.addNum%10;

        var y = 0;
        for(var i = 0;i<addNum;i++){
            var gold1 = new HGAME.gold({
                targetRect:centerObj.goldInfo.targetRect,
                addNum:10,
                img:centerObj.imgGlod2,
                imgAmtInfo: centerObj.goldInfo.imgInfoArr,
                w:centerObj.goldInfo.w,
                h:centerObj.goldInfo.h,
                x:this.x+centerObj.goldInfo.w*i,
                y:this.y+y,
                fx:Math.random(),
            });
            centerObj.goldArr.push(gold1);
            centerObj.maxBox.add(gold1);
        }
        y=y+centerObj.goldInfo.h+20;
        for( i = 0;i<addNum2;i++){
            var gold2 = new HGAME.gold({
                targetRect:centerObj.goldInfo.targetRect,
                addNum:1,
                fx:Math.random(),
                img:centerObj.imgGlod,
                imgAmtInfo: centerObj.goldInfo.imgInfoArr,
                w:centerObj.goldInfo.w,
                h:centerObj.goldInfo.h,
                x:this.x+centerObj.goldInfo.w*i,
                y:this.y+y
            });
            centerObj.goldArr.push(gold2);
            centerObj.maxBox.add(gold2);
        }

    };
    this.deathAfter= function(centerObj){
        if(this.death==true){
            if(this.deathTime<=0){
                centerObj.maxBox.remove(this);

                this.belong.createFishArray.splice( this.belong.createFishArray.indexOf(this),1);
                centerObj.fishArr.splice( centerObj.fishArr.indexOf(this),1);

            }else{
                this.deathTime-=centerObj.animate.time;
            }
        }
    };
    this.isScreenOut=function(centerObj){
        var rect = {
            x:-this.w-100,
            y:-this.w-100,
            w:centerObj.maxBox.w-(-this.w-100)*2,
            h:centerObj.maxBox.h-(-this.h-100)*2
        };
        if(!METHOD.inRect({
            x:this.x,
            y:this.y
        },rect)){
            centerObj.maxBox.remove(this);
            this.belong.createFishArray.splice( this.belong.createFishArray.indexOf(this),1);
            centerObj.fishArr.splice( centerObj.fishArr.indexOf(this),1);
        }
    };
    /*改变角度相关*/
    this.changeAngle=function(){
        if(this.death)return;
        if(!this.isChangeAngle)return;
        if(this.isAdd){this.angle+=this.addAngleVal;return}
        if(this.isNoAdd){this.angle-=this.addAngleVal;return}
        if(this.addAngleType==1){
            this.angle+=this.addAngleVal;
        }else if(this.addAngleType==0){
            this.angle-=this.addAngleVal;
        }
        if(this.angle>=this.maxAngle){
            this.addAngleType=0;
        }else if(this.angle<=this.minAngle){
            this.addAngleType=1;
        }
    };
    /*向前移动*/
    this.moveForward=function(){
        if(this.death)return;
        var   p= METHOD.polarCoordinates({x:this.x,y:this.y},this.angle,this.moveSpeed);
        this.x= p.x;
        this.y= p.y;
    };
    extend(this,defaultObj);
};
/*炮架类型*/
HGAME.bulletA=function(Obj){
    HGAME.Object2D.call(this,Obj);
    this._struct="bulletA";
    var defaultObj = {
        imgArr:[],
        nowImg:0,
        bulletImgArr:[],
        changeImgArr:[],
        gridImgArr:[],
        imgInfoTxt:""
    };
    extend(defaultObj,Obj);
    this.nowImg=0;
    this.changeImg=function(type){
        if(type=="add"){
            if(this.nowImg<this.imgArr.length-1){
                this.nowImg++;
            }else {
                this.nowImg=0;
            }

        }else if(type=="noAdd"){
            if(this.nowImg>0){
                this.nowImg--;
            }else {
                this.nowImg=this.imgArr.length-1;
            }
        }
        if(typeof this.imgArr[this.nowImg]!="undefined"){
            this.img= this.imgArr[this.nowImg];
        }
    };
    this.imgInfo=0;
    this.changeImgInfo=function(){
        this.H_INT=this.changeImgArr[this.imgInfo].h;
        this.W_INT=this.changeImgArr[this.imgInfo].w;
        if(this.imgInfo>=this.changeImgArr.length-1){
            this.imgInfo=0;
        }else{
            this.imgInfo++;
        }
        this.w=this.img.width/this.imgInfoTxt.split("x")[0];
        this.h=this.img.height/this.imgInfoTxt.split("x")[1];
        this.x=this.pt.x+this.pt.w/2-this.w/2+42;
        this.y=this.pt.y-5-2*this.nowImg;
        this.rotatePointX=this.w/2;
        this.rotatePointY=this.h;
    };
    this.createBullte=function(centerObj,t){
        t=t||"";
        var point={
            x:this.x+this.rotatePointX-this.bulletImgArr[this.nowImg].width/2,
            y:this.y+this.rotatePointY-this.bulletImgArr[this.nowImg].height/2
        };
        if(t=="1"){
            point={
                x:this.x+this.rotatePointX-centerObj.bufObj.power.noDeathArr[0].width/2,
                y:this.y+this.rotatePointY-centerObj.bufObj.power.noDeathArr[0].height/2,
            }
        }
        var p2=METHOD.polarCoordinates(point,this.angle+270,this.h);
        var bullteB=null;
        if(t=="1"){
            bullteB=new HGAME.bulletB({
                noDeathImg:centerObj.bufObj.power.noDeathArr,
                deathImg:centerObj.bufObj.power.deathArr,
                belong:this,
                angle:this.angle,
                x:p2.x,
                y:p2.y,
                type:1,
                hurtInfo:20
            })
        }else{
            bullteB=new HGAME.bulletB({
            noDeathImg:this.bulletImgArr[this.nowImg],
            deathImg:this.gridImgArr[this.nowImg],
            belong:this,
            angle:this.angle,
            x:p2.x,
            y:p2.y,
            hurtInfo:this.nowImg
        });

        }

        centerObj.bulletArr.push(bullteB);
        centerObj.maxBox.add(bullteB);
    };
    if(this.imgArr.length>0){
        if(typeof this.imgArr[this.nowImg]!="undefined"){
            this.img= this.imgArr[this.nowImg];
        }else{
            this.img= this.imgArr[0];
        }
        this.w=this.img.width/this.imgInfoTxt.split("x")[0];
        this.h=this.img.height/this.imgInfoTxt.split("x")[1];
        this.x=this.pt.x+this.pt.w/2-this.w/2+42;
        this.y=this.pt.y-5-2*this.nowImg;
        this.rotatePointX=this.w/2;
        this.rotatePointY=this.h;
    }
    extend(this,defaultObj);
};
/*炮弹类型*/
HGAME.bulletB=function(Obj){
    HGAME.Object2D.call(this,Obj);
    this._struct='bulletB';
    var defaultObj = {
        noDeathImg:null,
        deathImg:null,
        deathType:0,//0子弹状态 1网状态
        deathTime:1200,
        belong:null,
        hurtTime:-10,
        hurtVal:1,
        hurtTimeBuf:500,
        moveSpeed:8,
        hurtInfo:0,type:0
    };
    extend(defaultObj,Obj);
    /*向前移动*/
    this.moveForward=function(){
        //debugger;
        if(this.deathType!=0)return;
        //debugger;
        var   p= METHOD.polarCoordinates({x:this.x,y:this.y},this.angle+270,this.moveSpeed);
        this.x= p.x;
        this.y= p.y;
    };
    this.nowImg=0;
    this.changeImageInfo=function(){
        if(this.noDeathImg.length&&this.deathImg.length){
            if(this.nowImg+1<=this.nowImgArr.length-1){
                this.nowImg=this.nowImg+1
            }else{
                this.nowImg=0;
            }
            this.img=this.nowImgArr[this.nowImg];
        }

    };
    this.colObj=new HGAME.collision();
    this.colFish=function(centerObj){
        var i =0;
        var bool = false;
        for(;i<centerObj.fishArr.length;i++){
            if(this.colObj.rotateTest(this,centerObj.fishArr[i])&&centerObj.fishArr[i].death!=true){
                bool=true;
                if(this.deathType==0){
                    if(this.type==0){
                        this.changeDeathType(1);
                    }
                }
                if(this.type==1&&!centerObj.fishArr[i].createPower){
                    centerObj.fishArr[i].createPower=true;
                    var bullteB=new HGAME.bulletB({
                        noDeathImg:this.noDeathImg,
                        deathImg:this.deathImg,
                        belong:centerObj.p,
                        angle:this.angle,
                        x:centerObj.fishArr[i].x-this.deathImg[0].width/2,
                        y:centerObj.fishArr[i].y-this.deathImg[0].height/2,
                        hurtInfo:this.hurtInfo,
                        deathTime:25000,
                        hurtTimeBuf:100,
                        type:2
                    });
                    bullteB.changeDeathType(1);
                    centerObj.bulletArr.push(bullteB);
                    centerObj.maxBox.add(bullteB);
                }
                if(this.hurtTime<=0){
                    var num  = Math.random()-0.05*this.hurtInfo;

                    if(num<centerObj.fishArr[i].deathNum){
                        if(centerObj.fishArr[i].PH-1<=0){

                            centerObj.fishArr[i].PH=0;
                            centerObj.fishArr[i].death=true;
                            centerObj.fishArr[i].nowImgInfo=0;
                            centerObj.fishArr[i].createGold(centerObj);

                        }else{
                            centerObj.fishArr[i].PH-=this.hurtVal;
                        }

                    }
                }
            }
        }
        if(bool){
            this.hurtTime=this.hurtTimeBuf;
        }
    };
    /**/
    this.nowImgArr=this.noDeathImg;
    this.changeDeathType=function(num,info){
        var w = this.w;
        var h = this.h;
        this.deathType=num;
        if(this.deathType==0){
            if(this.noDeathImg.length){
                this.nowImg=0;
                this.img=this.noDeathImg[0];
                this.nowImgArr=this.noDeathImg;
            }else{
                this.img = this.noDeathImg;
            }


        }else if(this.deathType==1){
            if(this.deathImg.length){
                this.nowImg=0;
                this.img=this.deathImg[0];
                this.nowImgArr=this.deathImg;
            }else{
                this.img = this.deathImg;
            }
        }
        this.w=this.img.width;
        this.h=this.img.height;
        if(num==1){
            this.angle=0;
            this.x = this.x-this.w/2+w/2;
            this.y = this.y-this.h/2+h/2
        }
    };
    this.isScreenOut=function(centerObj){
        var rect = {
            x:-this.w-30,
            y:-this.w-30,
            w:centerObj.maxBox.w-(-this.w-30)*2,
            h:centerObj.maxBox.h-(-this.h-30)*2
        };
        if(!METHOD.inRect({
                x:this.x,
                y:this.y
            },rect)){
            this.changeDeathType(1);
        }
    };
    this.deathChangeAfter=function(centerObj){
        if(this.deathType==1){
            if(this.hurtTime>0){
                this.hurtTime-=centerObj.animate.time;
            }
            if(this.deathTime<=0){
                centerObj.maxBox.remove(this);
                centerObj.bulletArr.splice( centerObj.bulletArr.indexOf(this),1);
            }else{
                this.deathTime-=centerObj.animate.time;
            }
        }
    };
    this.changeDeathType(0);
    extend(this,defaultObj);
};
/*金币类型*/
HGAME.gold=function(Obj){
    HGAME.Object2D.call(this,Obj);
    this._struct='gold';
    var defaultObj = {
        targetRect:null,
        addNum:1,
        img:null,
        imgAmtInfo:[],
        fx:0.3,
        lastDraw:true,
        addt:0.01,
        changeAttr:'num'
    };
    this.imgInfo=0;
    this.changeImgInfo=function(){
        this.H_INT=this.imgAmtInfo[this.imgInfo].h;
        this.W_INT=this.imgAmtInfo[this.imgInfo].w;
        if(this.imgInfo>=this.imgAmtInfo.length-1){
            this.imgInfo=0;
        }else{
            this.imgInfo++;
        }
    };
    this.changeXYInfo=function(centerObj){
        var x=METHOD.bezierCurve({
            t:this.t,
            P0:this.bufX,
            P1:this.cPoint.x,
            P2:this.targetRect.x
        });
        var y =METHOD.bezierCurve({
            t:this.t,
            P0:this.bufY,
            P1:this.cPoint.y,
            P2:this.targetRect.y
        });
        this.x=x;
        this.y=y;
        if(this.scale>=0.5){
            this.scale-=0.005;
        }
        if(this.t<=1){
            this.t+=this.addt;
        }else{

            centerObj.goldArr.splice(centerObj.goldArr.indexOf(this),1);
            centerObj.maxBox.remove(this);
            centerObj[this.changeAttr]=parseInt(centerObj[this.changeAttr])+parseInt(this.addNum);
        }
    };
    extend(defaultObj,Obj);
    extend(this,defaultObj);
    this.cPoint = {x:0,y:0};
    var addInfo=90;
    if(this.fx>=0.5){
        addInfo=90
    }else {
        addInfo=-90
    }
    var ang=METHOD.pointAngleInfo(this.targetRect,this);
    var ang02=(ang+addInfo)%360;
    if(ang02<0){
        ang02=ang02+360;
    }
    this.cPoint=METHOD.polarCoordinates({
        x:(Math.max(this.targetRect.x,this.x)-Math.min(this.targetRect.x,this.x))/2+Math.min(this.targetRect.x,this.x),
        y:(Math.max(this.targetRect.y,this.y)-Math.min(this.targetRect.y,this.y))/2+Math.min(this.targetRect.y,this.y)
    },ang02,100);
    var jl=(this.targetRect.x-this.x)*(this.targetRect.x-this.x)+(this.targetRect.y-this.y)*(this.targetRect.y-this.y);
    jl=Math.sqrt(jl);
    this.bufX=this.x;
    this.bufY=this.y;
    this.t=0;
    this.addt=1/(jl/20);
};
/*对话框类*/
HGAME.model=function(Obj){
    HGAME.canvas.call(this);
    extend(this,Obj);
    var THIS = this;
    this.title=new HGAME.canvas();
    this.content=new HGAME.canvas();
    this.btn=new HGAME.canvas();
    this.btn2=new HGAME.canvas();
    this.buffer="normal normal {size}/{line} arial";
    this.initContent=function(Obj){
        Obj=Obj||{};
        var defaultObj={
            txt:["test title"],//title显示文字
            fontSize:"16",//title的字体大小
            lineHeight:"20",//title的行高
            color:"#999999",//title的文字颜色
            bgColor:"#ffffff",//title 背景颜色
            verticalAlign:"middle",
            textAlign:"center" //center 剧中 left剧左 right 剧右
        };
        var txt = this.content.txt;
        var h =Obj.h?Obj.h:150;
        var w = Obj.w?Obj.w:this.w;
        extend(defaultObj,Obj);
        this.content.w=w;
        this.content.h=h;
        txt.clearRect(0,0,w,h);
        txt.beginPath();
        /*绘制背景*/
        txt.fillStyle=defaultObj.bgColor;
        txt.fillRect(0,0,w,h);
        /*绘制文字*/
        var startY = (h - defaultObj.txt.length*defaultObj.lineHeight)/2;
        for(var i = 0;i<defaultObj.txt.length;i++){
            var text = defaultObj.txt[i];
            txt.fillStyle=defaultObj.color;
            txt.font=this.buffer.replace("{size}",defaultObj.fontSize+"px").replace("{line}",defaultObj.lineHeight+"px");
            txt.textBaseline="top";
            var x=0;
            var y = defaultObj.lineHeight*i +startY;
            if(defaultObj.textAlign=="left"){
                txt.textAlign="left";
                x=0;
            }else if(defaultObj.textAlign=="center"){
                txt.textAlign="center";
                x=w/2;
            }else if(defaultObj.textAlign=="right"){
                txt.textAlign="right";
                x=w;
            }
            txt.fillText(text,x,y);
        }
        txt.closePath();
    };
    this.initComment=function(Obj,cvsObj){
        Obj=Obj||{};
        var defaultObj = {
            txt:"test title",//title显示文字
            fontSize:"16",//title的字体大小
            lineHeight:"20",//title的行高
            color:"#cccccc",//title的文字颜色
            bgColor:"#ffffff",//title 背景颜色
            textAlign:"center" //center 剧中 left剧左 right 剧右
        };
        /*txt文字 font*/
        var txt = cvsObj.txt;
        var h =Obj.h?Obj.h:45;
        var w = Obj.w?Obj.w:this.w;
        extend(defaultObj,Obj);
        cvsObj.w=w;
        cvsObj.h=h;
        txt.clearRect(0,0,w,h);
        txt.beginPath();
        /*绘制背景*/
        txt.fillStyle=defaultObj.bgColor;
        txt.fillRect(0,0,w,h);
        /*绘制文字*/
        txt.fillStyle=defaultObj.color;
        txt.font=this.buffer.replace("{size}",defaultObj.fontSize+"px").replace("{line}",defaultObj.lineHeight+"px");
        txt.textBaseline="middle";
        var x=0;
        var y = h/2;
        if(defaultObj.textAlign=="left"){
            txt.textAlign="left";
            x=0;
        }else if(defaultObj.textAlign=="center"){
            txt.textAlign="center";
            x=w/2;
        }else if(defaultObj.textAlign=="right"){
            txt.textAlign="right";
            x=w;
        }
        txt.fillText(defaultObj.txt,x,y);
        txt.closePath();
    };

    this.showView=false;
    this.show = function(maxBox,info){

        info=info||{w:400,addY:10};
        this.close();
        this.w = info.w;

        this.initComment(info.title,this.title);
        this.initContent(info.content);
        this.initComment(info.btn2,this.btn2);
        this.initComment(info.btn,this.btn);
        if(maxBox){
            this.x=(maxBox.w-info.w)/2;
            this.y=-this.h;

        }
        var  h = 0;
        h = this.title.h+this.content.h+this.btn.h;
        this.h=h;
        this.title.x=0;
        this.title.y=0;
        this.add(this.title);
        this.content.x=0;
        this.content.y = this.title.h;
        this.add(this.content);
        this.btn.x=0;
        this.btn.y=this.content.h+this.title.h;
        this.add(this.btn);
        if(info.btn2){
            this.btn2.x=this.btn.w;
            this.btn2.y=this.btn.y;
            this.add(this.btn2);
        }
        if(maxBox){
            this.box = maxBox;
            maxBox.add(this);
            this.showView=true;
            this.animate.stop();
            this.animate.action=function(){
                if(THIS.y<maxBox.h/2-THIS.h/2){
                    THIS.y+=info.addY;
                }else{
                    THIS.y=maxBox.h/2-THIS.h/2;
                    this.stop();
                    THIS.showEnd&&THIS.showEnd.call(THIS,THIS);
                }
            }
            this.animate.run();
        }

    }
    this.animate=new HGAME.animate();
    this.close=function(){
        if(this.box){

            this.box.remove(this);
            this.showView=false;
        }
    }

}


var getArrObj = new Object();
getArrObj.getFishInfo=function(){
    return [

        {
            name:"changeAngle"
        },
        {
            name:"moveForward"
        },
        {
            centerObj:true,
            name:"isScreenOut"
        },
        {
            centerObj:true,
            name:"deathAfter"
        }
    ]
};
getArrObj.getFishInfo02=function(){
    return [
        {
            name:"changeImgInfo"
        }
    ]
};
/*0图片信息 1创建鱼的信息 2场景信息 3鱼群的类型*/
var cjData = [
    [
        [
            "img/fish/fish1.png",
            "img/fish/fish2.png",
            "img/fish/fish3.png",
            "img/fish/fish4.png",
            "img/fish/fish5.png",
            "img/fish/fish6.png",
            "img/fish/fish7.png",
            "img/fish/fish8.png",
            "img/fish/fish9.png",
            "img/fish/fish10.png",
            "img/fish/shark1.png"
        ],
        [
        ],
        "img/Interface/e.jpg",
        []
    ],
    [
        [
            "img/fish/fish1.png",
            "img/fish/fish2.png",
            "img/fish/fish3.png",
            "img/fish/fish4.png",
            "img/fish/fish5.png",
            "img/fish/fish6.png",
            "img/fish/fish7.png",
            "img/fish/fish8.png",
            "img/fish/fish9.png",
            "img/fish/fish10.png",
            "img/fish/shark1.png"
        ],
        [


        ],
        "img/Interface/game_bg_2_hd.jpg",
        []
    ],
    [
        [
            "img/fish/fish1.png",
            "img/fish/fish2.png",
            "img/fish/fish3.png",
            "img/fish/fish4.png",
            "img/fish/fish5.png",
            "img/fish/fish6.png",
            "img/fish/fish7.png",
            "img/fish/fish8.png",
            "img/fish/fish9.png",
            "img/fish/fish10.png",
            "img/fish/shark1.png"
        ],
        [


        ],
        "img/Interface/bg1.jpg",
        []
    ],
    [
        [
            "img/fish/fish1.png",
            "img/fish/fish2.png",
            "img/fish/fish3.png",
            "img/fish/fish4.png",
            "img/fish/fish5.png",
            "img/fish/fish6.png",
            "img/fish/fish7.png",
            "img/fish/fish8.png",
            "img/fish/fish9.png",
            "img/fish/fish10.png",
            "img/fish/shark1.png"
        ],
        [


        ],
        "img/Interface/startbg.jpg",
        []
    ],
    [
        [
            "img/fish/fish1.png",
            "img/fish/fish2.png",
            "img/fish/fish3.png",
            "img/fish/fish4.png",
            "img/fish/fish5.png",
            "img/fish/fish6.png",
            "img/fish/fish7.png",
            "img/fish/fish8.png",
            "img/fish/fish9.png",
            "img/fish/fish10.png",
            "img/fish/shark1.png",
            "img/fish/shark2.png"
        ],
        [


        ],
        "img/Interface/b.jpg",
        []
    ],
    [
        [
            "img/fish/fish1.png",
            "img/fish/fish2.png",
            "img/fish/fish3.png",
            "img/fish/fish4.png",
            "img/fish/fish5.png",
            "img/fish/fish6.png",
            "img/fish/fish7.png",
            "img/fish/fish8.png",
            "img/fish/fish9.png",
            "img/fish/fish10.png",
            "img/fish/shark1.png",
            "img/fish/shark2.png",
            "img/fish/fish12.png"
        ],
        [


        ],
        "img/Interface/c.jpg",
        []
    ],
    [
        [
            "img/fish/fish1.png",
            "img/fish/fish2.png",
            "img/fish/fish3.png",
            "img/fish/fish4.png",
            "img/fish/fish5.png",
            "img/fish/fish6.png",
            "img/fish/fish7.png",
            "img/fish/fish8.png",
            "img/fish/fish9.png",
            "img/fish/fish10.png",
            "img/fish/fish11.png",
            "img/fish/fish12.png",
            "img/fish/shark1.png",
            "img/fish/shark2.png",
            "img/fish/fish12.png"
        ],
        [


        ],
        "img/Interface/d.jpg",
        []
    ]
];
(function(){
    /*创建1x8的鱼*/
    function addFish1(arr,Obj){
        var defaultObj={
            addNum:1,
            imgUrl:"img/fish/fish1.png",
            maxNum:10,//创建鱼的最大数量
            w:55,
            h:37,
            createTimeBuf:1500,
            addTime:0,
            PH:1,
            moveSpeed:5,
            deathNum:0.4,
            createTime:-10,
            imgInfoAg:"1x8",
            imgInfoAg02:"0"
        };
        extend(defaultObj,Obj);
        arr.push({
            imgUrl:defaultObj.imgUrl,
            w:defaultObj.w,
            h:defaultObj.h,
            moveSpeed:defaultObj.moveSpeed,
            imgInfoAg:defaultObj.imgInfoAg,
            imgInfoAg02:defaultObj.imgInfoAg02,
            addNum:defaultObj.addNum,
            maxNum:defaultObj.maxNum,//创建鱼的最大数量
            defaultAngle:-1,//默认的面向角度
            fishType:"ySmall",
            fishXInfo:[-50,1024],
            fishYInfo:[-defaultObj.w-37,-defaultObj.w],
            minAngleInfo:[0,45],
            maxAngleInfo:[135,180],
            PH:defaultObj.PH,
            deathNum:defaultObj.deathNum,
            createTime:defaultObj.createTime,
            createTimeBuf:defaultObj.createTimeBuf+defaultObj.addTime,
            method:getArrObj.getFishInfo(),
            method02:getArrObj.getFishInfo02()
        });
        arr.push({
            imgUrl:defaultObj.imgUrl,
            w:defaultObj.w,
            h:defaultObj.h,
            moveSpeed:defaultObj.moveSpeed,
            PH:defaultObj.PH,
            deathNum:defaultObj.deathNum,

            addNum:defaultObj.addNum,
            imgInfoAg:defaultObj.imgInfoAg,
            imgInfoAg02:defaultObj.imgInfoAg02,
            maxNum:defaultObj.maxNum,//创建鱼的最大数量
            defaultAngle:-1,//默认的面向角度
            fishType:"ySmall",
            fishXInfo:[-50,1024],
            fishYInfo:[768+defaultObj.w,768+defaultObj.w+50],
            minAngleInfo:[180,225],
            maxAngleInfo:[315,360],
            createTime:defaultObj.createTime,
            createTimeBuf:defaultObj.createTimeBuf+defaultObj.addTime*2,
            method:getArrObj.getFishInfo(),
            method02:getArrObj.getFishInfo02()
        });
        arr.push({
            imgUrl:defaultObj.imgUrl,
            w:defaultObj.w,
            h:defaultObj.h,
            imgInfoAg:defaultObj.imgInfoAg,
            imgInfoAg02:defaultObj.imgInfoAg02,
            moveSpeed:defaultObj.moveSpeed,
            addNum:defaultObj.addNum,
            maxNum:parseInt(defaultObj.maxNum/2),//创建鱼的最大数量
            defaultAngle:-1,//默认的面向角度
            fishType:"ySmall",
            fishXInfo:[-defaultObj.w-30,-defaultObj.w],
            fishYInfo:[-50,800],
            minAngleInfo:[270,300],
            maxAngleInfo:[330,360],
            PH:defaultObj.PH,
            deathNum:defaultObj.deathNum,
            createTime:defaultObj.createTime,
            createTimeBuf:defaultObj.createTimeBuf+defaultObj.addTime*3,
            method:getArrObj.getFishInfo(),
            method02:getArrObj.getFishInfo02()
        });
        arr.push( {
            imgUrl:defaultObj.imgUrl,
            w:defaultObj.w,
            moveSpeed:defaultObj.moveSpeed,
            h:defaultObj.h,
            imgInfoAg:defaultObj.imgInfoAg,
            imgInfoAg02:defaultObj.imgInfoAg02,
            addNum:defaultObj.addNum,
            maxNum:parseInt(defaultObj.maxNum/2),//创建鱼的最大数量
            defaultAngle:-1,//默认的面向角度
            fishType:"ySmall",
            fishXInfo:[-defaultObj.w-34,-defaultObj.w],
            fishYInfo:[-50,800],
            minAngleInfo:[0,30],
            maxAngleInfo:[75,90],
            PH:defaultObj.PH,
            deathNum:defaultObj.deathNum,
            createTime:defaultObj.createTime,
            createTimeBuf:defaultObj.createTimeBuf+defaultObj.addTime*4,
            method:getArrObj.getFishInfo(),
            method02:getArrObj.getFishInfo02()
        });
        arr.push({
            imgUrl:defaultObj.imgUrl,
            w:defaultObj.w,
            h:defaultObj.h,
            imgInfoAg:defaultObj.imgInfoAg,
            imgInfoAg02:defaultObj.imgInfoAg02,
            deathNum:defaultObj.deathNum,
            addNum:defaultObj.addNum,
            moveSpeed:defaultObj.moveSpeed,
            maxNum:defaultObj.maxNum,//创建鱼的最大数量
            defaultAngle:-1,//默认的面向角度
            fishType:"ySmall",
            fishXInfo:[1024+defaultObj.w,1024+defaultObj.w+30],
            fishYInfo:[-50,800],
            minAngleInfo:[90,135],
            maxAngleInfo:[225,270],
            PH:defaultObj.PH,
            createTime:defaultObj.createTime,
            createTimeBuf:defaultObj.createTimeBuf+defaultObj.addTime*5,
            method:getArrObj.getFishInfo(),
            method02:getArrObj.getFishInfo02()
        });
    }
    /*创建鱼2*/
    function addFish2(arr){
        arr.push({
            imgUrl:"img/fish/fish2.png",
            w:78,
            h:64,
            imgInfoAg:"1x8",
            imgInfoAg02:"0",
            addNum:15,
            maxNum:10,//创建鱼的最大数量
            defaultAngle:-1,//默认的面向角度
            fishType:"ySmall",
            fishXInfo:[-100,1024],
            fishYInfo:[-100,-64],
            minAngleInfo:[0,90],
            maxAngleInfo:[90,180],
            createTime:-10,
            deathNum:0.35,
            createTimeBuf:1500,
            method:getArrObj.getFishInfo(),
            method02:getArrObj.getFishInfo02()
        });
        arr.push({
            imgUrl:"img/fish/fish2.png",
            w:78,
            h:64,
            imgInfoAg:"1x8",
            imgInfoAg02:"0",
            addNum:15,
            maxNum:10,//创建鱼的最大数量
            defaultAngle:-1,//默认的面向角度
            fishType:"ySmall",
            fishXInfo:[-100,1024],
            fishYInfo:[750,800],
            minAngleInfo:[180,270],
            maxAngleInfo:[270,360],
            createTime:-10,
            deathNum:0.35,
            createTimeBuf:1500,
            method:getArrObj.getFishInfo(),
            method02:getArrObj.getFishInfo02()
        });
    }

    for(var i =0;i<cjData.length;i++){
        addFish1(cjData[i][1]);
        addFish1(cjData[i][1],{
            addNum:10,
            imgUrl:"img/fish/fish3.png",
            maxNum:5,//创建鱼的最大数量
            w:72,
            h:56,
            createTimeBuf:4000,
            PH:1,
            addTime:200,
            deathNum:0.3,
            createTime:3000
        });
        addFish1(cjData[i][1],{
            addNum:20,
            imgUrl:"img/fish/fish4.png",
            maxNum:5,//创建鱼的最大数量
            w:77,
            h:59,
            addTime:200,
            moveSpeed:4.5,
            createTimeBuf:6000,
            PH:1,
            deathNum:0.25,
            createTime:3000
        });
        addFish1(cjData[i][1],{
            addNum:16,
            imgUrl:"img/fish/fish5.png",
            maxNum:5,//创建鱼的最大数量
            w:107,
            h:122,
            addTime:1000,
            moveSpeed:4,
            createTimeBuf:6000,
            PH:1,
            deathNum:0.33,
            createTime:1000
        });
        addFish1(cjData[i][1],{
            addNum:30,
            imgUrl:"img/fish/fish6.png",
            maxNum:5,//创建鱼的最大数量
            w:105,
            h:79,
            imgInfoAg:"1x12",
            imgInfoAg02:"2",
            addTime:1000,
            moveSpeed:4,
            createTimeBuf:6000,
            PH:2,
            deathNum:0.20,
            createTime:1000
        });
        addFish1(cjData[i][1],{
            addNum:40,
            imgUrl:"img/fish/fish7.png",
            maxNum:5,//创建鱼的最大数量
            w:92,
            h:151,
            imgInfoAg:"1x10",
            imgInfoAg02:"3",
            addTime:3000,
            moveSpeed:4,
            createTimeBuf:12000,
            PH:4,
            deathNum:0.15,
            createTime:3000
        });
        addFish1(cjData[i][1],{
            addNum:50,
            imgUrl:"img/fish/fish8.png",
            maxNum:5,//创建鱼的最大数量
            w:174,
            h:126,
            imgInfoAg:"1x12",
            imgInfoAg02:"2",
            addTime:3000,
            moveSpeed:3,
            createTimeBuf:24000,
            PH:5,
            deathNum:0.10,
            createTime:6000
        });
        if(i>=1){
            addFish1(cjData[i][1],{
                addNum:60,
                imgUrl:"img/fish/fish9.png",
                maxNum:1,//创建鱼的最大数量
                w:166,
                h:183,
                imgInfoAg:"1x12",
                imgInfoAg02:"2",
                addTime:3000,
                moveSpeed:3,
                createTimeBuf:24000,
                PH:6,
                deathNum:0.05,
                createTime:8000
            });
        }
        if(i>=2){
            addFish1(cjData[i][1],{
                addNum:80,
                imgUrl:"img/fish/fish10.png",
                maxNum:1,//创建鱼的最大数量
                w:178,
                h:187,
                imgInfoAg:"1x10",
                imgInfoAg02:"3",
                addTime:3000,
                moveSpeed:3,
                createTimeBuf:24000,
                PH:8,
                deathNum:0.04,
                createTime:8000
            });
        }
        if(i>=3){
            addFish1(cjData[i][1],{
                addNum:100,
                w:509,
                h:270,
                moveSpeed:5,
                PH:8,
                deathNum:0.02,
                imgUrl:"img/fish/shark1.png",
                maxNum:1,//创建鱼的最大数量
                imgInfoAg:"1x12",
                imgInfoAg02:"2",
                addTime:3000,
                createTimeBuf:24000,
                createTime:8000
            });
        }
        if(i>=4){
            addFish1(cjData[i][1],{
                addNum:120,
                w:516,
                h:273,
                moveSpeed:3,
                PH:10,
                deathNum:0.02,
                imgUrl:"img/fish/shark2.png",
                maxNum:1,//创建鱼的最大数量
                imgInfoAg:"1x12",
                imgInfoAg02:"2",
                addTime:3000,
                createTimeBuf:36000,
                createTime:18000
            });
        }
        if(i>=5){
            addFish1(cjData[i][1],{
                addNum:140,
                w:215,
                h:211,
                moveSpeed:3,
                PH:12,
                deathNum:0.015,
                imgUrl:"img/fish/fish12.png",
                maxNum:1,//创建鱼的最大数量
                imgInfoAg:"1x15",
                imgInfoAg02:"4",
                addTime:3000,
                createTimeBuf:36000,
                createTime:18000
            });
        }
        if(i>=6){
            addFish1(cjData[i][1],{
                addNum:160,
                w:274,
                h:100,
                moveSpeed:3,
                PH:12,
                deathNum:0.01,
                imgUrl:"img/fish/fish11.png",
                maxNum:1,//创建鱼的最大数量
                imgInfoAg:"1x33",
                imgInfoAg02:"5",
                addTime:3000,
                createTimeBuf:36000,
                createTime:18000
            });
        }
        addFish2(cjData[i][1]);
        addRect3(cjData[i][1],cjData[i][3]);
      //  addRect2(cjData[i][1],cjData[i][3]);
      //  addRect1(cjData[i][1],cjData[i][3]);
    }

    /*增加矩形鱼群1*/
    //num 当前矩形
    //time 持续时间
    function addRect1(arr,arr2){
        arr2.push({
            num:"1",
            time:45
        });
        for(var i =0;i<5;i++){
            arr.push({
                imgUrl:"img/fish/fish1.png",
                w:55,
                h:37,
                imgInfoAg:"1x8",
                imgInfoAg02:"0",
                addNum:1,
                maxNum:100,//创建鱼的最大数量
                defaultAngle:-1,//默认的面向角度
                fishType:"rect1",
                fishXInfo:-55,
                fishYInfo:208.5+37*i+20*i,
                minAngleInfo:0,
                maxAngleInfo:0,
                createTime:0,
                deathNum:0.4,
                createAllTime:5000,
                createAllTimeBuf:5000,
                createTimeBuf:300,
                method:getArrObj.getFishInfo(),
                method02:getArrObj.getFishInfo02(),
                createFishEnd:function(fish){
                    fish.isChangeAngle=false;
                }
            });
            arr.push({
                imgUrl:"img/fish/fish3.png",
                w:72,
                h:56,
                imgInfoAg:"1x8",
                imgInfoAg02:"0",
                addNum:10,
                maxNum:100,//创建鱼的最大数量
                defaultAngle:-1,//默认的面向角度
                fishType:"rect1",
                fishXInfo:-72,
                fishYInfo:181+56*i+10*i,
                minAngleInfo:0,
                maxAngleInfo:0,
                createTime:100,
                deathNum:0.35,
                createTimeBufBuf:5000,
                createAllTime:10000,
                createAllTimeBuf:10000,
                createTimeBuf:400,
                method:getArrObj.getFishInfo(),
                method02:getArrObj.getFishInfo02(),
                createFishEnd:function(fish){
                    fish.isChangeAngle=false;
                    fish.method.push({
                        name:"changeAngeleForMoveA"
                    });
                }
            });
            if(i<4){
                arr.push({
                    imgUrl:"img/fish/fish5.png",
                    addNum:16,
                    w:107,
                    h:122,
                    PH:1,
                    deathNum:0.33,
                    imgInfoAg:"1x8",
                    imgInfoAg02:"0",
                    maxNum:100,//创建鱼的最大数量
                    defaultAngle:-1,//默认的面向角度
                    fishType:"rect1",
                    fishXInfo:-72,
                    fishYInfo:92+122*i+10*i,
                    minAngleInfo:0,
                    maxAngleInfo:0,
                    createTime:100,
                    createTimeBufBuf:10500,
                    createAllTime:15000,
                    createAllTimeBuf:15000,
                    createTimeBuf:400,
                    method:getArrObj.getFishInfo(),
                    method02:getArrObj.getFishInfo02(),
                    createFishEnd:function(fish){
                        fish.isChangeAngle=false;
                        fish.method.push({
                            name:"changeAngeleForMoveA"
                        });
                    }
                });
            }
            if(i<3){
                arr.push({
                    addNum:60,
                    w:166,
                    h:183,
                    moveSpeed:5,
                    PH:6,
                    deathNum:0.05,
                    imgUrl:"img/fish/fish9.png",
                    imgInfoAg:"1x12",
                    imgInfoAg02:"2",
                    maxNum:100,//创建鱼的最大数量
                    defaultAngle:-1,//默认的面向角度
                    fishType:"rect1",
                    fishXInfo:-166,
                    fishYInfo:56.5+183*i+10*i,
                    minAngleInfo:0,
                    maxAngleInfo:0,
                    createTime:100,
                    createTimeBufBuf:15500,
                    createAllTime:35000,
                    createAllTimeBuf: 35000,
                    createTimeBuf:1500,
                    method:getArrObj.getFishInfo(),
                    method02:getArrObj.getFishInfo02(),
                    createFishEnd:function(fish){
                        fish.isChangeAngle=false;
                    }
                });
            }
            if(i<2){
                arr.push({
                    addNum:100,
                    w:509,
                    h:270,
                    moveSpeed:5,
                    PH:8,
                    deathNum:0.02,
                    imgUrl:"img/fish/shark1.png",
                    imgInfoAg:"1x12",
                    imgInfoAg02:"2",
                    maxNum:100,//创建鱼的最大数量
                    defaultAngle:-1,//默认的面向角度
                    fishType:"rect1",
                    fishXInfo:-509,
                    fishYInfo:66+270*i+10*i,
                    minAngleInfo:0,
                    maxAngleInfo:0,
                    createTime:100,
                    createTimeBufBuf:35500,
                    createAllTime:45000,
                    createAllTimeBuf: 45000,
                    createTimeBuf:2500,
                    method:getArrObj.getFishInfo(),
                    method02:getArrObj.getFishInfo02(),
                    createFishEnd:function(fish){
                        fish.isChangeAngle=false;
                    }
                });
            }

        }
    }
    function addRect2(arr,arr2){
        arr2.push({
            num:"2",
            time:45
        });
        for(var i =0;i<5;i++){
            arr.push({
                imgUrl:"img/fish/fish1.png",
                w:55,
                h:37,
                imgInfoAg:"1x8",
                imgInfoAg02:"0",
                addNum:1,
                maxNum:100,//创建鱼的最大数量
                defaultAngle:-1,//默认的面向角度
                fishType:"rect2",
                fishXInfo:-55,
                fishYInfo:-37+(+37*i+20*i),
                minAngleInfo:45,
                maxAngleInfo:45,
                createTime:0,
                deathNum:0.4,
                createAllTime:5000,
                createAllTimeBuf:5000,
                createTimeBuf:300,
                method:getArrObj.getFishInfo(),
                method02:getArrObj.getFishInfo02(),
                createFishEnd:function(fish){
                    fish.isChangeAngle=false;
                    fish.method.push({
                        name:"changeAngeleForMoveB"
                    });
                }
            });
            arr.push({
                imgUrl:"img/fish/fish3.png",
                w:72,
                h:56,
                imgInfoAg:"1x8",
                imgInfoAg02:"0",
                addNum:10,
                maxNum:100,//创建鱼的最大数量
                defaultAngle:-1,//默认的面向角度
                fishType:"rect2",
                fishXInfo:-72,
                fishYInfo:-56+(56*i+10*i),
                minAngleInfo:45,
                maxAngleInfo:45,
                createTime:100,
                deathNum:0.35,
                createTimeBufBuf:5000,
                createAllTime:10000,
                createAllTimeBuf:10000,
                createTimeBuf:400,
                method:getArrObj.getFishInfo(),
                method02:getArrObj.getFishInfo02(),
                createFishEnd:function(fish){
                    fish.isChangeAngle=false;
                    fish.method.push({
                        name:"changeAngeleForMoveB"
                    });
                }
            });
            if(i<4){
                arr.push({
                    imgUrl:"img/fish/fish5.png",
                    addNum:16,
                    w:107,
                    h:122,
                    PH:1,
                    deathNum:0.33,
                    imgInfoAg:"1x8",
                    imgInfoAg02:"0",
                    maxNum:100,//创建鱼的最大数量
                    defaultAngle:-1,//默认的面向角度
                    fishType:"rect2",
                    fishXInfo:-107,
                    fishYInfo:-122+(122*i+10*i),
                    minAngleInfo:45,
                    maxAngleInfo:45,
                    createTime:100,
                    createTimeBufBuf:10500,
                    createAllTime:15000,
                    createAllTimeBuf:15000,
                    createTimeBuf:400,
                    method:getArrObj.getFishInfo(),
                    method02:getArrObj.getFishInfo02(),
                    createFishEnd:function(fish){
                        fish.isChangeAngle=false;
                        fish.method.push({
                            name:"changeAngeleForMoveB"
                        });
                    }
                });
            }
            if(i<3){
                arr.push({
                    addNum:60,
                    w:166,
                    h:183,
                    moveSpeed:5,
                    PH:6,
                    deathNum:0.05,
                    imgUrl:"img/fish/fish9.png",
                    imgInfoAg:"1x12",
                    imgInfoAg02:"2",
                    maxNum:100,//创建鱼的最大数量
                    defaultAngle:-1,//默认的面向角度
                    fishType:"rect2",
                    fishXInfo:-166,
                    fishYInfo:-183+(183*i+10*i),
                    minAngleInfo:45,
                    maxAngleInfo:45,
                    createTime:100,
                    createTimeBufBuf:15500,
                    createAllTime:35000,
                    createAllTimeBuf: 35000,
                    createTimeBuf:1500,
                    method:getArrObj.getFishInfo(),
                    method02:getArrObj.getFishInfo02(),
                    createFishEnd:function(fish){
                        fish.isChangeAngle=false;
                        fish.method.push({
                            name:"changeAngeleForMoveB"
                        });
                    }
                });
            }
            if(i<2){
                arr.push({
                    addNum:100,
                    w:509,
                    h:270,
                    moveSpeed:5,
                    PH:8,
                    deathNum:0.02,
                    imgUrl:"img/fish/shark1.png",
                    imgInfoAg:"1x12",
                    imgInfoAg02:"2",
                    maxNum:100,//创建鱼的最大数量
                    defaultAngle:-1,//默认的面向角度
                    fishType:"rect2",
                    fishXInfo:-509,
                    fishYInfo:-270-(270*i+10*i),
                    minAngleInfo:45,
                    maxAngleInfo:45,
                    createTime:100,
                    createTimeBufBuf:35500,
                    createAllTime:45000,
                    createAllTimeBuf: 45000,
                    createTimeBuf:2500,
                    method:getArrObj.getFishInfo(),
                    method02:getArrObj.getFishInfo02(),
                    createFishEnd:function(fish){
                        fish.isChangeAngle=false;
                        fish.method.push({
                            name:"changeAngeleForMoveB"
                        });
                    }
                });
            }

        }
    }
    function addRect3(arr,arr2){
        arr2.push({
            num:"3",
            time:45
        });
        for(var i =0;i<5;i++){
            arr.push({
                imgUrl:"img/fish/fish1.png",
                w:55,
                h:37,
                imgInfoAg:"1x8",
                imgInfoAg02:"0",
                addNum:1,
                maxNum:100,//创建鱼的最大数量
                defaultAngle:-1,//默认的面向角度
                fishType:"rect3",
                fishXInfo:-55,
                fishYInfo:37*i+20*i,
                minAngleInfo:0,
                maxAngleInfo:0,
                createTime:0,
                deathNum:0.4,
                createAllTime:5000,
                createAllTimeBuf:5000,
                createTimeBuf:300,
                method:getArrObj.getFishInfo(),
                method02:getArrObj.getFishInfo02(),
                createFishEnd:function(fish){
                    fish.isChangeAngle=false;
                    fish.method.push({
                        name:"changeAngeleForMoveC"
                    });
                }
            });
            arr.push({
                imgUrl:"img/fish/fish3.png",
                w:72,
                h:56,
                imgInfoAg:"1x8",
                imgInfoAg02:"0",
                addNum:10,
                maxNum:100,//创建鱼的最大数量
                defaultAngle:-1,//默认的面向角度
                fishType:"rect3",
                fishXInfo:-72,
                fishYInfo:56*i+10*i,
                minAngleInfo:0,
                maxAngleInfo:0,
                createTime:100,
                deathNum:0.35,
                createTimeBufBuf:5000,
                createAllTime:10000,
                createAllTimeBuf:10000,
                createTimeBuf:400,
                method:getArrObj.getFishInfo(),
                method02:getArrObj.getFishInfo02(),
                createFishEnd:function(fish){
                    fish.isChangeAngle=false;
                    fish.method.push({
                        name:"changeAngeleForMoveC"
                    });
                }
            });
            if(i<4){
                arr.push({
                    imgUrl:"img/fish/fish5.png",
                    addNum:16,
                    w:107,
                    h:122,
                    PH:1,
                    deathNum:0.33,
                    imgInfoAg:"1x8",
                    imgInfoAg02:"0",
                    maxNum:100,//创建鱼的最大数量
                    defaultAngle:-1,//默认的面向角度
                    fishType:"rect3",
                    fishXInfo:-107,
                    fishYInfo:122*i+10*i,
                    minAngleInfo:0,
                    maxAngleInfo:0,
                    createTime:100,
                    createTimeBufBuf:10500,
                    createAllTime:15000,
                    createAllTimeBuf:15000,
                    createTimeBuf:400,
                    method:getArrObj.getFishInfo(),
                    method02:getArrObj.getFishInfo02(),
                    createFishEnd:function(fish){
                        fish.isChangeAngle=false;
                        fish.method.push({
                            name:"changeAngeleForMoveC"
                        });
                    }
                });
            }
            if(i<3){
                arr.push({
                    addNum:60,
                    w:166,
                    h:183,
                    moveSpeed:5,
                    PH:6,
                    deathNum:0.05,
                    imgUrl:"img/fish/fish9.png",
                    imgInfoAg:"1x12",
                    imgInfoAg02:"2",
                    maxNum:100,//创建鱼的最大数量
                    defaultAngle:-1,//默认的面向角度
                    fishType:"rect3",
                    fishXInfo:-166,
                    fishYInfo:183*i+10*i,
                    minAngleInfo:0,
                    maxAngleInfo:0,
                    createTime:100,
                    createTimeBufBuf:35500,
                    createAllTime:45000,
                    createAllTimeBuf: 45000,
                    createTimeBuf:1200,
                    method:getArrObj.getFishInfo(),
                    method02:getArrObj.getFishInfo02(),
                    createFishEnd:function(fish){
                        fish.isChangeAngle=false;
                        fish.method.push({
                            name:"changeAngeleForMoveC"
                        });
                    }
                });
                arr.push({
                    addNum:50,
                    w:174,
                    h:126,
                    imgInfoAg:"1x12",
                    imgInfoAg02:"2",
                    moveSpeed:5,
                    PH:5,
                    deathNum:0.10,
                    imgUrl:"img/fish/fish8.png",
                    maxNum:100,//创建鱼的最大数量
                    defaultAngle:-1,//默认的面向角度
                    fishType:"rect3",
                    fishXInfo:-166,
                    fishYInfo:183*i+10*i,
                    minAngleInfo:0,
                    maxAngleInfo:0,
                    createTime:100,
                    createTimeBufBuf:15500,
                    createAllTime:35000,
                    createAllTimeBuf: 35000,
                    createTimeBuf:1300,
                    method:getArrObj.getFishInfo(),
                    method02:getArrObj.getFishInfo02(),
                    createFishEnd:function(fish){
                        fish.isChangeAngle=false;
                        fish.method.push({
                            name:"changeAngeleForMoveC"
                        });
                    }
                });
            }
        }
    }
})();