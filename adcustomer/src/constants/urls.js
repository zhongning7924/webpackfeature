'use strict'
//测试开启
// const base = 'api-app.smartisan.com/app/index.php?r='
const base = '/app/index.php?r=';

const urls = {
    getCustomerList:  'ad/Aduser/List',
    addCustomer: 'ad/Aduser/Saveuser' ,
    getadPositionList: 'ad/Adposition/list',
    addPosition: 'ad/Adposition/SavePos',
    rechargeMoney: 'ad/Admoney/SaveMoney' ,
    getCustomerDetails: 'ad/Addate/list',
    getPositionList: 'ad/Adposition/ListForDate',//动态变化下拉数据
    getAllPositionList: 'ad/Adposition/ListForAll',//获取所有下拉列表 
    saveConfigDate: 'ad/Addate/SaveDate',//保存页面
    getRechargeList: 'ad/Admoney/list',//获取充值记录列表

};

for(let key in urls) {
    if (urls.hasOwnProperty(key)){
        urls[key] = base + urls[key];
    }
}


export default urls;