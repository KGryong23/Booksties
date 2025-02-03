'use client'

import { GetOrderItemsById,GetUserNameById } from "@/utils/action/action"
import Modal from "antd/es/modal"
import Table from "antd/es/table"
import { useEffect, useState } from "react"

interface Iprop{
     isModalOpenItems : boolean,
     handleCancel:() => void,
     orderId:string | undefined,
     userId:string | undefined
  }
const ModalItems=(props :Iprop)=>{
    const { isModalOpenItems , userId,handleCancel,orderId } = props
    const [orderItems,setOrderItems] = useState<IOrderItem[]>([])
    const [userName,setUserName] = useState<IUserName>()
    const handleGetItems = async () => {
      if(orderId){
        const res = await GetOrderItemsById(orderId)
        if(res.code === 201){
          setOrderItems(res.data)
        }
      }
      if(userId){
        const result = await GetUserNameById(userId)
        setUserName(result.data)
      }     
    }
    const columns = [
        {
          title: 'Tên',
          dataIndex: 'title',
          render: (text: string) => <a style={{fontSize:"1rem",color:"blue"}}>
             {text}
          </a>,
          key: 'created_at',
        },
        {
          title: 'Số lượng',
          dataIndex: 'quantity',
          key: 'quantity',
        },
        {
          title: 'Giá',
          dataIndex: 'price',
          render: (text: number) => <a style={{fontSize:"1rem",color:"black"}}>{text.toLocaleString('vi-VN')}</a>,
          key: 'price',
        },
        {
          title: 'Tổng tiền',
          dataIndex: 'sum',
          render: (_: number, record: IOrderItem) => {
            return(
               <a style={{fontSize:"1rem",color:"red"}}>{(record?.quantity * record?.price).toLocaleString('vi-VN')}</a>
            )
          },
        },
    ];
    useEffect(()=>{
       handleGetItems()
    },[])
    return(
      <Modal footer={null} width={'60rem'} title={`Chi tiết đơn hàng: ${userName?.email}`} open={isModalOpenItems} onCancel={handleCancel}>
          <Table dataSource={orderItems} columns={columns} pagination={false}/>
      </Modal>
    )
}
export default ModalItems