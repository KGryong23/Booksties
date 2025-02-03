'use client'

import Button from "antd/es/button";
import Divider from "antd/es/divider";
import Form from "antd/es/form";
import Input from "antd/es/input";
import InputNumber from "antd/es/input-number";
import Modal from "antd/es/modal"
import Select, { LabeledValue } from "antd/es/select";

interface Iprops{
    isModalOpen:boolean,
    loading:boolean,
    handleOk:(v : any) => void,
    handleCancel:(v :any) => void,
    listGenre: LabeledValue[]
}

const ModalCreateProduct = (props: Iprops) => {
    const {isModalOpen,handleOk, handleCancel,listGenre} = props
    return(
      <Modal footer={null} title="Tạo sản phẩm" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
            <Form.Item<ICreateProduct>
            name="title"
            rules={[{ required: true, message: 'Trống!' }]}
            >
            <Input placeholder="Tên sản phẩm"/>
            </Form.Item>
            <Form.Item<ICreateProduct>
            name="author"
            rules={[{ required: true, message: 'Trống!' }]}
            >
            <Input placeholder="Tác giả"/>
            </Form.Item>
            <Form.Item<ICreateProduct>
            name="publisher"
            rules={[{ required: true, message: 'Trống!' }]}
            >
            <Input placeholder="Nhà xuất bản"/>
            </Form.Item>
            <Form.Item<ICreateProduct>
            name="dimensions"
            rules={[{ required: true, message: 'Trống!' }]}
            >
            <Input placeholder="Kích thước"/>
            </Form.Item>
            <div style={{display:'flex',gap:"1.9rem"}}>
            <Form.Item<ICreateProduct>
            name="publication_year"
            rules={[{ required: true, message: 'Trống!' }]}
            >
              <InputNumber placeholder="Năm xuất bản"/>
            </Form.Item>
            <Form.Item<ICreateProduct>
            name="page_count"
            rules={[{ required: true, message: 'Trống!' }]}
            >
              <InputNumber placeholder="Số trang"/>
            </Form.Item>
            <Form.Item<ICreateProduct>
            name="price"
            rules={[{ required: true, message: 'Trống!' }]}
            >
            <InputNumber placeholder="Giá"/>
            </Form.Item>
            <Form.Item<ICreateProduct>
            name="initialize_warehouse"
            rules={[{ required: true, message: 'Trống!' }]}
            >
            <InputNumber placeholder="Tồn kho"/>
            </Form.Item>
            </div>
            <Form.Item<ICreateProduct>
            name="cover_type"
            rules={[{ required: true, message: 'Trống!' }]}
            >
            <Input placeholder="Loại bìa"/>
            </Form.Item>
            <Form.Item<ICreateProduct>
            name="description"
            rules={[{ required: true, message: 'Trống!' }]}
            >
            <Input placeholder="Mô tả"/>
            </Form.Item>
            <Form.Item<ICreateProduct>
            name="image_url"
            rules={[{ required: true, message: 'Trống!' }]}
            >
            <Input placeholder="Tên ảnh"/>
            </Form.Item>
            <Form.Item<ICreateProduct>
            name="genre_ids"
            rules={[{ required: true, message: 'Trống!' }]}
            >
               <Select
                  placeholder="Thể loại"
                  options={listGenre}
                />
            </Form.Item>
            <Divider/>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <div style={{display:'flex',gap:30,marginLeft:-70}}>
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
export default ModalCreateProduct