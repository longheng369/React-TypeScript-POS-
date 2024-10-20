import { Button, Input, message, Form } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const {data} = await axios.post(`${import.meta.env.VITE_URL}/login`, values); // Update the URL with your actual API endpoint
      message.success('Login successful!');
      localStorage.setItem('token', data.data.token);

      
    } catch (error) {
      message.error('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error('Failed:', errorInfo);
  };

  const token = localStorage.getItem('token');

  
  return (
    <div className='h-screen w-full flex justify-center items-center bg-gray-50 px-4'>
      <div className='border border-gray-200 p-8 rounded-lg shadow-lg bg-white w-full max-w-[28rem] md:max-w-[24rem] lg:max-w-[26rem] flex flex-col gap-4'>
        <h1 className='text-center text-2xl font-bold text-gray-800'>Sign in to system</h1>
        
        <Form
          name='loginForm'
          layout='vertical'
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              placeholder='username@example.com'
              size='large'
            />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder='••••••••'
              size='large'
            />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              className='w-full'
              loading={loading}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
