'use client'

import { Divider } from "antd"
import Drawer from "antd/es/drawer"
import EditOutlined from '@ant-design/icons/EditOutlined'
import ModalDescription from "./modal.description"
import { useEffect, useState } from "react"
import ModalImage from "./modal.image"
import { GetGenre, GetInventory } from "@/utils/action/action"
import { LabeledValue } from "antd/es/select";
import ModalGenre from "./modal.genre"
import ModalInventory from "./modal.inventory"
import EyeOutlined from '@ant-design/icons/EyeOutlined'
import ModalTransaction from "./modal.transaction"

interface IProps{
    onClose:()=> void,
    open:boolean,
    productDrawer: IProduct | null,
    listGenre:LabeledValue[]
}
const DrawerProduct=(props :IProps)=>{
    const { onClose , open ,productDrawer,listGenre} = props
    const [isModalOpenDescription,setIsModalOpenDescription] = useState<boolean>(false)
    const [isModalOpenImage,setIsModalOpenImage] = useState<boolean>(false)
    const [isModalOpenGenre,setIsModalOpenGenre] = useState<boolean>(false)
    const [isModalOpenInventory,setIsModalOpenInventory] = useState<boolean>(false)
    const [isModalOpenTransaction,setIsModalOpenTransaction] = useState<boolean>(false)
    const [inventory,setInventory] = useState<IInventory>()
    const [genre,setGenre] = useState<IGenre>()
    const showModalDescription=()=>{
        setIsModalOpenDescription(true)
    }
    const handleCancelModalDescription=()=>{
        setIsModalOpenDescription(false)
    }
    const showModalImage=()=>{
        setIsModalOpenImage(true)
    }
    const handleCancelModalImage=()=>{
        setIsModalOpenImage(false)
    }
    const showModalGenre=()=>{
        setIsModalOpenGenre(true)
    }
    const handleCancelModalGenre=()=>{
        setIsModalOpenGenre(false)
    }
    const showModalInventory=()=>{
        setIsModalOpenInventory(true)
    }
    const handleCancelModalInventory=()=>{
        setIsModalOpenInventory(false)
    }
    const showModalTransaction=()=>{
        setIsModalOpenTransaction(true)
    }
    const handleCancelModalTransaction=()=>{
        setIsModalOpenTransaction(false)
    }
    const handleGetGenre = async () => {
        const res = await GetGenre(productDrawer?.id!)
        if(res.code === 201){
            setGenre(res.data)
        }
    }
    const handleGetInventory = async () => {
        const res = await GetInventory(productDrawer?.id!)
        if(res.code === 201){
            setInventory(res.data)
        }
    }
    useEffect(()=>{
        handleGetGenre()
        handleGetInventory()
    },[])
    return(
      <Drawer width={640} placement="right" closable={false} onClose={onClose} open={open}>
         <div>
            <div style={{
                display:"flex",
                gap:"1rem"
            }}>
              <div style={{ 
                fontSize:"1.5rem" 
              }}>
                 Chi tiết về sản phẩm:
              </div>
              <div style={{ 
                fontSize:"1.1rem",
                marginTop:"0.4rem",
                color:"blue"
              }}>
                {productDrawer?.title}
              </div>
            </div>
            <div style={{
                display:'flex',
                gap:'12rem'
            }}>
                <div style={{ 
                    display:"flex",
                    marginTop:"1.5rem",
                    gap:"0.5rem",fontSize:"1.1rem" 
                }}>
                    <div>
                        Số lượng đã bán:
                    </div>
                    <div style={{color:"#A9A9A9"}}>
                        {productDrawer?.sold_quantity}
                    </div>
                </div>
                <div style={{ 
                    display:"flex",
                    marginTop:"1.5rem",
                    gap:"0.5rem",fontSize:"1.1rem" 
                }}>
                    <div>
                        Số lượng đánh giá:
                    </div>
                    <div style={{color:"#A9A9A9"}}>
                        {productDrawer?.quantity_evaluate}
                    </div>
                </div>
            </div>
            <div style={{ display:'flex',gap:'10.3rem' }}>
                <div style={{
                    display:"flex",
                    gap:'0.5rem',
                    fontSize:"1.1rem",
                    marginTop:"2rem"
                }}>
                    <div>Đánh giá trung bình:</div>
                    <div style={{
                        color:"#A9A9A9"
                    }}>
                        {productDrawer?.average_rating}
                    </div>
                </div>
                <div style={{
                    display:'flex',
                    gap:"0.7rem",
                    fontSize:"1.1rem",
                    marginTop:"2rem"
                }}>
                    <div>Tồn kho:</div>
                    <div>{inventory?.quantity ? inventory.quantity : "Chưa có"}</div>
                    <EditOutlined onClick={showModalInventory} style={{ cursor:"pointer" }}/>
                    <EyeOutlined onClick={showModalTransaction}/>
                </div>
            </div>
            <div style={{
                fontSize:"1.1rem",
                marginTop:"2rem",
                display:'flex',
                gap:"0.5rem"
            }}>
               <div>
                  Danh mục sản phẩm:
               </div>
               <div>
                  {genre?.name}
               </div>
               <EditOutlined onClick={showModalGenre}/>
            </div>
            <div style={{
                display:'flex',
                gap:"0.5rem",
                fontSize:"1.1rem",
                marginTop:"2rem"
            }}>
                <div>Mô tả về sản phẩm:</div>
                <div style={{
                    display: "inline-block",
                    maxWidth:"25rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}>{productDrawer?.description ? productDrawer?.description : `chưa cóhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh`}</div>
                <EditOutlined onClick={showModalDescription} style={{ cursor:"pointer" }}/>
            </div>
            <div style={{
                display:"flex",
                gap:'1rem',
                marginTop:"2rem"
            }}>
                <div style={{
                    fontSize:"1.1rem"
                }}>
                   Hình ảnh:
                </div>
                {productDrawer && (
                    <img 
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog/images/${productDrawer.image_url}`}
                        alt="example"
                        style={{
                        width: "8rem",
                        height: "8rem",
                        borderRadius: "0.5rem"
                        }}
                    />
                    )}
                <EditOutlined onClick={showModalImage} style={{ cursor:"pointer",fontSize:"1.1rem" }}/>
            </div>
            <Divider/>
         </div>
         {isModalOpenDescription && (
         <ModalDescription
            product={productDrawer!}
            handleCancel={handleCancelModalDescription}
            isModalOpenDescription={isModalOpenDescription}
            setIsModalOpenDescription={setIsModalOpenDescription}
         />
        )}
        {isModalOpenImage && (
          <ModalImage
            handleCancel={handleCancelModalImage}
            isModalOpenImage={isModalOpenImage}
            product={productDrawer!}
            setIsModalOpenImage={setIsModalOpenImage}
          />
        )}
        {isModalOpenGenre && (
            <ModalGenre
                isModalOpenGenre={isModalOpenGenre}
                setIsModalOpenGenre={setIsModalOpenGenre}
                listGenre={listGenre}
                genre={genre!}
                handleCancel={handleCancelModalGenre}
                productId={productDrawer?.id!}
                handleGetGenre={handleGetGenre}
            />
        )}
        {isModalOpenInventory && (
            <ModalInventory
                 handleCancel={handleCancelModalInventory}
                 isModalOpenInventory={isModalOpenInventory}
                 productId={productDrawer?.id!}
                 setIsModalOpenInventory={setIsModalOpenInventory}
                 handleGetInventory={handleGetInventory}
            />
        )}
        {isModalOpenTransaction && (
            <ModalTransaction
                 handleCancel={handleCancelModalTransaction}
                 inventoryId={inventory?.inventory_id!}
                 isModalOpenTransaction={isModalOpenTransaction}
                 setIsModalOpenTransaction={setIsModalOpenTransaction}
            />
        )}
      </Drawer>
    )
}
export default DrawerProduct