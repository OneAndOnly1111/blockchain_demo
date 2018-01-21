import React from "react";
import { Button, Modal, Table, Row, Col, Icon, Badge, Input, Form, message } from "antd";
import $ from "jquery";
import styles from "./VideoPurchased.less";
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
    btnLoading: false,
  }

  //获取已购买的视频列表
  getVideos = () => {
    //HIA
    $.ajax({
      url: `/record/transactions?userID=${userID}`,
      contentType: 'application/json',
      success: (res) => {
        let result = [];
        res.transactions.map((item, index) => {
          result.push({
            ...item,
            key: index
          })
        });
        this.setState({
          dataSource: res.transactions,
          loading: false,
          btnLoading: false,
        });
      },
      error: (err) => {
        message.error(`获取数据失败！HIA ${err.status}: ${err.statusText}`);
      },
    });
    //CMS 根据videoID查询视频信息
    $.ajax({
      url: `/action.do`,
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify({
        type: "find",
        msg: {
          mtype: "fid", //视频id
          msg: {
            owner: userID,
            id: "fid"
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
      loading: true,
      btnLoading: true,
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
            <Button icon="reload" style={{float:"right"}} loading={this.state.btnLoading} onClick={this.onReload}>刷新</Button>
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

const VideoPurchased = Form.create()(VideoWrapper);
export default VideoPurchased