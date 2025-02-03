'use client'
import GithubOutlined  from '@ant-design/icons/GithubOutlined';
import GoogleOutlined  from '@ant-design/icons/GoogleOutlined';
import UserOutlined  from '@ant-design/icons/UserOutlined';
import LockOutlined  from '@ant-design/icons/LockOutlined';
import '../../styles/login.scss'
import Divider from 'antd/es/divider';
import Button from 'antd/es/button/button';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import { signIn } from 'next-auth/react';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
interface FieldType {
    email?: string;
    password?: string;
}
const LoginForm = () => {
    const router = useRouter()
    const [isSubmit,setIsSubmit] = useState<boolean>(false)
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
            router.push('/')
            message.success("Đăng nhập thành công!")
        }else{
           setIsSubmit(false)
           message.error("Tên tài khoản hoặc mật khẩu sai!")
        }
    };
    return (
        <div className="register-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Đăng Nhập</h2>
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
                    </section>
                </div>
            </main>
        </div>
    )
}
export default LoginForm