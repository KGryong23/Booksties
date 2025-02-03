'use client'

import { UpdateProduct } from "@/utils/action/action"
import Button from "antd/es/button"
import Input from "antd/es/input"
import Modal from "antd/es/modal"
import notification from "antd/es/notification"
import { useState } from "react"

interface Iprop{
  isModalOpenImage : boolean,
  setIsModalOpenImage:(v: any) => void,
  handleCancel:() => void,
  product:IProduct
}

const ModalImage=(props :Iprop)=>{
    const { product , isModalOpenImage , setIsModalOpenImage , handleCancel } = props
    const [myImage,setMyImage] = useState<string>(product.image_url)
    const handleUpdateDescription = async () => {
      if(myImage){
         product.image_url = myImage
         const result = await UpdateProduct(product)
         if(result.code === 201){
           notification.success({
             message:"Update!!!",
             description:"Cập nhật thành công!!!",
             duration:1
          })
         }else{
           notification.error({
             message:"Update!!!",
             description:"Cập nhật không thành công!!!",
             duration:1
          })
         }
      }else{
        return
      }
      setIsModalOpenImage(false)
    }
    return(
      <Modal footer={null} width={"23rem"} title="Cập nhật địa chỉ" open={isModalOpenImage} onCancel={handleCancel}>
         <Input style={{width:"20rem",marginTop:"1rem"}} value={myImage} defaultValue={myImage} onChange={(e)=>setMyImage(e.target.value)}/>
         <Button type="primary" style={{ margin:'1rem 0 0 6.5rem'}} onClick={handleUpdateDescription}>Cập nhật</Button>
      </Modal>
    )
}
export default ModalImage