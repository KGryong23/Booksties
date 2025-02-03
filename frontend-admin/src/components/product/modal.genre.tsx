'use client'

import { UpdateProductGenre } from "@/utils/action/action"
import Button from "antd/es/button"
import Modal from "antd/es/modal"
import notification from "antd/es/notification"
import { useState } from "react"
import Select, { LabeledValue } from "antd/es/select";

interface Iprop{
  isModalOpenGenre : boolean,
  setIsModalOpenGenre:(v: any) => void,
  handleCancel:() => void,
  productId:string,
  genre:IGenre,
  listGenre: LabeledValue[],
  handleGetGenre:()=>void
}

const ModalGenre=(props :Iprop)=>{
  const { handleGetGenre,listGenre ,genre , productId , isModalOpenGenre , setIsModalOpenGenre, handleCancel } = props
  const [myGenre,setMyGenre] = useState<string>(genre.id)
  const handleChange=(value: string)=>{
      setMyGenre(value)
  }
  const handleUpdateGenre = async () => {
    if(myGenre){
       const result = await UpdateProductGenre(productId,myGenre)
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
    handleGetGenre()
    setIsModalOpenGenre(false)
  }
  return(
    <Modal footer={null} width={"23rem"} title="Cập nhật thể loại" open={isModalOpenGenre} onCancel={handleCancel}>
          <Select
            value={myGenre}
            style={{ width: "20rem" }}
            onChange={handleChange}
            options={listGenre}
          />
       <Button type="primary" style={{ margin:'1rem 0 0 6.5rem'}} onClick={handleUpdateGenre}>Cập nhật</Button>
    </Modal>
  )
}
export default ModalGenre