var login = {
    "username":['huqiyue','wangxiaoyuan'],
    "password":['123456','111111']
}

function verifyLogin(){
    let username = localStorage.getItem('username')
    let password = localStorage.getItem('password')
    let index = login.username.indexOf(username);
    if (!varLogin(username,password)){
        $(window).attr('location','index.html');
    }
    var url = window.location.pathname.split('/')[2];
    console.log(url+':校验通过')
}

function varLogin(username, password) {
    let index = login.username.indexOf(username)
    if (index>=0){
        if (login.password[index]==password){
            return true;
        }
    }
    return false;
}