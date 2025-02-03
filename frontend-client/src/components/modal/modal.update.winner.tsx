'use client'

import { UpdateTransactionAddressByWinner } from "@/utils/action/action"
import Button from "antd/es/button"
import Input from "antd/es/input/Input"
import Modal from "antd/es/modal"
import notification from "antd/es/notification"

interface Iprop{
    isModalOpenAddressWinner : boolean,
    setIsModalOpenAddressWinner:(v: any) => void,
    auctionId:string,
    address :string | undefined,
    handleCancel:() => void,
    setAddress:(v: any) => void,
    setAuctionId:(v: any) => void,
}

const ModalUpdateWinnerAddress=(props :Iprop)=>{
    const { setAddress,setAuctionId,isModalOpenAddressWinner,auctionId,address,handleCancel,setIsModalOpenAddressWinner } = props
    const handleUpdateAddress = async () => {
        const result = await UpdateTransactionAddressByWinner(auctionId,address ?? "empty")
        if(result.code === 201){
            notification.success({
                message: "Thành công",
                description: "Cập nhật địa chỉ thành công",
            })
        }
       setAddress("")
       setAuctionId("")
       setIsModalOpenAddressWinner(false)
    }
    return(
      <Modal footer={null} width={"23rem"} title="Cập nhật địa chỉ" open={isModalOpenAddressWinner} onCancel={handleCancel}>
         <Input style={{width:"20rem",marginTop:"1rem"}} value={address} defaultValue={address} onChange={(e)=>setAddress(e.target.value)}/>
         <Button type="primary" style={{ margin:'1rem 0 0 6.5rem'}} onClick={handleUpdateAddress}>Cập nhật</Button>
      </Modal>
    )
}
export default ModalUpdateWinnerAddress

