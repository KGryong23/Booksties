'use client'

import { Divider } from "antd"
import Button from "antd/es/button/button"
import Form from "antd/es/form"
import Input from "antd/es/input"
import Modal from "antd/es/modal/Modal"
interface Iprops{
    isModalOpen:boolean,
    loading:boolean,
    handleOk:(v : any) => void,
    handleCancel:(v :any) => void,
}
interface ICreateRole{
    roleName:string
}

const ModalCreate=(props: Iprops)=>{
    const {isModalOpen,handleOk, handleCancel } = props
    return(
        <Modal width={"22rem"} footer={null} title="Tạo role" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
            layout="vertical"
            name="basic"
            size="large"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 18 }}
            style={{ width:"25rem",marginTop:'2rem' }}
            initialValues={{ remember: true }}
            onFinish={handleOk}
            autoComplete="off"
        >
            <Form.Item<ICreateRole>
            name="roleName"
            rules={[{ required: true, message: 'Trống!' }]}
            >
            <Input placeholder="Tên role"/>
            </Form.Item>
            <Form.Item>
            <Divider style={{ marginTop:"1rem" }}/>
            <div style={{display:'flex',gap:30,marginLeft:"3.5rem"}}>
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