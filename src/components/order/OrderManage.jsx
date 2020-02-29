import React, { Component } from "react";
import {
  Input,
  Button,
  Tabs,
  Table,
  DatePicker,
  Dropdown,
  Icon
} from "antd";
// 引入编辑器样式
import { Api } from "../../server/_ajax";
import $ from "jquery";
import { apiList3 } from "../../server/apiMap";
import { objToArray } from "../.././server/objtoArray";
import moment from "moment";
const { TabPane } = Tabs;
const api = new Api();
const dateFormat = "YYYY-MM-DD";
const { RangePicker } = DatePicker;
const akAlreadyColumns = [
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
const ckUserReplyOrderColumns = [
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
const ckUserNoReplyOrderColumns = [
  {
    title: "waybillNumber",
    dataIndex: "waybillNumber",
    key: "waybillNumber",
  },
  {
    title: "回复内容",
    dataIndex: "replyContent",
    key: "replyContent"
  }
];
const ckNoSendOrderColumns = [
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
  }
]
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
]

class OrderManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      locale: {
        emptyText: "没有相关数据"
      },
      allOrderList:[],
      ckAlreadySendOrderList:[],
      allOrderListSearch: {
        startTime: null,
        endTime: null,
        objectiveCountry: null,
        carrier: null, 
        pageIndex: 1,
        pageSize: 10
      }
  }
  }
  componentDidMount = () => {
    this.setColumn();
    this.getAllOrderData();
  };

  setColumn() {
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
      {
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
                    userId: a.userId,
                    inlandNumber: a.inlandNumber,
                    addEditVisible: true,
                    goodsStatus: "3",
                    operationTypeDesc: "发货",
                    isAdd: false
                  });
                }}
              >
                发货
              </span>
              <span
                style={{ cursor: "pointer", marginRight: "10px" }}
                onClick={() => {
                  this.setState({
                    userId: a.userId,
                    inlandNumber: a.inlandNumber,
                    addEditVisible: true,
                    goodsStatus: "-3",
                    isAdd: false,
                    operationTypeDesc: "销毁",
                  });
                }}
              >
                销毁
              </span>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  this.setState({
                    userId: a.userId,
                    inlandNumber: a.inlandNumber,
                    addEditVisible: true,
                    goodsStatus: "-2",
                    operationTypeDesc: "退件",
                  });
                }}
              >
                退件
              </span>
            </div>
          );
        }
      }
    ];
    this.setState({
      columns
    });
  }

  getAllOrderColumn() {
    const { allOrderListSearch } = this.state;
    let params = { 
      pageSize: allOrderListSearch.pageSize,
      pageIndex: allOrderListSearch.pageIndex,
      type: "allOrder"
    };
    if(allOrderListSearch.endTime) {
      params.endTime = allOrderListSearch.endTime;
    }
    if(allOrderListSearch.startTime) {
      params.startTime = allOrderListSearch.startTime;
    }
    if(allOrderListSearch.carrier) {
      params.carrier = allOrderListSearch.carrier;
    }
    if(allOrderListSearch.objectiveCountry) {
      params.objectiveCountry = allOrderListSearch.objectiveCountry;
    }
    api.$get(apiList3.getAllOrderList.path, params, res => {
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

  getAllOrderData() {
    this.setState({
      loading: true
    });
    setTimeout(() => {
      this.getAllOrderColumn()
    }, 500);
  }

  allOrderSearchBar() {//全部订单筛选条件
    const { allOrderListSearch } = this.state;
    return (
      <div className="search-title" style={{ minWidth: "1170px" }}>
        {/*关键字*/}
        <div className="params params-20" style={{ minWidth: "170px" }}>
          <span>目的国家：</span>
          <Input
            placeholder="请输入目的国家"
            className="store_freight"
            value={allOrderListSearch.objectiveCountry}
            style={{ width: "130px" }}
            onPressEnter={e => {
              this.getAllOrderData();
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
            value={allOrderListSearch.carrier}
            style={{ width: "130px" }}
            onPressEnter={e => {
              this.getAllOrderData();
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
        {/*订单号*/}
        <div className="params params-20">
          选择时间：
          <RangePicker
            value={[
              allOrderListSearch.startTime ? moment(allOrderListSearch.startTime, dateFormat) : null,
              allOrderListSearch.endTime ? moment(allOrderListSearch.endTime, dateFormat) : null
            ]}
            allowClear={false}
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
        {/*异常订单abnormal*/}

        {/*查询和清空*/}
        <div className="params" style={{ marginRight: "60px" }}>
          <Button
            className="search-btn"
            onClick={() => {
              this.getAllOrderData();
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
              this.setState(
                {
                  allOrderListSearch: {
                    startTime: null,
                    endTime: null,
                    objectiveCountry: null,
                    carrier: null, 
                    pageIndex: 1,
                    pageSize: 10
                  }
                },
                () => {
                  this.getAllOrderData();
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

  ckNoSendOrderSearchBar() {//未发货订单筛选条件
    const { ckNoSendOrderListSearch } = this.state;
    return (
      <div className="search-title" style={{ minWidth: "1170px" }}>
        {/*关键字*/}
        <div className="params params-20" style={{ minWidth: "200px" }}>
          <span>运单号：</span>
          <Input
            placeholder="运单号"
            className="store_freight"
            value={ckNoSendOrderListSearch.inlandNumber}
            style={{ width: "200px" }}
            onPressEnter={e => {
              this.getCkNoSendOrderData();
            }}
            onChange={e => {
              this.setState({
                ckNoSendOrderListSearch: {
                  ...ckNoSendOrderListSearch,
                  inlandNumber: e.target.value
                } 
              });
            }}
          />
        </div>
        {/*异常订单abnormal*/}

        {/*查询和清空*/}
        <div className="params" style={{ marginRight: "60px" }}>
          <Button
            className="search-btn"
            onClick={() => {
              this.getCkNoSendOrderData()
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
              this.setState(
                {
                  ckNoSendOrderListSearch: {
                    pageIndex: 1,
                    pageSize: 10,
                    inlandNumber: null
                  }
                },
                () => {
                  this.getCkNoSendOrderData();
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

  ckAlreadySendOrderListSearchBar() {//已发货物查询
    const { ckAlreadySendOrderListSearch } = this.state;
    return (
      <div className="search-title" style={{ minWidth: "1170px" }}>
        {/*关键字*/}
        <div className="params params-20" style={{ minWidth: "170px" }}>
          <span>运单号：</span>
          <Input
            placeholder="运单号"
            className="store_freight"
            value={ckAlreadySendOrderListSearch.inlandNumber}
            style={{ width: "130px" }}
            onPressEnter={e => {
              this.getCkAlreadySendOrderData();
            }}
            onChange={e => {
              this.setState({
                ckAlreadySendOrderListSearch: {
                  ...ckAlreadySendOrderListSearch,
                  inlandNumber: e.target.value
                } 
              });
            }}
          />
        </div>
        {/*订单号*/}
        <div className="params params-20">
          选择时间：
          <RangePicker
            value={[
              ckAlreadySendOrderListSearch.startTime ? moment(ckAlreadySendOrderListSearch.startTime, dateFormat) : null,
              ckAlreadySendOrderListSearch.endTime ? moment(ckAlreadySendOrderListSearch.endTime, dateFormat) : null
            ]}
            allowClear={false}
            format={dateFormat}
            onChange={(date, dateString) => {
              this.setState({
                ckAlreadySendOrderListSearch: {
                  ...ckAlreadySendOrderListSearch,
                  startTime: dateString[0],
                  endTime: dateString[1]
                }
              });
            }}
          />
        </div>
        
        {/*查询和清空*/}
        <div className="params" style={{ marginRight: "60px" }}>
          <Button
            className="search-btn"
            onClick={() => {
              this.getCkAlreadySendOrderData();
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
              this.setState(
                {
                  ckAlreadySendOrderListSearch: {
                    startTime: null,
                    endTime: null,
                    objectiveCountry: null,
                    carrier: null, 
                    pageIndex: 1,
                    pageSize: 10
                  }
                },
                () => {
                  this.getCkAlreadySendOrderData();
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

  ckUserReplyOrderListSearchBar() {
    const { ckUserReplyOrderListSearch } = this.state;
    return (
      <div className="search-title" style={{ minWidth: "1170px" }}>
        {/*关键字*/}
        <div className="params params-20" style={{ minWidth: "170px" }}>
          <span>运单号：</span>
          <Input
            placeholder="运单号"
            className="store_freight"
            value={ckUserReplyOrderListSearch.objectiveCountry}
            style={{ width: "130px" }}
            onPressEnter={e => {
              this.getData();
            }}
            onChange={e => {
              this.setState({
                ckUserReplyOrderListSearch: {
                  ...ckUserReplyOrderListSearch,
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
            value={ckUserReplyOrderListSearch.carrier}
            style={{ width: "130px" }}
            onPressEnter={e => {
              this.getCkAlreadySendOrderData()
            }}
            onChange={e => {
              this.setState({
                ckUserReplyOrderListSearch: {
                  ...ckUserReplyOrderListSearch,
                  carrier: e.target.value
                }
              });
            }}
          />
        </div>
        {/*订单号*/}
        <div className="params params-20">
          选择时间：
          <RangePicker
            value={[
              ckUserReplyOrderListSearch.startTime ? moment(ckUserReplyOrderListSearch.startTime, dateFormat) : null,
              ckUserReplyOrderListSearch.endTime ? moment(ckUserReplyOrderListSearch.endTime, dateFormat) : null
            ]}
            allowClear={false}
            format={dateFormat}
            onChange={(date, dateString) => {
              this.setState({
                ckUserReplyOrderListSearch: {
                  ...ckUserReplyOrderListSearch,
                  startTime: dateString[0],
                  endTime: dateString[1]
                }
              });
            }}
          />
        </div>
        {/*异常订单abnormal*/}

        {/*查询和清空*/}
        <div className="params" style={{ marginRight: "60px" }}>
          <Button
            className="search-btn"
            onClick={() => {
              this.getCkUserReplyOrderData();
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
              this.setState(
                {
                  ckUserReplyOrderListSearch: {
                    startTime: null,
                    endTime: null,
                    objectiveCountry: null,
                    carrier: null, 
                    pageIndex: 1,
                    pageSize: 10
                  }
                },
                () => {
                  this.getCkUserReplyOrderData();
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

  ckUserNoReplyOrdersListSearchBar() {
    const { ckUserNoReplyOrdersListSearch } = this.state;
    return (
      <div className="search-title" style={{ minWidth: "1170px" }}>
        {/*关键字*/}
        <div className="params params-20" style={{ minWidth: "170px" }}>
          <span>运单号：</span>
          <Input
            placeholder="运单号"
            className="store_freight"
            value={ckUserNoReplyOrdersListSearch.objectiveCountry}
            style={{ width: "130px" }}
            onPressEnter={e => {
              this.getData();
            }}
            onChange={e => {
              this.setState({
                ckUserNoReplyOrdersListSearch: {
                  ...ckUserNoReplyOrdersListSearch,
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
            value={ckUserNoReplyOrdersListSearch.carrier}
            style={{ width: "130px" }}
            onPressEnter={e => {
              this.getCkUserNoReplyOrderData();
            }}
            onChange={e => {
              this.setState({
                ckUserNoReplyOrdersListSearch: {
                  ...ckUserNoReplyOrdersListSearch,
                  carrier: e.target.value
                }
              });
            }}
          />
        </div>
        {/*订单号*/}
        <div className="params params-20">
          选择时间：
          <RangePicker
            value={[
              ckUserNoReplyOrdersListSearch.startTime ? moment(ckUserNoReplyOrdersListSearch.startTime, dateFormat) : null,
              ckUserNoReplyOrdersListSearch.endTime ? moment(ckUserNoReplyOrdersListSearch.endTime, dateFormat) : null
            ]}
            allowClear={false}
            format={dateFormat}
            onChange={(date, dateString) => {
              this.setState({
                ckUserNoReplyOrdersListSearch: {
                  ...ckUserNoReplyOrdersListSearch,
                  startTime: dateString[0],
                  endTime: dateString[1]
                }
              });
            }}
          />
        </div>
        {/*异常订单abnormal*/}

        {/*查询和清空*/}
        <div className="params" style={{ marginRight: "60px" }}>
          <Button
            className="search-btn"
            onClick={() => {
              this.getCkUserNoReplyOrderData()
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
              this.setState(
                {
                  ckUserNoReplyOrdersListSearch: {
                    startTime: null,
                    endTime: null,
                    objectiveCountry: null,
                    carrier: null, 
                    pageIndex: 1,
                    pageSize: 10
                  }
                },
                () => {
                  this.getCkUserNoReplyOrderData();
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

 
  
  ckProblemOrderListSearchBar() {
    const { ckProblemOrderListSearch } = this.state;
    return (
      <div className="search-title" style={{ minWidth: "1170px" }}>
        {/*关键字*/}
        <div className="params params-20" style={{ minWidth: "170px" }}>
          <span>运单号：</span>
          <Input
            placeholder="运单号"
            className="store_freight"
            value={ckProblemOrderListSearch.objectiveCountry}
            style={{ width: "130px" }}
            onPressEnter={e => {
              this.getData();
            }}
            onChange={e => {
              this.setState({
                ckProblemOrderListSearch: {
                  ...ckProblemOrderListSearch,
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
            value={ckProblemOrderListSearch.carrier}
            style={{ width: "130px" }}
            onPressEnter={e => {
              this.getCkProblemOrderData();
            }}
            onChange={e => {
              this.setState({
                ckProblemOrderListSearch: {
                  ...ckProblemOrderListSearch,
                  carrier: e.target.value
                }
              });
            }}
          />
        </div>
        {/*订单号*/}
        <div className="params params-20">
          选择时间：
          <RangePicker
            value={[
              ckProblemOrderListSearch.startTime ? moment(ckProblemOrderListSearch.startTime, dateFormat) : null,
              ckProblemOrderListSearch.endTime ? moment(ckProblemOrderListSearch.endTime, dateFormat) : null
            ]}
            allowClear={false}
            format={dateFormat}
            onChange={(date, dateString) => {
              this.setState({
                ckProblemOrderListSearch: {
                  ...ckProblemOrderListSearch,
                  startTime: dateString[0],
                  endTime: dateString[1]
                }
              });
            }}
          />
        </div>
        {/*异常订单abnormal*/}

        {/*查询和清空*/}
        <div className="params" style={{ marginRight: "60px" }}>
          <Button
            className="search-btn"
            onClick={() => {
              this.getCkProblemOrderData()
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
              this.setState(
                {
                  ckProblemOrderListSearch: {
                    startTime: null,
                    endTime: null,
                    objectiveCountry: null,
                    carrier: null, 
                    pageIndex: 1,
                    pageSize: 10
                  }
                },
                () => {
                  this.getCkProblemOrderData();
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
  render() {
    return (
      <div className="content" style={{ paddingBottom: "30px" }}>
        <div className="tableWarp">
              {this.allOrderSearchBar()}
              <Table
                columns={this.state.columns}
                dataSource={this.state.allOrderList}
                bordered
                loading={this.state.loading}
                locale={this.state.locale}
                pagination={{
                  current: this.state.currentPage,
                  pageSize: this.state.pageSize,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  total: this.state.totalCount
                }}
              />
            </div>
        {/* <Tabs defaultActiveKey="ALLORDER" type="card" onChange={this.handleChangeTab.bind(this)}>
          <TabPane tab="全部订单" key="ALLORDER">
            <div className="tableWarp">
              {this.allOrderSearchBar()}
              <Table
                columns={this.state.columns}
                dataSource={this.state.allOrderList}
                bordered
                loading={this.state.loading}
                locale={this.state.locale}
                pagination={{
                  current: this.state.currentPage,
                  pageSize: this.state.pageSize,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  total: this.state.totalCount
                }}
              />
            </div>
          </TabPane>
          <TabPane tab="未发货查询" key="CKNOSEND">
            <div className="tableWarp">
              {this.ckNoSendOrderSearchBar()}
              <Table
                columns={ckNoSendOrderColumns}
                dataSource={this.state.ckNoSendOrderList}
                bordered
                loading={this.state.loading}
                locale={this.state.locale}
                pagination={{
                  current: this.state.currentPage,
                  pageSize: this.state.pageSize,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  total: this.state.totalCount
                }}
              />
            </div>
          </TabPane>
          <TabPane tab="已发货物查询" key="CKALREADY">
            <div className="tableWarp">
              {this.ckAlreadySendOrderListSearchBar()}
              <Table
                columns={akAlreadyColumns}
                dataSource={this.state.ckAlreadySendOrderList}
                bordered
                loading={this.state.loading}
                locale={this.state.locale}
                pagination={{
                  current: this.state.currentPage,
                  pageSize: this.state.pageSize,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  total: this.state.totalCount
                }}
              />
            </div>
          </TabPane>
          <TabPane tab="问题件查询" key="HASPROBLEM">
            <div className="tableWarp">
            <div className="tableWarp">
              {this.ckProblemOrderListSearchBar()}
              <Table
                columns={ckProblemOrderColumn}
                dataSource={this.state.ckProblemOrderList}
                bordered
                loading={this.state.loading}
                locale={this.state.locale}
                pagination={{
                  current: this.state.currentPage,
                  pageSize: this.state.pageSize,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  total: this.state.totalCount
                }}
              />
            </div>

            </div>
          </TabPane>
          <TabPane tab="用户已回复查询" key="CKUSERREPLlY">
            <div className="tableWarp">
              {this.ckUserReplyOrderListSearchBar()}
              <Table
                columns={ckUserReplyOrderColumns}
                dataSource={this.state.ckUserReplyOrderList}
                bordered
                loading={this.state.loading}
                locale={this.state.locale}
                pagination={{
                  current: this.state.currentPage,
                  pageSize: this.state.pageSize,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  total: this.state.totalCount
                }}
              />
            </div>
          </TabPane>
          <TabPane tab="用户待回复查询" key="CKUSERNOREPLlY">
            <div className="tableWarp">
            {this.ckUserNoReplyOrdersListSearchBar()}
              <Table
                columns={ckUserNoReplyOrderColumns}
                dataSource={this.state.ckUserNoReplyOrdersList}
                bordered
                loading={this.state.loading}
                locale={this.state.locale}
                pagination={{
                  current: this.state.currentPage,
                  pageSize: this.state.pageSize,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  total: this.state.totalCount
                }}
              />
            </div>
          </TabPane>
        </Tabs> */}
        ,
      </div>
    );
  }
}

export default OrderManage;
