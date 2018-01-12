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
    loading: true
  }

  getAllVideos = () => {
    $.ajax({
      url: `/record/videos?indexType=uploadRecord&userID=${copyRightUserID}`,
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
          console.log("result", result)
          return result;
        }
      }
    })
  }

  getVideos = () => {
    $.ajax({
      url: `/record/transactions?userID=${userID}`,
      contentType: 'application/json',
      success: (res) => {
        if (res) {
          let result = [];
          let allData = [];

          $.ajax({
            url: `/record/videos?indexType=uploadRecord&userID=${copyRightUserID}`,
            contentType: 'application/json',
            success: (data) => {
              if (data) {
                console.log("allData", data)
                res.transactions.map((trans, index) => {
                  data.uploadRecord.map(video => {
                    if (trans.videoID == video.videoID) {
                      trans.url = video.url;
                    }
                  });
                  result.push({
                    ...trans,
                    key: index
                  });
                });
                console.log("result", result)
                this.setState({
                  dataSource: result,
                  loading: false
                });
              }
            }
          });
        }
      }
    })
  }

  componentDidMount() {
    this.getVideos();
  }

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

  render() {
    const columns = [{
      title: 'transaction',
      dataIndex: 'transaction',
      key: 'transaction',
    }, {
      title: 'videoID',
      dataIndex: 'videoID',
      key: 'videoID',
    }, {
      title: 'url',
      dataIndex: 'url',
      key: 'url',
    }, {
      title: 'buyTime',
      dataIndex: 'buyTime',
      key: 'buyTime',
    }, {
      title: 'option',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => (
        <span>
          {
            record.videoID ? <a onClick={()=>{this.onWatchVideo(record.videoID,record.url)}}>播放</a>
            :<a disabled>已下架</a>
          }
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
            <Icon type="video-camera" style={{marginRight:8+'px'}} />已购买视频
          </Col>
          <Col span={23} style={{paddingTop:12+'px',borderBottom:1+'px'+' solid'+' #e9e9e9'}}></Col>
          <Col span={23} style={{fontSize:14+'px',marginTop:20+'px'}}>
          </Col>
          <Col span={23} style={{fontSize:14+'px',marginTop:0+'px'}}>
            <Table dataSource={this.state.dataSource} columns={columns} loading={this.state.loading} />
          </Col>
        </Row>
      </div>
    );
  }
}

const PurchaseRecord = Form.create()(VideoWrapper);
export default PurchaseRecord