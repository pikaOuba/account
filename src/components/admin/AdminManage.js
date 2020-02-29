import React, { Component } from "react";
import {
  Input,
  Select,
  Table,
  Button,
  Icon,
  Modal,
  Form,
  Col,
  Checkbox,
  Radio,
  Row,
  Alert
} from "antd";
import { Api } from "../../server/_ajax.js";
import { apiList1 } from "../../server/apiMap.js";
const api = new Api();
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 }
};
class AdminManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page_num: 1,
      page_size: 20,
      total_size: "",
      platform_id: " ",
      user_id: "",
      kw: "",
      userList: [],
      loading: false,
      locale: {
        emptyText: "没有相关数据"
      },
      addEditVisible: false,
      modalTitle: "用户新建",
      isAdd: true,
      formData: {
        user_id: "",
        password: "",
        password_status: "",
        name: "",
        name_status: "",
        phone: "",
        phone_status: "",
        isCompany: false,
        status: true,
        isEdit: false
      },
      money: 0,
      money_status: "",
      money_message: "",
      money_id: "",
      columns: [],
      moneyVisible: false,
      platList: [],
      noChoice: false,
      message: ""
    };
  }

  componentDidMount() {
    this.getData();
    this.setColumn();
  }

  setColumn() {
    // const { formData } = this.state;
    const columns = [
      {
        title: "会员名称",
        dataIndex: "Name",
        key: "Name"
      },
      {
        title: "手机号",
        dataIndex: "Mobile",
        key: "Mobile"
      },
      {
        title: "是否公司号",
        dataIndex: "IsCompany",
        key: "IsCompany",
        render: record => {
          return record ? "是" : "否";
        }
      },
      {
        title: "启用状态",
        key: "IsEnabled",
        dataIndex: "IsEnabled",
        render: record => {
          return record ? "是" : "否";
        }
      },
      {
        title: "账户余额",
        key: "Balance",
        dataIndex: "Balance"
      },
      {
        title: "操作",
        key: "action",
        render: a => {
          return (
            <Row type="flex" justify="space-around">
              <Col
                span={6}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  this.getUserDetail(a);
                }}
              >
                编辑
              </Col>
              <Col
                span={6}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  this.deleteMember(a.Id);
                }}
              >
                删除
              </Col>
              <Col
                span={6}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  this.setState({
                    money: a.Balance,
                    money_id: a.Id,
                    moneyVisible: true
                  });
                }}
              >
                余额修改
              </Col>
            </Row>
          );
        }
      }
    ];
    this.setState({
      columns
    });
  }
  /* 获取会员详情 */
  getUserDetail(userData) {
    let { formData } = this.state;
    console.log(userData);
    formData.isEdit = true;
    formData.password = userData.Password;
    formData.user_id = userData.Id;
    formData.name = userData.Name;
    formData.status = userData.IsEnabled;
    formData.phone = userData.Mobile;
    formData.isCompany = userData.IsCompany;
    this.setState(
      {
        formData
      },
      () => {
        this.setState({
          modalTitle: "用户编辑",
          addEditVisible: true,
          isAdd: false
        });
      }
    );
  }
  /* 跳到下一个输入框 */
  focusNextInput(e) {
    var inputs = document.getElementsByClassName("input");

    for (var i = 0; i < inputs.length; i++) {
      if (i === inputs.length - 1) {
        inputs[0].focus();
        break;
      } else if (e.target === inputs[i]) {
        inputs[i + 1].focus();
        break;
      }
    }
  }
  /* 搜索条 */
  topBar() {
    return (
      <div className="search-title" style={{ minWidth: "1170px" }}>
        {/*平台*/}
        <div className="params params-20" style={{ minWidth: "97px" }}>
          <span>平台：</span>
          <Select
            value={this.state.platform_id + ""}
            style={{ width: "200px" }}
            onChange={val => {
              this.setState(
                {
                  platform_id: val
                },
                () => {
                  this.getData();
                }
              );
            }}
          >
            {this.state.platList.map(a => {
              return (
                <Option value={a.platform_id + ""} key={a.platform_id + ""}>
                  {a.platform_name}
                </Option>
              );
            })}
            <Option value=" ">全部</Option>
          </Select>
        </div>
        {/*关键字*/}
        <div className="params params-20" style={{ minWidth: "170px" }}>
          <span>关键字：</span>
          <Input
            placeholder="姓名、账号、手机号"
            value={this.state.kw}
            style={{ width: "200px" }}
            onChange={e => {
              this.setState(
                {
                  kw: e.target.value
                },
                () => {
                  this.getData();
                }
              );
            }}
          />
        </div>

        {/*查询和清空*/}
        <div className="params" style={{ marginRight: "60px" }}>
          <Button
            className="search-btn"
            onClick={() => {
              this.getData();
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
                  kw: "",
                  platform_id: " "
                },
                () => this.getData()
              );
            }}
          >
            清空
          </Button>
        </div>
      </div>
    );
  }
  /* 获取列表 */
  getData() {
    this.setState({
      // loading:true,
      locale: {
        emptyText: "没有相关数据"
      }
    });

    const {  kw, page_size, page_num } = this.state;
    let obj = { pageSize: page_size, pageIndex: page_num, key: kw };

    api.$post(apiList1.memberList.path, obj, res => {
      this.setState({
        userList: res.Items,
        total_size: res.total
      });
    });
  }
  // 编辑和添加弹窗
  addEditModal() {
    const { modalTitle, addEditVisible, formData } = this.state;

    return (
      <Modal
        title={modalTitle}
        wrapClassName="admin_modal column"
        width={"520px"}
        visible={addEditVisible}
        onCancel={this.handleModelCancel.bind(this)}
        footer={
          <div className="action">
            <Button
              style={{ backgroundColor: "transparent" }}
              onClick={this.handleModelCancel.bind(this)}
            >
              关闭
            </Button>
            <Button
              className=" add_btn"
              onClick={this.handleModelOk.bind(this)}
            >
              保存
            </Button>
          </div>
        }
      >
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <i>*</i>姓名
            </span>
          }
          validateStatus={formData.name_status}
        >
          <Input
            placeholder="请输入姓名"
            className="input"
            onPressEnter={e => this.focusNextInput(e)}
            value={formData.name}
            onChange={e => {
              formData.name = e.target.value;
              this.setState({
                formData
              });
            }}
          />
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <i>*</i>手机号
            </span>
          }
          validateStatus={formData.phone_status}
        >
          <Input
            placeholder="请输入正确手机号"
            className="input"
            onPressEnter={e => this.focusNextInput(e)}
            value={formData.phone}
            onChange={e => {
              if (e.target.value.length > 11) {
                this.setState({
                  noChoice: true,
                  message: "手机号不能超过11位",
                  platform_name_status: "error"
                });
                window.setTimeout(() => {
                  this.setState({
                    noChoice: false
                  });
                }, 1500);

                return;
              }

              formData.phone = e.target.value;
              this.setState({
                formData
              });
            }}
          />
        </FormItem>
        {!formData.isEdit ? (
          <FormItem
            {...formItemLayout}
            label={
              <span>
                <i>*</i>密码
              </span>
            }
            validateStatus={formData.password_status}
          >
            <Input
              placeholder="请输入密码"
              disabled={formData.isEdit}
              className="input"
              onPressEnter={e => this.focusNextInput(e)}
              value={formData.password}
              onChange={e => {
                formData.password = e.target.value;
                this.setState({
                  formData
                });
              }}
            />
          </FormItem>
        ) : null}

        <FormItem
          {...formItemLayout}
          label={
            <span>
              <i>*</i>是否为公司号
            </span>
          }
        >
          <Row>
            <Checkbox
              style={{ marginRight: "30px" }}
              checked={formData.isCompany}
              onChange={e => {
                this.setState({
                  formData: {
                    ...formData,
                    isCompany: e.target.checked
                  }
                });
              }}
            ></Checkbox>
          </Row>
        </FormItem>
        <FormItem {...formItemLayout} label="启用状态">
          <RadioGroup
            onChange={e => {
              formData.status = e.target.value;
              this.setState({
                formData
              });
            }}
            value={formData.status}
          >
            <Radio value={true}>正常</Radio>
            <Radio value={false}>停用</Radio>
          </RadioGroup>
        </FormItem>
        {this.state.noChoice ? (
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
  /* 取消保存 */
  handleModelCancel() {
    this.clearCreateForm();
    this.setState({
      addEditVisible: false
    });
  }
  /* 清除表单 */
  clearCreateForm() {
    let { formData } = this.state;
    formData.user_id = "";
    formData.password = "";
    formData.password_status = "";
    formData.name = "";
    formData.name_status = "";
    formData.phone = "";
    formData.phone_status = "";
    formData.status = true;
    formData.isCompany = false;
    formData.isEdit = false;
    this.setState({
      formData
    });
  }
  /* 保存 */
  handleModelOk() {
    const { isAdd, formData } = this.state;

    if (!formData.name) {
      this.setState({
        noChoice: true,
        message: "您还没有输入姓名！",
        platform_name_status: "error"
      });
      window.setTimeout(() => {
        this.setState({
          noChoice: false
        });
      }, 5000);
      return;
    }
    if (!formData.phone) {
      this.setState({
        noChoice: true,
        message: "您还没有输入手机号！",
        platform_name_status: "error"
      });
      window.setTimeout(() => {
        this.setState({
          noChoice: false
        });
      }, 5000);
      return;
    }
    if (!formData.password) {
      this.setState({
        noChoice: true,
        message: "您还没有输入密码！",
        platform_name_status: "error"
      });
      window.setTimeout(() => {
        this.setState({
          noChoice: false
        });
      }, 5000);
      return;
    }
    if (isAdd) {
      /*创建新用户*/
      let { password, name, phone, status, isCompany } = formData;
      api.$post(
        apiList1.createMember.path,
        {
          password,
          name,
          mobile: phone,
          isEnabled: status,
          isCompany: isCompany
        },
        res => {
          if (res.Success) {
            this.setState({
              addEditVisible: false,
              page_num: 1
            });
            this.clearCreateForm();
            Modal.success({
              title: "提示",
              content: "账号创建成功！",
              onOk: () => {
                this.getData();
              }
            });
          }
        }
      );
    } else {
      let { password, name, phone, status, user_id, isCompany } = formData;
      api.$post(
        apiList1.updateMember.path,
        {
          Id: user_id,
          name,
          mobile: phone,
          isEnabled: status,
          isCompany,
          password
        },
        res => {
          if (res.Success) {
            this.clearCreateForm();
            this.setState({
              addEditVisible: false
            });
            Modal.success({
              title: "提示",
              content: "账号修改成功！",
              onOk: () => {
                this.getData();
              }
            });
          } else {
            Modal.warning({
              title: "提示",
              content: res.Msg
            });
          }
        }
      );
    }
  }
  /* 删除用户 */
  deleteMember(id) {
    Modal.warning({
      title: "提示",
      content: "确定删除当前账户？",
      onOk: () => {
        api.$post(
          apiList1.deleteMember.path + "/" + id,
          { membrId: id },
          res => {
            if (res.Success) {
              Modal.success({
                title: "提示",
                content: "账号删除成功！",
                onOk: () => {
                  this.getData();
                }
              });
            } else {
              Modal.warning({
                title: "提示",
                content: res.Msg
              });
            }
          }
        );
      }
    });
  }
  //余额修改弹窗
  moneyModal() {
    let { money, money_status, money_message } = this.state;
    return (
      <Modal
        title="余额修改"
        wrapClassName="admin_modal column"
        width={"520px"}
        visible={this.state.moneyVisible}
        onCancel={() => {
          this.setState({
            moneyVisible: false,
            money_message: "",
            money_status: "",
            money: ""
          });
        }}
        footer={
          <div className="action">
            <Button
              style={{ backgroundColor: "transparent" }}
              onClick={() => {
                this.setState({
                  moneyVisible: false,
                  money_message: "",
                  money_status: "",
                  money: ""
                });
              }}
            >
              关闭
            </Button>
            <Button
              className=" add_btn"
              onClick={this.handleMoneyModelOk.bind(this)}
            >
              保存
            </Button>
          </div>
        }
      >
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <i>*</i>账户余额
            </span>
          }
          validateStatus={money_status}
          help={money_message}
        >
          <Input
            placeholder="请输入余额"
            className="input"
            value={money}
            onChange={e => {
              this.setState({
                money: e.target.value,
                money_message: "",
                money_status: ""
              });
            }}
          />
        </FormItem>
      </Modal>
    );
  }
  /* 余额修改 */
  handleMoneyModelOk() {
    const { money, money_id } = this.state;
    if (money === "") {
      this.setState({
        money_status: "error",
        money_message: "请输入账户余额！"
      });
      return;
    }
    api.$post(
      apiList1.changeAccount.path + "/" + money_id,
      { Id: money_id, money: parseFloat(money) },
      res => {
        if (res.Success) {
          this.clearCreateForm();
          this.setState({
            moneyVisible: false
          });
          Modal.success({
            title: "提示",
            content: "账号余额修改成功！",
            onOk: () => {
              this.getData();
            }
          });
        } else {
          Modal.warning({
            title: "提示",
            content: res.Msg
          });
        }
      }
    );
  }
  /* 重置密码 */
  resetPasswd(user_id) {
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
    const addBtnStyle = {
      position: "initial"
    };
    return (
      <div className="admin">
        <div className="add_btns">
          <Button
            className="add_btn"
            style={{
              ...addBtnStyle,

              marginRight: "10px"
            }}
            onClick={() => {
              this.setState({
                addEditVisible: true,
                modalTitle: "用户新建",
                isAdd: true
              });
            }}
          >
            <Icon type="plus" />
            新增
          </Button>
          <Button
            className="add_btn"
            style={{
              ...addBtnStyle
            }}
            onClick={() => {
              this.setState({
                addEditVisible: true,
                modalTitle: "创建公司账号",
                isAdd: true
              });
            }}
          >
            <Icon type="plus" />
            新增公司账号
          </Button>
        </div>

        {this.topBar()}
        <div className="tableWarp">
          <Table
            columns={this.state.columns}
            rowKey="Id"
            dataSource={this.state.userList}
            bordered
            loading={this.state.loading}
            locale={this.state.locale}
            pagination={{
              current: this.state.page_num,
              pageSize: this.state.page_size,
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: page => {
                this.setState(
                  {
                    page_num: page
                  },
                  () => {
                    this.getData();
                  }
                );
              },
              onShowSizeChange: (current, size) => {
                this.setState(
                  {
                    page_size: size
                  },
                  () => {
                    this.getData();
                  }
                );
              },
              total: this.state.total_size
            }}
          />
        </div>
        {this.addEditModal()}
        {this.moneyModal()}
      </div>
    );
  }
}

export default AdminManage;
