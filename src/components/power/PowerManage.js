import React, { Component } from "react";
import {
  Input,
  Select,
  Table,
  Button,
  Icon,
  Modal,
  Form,
  // Checkbox,
  // Tabs,
  Alert
} from "antd";
// import { Api } from "../.././server/_ajax.js";
import edit_icon from "../../image/edit.svg";
import look_icon from "../../image/look.svg";
import delete_icon from "../../image/delete.svg";
// const TabPane = Tabs.TabPane;
const Option = Select.Option;
// const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
// const api = new Api();
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 }
};
class PowerManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      platform_id: "",
      permission_id: "",
      platName: "",
      PermissList: [],
      kw: "",
      platList: [],
      loading: false,
      locale: {
        emptyText: "没有相关数据"
      },
      isAdd: false,
      isLook: false,
      us_id: "",
      us_id_status: "",
      addEditVisible: false,
      noChoice: false,
      message: "",
      page_size: 20,
      page_num: 1,
      total_size: 0
    };
  }

  componentWillMount() {
    this.setColumn();
  }

  componentDidMount() {
    this.getPermissList();
  }

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
                  platform_id: val,
                  page_num: 1,
                  page_size: 20
                },
                () => {
                  this.getPermissList();
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
            placeholder="请输入权限名称、标识"
            value={this.state.kw}
            style={{ width: "200px" }}
            onChange={e => {
              this.setState(
                {
                  kw: e.target.value
                },
                () => this.getPermissList()
              );
            }}
          />
        </div>

        {/*查询和清空*/}
        <div className="params" style={{ marginRight: "60px" }}>
          <Button
            className="search-btn"
            onClick={() => {
              this.getPermissList();
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
                () => this.getPermissList()
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
    const columns = [
      {
        title: "用户名",
        dataIndex: "user_name",
        key: "user_name"
      },
      {
        title: "用户密码更新时间",
        dataIndex: "user_password_update_time",
        key: "user_password_update_time"
      },
      {
        title: "角色名称",
        dataIndex: "up_name",
        key: "up_name"
      },
      {
        title: "电话",
        dataIndex: "user_phone",
        key: "user_phone"
      },
      {
        title: "权限名称",
        dataIndex: "ur_name",
        key: "ur_name"
      },
      {
        title: "菜单ID",
        dataIndex: "um_id",
        key: "um_id"
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
                  //  this.getPermissDetail(a.permission_id)
                  this.setState({
                    //  permission_id:a.permission_id,
                    modalTitle: "权限编辑"
                  });
                }}
              />
              <img
                src={delete_icon}
                className="role_action"
                alt=""
                onClick={() => {
                  Modal.confirm({
                    title: "确定要删除该权限？",
                    okText: "确定",
                    cancelText: "取消",
                    onOk: () => {
                      this.deletePermiss(a.us_id);
                    }
                  });
                }}
              />
              <img
                src={look_icon}
                className="role_action"
                alt=""
                onClick={() => {
                  this.getPermissDetail(a.us_id);
                  this.setState({
                    us_id: a.us_id,
                    modalTitle: "权限查看",
                    isLook: true
                  });
                }}
              />
            </div>
          );
        }
      }
    ];
    this.setState({
      columns
    });
  }
  //获取角色权限列表
  getPermissList() {
    const { page_num, page_size } = this.state;
    let obj = {};
    obj.page_num = page_num;
    obj.page_size = page_size;

    this.setState({
      // loading:true
    });
  }
  getPermissDetail(us_id) {
    this.setState({
      addEditVisible: true,
      isAdd: false
    });
  }
  // 编辑和添加弹窗
  addEditModal() {
    const {
      modalTitle,
      addEditVisible,
      us_id,
      us_id_status,
      noChoice
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
                保存
              </Button>
            )}
          </div>
        }
      >
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <i>*</i>权限
            </span>
          }
          validateStatus={us_id_status}
        >
          <Input
            placeholder="请输入权限"
            className="input"
            disabled={this.state.isLook}
            value={us_id}
            onChange={e => {
              this.setState({
                us_id: e.target.value
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
    );
  }

  clearForm() {
    this.setState({
      addEditVisible: false,
      us_id: "",
      us_id_status: "",
      um_code: "",
      parent_id: "",
      um_code_status: "",
      um_title_en: "",
      um_title_en_status: "",
      um_title: "",
      um_title_status: "",
      um_url: "",
      um_url_status: "",
      um_system: "wms",
      um_system_status: "",
      isLook: false
    });
  }

  handleModelOk() {
    const { isAdd, us_id } = this.state;

    if (!us_id) {
      this.setState({
        noChoice: true,
        message: "您还没有输入权限！",
        us_id_status: "error"
      });
      window.setTimeout(() => {
        this.setState({
          noChoice: false
        });
      }, 5000);
      return;
    }
    if (isAdd) {
      //判断新增还是编辑查看
    } else {
    }
  }
  /* 操作-删除 */
  deletePermiss(id) {}

  render() {
    return (
      <div className="power">
        {!this.state.visible ? (
          <div>
            <div className="add_btns">
              <Button
                className="add_btn"
                onClick={() => {
                  this.setState({
                    addEditVisible: true,
                    modalTitle: "权限新增",
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
                dataSource={this.state.PermissList}
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
                        this.getPermissList();
                      }
                    );
                  },
                  onShowSizeChange: (current, size) => {
                    this.setState(
                      {
                        page_size: size
                      },
                      () => {
                        this.getPermissList();
                      }
                    );
                  },
                  total: this.state.total_size
                }}
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
                            this.getPermissList();
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

export default PowerManage;
