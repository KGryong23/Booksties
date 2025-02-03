'use client'

import Modal from "antd/es/modal"
import { useEffect, useState } from "react"
import Table from "antd/es/table"
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { GetTransactionsForUser } from "@/utils/action/action";

interface Iprop{
  isModalOpenTransaction : boolean,
  handleCancel:() => void,
}

const ModalTransactionsForUser=(props :Iprop)=>{
  dayjs.extend(relativeTime);
  dayjs.locale('vi');
  const { isModalOpenTransaction , handleCancel } = props
  const [bids,setBids] = useState<ITransaction[]>([])
  const handleGetTransactions = async () => {
      const result = await GetTransactionsForUser()
      if(result.code === 201){
        setBids(result.data)
      }
  }
  useEffect(()=>{
     handleGetTransactions()
  },[])
  const columns = [
    {
        title: 'Số tiền',
        dataIndex: 'amount',
        render: (text: number) => <a style={{fontSize:"1rem",color:"black"}}>{text.toLocaleString('vi-VN')}</a>,
        key: 'amount',
    },
    {
        title: 'Mô tả',
        dataIndex: 'description',
        render: (text: string) => <a style={{fontSize:"1rem",color:"blue"}}>
           {text}
        </a>,
        key: 'description',
    },
    {
        title: 'Thời gian tạo',
        dataIndex: 'createdAt',
        render: (text: string) => <a style={{fontSize:"1rem",color:"red"}}>
            {dayjs(text).format('dddd, D MMMM, YYYY h:mm A')}
        </a>,
        editable: false,
    }
  ];
  return(
    <Modal footer={null} width={"50rem"} title="Lịch sử ví" open={isModalOpenTransaction} onCancel={handleCancel}>
        <Table dataSource={bids} columns={columns} pagination={false}/>
    </Modal>
  )
}
export default ModalTransactionsForUser