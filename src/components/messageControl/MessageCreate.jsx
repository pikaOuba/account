import React, { Component } from "react";
import { Input, Button, Select, Breadcrumb, Modal, Upload, Icon } from "antd";
import BraftEditor from "braft-editor";
import { ContentUtils } from "braft-utils";
import { Link } from "react-router-dom";
// 引入编辑器样式
import "braft-editor/dist/index.css";
import { Api } from "../../server/_ajax";
import $ from "jquery";
import { apiList2, serverPath2 } from "../../server/apiMap";
// const serverPath2 = "https://news.cnshanzhi.com";

const api = new Api();
const Option = Select.Option;
class MessageCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      title: "",
      description: "",
      cate: "",
      subCate: "",
      islook: false,
      isSave: false,
      editorState: BraftEditor.createEditorState(null),
      cateList: [],
      subCateObj: {},
      id: ""
    };
  }

  componentDidMount = () => {
    this.getCateList();
    if (
      this.props.history.location &&
      this.props.history.location.params &&
      this.props.history.location.params.info
    ) {
      let { info, islook } = this.props.history.location.params;
      this.setState({
        id: info.id,
        editorState: BraftEditor.createEditorState(info.content),
        cate: info.cate,
        subCate: info.subCate,
        title: info.title,
        description: info.description,
        islook: islook
      });
    }
    $("#show").click(function(e) {
      if (e.target.className) {
        if (
          e.target.className == "show_content" ||
          e.target.offsetParent.className == "show_content"
        ) {
          return;
        } else {
          $("#show").css("width", 0);
          $("#show").css("height", 0);
          $("#show").css("background", "rgba(0,0,0,0)");
        }
      } else {
        if (
          e.target.offsetParent &&
          e.target.offsetParent.className &&
          e.target.offsetParent.className == "show_content"
        ) {
          return;
        } else {
          $("#show").css("width", 0);
          $("#show").css("height", 0);
          $("#show").css("background", "rgba(0,0,0,0)");
        }
      }
    });
  };
  getCateList() {
    api.$get(apiList2.getCateList.path, null, res => {
      let ary1 = [],
        sub = {};
      let cateList = res.categoryList || [];
      cateList.map(a => {
        if (ary1.indexOf(a.cate) === -1) {
          ary1.push(a.cate);
        }
        if (a.subCate) {
          if (sub[a.cate]) {
            if (sub[a.cate].indexOf(a.subCate) === -1) {
              sub[a.cate].push(a.subCate);
            }
          } else {
            sub[a.cate] = [a.subCate];
          }
        }
      });
      this.setState({
        cateList: ary1,
        subCateObj: sub
      });
    });
  }
  textSave = () => {
    let { cate, description, title, subCate, id } = this.state;
    let content = this.state.editorState.toHTML();
    if (title.length == 0) {
      this.setState({
        isSave: false
      });
      Modal.warning({
        title: "提示：",
        content: "请填写标题！"
      });
      return;
    }
    if (content == "") {
      this.setState({
        isSave: false
      });
      Modal.warning({
        title: "提示：",
        content: "请填写标题！"
      });
      return;
    }
    let data = {
      cate,
      title,
      description,
      content: `${content}`
    };
    if (subCate) {
      data.subCate = subCate;
    }
    if (id) {
      api.$postJSON(apiList2.updateMessage.path, { ...data, id }, res => {
        this.setState({
          isSave: false
        });
        if (res.code === 0) {
          Modal.success({
            content: "消息修改成功！",
            onOk: () => {
              this.props.history.push("/messageManage");
            }
          });
        }
      });
    } else {
      api.$postJSON(apiList2.addMessage.path, { ...data }, res => {
        this.setState({
          isSave: false
        });
        if (res.code === 0) {
          Modal.success({
            content: "消息创建成功！"
          });
          this.clearInfo();
        }
      });
    }
  };

  showBtn = () => {
    let { islook, isSave } = this.state;

    return !islook ? (
      <div style={{ display: "inline-block" }}>
        <Button
          onClick={() => {
            // if (isSave) return;
            this.textSave();
          }}
        >
          确定
        </Button>
      </div>
    ) : (
      <div style={{ display: "inline-block" }}>
        <Button
          className="save"
          onClick={() => {
            this.props.history.go(-1);
          }}
        >
          返回
        </Button>
      </div>
    );
  };
  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML();
    console.log(htmlContent);
    this.setState({
      editorState: htmlContent
    });
  };

  handleEditorChange = editorState => {
    if (this.state.islook) return;
    this.setState({ editorState });
  };
  uploadHandler = param => {
    if (!param.file) {
      return false;
    }
    if (param.file.status === "done") {
      let res = param.file.response;
      if (res.code === 0) {
        this.setState({
          editorState: ContentUtils.insertMedias(this.state.editorState, [
            {
              type: "IMAGE",
              url: serverPath2 + res.data.filePath
            }
          ])
        });
      }
    }
  };
  uploadVideoHandler = param => {
    if (!param.file) {
      return false;
    }
    if (param.file.status === "done") {
      let res = param.file.response;

      if (res.code === 0) {
        this.setState({
          editorState: ContentUtils.insertMedias(this.state.editorState, [
            {
              type: "VIDEO",
              url: serverPath2 + res.data.filePath
            }
          ])
        });
      }
    }
  };
  uploadFileHandler = param => {
    if (!param.file) {
      return false;
    }
    if (param.file.status === "done") {
      let res = param.file.response;
      if (res.code === 0) {
        this.setState({
          editorState: ContentUtils.insertHTML(
            this.state.editorState,
            `<a href="${serverPath2 + res.data.filePath}" download="${
              param.file.name
            }">${param.file.name}</a>`
          )
        });
      }
    }
  };
  clearInfo() {
    this.setState({
      name: "",
      title: "",
      description: "",
      cate: "",
      subCate: "",
      isSave: false,
      editorState: BraftEditor.createEditorState(null)
    });
  }
  render() {
    const {
      name,
      cateList,
      cate,
      subCate,
      description,
      islook,
      isSave,
      subCateObj,
      title
    } = this.state;
    const controls = [
      "undo",
      "redo",
      "separator",
      "font-size",
      "line-height",
      "letter-spacing",
      "separator",
      "text-color",
      "bold",
      "italic",
      "underline",
      "strike-through",
      "separator",
      "superscript",
      "subscript",
      "remove-styles",
      "emoji",
      "separator",
      "text-indent",
      "text-align",
      "separator",
      "headings",
      "list-ul",
      "list-ol",
      "blockquote",
      /*  'code', */ "separator",
      "link",
      "separator",
      "hr",
      "separator",
      "separator",
      "clear"
    ];
    const extendControls = [
      {
        key: "antd-uploader",
        type: "component",
        component: (
          <div style={{ display: "inline-block" }}>
            <Upload
              accept="image/*"
              name="file"
              action={apiList2.uploadFile.path}
              showUploadList={false}
              transformFile="File"
              onChange={this.uploadHandler}
              // customRequest={this.uploadHandler}
            >
              {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
              <button
                type="button"
                className="control-item button upload-button"
                data-title="插入图片"
              >
                <Icon type="picture" theme="filled" />
              </button>
            </Upload>
            <Upload
              style={{ display: "inline-block" }}
              accept="video/*"
              showUploadList={false}
              name="file"
              action={apiList2.uploadFile.path}
              transformFile="File"
              onChange={this.uploadVideoHandler}
            >
              {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
              <button
                type="button"
                className="control-item button upload-button"
                data-title="插入视频"
              >
                <Icon type="play-square" theme="filled" />
              </button>
            </Upload>
            <Upload
              style={{ display: "inline-block" }}
              accept="pdf/doc/docx/xls/xlsx/*"
              showUploadList={false}
              name="file"
              action={apiList2.uploadFile.path}
              transformFile="File"
              onChange={this.uploadFileHandler}
            >
              {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
              <button
                type="button"
                className="control-item button upload-button"
                data-title="插入文件"
              >
                <Icon type="file" theme="filled" />
              </button>
            </Upload>
          </div>
        )
      }
    ];
    return (
      <div className="content imgtext imgtext-img admin plat">
        <Breadcrumb
          separator=">"
          style={{ textAlign: "left", marginBottom: "7px" }}
        >
          <Breadcrumb.Item>
            <Link to="/messageManage">消息管理</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>创建/修改消息</Breadcrumb.Item>
        </Breadcrumb>
        <div className="textarea">
          <div className="author" style={{ textAlign: "left" }}>
            <span style={{ width: "120px", display: "inline-block" }}>
              分类：
            </span>
            <Select
              disabled={islook}
              onChange={val => {
                if (!islook) {
                  this.setState({
                    cate: val,
                    subCate: ""
                  });
                }
              }}
              value={cate + ""}
            >
              {cateList.map((a, b) => {
                return (
                  <Option key={b} value={a}>
                    {a}
                  </Option>
                );
              })}
            </Select>
          </div>
          {subCateObj[cate] ? (
            <div className="author" style={{ textAlign: "left" }}>
              <span style={{ width: "120px", display: "inline-block" }}>
                二级分类：
              </span>
              <Select
                disabled={islook}
                onChange={val => {
                  this.setState({
                    subCate: val
                  });
                }}
                value={subCate}
              >
                {subCateObj[cate].map((a, b) => {
                  return (
                    <Option key={b} value={a}>
                      {a}
                    </Option>
                  );
                })}
              </Select>
            </div>
          ) : null}
          <div
            className="name"
            style={{ marginBottom: "15px", textAlign: "left" }}
          >
            <span style={{ width: "120px", display: "inline-block" }}>
              标题：
            </span>
            <Input
              placeholder="输入文章标题"
              disabled={islook}
              style={{ width: "18%" }}
              value={title}
              maxLength={20}
              onChange={e => {
                this.setState({
                  title: e.target.value,
                  name: `<div class="title">${e.target.value}</div>`
                });
              }}
            />
          </div>
          <div
            className="name"
            style={{ marginBottom: "15px", textAlign: "left" }}
          >
            <span style={{ width: "120px", display: "inline-block" }}>
              描述：
            </span>
            <Input
              placeholder="输入描述"
              disabled={islook}
              style={{ width: "18%" }}
              value={description}
              maxLength={20}
              onChange={e => {
                this.setState({
                  description: e.target.value
                });
              }}
            />
          </div>
          <BraftEditor
            style={{ border: "1px solid #ccc" }}
            value={this.state.editorState}
            onChange={this.handleEditorChange}
            onSave={this.submitContent}
            controls={controls}
            extendControls={extendControls}
            colors={[
              "#000000",
              "#333333",
              "#666666",
              "#999999",
              "#cccccc",
              "#ffffff",
              "#61a951",
              "#16a085",
              "#07a9fe",
              "#003ba5",
              "#8e44ad",
              "#f32784",
              "#c0392b",
              "#d35400",
              "#f39c12",
              "#fdda00",
              "#7f8c8d",
              "#2c3e50"
            ]}
          />
          <div className="action_btn">
            <Button
              onClick={() => {
                let txt = this.state.editorState.toHTML();

                let inner = `<div class="text">${name} <div class="inner"> ${txt}</div></div><div class="show_action"><button id="close">关闭</button></div>`;

                $("#show .show_content").html(inner);
                $("#show").css("width", "100%");
                $("#show").css("height", "100%");
                $("#show").css("background", "rgba(0,0,0,.6)");
              }}
            >
              预览
            </Button>
            {this.showBtn()}
          </div>
        </div>
        <div id="show">
          <div className="show_content"></div>
        </div>
      </div>
    );
  }
}

export default MessageCreate;
