'use strict'

import ActionTypes from '../constants/actionType.js';

export const loadingStart = () => {
    return {
        type: ActionTypes.LOADING_START
    }
}

export const loadingEnd = () => {
    return {
        type: ActionTypes.LOADING_END
    }
}