import React from "react";
import { Button, Modal, Table, Row, Col, Icon, Badge, Input, Form, message, Divider, Upload, InputNumber } from "antd";
import $ from "jquery";
import styles from "./VideoUpload.less";
import { userID, password } from "../../utils/utils";
const FormItem = Form.Item;
const dataSource = [{
  key: 7,
  id: 7,
  name: "kkk2.flv",
  pp: "",
  owner: "zxy",
  create_time: "2017-12-28T00:00:00+08:00",
  modify_time: "2018-01-17T14:39:06+08:00",
  del: 0,
  pub: 1
}, {
  key: 6,
  id: 6,
  name: "test.flv",
  pp: "test.jpg",
  owner: "zxy",
  create_time: "2017-12-24T00:00:00+08:00",
  modify_time: "2018-01-17T14:39:06+08:00",
  del: 1,
  pub: 1
}];

class VideoWrapper extends React.Component {
  state = {
    dataSource: dataSource,
    loading: false,
    uploading: false,
    fileList: [],
    visible: false,
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
          });
        }
      },
      error: (err) => {
        message.error(`获取数据失败！${err.status}: ${err.statusText}`);
      },
    });
    this.setState({
      loading: false
    });
  }

  componentDidMount() {
    this.getVideos();
  }

  //上传视频
  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });
    console.log("formData", formData, "fileList", fileList);
    this.setState({
      uploading: true,
    });
    // You can use any AJAX library you like
    $.ajax({
      url: `/oss/${userID}/${fileList}`,
      type: 'put',
      contentType: 'video/mpeg4',
      // data: formData,
      success: (res) => {
        this.setState({
          fileList: [],
          uploading: false,
        });
        this.getVideos();
        message.success('上传成功！');
      },
      error: (err) => {
        this.setState({
          uploading: false,
        });
        message.error(`上传失败！${err.status}: ${err.statusText}`);
      },
    });
  }

  showReleaseModal = (e, videoID, videoName) => {
    this.setState({
      visible: true,
      videoID: videoID,
      videoName: videoName
    });
  }

  hideReleaseModal = (e) => {
    this.setState({
      visible: false
    });
  }

  //发布视频
  onReleaseVideo = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      if (!err) {
        console.log('Received values of form: ', values);
        const { videoID, videoName } = this.state;
        //与HIA交互
        $.ajax({
          url: `/videos/${videoID}`,
          type: 'post',
          data: JSON.stringify({
            "userID": userID,
            "password": values.password || password,
            "videoName": videoName,
          }),
          success: () => {
            //与CMS交互
            $.ajax({
              url: '/action.do',
              type: 'post',
              data: JSON.stringify({
                type: 'publish',
                msg: {
                  msg: {
                    owner: userID,
                    name: videoName
                  }
                }
              }),
              success: () => {
                message.success('发布成功！');
              },
              error: (err) => {
                message.error(`发布失败！CMS 返回${err.status}: ${err.statusText}`, 3);
              },
            });
          },
          error: (err) => {
            message.error(`发布失败！HIA 返回${err.status}: ${err.statusText}`, 3);
          },
        });
        this.setState({
          visible: false
        });
      }
    });
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
        400: (xhr) => {
          message.error(`statusCode:400,播放失败！`);
        },
        500: (xhr) => {
          message.error(`statusCode:500,播放失败！服务器错误！`);
        },
      },
    });
  }

  //删除视频
  onRemoveVideo = (file) => {
    $.ajax({
      url: `/oss/${userID}/${file}`,
      contentType: "application/json",
      type: 'delete',
      success: () => {
        this.getVideos();
        message.success("删除成功！");
      },
      error: (err) => {
        message.error(`删除失败！${err.status}: ${err.statusText}`);
      },
    });
  }

  //刷新
  onReload = () => {
    this.setState({
      loading: true
    });
    this.getVideos();
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
          <a onClick={()=>{this.onPlayVideo(record.id)}}>播放</a>
          <Divider type="vertical" />
          <a onClick={(e)=>{this.showReleaseModal(e,record.id,record.name)}}>发布</a>
          <Divider type="vertical" />
          <a onClick={()=>{this.onRemoveVideo(record.name)}}>删除</a>
        </span>
      ),
    }];
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
      action: '//jsonplaceholder.typicode.com/posts/',
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        console.log("beforeUpload", file);
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };
    const { getFieldDecorator } = this.props.form;
    const { loading, uploading, dataSource, visible } = this.state;
    return (
      <div>
        <Row type={'flex'} justify="center">
          <Col span={23} style={{fontSize:14+'px',marginTop:24+'px'}}>
            <Icon type="video-camera" style={{marginRight:8+'px'}} />已上传视频列表
            <Button icon="reload" style={{marginLeft:10+'px'}} onClick={this.onReload}>刷新</Button>
            <Button
              style={{float:"right"}}
              type="primary"
              onClick={this.handleUpload}
              disabled={this.state.fileList.length === 0}
              loading={uploading}
            >
              {uploading ? '上传中' : '开始上传' }
            </Button>
            <span style={{float:"right",marginRight:"8px"}}>
              <Upload {...props} style={{float:"right"}}>
                <Button>
                  <Icon type="upload" /> 视频上传
                </Button>
              </Upload>
            </span>
          </Col>
          <Col span={23} style={{paddingTop:12+'px',borderBottom:1+'px'+' solid'+' #e9e9e9'}}></Col>
          <Col span={23} style={{fontSize:14+'px',marginTop:24+'px'}}>
            <Table dataSource={this.state.dataSource} columns={columns} loading={loading} />
          </Col>
        </Row>
        <Modal
          title="视频发布"
          destroyOnClose
          visible={visible}
          onCancel={this.hideReleaseModal}
          onOk={this.onReleaseVideo}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="定价"
            >
              {getFieldDecorator('price', {
                initialValue:0,
                rules: [{ required: true, message: '请填写产品定价！' }],
              })(
                <InputNumber formatter={value => `￥ ${value}`} style={{width:150+'px'}} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="密码确认"
            >
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入你的密码进行验证！' }],
              })(
                <Input type="password" style={{width:200+'px'}} />
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