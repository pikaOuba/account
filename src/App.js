import React from "react";
// import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout } from "antd";

import createHistory from "history/createBrowserHistory";
//登录
import Login from "./components/Login";
import "./App.css";
//会员管理
import AdminManage from "./components/admin/AdminManage";
//侧边菜单
import SideBar from "./components/SideBar";
//头部
import PageHeader from "./components/Header";
//代理商管理
import AgentManage from "./components/agent/AgentManage";
//角色管理
import RoleManage from "./components/role/RoleManage";
//权限管理
import PowerManage from "./components/power/PowerManage";
//消息修改
import MessageCreate from "./components/messageControl/MessageCreate";
//用户产品
import UserProductManage from "./components/products/UserProductManage";
//平台产品
import PlatProductManage from "./components/products/PlatProductManage";
//订单管理
import OrderManage from "./components/order/OrderManage";
//仓库管理
import StoreManage from "./components/store/StoreManage";
//第三方承包管理
import ContractorManage from "./components/contractor/ContractorManage";
//厂家管理
import FactoryManage from "./components/factory/FactoryManage";
//消息管理
import MessageCenter from "./components/messageControl/MessageCenter";
//banner修改
import BannerEdit from "./components/messageControl/BannerEdit";
//意见管理
import YijianManage from "./components/yijianManage/index";
const { Header, Sider, Content } = Layout;

const history = createHistory({
  basename: "/"
});
function App() {
  return (
    <div className="App" style={{ minWidth: "1200px" }}>
      <Router history={history}>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route
            path="/"
            render={() => {
              return (
                <div>
                  <Layout style={{ height: "100%", minHeight: "800px" }}>
                    <Sider
                      className="menu1"
                      width="180"
                      style={{
                        background:
                          "linear-gradient(-180deg, #262a41 0%, #475071 100%)",
                        height: "100%",
                        minHeight: "800px"
                      }}
                    >
                      <Route path="/" component={SideBar}></Route>
                    </Sider>
                    <Layout>
                      <Header>
                        <Route path="/" component={PageHeader}></Route>
                      </Header>
                      <Content className="content">
                        <Route
                          exact
                          path="/"
                          render={() => "欢迎使用管理平台"}
                        />
                        <Route
                          exact
                          path="/adminManage"
                          component={AdminManage}
                        />
                        <Route
                          exact
                          path="/agentManage"
                          component={AgentManage}
                        />
                        <Route
                          exact
                          path="/roleManage"
                          component={RoleManage}
                        />
                        <Route
                          exact
                          path="/powerManage"
                          component={PowerManage}
                        />
                        <Route
                          exact
                          path="/messageManage"
                          component={MessageCenter}
                        />
                        <Route
                          path="/messageCreate"
                          component={MessageCreate}
                        />
                        <Route path="/bannerEdit" component={BannerEdit} />
                        <Route
                          exact
                          path="/userProductManage"
                          component={UserProductManage}
                        />
                        <Route
                          exact
                          path="/platProductManage"
                          component={PlatProductManage}
                        />
                        <Route
                          exact
                          path="/orderManage"
                          component={OrderManage}
                        />
                        <Route
                          exact
                          path="/storeManage"
                          component={StoreManage}
                        />
                        <Route
                          exact
                          path="/contractorManage"
                          component={ContractorManage}
                        />
                        <Route
                          exact
                          path="/factoryManage"
                          component={FactoryManage}
                        />
                        <Route
                          exact
                          path="/yijianManage"
                          component={YijianManage}
                        />
                      </Content>
                    </Layout>
                  </Layout>
                </div>
              );
            }}
          ></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
