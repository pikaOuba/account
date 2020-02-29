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
  Tabs,
  Alert
} from "antd";
import { Api } from "../.././server/_ajax.js";
import edit_icon from "../../image/edit.svg";
import look_icon from "../../image/look.svg";
import delete_icon from "../../image/delete.svg";
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const api = new Api();
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 }
};
class RoleManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      platform_id: "",
      role_id: "",
      platName: "",
      platList: [],
      kw: "",
      roleList: [],
      loading: false,
      locale: {
        emptyText: "没有相关数据"
      },
      isAdd: true,
      isLook: false,
      role_name: "",
      rolename_status: "",
      role_flag: "",
      roleflag_status: "",
      permissionsList: [],
      permissionsAllList: [],
      permissionsOption: [],
      Indeterminate1: true,
      CheckAll: false,
      addEditVisible: false,
      noChoice: false,
      message: ""
    };
  }

  componentWillMount() {
    this.setColumn();
  }

  getRoleList() {
    this.setState({
      loading: true,
      locale: {
        emptyText: "没有相关数据"
      }
    });
    const { kw, platform_id } = this.state;
    let obj = {};
    obj.platform_id = platform_id;
    if (kw) {
      obj.kw = kw;
    }
  }
  //获取权限列表
  getPermissionList() {}
  topBar() {
    return (
      <div className="search-title" style={{ minWidth: "1170px" }}>
        {/*平台*/}
        <div className="params params-20" style={{ minWidth: "97px" }}>
          <span>平台：</span>
          <Select
            value={this.state.platform_id + ""}
            style={{ width: 200 }}
            onChange={val => {
              this.setState(
                {
                  platform_id: val
                },
                () => {
                  this.getRoleList();
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
          </Select>
        </div>
        {/*关键字*/}
        <div className="params params-20" style={{ minWidth: "170px" }}>
          <span>关键字：</span>
          <Input
            placeholder="请输入角色、权限"
            value={this.state.kw}
            style={{ width: "200px" }}
            onChange={e => {
              this.setState(
                {
                  kw: e.target.value
                },
                () => this.getRoleList()
              );
            }}
          />
        </div>

        {/*查询和清空*/}
        <div className="params" style={{ marginRight: "60px" }}>
          <Button
            className="search-btn"
            onClick={() => {
              this.getRoleList();
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
                  kw: ""
                },
                () => this.getRoleList()
              );
            }}
          >
            清空
          </Button>
        </div>
      </div>
    );
  }
  setColumn() {
    const { formData } = this.state;
    const columns = [
      {
        title: "序号",
        dataIndex: "index",
        key: "index"
      },
      {
        title: "操作",
        key: "action",
        width: 118,
        render: a => {
          return (
            <div>
              <img
                src={edit_icon}
                className="role_action"
                alt=""
                onClick={() => {
                  this.getRoleDetail(a.role_id);
                  this.getPermissionList();
                  this.setState({
                    role_id: a.role_id,
                    modalTitle: "角色编辑"
                  });
                }}
              />
              <img
                src={delete_icon}
                className="role_action"
                alt=""
                onClick={() => {
                  Modal.confirm({
                    title: "确定要删除该角色？",
                    okText: "确定",
                    cancelText: "取消",
                    onOk: () => {
                      this.deleteRole(a.role_id);
                    }
                  });
                }}
              />
              <img
                src={look_icon}
                className="role_action"
                alt=""
                onClick={() => {
                  this.getRoleDetail(a.role_id);
                  this.setState({
                    role_id: a.role_id,
                    modalTitle: "角色查看",
                    isLook: true
                  });
                }}
              />
            </div>
          );
        }
      },
      {
        title: "角色",
        dataIndex: "role_name",
        key: "role_name"
      },
      {
        title: "角色标识",
        dataIndex: "role_flag",
        key: "role_flag"
      },
      {
        title: "权限",
        key: "permissions",
        render: a => {
          let ary = a.permissions,
            str = "",
            ary2 = [];

          if (ary.length > 0) {
            ary.map(a => {
              ary2.push(a.permission_name);
            });
          }
          str = ary.length > 0 ? ary2.join(",") : "";
          return str;
        }
      }
    ];
    this.setState({
      columns
    });
  }
  //角色详情
  getRoleDetail(role_id) {}
  // 编辑和添加
  addEditModal() {
    const {
      modalTitle,
      addEditVisible,
      role_name,
      role_flag,
      permissionsAllList,
      permissionsList,
      permissionsOption,
      roleflag_status,
      rolename_status,
      noChoice
    } = this.state;
    return (
      <Modal
        title={modalTitle}
        wrapClassName="role_modal column"
        width={"940px"}
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
                保存
              </Button>
            )}
          </div>
        }
      >
        <div>
          <div className="modal_title">基本信息</div>
          <div className="params" style={{ marginTop: "10px" }}>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  <i>*</i>角色名称
                </span>
              }
              validateStatus={rolename_status}
            >
              <Input
                placeholder="请输入角色名称"
                className="input"
                disabled={this.state.isLook}
                value={role_name}
                onChange={e => {
                  this.setState({
                    role_name: e.target.value
                  });
                }}
              />
            </FormItem>
          </div>
          <div className="params">
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  <i>*</i>角色标识
                </span>
              }
              validateStatus={roleflag_status}
            >
              <Input
                placeholder="2-12个英文字母"
                className="input"
                value={role_flag}
                disabled={this.state.isLook}
                onChange={e => {
                  this.setState({
                    role_flag: e.target.value
                  });
                }}
              />
            </FormItem>
          </div>
        </div>
        <div>
          <div className="modal_title">设置权限</div>
          <div className="warp" style={{ marginTop: "10px" }}>
            <div style={{ marginBottom: "6px" }}>
              <Checkbox
                indeterminate={this.state.Indeterminate1}
                disabled={this.state.isLook}
                onChange={e => {
                  this.setState({
                    permissionsList: e.target.checked ? permissionsAllList : [],
                    Indeterminate1: false,
                    CheckAll: e.target.checked
                  });
                }}
                checked={this.state.CheckAll}
              >
                全选
              </Checkbox>
            </div>
            <CheckboxGroup
              options={permissionsOption}
              value={permissionsList}
              disabled={this.state.isLook}
              onChange={checkedList => {
                this.setState({
                  permissionsList: checkedList,
                  Indeterminate1:
                    !!checkedList.length &&
                    checkedList.length < permissionsOption.length,
                  CheckAll: checkedList.length === permissionsOption.length
                });
              }}
            />
          </div>
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

  clearForm() {
    this.setState({
      addEditVisible: false,
      role_name: "",
      rolename_status: "",
      role_flag: "",
      roleflag_status: "",
      permissionsList: [],
      CheckAll: false,
      isLook: false
    });
  }
  handleModelOk() {
    const {
      isAdd,
      role_flag,
      role_name,
      permissionsList,
      platform_id,
      role_id
    } = this.state;

    if (!role_name) {
      this.setState({
        noChoice: true,
        message: "您还没有输入角色名称！",
        rolename_status: "error"
      });
      window.setTimeout(() => {
        this.setState({
          noChoice: false
        });
      }, 5000);
      return;
    }
    if (!role_flag) {
      this.setState({
        noChoice: true,
        message: "您还没有输入角色标识！",
        roleflag_status: "error"
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
      let permission_ids = permissionsList.join(",");
      /*  api.$post(  '/api/account/create_role/',{permission_ids,platform_id,role_name,role_flag},(res)=>{
                if (!res.errmsg){
                    this.setState({
                        addEditVisible:false
                    })
                    Modal.success({
                        title:'提示',
                        content:'角色创建成功！',
                        onOk:()=>{
                            this.getRoleList()
                            this.clearForm()
                        }
                    })
                }else{
                        this.setState({
                            noChoice:true,
                            message:res.errmsg
                        })
                        window.setTimeout(()=>{
                            this.setState({
                                noChoice:false,
                            })
                        },5000)
                }
            }) */
    } else {
      let permission_ids = permissionsList.join(",");
      /*  api.$post(  '/api/account/role_detail/',{permission_ids,platform_id,role_name,role_flag,role_id},(res)=>{
                if (!res.errmsg){
                    this.setState({
                        addEditVisible:false
                    })
                    Modal.success({
                        title:'提示',
                        content:'角色修改成功！',
                        onOk:()=>{
                            this.getRoleList()
                            this.clearForm()
                        }
                    })
                }else{
                    this.setState({
                        noChoice:true,
                        message:res.errmsg
                    })
                    window.setTimeout(()=>{
                        this.setState({
                            noChoice:false,
                        })
                    },5000)
                }
            }) */
    }
  }
  deleteRole(id) {}
  render() {
    return (
      <div className="role">
        {!this.state.visible ? (
          <div>
            <div className="add_btns">
              <Button
                className="add_btn"
                onClick={() => {
                  this.getPermissionList();
                  this.setState({
                    addEditVisible: true,
                    modalTitle: "角色新增",
                    isAdd: true
                  });
                }}
              >
                <Icon type="plus" />
                新增
              </Button>
            </div>

            {this.topBar()}
            <div className="tableWarp">
              <Table
                columns={this.state.columns}
                dataSource={this.state.roleList}
                bordered
                loading={this.state.loading}
                locale={this.state.locale}
                pagination={false}
              />
            </div>
            {this.addEditModal()}
          </div>
        ) : (
          <div className="modalWarp">
            <div className="chooseModal">
              {this.state.platList.length > 0 ? (
                this.state.platList.map((a, b) => {
                  return (
                    <div
                      key={b + ""}
                      style={{
                        width: "280px",
                        height: "38px",
                        lineHeight: "38px",
                        margin: "0 auto 20px",
                        borderRadius: "4px",
                        textAlign: "center",
                        backgroundColor: "#16b8be",
                        color: "#fff",
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        this.setState(
                          {
                            visible: false,
                            platName: a.platform_name,
                            platform_id: a.platform_id
                          },
                          () => {
                            this.getRoleList();
                          }
                        );
                      }}
                    >
                      {a.platform_name}
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: "center" }}>请先创建平台！</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default RoleManage;
