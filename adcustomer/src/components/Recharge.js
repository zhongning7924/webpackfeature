import React from 'react';
import { RouteWithSubRoutes } from 'common/components/baseroute.js'
import { Collapse,Button,Input,AutoComplete,
	    Select,DatePicker, Cascader,Table,
	    Pagination,Modal,Form,InputNumber} from 'antd'
const InputGroup = Input.Group
const Panel = Collapse.Panel;
const Option = Select.Option;
const FormItem = Form.Item;
import { connect } from 'react-redux';
import Urls from 'constants/urls';
import Request from 'common/utils/request.js';
import { rechargeListAction }  from 'actions/customerInfoAction.js'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const mapStateToProps  = (state)=>({
	rechargelist: state.app.rechargelist.rechargelist,
	count: state.app.rechargelist.count
})
import 'styles/customermanage.css'

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
		
			modalstate:{
                title: '充值',
                visible: false,
                confirmLoading: false,
                money:'',
			},
			rechargeModal:{
				recharge_visible: false,
				recharge_title: '充值记录',
			},
			rechargeDetailList:[]

		}
		this.onChange = this.onChange.bind(this)
		this.onShowSizeChange = this.onShowSizeChange.bind(this)
		this.onSelectChange = this.onSelectChange.bind(this)
		this.handleCancel = this.handleCancel.bind(this)
		this.addRecharge = this.addRecharge.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount(){
    	this.getCustomerList();
    }
    handleChange(value){
        this.setState({
        	status: value
        })
    }
    onSelectChange(selectedRowKeys){
    	console.log(selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    onChange(pageNumber) {
	   this.setState({
	   	   currentpage: pageNumber
	   },this.getCustomerList)
	}
	onShowSizeChange(currentpage,pageSize){
		this.setState({
			currentpage: currentpage,
			pageSize: pageSize
		},this.getCustomerList)

	}

	searchChange(name,event){
		let obj={};
		obj[name] = event.target.value
		this.setState(obj)

	}
	exportRec(type){
		let  obj ={};
		obj.export = 1
        if(type!='all'){
        	if(this.state.selectedRowKeys==0){
        		Modal.error({
                    title: '请选择要导出的项目！',
                })
                return;
        	} 
            obj.user_id = this.state.selectedRowKeys.join(',')

        }
       Request(this.props.dispatch).download(Urls.getRechargeList,obj)
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
           this.props.dispatch(rechargeListAction(data.list,Number(data.count)))
       })
    }
    addRecharge(type,obj){

        let modalstate = Object.assign({},this.state.modalstate)
        modalstate.visible = true;
        let form = this.props.form;
        let keys = Object.keys(form.getFieldsValue());
        keys.push('id');
   	    keys.map(key=>{
            let value = {};
      
            if(key=='date'){
            	value[key] = obj[key]; 
                form.setFieldsValue({date: moment()})

            }else{
               value[key] = obj[key]
               form.setFieldsValue(value)
            }
   	    	
   	    });
        this.setState({modalstate})
    }
   
    handleCancel(){
       let modalstate = Object.assign({},this.state.modalstate)
       modalstate.visible = false;
       this.setState({modalstate})
    }
    dateTimeChange(name,date,datestring){
    	// let value = date('YYYY-MM-DD');
        let obj = {[name]: datestring};
        this.setState(obj)
   
    }
    handleSubmit(e){
    	e.preventDefault();
	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	      	let obj = {};
	      	obj.money = values.money;
	      	obj.user_id = obj.user_id;
	      	obj.date = values.date && values.date.format('YYYY-MM-DD')
	      	let modalstate =Object.assign({},this.state.modalstate);
	      	modalstate.confirmLoading = true;
	      	let id = this.props.form.getFieldValue('id')
            if(id && id.length>0){
               obj.user_id  = id;

            }
            this.setState({
            	modalstate
            })
	        Request(this.props.dispatch).post(Urls.rechargeMoney,obj).done(data=>{
	        	modalstate.visible = false;
	        	modalstate.confirmLoading = false
	        	this.props.form.resetFields()
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
    modalRechargeCancel(){
    	let rechargeModal = this.state.rechargeModal;
        rechargeModal.recharge_visible = false;
        this.setState({
        	rechargeModal
        })
    }
    //充值详情列表
    showRechargeList(record){
        let rechargeModal = this.state.rechargeModal;
        rechargeModal.recharge_visible = true;
        this.setState({
        	rechargeModal
        },()=>{
        	let obj ={};
        	obj.user_id = record.id;
        	obj.page = 1,
        	obj.page_size = 9999
        	Request(this.props.dispatch).post(Urls.getRechargeList,obj).done(data=>{
        		data.list.map(item=>{
        			item.recharge_date = moment(item.recharge_date*1000).format('YYYY-MM-DD')
        		})
        		this.setState({
        		    rechargeDetailList: data.list
        		})
        	})
        })
    }
    render() {
    	let {rechargelist,count} = this.props;
        const columns = [{
	 
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
			      <a onClick={this.addRecharge.bind(this,'edit',record)}>充值</a>
			   
			    </span>)
			},{
			  title: '充值记录',
			  render: (text,record,index)=>(
			  	<span>
			      <a  onClick={this.showRechargeList.bind(this,record)}>查看</a>
			    </span>)
			}
		];
		const rechargeDetaiColumns = [{title: '充值日期',
			  dataIndex: 'recharge_date'},{title: '充值金额',
			  dataIndex: 'money'},{title: '账户余额',
			  dataIndex: 'balance'}]
	    const {rechargeDetailList, loading, selectedRowKeys,name,user_num,packagename,size } = this.state;
	    const rowSelection = {
	      selectedRowKeys,
	      onChange: this.onSelectChange,
	    }
	    const {title,visible,confirmLoading,data } = this.state.modalstate
	    const {recharge_visible,recharge_title} = this.state.rechargeModal
	    const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
	      labelCol: {
	        xs: { span: 12 },
	        sm: { span: 8 },
	      },
	      wrapperCol: {
	        xs: { span: 12 },
	        sm: { span: 8 },
	      },
	    };
	    const statusList =[{name: '正常',value:'1'},{name: '停用',value:'2'}]

	    return (
	        <div className="re-mange common-content">
	            <Collapse defaultActiveKey='1'>
		            <Panel header="充值管理" key={1} >
		                <div className="button-group">
				            <Button onClick={this.exportRec.bind(this,'all')} type="primary" icon="export" size={size}>导出全部</Button>
				            <Button onClick={this.exportRec.bind(this,'sel')}type="primary" icon="export" size={size}>导出所选</Button>
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
							    onChange={this.handleChange}
							    >
							    {statusList.map(item=>(
                                    <Option key={item.value} value={item.value}>{item.name}</Option>
							    	))}
							
						    </Select>
		                    <Button onClick={this.getCustomerList.bind(this)} type="primary"  icon="search" size={size}>搜索</Button>
				        </div>
				         

				    </Panel>
			    </Collapse>

			    <div className="table-info">
			       <Table rowSelection={rowSelection} 
			              rowKey={record => record.id}
			              columns={columns} 
			              dataSource={rechargelist}
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
				              充值日期
				            </span>
				           )}
				          hasFeedback
				          >
				          {getFieldDecorator('date', {
				          	
				            rules: [{ type:'object', required: true, message: '充值日期必填', whitespace: true }],
				          })(
				            <DatePicker  showToday />

				          )}
				        </FormItem>
				        <FormItem
			              {...formItemLayout}
				          label={(
				            <span>
				              充值金额
				            </span>
				           )}
				          hasFeedback
				          >
				          {getFieldDecorator('money', {

				            rules: [{required: true, message: '充值金额必须为数字'}],
				          })(
				            <InputNumber style={{width:159}}/>
				          )}
				        </FormItem>
				    </Form>    
		        </Modal>

			    <Modal
		          visible={recharge_visible}
		          onCancel={this.modalRechargeCancel.bind(this)}
		          title={recharge_title}
		          size="large"
		          className="recharge-detail"

		          width={800}
		          >
			        <Table 
			            rowKey={record => record.id}
			            columns={rechargeDetaiColumns} 
			            dataSource={rechargeDetailList}
			            pagination={false}>

			        </Table>
		        </Modal>
      
	        </div>
	    );
	  }
}

export default connect(mapStateToProps)(Form.create()(CustomerManage));
