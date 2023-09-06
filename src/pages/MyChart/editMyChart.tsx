import { Button, Form, Input, Modal, Select, Upload, message, Space, Row, Col, Card, } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import React, { useState, useEffect } from 'react';
import { editChartUsingPOST, updateChartUsingPOST } from '@/services/BI-System/chartController';

// interface Values {
//     name?: string
//     goal?: string
//     chartType?: string
//     chartData?: string
//     id?: number
//     // name: string|undefined,
//     // goal: string | undefined,
//     // chartType: string |undefined,
//     // chartData: string|undefined,
//     // id:number|undefined,
// }

interface CollectionCreateFormProps {
    // oldData: API.Chart,
    visible: boolean,
    onSubmit: () => void,
    onCancel: () => void,
    editIndex: number,
    chartList: API.Chart[] 
}


const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({visible,  onSubmit, onCancel,editIndex, chartList }) => {

    const [form] = Form.useForm();
    const oldData = chartList[editIndex];
    // console.log('oldData',oldData);
    // console.log('editIndex', editIndex);
    // useEffect(() => {
    //     if (visible) {
    //         form.setFieldsValue(oldData);
    //     } else {
    //         form.resetFields();
    //     }
    // }, [visible]);
    const [loading, setLoading] = useState<boolean>(false);
    // const [modelVisible,setModelVisible] = useState<boolean>(false);
    const submitting = async (values: any) => {
        // console.log('values', values);
        setLoading(true);
        form.validateFields().then(async (values) => {
            const res = await updateChartUsingPOST({ ...values, id: oldData.id })
            if (res.code === 0) {
                message.success('恭喜你，修改成功！')
                form.resetFields()
            } else {
                message.error('编辑图表失败，' + res.message)
            }
        }).catch((info) => {
            message.error('图表验证失败:', info)
        })
        setLoading(false);
        onSubmit();//关闭对话框
    };
    /*const submitting = async (values: any) => {
        console.log('values', values);
        setLoading(true);
        try {
            const res = await updateChartUsingPOST({ ...values })
            if (res.code === 0) {
                message.success('恭喜你，修改成功！')
            } else {
                message.error('编辑图表失败，' + res.message)
            }
        } catch (error: any) {
            message.error('图表验证失败:', error)

        }
        setLoading(false);
    };*/
    return (
        <Modal
            open={visible}
            title="修改图表信息"
            // okText="确认"
            // cancelText="取消"
            onCancel={() => { onCancel(); form.resetFields(); }}
            onOk={submitting}
            forceRender={true}
            destroyOnClose={true}
        >
            <>
                {
                    oldData === chartList[editIndex] && <><Form
                        form={form}
                        layout="vertical"
                        name="editChart"
                        onFinish={submitting}
                        initialValues={{
                            name: oldData.name,
                            goal: oldData.goal,
                            chartType: oldData.chartType,
                            chartData: oldData.chartData
                        }}
                        preserve={false}
                    >
                        <Form.Item
                            name="name"
                            label="图表名称："
                        // rules={[{required: true, message: '请修改图表名称'}]}
                        >
                            <Input placeholder='请修改您的图表名称' />
                        </Form.Item>
                        <Form.Item
                            name='goal'
                            label="分析目标："
                        // rules={[{ required: true, message: '请输入需要修改的分析目标' }]}
                        >
                            <TextArea placeholder='请您的分析需求，比如，分析网站用户的增长情况' />
                        </Form.Item>
                        <Form.Item
                            name="chartType"
                            label="图表类型："
                        // rules={[{required: true, message: '请选择图表类型'}]}
                        >
                            <Select options={[
                                { value: '折线图', label: '折线图' },
                                { value: '柱状图', label: '柱状图' },
                                { value: '堆叠图', label: '堆叠图' },
                                { value: '饼图', label: '饼图' },
                                { value: '雷达图', label: '雷达图' },
                            ]} />
                        </Form.Item>
                        <Form.Item name="chartData" label="原始数据："
                        // rules={[{required: true, message: '请选择需要修改的原始数据'}]}
                        >
                            <Upload name="file" maxCount={1}>
                                <Button icon={<UploadOutlined />}>上传 CSV 文件</Button>
                            </Upload>
                        </Form.Item>
                    </Form></>
            }
            </>
        </Modal >
    )
}
export default CollectionCreateForm;