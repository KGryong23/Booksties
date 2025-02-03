'use client'

import { CancelAuction, EndAuction } from "@/utils/action/action"
import Button from "antd/es/button/button"
import Divider from "antd/es/divider"
import Drawer from "antd/es/drawer"
import notification from "antd/es/notification"
interface IProps{
  onClose:()=> void
  open:boolean,
  auction:IAuction 
}
const DrawerDetails=(props :IProps)=>{
  const { onClose , open, auction } = props
  const handleCancelAuction = async () => {
    try {
       const result = await CancelAuction(auction.id)
       if(result.code === 201){
         notification.success({
            message: "Thành công",
            description: "Hủy phiên thành công",
            duration: 2,
         });
         onClose()
       }else{
         notification.error({
            message: "Thất bại",
            description: "Hủy phiên thất bại",
            duration: 2,
         });
       }
      } catch (error) {
         notification.error({
           message:"Cảnh báo!!!",
           description:"Bạn không có quyền !!!",
           duration:2
         })
     } 
  }
  const handleEndAuction = async() => {
    try {
      const result = await EndAuction(auction.id)
      if(result.code === 201){
         notification.success({
            message: "Thành công",
            description: "Kết thúc phiên thành công",
            duration: 2,
         });
         onClose()
      }else{
         notification.error({
            message: "Thất bại",
            description: "Kết thúc phiên thất bại",
            duration: 2,
         });
      }
      } catch (error) {
         notification.error({
         message:"Cảnh báo!!!",
         description:"Bạn không có quyền !!!",
         duration:2
         })
      } 
  }
    return(
      <Drawer width={`30rem`} title="Chi tiết về đấu giá" onClose={onClose} open={open}>
         <div>
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
              gap:'0.3rem',
              fontSize:"1.2rem",
              marginTop:"1rem"
           }}>
             <div>
                Người bán:
             </div>
             <div style={{
                 display: "inline-block",
                 maxWidth:"23rem",
                 whiteSpace: "nowrap",
                 overflow: "hidden",
                 textOverflow: "ellipsis",
             }}>
                {auction.seller}
             </div>
           </div>
           <div style={{
              display:"flex",
              gap:'0.3rem',
              fontSize:"1.2rem",
              marginTop:"1rem"
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
           <Divider/>
           <div style={{
                  display:"flex",
                  gap:"0.5rem",
                  justifyContent:'center'
            }}>
              <Button size="large" type="primary" onClick={handleCancelAuction}>Hủy phiên</Button>
              <Button size="large" type="primary" onClick={handleEndAuction}>Kết thúc ngay</Button>
           </div>
         </div>
      </Drawer>
    )
}

export default DrawerDetails