import React from "react";
import { Button, Modal, Table, Row, Col, Icon, Badge, Input, Form, message, Divider } from "antd";
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

  getVideos = () => {
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

  onBuyVideo = (videoID, videoName) => {
    Modal.confirm({
      title: `确定购买视频${videoName} 吗？`,
      onOk: () => {
        $.ajax({
          url: `/transaction/${videoID}`,
          contentType: "application/json",
          type: 'post',
          data: JSON.stringify({
            userID: userID,
          }),
          statusCode: {
            200: (xhr) => {
              console.log("购买成功！")
              message.success('购买成功！');
            },
            500: (xhr) => {
              console.log("购买失败！500")
              message.error(`statusCode:500,购买失败！`);
            },
            400: (xhr) => {
              console.log("购买失败！400")
              message.error(`statusCode:400,购买失败！避免重复购买喔~`);
            }
          },
        });
      }
    });

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
      title: 'status',
      dataIndex: 'status',
      key: 'status',
      render: text => text ? <Badge status="success" text="正常" /> : <Badge status="异常" />
    }, {
      title: 'url',
      dataIndex: 'url',
      key: 'url',
      width: '18%',
    }, {
      title: 'buys',
      dataIndex: 'buys',
      key: 'buys',
    }, {
      title: 'plays',
      dataIndex: 'plays',
      key: 'plays',
    }, {
      title: 'uploadTime',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
    }, {
      title: 'option',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => (
        <span>
          <a onClick={()=>{this.onBuyVideo(record.videoID,record.videoName)}}>购买</a>
        </span>
      ),
    }];
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Row type={'flex'} justify="center">
          <Col span={23} style={{fontSize:14+'px',marginTop:24+'px'}}>
            <Icon type="video-camera" style={{marginRight:8+'px'}} />可购买的视频列表
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

const VideoNormalUser = Form.create()(VideoWrapper);
export default VideoNormalUser