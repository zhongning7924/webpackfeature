'use strict'

import actionType from 'constants/actionType.js';

const customerlistState = {
    customerlist: [],
    count: 0,
};

const adpositionState = {
    adpositionlist: [],
    count: 0,
}
const rechargeState = {
    rechargelist: [],
    count: 0,
}
const addtateState ={
    addatelist: [],
    count: 0,
}

export const customerlist = (state = customerlistState, action) => {
    switch (action.type) {
        case actionType.UPDATE_CUSTOMER_LIST:
            return Object.assign({}, state, {
                customerlist: action.customerlist,
                count: action.count,
            });
       
        default:
            return state;
    }
}

export const adpositionlist = (state = adpositionState, action) => {
    switch (action.type) {
        case actionType.UPDATE_ADPOSITION_LIST:
            return Object.assign({}, state, {
                adpositionlist: action.adpositionlist,
                count: action.count,
            });
       
        default:
            return state;
    }
} 
export const rechargelist = (state = rechargeState, action) => {
    switch (action.type) {
        case actionType.UPDATE_RECHARGE_LIST:
            return Object.assign({}, state, {
                rechargelist: action.rechargelist,
                count: action.count,
            });
       
        default:
            return state;
    }
} 
export const addatelist = (state = addtateState, action) => {
    switch (action.type) {
        case actionType.UPDATE_ADDATE_LIST:
            return Object.assign({}, state, {
                addatelist: action.addateList,
                count: action.count,
            });
       
        default:
            return state;
    }
} 