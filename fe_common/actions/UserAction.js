'use strict'

import ActionTypes from 'common/constants/actionType.js';
import Request from 'common/utils/request.js';
import Urls from 'common/constants/urls';
import Auth from 'common/utils/auth.js';
import { showPrompt } from './PromptAction.js';

export const updateUserInfo = userInfo => {
    return {
        type: ActionTypes.UPDATE_USER_INFO,
        isLogin: !!userInfo,
        userInfo: userInfo || {}
    }
}

export const userLogin = params => {
    //Urls.Login
    return dispatch => {
    
        Request(dispatch).post(Urls.Login,params).done(function(data){
            Auth.login(data.user_info);
            dispatch( updateUserInfo(data.user_info) );
        });
         
    }
}

export const userLogout = () => {
    return dispatch => {
        Request(dispatch).post(Urls.Logout).done(function(data){
            Auth.logout();
            dispatch( updateUserInfo() )
        });
    }
}

export const changePassword = (params, promise) => {
    return dispatch => {
        Request(dispatch).post(Urls.ChangePassword, params).done(data => {
            dispatch( showPrompt('success', '密码修改成功！', promise) );
        });
    }
}

