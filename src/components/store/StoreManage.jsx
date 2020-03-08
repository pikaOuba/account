import React, { Component } from "react";
import {
  Input,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  DatePicker,
  Select,
  Upload,
  message,
} from "antd";
import moment from "moment";
import $ from "jquery";
import { Api } from "../.././server/_ajax.js";
import { objToArray } from "../.././server/objtoArray";
import { apiList3, apiList4, uploadServerPath } from "../../server/apiMap.js";
import OrderSearchBar from "../OrderSearchBar.js";
import ReactToPrint from "react-to-print";
var atob = require('atob');
window.atob = atob;
const api = new Api();
const FormItem = Form.Item;
const reason = ["颜色不对", "尺寸不对", "破损"];
const problemReason = ["有问题", "没问题", "无法发货"];
const checkTypes = ["全部","用户和运管","用户和仓管", "运管和仓管"];
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 }
};

const replyColumns = [
  {
    title: "时间",
    dataIndex: "replyTime",
    key: "replyTime"
  },
  {
    title: "回复内容",
    dataIndex: "replyContent",
    key: "replyContent"
  },
  {
    title: "备注",
    dataIndex: "remark",
    key: "remark"
  }
];

class StoreManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        trackingSign: "",
        fhStatus: "",
        hasProblem: "",
        userReply:"",
        placeName: "",
        type: "ckAllOrder"
      },
      checkFormData: {},
      ckReplyFormData: {},
      checkVisible: false,
      ckSendOrderVisible: false,
      ckReplyVisible:false,
      ckSendOrderFormData: {//运单发货
      },
      checkType: "",//仓库查看选择的类型
      ckReplys: [],
      printFormData: {//打印订单
      },
      printVisible: false,
      printImage: ""
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
      params.userReplyMap = userReplyMap.get(search.userReply);
    }

    if(search.placeName) {
      params.placeName = search.placeName;
    }

    api.$get(apiList3.getOrders.path, params, res => {
      if(res.code !== 500) {
        let list = res.data || [];
        this.setState({
          storeOrders: [...list],
          totalCount: res.count || 0,
          loading: false
        });
      } else {
        this.setState({
          storeOrders: [],
          totalCount: 0,
          loading: false
        });
      }
      
    }, null, true)
  }

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
    </div>
    });
    this.setState({
      columns: ckNoSendColumn
    });
  }

  handlePrint(a) {
    let params = { data: a.inlandNumber};
    message.loading();
    if(a.placeName === "zh") {
      return api.$post('/order_getImg', params, res => {
        if(res.length === 1){
          message.destroy();
          return window.open(res[0].lable_file);
        }
      });
    }
    if(a.placeName === "sf") {
      return api.$post('/order_sfLabelApi', params, res => {
        if(res) {
          message.destroy();
          return setTimeout(()=>{
            window.open(res);
          })
        }
      });
    }
    if(a.placeName === "4px") {
      api.$post('/order_imgApi', params, res => {
        if(res.label_url_info.logistics_label) {
          message.destroy();
          return window.open(res.label_url_info.logistics_label);
        }
      });
    }
    if(a.placeName === "dhl") {
      return api.$post('/order_getLabel', params, res => {
        if(res.labelResponse && res.labelResponse.bd.labels[0].content) {
          let str = `data:image/jpeg;base64, ${res.labelResponse.bd.labels[0].content}`;
          setTimeout(()=>{
            message.destroy();
            this.setState({
              printVisible: true,
              printImage: str
            })
          }, 1000);
        } else {
          message.destroy();
          message.error(res, 2)
        }
      });
    }
  }

  setCkAlreadySendColumn() {//已发货
    let ckAlreadySendColumn = [...this.state.columns];
    ckAlreadySendColumn.push({ 
      title: "操作",
      key: "action",
      width: 200,
      render: a => <div>
        <span
        style={{ cursor: "pointer", marginRight: "10px" }}
        onClick={()=> {
          this.setState({
            ckSendOrderVisible: true,
            ckSendOrderFormData: {
              inlandNumber: a.inlandNumber,
              objectiveCountry: a.objectiveCountry
            }
          })
        }}
      >
        运单发货
      </span>
      {a.inlandNumber ? <span
        style={{ cursor: "pointer", marginRight: "10px" }}
        onClick={this.handlePrint.bind(this, a)}

        // onClick={() => {
        //   $("#print")[0].contentWindow.print();
        // }}
      >
        打印面单
      </span> : null}
      
    </div>
    });
    this.setState({
      columns: ckAlreadySendColumn
    });
  }

  setCkProblemOrderColumn() {//问题件
    let ckProblemOrderColumn = [...this.state.columns];
    ckProblemOrderColumn.push({ 
      title: "操作",
      key: "action",
      width: 200,
      render: a => <div>
        <span
        style={{ cursor: "pointer", marginRight: "10px" }}
        onClick={()=>{
          this.setState({
            ckReplyVisible: true,
            inlandNumber: a.inlandNumber,
            ckReplyFormData: {
              ...this.state.ckReplyFormData,
              inlandNumber: a.inlandNumber,
            }
          });
        }}
      >
        仓库回复
      </span>
      <span
        style={{ cursor: "pointer", marginRight: "10px" }}
        onClick={()=>{
          this.setState({
            inlandNumber: a.inlandNumber,
            ckReplyCheckVisible: true,
          }, ()=> {
            this.getReplys();
          })
        }}
      >
        查看
      </span>
    </div>
    });
    this.setState({
      columns: ckProblemOrderColumn
    });
  }

  setCkUserReplyOrderColumn() {//已回复
    let ckUserReplyOrderColumn = [...this.state.columns];
    ckUserReplyOrderColumn.push({
      title: "操作",
      key: "action",
      width: 200,
      render: a => <div>
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
        onClick={() => {
          this.setState({
            addEditVisible:true,
            operationTypeDesc: "销毁",
            goodsStatus: "-3",
            inlandNumber: a.inlandNumber,
            checkFormData: {
              inlandNumber: a.inlandNumber,
            }
          })
        }}
      >
        销毁
      </span>
      <span
        style={{ cursor: "pointer", marginRight: "10px" }}
        onClick={() => {
          this.setState({
            addEditVisible:true,
            operationTypeDesc: "退件",
            goodsStatus: "-2",
            inlandNumber: a.inlandNumber,
            checkFormData: {
              inlandNumber: a.inlandNumber,
            }
          })
        }}
      >
        退件
      </span>
      </div>
    });
    this.setState({columns: ckUserReplyOrderColumn});
  }

  setCkUserNoReplyOrderColumn() {//待回复
    const ckUserNoReplyOrderColumn = [
      {
        title: "运单号",
        dataIndex: "inlandNumber",
        key: "inlandNumber"
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
          {
          operationTypeDesc === "发货" ? `确定已检查完，将运单号为:${this.state.inlandNumber}${operationTypeDesc}吗?` :
           `确定将运单号为:${this.state.inlandNumber}${operationTypeDesc}吗?`}
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
    const problemCauseMap = new Map([["颜色不对","1"],["尺寸不对", "2"], ["破损","3"]]);
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
      params.problemCause = problemCauseMap.get(checkFormData.problemCause);
    }
    api.$get(apiList3.getOrders.path, params, res => {
      if(res.code === 200 && res.msg === "success") {
        this.setState({
          checkVisible: false
        });
        this.getOrders();
        message.success("提交成功",2);
      }else {
        message.error(res.msg, 2);
      }
    })
  }

  handleCloseCheckModal() {
    this.setState({
      checkVisible: false,
      checkFormData: {}
    });
  }

  //仓库管理员检查
  checkModal() {
    const { checkFormData, noChoice, checked_status } = this.state;
    return <Modal
      title="仓库员检查"
      wrapClassName="admin_modal column"
      width={"520px"}
      visible={this.state.checkVisible}
      onCancel={this.handleCloseCheckModal.bind(this)}
      footer={
        <div className="action">
          <Button
            style={{ backgroundColor: "transparent" }}
            onClick={this.handleCloseCheckModal.bind(this)}
          >
            关闭
          </Button>
          <Button
            className=" add_btn"
            onClick={this.handleSubmitCheck.bind(this)}>
            确定
          </Button>
        </div>
      }>
      <FormItem {...formItemLayout} label={<span><i>*</i>运单号</span>}>
        <Input
          placeholder="运单号"
          className="input"
          disabled={true}
          value={checkFormData.inlandNumber}
        />
      </FormItem>
      <FormItem {...formItemLayout} label={<span>物流名称</span>}>
        <Input 
          placeholder="物流名称"
          className="input"
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
        validateStatus={checked_status}>
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
          }}>
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
            }}/>
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
          }}/>
      </FormItem>
      <FormItem {...formItemLayout} label={<span>宽度（cm)</span>}>
        <Input placeholder="宽度"
          className="input"
          value={checkFormData.googdsWide}
          onChange={(e)=>{
            this.setState({
              checkFormData: {
                ...checkFormData,
                googdsWide: e.target.value
              }
            });
          }}/>
      </FormItem>
      <FormItem {...formItemLayout} label={<span>高度（cm)</span>}>
        <Input placeholder="高度"
          className="input"
          value={checkFormData.goodshigh}
          onChange={(e)=>{
            this.setState({
              checkFormData: {
                ...checkFormData,
                goodshigh: e.target.value
              }
            });
          }}/>
      </FormItem>
      <FormItem
        {...formItemLayout}
        // validateStatus={reason_status}
        label={
          <span>
            问题原因
          </span>
        }>
        <Select
          value={checkFormData.problemCause || "选择问题原因"}
          style={{ width: 200 }}
          onChange={val => {
            this.setState({
              checkFormData: {
                ...checkFormData,
                problemCause: val
              }
            })
          }}>
          {reason.map(a => {
            return (
              <Select.Option value={a} key={a}>
                {a}
              </Select.Option>
            );
          })}
        </Select>
      </FormItem>
      <FormItem
        {...formItemLayout}
        // validateStatus={reason_status}
        label={
          <span>
            问题图片
          </span>
        }>
        <ProblemImage onChange={this.onChange.bind(this)} imageUrl={this.state.checkFormData.imageUrl}/>
      </FormItem>
      
      </> : null}
      {noChoice ? <Alert
            message={this.state.message}
            type="error"
            closable
            // onClose={onClose}
            showIcon={true}/> : null
      }
    </Modal>
  }

  handleCloseSendOrderModal() {
    this.setState({
      ckSendOrderVisible: false,
      ckSendOrderFormData: {}
    });
  }

  sendOrderModal() {//运单发货
    const { ckSendOrderFormData, noChoice } = this.state;
    return  <Modal
      title="运单发货"
      wrapClassName="admin_modal column"
      width={"520px"}
      visible={this.state.ckSendOrderVisible}
      onCancel={this.handleCloseSendOrderModal.bind(this)}
      footer={
        <div className="action">
          <Button
            style={{ backgroundColor: "transparent" }}
            onClick={this.handleCloseSendOrderModal.bind(this)}
          >
            关闭
          </Button>
            <Button
              className=" add_btn"
              onClick={this.handleSendOrderSubmit.bind(this)}
            >
              提交
            </Button>
        </div>
      }>
      <FormItem {...formItemLayout} label={<span><i>*</i>运单号</span>}>
        <Input placeholder="运单号"
          className="input"
          disabled={true}
          value={ckSendOrderFormData.inlandNumber}
        />
      </FormItem>
      <FormItem {...formItemLayout} label={<span>目的国</span>}>
        <Input placeholder="目的国"
          className="input"
          disabled={true}
          value={ckSendOrderFormData.objectiveCountry}/>
      </FormItem>
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

  handleCloseCkReplyModal() {
    this.setState({
      ckReplyFormData: {},
      ckReplyVisible: false,
    });
  }

  handleCloseCkReplyCheckModal() {
    this.setState({
      ckReplyCheckVisible: false,
      checkType: ""
    });
  }

  //仓库回复
  ckReplyModal() {
    const { ckReplyFormData, noChoice } = this.state;
    return <Modal
      title="仓库回复"
      wrapClassName="admin_modal column"
      width={"520px"}
      visible={this.state.ckReplyVisible}
      onCancel={this.handleCloseCkReplyModal.bind(this)}
      footer={
        <div className="action">
          <Button
            style={{ backgroundColor: "transparent" }}
            onCancel={this.handleCloseCkReplyModal.bind(this)}
          >
            关闭
          </Button>
            <Button
              className=" add_btn"
              onClick={this.handleCkReply.bind(this)}
            >
              提交
            </Button>
        </div>
      }>
      <FormItem {...formItemLayout} label={<span><i>*</i>运单号</span>}>
          <Input placeholder="运单号"
                  className="input"
                  disabled={true}
                  value={ckReplyFormData.inlandNumber}
          />
      </FormItem>
      <FormItem {...formItemLayout} label={<span>回复内容</span>}>
          <Input placeholder="回复内容"
                  className="input"
                  value={ckReplyFormData.replyContent}
                  onChange={(e)=>{
                    this.setState({
                      ckReplyFormData:{
                        ...ckReplyFormData,
                        replyContent: e.target.value
                      }
                    });
                  }}
          />
      </FormItem>
      <FormItem {...formItemLayout} label={<span>备注</span>}>
          <Input placeholder="备注"
                  className="input"
                  value={ckReplyFormData.remark}
                  onChange={(e)=>{
                    this.setState({
                      ckReplyFormData:{
                        ...ckReplyFormData,
                        remark: e.target.value
                      }
                    });
                  }}
          />
      </FormItem>
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

  ckReplyCheckModal() {
    const { inlandNumber, noChoice, checkType } = this.state;
    return <Modal
      title="仓库回复查看"
      wrapClassName="admin_modal column"
      width={"520px"}
      visible={this.state.ckReplyCheckVisible}
      onCancel={this.handleCloseCkReplyCheckModal.bind(this)}
      footer={
        <div className="action">
          <Button
            style={{ backgroundColor: "transparent" }}
            onClick={this.handleCloseCkReplyCheckModal.bind(this)}
          >
            关闭
          </Button>
        </div>
      }>
      <FormItem {...formItemLayout} label={<span><i>*</i>运单号</span>}>
        <Input placeholder="运单号"
          className="input"
          disabled={true}
          value={inlandNumber}
        />
      </FormItem>
      <FormItem
        {...formItemLayout}
        // validateStatus={checked_status}
        label={
          <span>
            查看类型
          </span>
        }>
        <Select
          value={checkType || "选择类型"}
          style={{ width: 200 }}
          onChange={val => {
            this.setState({
              checkType: val
            }, () => {
              this.getReplys(val);
            })
          }}
        >
          {checkTypes.map(a => {
            return (
              <Select.Option value={a} key={a}>
                {a}
              </Select.Option>
            );
          })}
        </Select>
      </FormItem>
      <Table
        columns={replyColumns}
        dataSource={this.state.ckReplys}
        bordered
        loading={this.state.loading}
        pagination={false}
      />
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

  clearForm() {
    this.setState({
      addEditVisible: false,
    });
  }

  handleModelOk() {
    const { inlandNumber, userId, goodsStatus } = this.state;
    const params = {inlandNumber, userId, type: "ckOrderUpdate", goodsStatus};
    api.$get(apiList3.getOrders.path, params , res => {
      if(res.code === 200 && res.msg === "success") {
        this.setState({
          addEditVisible: false
        });
        message.success("发货成功", 2);
      } else {
        message.error(res.msg, 2);
      }
      this.getOrders();
    })
  }

  handleSendOrderSubmit() {
    const { ckSendOrderFormData } = this.state
    const params = {
      type: "ckSendOrder",
      inlandNumber: ckSendOrderFormData.inlandNumber
    };
    
    if(ckSendOrderFormData.objectiveCountry) {
      params.objectiveCountry = ckSendOrderFormData.objectiveCountry;
    }
    
    api.$get(apiList3.getOrders.path, params , res => {
      this.setState({
        ckSendOrderVisible: false
      });
      if(res.code === 200 && res.msg === "success") {
        message.success('提交成功', 2);
      } else {
        message.error(res.msg, 2);
      }
    })
  }

  getReplys() {
    const { checkType, inlandNumber } = this.state
    const params = { waybillNumber: inlandNumber, type: "ckReplyCheck", checkType: "1" };
    const checkTypeMap = new Map([["全部","1"], ["用户和运管","2"], ["用户和仓管","3"], ["运管和仓管","4"]]);
    if(checkType) {
      params.checkType = checkTypeMap.get(checkType)
    }
    api.$get(apiList3.getOrders.path, params, res => {
      if(res.code !== 500) {
        let list = objToArray(res) || [];
        this.setState({
          ckReplys: [...list],
          loading: false
        });
      } else {
        this.setState({
          ckReplys: [],
          loading: false
        });
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
      if (this.isAbleOrder) {//已发货
        this.setCkAlreadySendColumn();
      }
      if(this.isProblem) {//问题件
        this.setCkProblemOrderColumn();
      }
      if(this.isUserReply) {//已回复
        this.setCkUserReplyOrderColumn();
      }

      this.getOrders();
    });
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

  handleChangeDatePicker(data, dateString) {
    const { search } = this.state;
    this.setState({
      search: {
        ...search,
        startTime: dateString[0],
        endTime: dateString[1]
      }
    });
  }

  handleCkReply() {//仓库管理员回复
    const { ckReplyFormData } = this.state;
    const params = { waybillNumber: ckReplyFormData.inlandNumber, type: "ckReply" };
    if(ckReplyFormData.remark) {
      params.remark = ckReplyFormData.remark
    }
    if(ckReplyFormData.replyContent) {
      params.replyContent = ckReplyFormData.replyContent
    }
    api.$get(apiList3.getOrders.path, params, res => {
      if(res.code === 200 && res.msg === "success") {
        this.setState({
          ckReplyVisible: false,
          ckReplyFormData: {}
        });
        message.success("回复成功", 2);
      } else {
        message.error(res.message, 2);
      }
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

  onChange(info) {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          checkFormData: {
            ...this.state.checkFormData,
            imageUrl,
            problemOrderImg: `${uploadServerPath}${info.fileList[0].response.path}`
          }
          ,
          loading: false,
        }),
      );
    }
    if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  }

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleTableChange = pagination => {
    const { current: pageIndex, pageSize } = pagination
    this.setState({
      search: {
        ...this.state.search,
        pageIndex,
        pageSize
      }
    },() => {
      this.getOrders();
    })
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

  get isUserReply() {
    const { search } = this.state;
    return search.userReply === "已回复";
  }

  render() {
    return (
      <div className="admin plat">
        <div className="tableWarp">
          {/* {this.searchBar()} */}
          <OrderSearchBar 
            handleChangeSearch={this.handleChangeSearchSelect.bind(this)}
            handleClearSearchBar={this.handleClearSearchBar.bind(this)}
            handleChangeDatePicker={this.handleChangeDatePicker.bind(this)}
            handleSearch={this.handleSearch.bind(this)}
            search={this.state.search}
          />
          <Table
            columns={this.state.columns}
            dataSource={this.state.storeOrders}
            bordered
            loading={this.state.loading}
            pagination={{
              current: this.state.search.pageIndex,
              pageSize: this.state.search.pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              total: this.state.totalCount,
              showTotal: () =>`共${this.state.totalCount}条`
            }}
            onChange={this.handleTableChange.bind(this)}
          />
        </div>
        {this.addEditModal()}
        {this.checkModal()}
        {this.sendOrderModal()}
        {this.ckReplyModal()}
        {this.ckReplyCheckModal()}
        
        <Modal
          visible={this.state.printVisible}
          onCancel={()=>{
            this.setState({
              printVisible: false,
              printImage:""
            });
          }}
          footer={
            <div className="action">
               <ReactToPrint
                trigger={() => <a href="#"><Button>打印</Button></a>}
                content={() => this.componentRef}
              />
              </div>}
          >
              <img src={this.state.printImage} alt="" style={{height: "500px"}} ref={el => (this.componentRef = el)}></img>
        </Modal>
      </div>
    );
  }
}

class ProblemImage extends React.Component {
  state = {
    loading: false,
  };

  beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  handleChange = info => {
    const { onChange } = this.props;
    if(onChange) {
      onChange(info)
    }
  };

  render() {
    const { imageUrl } = this.props;
    return (
      <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={apiList4.uploadFile.path}
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : '上传'}
      </Upload>
    );
  }
}

export default StoreManage;
