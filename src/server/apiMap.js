const serverPath = "https://company.cnshanzhi.com:8005/";
// const serverPath2 = "http://118.25.155.176";
// const serverPath2 = "https://news.cnshanzhi.com";
const serverPath2 = "https://company.cnshanzhi.com";
const serverPath3 = "http://jiekou.4980.cn/action.php";
const serverPath4 = "http://jiekou.4980.cn/upload.php";
let uploadServerPath = "http://jiekou.4980.cn/";

const isDev = process.env.NODE_ENV === "development";
const apiList1 = {
  login: {
    path: "/token"
  },
  memberList: {
    path: "/api/member/pagedlist"
  },
  createMember: {
    path: "/api/member/create"
  },
  updateMember: {
    path: "/api/member/update"
  },
  deleteMember: {
    path: "/api/member/delete"
  },
  changeAccount: {
    path: "/api/memberAccount/change"
  }
};
const apiList2 = {
  //获取所有消息列表
  getMessageList: {
    path: "/api/message/getList"
  },
  //上传图片视频
  uploadFile: {
    path: "/api/upload"
  },
  //添加消息
  addMessage: {
    path: "/api/message/add"
  },
  //删除消息
  deleteMessage: {
    path: "/api/message/delete"
  },
  //删除消息
  updateMessage: {
    path: "/api/message/update"
  },
  //获取消息分类（入门指引，在线学习等）
  getCateList: {
    path: "/api/category/getAll"
  },
  //添加分类
  addCate: {
    path: "/api/category/add"
  },
  //添加分类
  updateCate: {
    path: "/api/category/update"
  },
  //删除一级分类
  deleteCate: {
    path: "/api/category/deleteCate"
  },
  //删除二级分类
  deleteSubCate: {
    path: "/api/category/delete"
  },
  //多个添加banner
  addBannerList: {
    path: "/api/banner/addList"
  },
  updateBannerList: {
    path: "/api/banner/updateList"
  },
  addBanner: {
    path: "/api/banner/add"
  },
  updateBanner: {
    path: "/api/banner/update"
  },
  // 获取全部banner
  getBannerList: {
    path: "/api/banner/getAll"
  }
};
const apiList3 = {
  getOrders : {//获取订单
  }
};

const apiList4 = {
  //上传图片视频
  uploadFile: {
    path: ""
  },
}

if (!isDev) {
  Object.keys(apiList1).forEach(key => {
    apiList1[key].path = serverPath + apiList1[key].path;
  });
  Object.keys(apiList2).forEach(key => {
    apiList2[key].path = serverPath2 + apiList2[key].path;
  });
  Object.keys(apiList3).forEach(key => {
    apiList3[key].path = serverPath3;
  });
  Object.keys(apiList4).forEach(key => {
    apiList4[key].path = serverPath4 + apiList4[key].path;
  });
  uploadServerPath = serverPath2; // 正式环境图片上传后拼接地址
} else {
  Object.keys(apiList1).forEach(key => {
    apiList1[key].path = "/server1" + apiList1[key].path;
  });
  Object.keys(apiList2).forEach(key => {
    apiList2[key].path = "/server2" + apiList2[key].path;
  });
  Object.keys(apiList3).forEach(key => {
    apiList3[key].path = serverPath3;
  });
  Object.keys(apiList4).forEach(key => {
    apiList4[key].path = "/server4" + apiList4[key].path;
  });
  uploadServerPath = "http://jiekou.4980.cn/";
}
export { apiList1, apiList2, apiList3, apiList4, serverPath2, serverPath4, uploadServerPath };
