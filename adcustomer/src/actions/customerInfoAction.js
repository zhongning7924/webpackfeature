import actionType from 'constants/actionType.js';

export const customerListAction = (customerlist,count) => {
    return {
        type: actionType.UPDATE_CUSTOMER_LIST,
        customerlist: customerlist,
        count: count
    }
}
export const adPositionAction = (adpositionlist,count)=>{
	return {
		type: actionType.UPDATE_ADPOSITION_LIST,
        adpositionlist: adpositionlist,
        count: count
	}
}
export const rechargeListAction = (rechargelist,count)=>{
    return {
        type: actionType.UPDATE_RECHARGE_LIST,
        rechargelist: rechargelist,
        count: count
    }
}
export const adDateListAction = (addateList,count)=>{
    return {
        type: actionType.UPDATE_ADDATE_LIST,
        addateList: addateList,
        count: count
    }
}