'use strict'

import Cookies from 'js-cookie';

// 使用isLogin是为了向前兼容旧的验证方式

export default {
    login(userInfo) {
        Cookies.set('isLogin', true);
        Cookies.set('userInfo', userInfo);
    },
    logout() {
        Cookies.remove('isLogin');
        Cookies.remove('userInfo');
    },
    isLogin() {
        return Cookies.get('isLogin');
    },
    getUserInfo() {
        return Cookies.getJSON('userInfo');
    }
}