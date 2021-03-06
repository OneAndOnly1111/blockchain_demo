import React from "react";
import { Button, Modal, Table, Row, Col, Icon, Badge, Input, Form, message, Divider } from "antd";
import $ from "jquery";
import Clipboard from "clipboard";
import moment from "moment";
import VideoPlay from "./VideoPlay";
import styles from "./VideoRelease.less";
import { userID, password, node } from "../../utils/utils";
const FormItem = Form.Item;

class VideoWrapper extends React.Component {
  state = {
    dataSource: [],
    visible: false,
    loading: true,
    playVisible: false,
    playUrl: ''
  }

  //获取已发布的视频
  getVideos = () => {
    //HIA
    $.ajax({
      url: `/${node}/record/videos?indexType=uploadRecord&userID=${userID}`,
      contentType: 'application/json',
      success: (hia) => {
        let result = [];
        $.ajax({
          url: `/action.do`,
          type: 'post',
          contentType: 'application/json',
          data: JSON.stringify({
            type: "find",
            msg: {
              mtype: "owner",
              msg: {
                owner: String(userID),
              }
            }
          }),
          success: (cms) => {
            hia.uploadRecord ? hia.uploadRecord.map((item, index) => {
              cms.data.map(ele => {
                if (item.videoID == ele.id && ele.pub == 1) {
                  result.push({
                    key: index,
                    name: ele.name,
                    id: ele.id,
                    create_time: moment(ele.create_time).format("YYYY-MM-DD HH:mm:ss"),
                    modify_time: moment(ele.modify_time).format("YYYY-MM-DD HH:mm:ss"),
                    price: item.price,
                    buys: item.buys,
                  });
                }
              });
            }) : null;
            console.log("result", result);
            this.setState({
              dataSource: result,
              loading: false,
            });
          },
          error: (err) => {
            message.error(`获取数据失败！CMS ${err.status}: ${err.statusText}`);
            this.setState({
              loading: false
            });
          },
        });
      },
      error: (err) => {
        message.error(`获取数据失败！HIA ${err.status}: ${err.statusText}`);
        this.setState({
          loading: false
        });
      },
    });

  }

  componentDidMount() {
    this.getVideos();
    new Clipboard('.btn');
  }

  //播放视频
  playVisibleChange = (visible) => {
    this.setState({
      playVisible: visible
    });
  }
  onPlayVideo = (record) => {
    $.ajax({
      url: `/${node}/video/${record.id}?userID=${userID}&password=${password}`,
      contentType: 'application/json',
      success: () => {
        let href = window.location.href.split("/")[2];
        this.setState({
          playUrl: `http://${href}/oss/${userID}/${record.name}`
        });
      },
      error: (err) => {
        message.error(`HIA鉴权失败！HIA ${err.status}: ${err.statusText}`);
      },
    });
    this.setState({
      playVisible: true
    });
  }

  //视频分享modal显示
  showModal = (record) => {
    this.setState({
      visible: true,
      shareUrl: userID + "#" + record.id,
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
      dataType: 'text',
      data: JSON.stringify({
        type: "cancel",
        msg: {
          msg: {
            owner: String(userID),
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

  //刷新
  onReload = () => {
    this.setState({
      loading: true
    });
    window.setTimeout(this.getVideos, 1000);
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
      render: text => <span>￥ {text}</span>
    }, {
      title: '购买次数',
      dataIndex: 'buys',
      key: 'buys',
    }, {
      title: '收益',
      dataIndex: 'money',
      key: 'money',
      render: (text, record) => <span>￥ {record.price * record.buys}</span>
    }, {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => (
        <span>
          <a onClick={()=>{this.onPlayVideo(record)}}>播放</a>
          <Divider type="vertical" />
          <a onClick={()=>{this.showModal(record)}}>分享</a>
          {/*<Divider type="vertical" />
          <a onClick={()=>{this.onCancleRelease(record)}}>取消发布</a>*/}
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
          <VideoPlay visible={this.state.playVisible} playVisibleChange={this.playVisibleChange} playUrl={this.state.playUrl}/>
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
          footer={null}
          title="视频分享"
          visible={this.state.visible}
          onCancel = {this.handleCancel}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="分享链接"
            >
              {getFieldDecorator('shareUrl', {
                rules: [{
                  required: true, message: 'Please input your url!',
                }],
                })(
                <div>
                  <Input value={this.state.shareUrl} readOnly addonAfter={<Icon type="copy" style={{cursor: "pointer"}} className="btn" data-clipboard-target="#shareUrl" />} />
                </div>
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