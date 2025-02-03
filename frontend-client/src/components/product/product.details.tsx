'use client'
import DoubleRightOutlined  from '@ant-design/icons/DoubleRightOutlined';
import PercentageOutlined  from '@ant-design/icons/PercentageOutlined';
import DollarOutlined  from '@ant-design/icons/DollarOutlined';
import MinusOutlined  from '@ant-design/icons/MinusOutlined';
import PlusOutlined  from '@ant-design/icons/PlusOutlined';
import UserOutlined  from '@ant-design/icons/UserOutlined';
import FormOutlined  from '@ant-design/icons/FormOutlined';
import Rate from 'antd/es/rate';
import InputNumber, { InputNumberProps } from 'antd/es/input-number';
import Button from 'antd/es/button/button';
import { useState } from 'react';
import { CreateOrder, CreateQuantityBasket, GetBalance, handleCheckStock } from '@/utils/action/action';
import { message, notification, Progress } from 'antd';
import { useSearchContext } from '@/lib/search.wrapper';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import ModalComment from '../modal/modal.comment';
const imageList = [
   "/3505.jpg",
   "/3742.jpg",
 ];

interface IProps{
    product :IProduct
    reviews : IReview[]
}
const ProductDetails=(props :IProps)=>{
    const {product,reviews} = props
    const {setIsModalOpen} = useSearchContext()
    const { data:session } = useSession()
    const [count,setCount] = useState<number>(1)
    dayjs.extend(relativeTime);
    dayjs.locale('vi');
    const [isModalOpenComment, setIsModalOpenComment] = useState(false);
    const showModalComment = () => {
        setIsModalOpenComment(true);
    };
    const onChange: InputNumberProps['onChange'] = (value) => {
      if(value){
         setCount(parseFloat(value!.toString()))
      }
    };
    const HandlingIncreasesAndDecreases = (check :boolean) => {
      if (check && count <= 100) {
         setCount(p => p + 1);
      } else if (!check && count > 1) {
         setCount(p => p - 1);
      }
    }
    const handleAddProductToCart = async () => {
      if(!session?.user){
         setIsModalOpen(true)
         return
      }
      const result = await handleCheckStock(product.id,count)
      if (result.code !== 201 ){
         notification.error({
            message: "Xin lỗi",
            description: "Số lượng không đủ hoặc đã hết",
         })
         return
      } 
      const res = await CreateQuantityBasket(product.id,count)
      if (res.code === 201){
          message.success("Thêm vào giỏ thành công")
      }
    }
    const handlePercentStar = (star :number) => {
      const count = reviews.filter(review => review.rating === star).length;
      return (count / reviews.length) * 100
    }
    const handleOrder = async () => {
      if(!session?.user){
         setIsModalOpen(true)
         return
      }
      const result = await GetBalance()
      if(result.data < product.price * count){
         notification.error({
            message: "Bị hủy",
            description: "Vui lòng kiểm tra số dư trong ví của bạn",
         })
         return
      }
      let order :IOrderItems[] = [{
         product_id: product.id,
         quantity:count,
         price:product.price * (1 - product.discount_percentage / 100)
      }]
      const res = await CreateOrder((product.price * (1 - product.discount_percentage / 100)) * count,order)
      if (res.code === 201){
         notification.success({
            message: "Thành công",
            description: "Vui lòng kiểm tra lại đơn hàng của bạn",
         })
      } else{
         notification.error({
            message: "Xin lỗi",
            description: "Sản phẩm không đủ hoặc đã hết",
         })
      } 
    }
    return(
        <div style={{margin:"-1rem 3.5rem 0 3.5rem"}}>
           <div style={{
               display:"flex",
               gap:'0.5rem'
           }}>
                <div style={{
                    display:'flex',
                    gap:"0.5rem",
                    fontSize:"1rem",
                    color:"#888888"
                }}>
                    <div>Trang chủ</div>
                    <DoubleRightOutlined style={{marginTop:"0.2rem"}}/>
                </div>
                <div style={{fontSize:"1rem",color:"#484848"}}>
                    {product.title}
                </div>
           </div>
           <div style={{display:'flex',gap:'2rem',marginTop:'0.5rem'}}>
              <div>
                   <img
                     style={{
                        width:"21rem",
                        height:"30rem",
                        borderRadius: '0.5rem',
                     }}  
                     alt="example" 
                     src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog/images/${product.image_url}`} 
                   />
              </div>
              <div style={{
                  width:"45%",
                  display:"flex",
                  flexDirection:"column",
                  gap:'0.5rem'
              }}>
                  <div style={{
                    background:"white",
                    width:"100%",
                    borderRadius: '0.5rem',
                  }}>
                     <div style={{
                        display:'flex',
                        gap:'0.5rem',
                        margin:"1rem 0 0 1rem",
                     }}>
                        <div style={{fontSize:"1rem"}}>Tác giả:</div>
                        <div style={{fontSize:"1rem",color:"blue"}}>{product.author}</div>
                     </div>
                     <div style={{
                        margin:"0.2rem 0 0 1rem",
                        fontSize:"2.5rem",
                        fontFamily:"sans-serif"
                     }}>
                        {product.title}
                     </div>
                     <div style={{
                        display:"flex",
                        gap:"0.4rem",
                        margin:"0.5rem 0 0 1rem"
                     }}>
                        <div style={{display:"flex",gap:"0.5rem"}}>
                           <div style={{
                              fontSize:"1.1rem",
                              marginTop:"-0.17rem"
                           }}>
                              {product.average_rating}
                           </div>
                           <Rate allowHalf value={product.average_rating} style={{
                            fontSize:"0.8rem",
                            color:"orange",
                            marginTop:"0.3rem"
                           }}/>
                        </div>
                        <div style={{
                           color:'#808080',
                           fontFamily:"revert",
                           fontSize:"1rem",
                           marginTop:"-0.1rem"
                        }}>({product.quantity_evaluate})</div>
                        <div style={{
                           borderRight:"0.05rem solid #C8C8C8",
                           height:"0.9rem",
                           marginTop:"0.2rem"
                        }}></div>
                        <div style={{
                           color:'#808080',
                           fontFamily:"revert",
                           fontSize:"1rem",
                           marginTop:"-0.1rem"
                        }}>Đã bán {product.sold_quantity}</div>
                     </div>
                     <div style={{
                        fontSize:20,
                        display:'flex',
                        gap:'0.5rem',
                        color:product.discount_percentage > 0 ? "red" : "black",
                        margin:"0.5rem 0 1rem 0.9rem"
                        }}>
                        <div style={{
                           display:"flex"
                        }}>   
                           <div style={{
                              fontSize:"1.5rem",
                              fontWeight:"500"
                           }}>
                              {(product.price * (1 - product.discount_percentage / 100)).toLocaleString('vi-VN')}
                           </div>
                           <DollarOutlined style={{fontSize:14,margin:"0 0 0.3rem 0.2rem"}}/>
                        </div>
                        {
                        product.discount_percentage > 0
                        ?
                        <div style={{
                           display:'flex',
                           margin:'0.2rem 0 0.2rem 0.2rem',
                           background:"#DCDCDC",
                           borderRadius:"0.5rem",
                           padding:"0 0.2rem 0 0.2rem"
                        }}>
                           <MinusOutlined style={{fontSize:6.8}}/>
                           <div style={{marginLeft:'0.1rem',fontSize:'1.1rem'}}>
                             {product.discount_percentage}
                           </div>
                           <PercentageOutlined style={{fontSize:"1rem"}}/>
                        </div>
                        :
                        <></>
                        }
                     </div>
                  </div>
                  <div style={{
                      display:'flex',
                      flexDirection:"column",
                      background:"white",
                      borderRadius: '0.5rem',
                  }}>
                     <div style={{
                        margin:"0.7rem 0 0 1rem",
                        fontSize:"1.37rem",
                     }}>
                        Thông tin chi tiết
                     </div>
                     <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        margin:"1rem 0rem 0.6rem 1rem",
                        fontSize:"1rem",
                     }}>
                        <div style={{
                           color:"#888888",
                           width:"50%"
                        }}>
                           Nhà xuất bản
                        </div>
                        <div style={{
                           width:"50%"
                        }}>
                           {product.publisher}
                        </div>
                     </div>
                     <div style={{
                        borderTop:"0.01rem solid #C8C8C8",
                        margin:"0 1rem 0 1rem"
                     }}></div>
                     <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        margin:"0.6rem 0rem 0.6rem 1rem",
                        fontSize:"1rem",
                     }}>
                        <div style={{
                           color:"#888888",
                           width:"50%"
                        }}>
                           Năm xuất bản
                        </div>
                        <div style={{
                           width:"50%"
                        }}>
                           {product.publication_year}
                        </div>
                     </div>
                     <div style={{
                        borderTop:"0.01rem solid #C8C8C8",
                        margin:"0 1rem 0 1rem"
                     }}></div>
                     <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        margin:"0.6rem 0rem 0.6rem 1rem",
                        fontSize:"1rem",
                     }}>
                        <div style={{
                           color:"#888888",
                           width:"50%"
                        }}>
                           Kích thước
                        </div>
                        <div style={{
                           width:"50%"
                        }}>
                           {product.dimensions}
                        </div>
                     </div>
                     <div style={{
                        borderTop:"0.01rem solid #C8C8C8",
                        margin:"0 1rem 0 1rem"
                     }}></div>
                     <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        margin:"0.6rem 0rem 0.6rem 1rem",
                        fontSize:"1rem",
                     }}>
                        <div style={{
                           color:"#888888",
                           width:"50%"
                        }}>
                           Loại bìa
                        </div>
                        <div style={{
                           width:"50%"
                        }}>
                           {product.cover_type}
                        </div>
                     </div>
                     <div style={{
                        borderTop:"0.01rem solid #C8C8C8",
                        margin:"0 1rem 0 1rem"
                     }}></div>
                     <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        margin:"0.6rem 0rem 1.5rem 1rem",
                        fontSize:"1rem",
                     }}>
                        <div style={{
                           color:"#888888",
                           width:"50%"
                        }}>
                           Số trang
                        </div>
                        <div style={{
                           width:"50%"
                        }}>
                           {product.page_count}
                        </div>
                     </div>
                  </div>
                  <div style={{
                     display:'flex',
                     flexDirection:"column",
                     background:"white",
                     borderRadius: '0.5rem',
                  }}>
                     <div style={{
                        margin:"1rem 0 0 1rem",
                        fontSize:"1.3rem"
                     }}>Miêu tả sản phẩm</div>
                     <div style={{
                        margin:"1rem 0.5rem 1.5rem 1rem",
                        fontSize:"0.95rem",
                        fontFamily:"sans-serif"
                     }}>{product.description}</div>
                  </div>
                  <div style={{
                     background:"white",
                     borderRadius: '0.5rem'
                  }}>
                  <div style={{
                     display:'flex',
                     flexDirection:"column",
                  }}>
                     <div style={{
                        display:"flex",
                        gap:'0.8rem',
                        margin:"0.7rem 0rem 0.7rem 1rem",
                        fontSize:"1.5rem"
                     }}>
                        <div style={{}}>
                           Độc giả nói gì về
                        </div>
                        <div style={{}}>
                           "{product.title}"
                        </div>
                     </div>
                     <div style={{
                        display:"flex",
                        gap:'0.5rem',
                        margin:"0.2rem 0rem 0.7rem 1rem",
                        fontSize:"1rem"
                     }}>
                        <div>Đánh giá và nhận xét</div>
                        <div>({reviews.length ?? 5})</div>
                     </div>
                     <div style={{
                        borderTop:"0.01rem solid #C8C8C8",
                        margin:"0 1rem 0 1rem"
                     }}></div>
                     <div style={{
                        display:'flex',
                        gap:'3rem',
                        margin:"1.5rem 0rem 1rem 3rem"
                     }}>
                        <div style={{
                           display:'flex',
                           gap:'0.5rem',
                           flexDirection:"column",
                           marginTop:"0.5rem"
                        }}>
                           <div style={{
                                fontSize:"3.2rem"
                           }}>
                              {product.average_rating}
                           </div>
                           <div style={{
                              display:"flex",
                              gap:"0.5rem",
                              fontSize:"1rem"
                           }}>
                              <div>{reviews.length ?? 0}</div>
                              <div>đánh giá</div>
                           </div>
                        </div>
                        <div style={{
                           display:"flex",
                           flexDirection:"column",
                           gap:'0.3rem'
                        }}>
                            <Rate allowHalf defaultValue={5} style={{
                              fontSize:"1rem",
                              color:"orange",
                              marginTop:"0.3rem"
                            }}/>
                            <Rate allowHalf defaultValue={4} style={{
                              fontSize:"1rem",
                              color:"orange",
                              marginTop:"0.3rem"
                            }}/>
                            <Rate allowHalf defaultValue={3} style={{
                              fontSize:"1rem",
                              color:"orange",
                              marginTop:"0.3rem"
                            }}/>
                            <Rate allowHalf defaultValue={2} style={{
                              fontSize:"1rem",
                              color:"orange",
                              marginTop:"0.3rem"
                            }}/>
                            <Rate allowHalf defaultValue={1} style={{
                              fontSize:"1rem",
                              color:"orange",
                              marginTop:"0.3rem"
                            }}/>
                        </div>
                        <div style={{
                           display:"flex",
                           flexDirection:"column",
                           gap:'0.3rem'
                        }}>
                           <Progress percent={handlePercentStar(5)} style={{ width: 250}} strokeColor="orange" showInfo={false}/>
                           <Progress percent={handlePercentStar(4)} showInfo={false} strokeColor="orange"/>
                           <Progress percent={handlePercentStar(3)} showInfo={false} strokeColor="orange"/>
                           <Progress percent={handlePercentStar(2)} showInfo={false} strokeColor="orange"/>
                           <Progress percent={handlePercentStar(1)} showInfo={false} strokeColor="orange"/>
                        </div>
                     </div>
                  </div>
                  <Button 
                     style={{ margin:"0.5rem 0 1rem 25rem" }}
                     type="primary" shape="round"
                     icon={<FormOutlined />} 
                     size={'large'}
                     onClick={showModalComment}
                  >
                     Viết đánh giá
                  </Button>
                  </div>
                  {
                     reviews.map((item,index)=>(
                        <div key={index} style={{
                           display:"flex",
                           justifyContent:"space-between",
                           background:"white",
                           borderRadius: '0.5rem',
                        }}>
                              <div style={{
                                 display:'flex',
                                 gap:'0.8rem',
                                 alignItems:"flex-start",
                                 margin:"1.2rem 0 0.5rem 1.5rem"
                              }}>
                                 <UserOutlined style={{fontSize:"1.5rem"}}/>
                                 <div style={{
                                 display:"flex",
                                 flexDirection:"column",
                                 gap:"0.5rem",
                                 }}>
                                    <div style={{
                                       fontSize:"1.1rem"
                                    }}>
                                       {item.user_name}
                                    </div>
                                    <div style={{
                                       fontSize:"1rem"
                                    }}>
                                       {item.comment}
                                    </div>    
                                 </div>
                              </div>
                              <div style={{
                                 display:'flex',
                                 flexDirection:"column",
                                 gap:'0.5rem',
                                 margin:"1.2rem 1rem 1rem 0rem",
                                 justifyItems:"flex-end"
                              }}>
                                 <div style={{fontSize:"1rem"}}>{dayjs(item?.updated_at).fromNow()}</div>
                                 <Rate disabled value={item.rating} style={{
                                    fontSize:"1rem",
                                    color:"orange",
                                    marginTop:"0.3rem",
                                    display:"flex",
                                    justifyContent:"end"
                                 }}/>
                              </div>
                        </div>
                     ))
                     }
              </div>
              <div style={{
               width:"25%",
               height:"auto",
               display:"flex",
               flexDirection:"column",
               gap:'1rem'
              }}>
                 <div style={{
                    borderRadius:"0.5rem",
                    background:"white",
                    height:"19.5rem"
                 }}>
                  <div style={{
                     display:"flex",
                     flexDirection:"column",
                     gap:"1rem",
                     margin:"0 1rem 0 1rem",
                  }}>
                        <div style={{
                           fontSize:"1.1rem",
                           marginTop:"1rem"
                        }}>
                           Số lượng
                        </div>
                        <div style={{
                           display:"flex",
                           gap:"0.2rem"
                        }}>
                           <Button
                              disabled={count > 1 ? false :true}
                              onClick={()=>HandlingIncreasesAndDecreases(false)}
                              icon={<MinusOutlined />}
                              style={{color:"#888888"}}
                           />
                           <InputNumber style={{width:"3.5rem"}} value={count} min={1} max={100} defaultValue={count} onChange={onChange} />
                           <Button
                              style={{color:"#888888"}}
                              onClick={()=>HandlingIncreasesAndDecreases(true)}
                              icon={<PlusOutlined />}
                           />
                        </div>
                        <div style={{
                           fontSize:"1.1rem"
                        }}>
                           Tạm tính
                        </div>
                        <div style={{
                              display:"flex",
                              gap:'0.1rem'
                           }}>   
                           <div style={{
                              fontSize:"1.5rem",
                              fontWeight:"500",
                              color:"#B22222"
                           }}>
                              {((product.price * (1 - product.discount_percentage / 100)) * count).toLocaleString('vi-VN')}
                           </div>
                           <DollarOutlined style={{
                              fontSize:14,
                              margin:"0 0 0.3rem 0.2rem",
                              color:"#B22222"
                           }}/>
                        </div>
                        <div style={{
                           display:"flex",
                           gap:"0.5rem",
                           flexDirection:"column",
                        }}>
                           <Button onClick={handleOrder} style={{
                              height:"2.5rem",
                              background:"red"
                           }}>
                              <p style={{
                                 color:"white",
                                 fontSize:"1.1rem"
                              }}>Mua ngay</p>
                           </Button>
                           <Button style={{
                              height:"2.5rem",
                              borderColor:"blue"
                           }}
                           onClick={handleAddProductToCart}
                           >
                              <p style={{
                                 color:"blue",
                                 fontSize:"1.1rem"
                              }}>Thêm vào giỏ hàng</p>
                           </Button>
                        </div>
                  </div>
                 </div>
                 {imageList.map((src,index)=> (
                  <div key={index}>
                     <img src={`${src}`} style={{width:'100%', height:"50vh",borderRadius: '0.5rem',}}/>
                  </div>
                 ))}
              </div>
           </div>
           <ModalComment 
              isModalOpen={isModalOpenComment}
              setIsModalOpen={setIsModalOpenComment}
              productID={product.id}
           />
        </div>
    )
}
export default ProductDetails