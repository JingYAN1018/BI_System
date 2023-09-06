import { genChartByAiUsingPOST } from '@/services/BI-System/chartController';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useEmotionCss } from '@ant-design/use-emotion-css';

/**
 * 添加图表页面
 * @constructor
 */
const AddChart: React.FC = () => {
  // 获取后端返回的chart数据
  const [chart, setChart] = useState<API.BiResponse>();
  // 设置图表echarts中的option
  const [option, setOption] = useState<any>();
  const [submitting, setSubmittiing] = useState<boolean>(false);
  const containerClassName = useEmotionCss(() => {
    return {
      border: '1px solid #e8ebed',
      borderRadius: '10px',
      boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    };
  });

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // console.log(values);
    // 避免重复提交
    if (submitting) {
      return;
    }
    setSubmittiing(true);
    setChart(undefined);
    setOption(undefined);
    // 对接后端，上传数据，values是获取到的表单信息
    const params = {
      ...values,
      file: undefined
    }
    try {
      const res = await genChartByAiUsingPOST(params,{}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('智能分析失败');
      } else {
        message.success('智能分析成功');
        // 将返回的图表echarts-option数据转换为JSON格式「把JSON字符串转成对象。echarts只支持json的option格式进行渲染」，否则赋值为空
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error("图表代码解析错误");
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
    }
    setSubmittiing(false);
  };

  return (
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12} className={containerClassName}>
          <Card title="智能分析">
            <Form name="addChart" labelAlign='left' labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }} onFinish={onFinish} >
              <Form.Item name='goal' label="分析目标" rules={
                [{
                  required: true, message: '请输入分析目标'
                }]
              }>
                <TextArea placeholder='请输入您的分析需求，比如，分析网站用户的增长情况' />
              </Form.Item>
              <Form.Item name='name' label="图表名称" rules={
                [{
                  required: true, message: '请输入图表名称'
                }]
              }>
                <Input placeholder='请输入图表名称' />
              </Form.Item>
              <Form.Item name='chartType' label="图表类型" rules={
                [{
                  required: true, message: '请输入图表类型'
                }]
              }>
                <Select options={[
                  { value: '折线图', label: '折线图' },
                  { value: '柱状图', label: '柱状图' },
                  { value: '堆叠图', label: '堆叠图' },
                  { value: '饼图', label: '饼图' },
                  { value: '雷达图', label: '雷达图' },
                ]} />
              </Form.Item>
              <Form.Item name="file" label="原始数据" rules={
                [{
                  required: true, message: '请选择原始数据'
                }]
              }>
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined />}>上传 xls/xlsx 文件</Button>
                </Upload>
              </Form.Item>
              <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="分析结论" className={containerClassName}>
            {chart?.genResult ?? <div>请先在左侧进行提交！</div>}
            <Spin spinning={submitting}></Spin>
          </Card>
          <Divider />
          <Card title="可视化图表" className={containerClassName}>
            {option ? <ReactECharts option={option}></ReactECharts> : <div>请先在左侧进行提交！</div>}
            <Spin spinning={submitting}></Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
