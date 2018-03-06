import React from 'react';
import { RouteWithSubRoutes } from 'common/components/baseroute.js'
import { Collapse,Button,Input,AutoComplete,
	    Select,DatePicker, Cascader,Table,
	    Pagination,Modal,Form,Card,Icon,Row} from 'antd'
const InputGroup = Input.Group
const Panel = Collapse.Panel;
const Option = Select.Option;
const FormItem = Form.Item;
import { showPrompt } from 'common/actions/PromptAction.js';

import { connect } from 'react-redux';
import moment from 'moment'
import Urls from 'constants/urls';
import Request from 'common/utils/request.js';
import { customerListAction,adDateListAction }  from 'actions/customerInfoAction.js'
import 'styles/customermanage.css'
const mapStateToProps  = (state)=>({
	customerlist: state.app.customerlist.customerlist,
	count: state.app.customerlist.count,
	addatelist: state.app.addatelist
})


class CustomerManage extends React.Component {
	constructor(props) {
	    super(props);
		this.state={
			size: 'large',
			status: '',
			selectedRowKeys: [],
			currentpage:1,
			pageSize: 10,
			name: '',
			user_num: '',
			agency_company: '',
			packagename: '',
			start_time: '',
			end_time: '',
			
			//添加客户
			modalstate:{
                title: '添加',
                visible: false,
                confirmLoading: false,
			},
			//查看详情
			detailState: {
				detai_name: '',
				detail_visible: false,
				detail_pagesize: 10,
				detail_currentpage: 1,
                userID:'',
			  
			},
			detail_start_time: '',
			detail_end_time: '',
			//配置排期
			dateConfig:{
               config_visible: false, 
               config_title: '',
               user_id:'',
			},
		
			//下拉数据列表
			homeSelect:[],
			homeInnerPosition:[],
			soucePostion: [],

			//排期数据明细
			dateDetailList: [],

			open: false,
		}
		this.onChange = this.onChange.bind(this)
		this.onShowSizeChange = this.onShowSizeChange.bind(this)
		this.onSelectChange = this.onSelectChange.bind(this)
		this.handleCancel = this.handleCancel.bind(this)
		this.addCustomer = this.addCustomer.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleDetailCancel = this.handleDetailCancel.bind(this)
		this.onDetailChange = this.onDetailChange.bind(this)
		this.handleConfigCancel = this.handleConfigCancel.bind(this)
		this.onOpenChange = this.onOpenChange.bind(this)
		this.onCongigDateChange = this.onCongigDateChange.bind(this)
		this.onTimeOk = this.onTimeOk.bind(this)
		this.showSelectTime = this.showSelectTime.bind(this)
		this.saveConfigDate = this.saveConfigDate.bind(this)
    }

    componentDidMount(){
    	this.getCustomerList();
    	this.getAllPositionList();
    }
    handleChange(value){
        this.setState({
        	status: value
        })
    }
    onSelectChange(selectedRowKeys){
    	
        this.setState({ selectedRowKeys });
    }
    onChange(pageNumber) {
	   this.setState({
	   	   currentpage: pageNumber
	   },this.getCustomerList)
	}
	onDetailChange(pageNumber){
		let detailState = this.state.detailState;
		detailState.detail_currentpage = pageNumber;
       this.setState({
	   	   detailState
	   },this.getDetailList)
	}
	onShowSizeChange(currentpage,pageSize){
		this.setState({
			currentpage: currentpage,
			pageSize: pageSize
		},this.getCustomerList)

	}
    exportCustomer(type){
        let selectedRowKeys = this.state.selectedRowKeys;
        let obj = {}
        obj.export = 1; 
        if(type=='all'){
            obj.start_time = this.state.detail_start_time
            obj.end_time = this.state.end_time
        }else{
            if(selectedRowKeys.length==0){
                Modal.error({
                    title: '请选择要导出的项目！',
                })
                return;
            }
            obj.user_id = selectedRowKeys.join(',');
        }
        Request(this.props.dispatch).download(Urls.getCustomerDetails,obj)
    }
	searchChange(name,event){
		let obj={};
		obj[name] = event.target.value
		this.setState(obj)

	}
    getCustomerList(){
       let obj={};
       let {name,agency_company,user_num,packagename,status,start_time,end_time,currentpage,pageSize} = this.state;
       obj.name = name;
       obj.agency_company = agency_company;
       obj.user_num = user_num;
       obj.status = status;
       obj.package = packagename;
       obj.start_time = this.state.start_time;
       obj.end_time = this.state.end_time;
       obj.page = currentpage;
       obj.page_size = pageSize;
       for(let key in obj){
       	  if(obj[key]==''){
       	  	delete obj[key]
       	  }
       }
       Request(this.props.dispatch).post(Urls.getCustomerList,obj).done(data=>{
           this.props.dispatch(customerListAction(data.list,Number(data.count)))
       })
    }
    addCustomer(type,obj){

        let modalstate = Object.assign({},this.state.modalstate)
        modalstate.visible = true;
        let form = this.props.form;
        let keys = Object.keys(form.getFieldsValue());

        if(type=='edit'){
      
           keys.push('id');
       	   modalstate.title = '编辑';
       	   // this.props.form.setFieldsValue
       	    keys.map(key=>{
                let value = {};
                value[key] = obj[key]; 
       	    	form.setFieldsValue(value)
       	    });
        }else{
            modalstate.title = '添加' 
            form.resetFields()
       	    

        } 
        this.setState({modalstate})
    }
  
   
    handleCancel(){
       let modalstate = Object.assign({},this.state.modalstate)
       modalstate.visible = false;
       this.setState({modalstate})
    }
    handleDetailCancel(){
       let detailState = Object.assign({},this.state.detailState)
       detailState.detail_visible = false;
       this.setState({detailState,detail_start_time:'',detail_end_time:''})
    }
    //取消配置排期
    handleConfigCancel(){

       let dateConfig = Object.assign({},this.state.dateConfig)
       dateConfig.config_visible = false;
       let dateDetailList = this.state.dateDetailList;
       dateDetailList.map(item=>{
           item.open = false
       })
       this.setState({dateConfig,dateDetailList})
    }
    dateTimeChange(name,date,datestring){
    	let obj = {[name]: datestring};
        this.setState(obj)
    }
    detailsdateTimeChange(name,date,datestring){
        let obj = {[name]: datestring};
        this.setState(obj,this.getDetailList)
    }
   
    getDetails(item){
       let userID = item.id;
       let detailState = Object.assign({},this.state.detailState);
       let {detail_start_time, detail_end_time} = this.state;
       if(this.state.start_time==''){
          detail_start_time = moment().format('YYYY-MM-DD')
       }else{
          detail_start_time = moment(this.state.start_time).format('YYYY-MM-DD')
       }
       if(this.state.end_time==''){
           detail_end_time = moment().format('YYYY-MM-DD')

       }else{
           detail_end_time = moment(this.state.end_time).format('YYYY-MM-DD')
       }
       detailState.detail_visible  = true;
       detailState.userID = userID,
       detailState.detai_name = item.name;
       this.setState({ detailState, detail_start_time,detail_end_time},this.getDetailList)
    }
    //获取详情的数据
    getDetailList(){
    	let userID = this.state.detailState.userID;
    	let obj = {}
    	obj.user_id = userID;
    	obj.start_time = this.state.detail_start_time
    	obj.end_time = this.state.detail_end_time
    	obj.page = this.state.detailState.detail_currentpage;
    	obj.page_size = this.state.detailState.detail_pagesize;
    	Request(this.props.dispatch).post(Urls.getCustomerDetails,obj).done(data=>{
            let datalist = data.list ? data.list : []
            this.props.dispatch(adDateListAction(datalist,data.count))
    	})
    } 
    addConfigDate(obj){
    	let dateConfig = this.state.dateConfig;
    	dateConfig.config_visible = true;
        dateConfig.config_title = obj.name
        dateConfig.user_id = obj.id
    	this.setState({dateConfig},this.getConfigList.bind(this,obj.id))
    }
    //获取配置排期列表
    getConfigList(userID){
    	// 需要添加的对象
    	let initObj = {open:false,selectDateList:[], pos_innerlist: this.state.homeInnerPosition, 
    		poslist: this.state.soucePostion,
    	    };
        Request(this.props.dispatch).post(Urls.getCustomerDetails,{user_id: userID}).done(data=>{
            let dateDetailList = data.list;
            if(dateDetailList.length==0){
           	    dateDetailList.push(initObj)
            }else{
           	    dateDetailList.map((info,index)=>{
           	       info.ad_date = info.ad_date.replace(/(^\,*)|(\,*$)/g, "")
                   dateDetailList[index] = Object.assign(info,initObj);
                   dateDetailList[index].selectDateList = info.ad_date.split(',');
           	    })
            }
            this.setState({ dateDetailList })

    	})
    }

    handleSubmit(e){
    	e.preventDefault();
	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	      	let obj = values;
	      	let modalstate =Object.assign({},this.state.modalstate);
	      	modalstate.confirmLoading = true;
	      	let id = this.props.form.getFieldValue('id')
            if(id && id.length>0){
               obj.id  = id;

            }
            this.setState({
            	modalstate
            })
	        Request(this.props.dispatch).post(Urls.addCustomer,obj).done(data=>{
	        	modalstate.visible = false;
	        	modalstate.confirmLoading = false
	        	this.setState({modalstate},this.getCustomerList)


	        }).fail(()=>{
	        	modalstate.confirmLoading = false
	        	this.setState({
                    modalstate
	        	})
	        })
	      }
	    });

    }

    // //初始化下拉列表数据
    // getPositionList(){
    // 	let obj={};
    	
    // }
    //获取所有的资源位数据
    getAllPositionList(){
    	Request(this.props.dispatch).post(Urls.getAllPositionList).done(data=>{
            this.setState({
	           	homeSelect: data.pos_page,
				homeInnerPosition: data.pos_page_inner,
				soucePostion: data.pos,
            })
    	})
    }

    //保存配置排期
    handleConfigSubmit(){
    
    }
    //日期改变
    onCongigDateChange(index,date){
       let dateDetailList = this.state.dateDetailList;
       let selectDate = moment(date).format('YYYYMMDD');
       if(dateDetailList[index].selectDateList.length==10){
       	  // this.props.dispatch(showPrompt('error', '最多只能添加10个日期。'))
       	  return
       }
       dateDetailList[index].selectDateList.push(selectDate)
       this.setState({
          dateDetailList
       })
    }
  
    //日期下拉控制
    onOpenChange(index,open,e){
    	let dateDetailList = this.state.dateDetailList;
    	if(open==false){
    	   dateDetailList[index].open = false
           this.setState({
	          dateDetailList
	        })
    	}else{
            dateDetailList.map(item=>{
                item.open = false
            })
    		dateDetailList[index].open = true
    		this.setState({
	          dateDetailList
	        })
    	}
    }
    //日期确定
    onTimeOk(index,open){
        
        let dateDetailList = this.state.dateDetailList;
	    dateDetailList[index].open = false
	    dateDetailList[index].ad_date = dateDetailList[index].selectDateList.join(',')
        this.setState({
           dateDetailList
        })
    }
    //删除选定的日期
    removeDate(index,idx){
    	let dateDetailList = this.state.dateDetailList;
    	dateDetailList[index].selectDateList.splice(idx,1);
    	this.setState({
    		dateDetailList
    	})
    }

   
    disableDateHandle(selectDateList,current){
        return selectDateList.some(date=>(moment(current).format('YYYYMMDD')==date))
    }
    //编辑排期--数据处理函数
    editDateHandle(name,index,value){
        let dateDetailList = this.state.dateDetailList;
        if(name=='normal_download'){
            dateDetailList[index][name] = value.target.value                   
        }else{
            dateDetailList[index][name] = value

        }
        this.setState({
        	dateDetailList
        })
    }
    //获取焦点时候动态改变下拉列表的数据
    updatePosList(name,index){
        let obj = {}
        obj.type = name
        let attrube = 'poslist'
        let dateDetailList = this.state.dateDetailList;
        if(name=='pos_page_inner'){
        	obj.parent_name = this.state.dateDetailList[index].pos_page
        	attrube = 'pos_innerlist'
        }else{
        	obj.parent_name = this.state.dateDetailList[index].pos_page_inner
        	attrube = 'poslist'
        }
        if(!obj.parent_name){
        	dateDetailList[index][attrube] = [];
        	this.setState({
               dateDetailList
        	})
        	return
        }
    	Request(this.props.dispatch).post(Urls.getPositionList,obj).done(data=>{
    	    dateDetailList[index][attrube] = data.list
            this.setState({
                dateDetailList
            })
    	})
      
    }
    //添加行
    addCol(index){
        let dateDetailList = this.state.dateDetailList;
        let initObj = {open:false,selectDateList:[], pos_innerlist: this.state.homeInnerPosition, 
    		poslist: this.state.soucePostion,
    	    };
        let leftlist = dateDetailList.slice(0,index+1).concat([initObj]);
        let rightlist = dateDetailList.slice(index+1,dateDetailList.length);
        dateDetailList = leftlist.concat(rightlist);
        this.setState({
        	dateDetailList
        })
    }
    //删除行
    deleteCol(index){
        let dateDetailList = this.state.dateDetailList;
        if(dateDetailList.length>1) {
           dateDetailList.splice(index,1);
        }
        this.setState({
        	dateDetailList
        })
    }
    //保存排期数据
    saveConfigDate(){
        let reqbody = [];
    
        let dateDetailList = this.state.dateDetailList;
        dateDetailList.map(detail=>{
           let obj = {}
       	   obj.pos_page = detail.pos_page;
       	   obj.pos_page_inner = detail.pos_page_inner;
       	   obj.pos = detail.pos;
       	   obj.normal_download = detail.normal_download;
       	   let datelist= []
       	   detail.selectDateList.map(date=>{
               datelist.push(moment(date).format('YYYYMMDD'));
       	   })
       	   obj.ad_date = datelist.join(',');
       	   obj.user_id = this.state.dateConfig.user_id;
       	   if(detail.id && detail.id.length>0){
       	   	    obj.id = detail.id
       	   }
       	   reqbody.push(obj)
           detail.open = false
       	 
        })

        this.setState({dateDetailList});//关闭日期
        Request(this.props.dispatch).post(Urls.saveConfigDate, {reqbody: JSON.stringify(reqbody)})
        .done(data=>{
          let that=this;
          Modal.success({
            title: '保存成功！',
            onOk() {that.handleConfigCancel()},
            
          })
        	// this.props.dispatch( showPrompt('success','保存成功！',this.handleConfigCancel))
  
        })
    }
     //显示选择的日期
    showSelectTime(index){
    	let selectDateList = this.state.dateDetailList[index].selectDateList;
        return(
              <Row className="show-date-info"  >
	              {selectDateList.map((date,idx)=>(
	              	   <span key={idx}>
	              	   <Button onClick={this.removeDate.bind(this,index,idx)} key={idx} style={{padding: '2px',marginLeft: '5px'}}>{date} 
		                    <Icon  type="minus-circle-o" />
	                   </Button>
	                   {idx!=0 && idx%2!=0?(<br/>):null}
	                   </span>
	                  
	              	))}
	                <Row className='date-config'>
	                    <Button type='primary' onClick={this.onTimeOk.bind(this,index)}>确定</Button>
	                </Row>
              </Row>
        	)
    }
    render() {
    	let {customerlist,count} = this.props;
	    const  columns = [{
	 
			  title: '客户名',
			  dataIndex: 'name',
			}, {
			  title: '客户编号',
			  dataIndex: 'user_num',
			}, {
			  title: '代理公司',
			  dataIndex: 'agency_company',
			},{
			  title: '包名',
			  dataIndex: 'package',
			},{
			  title: '单价(元)',
			  dataIndex: 'cpd_price',
			},{
			  title: '账户余额(元)',
			  dataIndex: 'balance',
			},{
			  title: '状态',
			  dataIndex: 'status',
			  render: (text,record) => <span>{record.status==1?'正常':'停用'}</span>,
			},{
			  title: '操作',
			  render: (text,record,index)=>(
			  	<span>
			      <a onClick={this.addCustomer.bind(this,'edit',record)}>编辑</a>
			   
			      <a className='marginleft-10' onClick={this.addConfigDate.bind(this,record)}>配置排期</a>
			    
			     
			    </span>)
			},{
			  title: '详情',
			  render: (text,record,index)=>(
			  	<span>
			      <a onClick={this.getDetails.bind(this,record)}>查看</a>
			    </span>)
			}
		];
		const detailsColumns = [{
				  title: '日期',
				  dataIndex: 'ad_date'
			    },{
				  title: '客户名',
				  dataIndex: 'name',
				}, {
				  title: '客户编号',
				  dataIndex: 'user_num',
				}, {
				  title: '代理公司',
				  dataIndex: 'agency_company',
				},{
				  title: '包名',
				  dataIndex: 'package',
				},{
				  title: '单价(元)',
				  dataIndex: 'cpd_price',
				},{
                   title: '资源位',
				   dataIndex: 'pos',
                   render: (text,record) => <span>
                   {record.pos_page+'-'+record.pos_page_inner+'-'+record.pos}</span>,

				},{
				  title: '下载量',
				  dataIndex: 'download',
				},{
				  title: '自然量',
				  dataIndex: 'normal_download',
				},{
				  title: '消耗金额(元)',
				  dataIndex: 'cost_money',  
				},{
				  title: '账户余额(元)',
				  dataIndex: 'balance',
				}
			]
	    const { loading, selectedRowKeys,name,user_num,packagename,size } = this.state;
	    const rowSelection = {
	      selectedRowKeys,
	      onChange: this.onSelectChange,
	    }
	    const {title,visible, confirmLoading} = this.state.modalstate
		const {detai_name,detail_visible,detail_pagesize,detail_currentpage,dateList } = this.state.detailState
		const {config_visible,config_title } = this.state.dateConfig;
        let addatelist = this.props.addatelist.addatelist.map(item=>{
        	item.create_time = moment(item.create_time*1000).format('YYYY-MM-DD')
        })
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
	    let {soucePostion, homeSelect, homeInnerPosition } = this.state
	    const statusList =[{name: '正常',value:'1'},{name: '停用',value:'2'}]

	    return (
	        <div className="user-mange common-content">
	            <Collapse defaultActiveKey='1'>
		            <Panel header="客户管理" key={1}>
		                <div className="button-group">
					        <Button onClick={this.addCustomer} type="primary" icon="user-add" size={size}>添加</Button>
				            <Button onClick={this.exportCustomer.bind(this,'all')} type="primary" icon="export" size={size}>导出全部</Button>
				            <Button onClick={this.exportCustomer.bind(this,'sel')} type="primary" icon="export" size={size}>导出所选</Button>
			            </div>
			            <div className='form-group'>
				            <Input onChange={this.searchChange.bind(this,'name')} value={name} placeholder="客户名" size={size} />
				            <Input onChange={this.searchChange.bind(this,'user_num')} value={user_num} placeholder="客户编号" size={size}/>
				            <Input onChange={this.searchChange.bind(this,'agency_company')} placeholder="代理公司" size={size} />
				            <Input onChange={this.searchChange.bind(this,'packagename')} placeholder="包名" size={size}/>

				            <Select
				                className="select"
					            style={{width:120}}
							    size={size}
							    placeholder="状态"
							    onChange={this.handleChange.bind(this)}
							    >
							    {statusList.map(item=>(
                                    <Option key={item.value} value={item.value}>{item.name}</Option>
							    	))}
							
						    </Select>
		                      
		                    <span className='datetime'>
								<DatePicker placeholder='开始日期' onChange={this.dateTimeChange.bind(this,'start_time')} size={size}/>
								<span>~</span>
								<DatePicker placeholder='结束日期' onChange={this.dateTimeChange.bind(this,'end_time')}  size={size}/>
							</span>
		                    <Button onClick={this.getCustomerList.bind(this)} type="primary"  icon="search" size={size}>搜索</Button>
				        </div>
				         

				    </Panel>
			    </Collapse>

			    <div className="table-info">
			       <Table rowSelection={rowSelection} 
			              rowKey={record => record.id}
			              columns={columns} 
			              dataSource={customerlist}
			              pagination={false}>

			       </Table>

			       <Pagination 
			                   onChange={this.onChange} 
			                   pageSize ={this.state.pageSize}
			                   showSizeChanger = {true}
                               onShowSizeChange = {this.onShowSizeChange}
			                   showQuickJumper
			                   current={this.state.currentpage} 
			                   total={count}>
			       </Pagination>
			    </div>

			    <Modal
		          visible={visible}
		          title={title}
		          onOk={this.handleSubmit}
		          onCancel={this.handleCancel}
		          confirmLoading={confirmLoading}

		          okText='保存'
		          size="large"
		          width={700}
		          >
			        <Form onSubmit={this.handleSubmit}>
			            {getFieldDecorator('id')}
			            <FormItem
			              {...formItemLayout}
				          label={(
				            <span>
				              客户名
				            </span>
				           )}
				          hasFeedback
				          >
				          {getFieldDecorator('name', {
				            rules: [{ required: true, message: '客户名必填', whitespace: true }],
				          })(
				            <Input />
				          )}
				        </FormItem>
				        <FormItem
			              {...formItemLayout}
				          label={(
				            <span>
				              包名
				            </span>
				           )}
				          hasFeedback
				          >
				          {getFieldDecorator('package', {
				            rules: [{ required: true, message: '包名必填', whitespace: true }],
				          })(
				            <Input disabled = {this.state.modalstate.title=='编辑'}/>
				          )}
				        </FormItem>
				        <FormItem
			              {...formItemLayout}
				          label={(
				            <span>
				              客户编号
				            </span>
				           )}
				          hasFeedback
				          >
				          {getFieldDecorator('user_num', {
				            rules: [{ required: true, message: '客户编号必填', whitespace: true }],
				          })(
				            <Input />
				          )}
				        </FormItem>
				        <FormItem
			              {...formItemLayout}
				          label={(
				            <span>
				              代理公司
				            </span>
				           )}
				          hasFeedback
				          >
				          {getFieldDecorator('agency_company', {
				            rules: [{ required: true, message: '代理公司必填', whitespace: true }],
				          })(
				            <Input />
				          )}
				        </FormItem>
				        <FormItem
			              {...formItemLayout}
				          label={(
				            <span>
				              单价
				            </span>
				           )}
				          hasFeedback
				          >
				          {getFieldDecorator('cpd_price', {
				            rules: [{ required: true, message: '单价必填', whitespace: true }],
				          })(
				            <Input />
				          )}
				        </FormItem>
				         <FormItem
			              {...formItemLayout}
				          label={(
				            <span>
				              状态
				            </span>
				           )}
				          hasFeedback
				          >
				          {getFieldDecorator('status', {
				            rules: [{ required: true, message: '状态必填', whitespace: true }],
				          })(
				             <Select
							    size={size}
							    >
							    {statusList.map(item=>(
                                    <Option key={item.value}  value={item.value}>{item.name}</Option>
							    	))}
						    </Select>
				          )}
				        </FormItem>


				    </Form>    
		        </Modal>
                
                <Modal
		          visible={config_visible}
		          title={config_title}
		          onOk={this.saveConfigDate}
		          onCancel={this.handleConfigCancel}
                  maskClosable = {false}
		          okText='保存'
		          size="large"
		          width={1000}
		          >
		           {this.state.dateDetailList.map((details,delindex)=>(
                    <Card className="date-deatail-content" key={delindex}>
				        <Select
			                className="select"
				            style={{width:120}}
						    size={size}
						    value={details.pos_page}
						    placeholder="页面"
						    onChange={this.editDateHandle.bind(this,'pos_page',delindex)}
						    >
						    {homeSelect.map(item=>(
                                <Option key={item.pos_name} value={item.pos_name}>{item.pos_name}</Option>
						    	))}
						</Select>
						<Select
			                className="select"
				            style={{width:120}}
						    size={size}
						    value={details.pos_page_inner}						    
						    onFocus={this.updatePosList.bind(this,'pos_page_inner',delindex)}
						    placeholder="页面内位置"
						    onChange={this.editDateHandle.bind(this,'pos_page_inner',delindex)}
						    >
						    {details.pos_innerlist.map(item=>(
                                <Option key={item.pos_name} value={item.pos_name}>{item.pos_name}</Option>
						    	))}
						</Select>
						<Select
			                className="select"
				            style={{width:120}}
						    size={size}
						    placeholder="资源位"
						    onFocus={this.updatePosList.bind(this,'pos',delindex)}
						    value={details.pos}						    
						    onChange={this.editDateHandle.bind(this,'pos',delindex)}
						    >
						    {details.poslist.map(item=>(
                                <Option key={item.pos_name} value={item.pos_name}>{item.pos_name}</Option>
						    	))}
						</Select>
						<span className="date-content">
							<Input  placeholder='投放日期' size={size} 
							className='show-input' value={details.ad_date}
							onChange={()=>{}}
							onClick={this.onOpenChange.bind(this,delindex,true)}/>

							<DatePicker 
					          format="YYYY-MM-DD"
	                          style={{width: '180px'}}
					          showToday ={false}
					          size={size}
                              renderExtraFooter={this.showSelectTime.bind(this,delindex)}
					          className='detail-select-date'
					          disabledDate={this.disableDateHandle.bind(this,details.selectDateList)}
					          open={details.open}
					          onChange={this.onCongigDateChange.bind(this,delindex)}
					          onOpenChange={this.onOpenChange.bind(this,delindex,details.open)}
					          onOk = {this.onTimeOk.bind(this,delindex)}
						    />
					    </span>
					    <Input type='number' size={size}  placeholder='自然量' value={details.normal_download} 
					    onChange={this.editDateHandle.bind(this,'normal_download',delindex)}
					     style={{width: '100px',marginLeft:'10px'}}/>
					    <span className="icon-show">
                            <Icon type="minus-circle-o" onClick={this.deleteCol.bind(this,delindex)}/> 
	                        <Icon  type="plus-circle-o" onClick={this.addCol.bind(this,delindex)} />
	                     
                        </span>

				    </Card>

		           	))}
		          
			  
		        </Modal>

                <Modal
		          visible={detail_visible}
		          title={detai_name}
		          onCancel={this.handleDetailCancel}
		          confirmLoading={confirmLoading}
		          size="large"
		          wrapClassName="datail-date"
		          width={900}
		          height={700}
		          >
			            <div className="date-show">
				            <span className='datetime'>
								<DatePicker placeholder='开始日期' value={this.state.detail_start_time==''?null:moment(this.state.detail_start_time)}  onChange={this.detailsdateTimeChange.bind(this,'detail_start_time')} size={size}/>
								<span>~</span>
								<DatePicker placeholder='结束日期'   value={this.state.detail_end_time==''?null:moment(this.state.detail_end_time)} onChange={this.detailsdateTimeChange.bind(this,'detail_end_time')}  size={size}/>
							</span>
				        </div>
				        <Table 
			              rowKey={record => record.id}
			              columns={detailsColumns} 
			              dataSource={this.props.addatelist.addatelist}
			              pagination={false}>

			        </Table>
			        <Pagination 
	                   onChange={this.onDetailChange} 
	                   pageSize ={detail_pagesize}
	                   current={detail_currentpage}
	                   total={Number(this.props.addatelist.count)}>
			        </Pagination>
		        </Modal>
	        </div>
	    );
	  }
}

export default connect(mapStateToProps)(Form.create()(CustomerManage));
