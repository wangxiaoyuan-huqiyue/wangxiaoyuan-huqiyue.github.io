verifyLogin()
// 消息框类型
const typeMap = {
    success:"success",
    info:"info",
    warning:"warning",
    error:"error"
};
function isFunction(value){
    return typeof value === 'function';
}
function isDom(el) {
    return typeof HTMLElement === 'object' ? el instanceof HTMLElement : el && typeof el === 'object' && el.nodeType === 1 && typeof el.nodeName === 'string' || el instanceof HTMLCollection || el instanceof NodeList;
}
function addMessageStyle() {
    var cssText = `
    .ew-message {
        min-width: 300px;
        border: 1px solid #ebeef5;
        position: fixed;
        left: 50%;
        background-color: #edf2fc;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        padding: 10px 15px;
        overflow: hidden;
        transition: transform .4s;
        border-radius: 4px;
        top: 25px;
        z-index: 10001;
    }
    
    .ew-message .ew-message-close {
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
        cursor: pointer;
        color: #C0C4CC;
        font-size: 16px;
    }
    .ew-message>.ew-message-close:hover,
    .ew-message>.ew-message-close:active {
        color: #909399;
    }
    .ew-message-info p {
        color: #909399;
        line-height: 1;
        font-size: 14px;
    }
    .ew-message-center {
        justify-content: center;
    }
    .ew-message-success {
        background-color: #e1f3d8;
        border-color: #e1f3d8;
    }
    .ew-message-success p {
        color: #67c23a;
    }
    .ew-message-warning {
        background-color: #fdfce6;
        border-color: #faecd8;
    }
    .ew-message-warning p {
        color: #e6a23c;
    }
    .ew-message-error {
        background-color: #fef0f0;
        border-color: #fde2e2;
    }
    .ew-message-error p {
        color: #f56c6c;
    }`;

    function styleInject(css, ref) {
        if (ref === void 0) ref = {};
        var insertAt = ref.insertAt;
        if (!css || typeof document === 'undefined') return;
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = "text/css";
        if (insertAt === 'top') {
            if (head.firstChild) {
                head.insertBefore(style, head.firstChild)
            } else {
                head.appendChild(style);
            }
        } else {
            head.appendChild(style);
        }
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }
    styleInject(cssText);
}
addMessageStyle();
let $message = {};
window['$message'] = $message= function(option){
    return new Message(option);
}
for(let key in typeMap){
    window.$message[key] =$message[key] = function(option){
        let messageOption = {
            content:"内容",
            center:false,
            type:key,
            closeTime:600,
            showClose:true
        }
        if(typeof option === 'string'){
            messageOption.content = option;
        }else if(typeof option === 'object' && !!option){
            messageOption = Object.assign(messageOption,option);
        }
       return new Message(messageOption);
    }
}

function Message(option){
    let messageOption = {
        content:"内容",
        center:false,
        type:"info",
        closeTime:600,
        showClose:true
    }
    if(typeof option === 'string'){
        messageOption.content = option;
    }else if(typeof option === 'object' && !!option){
        messageOption = Object.assign(messageOption,option);
    }
    this.render(messageOption);
    
}
Message.prototype.render = function(messageOption){
    if (messageOption.closeTime <= 0 && !messageOption.showClose) messageOption.showClose = true;
    let closeBtn = null;
    //设置关闭按钮相关
    if (messageOption.showClose) {
        closeBtn = document.createElement('i');
        closeBtn.classList.add('ew-message-close');
        closeBtn.innerHTML = '&times;';
    }
    document.body.appendChild(this.create(messageOption, closeBtn));
    let messageElement = document.querySelectorAll('.ew-message');
    this.setTop(messageElement);
    // 关闭时间大于0时关闭提示框
    if (messageOption.closeTime > 0) {
        this.close(messageOption.el, messageOption.closeTime);
    }
    // 点击关闭消息提示框
    if (messageOption.closeBtnEl) {
        messageOption.closeBtnEl.onclick = (e) => {
            this.close(e.currentTarget.parentElement, 0);
        }
    }
}
Message.prototype.setTop = function (messageElement) {
    if(!messageElement || !messageElement.length)return;
    // 每个高度是一样的，所以随便获取一个即可
    const height = messageElement.length ? messageElement[0].offsetHeight : messageElement.offsetHeight;
    for (let i = 0, len = messageElement.length; i < len; i++) {
        messageElement[i].setAttribute('style', 'top:' + (25 * (i + 1) + height * i) + 'px;');
    }
}
Message.prototype.create = function(messageOption,closeBtn){
    let element = document.createElement('div');
    element.className = `ew-message ew-message-${messageOption.type}`;
    if (messageOption.center) element.classList.add('ew-message-center');
    const p = document.createElement('p');
    p.innerHTML = messageOption.content;
    element.appendChild(p);
    if (closeBtn) element.appendChild(closeBtn);
    messageOption.el = element;
    messageOption.closeBtnEl = closeBtn;
    return element;
}
Message.prototype.close = function(messageElement, time){
    setTimeout(() => {
        if (messageElement && messageElement.length) {
            [].slice.call(messageElement).forEach((item) => {
                if (isDom(item) && isDom(item.parentElement) && isFunction(item.parentElement.removeChild)) {
                    item.parentElement.removeChild(item);
                }
            })
        } else {
            if (isDom(messageElement) && isDom(messageElement.parentElement) && isFunction(messageElement.parentElement.removeChild)) {
                messageElement.parentElement.removeChild(messageElement);
            }
        }
        this.setTop(document.querySelectorAll('.ew-message'));
    }, time * 10);
}



/***
 * 节选自:https://www.eveningwater.com/my-web-projects/
 * github:https://github.com/eveningwater/my-web-projects/tree/master/js/13
 * author:eveningwater
 * date:2020/7
 */
function $(selector) {
    return document.querySelector(selector);
}
function $$(selector) {
    return document.querySelectorAll(selector);
}
HTMLElement.prototype.hasClass = function (className) {
    return new RegExp(" " + className + " ").test(' ' + this.className + ' ');
}
// 语言类型数组
let voices = [];
// 默认语言类型
let voice = "zh-CN";
const songs = [
    {
        name: "她不是真的爱我",
        singer: "白小白",
        imgName: "baixiaobai"
    },
    {
        name: "下雪的季节",
        singer: "本兮",
        imgName: "benxi"
    },
    {
        name: "今生他生",
        singer: "陈启泰",
        imgName: "chenqitai"
    },
    {
        name: "流着泪为你祝福",
        singer: "韩小薰",
        imgName: "hanxiaoxun"
    },
    {
        name: "真爱你的云",
        singer: "黄国俊",
        imgName: "huangguojun"
    },
    {
        name: "车站",
        singer: "李健",
        imgName: "lijian"
    },
    {
        name: "伤了心的女人怎么了",
        singer: "刘涛",
        imgName: "liutao"
    },
    {
        name: "画颜",
        singer: "魏新雨",
        imgName: "weixinyu"
    },
    {
        name: "祝你一路顺风",
        singer: "吴奇隆",
        imgName: "wuqilong"
    },
    {
        name: "回来我的爱",
        singer: "阳一",
        imgName: "yangyi"
    },
    {
        name: "绵阳印象",
        singer: "羽上轩",
        imgName: "yushangxuan"
    },
    {
        name: "滚蛋歌",
        singer: "张翰",
        imgName: "zhanghan"
    },
    {
        name: "烈火青春",
        singer: "张雨生",
        imgName: "zhangyusheng"
    },
    {
        name: "成都",
        singer: "赵雷",
        imgName: "zhaolei"
    },
    {
        name: "歌唱二小放牛郎",
        singer: "杨慧妍",
        imgName: "yanghuiyan"
    },
    {
        name: "我的唇吻不到我爱的人",
        singer: "王奕心",
        imgName: "wangyixin"
    },
    {
        name: "贝多芬的悲伤",
        singer: "萧风",
        imgName: "xiaofeng"
    },
    {
        name: "菊花爆满山",
        singer: "马博",
        imgName: "mabo"
    },
    {
        name: "一亿个伤心",
        singer: "蒙面哥",
        imgName: "mengmiange"
    },
    {
        name: "帝都",
        singer: "萌萌哒天团",
        imgName: "mengmengdatiantuan"
    },
    {
        name: "陪你一起变老",
        singer: "唐古",
        imgName: "tanggu"
    },
    {
        name: "我在前世约了你",
        singer: "唐古",
        imgName: "tanggu"
    },
    {
        name: "恋人心",
        singer: "魏新雨",
        imgName: "weixinyu"
    },
    {
        name: "新娘不是我",
        singer: "程响",
        imgName: "chengxiang"
    }
];
// 变量定义部分
const toggleBoxBtn = $("#toggle-box");
const closeBoxBtn = $("#close-box-btn");
const readBtn = $("#read-btn");
const box = $("#box");
const readContent = $("#read-content");
const main = $("#main");
// 获取阅读信息对象实例
let message = new SpeechSynthesisUtterance();
// console.log(message);
message.lang = voice;
songs.forEach(createPopBox);
/**
 * 创建每一块
 * @param {*} item 
 */
function createPopBox(item){
    const boxItem = document.createElement('div');
    boxItem.classList.add('box');
    boxItem.innerHTML = `<p>我是${ item.singer }，我唱的《${ item.name }》。</p>`;
    main.appendChild(boxItem);
}
// 点击每一列
const children = main.querySelectorAll('.box');
children.forEach(box => {
    box.addEventListener('click',() => {
        children.forEach((child) => {
            child.classList.remove('active');
        });
        box.classList.add('active');
        setMessageText(box.querySelector('p').innerText.trim());
        speakMessage();
    });
});
/**
 * 设置文本
 * @param {*} text 
 */
function setMessageText(text){
    return message.text = text;
}
/**
 * 获取阅读语言类型
 */
function getVoices() {
    voices = speechSynthesis.getVoices();
    // console.log(voices);
}
/**
 * 加载下拉选项
 * @param {*} selectContainer 
 */
function loadSelect(selectContainer) {
    const selectListItem = selectContainer.querySelector('.select-items');
    selectListItem.innerHTML = "";
    voices.forEach(voice => {
        const voiceItem = document.createElement('div');
        voiceItem.classList.add('select-option');
        voiceItem.setAttribute('data-value', voice.lang);
        voiceItem.innerHTML = voice.name + '(' + voice.lang + ")";
        selectListItem.appendChild(voiceItem);
    });
    const label = voices.find(_ => voice === _.lang).name + '(' + voice + ")";
    setDefaultSelectValue(selectContainer.querySelector('.select-content'),label);
}
/**
 * 设置选择下拉选项值
 * @param {*} el 
 * @param {*} label 
 */
function setDefaultSelectValue(el, label) {
    return el.innerHTML = label;
}
/**
 * 下拉逻辑处理
 * @param {*} selectContainer 
 */
function selectHandle(selectContainer) {
    let selectFlag = false;
    let showSelect = function (el, bool) {
        if (bool) {
            if (el.lastElementChild.hasClass('select-down')) {
                el.lastElementChild.classList.replace('select-down', 'select-up');
            } else {
                el.lastElementChild.classList.add('select-up');
            }
            el.nextElementSibling.style.display = "block";
        } else {
            if (el.lastElementChild.hasClass('select-up')) {
                el.lastElementChild.classList.replace('select-up', 'select-down');
            } else {
                el.lastElementChild.classList.add('select-down');
            }
            el.nextElementSibling.style.display = "none";
        }
    }
    selectContainer.firstElementChild.onclick = function () {
        selectFlag = !selectFlag;
        showSelect(this, selectFlag);
    };
    let isBlur = false;
    let selectOptionArr = [].slice.call(selectContainer.lastElementChild.children);
    selectOptionArr.forEach((item) => {
        item.onclick = function () {
            selectFlag = false;
            isBlur = true;
            let select_content = this.innerHTML;
            this.parentElement.previousElementSibling.firstElementChild.innerHTML = select_content;
            selectOptionArr.map((opt) => {
                opt.classList.remove('select-this');
            });
            message.voice = voices.find(voice => voice.lang === this.getAttribute('data-value'));
            this.classList.add('select-this');
            showSelect(this.parentElement.previousElementSibling, false);
        }
    });
    selectContainer.firstElementChild.firstElementChild.onblur = function () {
        setTimeout(() => {
            if (!isBlur) {
                selectFlag = false;
                showSelect(this.parentElement, false);
            } else {
                isBlur = false;
            }
        }, 200)
    };
}
/**
 * 阅读输入的文本
 */
function speakMessage() {
    return speechSynthesis.speak(message);
}
// 加载语言类型
getVoices();
// 事件监听部分
speechSynthesis.addEventListener('voiceschanged', getVoices);
toggleBoxBtn.addEventListener('click',() => {
    box.classList.add('show');
});
closeBoxBtn.addEventListener('click',() => {
    box.classList.remove('show');
});
readBtn.addEventListener('click',() => {
    const content = readContent.value;
    if(!content.trim())return $message.warning("请输入要阅读的文本内容!");
    setMessageText(content);
    speakMessage();
});
setTimeout(() => {
    loadSelect($('.select-voices'));
    selectHandle($('.select-voices'));
}, 1000);