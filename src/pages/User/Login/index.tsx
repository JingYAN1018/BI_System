import Footer from '@/components/Footer';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import {  history, useModel, Helmet, Link } from '@umijs/max';
import { message, Tabs } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useState,useEffect } from 'react';
import { flushSync } from 'react-dom';
import { listChartByPageUsingPOST } from '@/services/BI-System/chartController';
import { getLoginUserUsingGET, userLoginUsingPOST } from '@/services/BI-System/userController';


const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const {setInitialState} = useModel('@@initialState');
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  useEffect(()=>{
    listChartByPageUsingPOST({}).then(res=>{
      console.error('res',res)
    })
  })

  const fetchUserInfo = async () => {
    // const userInfo = await initialState?.fetchUserInfo?.();
    const userInfo = await getLoginUserUsingGET();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.UserLoginRequest) => {
    try {
      // 登录
      const res = await userLoginUsingPOST(values);
      // console.log("res",res)
      // 如果响应值res.code为0，则登录成功
      if(res.code === 0){
        const defaultLoginSuccessMessage = '登录成功！'; 
        message.success(defaultLoginSuccessMessage);
        // 弹窗提示成功之后获取当前用户信息
        await fetchUserInfo();
        // 跳转回登录前的页面
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect')||'/');
        return;
      }else{
        message.error(res.message);
      }
      //为了求稳，捕获一个异常
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      // console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
        登录页- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="BI System"
          subTitle='BI System 是西湖区最具影响力的 Web 设计规范'
          onFinish={async (values) => {
            await handleSubmit(values as API.UserLoginRequest);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户密码登录',
              },
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！'
                  },
                ]}
              />
            </>
          )}

          <div
            style={{
              marginBottom: 24,
            }}
          >
              {/* <FormattedMessage id="pages.login.registerAccount" defaultMessage="注册" /> */}
              <Link to='/user/register' id="pages.login.registerAccount">注册账户</Link>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
