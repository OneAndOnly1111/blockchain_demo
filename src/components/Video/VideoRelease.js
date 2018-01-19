import React from "react";
import { Button, Modal, Table, Row, Col, Icon, Badge, Input, Form, message, Divider } from "antd";
import $ from "jquery";
import styles from "./VideoRelease.less";
const FormItem = Form.Item;
// const userID = 1111111125;

const userID = 1111111125 || localStorage.getItem("userID");
const password = localStorage.getItem("password");

class VideoWrapper extends React.Component {

  state = {
    dataSource: [],
    visible: false,
    loading: true,
  }

  getVideos = () => {
    $.ajax({
      url: `/record/videos?indexType=uploadRecord&userID=${userID}`,
      contentType: 'application/json',
      success: (res) => {
        if (res) {
          let result = [];
          res.uploadRecord.map((item, index) => {
            result.push({
              ...item,
              key: index
            })
          });
          this.setState({
            dataSource: result,
            loading: false
          });
        }
      }
    })
  }

  componentDidMount() {
    this.getVideos();
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        $.ajax({
          url: `/videos/${values.videoID}`,
          type: 'post',
          data: JSON.stringify({
            userID: values.userID,
            videoName: values.videoName,
            url: values.url
          }),
          statusCode: {
            200: (xhr) => {
              console.log("上传成功！")
              message.success('上传成功！');
              this.getVideos();
            },
            500: (xhr) => {
              console.log("上传失败！500")
              message.error(`statusCode:500,上传失败！`);
            },
            400: (xhr) => {
              console.log("上传失败！400")
              message.error(`statusCode:400,上传失败！`);
            }
          },
          success: (res) => {
            if (res == {}) { message.success("上传成功！") };
          },
        });
        this.getVideos();
        this.setState({
          visible: false,
        });
      }
    });

  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  onReleaseVideo = (videoID, videoName) => {
    $.ajax({
      url: `/videos/${videoID}`,
      type: 'post',
      data: JSON.stringify({
        "videoName": videoName,
        "userID": userID,
        "password": password
      }),
      statusCode: {
        200: (xhr) => {
          console.log("上传成功！")
          message.success('上传成功！');
        },
        500: (xhr) => {
          message.error(`statusCode:500,上传失败！`);
        },
        400: (xhr) => {
          message.error(`statusCode:400,上传失败！`);
        }
      },
    })
  }

  onPlayVideo = (videoID) => {
    $.ajax({
      url: `/videos/${videoID}?${userID}`,
      contentType: "application/json",
      statusCode: {
        200: (xhr) => {
          console.log("下架成功！")
          message.success('下架成功！');
        },
        500: (xhr) => {
          console.log("下架失败！500")
          message.error(`statusCode:500,下架失败！`);
        },
        400: (xhr) => {
          console.log("上传失败！400")
          message.error(`statusCode:400,下架失败！`);
        }
      },
    });
  }

  onRemoveVideo = (userID, videoID) => {
    $.ajax({
      url: `/videos/${videoID}`,
      contentType: "application/json",
      type: 'delete',
      data: JSON.stringify({
        userID: userID,
      }),
      statusCode: {
        200: (xhr) => {
          console.log("下架成功！")
          message.success('下架成功！');
          this.getVideos();
        },
        500: (xhr) => {
          console.log("下架失败！500")
          message.error(`statusCode:500,下架失败！`);
        },
        400: (xhr) => {
          console.log("上传失败！400")
          message.error(`statusCode:400,下架失败！`);
        }
      },
    });
    // this.getVideos();
  }

  render() {
    const columns = [{
      title: 'videoID',
      dataIndex: 'videoID',
      key: 'videoID',
    }, {
      title: 'videoName',
      dataIndex: 'videoName',
      key: 'videoName',
    }, {
      title: 'uploadTime',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
    }, {
      title: 'releaseTime',
      dataIndex: 'releaseTime',
      key: 'releaseTime',
    }, {
      title: 'price',
      dataIndex: 'price',
      key: 'price',
    }, {
      title: 'buys',
      dataIndex: 'buys',
      key: 'buys',
    }, {
      title: '收益',
      dataIndex: 'money',
      key: 'money',
    }, {
      title: 'option',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => (
        <span>
          <a onClick={()=>{this.onPlayVideo(record.videoID)}}>播放</a>
          <Divider type="vertical" />
          <a onClick={()=>{this.onReleaseVideo(record.videoID,record.videoName)}}>分享</a>
          <Divider type="vertical" />
          <a onClick={()=>{this.onRemoveVideo(record.userID,record.videoID)}}>下架</a>
        </span>
      ),
    }];
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div>
        <Row type={'flex'} justify="center">
          <Col span={23} style={{fontSize:14+'px',marginTop:24+'px'}}>
            <Icon type="video-camera" style={{marginRight:8+'px'}} />已发布视频列表
          </Col>
          <Col span={23} style={{paddingTop:12+'px',borderBottom:1+'px'+' solid'+' #e9e9e9'}}></Col>
          <Col span={23} style={{fontSize:14+'px',marginTop:24+'px'}}>
            <Table dataSource={this.state.dataSource} columns={columns} loading={this.state.loading} />
          </Col>
        </Row>
        <Modal
          destroyOnClose
          title="视频上传"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="userID"
            >
              {getFieldDecorator('userID', {
                initialValue:userID,
                rules: [{
                  required: true, message: 'Please input your userID!',
                }],
                })(
                  <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="videoID"
            >
               {getFieldDecorator('videoID', {
                rules: [{
                  required: true, message: 'Please input your videoID!',
                }],
                })(
                  <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="videoName"
            >
              {getFieldDecorator('videoName', {
                rules: [{
                  required: true, message: 'Please input your videoName!',
                }],
                })(
                  <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="url"
            >
              {getFieldDecorator('url', {
                rules: [{
                  required: true, message: 'Please input your url!',
                }],
                })(
                  <Input />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

const VideoRelease = Form.create()(VideoWrapper);
export default VideoRelease