
import App from 'common/components/App.js';
import Login from 'common/components/Login.js';
import CustomerManage from 'components/CustomerManage.js'
import AdPosition from 'components/AdPosition.js'
import Recharge from 'components/Recharge.js'

const routes = [

  { path: '/',
    component: App,
    routes: [
     
      { 
        path: '/customer',
        component: CustomerManage,
      },
      {
        path: '/source',
        component: AdPosition,
      },
       {
        path: '/recharge',
        component: Recharge,
      }
      
    ]
   
  },
  { path: '/login',
    component: Login
  },
 
]
export default routes