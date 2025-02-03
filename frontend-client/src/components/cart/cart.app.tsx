'use client'
import DollarOutlined  from '@ant-design/icons/DollarOutlined';
import Button from 'antd/es/button/button';
import InputNumber, { InputNumberProps } from 'antd/es/input-number';
import MinusOutlined  from '@ant-design/icons/MinusOutlined';
import PlusOutlined  from '@ant-design/icons/PlusOutlined';
import DeleteOutlined  from '@ant-design/icons/DeleteOutlined';
import { useEffect, useState } from 'react';
import { CreateOrders, GetBalance, RemoveBasketItemByUserId, UpdateQuantityBasket } from '@/utils/action/action';
import message from 'antd/es/message';
import notification from 'antd/es/notification';
import PercentageOutlined  from '@ant-design/icons/PercentageOutlined';
import { useSession } from 'next-auth/react';
import { Divider } from 'antd';
import { useRouter } from 'next/navigation';
const imageList = [
    "/3505.jpg",
    "/3742.jpg",
];
interface IProps {
   basketItems : IBasketItems[]
}
const CartApp=(props :IProps)=>{
    const {basketItems} = props
    const [totalPrice,setTotalPrice] = useState<number>(0)
    const [ discount,setDiscount ] = useState<number>(0)
    const router = useRouter()
    const onChange: InputNumberProps['onChange'] = (value) => {
        if(value){
        }
    };
    const HandlingIncreasesAndDecreases = async (check :boolean,id:string,value:number) => {
        if (check) {
            await UpdateQuantityBasket(id,value + 1)
        } else{
            await UpdateQuantityBasket(id,value - 1)
        }
    }
    const handleTotalPrice = () => {
        const total = basketItems.reduce((acc, item) => {
          const discountedPrice = item.price * (1 - item.discount_percentage / 100); 
          const itemTotal = discountedPrice * item.quantity; 
          return acc + itemTotal; 
        }, 0);
        if(basketItems.length >= 3){
            setDiscount(30)
        }
        setTotalPrice(total);
    };
    const handleRemoveBasketItem = async (id :string)=>{
        const res = await RemoveBasketItemByUserId(id)
        if (res.code === 201){
           message.success("Xóa thành công")
        } 
    }
    const handleOrder = async () => {
        if (basketItems.length <= 0 && totalPrice === 0){
            notification.error({
                message: "Bị hủy",
                description: "Vui lòng thêm sản phẩm vào giỏ hàng của bạn",
            })
            return
        }
        const result = await GetBalance()
        if(result.data < totalPrice){
            notification.error({
                message: "Bị hủy",
                description: "Vui lòng kiểm tra số dư trong ví của bạn",
            })
            return
        }
        const orderItems: IOrderItems[] = basketItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
        }));
        const res = await CreateOrders(totalPrice * (1 - discount / 100),orderItems)
        if (res.code === 201){
            notification.success({
               message: "Thành công",
               description: "Vui lòng kiểm tra lại đơn hàng của bạn",
            })
            router.push("/account/profile")
        } else{
            notification.error({
               message: "Xin lỗi",
               description: "Sản phẩm không đủ hoặc đã hết",
            })
        } 
    }
    useEffect(()=>{
         handleTotalPrice()
    },[basketItems])
    return(
        <div style={{display:'flex',margin:"1rem 3rem 2rem 3rem",gap:'1.5rem'}}>
           <div style={{width:"70%"}}>
              <div style={{fontSize:"1.2rem",marginBottom:"0.5rem"}}>Giỏ hàng của bạn</div>
              <div style={{display:'flex',flexDirection:'column',gap:"0.5rem"}}>
                {
                    basketItems.map((item,index)=>(
                        <div key={index} style={{background:"white",borderRadius:"0.5rem",display:"flex"}}>
                           <div style={{display:"flex",gap:'0.5rem',width:"30%"}}>
                                <img
                                    style={{width:"6rem",height:"8rem",padding:"1rem 1rem"}} 
                                    alt="example" 
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog/images/${item.image_url}`}
                                />
                                <div style={{display:'flex',gap:"0.5rem",flexDirection:"column",marginTop:"2rem"}}>
                                    <div style={{
                                        fontSize:'1.2rem',
                                        display: "inline-block",
                                        maxWidth:"12rem",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}>{item.title}</div>
                                    <div style={{fontSize:"1rem"}}>{item.author}</div>
                                </div>
                           </div>
                           <div style={{
                                display:'flex',
                                gap:'0.1rem',
                                color:item.discount_percentage > 0 ? "red" : "black",
                                marginLeft:"5rem",
                                width:"20%"
                            }}>
                                <div style={{
                                    fontSize:20,
                                    fontWeight: 400,
                                    textShadow: '0.01rem 0.01rem 0 currentColor',
                                    marginTop:"3rem"
                                }}>
                                    {((item.price* (1 - item.discount_percentage / 100)) * item.quantity).toLocaleString('vi-VN')}
                                </div>
                                <DollarOutlined style={{fontSize:14,margin:"0 0 0.3rem 0.2rem"}}/>
                           </div>
                           <div style={{display:'flex',gap:"0.2rem",margin:"2.8rem 0 0 4rem"}}>
                                <Button
                                    disabled={item.quantity > 1 ? false :true}
                                    icon={<MinusOutlined />}
                                    style={{color:"#888888"}}
                                    onClick={()=>HandlingIncreasesAndDecreases(false,item.id,item.quantity)}
                                />
                                <InputNumber style={{width:"3rem",height:"2rem"}} value={item.quantity} min={1} max={100} defaultValue={item.quantity} onChange={onChange} />
                                <Button
                                    style={{color:"#888888"}}
                                    icon={<PlusOutlined />}
                                    onClick={()=>HandlingIncreasesAndDecreases(true,item.id,item.quantity)}
                                />
                           </div>
                           <DeleteOutlined onClick={()=>handleRemoveBasketItem(item.id)} style={{fontSize:"1.1rem",margin:"0 0 0 12rem",cursor:"pointer"}}/>
                        </div>
                    ))
                }
              </div>
           </div>
           <div style={{
                    height:"auto",
                    marginTop:"2rem",
                    width:"auto",
                    display:"flex",
                    flexDirection:"column",
                    gap:'0.8rem'
                 }}>
                  <div style={{
                     width:"100%",
                     display:"flex",
                     flexDirection:"column",
                     gap:"1rem",
                     margin:"0 1rem 0 0rem",
                     background:"white",
                     borderRadius:"0.5rem",
                     padding:"1rem"
                  }}>
                        <div style={{
                           fontSize:"1.1rem",
                           marginTop:"1rem"
                        }}>
                           Số lượng
                        </div>
                        <div style={{
                           fontSize:"1.1rem"
                        }}>
                           Tạm tính
                        </div>
                        <div style={{
                              display:"flex",
                              gap:'0.2rem'
                           }}>   
                           <div style={{
                              fontSize:"1.5rem",
                              fontWeight:"500",
                              color:"#B22222"
                           }}>
                              {(discount === 0 ? totalPrice : totalPrice-(discount*totalPrice/100)).toLocaleString('vi-VN')}
                           </div>
                           <DollarOutlined style={{
                              fontSize:14,
                              margin:"0 0 0.3rem 0.2rem",
                              color:"#B22222"
                           }}/>
                           {
                                discount > 0
                                ?
                                <div style={{
                                    display:"flex",
                                    gap:'0.4rem'
                                }}>
                                    <div style={{
                                        display:'flex',
                                        margin:'0rem 0 0.2rem 0.2rem',
                                        background:"#DCDCDC",
                                        borderRadius:"0.5rem",
                                        padding:"0 0.2rem 0 0.2rem",
                                        height:"2rem"
                                    }}>
                                    <MinusOutlined style={{fontSize:"0.6rem"}}/>
                                    <div style={{margin:'0.2rem 0 0 0.2rem',fontSize:"1rem"}}>
                                        {discount}
                                    </div>
                                    <PercentageOutlined />
                                    </div>
                                    <div style={{ 
                                        marginTop:"0.4rem",
                                        color:"#989898" 
                                    }}>
                                        ( cho từ 3 sản phẩm )
                                    </div>
                                </div>
                                :
                                <></>
                            }
                        </div>
                        <Divider style={{ margin:"0.5rem 0 0.5rem 0" }}/>
                        <Button onClick={handleOrder} style={{
                            height:"2.5rem",
                            background:"red"
                        }}>
                            <p style={{
                                color:"white",
                                fontSize:"1.1rem"
                            }}>Mua ngay</p>
                        </Button>
                  </div>
                  {imageList.map((src,index)=> (
                  <div key={index}>
                     <img src={`${src}`} style={{width:'100%', height:"50vh",borderRadius: '0.5rem',}}/>
                  </div>
                 ))}
                </div>
        </div>
    )
}
export default CartApp