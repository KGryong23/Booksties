'use client'

import { UpdateInventory } from "@/utils/action/action"
import Button from "antd/es/button"
import Modal from "antd/es/modal"
import notification from "antd/es/notification"
import { useState } from "react"
import Select from "antd/es/select";
import InputNumber, { InputNumberProps } from "antd/es/input-number"
import TextArea from "antd/es/input/TextArea"

interface Iprop{
  isModalOpenInventory : boolean,
  setIsModalOpenInventory:(v: any) => void,
  handleCancel:() => void,
  productId:string,
  handleGetInventory:()=>void
}

const ModalInventory=(props :Iprop)=>{
  const { handleGetInventory,productId ,isModalOpenInventory , setIsModalOpenInventory , handleCancel } = props
  const [type,setType] = useState<string>("IN")
  const [reason,setReason] = useState<string>("")
  const [quantity,setQuantity] = useState<number>(0)
  const handleChange=(value: string)=>{
      setType(value)
  }
  const handleUpdateInventory = async () => {
    if(reason && quantity > 0){
       const result = await UpdateInventory(productId,type,quantity,reason)
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
    handleGetInventory()
    setIsModalOpenInventory(false)
  }
  const onChange: InputNumberProps['onChange'] = (value) => {
      setQuantity(value as number)
  };
  return(
    <Modal footer={null} width={"23rem"} title="Cập nhật thể loại" open={isModalOpenInventory} onCancel={handleCancel}>
          <InputNumber value={quantity} onChange={onChange} style={{width:"13rem",marginTop:"1rem"}}/>
          <Select
                value={type}
                style={{ width: "6.5rem" }}
                onChange={handleChange}
                options={[
                    { value: 'OUT', label: 'Xuất kho' },
                    { value: 'IN', label: 'Nhập kho' },
                ]}
          />
          <TextArea style={{width:"20rem",marginTop:"1rem"}} value={reason} defaultValue={reason} onChange={(e)=>setReason(e.target.value)}/>
       <Button type="primary" style={{ margin:'1rem 0 0 6.5rem'}} onClick={handleUpdateInventory}>Cập nhật</Button>
    </Modal>
  )
}
export default ModalInventory