'use client'

import { UdpateOrderAddress } from "@/utils/action/action"
import Button from "antd/es/button"
import Input from "antd/es/input/Input"
import Modal from "antd/es/modal"
import notification from "antd/es/notification"

interface Iprop{
    isModalOpenAddressOrder : boolean,
    setIsModalOpenAddressOrder:(v: any) => void,
    orderId:string,
    address :string | undefined,
    handleCancel:() => void,
    setAddress:(v: any) => void,
    setOrderId:(v: any) => void,
}

const ModalUpdateUserAddress=(props :Iprop)=>{
    const { setAddress,setOrderId,isModalOpenAddressOrder,orderId,address,handleCancel,setIsModalOpenAddressOrder, } = props
    const handleUpdateAddress = async () => {
        const result = await UdpateOrderAddress(orderId,address ?? "empty")
        if(result.data){
            notification.success({
                message: "Thành công",
                description: "Cập nhật địa chỉ thành công",
            })
        }
       setAddress("")
       setOrderId("")
       setIsModalOpenAddressOrder(false)
    }
    return(
      <Modal footer={null} width={"23rem"} title="Cập nhật địa chỉ" open={isModalOpenAddressOrder} onCancel={handleCancel}>
         <Input style={{width:"20rem",marginTop:"1rem"}} value={address} defaultValue={address} onChange={(e)=>setAddress(e.target.value)}/>
         <Button type="primary" style={{ margin:'1rem 0 0 6.5rem'}} onClick={handleUpdateAddress}>Cập nhật</Button>
      </Modal>
    )
}
export default ModalUpdateUserAddress

