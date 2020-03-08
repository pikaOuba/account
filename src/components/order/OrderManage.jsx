import React, { Component } from "react";
import {
  Input,
  Button,
  Modal,
  Table,
  Select,
  Form,
  Alert,
  message
} from "antd";
// 引入编辑器样式
import { Api } from "../../server/_ajax";
import { apiList3 } from "../../server/apiMap";
import moment from "moment";
import _ from 'lodash'
import OrderSearchBar from "../OrderSearchBar";
const api = new Api();
const {Option} = Select;
const { Item } = Form;

const trackingSignMap = [
  {
    label: '全部',
    value: null
  },
  {
    label: '已完成',
    value: '1'
  },{
    label: '未完成',
    value: '2'
  },{
    label: '进行中',
    value: '3'
  }
]

const checkTypeMap = [
  {
    label: '全部',
    value: '1'
  },
  {
    label: '用户和运管',
    value: '2'
  },{
    label: '用户和仓管',
    value: '3'
  },{
    label: '运管和仓管',
    value: '4'
  }
]

const replyPersonMap = [
  {
    label: '用户',
    value: '1'
  },{
    label: '仓库',
    value: '2'
  }
]

const itemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 }
};
class OrderManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      totalCount: 0,
      pageIndex: 1,
      pageSize: 10,
      locale: {
        emptyText: "没有相关数据"
      },
      allOrderList:[],
      record: {},
      addTagModalVisible: false,        // 运单管理员运单标记
      addReplyModalVisible: false,      // 运单管理员运单回复
      addSeereplyModalVisible: false,   // 运单管理员回复查看
      search: {
        startTime: null,
        endTime: null,
        objectiveCountry: null,
        carrier: null, 
        pageIndex: 1,
        pageSize: 10,
        problemCause: "",
        trackingSign: "",
        fhStatus: "",
        hasProblem: "",
        userReply:"",
        placeName: "",
        type: "allOrder"
      },
      columns:[],
      noChoice: false,
      message: '',
      checked_status: 'error',
      formData: {
        // 运单管理员运单标记
        inlandNumber: '', // 运单号
        trackingSign: '',   // 其他操作

        // 运单管理员回复查看
        waybillNumber: '', // 运单号
        checkType: '', // 查看类型

        // 运单管理员运单回复
        replyContent: '',  //  回复内容
        remark: '',  // 备注
        replyPerson: '', // 用户 1/仓库  2
      }

  }
  }
  componentDidMount = () => {
    this.handleSearch();
  };

  setAllOrderColumn() {
    const columns = [
      {
        title: "运单号",
        dataIndex: "inlandNumber",
        key: "inlandNumber"
      },
      {
        title: "货物照片",
        dataIndex: "goodsPhoto",
        key: "goodsPhoto",
        render: a => <img className="admin_action" src={a} alt="" style={{
          minHeight: "100px",
          borderRadius: "4px",
          height: "100px",
        }}/>
      },
      {
        title: "问题照片",
        dataIndex: "problemOrderImg",
        key: "problemOrderImg",
        render: a => <img className="admin_action" src={a} alt="" style={{
          minHeight: "40px",
          height: "40px",
          borderRadius: "4px",
        }}/>
      },
      {
        title: "发货的物流商",
        dataIndex: "placeName",
        key: "placeName",
        render: a=> {
          const placeNameMap = new Map([["4px","4PX"],["dhl","DHL"],["sf","顺丰"],["zh","纵横"]]);
          return placeNameMap.get(a);
        }
      },
      {
        title: "发货人",
        dataIndex: "sendPerson",
        key: "sendPerson"
      },
      {
        title: "承运商",
        dataIndex: "carrier",
        key: "carrier"
      },
      {
        title: "目的国",
        dataIndex: "objectiveCountry",
        key: "objectiveCountry"
      },
      {
        title: "货物状态",
        key: "goodsStatus",
        dataIndex: "goodsStatus",
        render: a => {
          const goodsStatusMap = new Map([["1", "用户已下单，等待仓库验货"], ["2", "正常件"], ["3", "已发货"], ["-1", "问题件"], ['-2', "退件"], ["-3", "销毁"], ["-4", "有问题但坚持发货"], ["-5", "无法发走等待用户答复"]]);
          return goodsStatusMap.get(a)
        }
      },
      {
        title: "下单时间",
        key: "orderTime",
        dataIndex: "orderTime",
        render: a=> moment(a).format("YYYY-MM-DD")
      },
      {
        title: "回复内容",
        key: "replyContents",
        dataIndex: "replyContents",
      },
    ];
    this.setState({
      columns
    });
  }

  setCkNoSendColumn() {//未发货的column
    let ckNoSendColumn = [...this.state.columns];
    ckNoSendColumn.push({
      title: "操作",
      key: "action",
      width: 150,
      render: a => {
        return (
          <div>
            <span
              style={{ cursor: "pointer", marginRight: "10px" }}
              onClick={() => {
                this.setState({
                  addSeereplyModalVisible: true,
                  record: a,
                  formData: {
                    waybillNumber: a.inlandNumber
                  }
                });
              }}
            >
              回复查看
            </span>
            <span
              style={{ cursor: "pointer", marginRight: "10px" }}
              onClick={() => {
                this.setState({
                  addTagModalVisible: true,
                  record: a
                });
              }}
            >
              标记
            </span>
          </div>
        );
      }
    });
    this.setState({
      columns: ckNoSendColumn
    });
  }

  setCkProblemOrderColumn() {
    let ckProblemOrderColumn = [...this.state.columns];
    ckProblemOrderColumn.push({
      title: "操作",
      key: "action",
      width: 150,
      render: a => {
        return (
          <div>
            <span
              style={{ cursor: "pointer", marginRight: "10px" }}
              onClick={() => {
                this.setState({
                  addReplyModalVisible: true,
                  record: a,
                  formData: {
                    waybillNumber: a.inlandNumber
                  }
                });
              }}
            >
              运单回复
            </span>
          </div>
        );
      }
    });
    this.setState({
      columns: ckProblemOrderColumn
    });
  }

  setReplyContentsColumn() {
    let replyContentsColumn = [...this.state.columns];
    replyContentsColumn.push({
      title: "回复内容",
      key: "replyContents",
      dataIndex: "replyContents"
    });
    this.setState({
      columns: replyContentsColumn
    });
  }

  handleTableChange = pagination => {
    const { current: pageIndex, pageSize } = pagination
    this.setState({
      pageIndex,
      pageSize
    },() => {
      this.handleSearch()
    })
  }

  // 运单类型切换
  handleChangeRadio(e) {
    // todo
    const type = e.target.value
    const {allOrderListSearch} = this.state
    this.setState({
      ...this.state,
      allOrderListSearch: {...allOrderListSearch, type }
    }, () => {
      this.handleSearch()
    })
  }

  handleSelectChange(keyName, value) {
    console.log(keyName, value);
    const { allOrderListSearch } = this.state;
    this.setState({
      ...this.state,
      allOrderListSearch: {...allOrderListSearch, [keyName]: value}
    }, ()=> {
      this.handleSearch()
    })

  }


  focusNextInput(e, keyName) {
    let {formData} = this.state
    // console.log(e, keyName);
    this.setState({
      formData: {
        ...formData,
        [keyName]: e.target.value
      } 
    });
  }

  closeModal() {
    this.setState({
      addTagModalVisible: false,
      addReplyModalVisible: false,
      addSeereplyModalVisible: false,
      record: {}
    })
  }

  handleSubmit(params) {
    params.type = "orderAdminReply";
    api.$get(apiList3.getOrders.path, params, res => {
      if(res.code === 200) {
        message.success('操作成功！');
        this.handleSearch()
      } else {
        message.error('操作失败！');
      }
    })
  }

  handleSubmitCheck(type) {
    const { formData: {
      trackingSign,   // 其他操作

      // 运单管理员回复查看
      waybillNumber, // 运单号
      checkType, // 查看类型

      // 运单管理员运单回复
      replyContent,  //  回复内容
      remark,  // 备注
      replyPerson, // 用户 1/仓库  2

    }, record } = this.state;
    let message = '';
    let data = {};
    if (type === 'addTag') {
      if (!trackingSign) {
        message = '请输入其他操作'
      }
    }
    if (type === 'addSeereply') {
      if (!waybillNumber) {
        message = '请输入运单号'
      }
      if (!checkType) {
        message = '请输入查看类型'
      }
    }
    if (type === 'addReply') {
      if (!waybillNumber) {
        message = '请输入运单号'
      }
    }
    if (message) {
      this.setState({
        noChoice: true,
        message,
        checked_status: 'error'
      });
      window.setTimeout(() => {
        this.setState({
          noChoice: false
        });
      }, 2000);
      return;
    }
    
    if (type === 'addTag') {
      data = {
        type: 'markorder',
        inlandNumber: record.inlandNumber,
        trackingSign
      };
    }
    if (type === 'addSeereply') {
      data = {
        type: 'replyCheck',
        waybillNumber,
        checkType
      };
    }
    if (type === 'addReply') {
      data = {
        waybillNumber,
        replyContent,
        remark,
        replyPerson
      };
    }
    this.handleSubmit(data);
    this.closeModal()
  }

  handleModalChange(keyName, value) {
    const { formData } = this.state
    this.setState({
      formData: {
        ...formData,
        [keyName]: value
      }
    })
  }

  handleChangeSearchSelect(val, paramName) {
    const { search } = this.state;
    this.setState({
      search: { 
        ...search,
      [paramName]: val,
      pageIndex: 1,
      pageSize: 10 
      }
    });
  }

  handleClearSearchBar() {
    this.setState({
      search: {
        startTime: null,
        endTime: null,
        objectiveCountry: null,
        carrier: null, 
        pageIndex: 1,
        pageSize: 10,
        problemCause: "",
        trackingSign: "",
        fhStatus: "",
        hasProblem: "",
        userReply:"",
        placeName: "",
        type: "ckAllOrder"
      }
    }, () => {
      this.getOrders();
    })
  }

  getOrders() {
    this.setState({
      loading: true
    });
    setTimeout(() => {
      this.getColumn();
    }, 500);
  }

  getColumn() {
    const { search } = this.state;
    let params = { 
      pageSize: search.pageSize,
      pageIndex: search.pageIndex,
      type: search.type,
    };
    if(search.endTime) {
      params.endTime = search.endTime;
    }
    if(search.startTime) {
      params.startTime = search.startTime;
    }
    if(search.trackingSign) {//运单状态
      const trackingSignMap = new Map([["已完成","1"],["未完成","2"],["进行中","3"]]);
      params.trackingSign = trackingSignMap.get(search.trackingSign);
    }
    if(search.objectiveCountry) {//目的国
      params.objectiveCountry = search.objectiveCountry;
    }
    if(search.carrier) {//承运商
      params.carrier = search.carrier;
    }
    
    if(search.problemCause) {//问题原因
      const problemCauseMap = new Map([["颜色不对","1"],["尺寸不对","2"],["破损","3"]]);
      params.problemCause = problemCauseMap.get(search.problemCause);
    }
    if(search.inlandNumber) {
      params.inlandNumber = search.inlandNumber;
    }
    if(search.fhStatus) {//发货状态
      const fhStatusMap = new Map([["已发货","1"],["未发货","-1"]]);
      params.fhStatus = fhStatusMap.get(search.fhStatus);
    }
    if(search.hasProblem) {
      const hasProblemsMap = new Map([["有问题","1"],["没有问题","-1"]]);
      params.hasProblem = hasProblemsMap.get(search.hasProblem);
    }

    if(search.userReply) {
      const userReplyMap = new Map([["已回复","1"], ["待回复","-1"]]);
      params.userReply = userReplyMap.get(search.userReply);
    }

    if(search.placeName) {
      params.placeName = search.placeName;
    }

    api.$get(apiList3.getOrders.path, params, res => {
      if(res.code !== 500) {
        let list = res.data || [];
        this.setState({
          allOrderList: [...list],
          totalCount: res.count || 0,
          loading: false
        });
      } else {
        this.setState({
          allOrderList: [],
          totalCount: 0,
          loading: false
        });
      }
      
    }, null, true)
  }

  handleChangeDatePicker(data, dateString) {
    const { search } = this.state
    this.setState({
      search: {
        ...search,
        startTime: dateString[0],
        endTime: dateString[1]
      }
    });
  }

  get isUnableOrder() {
    const { search } = this.state;
    return search.fhStatus === "未发货";
  }

  get isAbleOrder() {
    const { search } = this.state;
    return search.fhStatus === "已发货";
  }

  get isProblem() {
    const { search } = this.state;
    return search.hasProblem === "有问题";
  }

  handleSearch() {
    this.setAllOrderColumn();
    this.setState({
      search: {
        ...this.state.search,
        pageSize: 10,
        dataIndex: 1
      }
    }, ()=> {
      if (this.isUnableOrder) {//未发货
        this.setCkNoSendColumn();
      }
      if(this.isProblem) {//问题件
        this.setCkProblemOrderColumn();
      }
      this.getOrders();
    });
  }

  render() {
    const {
      addTagModalVisible,
      addReplyModalVisible,
      addSeereplyModalVisible,
      record,
      checked_status,
      noChoice,
      message,
      formData: {
        waybillNumber, // 运单号
        replyContent,  //  回复内容
        remark,  // 备注
      }
    } = this.state;
    return (
      <div className="content" style={{ paddingBottom: "30px" }}>
        <div className="tableWarp">
            <OrderSearchBar
              handleChangeSearch={this.handleChangeSearchSelect.bind(this)}
              handleClearSearchBar={this.handleClearSearchBar.bind(this)}
              handleChangeDatePicker={this.handleChangeDatePicker.bind(this)}
              handleSearch={this.handleSearch.bind(this)}
              search={this.state.search}
            />
            <Table
              columns={this.state.columns}
              dataSource={this.state.allOrderList}
              rowKey={id => _.uniqueId('prefix-')}
              bordered
              loading={this.state.loading}
              locale={this.state.locale}
              pagination={{
                current: this.state.pageIndex,
                pageSize: this.state.pageSize,
                showQuickJumper: true,
                showSizeChanger: true,
                total: this.state.totalCount,
                showTotal: () =>`共${this.state.totalCount}条`
              }}
              onChange={this.handleTableChange}
            />
            { addTagModalVisible ? 
              <Modal
                title="运单管理员运单标记"
                wrapClassName="admin_modal column"
                width={"520px"}
                visible={true}
                onCancel={this.closeModal.bind(this)}
                footer={
                  <div className="action">
                    <Button
                      style={{ backgroundColor: "transparent" }}
                      onClick={this.closeModal.bind(this)}>
                      关闭
                    </Button>
                    <Button
                      className=" add_btn"
                      onClick={
                        this.handleSubmitCheck.bind(this, 'addTag')
                      }>
                      确定
                    </Button>
                  </div>
                }
              >
                <>
                  <Item {...itemLayout} label={<span><i>*</i>运单号</span>}>
                    <Input placeholder="运单号"
                      className="input"
                      disabled={true}
                      value={record.inlandNumber}
                    />
                  </Item>
                  <Item {...itemLayout}
                    label={
                      <span>
                        <i>*</i>其他操作
                      </span>
                    }
                    validateStatus={checked_status}
                  >
                    <Select defaultValue={''} style={{ width: 120 }} 
                    onChange={this.handleModalChange.bind(this, 'trackingSign')}>
                    { trackingSignMap.filter(({label}) => label!=='全部').map(
                      ({label, value}) => <Option key={value} value={value}>{label}</Option>
                    )}
                    </Select>
                  </Item>
                </>
                { noChoice ? (
                    <Alert
                      message={message}
                      type="error"
                      closable
                      showIcon={true}
                    />
                ) : null}
              </Modal> : null}

            { addReplyModalVisible ? 
                <Modal
                  title="运单管理员运单回复"
                  wrapClassName="admin_modal column"
                  width={"520px"}
                  visible={true}
                  onCancel={this.closeModal.bind(this)}
                  footer={
                    <div className="action">
                      <Button
                        style={{ backgroundColor: "transparent" }}
                        onClick={this.closeModal.bind(this)}
                      >
                        关闭
                      </Button>
                      <Button
                        className=" add_btn"
                        onClick={
                          this.handleSubmitCheck.bind(this, 'addReply')
                        }>
                        确定
                      </Button>
                    </div>
                  }
                >
                  <>
                    <Item {...itemLayout} label={<span><i>*</i>运单号</span>}>
                      <Input placeholder="运单号"
                        className="input"
                        disabled={true}
                        onChange={(e)=>this.focusNextInput(e, 'waybillNumber')}
                        value={waybillNumber}
                      />
                    </Item>
                    <Item {...itemLayout} label="回复内容">
                      <Input placeholder="回复内容"
                        className="input"
                        onChange={(e)=>this.focusNextInput(e, 'replyContent')}
                        value={replyContent}
                      />
                    </Item>
                    <Item {...itemLayout} label="备注">
                      <Input placeholder="备注"
                        className="input"
                        onChange={(e)=>this.focusNextInput(e, 'remark')}
                        value={remark}
                      />
                    </Item>
                    <Item {...itemLayout}
                      label="用户/仓库"
                      // validateStatus={checked_status}
                    >
                      <Select defaultValue={''} style={{ width: 120 }} 
                      onChange={this.handleModalChange.bind(this, 'replyPerson')}>
                      { replyPersonMap.filter(({label}) => label!=='全部').map(
                        ({label, value}) => <Option key={value} value={value}>{label}</Option>
                      )}
                      </Select>
                    </Item>
                  </>
                  { noChoice ? (
                    <Alert
                      message={message}
                      type="error"
                      closable
                      showIcon={true}
                    />
                ) : null}
                </Modal> : null }

            { addSeereplyModalVisible ? 
              <Modal
                title="运单管理员回复查看"
                wrapClassName="admin_modal column"
                width={"520px"}
                visible={true}
                onCancel={this.closeModal.bind(this)}
                footer={
                  <div className="action">
                    <Button
                      style={{ backgroundColor: "transparent" }}
                      onClick={this.closeModal.bind(this)}
                    >
                      关闭
                    </Button>
                    <Button
                      className=" add_btn"
                      onClick={
                        this.handleSubmitCheck.bind(this, 'addSeereply')
                      }>
                      确定
                    </Button>
                  </div>
                }
              >
                <>
                  <Item {...itemLayout} label={<span><i>*</i>运单号</span>}>
                    <Input placeholder="运单号"
                      className="input"
                      disabled={true}
                      onChange={(e)=>this.focusNextInput(e, 'waybillNumber')}
                      value={waybillNumber}
                    />
                  </Item>
                  <Item {...itemLayout}
                    label={
                      <span>
                        <i>*</i>查看类型
                      </span>
                    }
                    validateStatus={checked_status}
                  >
                    <Select defaultValue={''} style={{ width: 120 }} 
                    onChange={this.handleModalChange.bind(this, 'checkType')}>
                    { checkTypeMap.filter(({label}) => label!=='全部').map(
                      ({label, value}) => <Option key={value} value={value}>{label}</Option>
                    )}
                    </Select>
                  </Item>
                </>
                { noChoice ? (
                    <Alert
                      message={message}
                      type="error"
                      closable
                      showIcon={true}
                    />
                ) : null}
              </Modal> : null }
              
        </div>
      </div>
    );
  }
}

export default OrderManage;
