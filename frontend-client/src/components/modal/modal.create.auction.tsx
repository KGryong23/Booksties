'use client'

import Modal from "antd/es/modal/Modal"
import Upload, { UploadProps } from "antd/es/upload/Upload"
import ImgCrop from 'antd-img-crop';
import { useState } from "react";
import { UploadFile } from "antd/es/upload";
import InputNumber from "antd/es/input-number";
import Divider from "antd/es/divider";
import Form, { FormProps } from "antd/es/form";
import Button from "antd/es/button/button";
import Input from "antd/es/input/Input";
import { CreateAuction, uploadFile } from "@/utils/action/action";
import notification from "antd/es/notification";

interface IProps{
    isModalOpen:boolean,
    handleCancel:() => void
    loading:boolean,
    setLoading:(v :any) => void
    setIsModalOpen:(v :any) => void
}

type FileType = File;

const ModalCreateAuction=(props : IProps)=>{
    const { isModalOpen, handleCancel,setLoading,setIsModalOpen } = props
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
          setFileList(newFileList.slice(-1)); 
    };
    const onFinish: FormProps<ICreateAuction>["onFinish"] = async (values) => {
        setLoading(true)
        if (fileList.length === 0) {
            console.error('No file selected');
            setLoading(false)
            return;
        }
    
        const file = fileList[0].originFileObj;
    
        if (!file) {
            console.error('File is missing or invalid');
            setLoading(false)
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
          const uploadResponse = await uploadFile(formData);
          if(uploadResponse.code === 201){
             const res = await CreateAuction(values,uploadResponse.data)
             if(res.data === 0){
                notification.success({
                    message: "Thành công",
                    description: "Tạo đấu giá thành công",
                })
             }else if(res.data === 1){
                notification.error({
                    message: "Thất bại",
                    description: "Đã đạt giới hạn tạo 3 lần",
                })
             }
          }
    
        } catch (error) {
            console.error('Error uploading file:', error);
        }
        setLoading(false)
        setIsModalOpen(false)
    };
    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
        src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj as FileType);
            reader.onload = () => resolve(reader.result as string);
        });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };
    return(
      <Modal footer={null} title="Tạo mới phiên đấu giá" open={isModalOpen} onCancel={handleCancel}>
        <Form
            layout="vertical"
            name="basic"
            size="large"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 18 }}
            style={{ width:600,marginTop:20 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            
        >
            <Form.Item<ICreateAuction>
            name="title"
            rules={[{ required: true, message: 'Trống!' }]}
            >
            <Input placeholder="Tên sản phẩm"/>
            </Form.Item>
            <Form.Item<ICreateAuction>
            name="author"
            rules={[{ required: true, message: 'Trống!' }]}
            >
            <Input placeholder="Tác giả"/>
            </Form.Item>
            <Form.Item<ICreateAuction>
            name="publisher"
            rules={[{ required: true, message: 'Trống!' }]}
            >
            <Input placeholder="Nhà xuất bản"/>
            </Form.Item>
            <Form.Item<ICreateAuction>
            name="description"
            rules={[{ required: true, message: 'Trống!' }]}
            >
              <Input placeholder="Mô tả"/>
            </Form.Item>
            <div style={{ display:"flex" }}>
              <div style={{ }}>
               <div style={{ display:'flex',gap:'1rem' }}>
                <Form.Item<ICreateAuction>
                name="year"
                rules={[{ required: true, message: 'Trống!' }]}
                >
                <InputNumber placeholder="Năm xuất bản" style={{ width:"10rem" }}/>
                </Form.Item>
                <Form.Item<ICreateAuction>
                name="pageCount"
                rules={[{ required: true, message: 'Trống!' }]}
                >
                <InputNumber placeholder="Số trang" style={{ width:"9rem" }}/>
                </Form.Item>
               </div>
                <Form.Item<ICreateAuction>
                name="reservePrice"
                rules={[{ required: true, message: 'Trống!' }]}
                >
                <InputNumber placeholder="Giá ban đầu" style={{ width:"20rem" }}/>
                </Form.Item>
              </div>
              <div style={{ marginLeft:"1.5rem"}}>
                <ImgCrop>
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange}
                        onPreview={onPreview}
                        maxCount={1}
                    >
                        {fileList.length < 1 && '+ Upload'}
                    </Upload>
                </ImgCrop>
              </div>
            </div>
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
export default ModalCreateAuction