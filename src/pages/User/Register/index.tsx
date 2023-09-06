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
import {  history } from '@umijs/max';
import { message} from 'antd';
import React from 'react';
import { userRegisterUsingPOST } from '@/services/BI-System/userController';

const Register: React.FC = () => {
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

  const handleSubmit = async (values: API.UserRegisterRequest) => {
    const {userPassword, checkPassword} = values;
    // 校验
    if (userPassword !== checkPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    try {
      // 注册
      const res = await userRegisterUsingPOST(values);
      if (res.code===0) {
        const defaultLoginSuccessMessage = '注册成功！';
        message.success(defaultLoginSuccessMessage);
        // 弹窗提示成功之后获取当前用户信息
        // await fetchUserInfo();
        // 跳转回登录前的页面
        history.push('/user/login');
        return;
      }
    } catch (error: any) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  
  return (
    <div className={containerClassName}>
      <div
        style={{flex: '1',padding: '32px 0',}} >
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: '注册',
            }
          }}
          logo={<img alt="logo" src='/logo.svg'/>}
          title="BI-System"
          subTitle='BI System 是西湖区最具影响力的 Web 设计规范'
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserRegisterRequest);
          }}
        >
            <ProFormText
            name="userAccount"
            fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
            }}
            placeholder="请输入账号"
            rules={[
                {
                required: true,
                message: '账号是必填项！',
                },{
                pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,25}$/,
                message: '限制2~25个字，支持中英文、数字、字符',
                }
            ]}
            />
            <ProFormText.Password
            name="userPassword"
            fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
            }}
            placeholder="请输入密码"
            rules={[
                {
                required: true,
                message: '密码是必填项！',
                },{
                pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z!@#$%~&*?+\-<>:']+$)(?![a-z0-9]+$)(?![a-z!@#$%~&*?+\-<>:']+$)(?![0-9!@#$%~&*?+\-<>:']+$)[a-zA-Z0-9!@#$%~&*?+\-<>:']{8,25}$/,
                message: '请输入8-25字符，大写字母、小写字母、数字、特殊符号至少包含三种',
                },
            ]}
            />
            <ProFormText.Password
            name="checkPassword"
            fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
            }}
            placeholder="请再次输入密码"
            rules={[
                {
                required: true,
                message: '确认密码是必填项！',
                },{
                pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z!@#$%~&*?+\-<>:']+$)(?![a-z0-9]+$)(?![a-z!@#$%~&*?+\-<>:']+$)(?![0-9!@#$%~&*?+\-<>:']+$)[a-zA-Z0-9!@#$%~&*?+\-<>:']{8,25}$/,
                message: '请输入8-25字符，大写字母、小写字母、数字、特殊符号至少包含三种',
                },
            ]}
            />
            {/* <ProFormText
            name="planetCode"
            fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
            }}
            placeholder="请输入星球编号"
            rules={[
                {
                required: true,
                message: '星球编号是必填项！',
                },
            ]}
            /> */}
    </LoginForm>

        {/* <ProForm
          style={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          title="BI System"
          onFinish={async (values) => {
            await handleSubmit(values as API.UserRegisterRequest);
          }}
          submitter = {
            {
                //配置按钮文本
                searchConfig:{
                    submitText:'注册',
                    resetText:'重置'
                }
            }
          }
          autoFocusFirstInput
        >
         
         <ProFormText 
            name='userAccount'
            fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
            label='账号'
            placeholder='请输入账号'
            rules={[
                {
                  required: true,
                  message: ("请输入用户名!"),
                },{
                  pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,25}$/,
                  message: '限制2~25个字，支持中英文、数字、字符',
                }
              ]}
         />
         <ProFormText.Password 
            name='userPassword'
            fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
            label='密码'
            placeholder='请输入密码'
            rules={[
                {
                  required: true,
                  message: ("请输入密码!"),
                },{
                  pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z!@#$%~&*?+\-<>:']+$)(?![a-z0-9]+$)(?![a-z!@#$%~&*?+\-<>:']+$)(?![0-9!@#$%~&*?+\-<>:']+$)[a-zA-Z0-9!@#$%~&*?+\-<>:']{8,25}$/,
                  message: '请输入8-25字符，大写字母、小写字母、数字、特殊符号至少包含三种',
                },{
                  validator: (rule, value, callback) => {  } 
                }
              ]}
         />
         <ProFormText.Password 
            name='checkPassword'
            fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
            label='密码'
            placeholder='请确认密码'
            rules={[
                {
                  required: true,
                  message: ("请确认密码!"),
                },{
                  pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z!@#$%~&*?+\-<>:']+$)(?![a-z0-9]+$)(?![a-z!@#$%~&*?+\-<>:']+$)(?![0-9!@#$%~&*?+\-<>:']+$)[a-zA-Z0-9!@#$%~&*?+\-<>:']{8,25}$/,
                  message: '请输入8-25字符，大写字母、小写字母、数字、特殊符号至少包含三种',
                }
              ]}
         />
        </ProForm> */}
        
      </div>
      <Footer />
    </div>
  );
};

export default Register;
