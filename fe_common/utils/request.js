'use strict'

import $ from 'jquery';
import { loadingStart, loadingEnd }  from 'common/actions/LoadingAction.js';
import { showPrompt } from 'common/actions/PromptAction.js';

const baseConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    }
};

const getErrorMessage = function(errorInfo) {
    if (typeof errorInfo === 'string') {
        return errorInfo;
    }
    if (({}).toString.call(errorInfo) === '[object Object]') {
        let keys = Object.keys(errorInfo);
        if (keys && keys.length) {
            return errorInfo[keys[0]];
        }
    }
    return '操作失败！';
}

const base = function (type, url, data, dispatch) {
    var promise = $.Deferred();
    var config = {};
    config.url = url;
    config.data = data;
    config.dataType = 'json';
    config.contentType = "application/x-www-form-urlencoded;charset=utf-8";

    switch (type) {
        case 'GET':
            config.type = 'GET';
            break;
        case 'PUT':
            config.type = 'PUT';
            break;
        case 'DELETE':
            config.type = 'DELETE';
            break;
        case 'POST':
            config.type = 'POST';
            break;
        case 'POST_JSON':
            config.type = 'POST';
            config.contentType = "application/json";
            break;
        case 'UPLOAD':
            config.type = 'POST';
            config.processData = false;
            config.contentType = false;
            let formData = new FormData();
            for (let attr in data) {
                if (data.hasOwnProperty(attr)) {
                    if (data[attr] instanceof Array) {
                        data[attr].forEach(item => {
                            formData.append(attr, item);
                        })
                    } else {
                        formData.append(attr, data[attr]);
                    }
                }
            }
            config.data = formData;
            break;
        //应用商店的上传
        case 'SOTREUPLOAD':
            config.type = 'POST'
            config.processData = false
            config.contentType = false
            let formData1 = new FormData()
            for (let attr in data) {
                if (data.hasOwnProperty(attr)) {
                    formData1.append(attr, JSON.stringify(data[attr]))
                }
            }
            config.data = formData1
            break    
    }
    dispatch && dispatch(loadingStart());
    $.ajax(config).done(function(response){
        if (response.code == 0) {
            promise.resolve(response.data);
        } else if (response.code == 1) {
            dispatch && dispatch( showPrompt('error', getErrorMessage(response.errInfo)) );
            promise.reject();
        } else if (response.code == 2) {
            dispatch && dispatch( showPrompt('error', '请重新登录！') );
            dispatch && dispatch( updateUserInfo() )
            promise.reject();
        } else if (response.code == 3) {
            dispatch && dispatch( showPrompt('error', '没有操作权限！') );
            promise.reject();
        } else if (response.code == 400 || response.code == 500) {
            dispatch && dispatch(showPrompt('error', response.message ? response.message : '操作失败'));
            promise.reject();
        }
        else {
            promise.reject(response);
        }
    }).fail(function(text){
        dispatch && dispatch( showPrompt('error', '请求失败！') );
        promise.reject();
    }).always(function(){
        dispatch && dispatch(loadingEnd());
    });
    return promise;
}
// 接受 dispatch 用以发出 actions
export default function(dispatch) {
    return {
        get: function (url, data) {
            return base('GET', url, data, dispatch);
        },
        post: function (url, data) {
            return base('POST', url, data, dispatch);
        },
        postJson: function (url, data) {
            return base('POST_JSON', url, data, dispatch);
        },
        delete: function (url, data) {
            return base('DELETE', url, data, dispatch);
        },
        put: function (url, data) {
            return base('PUT', url, data, dispatch);
        },
        upload: function (url, data) {
            return base('UPLOAD', url, data, dispatch);
        },
        storeupload: function(url,data){
            return base('SOTREUPLOAD',url,data,dispatch)
        },
        download: function (url, data) {
            if (!window) return;
            window.open(`${url}${/\?/.test(url) ? '&' : '?'}${$.param(data)}`, '_self');
        }
    }
}