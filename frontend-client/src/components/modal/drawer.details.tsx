'use client'

import Divider from "antd/es/divider"
import Drawer from "antd/es/drawer"
import CheckOutlined from '@ant-design/icons/CheckOutlined'
import CloseOutlined from '@ant-design/icons/CloseOutlined'
import { useEffect, useState } from "react"
import { GetTransactionBySeller, UpdateTransactionBySeller } from "@/utils/action/action"
import notification from "antd/es/notification"

interface IProps{
  onClose:()=> void
  open:boolean,
  auction:IAuction 
}

const DrawerDetails=(props :IProps)=>{
  const { onClose , open, auction } = props
  const [status,setStatus] = useState<string | null>(null)
  const [address,setAddress] = useState<string | null>(null)
  const handleGetTransaction = async() => {
       const result = await GetTransactionBySeller(auction.id);
       if(result.data){
           setStatus(result.data.status)
           setAddress(result.data.address)
       }
  }
  const handleUpdateStatus = async(status :string) => {
       if(!auction.winner){
         notification.error({
            message: "Thông báo",
            description: "Chưa có người chiến thắng",
         })
         return
       }
       if(!address){
         notification.error({
            message: "Thông báo",
            description: "Người thắng điền địa chỉ thông tin",
         })
         return
       }
      const result = await UpdateTransactionBySeller(auction.id,status)
      if(result.code === 201){
         notification.success({
            message: "Thông báo",
            description: "Cập nhật thành công",
         })
        await handleGetTransaction()
      }else{
         notification.error({
            message: "Thông báo",
            description: "Cập nhật không thành công",
         })
      }
  }
  useEffect(()=>{
     handleGetTransaction()
  },[])
    return(
      <Drawer width={`30rem`} title="Chi tiết về đấu giá" onClose={onClose} open={open}>
         <div>
           <div style={{
              display:"flex",
              gap:'0.3rem',
              fontSize:"1.2rem"
           }}>
             <div>
                Người Chiến thắng:
             </div>
             <div style={{
                 display: "inline-block",
                 maxWidth:"23rem",
                 whiteSpace: "nowrap",
                 overflow: "hidden",
                 textOverflow: "ellipsis",
             }}>
                {auction.winner ?? "Chưa có"}
             </div>
           </div>
           <div style={{
              display:'flex',
              gap:'1rem'
           }}>
           <div style={{
              display:"flex",
              gap:'0.3rem',
              fontSize:"1.2rem",
              marginTop:"0.5rem"
           }}>
             <div>
                Trạng thái giao dịch:
             </div>
             <div style={{
                 display: "inline-block",
                 maxWidth:"23rem",
                 whiteSpace: "nowrap",
                 overflow: "hidden",
                 textOverflow: "ellipsis",
             }}>
                {status ?? "đang xử lý"}
             </div>
           </div>
           <CheckOutlined style={{ marginTop:"0.5rem",cursor:"pointer" }} onClick={()=>handleUpdateStatus("Shipped")}/>
           <CloseOutlined style={{ marginTop:"0.5rem",cursor:"pointer" }} onClick={()=>handleUpdateStatus("Cancelled")}/>
           </div>
           <div style={{
              display:"flex",
              gap:'0.3rem',
              fontSize:"1.2rem",
              marginTop:"0.5rem"
           }}>
             <div>
                Địa chỉ cần giao:
             </div>
             <div style={{
                 display: "inline-block",
                 maxWidth:"23rem",
                 whiteSpace: "nowrap",
                 overflow: "hidden",
                 textOverflow: "ellipsis",
             }}>
                {address ?? "Chưa có"}
             </div>
           </div>
           <Divider/>
           <div style={{
              display:"flex",
              gap:'0.3rem',
              fontSize:"1.2rem"
           }}>
             <div>
                Tên sản phẩm:
             </div>
             <div>
                {auction.title}
             </div>
           </div>
           <div style={{
              display:"flex",
              gap:'0.3rem',
              fontSize:"1.2rem",
              marginTop:"1rem"
           }}>
             <div>
                Tác giả:
             </div>
             <div>
                {auction.author}
             </div>
           </div>
           <div style={{
              display:"flex",
              gap:'0.3rem',
              fontSize:"1.2rem",
              marginTop:"1rem"
           }}>
             <div>
                Nhà xuất bản:
             </div>
             <div>
                {auction.publisher}
             </div>
           </div>
           <div style={{
              display:"flex",
              gap:'0.3rem',
              fontSize:"1.2rem",
              marginTop:"1rem"
           }}>
             <div>
                Năm xuất bản:
             </div>
             <div>
                {auction.year}
             </div>
           </div>
           <div style={{
              display:"flex",
              gap:'0.3rem',
              fontSize:"1.2rem",
              marginTop:"1rem"
           }}>
             <div>
                Số trang:
             </div>
             <div>
                {auction.pageCount}
             </div>
           </div>
           <div style={{
              display:"flex",
              gap:'0.3rem',
              fontSize:"1.2rem",
              marginTop:"1rem"
           }}>
             <div>
                Mô tả:
             </div>
             <div style={{
                 display: "inline-block",
                 maxWidth:"23rem",
                 whiteSpace: "nowrap",
                 overflow: "hidden",
                 textOverflow: "ellipsis",
             }}>
                {auction.description}
             </div>
           </div>
           <Divider/>
           <div style={{
              display:"flex",
              gap:'2rem',
              fontSize:"1.2rem",
              marginTop:"1.5rem"
           }}>
             <div>
                Hình ảnh mô tả:
             </div>
             {auction && (
                <img 
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/images/${auction.imageUrl}`}
                    alt="example"
                    style={{
                    width: "10rem",
                    height: "10rem",
                    borderRadius: "0.5rem"
                    }}
                />
              )}
           </div>
         </div>
      </Drawer>
    )
}

export default DrawerDetails