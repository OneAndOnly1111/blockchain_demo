import React from "react";
import { ChartCard, MiniBar, Bar, Line, Pie, WaterWave, yuan, Field, TimelineChart } from 'ant-design-pro/lib/Charts';
import Charts from 'ant-design-pro/lib/Charts';
import { Tooltip, Icon, Row, Col, Card } from 'antd';
import Trend from 'ant-design-pro/lib/Trend';

const chartData = [];
for (let i = 0; i < 50; i += 1) {
  chartData.push({
    x: (new Date().getTime()) + (1000 * 60 * 30 * i),
    y1: Math.floor(Math.random() * 50) + 300,
  });
}
export default class VideoStorage extends React.Component {
  render() {
    return (
      <Row type={'flex'} justify="center">
        <Col span={24}>
           <Row gutter={16}>
            <Col span={16}>
              <ChartCard
                title="总收入"
                action={<Tooltip title="存储端收益"><Icon type="info-circle-o" /></Tooltip>}
                total="￥126560"
                footer={<Field label="今日收入" value="￥12423" />}
                contentHeight={46}
              >
                <span>
                  周同比
                  <Trend flag="up" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>12%</Trend>
                </span>
                <span style={{ marginLeft: 16 }}>
                  日环比
                  <Trend flag="down" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>11%</Trend>
                </span>
              </ChartCard>
            </Col>
            <Col span={8}>
              <Card style={{height:185,textAlign: 'center'}}>
                <WaterWave
                  height={150}
                  title="存储空间剩余"
                  percent={75}
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={24} style={{marginTop:'30px'}}>
          <Card
            title="近期上传趋势图"
            style={{height:500,width:'100%'}}
            bodyStyle={{padding:'3%'}} bordered={true}
          >
            <div style={{width:'100%'}}>
              <TimelineChart
              height={350}
              data={chartData}
              titleMap={{ y1: '近期上传量'}}
            />
            </div>
          </Card>
          
        </Col>
      </Row>
    )
  }
}