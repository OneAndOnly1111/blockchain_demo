const menuData = [{
  name: '视频上传',
  icon: 'upload',
  path: 'video/upload',
  hideInMenu: false,
}, {
  name: '发布列表',
  icon: 'profile',
  path: 'video/release',
  hideInMenu: false,
}, {
  name: '解析购买',
  icon: 'pay-circle-o',
  path: 'video/purchased',
  hideInMenu: false,
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