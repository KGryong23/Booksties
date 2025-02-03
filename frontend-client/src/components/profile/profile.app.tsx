'use client'

import Avatar from "antd/es/avatar/avatar"
import { useSession } from "next-auth/react"
import MehOutlined  from '@ant-design/icons/MehOutlined'
import Tabs from "antd/es/tabs"
import Divider from "antd/es/divider"
import { useEffect, useMemo, useState } from "react"
import { GetAddress, GetBalance } from "@/utils/action/action"
import Link from "next/link"
import EditOutlined  from '@ant-design/icons/EditOutlined'
import FileSearchOutlined  from '@ant-design/icons/FileSearchOutlined'
import CalendarOutlined  from '@ant-design/icons/CalendarOutlined'
import PoundOutlined  from '@ant-design/icons/PoundOutlined'

import ModalUpdateUserAddress from "../modal/modal.update.user.address"
import ModalBidsForUser from "../modal/modal.bids.user"
import ModalTransactionsForUser from "../modal/modal.transaction.user"
import ModalQrCode from "../modal/modal.qrcode"
import { useRouter } from "next/navigation"

const ProfileApp=({children}: {children: React.ReactNode})=>{
    const { data:session } = useSession()
    const [balance,setBalance] = useState<number>(0)
    const [address,setAddress] = useState<string>()
    const router = useRouter()
    const [isModalOpenAddressUser, setIsModalOpenAddressUser] = useState(false);
    const [isModalOpenBidsUser, setIsModalOpenBidsUser] = useState(false);
    const [isModalOpenTransactionsUser, setIsModalOpenTransactionsUser] = useState(false);
    const [isModalOpenQr, setIsModalOpenQr] = useState(false);
    const showModalUserAddress = () => {
        setIsModalOpenAddressUser(true);
    };
    const handleCancelUserAddress = () => {
        setIsModalOpenAddressUser(false);
    };
    const showModalBidsUser = () => {
        setIsModalOpenBidsUser(true);
    };
    const handleCancelBidsUser = () => {
        setIsModalOpenBidsUser(false);
    };
    const showModalTransactionsUser = () => {
        setIsModalOpenTransactionsUser(true);
    };
    const handleCancelTransactionsUser = () => {
        setIsModalOpenTransactionsUser(false);
    };
    const showModaQR = () => {
        setIsModalOpenQr(true);
    };
    const handleCancelQR = () => {
        setIsModalOpenQr(false);
    };
    const items = useMemo(() => [
        { 
            key: '1', 
            label: <Link href={"/account/profile"} style={{
                color:"black"
            }}>
                      <div style={{ fontSize:"1.2rem",color:"#484848" }}>Đơn hàng</div>
                   </Link>, 
        },
        { 
            key: '2', 
            label: <Link href={"/account/profile/myauction"} style={{ color:"black" }}>
                     <div style={{ fontSize:"1.2rem",color:"#484848" }}>Đấu giá của bạn</div>
                   </Link>, 
        },
        { 
            key: '3', 
            label: <Link href={"/account/profile/winbid"} style={{ color:"black" }}>
                     <div style={{ fontSize:"1.2rem",color:"#484848" }}>Chiến thắng đấu giá</div>
                   </Link>, 
        },
    ], []);
    const handleGetBalance = async () => {
        const res = await GetBalance()
        setBalance(res.data)
    }
    const handleGetAddress = async ()=>{
        const result = await GetAddress()
        if(result.code === 201)
          setAddress(result.data.address)
    }
    useEffect(()=>{
        handleGetAddress()
        handleGetBalance()
    },[session])
    return(
        <div style={{
            display:"flex",
            background:"white",
            borderRadius:"0.5rem",
            margin:"0rem 2rem 0 2rem",
            height:"90vh"
        }}>
            <div>
                <div style={{ 
                    display:'flex',
                    margin:"1.5rem 0 0 1.5rem",
                    gap:"6rem"
                 }}>
                  <Avatar style={{ 
                    backgroundColor: "#f56a00", 
                    verticalAlign: 'middle',
                    marginTop:"0.2rem",
                  }} 
                  size="large"
                  >
                     {session?.user ?  session?.user.email.charAt(0).toUpperCase() : "Chưa có"}
                  </Avatar>
                </div>
                <div style={{ 
                    display:"flex",
                    margin:"0.8rem 0 0 1.5rem",
                    gap:'0.4rem',
                    fontSize:"1rem",
                    color:"#989898" 
                }}>
                    <div>Độ uy tín:</div>
                    <div>{session?.user.reputation}</div>
                    <MehOutlined style={{
                        marginTop:'0.1rem',
                        color:"yellowgreen"
                    }}/>
                    <div style={{ borderLeft:"0.05rem solid #C8C8C8",marginLeft:"0.2rem" }}></div>
                    <FileSearchOutlined 
                       onClick={showModalBidsUser}
                       style={{ 
                        marginLeft:"0.5rem",
                        cursor:"pointer",
                        fontSize:"1.1rem",
                        color:"#4169E1" 
                       }}
                    />
                    <CalendarOutlined
                       onClick={showModalTransactionsUser} 
                       style={{ 
                        marginLeft:"0.5rem",
                        cursor:"pointer",
                        fontSize:"1.1rem",
                        color:"#A52A2A" 
                       }}
                    />
                    <PoundOutlined
                       onClick={showModaQR} 
                       style={{ 
                        marginLeft:"0.5rem",
                        cursor:"pointer",
                        fontSize:"1.1rem" ,
                        color:"#2F4F4F"
                       }}
                    />
                </div>
                <Divider style={{
                    marginLeft:"1rem",
                }}/>
                <div style={{
                    display:'flex',
                    flexDirection:'column',
                    gap:'0.3rem',
                    margin:"0rem 0 0 1rem",
                }}
            
                >
                    <div style={{ 
                        margin:"0.4rem 0 0 0.8rem",
                        fontSize:"1rem",
                     }}>
                        Tên đăng nhập:
                    </div>
                    <div style={{ 
                        margin:"0 0 0 0.8rem",
                        fontSize:"1.3rem",
                        display: "inline-block",
                        maxWidth:"14rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color:"#989898"
                     }}>
                        {session?.user.email}
                    </div>
                </div>
                <div style={{
                    display:'flex',
                    flexDirection:'column',
                    gap:'0.3rem',
                    margin:"1rem 0 0 1rem",
                }}
                >
                    <div style={{ 
                        margin:"0.4rem 0 0 0.8rem",
                        fontSize:"1rem"
                     }}>
                        Số dư trong ví:
                    </div>
                    <div style={{ 
                        margin:"0 0 0 0.8rem",
                        fontSize:"1.3rem",
                        color:"#808000"
                     }}>
                        {balance?.toLocaleString('vi-VN')} VNĐ
                    </div>
                </div>
                <div style={{
                    display:'flex',
                    flexDirection:'column',
                    gap:'0.3rem',
                    margin:"1rem 0 0 1rem",
                }}
                >
                    <div style={{ display:"flex",gap:"3rem" }}>
                        <div style={{ 
                            margin:"0.4rem 0 0 0.8rem",
                            fontSize:"1rem",
                        }}
                        >
                            Địa chỉ:
                        </div>
                        <EditOutlined onClick={showModalUserAddress} style={{ cursor:"pointer",marginTop:"0.5rem" }}/>
                    </div>
                    <div style={{ 
                        margin:"0 0 0 0.8rem",
                        fontSize:"1.3rem",
                        color:"#A0522D"
                     }}>
                        {address ?? "Chưa có"}
                    </div>
                </div>
                <Divider style={{
                    marginLeft:"1rem",
                }}/>
            </div>
            <div style={{
                borderLeft:"0.01rem solid #D0D0D0",
                margin:"1.5rem 0 1.5rem 3rem",
            }}/>
            <div style={{
                margin:"1.3rem 0 0 2.3rem",
            }}>
               <div style={{
                 fontSize:"1.8rem",
                 color:"#686868"
               }}>
                  Thông tin về đơn hàng và đấu giá
               </div>
               <Tabs style={{
                    marginTop:"1rem"   
               }} 
                 defaultActiveKey="1"
                 items={items}
               />
               <div style={{
                 width:"60rem"
               }}>
                  {children}
               </div>
            </div>
            <ModalUpdateUserAddress
              isModalOpenAddressUser={isModalOpenAddressUser}
              address={address}
              handleCancel={handleCancelUserAddress}
              setIsModalOpenAddressUser={setIsModalOpenAddressUser}
              handleGetAddress={handleGetAddress}
            />
            {
                isModalOpenBidsUser && (
                    <ModalBidsForUser
                       handleCancel={handleCancelBidsUser}
                       isModalOpenBid={isModalOpenBidsUser}
                    />
                )
            }
            {
                isModalOpenTransactionsUser && (
                    <ModalTransactionsForUser
                       handleCancel={handleCancelTransactionsUser}
                       isModalOpenTransaction={isModalOpenTransactionsUser}
                    />
                )
            }
            {
                isModalOpenQr && (
                    <ModalQrCode
                       handleCancel={handleCancelQR}
                       isModalOpen={isModalOpenQr}
                    />
                )
            }
        </div>
    )
}
export default ProfileApp