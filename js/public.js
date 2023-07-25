var login = {
    username:['huqiyue','wangxiaoyuan'],
    password:['123456','111111']
}
function verifyLogin(){
    var url = window.location.search.substring(1);
    if (url == '') {
        $(window).attr('location','index.html');
    }
    var combina = ['','']
    var paramsArr = url.split('&');
    for (var i = 0; i < paramsArr.length; i++) {
        console.log(paramsArr[i])
        combina[i] = paramsArr[i].split("=")[1];
    }
    let params = {username: combina[0],password: combina[1]}
    let index = login.username.indexOf(combina[0]);
    if (index == -1) {
        $(window).attr('location','index.html');
        // $("body").text("密码或账号错误")
    }else {
        if (login.password[index] != combina[1]){
            $(window).attr('location','index.html');
            // $("body").text("密码或账号错误")
        }

    }
}