'use client'

import UserOutlined  from '@ant-design/icons/UserOutlined';
import LockOutlined  from '@ant-design/icons/LockOutlined';
import '../../styles/login.scss'
import Divider from 'antd/es/divider';
import Button from 'antd/es/button/button';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { message } from 'antd';
import { SignupUser } from '@/utils/action/action';

interface FieldType {
    email: string;
    password: string;
    re_password: string;
}
const RegiseterForm = () => {
    const router = useRouter()
    const [isSubmit,setIsSubmit] = useState<boolean>(false)
    const onFinish = async (value: FieldType) => {
        setIsSubmit(true)
        if(value.password !== value.re_password){
            message.error("Mật khẩu nhập lại phải chính xác!")
            setIsSubmit(false)
            return
        }
        const result = await SignupUser(value.email,value.password)
        if(result.code === 201){
            message.success("Đăng ký thành công")
            router.push("/")
        }else if(result.code === 301){
            message.error("Thông tin nhập không hợp lệ")
        }else{
            message.error("")
        }
        setIsSubmit(false)
    };
    return (
        <div className="register-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Đăng Ký</h2>
                            <Divider />
                        </div>
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                name="email"
                                rules={[{ required: true, message: 'Please input your Email!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="email" style={{ height: '50px' }} />
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
                            <Form.Item<FieldType>
                                name="re_password"
                                rules={[{ required: true, message: 'Please input your re password!' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Re-enter the password"
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
                                    Đăng Ký
                                </Button>
                            </Form.Item>
                            <div style={{margin:'30px 0 0 100px'}}>
                                <Link href={'/auth/signin'} style={{color:'blue',textDecoration:'none'}}>Bạn đã có tài khoản? Đăng Nhập</Link>
                            </div>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}
export default RegiseterForm