import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

// import createHistory from 'history/createBrowserHistory'
import { Route } from 'react-router';
import { Link } from 'react-router-dom'
import createHistory from 'history/createHashHistory'
import thunk from 'redux-thunk';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import app from 'reducers/index.js' // Or wherever you keep your reducers
import routes from 'constants/routes.js';

//https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux

// Create a history of your choosing (we're using a browser history in this case)
// const history = createHistory()
const history = createHistory({
    queryKey: true
});
// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = createStore(
  combineReducers({
    app,
    router: routerReducer
  }),
  applyMiddleware(thunk)
)

const appElement = document.createElement('div');

document.body.appendChild(appElement);

// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/about'))

const RouteWithSubRoutes = (route) => (
  <Route path={route.path} render={props => (
    // pass the sub-routes down to keep nesting
    <route.component {...props} routes={route.routes}/>
  )}/>
)

ReactDOM.render(
  <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <ConnectedRouter history={history}>
      <div>
	        {routes.map((route, i) => (
		        <RouteWithSubRoutes key={i} {...route}/>
		      ))}
        
      </div>
    </ConnectedRouter>
  </Provider>,appElement)

