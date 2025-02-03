'use client'

import Modal from "antd/es/modal"
import { useEffect, useState } from "react"
import Table from "antd/es/table"
import Tag from "antd/es/tag"
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { GetBidsForUser } from "@/utils/action/action";

interface Iprop{
  isModalOpenBid : boolean,
  handleCancel:() => void,
}

const ModalBidsForUser=(props :Iprop)=>{
  dayjs.extend(relativeTime);
  dayjs.locale('vi');
  const { isModalOpenBid , handleCancel } = props
  const [bids,setBids] = useState<IBid[]>([])
  const handleGetBids = async () => {
      const result = await GetBidsForUser()
      if(result.code === 201){
        setBids(result.data)
      }
  }
  useEffect(()=>{
     handleGetBids()
  },[])
  const columns = [
    {
      title: 'Tên',
      dataIndex: 'bidder',
      render: (text: string) => <a style={{fontSize:"1rem",color:"blue"}}>
         {text}
      </a>,
      key: 'bidder',
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      render: (text: number) => <a style={{fontSize:"1rem",color:"black"}}>{text.toLocaleString('vi-VN')}</a>,
      key: 'amount',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (text: string) => {
        let string = ''
        let color = ''
        if(text === 'AcceptedBelowReserve'){
          string = "Chấp nhận dưới"
          color = "orange"
        }else if (text === 'Accepted'){
          string = "Chấp nhận"
          color = "green"
        } else if (text === 'Finished'){
          string = "Quá hạn"
          color = "blue"
        } else if (text === "TooLow"){
          string = "Quá thấp"
          color = "red"
        }
        return(
          <Tag color={color}>
             {string}
          </Tag>  
        )
      },
      key: 'status',
    },
    {
        title: 'Dự kiến kết thúc',
        dataIndex: 'auctionEnd',
        render: (text: string) => <a style={{fontSize:"1rem",color:"red"}}>
            {dayjs(text).format('dddd, D MMMM, YYYY h:mm A')}
        </a>,
        editable: false,
    }
  ];
  return(
    <Modal footer={null} width={"50rem"} title="Lịch sử đặt giá" open={isModalOpenBid} onCancel={handleCancel}>
        <Table dataSource={bids} columns={columns} pagination={false}/>
    </Modal>
  )
}
export default ModalBidsForUser