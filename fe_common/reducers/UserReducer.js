'use strict'

import ActionTypes from 'common/constants/actionType.js';
import Auth from 'common/utils/auth.js';

const initState = {
    isLogin: Auth.isLogin(),
    userInfo: Auth.getUserInfo()
}

const user = (state=initState, action) => {
    switch (action.type) {
        case ActionTypes.UPDATE_USER_INFO:
            return {
                isLogin: action.isLogin,
                userInfo: action.userInfo,
            };
        default:
            return state;
    }
};

export default user;