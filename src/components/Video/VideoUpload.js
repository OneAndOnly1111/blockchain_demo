import React from "react";
import { Button, Modal, Table, Row, Col, Icon, Badge, Input, Form, message, Divider, Upload, InputNumber } from "antd";
import $ from "jquery";
import styles from "./VideoUpload.less";
import moment from "moment";
import Clipboard from "clipboard";
import { userID, password } from "../../utils/utils";
import VideoPlay from "./VideoPlay";
const FormItem = Form.Item;

class VideoWrapper extends React.Component {
  state = {
    dataSource: [],
    loading: true,
    uploading: false,
    fileList: [],
    visible: false,
    playVisible: false,
  }

  //获取已上传的视频列表
  getVideos = () => {
    $.ajax({
      url: '/action.do',
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify({
        "type": "find",
        msg: {
          mtype: "owner",
          msg: {
            owner: String(userID)
          }
        }
      }),
      success: (res) => {
        if (res) {
          let result = [];
          res.data.map((item, index) => {
            item.create_time = moment(item.create_time).format("YYYY-MM-DD HH:mm:ss");
            result.push({
              ...item,
              key: index
            })
          });
          this.setState({
            dataSource: result,
            loading: false,
          });
        }
      },
      error: (err) => {
        message.error(`获取数据失败！${err.status}: ${err.statusText}`);
        this.setState({
          loading: false
        });
      },
    });
  }

  componentDidMount() {
    this.getVideos();
  }

  //上传视频
  handleUpload = () => {
    const { fileList } = this.state;
    // var formData = new FormData();
    // formData.append("file", fileList[0]);
    this.setState({
      uploading: true,
    });
    $.ajax({
      url: `/oss/${userID}/${fileList[0].name}`,
      type: 'put',
      data: fileList[0],
      cache: false,
      processData: false,
      contentType: false,
      // contentType: 'video/mpeg4',
      success: (res) => {
        //更新数据库
        $.ajax({
          url: '/action.do',
          type: 'post',
          contentType: 'application/json',
          dataType: 'text',
          data: JSON.stringify({
            type: "add",
            msg: {
              msg: {
                name: fileList[0].name, //文件名称
                owner: String(userID),
                pp: "", //预览图片
              }
            }
          }),
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
            message.error(`上传失败！CMS${err.status}: ${err.statusText}`);
          },
        })
      },
      error: (err) => {
        this.setState({
          uploading: false,
        });
        message.error(`CMS上传失败！CMS${err.status}: ${err.statusText}`);
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
      if (!err) {
        const { videoID, videoName } = this.state;
        //与HIA交互
        $.ajax({
          url: `/videos/${videoID}`,
          type: 'post',
          contentType: 'application/json',
          data: JSON.stringify({
            "userID": +userID,
            "password": values.password || password,
            "videoName": videoName,
            "price": +values.price
          }),
          success: () => {
            //与CMS交互
            $.ajax({
              url: '/action.do',
              type: 'post',
              contentType: "application/json",
              dataType: 'text',
              data: JSON.stringify({
                type: 'publish',
                msg: {
                  msg: {
                    owner: String(userID),
                    name: String(videoName)
                  }
                }
              }),
              success: () => {
                this.getVideos();
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
  playVisibleChange = (visible) => {
    this.setState({
      playVisible: visible
    });
  }
  onPlayVideo = (record) => {
    $.ajax({
      url: `/video/${record.id}?userID=${userID}&password=${password}`,
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

  //删除视频
  onRemoveVideo = (name) => {
    // $.ajax({
    //   url: `/oss/${userID}/${name}`,
    //   contentType: "application/json",
    //   type: 'delete',
    //   success: () => {
    //     this.getVideos();
    //     message.success("删除成功！");
    //   },
    //   error: (err) => {
    //     message.error(`删除失败！${err.status}: ${err.statusText}`);
    //   },
    // });
    $.ajax({
      url: `/action.do`,
      contentType: "application/json",
      type: 'post',
      dataType: 'text',
      data: JSON.stringify({
        type: 'del',
        msg: {
          mtype: "name",
          msg: {
            name: name,
            owner: String(userID)
          }
        }
      }),
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
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => (
        <span>
          <a onClick={()=>{this.onPlayVideo(record)}}>播放</a>
          <Divider type="vertical" />
          <a onClick={(e)=>{this.showReleaseModal(e,record.id,record.name)}} disabled={(record.pub==1)}>{record.pub==0?"发布":"已发布"}</a>
          {/*<Divider type="vertical" />
          <a onClick={()=>{this.onRemoveVideo(record.name)}} disabled={record.del==1}>{record.del==0?"删除":"已删除"}</a>*/}
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
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
          file: file,
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
          <VideoPlay visible={this.state.playVisible} playVisibleChange={this.playVisibleChange} playUrl={this.state.playUrl}/>
          <Col span={23} style={{fontSize:14+'px',marginTop:24+'px'}}>
            <Icon type="video-camera" style={{marginRight:8+'px'}} />已上传视频列表
            <Button icon="reload" style={{float:"right",marginLeft:8+'px'}} onClick={this.onReload}>刷新</Button>
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
              <form encType="multipart/form-data">
                <Upload {...props} style={{float:"right"}}>
                  <Button>
                    <Icon type="upload" /> 视频上传
                  </Button>
                </Upload>
              </form>
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
              label="视频定价"
            >
              {getFieldDecorator('price', {
                initialValue:0,
                rules: [{ required: true, message: '请填写产品定价！' }],
              })(
                <InputNumber min={0} formatter={value => `￥ ${value}`} style={{width:150+'px'}} />
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