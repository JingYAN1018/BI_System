import { genChartByAiAsyncMqUsingPOST, genChartByAiAsyncUsingPOST } from '@/services/BI-System/chartController';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card,  Form, Input, message, Select, Space, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useForm } from 'antd/es/form/Form';

/**
 * 添加图表页面
 * @constructor
 */
const AddChartAsync: React.FC = () => {
  const [form] = useForm();
  // 提交中的状态, 默认未提交
  const [submitting, setSubmittiing] = useState<boolean>(false);
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
    // 对接后端，上传数据，values是获取到的表单信息
    const params = {
      ...values,
      file: undefined
    }
    try {
      const res = await genChartByAiAsyncUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('智能分析失败');
      } else {
        message.success('智能分析任务提及成功,稍后请在我的图表页面中查看');
        form.resetFields();
      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
    }
    setSubmittiing(false);
  };

  const containerClassName = useEmotionCss(() => {
    return {
      border: '1px solid #e8ebed',
      borderRadius: '10px',
      boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    };
  });

  return (
    <div className="add-chart-async">
      <Card title="智能分析" className={containerClassName}>
        <Form
          name="addChart"
          form={form}
          labelAlign='left'
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish} >
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
    </div>
  );
};
export default AddChartAsync;
