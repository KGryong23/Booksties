'use client'

import { GetTransaction } from "@/utils/action/action"
import Modal from "antd/es/modal"
import Table from "antd/es/table"
import { useEffect, useState } from "react"
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import Tag from "antd/es/tag"

interface Iprop{
     isModalOpenTransaction : boolean,
     setIsModalOpenTransaction:(v: any) => void,
     handleCancel:() => void,
     inventoryId:string
  }
const ModalTransaction=(props :Iprop)=>{
    const { isModalOpenTransaction , handleCancel,inventoryId } = props
    const [transaction,setTransaction] = useState<ITransaction[]>([])
    dayjs.extend(relativeTime);
    dayjs.locale('vi');
    const handleGetransaction = async () => {
       const res = await GetTransaction(inventoryId)
       if(res.code === 201){
         setTransaction(res.data)
       }
    }
    
    const columns = [
        {
          title: 'Thời gian',
          dataIndex: 'created_at',
          render: (text: string) => <a style={{fontSize:"1rem",color:"blue"}}>
            {dayjs(text).format('dddd, D MMMM, YYYY h:mm A')}
          </a>,
          key: 'created_at',
        },
        {
          title: 'Số lượng',
          dataIndex: 'quantity',
          key: 'quantity',
        },
        {
          title: 'Hành động',
          dataIndex: 'transaction_type',
          render: (text: string) => {
            let string = ''
            let color = ''
            if(text === "IN"){
              string = "Nhập kho"
              color = "green"
            }else{
              string = "Xuất kho"
              color = "red"
            }
            return(
              <Tag color={color}>
                 {string}
              </Tag>  
            )
          },
          key: 'transaction_type',
        },
        {
          title: 'Lý do',
          dataIndex: 'reason',
          key: 'reason',
        },
    ];
    useEffect(()=>{
       handleGetransaction()
    },[])
    return(
      <Modal footer={null} width={'60rem'} title="Lịch sử xuất nhập kho" open={isModalOpenTransaction} onCancel={handleCancel}>
          <Table dataSource={transaction} columns={columns} pagination={false}/>
      </Modal>
    )
}
export default ModalTransaction