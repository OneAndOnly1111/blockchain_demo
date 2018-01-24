import React from "react";
import { Button, Modal, Icon, Form } from "antd";
import $ from "jquery";
import { userID, password } from "../../utils/utils";

class VideoWrapper extends React.Component {
  state = {
    visible: this.props.visible
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
            <video src={this.props.playUrl} type="video/mp4" autoPlay="autoPlay" controls="controls" height="600" width="950"></video>
          </div>
        </Modal>
      </div>
    );
  }
}

const VideoPlay = Form.create()(VideoWrapper);
export default VideoPlay