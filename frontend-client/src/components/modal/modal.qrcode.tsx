'use client'

import Modal from "antd/es/modal/Modal"
import QRCode from "antd/es/qr-code"

interface Iprop{
    isModalOpen : boolean,
    handleCancel:() => void,
}

const ModalQrCode=(props :Iprop)=>{
    const { isModalOpen , handleCancel } = props
    return(
        <Modal footer={null} width={"18rem"} title="Quét mã nạp tiền" open={isModalOpen} onCancel={handleCancel}>
            <QRCode type="svg" value="https://ant.design/" />
        </Modal>
    )
}
export default ModalQrCode