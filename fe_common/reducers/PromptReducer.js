'use strict'

import ActionTypes from 'common/constants/actionType.js';

const prompt = (state={}, action) => {
    switch (action.type) {
        case ActionTypes.SHOW_PROMPT:
            return {
                show: true,
                type: action.mode,
                msg: action.msg,
                promise: action.promise
            };
        case ActionTypes.HIDE_PROMPT:
            return {
                show: false,
                type: '',
                msg: '',
                promise: null
            };
        default:
            return state;
    }
};

export default prompt;