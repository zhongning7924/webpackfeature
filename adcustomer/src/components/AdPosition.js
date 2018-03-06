import React from 'react';
import { RouteWithSubRoutes } from 'common/components/baseroute.js'
import { Collapse,Button,Input,AutoComplete,
	    Select,DatePicker, Cascader,Table,
	    Pagination,Modal,Form} from 'antd'
const InputGroup = Input.Group
const Panel = Collapse.Panel;
const Option = Select.Option;
const FormItem = Form.Item;
import { connect } from 'react-redux';
import Urls from 'constants/urls';
import Request from 'common/utils/request.js';
import { adPositionAction }  from 'actions/customerInfoAction.js'
const mapStateToProps  = (state)=>({
	adpositionlist: state.app.adpositionlist.adpositionlist,
	count: state.app.adpositionlist.count
})


class AdPosition extends React.Component {
	constructor(props) {
	    super(props);
		this.state={
			size: 'large',
		    pos_page: '',
		    pos_page_inner: '',
		    pos: '',
		    start_time: '',
		    end_time: '',
			currentpage:1,
			pageSize: 10,
		
			
			modalstate:{
                title: '添加',
                visible: false,
                confirmLoading: false,
			}

		}
		this.onChange = this.onChange.bind(this)
		this.onShowSizeChange = this.onShowSizeChange.bind(this)
		this.handleCancel = this.handleCancel.bind(this)
		this.addAdposition = this.addAdposition.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount(){
    	this.getAdPositionList();
    }
    handleChange(value){
        this.setState({
        	status: value
        })
    }
 
    onChange(pageNumber) {
	   this.setState({
	   	   currentpage: pageNumber
	   },this.getAdPositionList)
	}
	onShowSizeChange(currentpage,pageSize){
		this.setState({
			currentpage: currentpage,
			pageSize: pageSize
		},this.getAdPositionList)

	}

	searchChange(name,event){
		let obj={};
		obj[name] = event.target.value
		this.setState(obj)

	}
	dateTimeChange(name,date,datestring){
    	let obj = {[name]: datestring};
        this.setState(obj)
    }
    getAdPositionList(){
       let obj={};
       let {pos_page,pos_page_inner,pos,currentpage,pageSize} = this.state;
	
       obj.pos_page = pos_page;
       obj.pos_page_inner = pos_page_inner;
       obj.pos = pos;
       obj.page = currentpage;
       obj.page_size = pageSize;
       obj.start_time = this.state.start_time;
       obj.end_time = this.state.end_time;
       for(let key in obj){
       	  if(obj[key]==''){
       	  	delete obj[key]
       	  }
       }
       Request(this.props.dispatch).post(Urls.getadPositionList,obj).done(data=>{
           this.props.dispatch(adPositionAction(data.list,Number(data.count)))
       })
    }
    addAdposition(type,obj){

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
	        Request(this.props.dispatch).post(Urls.addPosition,obj).done(data=>{
	        	modalstate.visible = false;
	        	modalstate.confirmLoading = false
	        	this.setState({modalstate},this.getAdPositionList)


	        }).fail(()=>{
	        	modalstate.confirmLoading = false
	        	this.setState({
                    modalstate
	        	})
	        })
	      }
	    });

    }
    render() {
    	let {adpositionlist,count} = this.props;
	    const  columns = [{
	 
			  title: '页面',
			  dataIndex: 'pos_page',
			}, {
			  title: '页面内位置',
			  dataIndex: 'pos_page_inner',
			}, {
			  title: '资源位',
			  dataIndex: 'pos',
			},{
			  title: '操作',
			  render: (text,record,index)=>(
			  	<span>
			      <a onClick={this.addAdposition.bind(this,'edit',record)}>编辑</a>
			    </span>)
			}
		];
	    const { pos, pos_page_inner,pos_page,packagename,size } = this.state;

	    const {title,visible,confirmLoading,data } = this.state.modalstate
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

	    return (
	        <div className="ad-mange common-content">
	            <Collapse defaultActiveKey='1'>
		            <Panel header="资源位管理" key={1}>
		                <div className="button-group">
					        <Button onClick={this.addAdposition} type="primary" icon="user-add" size={size}>添加</Button>
				          
			            </div>
			            <div className='form-group'>
				            <Input onChange={this.searchChange.bind(this,'pos_page')} value={pos_page} placeholder="页面" size={size} />
				            <Input onChange={this.searchChange.bind(this,'pos_page_inner')} value={pos_page_inner} placeholder="页面内位置" size={size}/>
				            <Input onChange={this.searchChange.bind(this,'pos')} value={pos} placeholder="资源位" size={size} />
		                      
		                    <span className='datetime'>
								<DatePicker placeholder='开始日期' onChange={this.dateTimeChange.bind(this,'start_time')}size={size} />
								<span>~</span>
								<DatePicker placeholder='结束日期' onChange={this.dateTimeChange.bind(this,'end_time')} size={size}/>
							</span>
		                    <Button onClick={this.getAdPositionList.bind(this)} type="primary"  icon="search" size={size}>搜索</Button>
				        </div>
				         

				    </Panel>
			    </Collapse>

			    <div className="table-info">
			       <Table 
			              rowKey={record => record.id}
			              columns={columns} 
			              dataSource={adpositionlist}
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
				              页面
				            </span>
				           )}
				          hasFeedback
				          >
				          {getFieldDecorator('pos_page', {
				            rules: [{ required: true, message: '页面必填', whitespace: true }],
				          })(
				            <Input />
				          )}
				        </FormItem>
				        <FormItem
			              {...formItemLayout}
				          label={(
				            <span>
				              页面内位置
				            </span>
				           )}
				          hasFeedback
				          >
				          {getFieldDecorator('pos_page_inner', {
				            rules: [{ required: true, message: '页面内位置必填', whitespace: true }],
				          })(
				            <Input />
				          )}
				        </FormItem>
				        <FormItem
			              {...formItemLayout}
				          label={(
				            <span>
				              资源位
				            </span>
				           )}
				          hasFeedback
				          >
				          {getFieldDecorator('pos', {
				            rules: [{ required: true, message: '资源位必填', whitespace: true }],
				          })(
				            <Input />
				          )}
				        </FormItem>

				    </Form> 

			         
		        </Modal>


	       



	        </div>
	    );
	  }
}

export default connect(mapStateToProps)(Form.create()(AdPosition));
