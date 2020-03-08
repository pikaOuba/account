import React, { Component } from 'react';
import {
  Input,
  Button,
  Select,
  DatePicker
} from "antd";
import moment from "moment";

const dateFormat = "YYYY-MM-DD";
const { RangePicker } = DatePicker;
const trackingSigns = ["全部","已完成","进行中","未完成"];
const hasProblems = ["全部","有问题", "没有问题"];
const fhStatuss = ["全部","已发货", "未发货"];
const placeNames = ["全部","4px", "dhl","sf","zh"];
const userReplys = ["全部","已回复","待回复"];
const reason = ["颜色不对", "尺寸不对", "破损"];

export default class OrderSearchBar extends Component {

  handleChangeSearch(val, param) {
    const { handleChangeSearch } = this.props;
    if(handleChangeSearch) {
      handleChangeSearch(val, param);
    }
  }

  handleChangeDatePicker(date, dateString) {
    const { handleChangeDatePicker } = this.props;
    if(handleChangeDatePicker) {
      handleChangeDatePicker(date, dateString);
    }
  }

  handleClearSearchBar() {
    const { handleClearSearchBar } = this.props;
    if(handleClearSearchBar) {
      handleClearSearchBar();
    }
  }


  handleSearch() {
    const { handleSearch } = this.props;
    if(handleSearch) {
      handleSearch();
    }
  }

  render() {
    const { search } = this.props;
    return (
      <div className="search-title" style={{ minWidth: "1170px", height: "120px" }}>
        <div className="params params-20">
          运单状态：
          <Select
            value={search.trackingSign || "请选择"}
            style={{ width: 150 }}
            onChange={(val) => this.handleChangeSearch(val,"trackingSign")}
          >
            {trackingSigns.map(a => {
              return (
                <Select.Option value={a} key={a}>
                  {a}
                </Select.Option>
              );
            })}
          </Select>
        </div>
        <div className="params params-20">
          发货状态：
          <Select
            value={search.fhStatus || "请选择"}
            style={{ width: 150 }}
            onChange={(val) => this.handleChangeSearch(val,"fhStatus")}
          >
            {fhStatuss.map(a => {
              return (
                <Select.Option value={a} key={a}>
                  {a}
                </Select.Option>
              );
            })}
          </Select>
        </div>
        <div className="params params-20">
          有无问题：
          <Select
            value={search.hasProblem || "请选择"}
            style={{ width: 150 }}
            onChange={(val) => this.handleChangeSearch(val,"hasProblem")}
          >
            {hasProblems.map(a => {
              return (
                <Select.Option value={a} key={a}>
                  {a}
                </Select.Option>
              );
            })}
          </Select>
        </div>
        <div className="params params-20">
          下单公司：
          <Select
            value={search.placeName || "请选择"}
            style={{ width: 150 }}
            onChange={(val) => this.handleChangeSearch(val,"placeName")}
          >
            {placeNames.map(a => {
              return (
                <Select.Option value={a} key={a}>
                  {a}
                </Select.Option>
              );
            })}
          </Select>
        </div>
        <div className="params params-20">
          用户是否回复：
          <Select
            value={search.userReply || "请选择"}
            style={{ width: 150 }}
            onChange={(val) => this.handleChangeSearch(val,"userReply")}
          >
            {userReplys.map(a => {
              return (
                <Select.Option value={a} key={a}>
                  {a}
                </Select.Option>
              );
            })}
          </Select>
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
            onChange={(date, dateString) => this.handleChangeDatePicker(date, dateString)}
          />
        </div>
        <div className="params params-20" style={{ minWidth: "200px" }}>
          <span>运单号：</span>
          <Input
            placeholder="运单号"
            className="store_freight"
            value={search.inlandNumber}
            style={{ width: "200px" }}
            onChange={(e) => this.handleChangeSearch(e.target.value, "inlandNumber")}
          />
        </div>
        <div className="params params-20" style={{ minWidth: "200px" }}>
          <span>目的国家：</span>
          <Input
            placeholder="目的国家"
            className="store_freight"
            value={search.objectiveCountry}
            style={{ width: "200px" }}
            onChange={(val) => this.handleChangeSearch(val,"objectiveCountry")}
          />
        </div>
        <div className="params params-20" style={{ minWidth: "200px" }}>
          <span>承运商：</span>
          <Input
            placeholder="承运商"
            className="store_freight"
            value={search.carrier}
            style={{ width: "200px" }}
            onChange={(e) => this.handleChangeSearch(e.target.value, "carrier")}
          />
        </div> 
        <div className="params params-20" style={{ minWidth: "170px" }}>
          <span>问题原因：</span>
          <Select
            value={search.problemCause || "选择问题原因"}
            style={{ width: 200 }}
            onChange={(val) => this.handleChangeSearch(val,"problemCause")}
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
            style={{
              cursor: "pointer"
            }}
            onClick={this.handleSearch.bind(this)}
          >
            查询
          </Button>
          <Button
            style={{
              maxWidth: "60px",
              backgroundcolor: "#fff",
              borderColor: "#d9d9d9",
              color: "#222",
              marginLeft: "12px",
              cursor: "pointer"
            }}
            onClick={this.handleClearSearchBar.bind(this)}
            >
              清空
            </Button>
        </div>
      </div>
    )
  }
}
