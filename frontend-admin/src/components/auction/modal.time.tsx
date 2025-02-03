'use client'

import Alert from "antd/es/alert"
import Button from "antd/es/button"
import Calendar from "antd/es/calendar"
import Modal from "antd/es/modal"
import notification from "antd/es/notification"
import { useState } from "react"
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { UpdateTimeAuction } from "@/utils/action/action"

dayjs.extend(utc); 

interface Iprop {
  isModalOpenTime: boolean,
  setIsModalOpenTime: (v: any) => void,
  handleCancel: () => void,
  auctionId: string,
}

const ModalTime = (props: Iprop) => {
  const { auctionId, isModalOpenTime, setIsModalOpenTime, handleCancel } = props;
  const [value, setValue] = useState(() => dayjs('2025-01-25T00:00:00Z')); 
  const [selectedValue, setSelectedValue] = useState(() => dayjs('2025-01-25T00:00:00Z')); 

  const onSelect = (newValue: Dayjs) => {
    const updatedValue = newValue.set('hour', dayjs().hour())
      .set('minute', dayjs().minute())
      .set('second', dayjs().second())
      .utc(); 

    setValue(updatedValue);
    setSelectedValue(updatedValue);
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
  };

  const handleUpdateTime = async () => {
    const isoString = selectedValue.toISOString(); 
    try {
      const result = await UpdateTimeAuction(auctionId,isoString)
      if(result.code === 201){
        notification.success({
            message: "Thành công",
            description: `Thời gian đã được cập nhật: ${dayjs(isoString).format('dddd, D MMMM, YYYY h:mm A')}`,
        });
      }else{
        notification.error({
            message: "Thất bại",
            description: `Thời gian không được cập nhật`,
        });
      }
    } catch (error) {
      notification.error({
        message:"Cảnh báo!!!",
        description:"Bạn không có quyền !!!",
        duration:2
      })
    } 
    setIsModalOpenTime(false);
  };

  return (
    <Modal
      footer={null}
      width={"50rem"}
      title="Cập nhật thời gian"
      open={isModalOpenTime}
      onCancel={handleCancel}
    >
      <Alert message={`Bạn chọn: ${dayjs(selectedValue).format('dddd, D MMMM, YYYY h:mm A')}`} />
      <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} />
      <Button
        type="primary"
        style={{ 
            margin: '1rem 0 0 14rem',
            width:"20rem",
            height:"2rem"
        }}
        onClick={handleUpdateTime}
        
      >
        Cập nhật
      </Button>
    </Modal>
  );
};

export default ModalTime;
