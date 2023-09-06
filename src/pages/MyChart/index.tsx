import { listMyChartByPageUsingPOST, deleteChartUsingPOST } from '@/services/BI-System/chartController';
import { List, Avatar, Result, Card, message, Button, Popconfirm, Tag, Select, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Search from "antd/es/input/Search";
import { useModel, useRequest } from '@umijs/max';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import CollectionCreateForm from './editMyChart'

/**
 * 添加图表页面
 * @constructor
 */
const MyChart: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  // 搜索框的条件
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    // 按照创建时间,按升序排列
    sortOrder: 'desc'
  }
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams })
  // 设置用于展示的图表列表
  const [chartList, setChartList] = useState<API.Chart[]>();
  // 控制编辑图表弹出框model的搜索与隐藏
  const [editVisible, setEditVisible] = useState<boolean>(false);
  // 控制删除图表确认框popConfirm的显示与隐藏
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  // 设置当前修改的表单项index
  const [editIndex, setEditIndex] = useState<number>(0);
  // 获取当前的用户信息
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};


  const containerClassName = useEmotionCss(() => {
    return {
      border: '1px solid #e8ebed',
      borderRadius: '10px',
      boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
      width: '100%',
      height: '100%'
    };
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        // 隐藏图表的title，统一样式
        if (res.data.records) {
          res.data.records.forEach(data => {
            // 只有当状态未succeed成功时, 才会解析图表代码
            if (data.status === 'succeed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          })
        }
      } else {
        message.error('获取我的图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图表失败，' + e.message);
    }
    setLoading(false);
  };
  // 设置异步操作的自动轮询操作
  //使得在智能分析异步化的界面提交请求后,不用手动更新我的图表,就会在设置的时间内自动更新当前图表的最新状态
  useEffect(()=> {
    loadData();
    // 设置定时器，每隔5秒钟执行一次loadData函数
    // const intervalId = setInterval(loadData, 5000);
    // 清除定时器，以避免重复执行
    // return () => clearInterval(intervalId);
  }, [searchParams])

  // 执行查询条件
  const onFinish = (values: any) => {
    console.log(values);
    //设置搜索条件
    setSearchParams({
      ...initSearchParams,
      name: values.name,
      chartType:values.chartType
    })
  }
  // 弹出确认删除气泡框
  const showPopconfirm = () => {
    setDeleteVisible(true);
  }
  // 删除图表
  const deleteMyChart = async (id: number | undefined) => {
    console.log(id);
    try {
      const res = await deleteChartUsingPOST({ id });
      console.log(res);
      if (res.code === 0) {
        message.success('删除图表成功！');
        loadData();
      } else {
        message.error('删除图表失败，' + res.message)
      }

    } catch (e: any) {
      message.error(e.error);
    }
    setDeleteVisible(false);
  }
 

  // console.log('chartList',chartList)
  return (
    <div className="my-chart">
      <div>
        <Form
          name="myChart"
          layout='inline'
          onFinish={onFinish} >
          <Form.Item label='图表名称' name='name'>
            <Search
              placeholder="请输入查询的图表名称"
              loading={loading}
              enterButton
              onSearch={(value) => {
                //设置搜索条件
                setSearchParams({
                  ...initSearchParams,
                  name: value,
                })
              }}
            />
          </Form.Item>
          <Form.Item label='图表类型' name='chartType'>
            <Select placeholder="请选择图表类型"  options={[
              { value: '折线图', label: '折线图' },
              { value: '柱状图', label: '柱状图' },
              { value: '堆叠图', label: '堆叠图' },
              { value: '饼图', label: '饼图' },
              { value: '雷达图', label: '雷达图' },
            ]}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              提交
            </Button>
          </Form.Item>
          <Form.Item>
            <Button htmlType="reset" onClick={()=>{setSearchParams({...initSearchParams})}}>重置</Button>
          </Form.Item>
          <Form.Item>
            <Button htmlType="reset" type="primary"  ghost onClick={()=>{setSearchParams({...initSearchParams})}}>刷新</Button>
          </Form.Item>
        </Form>
        {/* <Row gutter={8}>
          <Col span={10}>
            图表名称：<Search
              placeholder="请输入查询的图表名称"
              loading={loading}
              enterButton
              onSearch={(value) => {
                //设置搜索条件
                setSearchParams({
                  ...initSearchParams,
                  name: value,
                })
              }}
            />
          </Col>
          <Col span={4}>
            图表类型：<Select placeholder="请选择图表类型" options={[
              { value: '折线图', label: '折线图' },
              { value: '柱状图', label: '柱状图' },
              { value: '堆叠图', label: '堆叠图' },
              { value: '饼图', label: '饼图' },
              { value: '雷达图', label: '雷达图' },
            ]}
            // onChange={(value) => {
            //   setSearchParams({
            //     ...initSearchParams,
            //     chartType: value
            //   })
            // }}
            />
          </Col>
          <Col span={2}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              onClick={(values) => {
                console.log('values', values);
              }}>
              提交
            </Button>
          </Col>
          <Col span={2}>
            <Button htmlType="reset">重置</Button>

          </Col>
        </Row> */}
      </div>
      <div className='margin-16' />
      <List
        itemLayout="vertical"
        // size="large"
        grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }}
        dataSource={chartList}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            })
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
          showQuickJumper: true
        }}
        loading={loading} 
        renderItem={(item, index) => (
          <List.Item key={item.id}>
            <Card className={containerClassName}>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? <Tag color='geekblue'>{'图表类型：' + item.chartType}</Tag> : <Tag color='geekblue'>{'图表类型：' + undefined}</Tag>}
              />
              <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <Popconfirm
                  title="您确认要删除该图表吗?"
                  onConfirm={() => deleteMyChart(item.id)}
                  onCancel={() => { message.warning('取消成功!'); }}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button danger onClick={showPopconfirm}>删除图表</Button>
                </Popconfirm>
                <>
                  <Button
                    type="primary"
                    onClick={() => {
                      setEditVisible(true);
                      console.log(index);
                    }}
                    style={{ marginLeft: '10px' }}
                  >
                    编辑图表
                  </Button>
                  {editVisible && <CollectionCreateForm
                    // oldData={item}
                    visible={editVisible}
                    chartList = {chartList}
                    onSubmit={()=>{setEditVisible(false);setEditIndex(index)}}
                    onCancel={() => {setEditVisible(false);}}
                    editIndex = {index}
                  />}
                </>
              </div>

              <>
                {
                  item.status === 'wait' && <>
                    <Result
                      status="warning"
                      title="待生成"
                      subTitle={item.execMessage ?? '当前图表生成队列繁忙，请耐心等候'}
                    />
                  </>
                }
                {
                  item.status === 'running' && <>
                    <Result
                      status="info"
                      title="图表生成中"
                      subTitle={item.execMessage}
                    />
                  </>
                }
                {
                  item.status === 'succeed' && <>
                    <div style={{ marginBottom: 16 }} />
                    <p style={{ fontSize: '15px', textShadow: '1px 1px 1px #ccc' }}>{'分析目标：' + item.goal}</p>
                    <div style={{ marginBottom: 16 }} />
                    <ReactECharts option={item.genChart&&JSON.parse(item.genChart)} />
                    <p style={{ backgroundColor: '#ddd', padding: '10px', borderRadius: '10px' }}>{'分析结论：' + item.genResult}</p>
                  </>
                }

                {
                  item.status === 'failed' && <>
                    <Result
                      status="error"
                      title="图表生成失败"
                      subTitle={item.execMessage}
                    />
                  </>
                }
              </>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default MyChart;
