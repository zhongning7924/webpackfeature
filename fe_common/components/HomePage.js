import { Layout, Menu, Breadcrumb,Input, Icon,Popover,Button,Modal,Form} from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const FormItem = Form.Item;
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { userLogout,changePassword } from 'common/actions/UserAction.js';
import { Link, Redirect } from 'react-router-dom'
import LogoImg from 'common/images/logo@2x.png';
import { showPrompt } from 'common/actions/PromptAction.js';
import {routeNavs, defaultRoute} from 'constants/routeNav.js'
import 'antd/dist/antd.css'
import  'common/styles/homepage.css'
const mapStateToProps = (state) => {
    return {
        isLogin: state.app.user.isLogin,
        userInfo:state.app.user.userInfo
    }
}
const mapDispathToProps = (dispatch) => {
    return {
        onUserLogout: () => {
            dispatch( userLogout() );
        },
        onShowPrompt: (mode, msg, promise) => {
            dispatch(showPrompt(mode, msg, promise));
        },
        onChangePassword: (params, promise) => {
            dispatch( changePassword(params, promise) )
        }
    }
}
class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this)
    this.state = {
      user_name: '',
      user_id: '',
      passwordVisible: false,
      confirmDirty: false,
    };
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this)
  }
  static contextTypes = {
    router: PropTypes.object
  }
  componentDidMount() {
      this.checkLogin(this.props);
  }
  componentWillReceiveProps(newProps) {
      this.checkLogin(newProps);
  }
  checkLogin(props) {
      if (props.isLogin) {
          this.setState({
              user_name: props.userInfo.nick_name,
              user_id: props.userInfo.user_id
          });
      } else {
        this.toLogin();
      }
  }
  toLogin() {
      // 跳转到登录页面
    this.context.router.history.push(homepathurl);
  }
  logout() {
    this.props.onUserLogout();
  }
  getRoute(){
    let pathname = this.props.location.pathname;

  }
  getDeafaultMenu(navs){
    let pathname = this.props.location.pathname;
    let hash ={};
    var fun = function (navs){ 
      navs.map(item=>{
        if(item.child){
          return fun(item.child)
        }else{
          hash[item.path] = {id:item.id, name: item.name };
        }
      })
    }
    fun(navs)
    return hash

  }
  showModal(){
    this.setState({
        passwordVisible: true
    })
  }
  onSubmitPassword(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.user_id = this.props.userInfo.user_id
        this.props.onChangePassword(values)    
      }
    })
     
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('new_password')) {
      callback('两次输入密码不一致!');
    } else {
      callback();
    }
  }
  handleCancel(){

      let form = this.props.form;
      let keys = Object.keys(form.getFieldsValue())
      keys.map(key=>{
        form.setFieldsValue({[key]:''})
      })
      this.setState({
        passwordVisible: false
      })
  }
  Menus(navs){
    if(navs && navs.child ){
      return(
        <SubMenu key={navs.id} title={<span>{navs.name}</span>}>
         {
          navs.child.map(item=>(
            this.Menus(item)
          ))
          }
        </SubMenu>
      )
    }
    return(  
      <Menu.Item key={navs.id}>
        <Link to={navs.path}>{navs.name}</Link>   
      </Menu.Item>
      ) 
  }
  getDefaultOpenKeys(id){
    let keys = [];
    var fun = function(id){
      let pid = id.slice(0,id.lastIndexOf('.'));
      if(pid!=''){
        keys.push(pid)
        return fun(pid)
      }
    }
    fun(id)
    return keys; 

  }
 handleConfirmBlur(e) {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  userContent(){
    return(
       <div style={{padding: '5px'}}>
          <p style={{margin: '5px'}}>
            <Button onClick={this.showModal.bind(this)} type="primary" icon="edit">
              修改密码
            </Button>
          </p>
          <p style={{margin: '10px 5px'}}>
            <Button onClick={this.logout.bind(this)} type="primary" icon="logout">
              退出登陆
            </Button>
          </p>
      </div>
      )
  } 
  render(){
   //sysname homepath 由webpack注入全局变量
  const systemName = systemname;
  const homePath =  homepathurl;
  const { getFieldDecorator } = this.props.form;
  const formItemLayout = {
          labelCol: {
            xs: { span: 10 },
            sm: { span: 4 },
          },
          wrapperCol: {
            xs: { span: 14 },
            sm: { span: 16 },
          },
        };
  let RouteWithSubRoutes  = this.props.RouteWithSubRoutes;
  const breadcrumbNameMap = this.getDeafaultMenu(routeNavs);
  //如果/路由则导向默认页面ni
  let pathname = this.props.location.pathname;
  let selectpath = pathname=='/'?defaultRoute: pathname;
  let selectkeys = String(breadcrumbNameMap[selectpath]?breadcrumbNameMap[selectpath].id:'1')
  let defaultOpenkey = this.getDefaultOpenKeys(selectkeys)
  const { location } = this.props;
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const BreadcrumbItems = pathSnippets.map((_, index) => {
  const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>
            {breadcrumbNameMap[url].name}
          </Link>
        </Breadcrumb.Item>
      );
  });

  return (  
    <div> 
      <Layout>
        <Header className="header" style={{height: 50,paddingLeft: 10,width:'100%',position: 'fixed',zIndex:'999'}}>
            <a className='navbar-brand' href={homePath}>
                <img className='navbar-logo' style={{height: 38,marginTop:-12}} src={LogoImg} alt='brand'/>
               
            </a>

            <div style={{float:'right',color:'#fff',fontSize: 20,
                  height:50,display: 'flex',alignItems: 'center'}} >
              <a style={{color: '#fff'}}>
                <Popover content={this.userContent()} {...this.props}  trigger="click" >
                   <div style={{lineHeight: '30px'}} >
                   <Icon type='user' />
                   <span style={{paddingLeft: 5,fontSize: 15}}>{this.state.user_name}</span>
                   </div>
                </Popover>
              </a>
            </div>
        </Header>
        <Layout>
          <Sider width={240} style={{marginTop: '50px',position:'fixed',minHeight:'1000px'}} className="sider-content">
            <Menu mode="inline"
              defaultSelectedKeys={[selectkeys]}
              defaultOpenKeys={defaultOpenkey}
              style={{ height: '100%', borderRight: 0 }}
              >
              { 
                routeNavs.map(nav=>
                  (this.Menus(nav))
                )
              }
            </Menu>
          </Sider>
          <Layout className="main-content" style={{padding: '5px',marginTop: '50px',marginLeft: '240px'}}>
            <Breadcrumb className="bread-content">
              {BreadcrumbItems}
            </Breadcrumb>
            <Content className='show-content' style={{ background: '#fff', padding: 5, margin: 0, minHeight: 700 }}>
              {pathname=='/'?
                (<Redirect to={{
                  pathname: defaultRoute,
                }}/>):null
              }
               {
               
                this.props.routes &&  this.props.routes.map((route, i) => (
                 
                  <RouteWithSubRoutes key={i} {...route} {...this.props}/>

                ))
               }
              <Modal
                visible={this.state.passwordVisible}
                title='修改密码'
                onOk={this.onSubmitPassword.bind(this)}
                onCancel={this.handleCancel.bind(this)}
                okText='确定'
                size="large"
                width={500}
                >
                <Form onSubmit={this.onSubmitPassword}>
                 
                    <FormItem
                      {...formItemLayout}
                    label={(
                      <span>
                        旧密码
                      </span>
                     )}
                    hasFeedback
                    >
                    {getFieldDecorator('old_password', {
                      rules: [{ required: true, message: '旧密码必填', whitespace: true }],
                    })(
                      <Input type="password" />
                    )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                    label={(
                      <span>
                         新密码
                      </span>
                     )}
                    hasFeedback
                    >
                    {getFieldDecorator('new_password', {
                      rules: [{ required: true, message: '新密码必填', whitespace: true }],
                    })(
                      <Input type="password" />
                    )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                    label={(
                      <span>
                        确认新密码
                      </span>
                     )}
                    hasFeedback
                    >
                    {getFieldDecorator('re_new_password', {
                      rules: [{ required: true, message: '确认新密码必填', whitespace: true },
                          {validator: this.checkPassword}
                       ],
                    })(
                      <Input type="password" onBlur={this.handleConfirmBlur}/>
                    )}
                    </FormItem>
                
               

                  </Form>   
              </Modal>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>)  
  }
}
export default connect(mapStateToProps,mapDispathToProps)(Form.create()(HomePage));