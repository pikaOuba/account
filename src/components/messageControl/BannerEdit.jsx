import React, { Component } from "react";
import { Button, Modal, Icon, Upload } from "antd";

// 引入编辑器样式
import { Api } from "../../server/_ajax";
import { apiList2, serverPath2 } from "../../server/apiMap";

const api = new Api();
class BannerEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerList: [],
      isBannerChange: false,
      startLength: 0
    };
  }

  componentDidMount = () => {
    this.getBanner();
  };
  getBanner() {
    api.$get(apiList2.getBannerList.path, null, res => {
      this.setState({
        bannerList: res.bannerList,
        startLength: res.bannerList.length
      });
    });
  }

  uploadHandler = param => {
    if (!param.file) {
      return false;
    }
    if (param.file.status === "done") {
      let res = param.file.response;
      if (res.code === 0) {
        this.addBanner({ imgUrl: serverPath2 + res.data.filePath });
      }
    }
  };

  bannerUpdate() {
    let { bannerList, startLength } = this.state;
    let path;
    if (startLength === 0) {
      path = apiList2.addBannerList.path;
    } else {
      path = apiList2.updateBannerList.path;
    }
    api.$postJSON(path, [...bannerList], res => {
      if (res.code === 0) {
        Modal.success({
          content: "保存成功"
        });
      }
    });
  }
  addBanner(obj) {
    api.$postJSON(apiList2.addBanner.path, obj, res => {
      if (res.code === 0) {
        Modal.success({
          content: "添加成功！"
        });
        this.getBanner();
      }
    });
  }
  updateBanner(id, param) {
    if (!param.file) {
      return false;
    }
    if (param.file.status === "done") {
      let res = param.file.response;
      if (res.code === 0) {
        api.$postJSON(
          apiList2.updateBanner.path,
          { id, imgUrl: serverPath2 + res.data.filePath },
          res => {
            if (res.code === 0) {
              Modal.success({
                content: "修改成功！"
              });
              this.getBanner();
            }
          }
        );
      }
    }
  }
  render() {
    const { bannerList } = this.state;

    return (
      <div className="content admin" style={{ paddingBottom: "30px" }}>
        <div style={{ marginTop: "20px" }}>
          <Upload
            accept="image/*"
            name="file"
            action={apiList2.uploadFile.path}
            showUploadList={false}
            transformFile="File"
            onChange={this.uploadHandler}
            // listType="picture"
            // fileList={bannerList}
            // customRequest={this.uploadHandler}
          >
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <Button type="button" className="control-item button upload-button">
              <Icon type="upload" />
              添加banner图
            </Button>
          </Upload>
          {bannerList.map((a, b) => {
            return (
              <div
                key={b}
                style={{
                  textAlign: "left",
                  margin: "10px 0",
                  background: "#fff",
                  padding: "10px",
                  borderRadius: "4px"
                }}
              >
                <img
                  src={a.imgUrl}
                  alt=""
                  style={{
                    width: "400px",
                    borderRadius: "4px",
                    marginRight: "30px"
                  }}
                />
                <Upload
                  accept="image/*"
                  name="file"
                  action={apiList2.uploadFile.path}
                  showUploadList={false}
                  transformFile="File"
                  onChange={this.updateBanner.bind(this, a.id)}
                  // listType="picture"
                  // fileList={bannerList}
                  // customRequest={this.uploadHandler}
                >
                  {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                  <Button
                    type="button"
                    className="control-item button upload-button"
                  >
                    更改图片
                  </Button>
                </Upload>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default BannerEdit;
