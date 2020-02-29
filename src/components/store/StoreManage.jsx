import React, { Component } from "react";
import {
  Input,
  Table,
  Button,
  Icon,
  Modal,
  Form,
  Menu,
  Dropdown,
  Alert,
  Radio,
  DatePicker,
  Select
} from "antd";
import moment from "moment";
import { Api } from "../.././server/_ajax.js";
import { objToArray } from "../.././server/objtoArray";
import { apiList3 } from "../../server/apiMap.js";
import $ from "jquery";

const api = new Api();
const FormItem = Form.Item;
const dateFormat = "YYYY-MM-DD";
const { RangePicker } = DatePicker;
const reason = ["颜色不对", "有破损", "尺寸不对"];
const problemReason = ["有问题", "没问题", "无法发货"];
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 }
};
class StoreManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storeList: [],
      reason: "",
      loading: false,
      userId: "",
      modalTitle: "",
      addEditVisible: false,
      isAdd: false,
      reason_status: "",
      checked_status:"",
      noChoice: false,
      message: "",
      freight_number: "",
      order_number: "",
      abnormal_order: "",
      operationTypeDesc :"",
      storeOrders: [],
      columns: [],
      search: {
        startTime: null,
        endTime: null,
        objectiveCountry: null,
        carrier: null, 
        pageIndex: 1,
        pageSize: 10,
        problemCause: "",
        type: "allOrder"
      },
      checkFormData: {},
      checkVisible: false
    };
  }

  componentDidMount() {
    this.getOrders();
    this.setAllOrderColumn();
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
    if(search.carrier) {
      params.carrier = search.carrier;
    }
    if(search.objectiveCountry) {
      params.objectiveCountry = search.objectiveCountry;
    }
    if(search.problemCause) {
      params.problemCause = search.problemCause;
    }
    api.$get(apiList3.getStoreOrders.path, params, res => {
      if(res.code !== 500) {
        let list = objToArray(res) || [];
        console.log('接口获取');
        this.setState({
          storeOrders: [...list],
          totalCount: res.totalCount || 0,
          loading: false
        });
      } else {
        this.setState({
          storeOrders: [],
          totalCount: 0,
          loading: false
        });
      }
      
    })
  }

  setAllOrderColumn() {
    const columns = [
      {
        title: "发件人",
        dataIndex: "sendPerson",
        key: "sendPerson"
      },
      {
        title: "承运商",
        dataIndex: "carrier",
        key: "carrier"
      },
      {
        title: "目的国家",
        dataIndex: "objectiveCountry",
        key: "objectiveCountry"
      },
      {
        title: "订单状态",
        key: "goodsStatus",
        dataIndex: "goodsStatus",
        render: a => {
          const goodsStatusMap = new Map([["1", "用户已下单，等待仓库验货"], ["2", "正常件"], ["3", "已发货"], ["-1", "问题件"], ['-2', "退件"], ["-3", "销毁"], ["-4", "有问题但坚持发货"], ["-5", "无法发走等待用户答复"]]);
          return goodsStatusMap.get(a)
        }
      },
      {
        title: "订单时间",
        key: "orderTime",
        dataIndex: "orderTime",
        render: a=> moment(a).format("YYYY-MM-DD")
      },
    ];
    this.setState({
      columns
    });
  }

  setCkNoSendColumn() {//未发货的column
    const ckNoSendColumn = [
      {
        title: "运单号",
        dataIndex: "inlandNumber",
        key: "inlandNumber",
      },
      {
        title: "收货人",
        dataIndex: "receivePerson",
        key: "receivePerson"
      },
      {
        title: "货物照片",
        dataIndex: "goodsPhoto",
        key: "goodsPhoto",
        render: a => <img className="admin_action" src={a} alt="" style={{
          height: "100px",
          borderRadius: "4px",
        }}/>
      },
      {
        title: "customs",
        dataIndex: "customs",
        key: "customs"
      },
      {
        title: "操作",
        key: "action",
        width: 200,
        render: a => <div>
        <span
          style={{ cursor: "pointer", marginRight: "10px" }}
          onClick={() => {
            this.setState({
              checkVisible: true,
              checkFormData: {
                inlandNumber: a.inlandNumber,
              }
            })
          }}
        >
          检查
        </span>
        <span
          style={{ cursor: "pointer", marginRight: "10px" }}
          onClick={() => {
            this.setState({
              addEditVisible:true,
              operationTypeDesc: "发货",
              goodsStatus: "3",
              inlandNumber: a.inlandNumber,
              checkFormData: {
                inlandNumber: a.inlandNumber,
              }
            })
          }}
        >
          发货
        </span>
        <span
          style={{ cursor: "pointer", marginRight: "10px" }}
        >
          运单发货
        </span>
      </div>
      }
    ];
    this.setState({
      columns: ckNoSendColumn
    });
  }

  setCkAlreadySendColumn() {//已发货
    const ckAlreadySendColumn = [
      {
        title: "运单号",
        dataIndex: "inlandNumber",
        key: "inlandNumber"
      },
      {
        title: "承运商",
        dataIndex: "carrier",
        key: "carrier"
      },
      {
        title: "目的国家",
        dataIndex: "objectiveCountry",
        key: "objectiveCountry"
      },
      {
        title: "备注",
        key: "remark",
        dataIndex: "remark",
      },
      {
        title: "订单时间",
        key: "orderTime",
        dataIndex: "orderTime",
        render: a=> moment(a).format("YYYY-MM-DD")
      },
    ];
    this.setState({
      columns: ckAlreadySendColumn
    });
  }

  setCkProblemOrderColumn() {//问题件
    const ckProblemOrderColumn = [
      {
        title: "运单号",
        dataIndex: "inlandNumber",
        key: "inlandNumber",
      },
      {
        title: "目的国家",
        dataIndex: "objectiveCountry",
        key: "objectiveCountry"
      },
      {
        title: "备注",
        dataIndex: "remark",
        key: "remark",
      },
      {
        title: "订单时间",
        key: "orderTime",
        dataIndex: "orderTime",
        render: a=> moment(a).format("YYYY-MM-DD")
      },
      {
        title: "问题原因",
        dataIndex: "problemCause",
        key: "problemCause",
      }
    ];
    this.setState({
      columns: ckProblemOrderColumn
    });
  }

  setCkUserReplyOrderColumn() {//已回复
    const ckUserReplyOrderColumn = [
      {
        title: "运单号",
        dataIndex: "waybillNumber",
        key: "waybillNumber"
      },
      {
        title: "回复内容",
        dataIndex: "replyContent",
        key: "replyContent"
      }
    ];
    this.setState({columns: ckUserReplyOrderColumn});
  }

  setCkUserNoReplyOrderColumn() {//待回复
    const ckUserNoReplyOrderColumn = [
      {
        title: "运单号",
        dataIndex: "waybillNumber",
        key: "waybillNumber"
      },
      {
        title: "待回复内容",
        dataIndex: "replyContent",
        key: "replyContent"
      }
    ];
    this.setState({columns: ckUserNoReplyOrderColumn});
  }

  // 操作弹窗
  addEditModal() {
    const {
      modalTitle,
      addEditVisible,
      noChoice,
      operationTypeDesc,
    } = this.state;
    const menu = (
      <Menu
        onClick={e => {
          this.setState({ reason: e.key });
        }}
      >
        {reason.map((a, b) => {
          return <Menu.Item key={a}>{a}</Menu.Item>;
        })}
      </Menu>
    );
    return (
      <Modal
        title={modalTitle}
        wrapClassName="admin_modal column"
        width={"520px"}
        visible={addEditVisible}
        onCancel={this.clearForm.bind(this)}
        footer={
          <div className="action">
            <Button
              style={{ backgroundColor: "transparent" }}
              onClick={this.clearForm.bind(this)}
            >
              关闭
            </Button>
            {this.state.isLook ? null : (
              <Button
                className=" add_btn"
                onClick={this.handleModelOk.bind(this)}
              >
                确定
              </Button>
            )}
          </div>
        }
      >
        <div style={{textAlign: "center"}}>
          {operationTypeDesc === "发货" ? `确定已检查完，将运单号为:${this.state.inlandNumber}${operationTypeDesc}吗?` : "todo"}
        </div>
        {noChoice ? (
          <Alert
            message={this.state.message}
            type="error"
            closable
            showIcon={true}
            // onClose={onClose}
          />
        ) : null}
      </Modal>
    );
  }

  handleSubmitCheck() {
    const { checkFormData } = this.state;
    if (!checkFormData.problemTracking) {
      this.setState({
        noChoice: true,
        message: "您还没有选择是否有问题",
        checked_status: "error"
      });
      window.setTimeout(() => {
        this.setState({
          noChoice: false
        });
      }, 2000);
      return;
    }
    this.uploadOrder();
    
  }

  uploadOrder() {
    const problemTrackingMap = new Map([["有问题","1"],["没问题", "-1"], ["无法发货","2"]]);
    const { checkFormData } = this.state;
    let params = { 
      type: "ckOrderUpdate",
      inlandNumber: checkFormData.inlandNumber,
      problemTracking: problemTrackingMap.get(checkFormData.problemTracking)
    };
    if(checkFormData.logisticsName) {
      params.logisticsName = checkFormData.logisticsName;
    }
    if(checkFormData.goodsWeight) {
      params.goodsWeight = checkFormData.goodsWeight;
    }
    if(checkFormData.googdsLong) {
      params.googdsLong = checkFormData.googdsLong;
    }
    if(checkFormData.googdsWide) {
      params.googdsWide = checkFormData.googdsWide;
    }
    if(checkFormData.goodshigh) {
      params.goodshigh = checkFormData.goodshigh;
    }
    if(checkFormData.problemOrderImg) {
      params.problemOrderImg = checkFormData.problemOrderImg;
    }
    if(checkFormData.problemCause) {
      params.goodshigh = checkFormData.problemCause;
    }
    api.$get(apiList3.getStoreOrders.path, params, res => {
      this.setState({
        checkVisible: false
      })
    })
  }

  //仓库管理员检查
  checkModal() {
    const { checkFormData, noChoice, checked_status } = this.state;
    return  <Modal
    title="仓库员检查"
    wrapClassName="admin_modal column"
    width={"520px"}
    visible={this.state.checkVisible}
    onCancel={()=>{this.setState({checkVisible: false});}}
    footer={
      <div className="action">
        <Button
          style={{ backgroundColor: "transparent" }}
        >
          关闭
        </Button>
          <Button
            className=" add_btn"
            onClick={this.handleSubmitCheck.bind(this)}
          >
            确定
          </Button>
      </div>
    }
  >
    <FormItem {...formItemLayout} label={<span><i>*</i>运单号</span>}>
        <Input placeholder="运单号"
                className="input"
                disabled={true}
                onPressEnter={(e)=>this.focusNextInput(e)}
                value={checkFormData.inlandNumber}
        />
    </FormItem>
    <FormItem {...formItemLayout} label={<span>物流名称</span>}>
        <Input placeholder="物流名称"
                className="input"
                onPressEnter={(e)=>this.focusNextInput(e)}
                value={checkFormData.logisticsName}
                onChange={(e)=>{
                  this.setState({
                    checkFormData:{
                      ...checkFormData,
                      logisticsName: e.target.value
                    }
                  });
                }}
        />
    </FormItem>
    <FormItem
      {...formItemLayout}
      label={
        <span>
          <i>*</i>是否有问题
        </span>
      }
      validateStatus={checked_status}
    >
      <Select
            value={checkFormData.problemTracking || "选择问题原因"}
            style={{ width: 200 }}
            onChange={val => {
              this.setState({
                checkFormData: {
                  ...checkFormData,
                  problemTracking: val
                }
              })
            }}
          >
            {problemReason.map(a => {
              return (
                <Select.Option value={a} key={a}>
                  {a}
                </Select.Option>
              );
            })}
          </Select>
    </FormItem>
    {this.state.checkFormData.problemTracking === "有问题" ? <>
    <FormItem {...formItemLayout} label={<span>重量(kg)</span>}>
        <Input placeholder="重量"
                className="input"
                value={checkFormData.goodsWeight}
                onChange={(e)=>{
                  this.setState({
                    checkFormData: {
                      ...checkFormData,
                      goodsWeight: e.target.value
                    }
                  });
                }}
        />
    </FormItem>
    <FormItem {...formItemLayout} label={<span>长度（cm)</span>}>
        <Input placeholder="长度"
                className="input"
                value={checkFormData.googdsLong}
                onChange={(e)=>{
                  this.setState({
                    checkFormData: {
                      ...checkFormData,
                      googdsLong: e.target.value
                    }
                  });
                }}
        />
    </FormItem>
    <FormItem {...formItemLayout} label={<span>宽度（cm)</span>}>
        <Input placeholder="宽度"
                className="input"
                value={checkFormData.goodsWeight}
                onChange={(e)=>{
                  this.setState({
                    checkFormData: {
                      ...checkFormData,
                      goodsWeight: e.target.value
                    }
                  });
                }}
        />
    </FormItem>
    <FormItem {...formItemLayout} label={<span>高度（cm)</span>}>
        <Input placeholder="高度"
                className="input"
                onPressEnter={(e)=>this.focusNextInput(e)}
                value={checkFormData.goodshigh}
                onChange={(e)=>{
                  this.setState({
                    checkFormData: {
                      ...checkFormData,
                      goodsWeight: e.target.value
                    }
                  });
                }}
        />
    </FormItem>
    <FormItem
      {...formItemLayout}
      label={
        <span>
          问题原因
        </span>
      }
      // validateStatus={reason_status}
    >
      <Select
            value={"选择问题原因"}
            style={{ width: 200 }}
            onChange={val => {
            }}
          >
            {reason.map(a => {
              return (
                <Select.Option value={a} key={a}>
                  {a}
                </Select.Option>
              );
            })}
          </Select>
    </FormItem>
    </> : null}
    {noChoice ? (
          <Alert
            message={this.state.message}
            type="error"
            closable
            showIcon={true}
            // onClose={onClose}
          />
        ) : null}
  </Modal>
  }

  sendOrderModal() {
    
  }

  clearForm() {
    this.setState({
      addEditVisible: false,
    });
  }

  handleModelOk() {
    const { inlandNumber, userId, goodsStatus } = this.state;
    const params = {inlandNumber, userId, type: "ckOrderUpdate", goodsStatus};
    api.$get(apiList3.storeOperations.path, params , res => {
        this.setState({
          addEditVisible: false
        });
        this.getOrders();
    })
  }

  handleChangeRadio(e) {//radio改变获取数据
    const type = e.target.value
    if(type === "allOrder") {
      this.setAllOrderColumn();
    }
    if(type === "ckNoSend") {
      this.setCkNoSendColumn();
    }
    if(type === "ckAlreadySendOrder") {
      this.setCkAlreadySendColumn();
    }
    if(type === "ckProblemOrder") {

    }
    if(type === "ckUserReplyOrder") {

    }
    if(type === "ckUserNoReplyOrder") {

    }
    this.setState({
      search: {
        type,
        startTime: null,
        endTime: null,
        objectiveCountry: null,
        carrier: null, 
        pageIndex: 1,
        pageSize: 10,
        problemCause: "",
      }
    }, () => {
      this.getOrders()
    })
  }

  topBar() {
    const { search } = this.state
    return (
      <div className="search-title" style={{ minWidth: "1170px" }}>
        <div className="params params-20">
          运单类型：
          <Radio.Group onChange={this.handleChangeRadio.bind(this)} defaultValue={search.type} buttonStyle="solid">
            <Radio.Button value="allOrder">全部</Radio.Button>
            <Radio.Button value="ckNoSend">未发货</Radio.Button>
            <Radio.Button value="ckAlreadySendOrder">已发货</Radio.Button>
            <Radio.Button value="ckProblemOrder">问题件</Radio.Button>
            <Radio.Button value="ckUserReplyOrder">用户已回复</Radio.Button>
            <Radio.Button value="ckUserNoReplyOrder">用户待回复</Radio.Button>
          </Radio.Group>
        </div>
        <div className="params params-20">
          时间：
          <RangePicker
            value={[
              search.startTime ? moment(search.startTime, dateFormat) : null,
              search.endTime ? moment(search.endTime, dateFormat) : null
            ]}
            allowClear={false}
            format={dateFormat}
            onChange={(date, dateString) => {
              this.setState({
                search: {
                  ...search,
                  startTime: dateString[0],
                  endTime: dateString[1]
                }
              });
            }}
          />
        </div>
        <div className="params params-20" style={{ minWidth: "200px" }}>
          <span>运单号：</span>
          <Input
            placeholder="运单号"
            className="store_freight"
            value={search.inlandNumber}
            style={{ width: "200px" }}
            onPressEnter={e => {
              this.getCkNoSendOrderData();
            }}
            onChange={e => {
              this.setState({
                search: {
                  ...search,
                  inlandNumber: e.target.value
                } 
              });
            }}
          />
        </div>
        <div className="params params-20" style={{ minWidth: "170px" }}>
          <span>问题原因：</span>
          <Select
            value={search.problemCause || "选择问题原因"}
            style={{ width: 200 }}
            onChange={val => {
              this.setState(
                {
                  search: { ...search, problemCause: val }
                }
              );
            }}
          >
            {reason.map(a => {
              return (
                <Select.Option value={a} key={a}>
                  {a}
                </Select.Option>
              );
            })}
          </Select>
        </div>
        <div className="params" style={{ marginRight: "60px" }}>
          <Button
            className="search-btn"
            onClick={() => {
              this.getOrders();
            }}
          >
            查询
          </Button>
        </div>
      </div>
    );
  }

  handleStore() {
    const { userId, inlandNumber, goodsStatus } = this.state;
    console.log(userId, inlandNumber, goodsStatus);
  }

  getOrders() {
    this.setState({
      loading: true
    });
    setTimeout(() => {
      this.getColumn();
    }, 500);
  }

  render() {
    return (
      <div className="admin plat">
        <iframe
          src={require("./test2.pdf")}
          id="print"
          style={{ display: "none" }}
          title="123"
          frameBorder="0"
        />
        <div className="tableWarp">
          {this.topBar()}
          <Table
            columns={this.state.columns}
            dataSource={this.state.storeOrders}
            bordered
            loading={this.state.loading}
            pagination={false}
          />
        </div>
        {this.addEditModal()}
        {this.checkModal()}
      </div>
    );
  }
}

export default StoreManage;
