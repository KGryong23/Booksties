'use client'

import Rate from "antd/es/rate";
import Checkbox from "antd/es/checkbox/Checkbox"
import Modal from "antd/es/modal/Modal"
import Divider from "antd/es/divider";
import InputNumber from "antd/es/input-number";
import { useState } from "react";
import Button from "antd/es/button/button";

interface IProps{
    isModalOpen :boolean
    handleCancel:() => void
    setMinRating:(v: any) => void
    setMinPrice:(v: any) => void
    setMaxPrice:(v: any) => void
    setIsModalOpen:(v: any)=>void
}
const ModalFilter = (props :IProps) =>{
    const {isModalOpen,handleCancel,setMinRating,setMinPrice,setMaxPrice,setIsModalOpen} = props
    const [fiveStars,setFiveStars] = useState<boolean>(false)
    const [fourStars,setFourStars] = useState<boolean>(false)
    const [threeStars,setThreeStars] = useState<boolean>(false)
    const [rating,setRating] = useState<number>(0)
    const [price_1,setPrice_1] = useState<number | null>(null)
    const [price_2,setPrice_2] = useState<number | null>(null)
    const [checkPrice_1,setCheckPrice_1] = useState<boolean>(false)
    const [checkPrice_2,setCheckPrice_2] = useState<boolean>(false)
    const [checkPrice_3,setCheckPrice_3] = useState<boolean>(false)
    const [checkPrice_4,setCheckPrice_4] = useState<boolean>(false)
    const handleRating = (stars :number) => {
      if (stars === 5) {
          setFiveStars(!fiveStars);
          setFourStars(false);
          setThreeStars(false);
          setRating(!fiveStars ? 5 : 0);
      } else if (stars === 4) {
          setFiveStars(false);
          setFourStars(!fourStars);
          setThreeStars(false);
          setRating(!fourStars ? 4 : 0);
      } else if (stars === 3) {
          setFiveStars(false);
          setFourStars(false);
          setThreeStars(!threeStars);
          setRating(!threeStars ? 3 : 0);
      }
    };
    const handleCheckPrice = (priceRange: number) => {
      setCheckPrice_1(false);
      setCheckPrice_2(false);
      setCheckPrice_3(false);
      setCheckPrice_4(false);
    
      if (priceRange === 1) {
        setCheckPrice_1(!checkPrice_1);
        setPrice_1(checkPrice_1 ? null : 0);
        setPrice_2(checkPrice_1 ? null : 60000);
      } else if (priceRange === 2) {
        setCheckPrice_2(!checkPrice_2);
        setPrice_1(checkPrice_2 ? null : 60000);
        setPrice_2(checkPrice_2 ? null : 140000);
      } else if (priceRange === 3) {
        setCheckPrice_3(!checkPrice_3);
        setPrice_1(checkPrice_3 ? null : 140000);
        setPrice_2(checkPrice_3 ? null : 260000);
      } else if (priceRange === 4) {
        setCheckPrice_4(!checkPrice_4);
        setPrice_1(checkPrice_4 ? null : 260000);
        setPrice_2(null);
      }
    };
    const handleClearAll=()=>{
      setFiveStars(false);
      setFourStars(false);
      setThreeStars(false);
      setRating(0);
      setCheckPrice_1(false);
      setCheckPrice_2(false);
      setCheckPrice_3(false);
      setCheckPrice_4(false);
      setPrice_1(null);
      setPrice_2(null);
    }
    const handleClearPrice=()=>{
      setCheckPrice_1(false);
      setCheckPrice_2(false);
      setCheckPrice_3(false);
      setCheckPrice_4(false);
      setPrice_1(null);
      setPrice_2(null);
    }
    const handleSubmit=()=>{
      setMinRating(rating)
      setMinPrice(price_1)
      setMaxPrice(price_2)
      setIsModalOpen(false)
    }
    return(
      <Modal footer={null} title={<p style={{
        marginLeft:'11rem',
        fontSize:"1.2rem"
      }}>Tất cả bộ lọc</p>} open={isModalOpen} onCancel={handleCancel}>
        <Divider style={{marginBottom:"0rem"}}/>
        <div style={{display:"flex",flexDirection:"column"}}>
          <p style={{marginBottom:"0.7rem",fontSize:"1rem",color: "#333",fontWeight:"bold"}}>Đánh giá</p>
          <div style={{display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",gap:"5rem"}}>
              <div style={{display:"flex",gap:'0.5rem'}}>
                <Checkbox checked={fiveStars} onClick={()=>handleRating(5)}/>
                <Rate allowHalf defaultValue={5} style={{
                    fontSize:10,
                    color:"orange",
                    margin:"0.5rem 0 0 0"
                }}/>
                <div style={{
                    margin:"0rem 0 0 0",
                    fontFamily:"initial",
                    fontSize:"1.05rem"
                }}>Từ 5 sao</div>
              </div>
              <div style={{display:"flex",gap:'0.5rem'}}>
                <Checkbox checked={fourStars} onClick={()=>handleRating(4)}/>
                <Rate allowHalf defaultValue={4} style={{
                    fontSize:10,
                    color:"orange",
                    margin:"0.5rem 0 0 0"
                }}/>
                <div style={{
                    margin:"0rem 0 0 0",
                    fontFamily:"initial",
                    fontSize:"1.05rem"
                }}>Từ 4 sao</div>
              </div>
            </div>
            <div style={{display:"flex",gap:'0.5rem',marginTop:'0.7rem'}}>
               <Checkbox checked={threeStars} onClick={()=>handleRating(3)}/>
               <Rate allowHalf defaultValue={3} style={{
                  fontSize:10,
                  color:"orange",
                  margin:"0.5rem 0 0 0"
               }}/>
               <div style={{
                  margin:"0rem 0 0 0",
                  fontFamily:"initial",
                  fontSize:"1.05rem"
               }}>Từ 3 sao</div>
            </div>
          </div>
        </div>
        <Divider style={{marginBottom:"0rem"}}/>
        <div style={{display:"flex",flexDirection:"column"}}>
           <p style={{marginBottom:"0.7rem",fontSize:"1rem",color: "#333",fontWeight:"bold"}}>Giá</p>
           <div style={{display:"flex",gap:'1rem'}}>
              <div
              onClick={() => handleCheckPrice(1)} 
              style={{
                border: `0.05rem solid ${checkPrice_1 ? "blue" : "black"}`,
                borderRadius:"1rem",
                padding:"0.4rem 0.7rem",
                fontSize:"1rem",
                cursor:"pointer"
              }}>
                Dưới 60.000
              </div>
              <div 
              onClick={() => handleCheckPrice(2)}
              style={{
                border: `0.05rem solid ${checkPrice_2 ? "blue" : "black"}`,
                borderRadius: "1rem",
                padding: "0.4rem 0.7rem",
                fontSize: "1rem",
                cursor: "pointer",
              }}
              >
                {`60.000 -> 140.000`}
              </div>
              <div 
              onClick={() => handleCheckPrice(3)}
              style={{
                border: `0.05rem solid ${checkPrice_3 ? "blue" : "black"}`,
                borderRadius: "1rem",
                padding: "0.4rem 0.7rem",
                fontSize: "1rem",
                cursor: "pointer",
              }}
              >
                {`140.000 -> 260.000`}
              </div>
           </div>
           <div 
           onClick={() => handleCheckPrice(4)}
           style={{
             marginTop: "1rem",
             border: `0.05rem solid ${checkPrice_4 ? "blue" : "black"}`,
             borderRadius: "1rem",
             padding: "0.4rem 0.7rem",
             width: "19%",
             fontSize: "1rem",
             cursor: "pointer",
           }}
           >
              Trên 260.000
           </div>
           <p style={{marginBottom:"0.7rem",fontSize:"1rem",fontFamily:"initial"}}>Tự nhập khoảng giá</p>
           <div style={{display:"flex",gap:'1rem'}}>
              <InputNumber 
                 value={price_1}
                 formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                 parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                 size="large"
                 style={{width:"10rem"}}
              />
              <div style={{marginTop:"0.5rem"}}>
                {`->`}
              </div>
              <InputNumber
                 value={price_2} 
                 formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                 parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                 size="large"
                 style={{width:"10rem"}}
              />
              <div onClick={handleClearPrice} style={{margin:"0.4rem 0 0 0.5rem",fontSize:"1.1rem",color:"blue",cursor:"pointer"}}>Xóa</div>
           </div>
        </div>
        <Divider/>
        <div style={{display:"flex",justifyContent:"space-between"}}>
           <Button type="default" onClick={handleClearAll}>Xóa tất cả</Button>
           <Button type="primary" onClick={handleSubmit}>Xem kết quả</Button>
        </div>
      </Modal>
    )
}
export default ModalFilter