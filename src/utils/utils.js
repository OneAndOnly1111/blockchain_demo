import $ from "jquery";
export const userID = localStorage.getItem("userID");
export const password = localStorage.getItem("password");
export const node = localStorage.getItem("node");

export const getUserInfo = () => {
  $.ajax({
    url: `/record/user?userID=${userID}&password=${password}`,
    contentType: 'application/json',
    success: (res) => {
      console.log("users-info", res)
      if (res.users) {
        let balance = res.users[0].balance;
        let userName = res.users[0].UserName;
        return {
          balance: balance,
          userName: userName
        }
      }
    }
  });
}