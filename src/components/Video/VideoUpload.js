import React from "react";
import { Button, Modal, Table, Row, Col, Icon, Badge, Input, Form, message, Divider, Upload } from "antd";
import $ from "jquery";
import styles from "./VideoUpload.less";
import { userID, password } from "../../utils/utils";
import mock from "../../../mock/uploadedVideoList.json";
const FormItem = Form.Item;
const dataSource = [{
  key: 7,
  id: 7,
  name: "kkk2.flv",
  pp: "",
  owner: "zxy",
  create_time: "2017-12-28T00:00:00+08:00",
  modify_time: "2018-01-17T14:39:06+08:00",
  modify_time: 0,
  modify_time: 1
}, {
  key: 6,
  id: 6,
  name: "test.flv",
  pp: "test.jpg",
  owner: "zxy",
  create_time: "2017-12-24T00:00:00+08:00",
  modify_time: "2018-01-17T14:39:06+08:00",
  modify_time: 1,
  modify_time: 1
}];



class VideoWrapper extends React.Component {
  state = {
    dataSource: dataSource,
    visible: false,
    loading: false,
  }

  //获取已上传的视频列表
  getVideos = () => {
    $.ajax({
      url: '/action.do',
      type: 'post',
      data: JSON.stringify({
        type: 'find',
        msg: {
          mtype: userID,
          msg: {
            owner: userID
          }
        }
      }),
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

  //上传视频
  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll([null], (err, values) => {
      console.log("this.state.file", this.state.file);
      // const { name } = this.state.file;
      if (!err) {
        $.ajax({
          // url: 'http://test-zxy-yunshang.oss-cn-beijing.aliyuncs.com/oss/zxy/test.mp4',
          url: `/oss/zxy/test.mp4`,
          type: 'put',
          contentType: 'video/mpeg4',
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

  //发布视频
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

  //播放视频
  onPlayVideo = (videoID) => {
    $.ajax({
      url: `/videos/${videoID}?${userID}`,
      contentType: "application/json",
      statusCode: {
        200: (xhr) => {
          message.success('播放视频');
        },
        500: (xhr) => {
          message.error(`statusCode:500,播放失败！`);
        },
        400: (xhr) => {
          console.log("上传失败！400")
          message.error(`statusCode:400,播放失败！`);
        }
      },
    });
  }

  //删除视频
  onRemoveVideo = (fileName) => {
    $.ajax({
      // url: `/videos/${videoID}`,
      url: `/oss/${userID}/${fileName}`,
      contentType: "application/json",
      type: 'delete',
      // data: JSON.stringify({
      //   userID: userID,
      // }),
      statusCode: {
        200: (xhr) => {
          message.success('删除成功！');
          this.getVideos();
        },
        500: (xhr) => {
          message.error(`statusCode:500,删除失败！`);
        },
        400: (xhr) => {
          message.error(`statusCode:400,删除失败！`);
        }
      },
    });
  }

  render() {
    const columns = [{
      title: '视频名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '视频ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '上传时间',
      dataIndex: 'create_time',
      key: 'create_time',
    }, {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => (
        <span>
          <a onClick={()=>{this.onReleaseVideo(record.videoID,record.videoName)}}>发布</a>
          <Divider type="vertical" />
          <a onClick={()=>{this.onPlayVideo(record.videoID)}}>播放</a>
          <Divider type="vertical" />
          <a onClick={()=>{this.onRemoveVideo(record.name)}}>删除</a>
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

    const props = {
      onChange: (info) => {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
      beforeUpload: (file) => {
        console.log("file", file);
        this.setState({ file: file });
        return false;
      }
    };
    return (
      <div>
        <Row type={'flex'} justify="center">
          <Col span={23} style={{fontSize:14+'px',marginTop:24+'px'}}>
            <Icon type="video-camera" style={{marginRight:8+'px'}} />已上传视频列表
            <Upload {...props}>
              <Button>
                <Icon type="upload" /> 视频上传
              </Button>
            </Upload>
            <Button onClick={this.handleOk}>确定上传</Button>
            <Button type="primary" icon="plus" style={{float:"right"}} onClick={this.showModal}>视频上传</Button>
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

const VideoUpload = Form.create()(VideoWrapper);
export default VideoUpload