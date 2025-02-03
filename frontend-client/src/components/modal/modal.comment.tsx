'use client'

import { AddReviewByUser } from "@/utils/action/action";
import { message } from "antd";
import Button from "antd/es/button/button";
import TextArea from "antd/es/input/TextArea";
import Modal from "antd/es/modal/Modal";
import Rate from "antd/es/rate";
import { useState } from "react";
interface IProps{
    isModalOpen :boolean
    setIsModalOpen:(v: any)=>void,
    productID:string
}
const ModalComment=(props :IProps)=>{
    const { isModalOpen, setIsModalOpen, productID } = props
    const [ star , setStar ] = useState<number>(5)
    const [comment,setComment] = useState<string>("")
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleAddReviewByUser = async () => {
        console.log(star)
        const result = await AddReviewByUser(productID,star,comment)
        if (result.code === 201){
            setIsModalOpen(false)
            setStar(5)
            setComment("")
            message.success("Thêm đánh giá thành công")
        }else{
            setIsModalOpen(false)
            setStar(5)
            setComment("")
            message.error("Đã xảy ra lỗi xin hãy thử lại sau")
        }
    }
    return(
      <>
        <Modal width={420} footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <div style={{
                fontSize:"1.5rem",
                display:'flex',
                justifyContent:"center"
            }}>Đánh giá và nhận xét</div>
            <div style={{
                display:"flex",
                flexDirection:"column",
                gap:'0.5rem',
                margin:"0.8rem 0.5rem 0 0.5rem"
            }}>
                <div style={{
                    display:'flex',
                    gap:"1rem"
                }}>
                    <div style={{ fontSize:"1rem" }}>Đánh giá</div>
                    <Rate defaultValue={star} onChange={setStar} value={star} style={{
                        fontSize:"1rem",
                        color:"orange",
                        marginTop:"0.3rem"
                    }}/>
                </div>
                <div style={{ fontSize:"1rem" }}>Nhận xét</div>
                <TextArea
                    showCount
                    maxLength={300}
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                    placeholder="Hãy đóng góp cho chúng mình 1 vài nhận xét và đóng góp ý kiến nhé"
                    style={{ height: 120, resize: 'none' }}
                />
            </div>
            <Button
                disabled={comment !== "" ? false : true} 
                style={{ margin:"2.5rem 0 1rem 0.2rem",width:"23rem" }}
                type="primary" shape="round" 
                size={'large'}
                onClick={handleAddReviewByUser}
            >
                Gửi nhận xét
            </Button>
        </Modal>
     </>
    )
}
export default ModalComment