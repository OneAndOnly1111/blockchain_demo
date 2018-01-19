let url = window.location.href;
url = url.split("/")
console.log("common-muenu-url", url[3]);
let path = url[3];
const menuData = [{
  name: '视频上传',
  icon: 'cloud-upload-o',
  path: 'video/upload',
  hideInMenu: false,
  // hideInMenu: !path || path == 'copyright' ? false : true
}, {
  name: '视频发布',
  icon: 'upload',
  path: 'video/release',
  hideInMenu: false,
  // hideInMenu: path == 'normalUser' || path == 'purchaseRecord' ? false : true
}, {
  name: '分享解析',
  // icon: 'video-camera',  calculator
  icon: 'retweet',
  path: 'video/analyse',
  hideInMenu: false,
  // hideInMenu: path == 'normalUser' || path == 'purchaseRecord' ? false : true
}, {
  name: '购买记录',
  icon: 'pay-circle-o',
  path: 'video/purchased',
  hideInMenu: false,
  // hideInMenu: path == 'normalUser' || path == 'purchaseRecord' ? false : true
}];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    const result = {
      ...item,
      path: `${parentPath}${item.path}`,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);