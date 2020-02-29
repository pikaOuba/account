import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu } from "antd";

class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openKeys: [],
      selectedKey: "",
      checkedMenu: "",
      defKey: "",
      userList: ["超级管理员"]
    };
  }

  componentDidMount() {
    this.setState({
      defKey: this.props.addActiveKey //当前选中菜单
    });
  }

  render() {
    const { userList } = this.state;
    return (
      <div className="sideBar">
        <div className="side-title">管理系统</div>
        <Menu theme="dark" mode="inline" selectedKeys={[this.state.defKey]}>
          {userList.indexOf("超级管理员") !== -1 ? (
            <Menu.Item key="AdminManage">
              <span
                onClick={() => {
                  this.props.history.push("/adminManage");
                  this.setState({
                    defKey: "AdminManage"
                  });
                }}
              >
                会员管理
              </span>
            </Menu.Item>
          ) : null}
          {userList.indexOf("超级管理员") !== -1 ? (
            <Menu.Item key="AgentManage">
              <span
                onClick={() => {
                  this.props.history.push("/agentManage");
                  this.setState({
                    defKey: "AgentManage"
                  });
                }}
              >
                代理商管理
              </span>
            </Menu.Item>
          ) : null}
          {userList.indexOf("超级管理员") !== -1 ? (
            <Menu.Item key="RoleManage">
              <span
                onClick={() => {
                  this.props.history.push("/roleManage");
                  this.setState({
                    defKey: "RoleManage"
                  });
                }}
              >
                角色管理
              </span>
            </Menu.Item>
          ) : null}
          {userList.indexOf("超级管理员") !== -1 ||
          userList.indexOf("权限管理员") !== -1 ? (
            <Menu.Item key="PowerManage">
              <span
                onClick={() => {
                  this.props.history.push("/powerManage");
                  this.setState({
                    defKey: "PowerManage"
                  });
                }}
              >
                权限管理
              </span>
            </Menu.Item>
          ) : null}
          {userList.indexOf("超级管理员") !== -1 ||
          userList.indexOf("权限管理员") !== -1 ? (
            <Menu.Item key="MessageCreate">
              <span
                onClick={() => {
                  this.props.history.push("/messageManage");
                  this.setState({
                    defKey: "MessageCreate"
                  });
                }}
              >
                消息管理
              </span>
            </Menu.Item>
          ) : null}
          {userList.indexOf("超级管理员") !== -1 ? (
            <Menu.SubMenu key="sub1" title={<span>产品库管理</span>}>
              <Menu.Item
                key="UserProductManage"
                onClick={() => {
                  this.props.history.push("/userProductManage");
                  this.setState({
                    defKey: "UserProductManage"
                  });
                }}
              >
                用户产品
              </Menu.Item>
              <Menu.Item
                key="PlatProductManage"
                onClick={() => {
                  this.props.history.push("/platProductManage");
                  this.setState({
                    defKey: "PlatProductManage"
                  });
                }}
              >
                平台产品
              </Menu.Item>
            </Menu.SubMenu>
          ) : null}
          {userList.indexOf("超级管理员") !== -1 ||
          userList.indexOf("订单管理员") !== -1 ? (
            <Menu.Item key="OrderManage">
              <span
                onClick={() => {
                  this.props.history.push("/orderManage");
                  this.setState({
                    defKey: "OrderManage"
                  });
                }}
              >
                订单管理
              </span>
            </Menu.Item>
          ) : null}
          {userList.indexOf("超级管理员") !== -1 ||
          userList.indexOf("仓库管理员") !== -1 ? (
            <Menu.Item key="StoreManage">
              <span
                onClick={() => {
                  this.props.history.push("/storeManage");
                  this.setState({
                    defKey: "StoreManage"
                  });
                }}
              >
                仓库管理
              </span>
            </Menu.Item>
          ) : null}
          {userList.indexOf("超级管理员") !== -1 ? (
            <Menu.Item key="NoLogisistManage">
              <span
                onClick={() => {
                  this.setState({
                    defKey: "NoLogisistManage"
                  });
                }}
              >
                订单未发物流预警
              </span>
            </Menu.Item>
          ) : null}
          {userList.indexOf("超级管理员") !== -1 ? (
            <Menu.Item key="ContractorManage">
              <span
                onClick={() => {
                  this.props.history.push("/contractorManage");
                  this.setState({
                    defKey: "ContractorManage"
                  });
                }}
              >
                第三方承包方管理
              </span>
            </Menu.Item>
          ) : null}
          {userList.indexOf("超级管理员") !== -1 ? (
            <Menu.Item key="FactoryManage">
              <span
                onClick={() => {
                  this.props.history.push("/factoryManage");
                  this.setState({
                    defKey: "FactoryManage"
                  });
                }}
              >
                厂家管理
              </span>
            </Menu.Item>
          ) : null}
          {userList.indexOf("超级管理员") !== -1 ? (
            <Menu.Item key="yijianManage">
              <span
                onClick={() => {
                  this.props.history.push("/yijianManage");
                  this.setState({
                    defKey: "yijianManage"
                  });
                }}
              >
                意见箱
              </span>
            </Menu.Item>
          ) : null}
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { ...state };
};
const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);
