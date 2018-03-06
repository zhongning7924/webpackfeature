'use strict'

import ActionTypes from 'common/constants/actionType.js';

export const showPrompt = (mode, message, promise = null) => {
    return {
        type: ActionTypes.SHOW_PROMPT,
        mode: mode,
        msg: message,
        promise: promise
    }
}

export const hidePrompt = () => {
    return {
        type: ActionTypes.HIDE_PROMPT
    }
}