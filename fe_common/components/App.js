import React from 'react';
import Loading from 'common/components/Loading';
import Prompt from 'common/components/Prompt';
import AlertInfo from 'common/components/AlertInfo';
import { RouteWithSubRoutes } from 'common/components/baseroute.js'
import Login from 'common/components/Login.js'
import HomePage from 'common/components/HomePage.js';
import {
  Redirect,
} from 'react-router-dom'
import Auth  from 'common/utils/auth';
import { connect } from 'react-redux';
// const mapStateToProps=(state)=> {
//     return {

//     };
// }
class App extends React.Component {
	constructor(props){
        super(props)
	}
	render(){
    let isLogin = Auth.isLogin();
     
		return(
	        <div>
            {isLogin?(
                <div>
                 <HomePage {...this.props} RouteWithSubRoutes={RouteWithSubRoutes}/>
                
                </div>
             
              ):(
                <Redirect to={{
                    pathname: '/login',
                }}/>)
            }

          
            <Loading/>
            <AlertInfo/>
	          
	        </div>
		)
	}
};


export default App;
