import React from "react";
import { Button, Modal, Table, Row, Col, Icon, Badge, Input, Form, message, Steps, List } from "antd";
import $ from "jquery";
import styles from "./VideoPurchased.less";
import { userID, password } from "../../utils/utils";
const FormItem = Form.Item;
const Step = Steps.Step;
const dataSource = [{
  videoID: 4,
  userId: "1111111125",
  buyTime: "2017-12-25T19:58:31Z",
}, {
  videoID: 2,
  userId: "1111111125",
  buyTime: "2018-01-22T09:30:31Z",
}];

class VideoWrapper extends React.Component {
  state = {
    dataSource: [],
    loading: true,
    btnLoading: false,
    visible: false,
    current: 0,
    shareUrl: '',
    shareVideoInfo: []
  }

  //获取已购买的视频列表
  getVideos = () => {
    //HIA
    $.ajax({
      url: `/record/transactions?userID=${userID}`,
      contentType: 'application/json',
      success: (hia) => {
        let result = [];
        //CMS 根据videoID查询视频信息
        $.ajax({
          url: `/action.do`,
          type: 'post',
          contentType: 'application/json',
          data: JSON.stringify({
            type: "find",
            msg: {
              mtype: "owner", //视频id
              msg: {
                owner: String(userID),
                // id: 2
              }
            }
          }),
          success: (cms) => {
            dataSource.map((item, index) => {
              cms.data.map(ele => {
                if (item.videoID == ele.id) {
                  result.push({
                    key: index,
                    name: ele.name,
                    id: ele.id,
                    create_time: ele.create_time,
                    modify_time: ele.modify_time,
                    buy_time: ele.buyTime,
                    owner: ele.owner,
                    price: item.price,
                    buys: item.buys,
                  });
                }
              });
            });
            console.log("result", result);
            this.setState({
              dataSource: result,
            });
          },
          error: (err) => {
            message.error(`获取数据失败！CMS ${err.status}: ${err.statusText}`);
          },
        });
      },
      error: (err) => {
        message.error(`获取数据失败！HIA ${err.status}: ${err.statusText}`);
      },
    });
    this.setState({
      loading: false,
      btnLoading: false,
    });
  }

  componentDidMount() {
    this.getVideos();
  }

  //播放视频
  onWatchVideo = (videoID, url) => {
    $.ajax({
      url: `/videos/${videoID}?userID=${userID}&url=${url}`,
      contentType: "application/json",
      statusCode: {
        200: (xhr) => {
          console.log("播放成功！")
          message.success('播放成功！');
        },
        500: (xhr) => {
          console.log("播放失败！500")
          message.error(`statusCode:500,播放失败！请确定你已购买该视频！`);
        },
        400: (xhr) => {
          console.log("播放失败！400")
          message.error(`statusCode:400,播放失败！请确定你已购买该视频！`);
        }
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

  //视频分享modal显示
  showModal = (record) => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
      shareUrl: '',
    });
  }

  next = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const current = this.state.current + 1;
        this.setState({ current, shareUrl: values.shareUrl });
        console.log("url", values.shareUrl.split("#"));
        let userID = values.shareUrl.split("#")[0].split(" ")[1];
        let videoID = values.shareUrl.split('#')[1];
        console.log("userID", userID, typeof(+videoID));
        //根据videoID查询视频信息
        $.ajax({
          url: '/action.do',
          type: 'post',
          contentType: 'application/json',
          data: JSON.stringify({
            type: "find",
            msg: {
              mtype: "fid",
              msg: {
                owner: String(userID),
                id: +videoID
              }
            }
          }),
          success: (res) => {
            console.log("res", res);
            if (res.data) {
              this.setState({
                shareVideoInfo: res.data[0]
              });
            }
          },
          error: (err) => {
            message.error(`获取视频信息失败！CMS ${err.status}: ${err.statusText}`);
          },
        })
      }
    });

  }
  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  //购买视频
  buyVideo = () => {
    $.ajax({
      url: `/transaction/${this.state.shareVideoInfo.id}`,
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify({
        userID: +userID,
        password: String(password)
      }),
      success: () => {
        message.success("购买成功！");
        this.setState({
          visible: false
        });
        this.getVideos();
      },
      error: (err) => {
        message.error(`购买失败！HIA ${err.status}: ${err.statusText}`);
        this.setState({
          visible: false
        });
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { current } = this.state;
    const columns = [{
      title: '视频名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '视频ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '发布者',
      dataIndex: 'owner',
      key: 'owner',
    }, {
      title: '上传时间',
      dataIndex: 'create_time',
      key: 'create_time',
    }, {
      title: '发布时间',
      dataIndex: 'modify_time',
      key: 'modify_time',
    }, {
      title: '购买时间',
      dataIndex: 'buyTime',
      key: 'buyTime',
    }, {
      title: 'option',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => (
        <span>
         <a onClick={()=>{this.onWatchVideo(record.videoID,record.url)}}>播放</a>
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
    const data = [
      `视频名称：${this.state.shareVideoInfo.name}`,
      `上传时间：${this.state.shareVideoInfo.create_time}`,
      `发布时间：${this.state.shareVideoInfo.modify_time}`,
    ];

    const steps = [{
      title: '第一步：解析url',
      content: (<Form>
        <FormItem
          {...formItemLayout}
          label="链接"
        >
          {getFieldDecorator('shareUrl', {
            initialValue:this.state.shareUrl,
            rules: [{
              required: true, message: 'Please input your url!',
            }],
            })(
            <Input placeholder="请输入你要解析的视频链接~"/>
          )}
        </FormItem>
      </Form>),
    }, {
      title: '第二步：购买视频',
      content: (<div>
        <h3 style={{ marginTop: '16px' }}>视频信息</h3>
        <List
          size="small"
          bordered
          dataSource={data}
          renderItem={item => (<List.Item>{item}</List.Item>)}
        />
      </div>),
    }];
    return (
      <div>
        <Row type={'flex'} justify="center">
          <Col span={23} style={{fontSize:14+'px',marginTop:24+'px'}}>
            <Icon type="video-camera" style={{marginRight:8+'px'}} />已购买视频列表
            <Button icon="reload" style={{float:"right"}} onClick={this.onReload}>刷新</Button>
          </Col>
          <Col span={23} style={{paddingTop:12+'px',borderBottom:1+'px'+' solid'+' #e9e9e9'}}></Col>
          <Col span={23} style={{fontSize:14+'px',marginTop:24+'px'}}>
            <Table dataSource={this.state.dataSource} columns={columns} loading={this.state.loading} />
          </Col>
        </Row>
        <Modal
          title="解析分享"
          width={700}
          footer={null}
          destroyOnClose
          visible={this.state.visible}
          onCancel = {this.handleCancel}
        >
          <div>
            <Steps current={current}>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className={styles.steps_content}>{steps[this.state.current].content}</div>
            <div className={styles.steps_action}>
              {
                this.state.current < steps.length - 1
                &&
                <Button type="primary" onClick={(e) => this.next(e)}>下一步</Button>
              }
              {
                this.state.current === steps.length - 1
                &&
                <Button type="primary" onClick={() => this.buyVideo()}>购买</Button>
              }
              {
                this.state.current > 0
                &&
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  上一步
                </Button>
              }
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const VideoPurchased = Form.create()(VideoWrapper);
export default VideoPurchased