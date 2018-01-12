import React from "react";
import { Button, Modal, Table, Row, Col, Icon, Badge, Input, Form, message } from "antd";
import $ from "jquery";
import styles from "./index.less";
const FormItem = Form.Item;
const copyRightUserID = 1111111125;
const userID = 10002;

class VideoWrapper extends React.Component {

  state = {
    dataSource: [],
    visible: false,
  }

  getVideos = () => {
    $.ajax({
      url: `/record/transactions?userID=${userID}`,
      contentType: 'application/json',
      success: (res) => {
        if (res) {
          let result = [];
          res.transactions.map(item => {
            result.push({
              ...item,
              key: item.videoID
            })
          });
          this.setState({
            dataSource: result
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

  render() {
    const columns = [{
      title: 'buyTime',
      dataIndex: 'buyTime',
      key: 'buyTime',
    }, {
      title: 'transactionId',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: text => text || '--'
    }, {
      title: 'transaction',
      dataIndex: 'transaction',
      key: 'transaction',
      width: '35%',
    }, {
      title: 'videoID',
      dataIndex: 'videoID',
      key: 'videoID',
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
            <Icon type="video-camera" style={{marginRight:8+'px'}} />已购买视频
          </Col>
          <Col span={23} style={{paddingTop:12+'px',borderBottom:1+'px'+' solid'+' #e9e9e9'}}></Col>
          <Col span={23} style={{fontSize:14+'px',marginTop:20+'px'}}>
          </Col>
          <Col span={23} style={{fontSize:14+'px',marginTop:0+'px'}}>
            <Table dataSource={this.state.dataSource} columns={columns} />
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

const PurchaseRecord = Form.create()(VideoWrapper);
export default PurchaseRecord