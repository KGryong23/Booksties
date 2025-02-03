'use client'

import { Divider } from "antd"
import Button from "antd/es/button/button"
import Form from "antd/es/form"
import Input from "antd/es/input"
import Modal from "antd/es/modal/Modal"
import Select, { LabeledValue } from "antd/es/select"
import { useEffect, useState } from "react"
interface Iprops{
    isModalOpen:boolean,
    loading:boolean,
    handleOk:(v : any) => void,
    handleCancel:(v :any) => void,
    roles:IRole[]
}
const ModalCreate=(props: Iprops)=>{
    const {isModalOpen,handleOk, handleCancel,roles } = props
    const [roleLabels,setRoleLabels] = useState<LabeledValue[]>([])
    const handleRoleLabels=()=>{
        const convertedData = roles.map(item => ({
          value: item.roleName,
          label: item.roleName
        }));
        setRoleLabels(convertedData)
    }
    useEffect(()=>{
        handleRoleLabels()
    },[])
    return(
        <Modal footer={null} title="Tạo user" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
            layout="vertical"
            name="basic"
            size="large"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 18 }}
            style={{ width:600,marginTop:20 }}
            initialValues={{ remember: true }}
            onFinish={handleOk}
            autoComplete="off"
            
        >
            <Form.Item<ICreateUser>
            name="email"
            rules={[{ required: true, message: 'Trống!' }]}
            >
            <Input placeholder="Email người dùng"/>
            </Form.Item>
            <Form.Item<ICreateUser>
            name="password"
            rules={[{ required: true, message: 'Trống!' }]}
            >
            <Input placeholder="Mật khẩu"/>
            </Form.Item>
            <Form.Item>
            <Form.Item<ICreateUser>
            name="role"
            rules={[{ required: true, message: 'Trống!' }]}
            >
               <Select
                  placeholder="Role"
                  options={roleLabels}
                />
            </Form.Item>
            <Divider/>
            <div style={{display:'flex',gap:30,marginLeft:"8rem"}}>
                <Button type="primary" htmlType="submit" loading={props.loading}>
                    Tạo mới
                </Button>
                <Button type="default" htmlType="reset" loading={props.loading}>
                    Clear
                </Button>
            </div>
            </Form.Item>
        </Form> 
      </Modal>
    )
}
export default ModalCreate