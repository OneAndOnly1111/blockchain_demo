import React from "react";
import { Button, Modal, Icon, Form } from "antd";
import $ from "jquery";
import styles from "./VideoPurchased.less";
import { userID, password } from "../../utils/utils";

class VideoWrapper extends React.Component {
  state = {
    visible: this.props.visible
  }

  //视频分享modal显示
  showModal = (record) => {
    this.setState({
      visible: true,
    });
    $.ajax({
      url: `/video/${record.id}?userID=${userID}&password=${password}`,
      contentType: 'application/json',
      success: () => {
        $.ajax({
          url: `/oss/${userID}/${record.name}`,
          contentType: 'application/json',
          success: (res) => {

          },
          error: (err) => {
            message.error(`播放失败！CMS ${err.status}: ${err.statusText}`);
          },
        })
      },
      error: (err) => {
        message.error(`HIA鉴权失败！HIA ${err.status}: ${err.statusText}`);
      },
    });
  }

  handleCancel = (e) => {
    this.props.playVisibleChange(false)
  }

  render() {
    console.log("props", this.props);
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          title="视频播放"
          width={1000}
          footer={null}
          destroyOnClose
          visible={this.props.visible}
          onCancel = {this.handleCancel}
        >
          <div>
            <video src={this.props.playUrl} autoPlay="autoPlay" controls="controls" height="500" width="900"></video>
          </div>
        </Modal>
      </div>
    );
  }
}

const VideoPlay = Form.create()(VideoWrapper);
export default VideoPlay