import React from "react";
import { Button, Modal, Table, Row, Col, Icon, Badge, Input, Form, message, Divider } from "antd";
import $ from "jquery";
import styles from "./VideoRelease.less";
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
    visible: false,
    loading: false,
  }

  //获取已发布的视频
  getVideos = () => {
    //HIA
    $.ajax({
      url: `/record/videos?indexType=uploadRecord&userID=${userID}`,
      contentType: 'application/json',
      success: (res) => {
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
      },
      error: (err) => {
        message.error(`获取数据失败！HIA ${err.status}: ${err.statusText}`);
      },
    });
    //CMS
    $.ajax({
      url: `/action.do`,
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify({
        type: "find",
        msg: {
          mtype: userID,
          msg: {
            owner: userID,
          }
        }
      }),
      success: () => {
        //other
      },
      error: (err) => {
        message.error(`获取数据失败！CMS ${err.status}: ${err.statusText}`);
      },
    });

    this.setState({
      loading: false
    });
  }

  componentDidMount() {
    this.getVideos();
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

  showModal = (record) => {
    console.log("shareUrl", userID, record.id);
    this.setState({
      visible: true,
    });
    this.props.form.setFieldsValue({ shareUrl: userID + "#" + record.id })
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

  //取消发布
  onCancleRelease = (record) => {
    $.ajax({
      url: "/action.do",
      contentType: "application/json",
      type: 'post',
      data: JSON.stringify({
        type: "cancel",
        msg: {
          msg: {
            owner: userID,
            name: record.name,
          }
        }
      }),
      success: () => {
        this.getVideos();
        message.success("取消发布成功！");
      },
      error: (err) => {
        message.error(`取消发布失败！${err.status}: ${err.statusText}`);
      },
    });
  }

  //分享url
  onShareUrl = (record) => {
    Modal.confirm({
      title: '你确定要要分享该视频吗？',
      content: `分享链接：${userID}#${record.id}`,
      okText: '点击复制链接',
      cancelText: '取消',
      onOk: () => {
        var e = document.getElementsByClassName("ant-confirm-content");
        // e.select();
        document.execCommand("copy");
        message.success("复制成功！");
        // window.clipboardData.setData("Text", `${userID}#${record.id}`);
      }
    })
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
      title: '发布时间',
      dataIndex: 'modify_time',
      key: 'modify_time',
    }, {
      title: '定价',
      dataIndex: 'price',
      key: 'price',
    }, {
      title: '购买次数',
      dataIndex: 'buys',
      key: 'buys',
    }, {
      title: '收益',
      dataIndex: 'money',
      key: 'money',
    }, {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => (
        <span>
          <a onClick={()=>{this.onPlayVideo(record)}}>播放</a>
          <Divider type="vertical" />
          <a onClick={()=>{this.onShareUrl(record)}}>分享</a>
          <Divider type="vertical" />
          <a onClick={()=>{this.onCancleRelease(record)}}>取消发布</a>
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
            <Button icon="reload" style={{float:"right"}} onClick={this.onReload}>刷新</Button>
          </Col>
          <Col span={23} style={{paddingTop:12+'px',borderBottom:1+'px'+' solid'+' #e9e9e9'}}></Col>
          <Col span={23} style={{fontSize:14+'px',marginTop:24+'px'}}>
            <Table dataSource={this.state.dataSource} columns={columns} loading={this.state.loading} />
          </Col>
        </Row>
        <Modal
          destroyOnClose
          title="视频分享"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="分享url"
            >
              {getFieldDecorator('shareUrl', {
                rules: [{
                  required: true, message: 'Please input your url!',
                }],
                })(
                  <Input value={this.state.shareUrl} disabled />
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