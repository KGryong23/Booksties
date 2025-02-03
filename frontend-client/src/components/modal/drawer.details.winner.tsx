'use client'

import Divider from "antd/es/divider"
import Drawer from "antd/es/drawer"

interface IProps{
  onClose:()=> void
  open:boolean,
  auction:IAuctionWinner 
}

const DrawerDetailsWinner=(props :IProps)=>{
  const { onClose , open, auction } = props
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

export default DrawerDetailsWinner