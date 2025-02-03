'use client'

import { UpdateProduct } from "@/utils/action/action"
import Button from "antd/es/button"
import Input from "antd/es/input"
import Modal from "antd/es/modal"
import notification from "antd/es/notification"
import { useState } from "react"

interface Iprop{
  isModalOpenDescription : boolean,
  setIsModalOpenDescription:(v: any) => void,
  handleCancel:() => void,
  product:IProduct
}

const ModalDescription=(props :Iprop)=>{
    const { product , isModalOpenDescription , setIsModalOpenDescription , handleCancel } = props
    const [myDescription,setMyDescription] = useState<string>(product.description)
    const handleUpdateDescription = async () => {
      if(myDescription){
         product.description = myDescription
         const result = await UpdateProduct(product)
         if(result.code === 201){
           notification.success({
             message:"Update!!!",
             description:"Cập nhật thành công!!!",
             duration:2
          })
         }else{
           notification.error({
             message:"Update!!!",
             description:"Cập nhật không thành công!!!",
             duration:2
          })
         }
      }else{
        return
      }
      setIsModalOpenDescription(false)
    }
    return(
      <Modal footer={null} width={"23rem"} title="Cập nhật địa chỉ" open={isModalOpenDescription} onCancel={handleCancel}>
         <Input style={{width:"20rem",marginTop:"1rem"}} value={myDescription} defaultValue={myDescription} onChange={(e)=>setMyDescription(e.target.value)}/>
         <Button type="primary" style={{ margin:'1rem 0 0 6.5rem'}} onClick={handleUpdateDescription}>Cập nhật</Button>
      </Modal>
    )
}
export default ModalDescription