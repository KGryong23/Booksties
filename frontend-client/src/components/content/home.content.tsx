'use client'

import Rate from "antd/es/rate";
import PercentageOutlined  from '@ant-design/icons/PercentageOutlined';
import DollarOutlined  from '@ant-design/icons/DollarOutlined';
import MinusOutlined  from '@ant-design/icons/MinusOutlined';
import FilterOutlined  from '@ant-design/icons/FilterOutlined';
import LikeOutlined  from '@ant-design/icons/LikeOutlined';
import FireOutlined  from '@ant-design/icons/FireOutlined';
import Button from "antd/es/button";
import Checkbox, { CheckboxProps } from "antd/es/checkbox/Checkbox";
import Select from "antd/es/select";
import { useState } from "react";
import ModalFilter from "./modal.filter";
import HomeSlider from "./home.slider";
import Link from "next/link";


interface IProps{
   products: IProductNotDetail[]
   genre : string | null
   setGenre:(v: any) => void
   limit: number | null
   setLimit:(v: any) => void
   minRating:number | null
   setMinRating:(v: any) => void
   minPrice:number | null
   setMinPrice:(v: any) => void
   maxPrice:number | null
   setMaxPrice:(v: any) => void
   sortBy:string | null
   setSortBy:(v: any) => void
}

const contentStyle_1: React.CSSProperties = {
   background:'white',
   margin: '0 4rem 1rem 2rem', 
   borderRadius: '0.5rem',
   height:'11vh'
};

const contentStyle_2: React.CSSProperties = {
   background:'white',
   margin: '0 4rem 1rem 2rem', 
   borderRadius: '0.5rem',
   height:'10vh',
   display:"flex",
};

const contentStyle_3: React.CSSProperties = {
   display: 'grid',
   gridTemplateColumns: 'repeat(4, 1fr)', 
   gap: '0.5rem', 
   margin: '0 4rem 0 2rem', 
};

const contentStyle_4: React.CSSProperties = {
   margin: '0 4rem 1rem 2rem', 
   height:'38vh',
};

const productItemStyle: React.CSSProperties = {
   width: '100%', 
   height: 'auto', 
   background: 'white',
   cursor: 'pointer',
   borderRadius: '0.5rem',
   padding: '0.3rem', 
   boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
   transition: 'transform 0.2s', 
   display: 'flex',
   flexDirection: 'column',
};

const imgStyle: React.CSSProperties = {
   width: '90%', 
   height: 'auto', 
   borderRadius: '0.25rem', 
};

const HomeContent = (data :IProps) => {
   const {genre,products,setLimit,setMinRating,setMinPrice,setMaxPrice,sortBy,setSortBy} = data
   const handleLimit=()=>{
      setLimit((x: number) => x + 1);
   }
   const onChange: CheckboxProps['onChange'] = (e) => {
      if(e.target.checked === true){
         setMinRating(4)
      }else{
         setMinRating(null)
      }
    };
   const handleChange = (value: string) => {
      setSortBy(value)
   };
   const [isModalOpen, setIsModalOpen] = useState(false);

   const showModal = () => {
      setIsModalOpen(true);
   };

   const handleCancel = () => {
      setIsModalOpen(false);
   };
   
   return(
    <div>
       <div style={contentStyle_1}>
          <div style={{
            padding:"1.5rem 0 0 0.6rem",
            fontSize: "2rem", 
            fontWeight: "bold",
            color: "#333",
            fontFamily: "Arial, sans-serif",
          }}>
            {genre ? genre :`Tất cả các thể loại`}
          </div>
       </div>
       <div style={contentStyle_4}>
         <HomeSlider/>
       </div>
       <div style={contentStyle_2}>
          <div style={{display:"flex",width:"40rem",gap:'1rem',marginLeft:"1rem"}}>
            <div style={{margin:"1.65rem 0 0 0",fontSize:15,display:"flex",gap:'0.5rem'}}>
               <Checkbox style={{marginBottom:"1.15rem"}}/> 
               <FireOutlined style={{marginBottom:"1.15rem",color:"#FF0000"}}/>
               <div style={{
                  marginTop:"0.4rem",
                  fontSize:"1rem",
                  fontFamily: "Arial, sans-serif", 
               }}>
                  Giá tốt nhất
               </div>   
            </div>
            <div style={{
               borderRight:"0.05rem solid #C8C8C8",
               height:"1.4rem",
               marginTop:"1.8rem"
            }}></div>
            <div style={{margin:"1.65rem 0 0 0",fontSize:15,display:"flex",gap:'0.6rem'}}>
               <Checkbox style={{marginBottom:"1.15rem"}}/> 
               <div style={{display:"flex",gap:"0.3rem",color:"#FF0000"}}>
                  <LikeOutlined style={{marginBottom:"1.15rem"}}/>
                  <div style={{marginTop:"0.35rem",fontFamily:"initial",fontSize:"1.01rem"}}>TOP DEAL</div>
               </div>
               <div style={{marginTop:"0.35rem",fontFamily: "Arial, sans-serif",fontSize:"1.01rem"}}>
                  Siêu rẻ
               </div>   
            </div>
            <div style={{
               borderRight:"0.05rem solid #C8C8C8",
               height:"1.4rem",
               marginTop:"1.8rem"
            }}></div>
            <div style={{display:"flex",gap:'0.5rem'}}>
               <Checkbox onChange={onChange} style={{marginTop:"0.5rem"}}/>
               <Rate allowHalf defaultValue={4} style={{
                  fontSize:10,
                  color:"orange",
                  margin:"2.25rem 0 0 0"
               }}/>
               <div style={{
                  margin:"1.98rem 0 0 0",
                  fontFamily: "Arial, sans-serif",
                  fontSize:"1rem"
               }}>Từ 4 sao</div>
            </div>
          </div>
          <div style={{
            display:"flex",
            margin: `1.2rem 0 0 ${["price_desc", "price_asc"].includes(sortBy!) ? "9.5rem" : "13rem"}`,
            gap:"0.7rem"
         }}>
            <div style={{
               margin:"0.6rem 0 0 0",
               fontSize:"1.1rem",
               color:'#808080',
               fontFamily:"revert"
            }}>
               Sắp xếp
            </div>
            <Select
               defaultValue={`${sortBy}`}
               size="large"
               onChange={handleChange}
               options={[
               { value: 'high_rating', label: 'Phổ biến' },
               { value: 'best_selling', label: 'Bán chạy' },
               { value: 'price_desc', label: 'Giá cao đến thấp' },
               { value: 'price_asc', label: 'Giá thấp đến cao'},
               ]}
            />
            <div style={{
               borderRight:"0.05rem solid #C8C8C8",
               height:"2rem",
               marginTop:"0.2rem"
            }}></div>
            <Button
              style={{marginTop:'0.25rem',width:"4rem"}}
              icon={
                <div style={{display:"flex",gap:'0.2rem'}}>
                  <FilterOutlined />
                  <div>Tất cả</div>
                </div>
              }
              onClick={showModal}
            />
          </div>
       </div>
       <div style={contentStyle_3}>
           {
             products.map((item,index)=>(
               <div
                key={index}
                  style={productItemStyle}
               >
               <Link href={`/book/${item.id}`}>
                  <div style={{
                     width:"100%",
                     display:'flex',
                     justifyContent:"center"
                  }}>
                     <img 
                       style={imgStyle} 
                       alt="example" 
                       src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog/images/${item.image_url}`} 
                     />
                  </div>
                  <div style={{
                     margin:"1rem 0 1rem 0.5rem"
                  }}>
                     <div style={{display:'flex',gap:"0.4rem"}}>
                        <div style={{
                           fontSize:20,
                           display:'flex',
                           color:item.discount_percentage > 0 ? "red" : "black",
                        }}>
                           <div style={{
                              fontWeight: 400, textShadow: '0.01rem 0.01rem 0 currentColor'
                           }}>
                              {(item.price * (1 - item.discount_percentage / 100)).toLocaleString('vi-VN')}
                           </div>
                           <DollarOutlined style={{fontSize:14,margin:"0 0 0.3rem 0.2rem"}}/>
                        </div>
                        {
                        item.discount_percentage > 0
                        ?
                        <div style={{
                           display:'flex',
                           margin:'0.2rem 0 0.2rem 0.2rem',
                           background:"#DCDCDC",
                           borderRadius:"0.5rem",
                           padding:"0 0.2rem 0 0.2rem"
                        }}>
                           <MinusOutlined style={{fontSize:6.8}}/>
                           <div style={{marginLeft:'0.1rem'}}>
                             {item.discount_percentage}
                           </div>
                           <PercentageOutlined />
                        </div>
                        :
                        <></>
                        }
                     </div>
                     <div style={{
                        marginTop:"0.8rem",
                        fontSize:17,
                        color:'#808080'
                     }}>
                        {item.author}
                     </div>
                     <div style={{
                        marginTop: "0.4rem",
                        fontSize: 18,
                        color: "black",
                        display: "-webkit-box", 
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical", 
                        overflow: "hidden",
                     }}>
                        {item.title}
                     </div>
                     <div style={{
                        display:'flex',
                        marginTop:"1rem",
                        gap:"0.5rem"
                     }}>
                        {
                        item.average_rating > 0
                        ?
                        <>
                        <Rate allowHalf value={item.average_rating} style={{
                            fontSize:14,
                            color:"orange",
                            marginTop:"0.2rem"
                        }}/>
                        <div style={{
                           borderRight:"0.05rem solid #C8C8C8",
                           height:"0.9rem",
                           marginTop:"0.2rem"
                        }}></div>
                        </>
                        :
                        <></>
                        }
                        <div style={{
                           color:'#808080',
                           fontFamily:"revert",
                           fontSize:15
                        }}>
                           Đã bán {item.sold_quantity}
                        </div>
                     </div>
                  </div>
                  <div style={{borderTop:"0.5px solid #F0F0F0",height:"2rem",marginTop:"auto"}}>
                     <div style={{
                       margin:"0.5rem 0 0 0.5rem",
                       color:'#808080',
                       fontFamily:"revert",
                       fontSize:15
                     }}>
                       Giao thứ 5, 12/29
                     </div>
                  </div>
               </Link>  
               </div>
             ))
           }
       </div>
       <div style={{
         display:"flex",
         justifyContent:"center",
         marginTop:'1rem',
       }}>
         <Button type="primary" style={{width:'15rem',height:"2.5rem"}} ghost onClick={handleLimit}>
            Xem thêm
         </Button>
       </div>
       <ModalFilter
           isModalOpen={isModalOpen}
           setIsModalOpen={setIsModalOpen}
           handleCancel={handleCancel}
           setMinRating={setMinRating}
           setMinPrice={setMinPrice}
           setMaxPrice={setMaxPrice}
       />
    </div>
   )
}
export default HomeContent