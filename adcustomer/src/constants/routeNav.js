
export const routeNavs = [
  {
    id: 1,
    // path: '/user',
    name:'排期管理',
    child:[{
      id:1.1,
      pid: 1,
      path: '/customer',
      name:'客户管理'
      },{
      id:1.2,
      pid: 1,
      path: '/source',
      name:'资源位管理',
      }
    ]  
  },
  {
    id:2,
    name: '充值管理',
    path: '/recharge'
  }
]
export const defaultRoute='/customer'

