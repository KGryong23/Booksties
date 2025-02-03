'use client'

import GithubOutlined  from '@ant-design/icons/GithubOutlined';
import GoogleOutlined  from '@ant-design/icons/GoogleOutlined';
import UserOutlined  from '@ant-design/icons/UserOutlined';
import LockOutlined  from '@ant-design/icons/LockOutlined';
import Divider from 'antd/es/divider';
import Button from 'antd/es/button/button';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import { signIn } from 'next-auth/react';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Modal from 'antd/es/modal/Modal';
import { useSearchContext } from '@/lib/search.wrapper';

interface FieldType {
    email?: string;
    password?: string;
}
const ModalGeneral = () => {
    const [isSubmit,setIsSubmit] = useState<boolean>(false)
    const {isModalOpen,setIsModalOpen} = useSearchContext()
    const onFinish = async (value: FieldType) => {
        if (value.password?.length! < 5){
            message.error("Mật khẩu phải dài hơn 5 kí tự")
            return
        }
        setIsSubmit(true)
        const res = await signIn('credentials',
        {
            email: value.email,
            password: value.password,
            redirect: false
        })
        if(!res?.error)
        {
            setIsModalOpen(false)
            message.success("Đăng nhập thành công!")
        }else{
           setIsSubmit(false)
           setIsModalOpen(false)
           message.error("Tên tài khoản hoặc mật khẩu sai!")
        }
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <Modal footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <div style={{ padding:"2rem" }}>
            <h2 style={{ marginLeft:"7.5rem",fontSize:"1.8rem" }}>Đăng nhập</h2>
            <Form
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    name="email"
                    rules={[{ required: true, message: 'Please input your Email!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" style={{ height: '50px' }} />
                </Form.Item>

                <Form.Item<FieldType>
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                        style={{ height: '50px' }}
                    />
                </Form.Item>
                <Form.Item
                    labelCol={{ span: 24 }}
                >
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                            width: "100%",
                            height: '40px',
                            marginTop: '10px'
                        }}
                    loading={isSubmit}
                    >
                        Đăng Nhập
                    </Button>
                </Form.Item>
                <Divider>Hoặc</Divider>
                <div style={{display:'flex',gap:30,justifyContent:'center',alignItems:'center'}}>
                    <GithubOutlined style={{fontSize:40}}  onClick={() =>{signIn('github')}}/>
                    <GoogleOutlined style={{fontSize:47}} onClick={() =>{signIn('google')}}/>                            
                </div>
                <div style={{margin:'30px 0 0 100px'}}>
                    <Link href={'/auth/signup'} style={{color:'blue',textDecoration:'none'}}>Bạn chưa có tài khoản? Đăng ký</Link>
                </div>
            </Form>
          </div>
        </Modal>
    );
};
export default ModalGeneral;
