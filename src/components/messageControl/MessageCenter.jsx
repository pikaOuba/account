import React, { Component } from "react";
import {
  Input,
  Button,
  Select,
  Collapse,
  Modal,
  Row,
  Col,
  Icon,
  Tabs,
  Table
} from "antd";
// 引入编辑器样式
import { Api } from "../../server/_ajax";
import $ from "jquery";
import { apiList2, serverPath2 } from "../../server/apiMap";
import moment from "moment";
const { TabPane } = Tabs;
const api = new Api();
const Option = Select.Option;
class MessageCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addCateVisible: false,
      loading: true,
      cateLoading: true,
      isAddSub: false,
      addCate: "",
      addSubCate: "",
      addErrMsg: "",
      addErr: false,
      cateObject: {},
      cateAry: [],
      subCateObj: {},
      // cateMsgObj: {},
      cate: "all",
      subCate: "all",
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      subCateList: [],
      data: [],
      cateEdit: false,
      cateId: "",
      locale: {
        emptyText: "没有相关数据"
      },
      lookModal: false
    };
  }

  componentDidMount = () => {
    this.getCateList();
    this.getList();
  };
  /* 获取消息列表 */
  getList() {
    const { cate, subCate, currentPage, pageSize } = this.state;
    this.setState({
      loading: true
    });

    let data = { currentPage, limit: pageSize };
    if (cate !== "all") {
      data.cate = cate;
    }
    if (subCate !== "all") {
      data.subCate = subCate;
    }
    api.$get(apiList2.getMessageList.path, { ...data }, res => {
      let list = res.messageList || [];
      this.setState({
        data: [...list],
        totalCount: res.totalCount || 0,
        loading: false
      });
    });
  }
  /* 删除消息 */
  deleteMsg(id) {
    Modal.confirm({
      title: "提示",
      content: "确定删除此消息？",
      cancelText: "取消",
      onOk: () => {
        api.$post(apiList2.deleteMessage.path, { id }, res => {
          if (res.code === 0) {
            Modal.success({
              content: "删除成功！"
            });
            this.getList();
          } else {
            Modal.error({
              content: res.message
            });
          }
        });
      }
    });
  }
  /* 获取分类列表 */
  getCateList() {
    // let { cateMsgObj } = this.state;
    this.setState({
      cateLoading: true
    });
    api.$get(apiList2.getCateList.path, null, res => {
      let ary1 = [],
        cateObj = {},
        sub = {};
      let list = res.categoryList || [];
      list.map(a => {
        if (ary1.indexOf(a.cate) === -1) {
          ary1.push(a.cate);
          cateObj[a.id] = a.cate;
          // cateMsgObj[a.cate] = { currentPage: 1, limit: 20, list: [] };
        }
        if (a.subCate) {
          sub[a.cate]
            ? sub[a.cate].push(a.subCate)
            : (sub[a.cate] = [a.subCate]);
        }
      });
      this.setState({
        cateObject: cateObj,
        subCateObj: sub,
        cateAry: [...list],
        cateLoading: false
        // cateMsgObj
      });
    });
  }
  /* 添加分类 */
  addCate() {
    const { addCate, addSubCate, isAddSub } = this.state;
    let data = {
      cate: addCate
    };
    if (addSubCate) {
      data.subCate = addSubCate;
    }
    if (!isAddSub) {
      api.$postJSON(apiList2.addCate.path, { cate: addCate }, res => {
        if (res.code === 0) {
          if (addSubCate) {
            api.$postJSON(apiList2.addCate.path, data, res => {
              if (res.code === 0) {
                this.setState({
                  addCateVisible: false,
                  addCate: "",
                  addSubCate: ""
                });
                Modal.success({
                  content: "添加成功"
                });
                this.getCateList();
              } else {
                Modal.error({
                  content: res.message
                });
              }
            });
          } else {
            this.setState({
              addCateVisible: false,
              addCate: "",
              addSubCate: ""
            });
            Modal.success({
              content: "添加成功"
            });
            this.getCateList();
          }
        } else {
          Modal.error({
            content: res.message
          });
        }
      });
    } else {
      api.$postJSON(apiList2.addCate.path, data, res => {
        if (res.code === 0) {
          this.setState({
            addCateVisible: false,
            addCate: "",
            addSubCate: ""
          });
          Modal.success({
            content: "添加成功"
          });
          this.getCateList();
        } else {
          Modal.error({
            content: res.message
          });
        }
      });
    }
  }
  /* 更新分类 */
  updateCate() {
    const { addCate, addSubCate, isAddSub, cateId } = this.state;
    let data = {
      cate: addCate
    };
    if (addSubCate) {
      data.subCate = addSubCate;
    }
    if (!isAddSub) {
      api.$postJSON(
        apiList2.updateCate.path,
        { id: cateId, cate: addCate, subCate: null },
        res => {
          if (res.code === 0) {
            this.setState({
              addCateVisible: false,
              addCate: "",
              addSubCate: "",
              cateId: "",
              cateEdit: false
            });
            Modal.success({
              content: "修改成功"
            });
            this.getCateList();
          } else {
            Modal.error({
              content: res.message
            });
          }
        }
      );
    } else {
      api.$postJSON(
        apiList2.updateCate.path,
        { id: cateId, cate: addCate, subCate: addSubCate },
        res => {
          if (res.code === 0) {
            this.setState({
              addCateVisible: false,
              addCate: "",
              addSubCate: "",
              cateId: "",
              cateEdit: false
            });
            Modal.success({
              content: "修改成功"
            });
            this.getCateList();
          } else {
            Modal.error({
              content: res.message
            });
          }
        }
      );
    }
  }
  /* 删除分类 */
  deleteCate(item) {
    Modal.confirm({
      title: "提示",
      content: item.subCate
        ? "确定删除此二级分类？"
        : "一级分类删除后所属二级分类也将删除，确定删除此一级分类？",
      cancelText: "取消",
      onOk: () => {
        if (item.subCate) {
          api.$post(
            apiList2.deleteSubCate.path + "?id=" + item.id,
            /* { id: item.id } */ null,
            res => {
              if (res.code === 0) {
                Modal.success({
                  content: "删除成功！"
                });
                this.getCateList();
              } else {
                Modal.error({
                  content: res.message
                });
              }
            }
          );
        } else {
          api.$post(apiList2.deleteCate.path, { cate: item.cate }, res => {
            if (res.code === 0) {
              Modal.success({
                content: "删除成功！"
              });
              this.getCateList();
            } else {
              Modal.error({
                content: res.message
              });
            }
          });
        }
      }
    });
  }
  /* 添加分类弹窗 */
  addCateModal() {
    let {
      addCate,
      addSubCate,
      addErr,
      addErrMsg,
      isAddSub,
      cateObject,
      subCateObj,
      cateEdit
    } = this.state;
    return (
      <Modal
        visible={this.state.addCateVisible}
        onCancel={() => {
          this.setState({
            addCateVisible: false,
            addCate: "",
            addSubCate: "",
            addErrMsg: "",
            addErr: false
          });
        }}
        title="添加分类"
        footer={
          <div>
            <Button
              onClick={() => {
                let arr = [];
                Object.keys(cateObject).map(id => {
                  arr.push(cateObject[id]);
                });
                if (addCate === "" || !addCate) {
                  this.setState({
                    addErr: true,
                    addErrMsg: "请输入一级分类！"
                  });
                  return;
                }
                if (!isAddSub && arr.indexOf(addCate) !== -1) {
                  Modal.error({
                    content: "已存在此一级分类！"
                  });
                  return;
                }
                if (
                  subCateObj[addCate] &&
                  subCateObj[addCate].indexOf(addSubCate) !== -1
                ) {
                  Modal.error({
                    content: "已存在此二级分类！"
                  });
                  return;
                }
                if (cateEdit) {
                  this.updateCate();
                } else {
                  this.addCate();
                }
              }}
            >
              确定
            </Button>
          </div>
        }
      >
        <Row style={{ marginBottom: "20px" }}>
          <Col span={4}>一级分类：</Col>
          <Col span={20}>
            {isAddSub ? (
              <Select
                defaultValue={addCate}
                disabled={cateEdit}
                style={{ width: "100%" }}
                onChange={value => {
                  this.setState({
                    addCate: value,
                    addErr: false,
                    addErrMsg: ""
                  });
                }}
              >
                {Object.keys(cateObject).map(a => {
                  return (
                    <Option value={cateObject[a]} key={a}>
                      {cateObject[a]}
                    </Option>
                  );
                })}
              </Select>
            ) : (
              <Input
                value={addCate}
                onChange={e => {
                  this.setState({
                    addCate: e.target.value,
                    addErr: false,
                    addErrMsg: ""
                  });
                }}
              ></Input>
            )}
          </Col>
        </Row>
        {cateEdit && !isAddSub ? null : (
          <Row>
            <Col span={4}>二级分类：</Col>
            <Col span={20}>
              <Input
                value={addSubCate}
                onChange={e => {
                  this.setState({
                    addSubCate: e.target.value,
                    addErr: false,
                    addErrMsg: ""
                  });
                }}
              ></Input>
            </Col>
          </Row>
        )}

        {addErr ? <span style={{ color: "red" }}>{addErrMsg}</span> : null}
      </Modal>
    );
  }

  render() {
    const { cateObject, subCateObj, cateAry } = this.state;

    const colnums = [
      {
        title: "标题",
        dataIndex: "title",
        key: "title"
      },
      {
        title: "分类",
        dataIndex: "cate",
        key: "cate"
      },
      {
        title: "二级分类",
        dataIndex: "subCate",
        key: "subCate"
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description"
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        key: "createTime",
        render: a => {
          return moment(a).format("YYYY-MM-DD");
        }
      },
      {
        title: "操作",
        key: "action",
        render: a => {
          return (
            <div>
              <a
                href="javascript:'"
                key="list-loadmore-edit"
                onClick={() => {
                  this.deleteMsg(a.id);
                }}
              >
                删除
              </a>
              <a
                href="javascript:'"
                onClick={() => {
                  this.props.history.push({
                    pathname: "/messageCreate",
                    params: { info: a }
                  });
                }}
              >
                修改
              </a>
              <a
                href="javascript:'"
                onClick={() => {
                  this.setState({
                    modalContent: a.content,
                    lookModal: true
                  });
                }}
              >
                查看内容
              </a>
            </div>
          );
        }
      }
    ];
    const cateColumns = [
      {
        title: "一级分类",
        dataIndex: "cate",
        key: "cate"
      },
      {
        title: "二级分类",
        dataIndex: "subCate",
        key: "subCate"
      },
      {
        title: "操作",
        key: "action",
        render: a => {
          return (
            <div>
              <a
                href="javascript:'"
                key="list-loadmore-edit"
                onClick={() => {
                  this.deleteCate(a);
                }}
              >
                删除
              </a>
              <a
                href="javascript:'"
                onClick={() => {
                  if (a.subCate) {
                    this.setState({
                      addCateVisible: true,
                      isAddSub: true,
                      cateEdit: true,
                      cateId: a.id,
                      addSubCate: a.subCate,
                      addCate: a.cate
                    });
                  } else {
                    this.setState({
                      addCateVisible: true,
                      isAddSub: false,
                      cateEdit: true,
                      cateId: a.id,
                      addCate: a.cate
                    });
                  }
                }}
              >
                修改
              </a>
            </div>
          );
        }
      }
    ];
    return (
      <div className="content" style={{ paddingBottom: "30px" }}>
        <div className="add_btns">
          <Button
            style={{
              display: "inline-block",
              marginBottom: "10px",
              marginRight: "10px"
            }}
            onClick={() => {
              this.setState({
                addCateVisible: true,
                isAddSub: false,
                cateEdit: false,
                cateId: ""
              });
            }}
          >
            <Icon type="plus" />
            添加分类
          </Button>
          <Button
            style={{
              display: "inline-block",
              marginBottom: "10px",
              marginRight: "10px"
            }}
            onClick={() => {
              this.setState({
                addCateVisible: true,
                isAddSub: true,
                cateEdit: false,
                cateId: ""
              });
            }}
          >
            <Icon type="plus" />
            添加二级分类
          </Button>
          <Button
            style={{
              display: "inline-block",
              marginBottom: "10px",
              marginRight: "10px"
            }}
            onClick={() => {
              this.props.history.push("/messageCreate");
            }}
          >
            <Icon type="plus" />
            新建消息
          </Button>
          <Button
            style={{
              display: "inline-block",
              marginBottom: "10px",
              marginRight: "10px"
            }}
            onClick={() => {
              this.props.history.push("/bannerEdit");
            }}
          >
            banner图修改
          </Button>
        </div>
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="消息列表" key="1">
            <div>
              <div className="search-title" style={{ minWidth: "1170px" }}>
                {/*一级分类*/}
                <div className="params params-20" style={{ minWidth: "97px" }}>
                  <span>一级分类：</span>
                  <Select
                    value={this.state.cate}
                    style={{ width: "200px" }}
                    onChange={val => {
                      let list;
                      if (val !== "all") {
                        list = subCateObj[val] ? [...subCateObj[val]] : [];
                      }
                      this.setState({
                        cate: val,
                        subCateList: [...list]
                      });
                    }}
                  >
                    {Object.keys(cateObject).map(a => {
                      return (
                        <Option value={cateObject[a]} key={a}>
                          {cateObject[a]}
                        </Option>
                      );
                    })}

                    <Option value="all">全部</Option>
                  </Select>
                </div>
                {/*二级分类*/}
                <div className="params params-20" style={{ minWidth: "97px" }}>
                  <span>二级分类：</span>
                  <Select
                    value={this.state.subCate}
                    style={{ width: "200px" }}
                    onChange={val => {
                      this.setState({
                        subCate: val
                      });
                    }}
                  >
                    {this.state.subCateList.map(a => {
                      return (
                        <Option value={a + ""} key={a + ""}>
                          {a}
                        </Option>
                      );
                    })}
                    <Option value="all">全部</Option>
                  </Select>
                </div>

                {/*查询和清空*/}
                <div className="params" style={{ marginRight: "60px" }}>
                  <Button
                    className="search-btn"
                    onClick={() => {
                      this.getList();
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
                          cate: "",
                          subCate: " "
                        },
                        () => this.getList()
                      );
                    }}
                  >
                    清空
                  </Button>
                </div>
              </div>

              <div className="tableWarp">
                <Table
                  columns={colnums}
                  rowKey="id"
                  dataSource={this.state.data}
                  bordered
                  loading={this.state.loading}
                  locale={this.state.locale}
                  pagination={{
                    current: this.state.currentPage,
                    pageSize: this.state.pageSize,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    onChange: page => {
                      this.setState(
                        {
                          currentPage: page
                        },
                        () => {
                          this.getList();
                        }
                      );
                    },
                    onShowSizeChange: (current, size) => {
                      this.setState(
                        {
                          pageSize: size,
                          currentPage: 1
                        },
                        () => {
                          this.getList();
                        }
                      );
                    },
                    total: this.state.totalCount
                  }}
                />
              </div>
            </div>
          </TabPane>
          <TabPane tab="分类列表" key="2">
            <div className="tableWarp">
              <Table
                columns={cateColumns}
                rowKey="id"
                dataSource={cateAry}
                bordered
                loading={this.state.cateLoading}
                locale={this.state.locale}
                pagination={false}
              />
            </div>
          </TabPane>
        </Tabs>
        ,
        <Modal
          visible={this.state.lookModal}
          footer={null}
          title="消息详情"
          onCancel={() => {
            this.setState({
              lookModal: false
            });
          }}
          width={800}
        >
          <div dangerouslySetInnerHTML={{ __html: this.state.modalContent }} />
        </Modal>
        {this.addCateModal()}
      </div>
    );
  }
}

export default MessageCenter;
