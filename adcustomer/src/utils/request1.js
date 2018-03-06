import 'whatwg-fetch';
import { loadingStart, loadingEnd }  from 'common/actions/LoadingAction.js';
import { showPrompt } from 'common/actions/PromptAction.js';
var request = require('superagent');
 
const getUrls = (url,data)=>{
    if(data){
        let dataKeys = Object.keys(data);
        url += (url.search(/\?/) === -1? '?':'&') + dataKeys.map(key=>(key+'='+data[key])).join('&')   
    }
 	return url 
}

const base = function(type,url,data,dispatch){
     
    let baseConfig = {
    	method: type,
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        }
        
    }
    switch  (type){

        case 'GET':
            url =  getUrls(url,data);
            break;
        case 'POST':
            baseConfig.body = data //JSON.stringify(data);
            break;
        case 'UPLOAD':
            let formData = new FormData();
            Object.keys(data).map(key=>{
            	formData.append(key,data[key])
            })
            baseConfig.body = formData;
            break;
    }
    //dtd 对象用来拦截异步请求的结果,将promise的执行结果保存在改对象中，
    let dfd = {};
    let promise = new Promise((resolve,reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;

    })

    dispatch && dispatch(loadingStart());
    fetch(url,baseConfig).then((res) => {
        if(res.status===200){
            return res.json()
        }else{
            dispatch && dispatch(showPrompt('error','接口请求错误！'))
        } 
    })
        .then(data => { 
            dispatch && dispatch(loadingEnd());
           //调用then方法请求讲在异步调用链中继续执行， 
            promise.then((resolve)=>{
               //调用resolve方法传递获取数据
               if(data.code==0){
                   resolve(data)
               }else{
                    dispatch && dispatch(showPrompt('error',data.msg))
               }
              
            })

        })
        .catch(error =>{
            // promise.then((error)=>{
            //     resolve(error)
            // })
        })


    return dfd

   

}

export default (dispatch)=>{
	return {
		get: (url,data,)=>{
            return base('GET',url,data,dispatch)
		},
		post: (url,data)=>{
            return base('POST',url,data,dispatch) 
		},
		upload: (url,data)=>{
			return base('UPLOAD',url,data,dispatch)
		},
		download:(url,data)=>{
            return  window.open(getUrls(url,data), '_self');
		}
	}
}