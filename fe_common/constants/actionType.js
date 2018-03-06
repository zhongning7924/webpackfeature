'use strict'

const ActionType = {
    // show/hide prompt
    SHOW_PROMPT: 'SHOW_PROMPT',
    HIDE_PROMPT: 'HIDE_PROMPT',
    // remote loading flag
    LOADING_START: 'LOADING_START',
    LOADING_END: 'LOADING_END',
    // user
    UPDATE_USER_INFO: 'UPDATE_USER_INFO',
    //数据平台公用查询条件
    GET_SEARCH_INFO: 'GET_SEARCH_INFO',
    //导航栏隐藏显示的标识
    HIDE_LEFT_NAV: 'HIDE_LEFT_NAV',
    // resource 资源上传模块
    UPDATE_RESOURCE_LIST: 'UPDATE_RESOURCE_LIST',
    SHOW_RESOURCE_MODAL: 'SHOW_RESOURCE_MODAL',
    HIDE_RESOURCE_MODAL: 'HIDE_RESOURCE_MODAL',
}

export default ActionType;
