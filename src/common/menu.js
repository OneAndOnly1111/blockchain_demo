let url = window.location.href;
url = url.split("/")
console.log("url", url[3]);
let path = url[3];
const menuData = [{
  name: '视频管理',
  icon: 'video-camera',
  path: 'copyright',
  hideInMenu: !path || path == 'copyright' ? false : true
}, {
  name: '在线视频',
  icon: 'video-camera',
  path: 'normalUser',
  hideInMenu: path == 'normalUser' || path == 'purchaseRecord' ? false : true
}, {
  name: '购买记录',
  icon: 'pay-circle',
  path: 'purchaseRecord',
  hideInMenu: path == 'normalUser' || path == 'purchaseRecord' ? false : true
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