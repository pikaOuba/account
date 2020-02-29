import React, {Component} from 'react'
import {Input,Select,Table,Button,Modal,Form,Checkbox,Radio,Row, Alert,
    // Icon,Col,Tabs,  
} from 'antd';
// import {Api} from '../.././server/_ajax.js'
import edit_icon from '../../image/edit.svg'
import lock_icon from '../../image/lock.svg'
import user_icon from '../../image/juese.svg'
// const api = new Api();
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
// const CheckboxGroup = Checkbox.Group;
// const TabPane = Tabs.TabPane;
const formItemLayout = {
    labelCol: {span: 7},
    wrapperCol: {span: 14},
}
class AgentManage extends Component {

    constructor(props) {
        super(props)
        this.state= {
            page_num:1,
            page_size:20,
            total_size:"",
            platform_id : ' ',
            user_id:'',
            kw:'',
            userList:[],
            loading:false,
            locale:{
                emptyText:'没有相关数据'
            },
            addEditVisible:false,
            modalTitle:'用户新建',
            isAdd:true,
            formData:{
                user_id:'',
                username:'',
                username_status:'',
                name:'',
                name_status:'',
                phone:'',
                phone_status:'',
                platforms:[],
                status:true,
                isEdit:false,
            },
            columns:[],
            powerVisible:false,
            powerUserName:'',
            powerName:'',
            permission_ids:'',
            role_ids:'',
            platList:[],
            powerPlatShow:[],
            activeKey:'',
            resetVisible: false,
            old_passwd:'',
            old_passwd_status:'',
            new_passwd:'',
            new_passwd_status:'',
            new_passwd_confirm:'',
            new_passwd_confirm_status:'',
            noChoice:false,
            message:'',
            plat_id:'',
        }
    }

    componentDidMount(){
        this.getData()
        this.setColumn();
    }
    componentWillReceiveProps(){
       /*  api.$get(  '/api/account/platform_list/', null, (res) => {
            this.setState({
                platList: res,
            })
        }); */
    }
    setColumn(){
        const {formData} = this.state;
        const columns = [{
            title: '代理商名称',
            dataIndex: 'index',
            key: 'index',
        }, {
            title: '代理商意向用户数',
            key: 'action',
            render:(a)=>{
                return (
                    <div>
                        <img src={edit_icon} className="admin_action" alt=""
                             onClick={()=>{
                                 this.getUserDetail(a.user_id)
                             }}
                        />
                        <img src={user_icon} className="admin_action" alt=""
                            onClick={()=>{
                                let ids = [];
                                a.platforms.map(a=>{
                                    ids.push(a.platform_id+'')
                                })
                                this.setState({
                                    powerUserName:a.username,
                                    powerName:a.name,
                                    powerPlatShow:ids,
                                    activeKey:ids[0],
                                    powerVisible:true,
                                    user_id:a.user_id
                                })
                            }}
                        />
                        <img src={lock_icon} className="admin_action" alt=""
                             onClick={()=>{
                                 Modal.confirm({
                                     title:'提示',
                                     content:'确定重置密码？',
                                     okText:'确定',
                                     cancelText:'关闭',
                                     onOk:()=>{
                                         this.resetPasswd(a.user_id)
                                     }
                                 })
                             }}
                        />
                    </div>
                )
            }
        }, {
            title: '代理商佣金',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '代理商付款用户数',
            dataIndex: 'username',
            key: 'username',
        }, {
            title: '代理商未付款用户数',
            key: 'platforms',
            render:(a)=>{
                let ary = a.platforms,
                    str = '',
                    ary2= [];

                if(ary.length> 0 ){
                    ary.map((a)=>{
                        ary2.push(a.platform_name)
                    })
                }
                str = ary.length>0? ary2.join(','):''
                return str
            }
        }
        ];
        this.setState({
            columns
        })
    }

    getUserDetail(user_id){
        let {formData} = this.state;
        formData.isEdit = true;
        formData.user_id = user_id;

    }

    focusNextInput(e){
        var inputs = document.getElementsByClassName("input");

        for(var i = 0;i<inputs.length;i++){
            if(i==(inputs.length-1)){
                inputs[0].focus();
                break;
            }else if(e.target == inputs[i]){
                inputs[i+1].focus();
                break;
            }
        }
    }

    topBar() {
        return (
            <div className="search-title" style={{minWidth: '1170px'}}>
                {/*平台*/}
                <div className="params params-20" style={{minWidth: '97px'}}>
                    <span>平台：</span>
                    <Select value={this.state.platform_id + ''}
                            style={{width: '200px'}}
                            onChange={(val) => {
                                this.setState({
                                    platform_id: val
                                },()=>{this.getData()})
                            }}>
                        {this.state.platList.map(a=>{
                            return (
                                <Option value={a.platform_id+''} key={a.platform_id+''}>{a.platform_name}</Option>
                            )
                        })}
                        <Option value=" ">全部</Option>
                    </Select>
                </div>
                {/*关键字*/}
                <div className="params params-20" style={{minWidth: '170px'}}>
                    <span>关键字：</span>
                    <Input
                        placeholder="姓名、账号、手机号"
                        value={this.state.kw}
                        style={{width:'200px'}}
                        onChange={(e)=>{
                            this.setState({
                                kw:e.target.value
                            },()=>{
                                this.getData();
                            })
                        }}
                    />
                </div>

                {/*查询和清空*/}
                <div className="params" style={{marginRight: '60px'}}>
                    <Button className="search-btn"
                            onClick={() => {
                                this.getData()
                            }}
                    >查询</Button>
                    <Button
                        style={{
                            maxWidth: '60px',
                            backgroundcolor: '#fff',
                            borderColor: '#d9d9d9',
                            color: '#222',
                            marginLeft: '12px'
                        }}
                        onClick={() => {
                           this.setState({
                               kw:'',
                               platform_id:' '
                           },()=>this.getData())
                        }}
                    >清空</Button>
                </div>
            </div>
        )
    }

    getData(){
        /* this.setState({
            loading:true,
            locale:{
                emptyText:'没有相关数据'
            }
        }) */
        const {platform_id,kw,page_size,page_num} = this.state;
        let obj = {page_size,page_num};
        if (platform_id !=' '){
            obj.platform_id = platform_id
        }
        if (kw){
            obj.kw = kw;
        }
      /*  api.$get('/api/account/platform_list/', null, (res) => {
            res.map((a, b) => {
                a.index = b + 1;
                a.key = b + 1;
            })
            this.setState({
                platList: res,
            })
        }) */
    }
    // 编辑和添加
    addEditModal(){
        const {modalTitle,addEditVisible,formData} = this.state;

        return (
            <Modal
                title={modalTitle}
                wrapClassName="admin_modal column"
                width={'520px'}
                visible={addEditVisible}
                onCancel={this.handleModelCancel.bind(this)}
                footer={<div className="action">
                    <Button style={{backgroundColor:'transparent'}} onClick={this.handleModelCancel.bind(this)}>关闭</Button>
                    <Button className=" add_btn"  onClick={this.handleModelOk.bind(this)}>保存</Button>
                </div>}>
                <FormItem {...formItemLayout} label={<span><i>*</i>账号</span>} validateStatus={formData.username_status}>
                    <Input placeholder="请输入手机号码"
                           disabled={formData.isEdit}
                           className="input"
                           onPressEnter={(e)=>this.focusNextInput(e)}
                           value={formData.username}
                           onChange={(e)=>{
                              formData.username = e.target.value;
                              formData.phone = e.target.value;
                              this.setState({
                                  formData
                              })
                           }}
                    />
                </FormItem>
                <FormItem {...formItemLayout} label={<span><i>*</i>姓名</span>} validateStatus={formData.name_status}>
                    <Input placeholder="请输入姓名"
                           className="input"
                           onPressEnter={(e)=>this.focusNextInput(e)}
                           value={formData.name}
                           onChange={(e)=>{
                               formData.name = e.target.value;
                               this.setState({
                                   formData
                               })
                           }}
                    />
                </FormItem>
                <FormItem {...formItemLayout} label={<span><i>*</i>手机号</span>} validateStatus={formData.phone_status}>
                    <Input placeholder="请输入正确手机号"
                           className="input"
                           onPressEnter={(e)=>this.focusNextInput(e)}
                           value={formData.phone}
                           onChange={(e)=>{
                               formData.phone = e.target.value;
                               this.setState({
                                   formData
                               })
                           }}
                    />
                </FormItem>
                <FormItem {...formItemLayout} label={<span><i>*</i>平台</span>}>
                    <Row>
                        {
                            this.state.platList.map((a, b) => {
                                return (
                                        <Checkbox
                                            key={b+''}
                                            style={{marginRight:'30px'}}
                                            value={a.platform_id + ''}
                                            checked={a.checked}
                                            onChange={(e)=>{
                                                if(e.target.checked){
                                                    formData.platforms.push(a.platform_id+'')
                                                }else{
                                                    formData.platforms = formData.platforms.filter(c=>{
                                                        return c != a.platform_id+''
                                                    })
                                                }
                                                this.setState({
                                                    formData
                                                },()=>{
                                                    let {platList} = this.state;
                                                    platList.map((d)=>{
                                                        d.checked = false;
                                                        this.state.formData.platforms.map(b=>{
                                                            if(d.platform_id+'' == b){
                                                                d.checked = true;
                                                            }
                                                        })
                                                    })
                                                    this.setState({
                                                        platList
                                                    })
                                                })
                                            }}
                                        >
                                            {a.platform_name}
                                        </Checkbox>
                                )
                            })
                        }
                    </Row>
                </FormItem>
                <FormItem {...formItemLayout} label="启用状态">
                    <RadioGroup
                        onChange={(e)=>{
                            formData.status = e.target.value;
                            this.setState({
                                formData
                            })
                        }}
                        value={formData.status}>
                        <Radio value={true}>正常</Radio>
                        <Radio value={false}>停用</Radio>
                    </RadioGroup>
                </FormItem>
                {this.state.noChoice?(
                    <Alert
                        message={this.state.message}
                        type="error"
                        closable
                        showIcon={true}
                        // onClose={onClose}
                    />
                ):null}
            </Modal>
        )
    }
    handleModelCancel(){
        this.clearCreateForm();
        this.setState({
            addEditVisible: false,
        })
    }
    clearCreateForm(){
        let {formData,platList} = this.state;
        formData.user_id = '';
        formData.username = '';
        formData.username_status = '';
        formData.name = '';
        formData.name_status = '';
        formData.phone = '';
        formData.phone_status = '';
        formData.status = true;
        formData.isEdit = false;
        formData.platforms = [];
        this.setState({
            formData
        },()=>{
            platList.map((a)=>{
                a.checked = false;
                this.state.formData.platforms.map(b=>{
                    if(a.platform_id+'' == b){
                        a.checked = true;
                    }
                })
            })
            this.setState({
                platList
            })
        })
    }
    handleModelOk(){
        const {isAdd,formData} = this.state;
        if(!formData.username){
            this.setState({
                noChoice:true,
                message:'您还没有输入账号！',
                platform_name_status:'error'
            })
            window.setTimeout(()=>{
                this.setState({
                    noChoice:false,
                })
            },5000)
            return
        }
        if(!formData.name){
            this.setState({
                noChoice:true,
                message:'您还没有输入姓名！',
                platform_name_status:'error'
            })
            window.setTimeout(()=>{
                this.setState({
                    noChoice:false,
                })
            },5000)
            return
        }
        if(!formData.phone){
            this.setState({
                noChoice:true,
                message:'您还没有输入手机号！',
                platform_name_status:'error'
            })
            window.setTimeout(()=>{
                this.setState({
                    noChoice:false,
                })
            },5000)
            return
        }
        if(formData.platforms.length<=0){
            this.setState({
                noChoice:true,
                message:'您还没有选择平台！',
                platform_name_status:'error'
            })
            window.setTimeout(()=>{
                this.setState({
                    noChoice:false,
                })
            },5000)
            return
        }
        if (isAdd){
            /*创建新用户*/
            
        }else{
            let {username,name,phone,status,platforms,user_id} = formData;
            let platform_ids = platforms.join(',');
            status = status?1:0
           
        }
    }

    powerModal(){
        return (
            <Modal
                title="用户角色权限"
                wrapClassName="admin_power_modal column"
                width={'940px'}
                visible={this.state.powerVisible}
                onCancel={()=> {
                    this.setState({
                        powerVisible: false
                    })
                }}
                footer={<div className="action">
                    <Button style={{backgroundColor:'transparent'}} onClick={()=> {
                        this.setState({
                            powerVisible: false
                        })
                    }}>关闭</Button>
                    {/*<Button className=" add_btn"  onClick={this.handlePowerModelOk.bind(this)}>保存</Button>*/}
                </div>}
            >
                <div className="user_msg">
                    <span className="modal_title">基本信息</span>
                    <p style={{marginTop:'10px'}}>
                        <span style={{marginRight:'20px'}}>用户账号：{this.state.powerUserName}</span>
                        <span>用户姓名：{this.state.powerName}</span>
                    </p>
                </div>
                <div className="power_set">
                    <span className="modal_title">角色权限设置</span>
                   
                </div>
            </Modal>
        )
    }

    resetPasswd(user_id){
/*         api.$post( '/api/account/reset_password/',{user_id},res=>{
            if(!res.errmsg){
                Modal.success({
                    title:'提示',
                    content:"重置密码成功！"
                })
            }
        }) */
    }
    render() {
        return (
            <div className="admin">
                
                {this.topBar()}
                <div className="tableWarp">
                    <Table
                        columns={this.state.columns}
                        dataSource={this.state.userList}
                        bordered
                        loading={this.state.loading}
                        locale = {this.state.locale}
                        pagination={{
                            current:this.state.page_num,
                            pageSize:this.state.page_size,
                            showQuickJumper:true,
                            showSizeChanger:true,
                            onChange:(page)=>{
                                this.setState({
                                    page_num:page,
                                },()=>{this.getData()})
                            },
                            onShowSizeChange:(current,size)=>{
                                this.setState({
                                    page_size:size,
                                },()=>{this.getData()})
                            },
                            total:this.state.total_size
                        }}
                    />
                </div>
                {this.addEditModal()}
                {this.powerModal()}
            </div>
        )
    }

}

export default AgentManage
