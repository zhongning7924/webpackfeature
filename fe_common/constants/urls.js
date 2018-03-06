'use strict'

const base = '/app/index.php?r=';

const urls = {
    // 用户相关
    Login: 'user/login',
    Logout: 'user/logout',
    ChangePassword: 'user/ChangePassword',
    // 权限
    getUserSystem: 'rbac/rbac/rolesystem',
    getUserSystemPage: 'rbac/page/RoleSystemPage',


};

for(let key in urls) {
    if (urls.hasOwnProperty(key)){
        urls[key] = base + urls[key];
    }
}

// // 跳转至admin后台首页
// urls.ToIndex = '/#/login';

export default urls;
