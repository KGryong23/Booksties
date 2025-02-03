'use client'

import { UdpateUserAddress } from "@/utils/action/action"
import Button from "antd/es/button"
import Input from "antd/es/input/Input"
import Modal from "antd/es/modal"
import notification from "antd/es/notification"
import { useState } from "react"

interface Iprop{
    isModalOpenAddressUser : boolean,
    setIsModalOpenAddressUser:(v: any) => void,
    address :string | undefined,
    handleCancel:() => void,
    handleGetAddress:() => void,
}

const ModalUpdateOrderAddress=(props :Iprop)=>{
    const { isModalOpenAddressUser,address,handleCancel,setIsModalOpenAddressUser,handleGetAddress } = props
    const [value, setValue] = useState(address);
    const handleUpdateAddress = async () => {
        const result = await UdpateUserAddress(value ?? "empty")
        if(result.data){
            notification.success({
                message: "Thành công",
                description: "Cập nhật địa chỉ thành công",
            })
            await handleGetAddress()
        }
       setIsModalOpenAddressUser(false)
    }
    return(
      <Modal footer={null} width={"23rem"} title="Cập nhật địa chỉ" open={isModalOpenAddressUser} onCancel={handleCancel}>
         <Input style={{width:"20rem",marginTop:"1rem"}} value={value} defaultValue={address} onChange={(e)=>setValue(e.target.value)}/>
         <Button type="primary" style={{ margin:'1rem 0 0 6.5rem'}} onClick={handleUpdateAddress}>Cập nhật</Button>
      </Modal>
    )
}
export default ModalUpdateOrderAddress