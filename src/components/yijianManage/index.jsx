import React, { Component } from "react";
import { Modal, Table } from "antd";
// 引入编辑器样式
import { Api } from "../../server/_ajax";
import { apiList2 } from "../../server/apiMap";
import moment from "moment";
const api = new Api();
class YijianManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cate: "意见箱",
      locale: {
        emptyText: "没有相关数据"
      },
      lookModal: false,
      data: [],
      loading: false,
      modalContent: ""
    };
  }

  componentDidMount = () => {
    this.getList();
  };

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

  getList() {
    const { cate, currentPage, pageSize } = this.state;
    this.setState({
      loading: true
    });

    let data = { currentPage, limit: pageSize };
    if (cate !== "all") {
      data.cate = cate;
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

  render() {
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
              {/* <a
                href="javascript:'"
                onClick={() => {
                  this.props.history.push({
                    pathname: "/messageCreate",
                    params: { info: a }
                  });
                }}
              >
                修改
              </a> */}
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

    return (
      <div className="content admin" style={{ paddingBottom: "30px" }}>
        <div>
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
      </div>
    );
  }
}

export default YijianManage;
