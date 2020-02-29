import React, { Component } from "react";

import { connect } from "react-redux";

import $ from "jquery";
import { login } from "../actions";
import { Button, Input, Icon, Modal } from "antd";
import loginfont from "../image/loginfont.svg";
import picture from "../image/picture.png";
import login_word1 from "../image/login_word1.svg";
import login_word2 from "../image/login_word2.svg";
import login_seal from "../image/login_seal.png";
import user from "../image/user.svg";
import pass from "../image/password.svg";
import { Api } from "../server/_ajax.js";
import { apiList1 } from "../server/apiMap";
import { setCookie, getCookie } from "../server/cookies";
const api = new Api();
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      checked: false,
      username: "",
      password: "",
      errmsg: ""
    };
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {
    let authorization = getCookie("authorization"),
      apiKey = getCookie("ApiKey");
    if (authorization && authorization !== "" && apiKey && apiKey !== "") {
      this.props.history.push("/");
      return;
    }
    window.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  handleClick() {
    this.login();
  }

  handleKeyUp(event) {
    if (event.keyCode === 13) this.login();
  }

  login() {
    const { username, password } = this.state;

    if (username == "") {
      this.setState({
        errmsg: "请输入账户！"
      });
      return;
    }
    if (password == "") {
      this.setState({
        errmsg: "请输入密码！"
      });
      return;
    }
    if (!username) return this.setState({});
    if (!password) return this.setState({});

    let data = {
      userName: username,
      password: password,
      grant_type: "password"
    };

    this.setState({ isLoading: true });

    api.$post(apiList1.login.path, data, res => {
      console.log(res);
      if (res.access_token && res.ApiKey && res.token_type) {
        this.setState({ isLoading: false });
        setCookie("authorization", res.access_token);
        setCookie("ApiKey", res.ApiKey);
        setCookie("token_type", res.token_type);
        this.props.history.push("/");
      } else {
        Modal.warning({
          title: "提示",
          content: "登录出错了，请刷新后重试!!"
        });
      }
    });
  }

  render() {
    const { username, password, errmsg } = this.state;

    let { isLoading } = this.state;

    return (
      <div className="loginwarp">
        <div className="container">
          <form className="login">
            <p className="title">管理系统</p>
            {errmsg ? (
              <div className="err">
                <Icon
                  type="close-circle-o"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.setState({
                      errmsg: ""
                    });
                  }}
                />
                <span>{errmsg}</span>
              </div>
            ) : null}
            <Input
              id="user"
              value={username ? username : ""}
              placeholder="账户"
              addonBefore={
                <i>
                  <img src={user} alt="" />
                </i>
              }
              onChange={e => {
                this.setState({
                  username: e.target.value
                });
              }}
            />
            <Input
              onChange={e => {
                this.setState({
                  password: e.target.value
                });
              }}
              type="password"
              value={password ? password : ""}
              placeholder="密码"
              addonBefore={
                <i>
                  <img src={pass} alt="" />
                </i>
              }
            />
            <Button
              key="submit"
              size="large"
              loading={isLoading}
              onClick={this.handleClick.bind(this)}
            >
              登录
            </Button>
            <div className="bottom-font">
              <img src={loginfont} alt="" />
            </div>
          </form>
          <div className="img">
            <img className="picture" src={picture} alt="" />
            <div className="word">
              <img src={login_word1} alt="" className="word1" />
              <img src={login_seal} alt="" className="seal" />
            </div>
            <img src={login_word2} alt="" className="word2" />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state.login;

  return {
    user: user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
