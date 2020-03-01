import React, { Component } from "react";
import {
  Input,
  Button,
  Modal,
  Table,
  DatePicker,
  Radio,
  Select,
  Form,
  Alert
} from "antd";
// 引入编辑器样式
import { Api } from "../../server/_ajax";
import { apiList3 } from "../../server/apiMap";
import { objToArray } from "../.././server/objtoArray";
import moment from "moment";
import _ from 'lodash'
const api = new Api();
const dateFormat = "YYYY-MM-DD";
const { RangePicker } = DatePicker;
const {Option} = Select;
const { Item } = Form;

const ALL_ORDER = 'allOrder';
const DELIVER_ORDER = 'deliverOrder';
const HAS_PROBLEM_ORDER = 'hasProblemOrder';
const UNABLE_SEND_ORDER = 'unableSendOrder';


const orderType = [
  {
    v: ALL_ORDER,
    t: '全部'
  },
  {
    v: DELIVER_ORDER,
    t: '已发货'
  },
  {
    v: HAS_PROBLEM_ORDER,
    t: '问题运单'
  },
  {
    v: UNABLE_SEND_ORDER,
    t: '无法发走运单'
  }
];

const trackingStateMap = [
  {
    label: '全部',
    value: null
  },
  {
    label: '已发货',
    value: '1'
  },{
    label: '未发货',
    value: '-1'
  }
];

const problemCauseMap = [
  {
    label: '全部',
    value: null
  },
  {
    label: '颜色不对',
    value: '1'
  },{
    label: '尺寸不对',
    value: '2'
  },{
    label: '破损',
    value: '3'
  }
]

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

const goodsStatusMap = new Map([
  ["1", "用户已下单，等待仓库验货"], 
  ["2", "正常件"], 
  ["3", "已发货"], 
  ["-1", "问题件"], 
  ['-2', "退件"], 
  ["-3", "销毁"], 
  ["-4", "有问题但坚持发货"], 
  ["-5", "无法发走等待用户答复"]
]);



const column = [
  {
    title: "用户ID",
    dataIndex: "userId",
    key: "userId",
  },
  {
    title: "运单号",
    dataIndex: "inlandNumber",
    key: "inlandNumber",
  },
  {
    title: "货物状态",
    dataIndex: "goodsStatus",
    key: "goodsStatus",
    render: a => {
      return goodsStatusMap.get(a)
    }
  },
  {
    title: "目的国家",
    dataIndex: "objectiveCountry",
    key: "objectiveCountry"
  },
  {
    title: "承运商",
    dataIndex: "carrier",
    key: "carrier",
  },
  {
    title: "发货人",
    dataIndex: "sendPerson",
    key: "sendPerson",
  },
  {
    title: "订单时间",
    key: "orderTime",
    dataIndex: "orderTime",
    render: a=> moment(a).format("YYYY-MM-DD")
  },
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
      allOrderListSearch: {
        inlandNumber: null, // 运单号
        startTime: null,
        endTime: null,
        objectiveCountry: null,
        carrier: null,
        TrackingState: null, // 发货状态
        problemCause: null,  // 问题原因
        trackingSign: null,  // 运单状态
        type: ALL_ORDER
      },
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
        userId: '',  // 运单管理员id
        replyContent: '',  //  回复内容
        remark: '',  // 备注
        replyPerson: '', // 用户 1/仓库  2
      }

  }
  }
  componentDidMount = () => {
    this.handleSearch();
  };

  setColumn() {
    let columns = [...column]
    const { allOrderListSearch: {type} } = this.state;
    if ( type === HAS_PROBLEM_ORDER ) {
      columns.push({
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
                    addTagModalVisible: true,
                    record: a
                  });
                }}
              >
                标记
              </span>
              <span
                style={{ cursor: "pointer", marginRight: "10px" }}
                onClick={() => {
                  this.setState({
                    addReplyModalVisible: true,
                    record: a
                  });
                }}
              >
                运单回复
              </span>
            </div>
          );
        }
      })
    }
    if ( type === UNABLE_SEND_ORDER ) {
      columns.push({
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
                    record: a
                  });
                }}
              >
                回复查看
              </span>
            </div>
          );
        }
      })
    }
    this.setState({
      columns
    });
  }

  getAllOrderColumn() {
    const { pageSize, pageIndex, allOrderListSearch = {} } = this.state;
    const {
      type, startTime, 
      endTime, carrier, objectiveCountry, 
      TrackingState,  problemCause, trackingSign
    } = allOrderListSearch

    let params = { 
      pageSize,
      pageIndex,
      type
    };
    if(endTime) {
      params.endTime = endTime;
    }
    if(startTime) {
      params.startTime = startTime;
    }
    if(carrier) {
      params.carrier = carrier;
    }
    if(objectiveCountry) {
      params.objectiveCountry = objectiveCountry;
    }
    if (type === HAS_PROBLEM_ORDER) {
      params.TrackingState = TrackingState;
      params.problemCause = problemCause;
    }
    if (type === UNABLE_SEND_ORDER) {
      params.trackingSign = trackingSign;
    }
    api.$get(apiList3.getOrders.path, params, res => {
      this.setColumn();
      if(res.code !== 500) {
        let list = objToArray(res) || [];
        this.setState({
          allOrderList: [...list],
          totalCount: res.totalCount || 0,
          loading: false
        });
      } else {
        this.setState({
          allOrderList: [],
          totalCount:  0,
          loading: false
        });
      }
    })
  }

  handleSearch() {
    this.setState({
      loading: true
    });
    setTimeout(() => {
      this.getAllOrderColumn()
    }, 500);
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
    console.log(e, keyName);
    this.setState({
      formData: {
        ...formData,
        [keyName]: e.target.value
      } 
    });
  }
  allOrderSearchBar() {//全部订单筛选条件
    const { allOrderListSearch } = this.state;
    let { 
      type, objectiveCountry, carrier, startTime, endTime, 
      inlandNumber, TrackingState, problemCause, trackingSign
    } = allOrderListSearch;
    return (
      <div className="search-title" style={{ minWidth: "1170px" }}>
        <div className="params params-20">
          运单类型：
          <Radio.Group onChange={this.handleChangeRadio.bind(this)} defaultValue={type} buttonStyle='solid'>
              { orderType.map(({v, t}) => <Radio.Button key={v} value={v}>{t}</Radio.Button>)}
          </Radio.Group>
        </div>
        <div className="params params-20" style={{ minWidth: "170px" }}>
          <span>目的国家：</span>
          <Input
            placeholder="请输入目的国家"
            className="store_freight"
            value={objectiveCountry}
            style={{ width: "130px" }}
            onPressEnter={e => {
              this.handleSearch();
            }}
            onChange={e => {
              this.setState({
                allOrderListSearch: {
                  ...allOrderListSearch,
                  objectiveCountry: e.target.value
                } 
              });
            }}
          />
        </div>
        <div className="params params-20" style={{ minWidth: "170px" }}>
          <span>承运商：</span>
          <Input
            placeholder="请输入承运商"
            className="store_freight"
            value={carrier}
            style={{ width: "130px" }}
            onPressEnter={e => {
              this.handleSearch();
            }}
            onChange={e => {
              this.setState({
                allOrderListSearch: {
                  ...allOrderListSearch,
                  carrier: e.target.value
                }
              });
            }}
          />
        </div>
        <div className="params params-20">
          选择时间：
          <RangePicker
            value={[
              startTime ? moment(startTime, dateFormat) : null,
              endTime ? moment(endTime, dateFormat) : null
            ]}
            format={dateFormat}
            onChange={(date, dateString) => {
              this.setState({
                allOrderListSearch: {
                  ...allOrderListSearch,
                  startTime: dateString[0],
                  endTime: dateString[1]
                }
              });
            }}
          />
        </div>
        
        { (type === DELIVER_ORDER || type === HAS_PROBLEM_ORDER || type === UNABLE_SEND_ORDER) ? 
        <div className="params params-20" style={{ minWidth: "170px" }}>
          <span>运单号：</span>
          <Input
            placeholder="运单号"
            className="store_freight"
            value={inlandNumber}
            style={{ width: "130px" }}
            onPressEnter={e => {
              this.handleSearch();
            }}
            onChange={e => {
              this.setState({
                allOrderListSearch: {
                  ...allOrderListSearch,
                  inlandNumber: e.target.value
                } 
              });
            }}
          />
        </div> : null }
        
        { type === HAS_PROBLEM_ORDER ? 
        <div className="params params-20" style={{ minWidth: "170px" }}>
          <span>发货状态：</span>
          <Select defaultValue={TrackingState} style={{ width: 120 }} onChange={this.handleSelectChange.bind(this, 'trackingState')}>
          { trackingStateMap.map(({label, value}) => <Option key={value} value={value}>{label}</Option>)}
          </Select>
        </div> : null }

        { type === HAS_PROBLEM_ORDER ? 
        <div className="params params-20" style={{ minWidth: "170px" }}>
          <span>问题原因：</span>
          <Select defaultValue={problemCause} style={{ width: 120 }} onChange={this.handleSelectChange.bind(this, 'problemCause')}>
          { problemCauseMap.map(({label, value}) => <Option key={value} value={value}>{label}</Option>)}
          </Select>
        </div> : null }

        { type === UNABLE_SEND_ORDER ? 
        <div className="params params-20" style={{ minWidth: "170px" }}>
          <span>运单状态：</span>
          <Select defaultValue={trackingSign} style={{ width: 120 }} onChange={this.handleSelectChange.bind(this, 'trackingSign')}>
          { trackingSignMap.map(({label, value}) => <Option key={value} value={value}>{label}</Option>)}
          </Select>
        </div> : null }

        {/*查询和清空*/}
        <div className="params" style={{ marginRight: "60px" }}>
          <Button
            className="search-btn"
            onClick={() => {
              this.setState(
                {
                  pageIndex: 1,
                  pageSize: this.state.pageSize,
                },
                () => {
                  this.handleSearch();
                })
            }}
          >
            查询
          </Button>
          <Button
            style={{
              maxWidth: "60px",
              backgroundcolor: "#fff",
              borderColor: "#d9d9d9",
              color: "#222",
              marginLeft: "12px"
            }}
            onClick={() => {
              const {allOrderListSearch: {type}} = this.state
              this.setState(
                {
                  pageIndex: 1,
                  pageSize: 10,
                  allOrderListSearch: {
                    inlandNumber: null, // 运单号
                    startTime: null,
                    endTime: null,
                    objectiveCountry: null,
                    carrier: null,
                    TrackingState: null, // 发货状态
                    problemCause: null,  // 问题原因
                    trackingSign: null,  // 运单状态
                    type
                  }
                },
                () => {
                  this.handleSearch();
                }
              );
            }}
          >
             清空
          </Button>
        </div>
      </div>
    );
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
    api.$get(apiList3.getOrders.path, params, res => {
      this.setColumn();
      if(res.code !== 500) {
        let list = objToArray(res) || [];
        this.setState({
          allOrderList: [...list],
          totalCount: res.totalCount || 0,
          loading: false
        });
      } else {
        this.setState({
          allOrderList: [],
          totalCount:  0,
          loading: false
        });
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
      userId,  // 运单管理员id
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
      if (!userId) {
        message = '请输入运单管理员id'
      }
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
        userId,
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
        userId,  // 运单管理员id
        replyContent,  //  回复内容
        remark,  // 备注
      }
    } = this.state;
    return (
      <div className="content" style={{ paddingBottom: "30px" }}>
        <div className="tableWarp">
            {this.allOrderSearchBar()}
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
                total: this.state.totalCount
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
                    <Item {...itemLayout} label={<span><i>*</i>运单管理员id</span>}>
                      <Input placeholder="运单管理员id"
                        className="input"
                        onChange={(e)=>this.focusNextInput(e, 'userId')}
                        value={userId}
                      />
                    </Item>
                    <Item {...itemLayout} label={<span><i>*</i>运单号</span>}>
                      <Input placeholder="运单号"
                        className="input"
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
                      validateStatus={checked_status}
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
