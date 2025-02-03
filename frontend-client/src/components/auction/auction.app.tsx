'use client'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import InfiniteScroll from 'react-infinite-scroll-component';
import List from 'antd/es/list';
import { useEffect, useState } from 'react';
import InputNumber from 'antd/es/input-number';
import Button from 'antd/es/button';
import { GetBalance, PlaceBid } from '@/utils/action/action';
import notification from 'antd/es/notification';
import { useBidStore } from '@/hooks/useBidStore';
import { useSession } from 'next-auth/react';
import { useSearchContext } from '@/lib/search.wrapper';

interface Iprops {
    auction: IAuction | null
    bids: IBid[]
}

const imgStyle: React.CSSProperties = {
    width: '23rem', 
    height: '32rem', 
    borderRadius: '0.5rem', 
};

const getBidInfo = (status :string)=> {
    let bgColor = '';
    let text = '';
    switch (status) {
        case 'Accepted':
            bgColor = 'green'
            text = 'Chấp nhận'
            break;
        case 'AcceptedBelowReserve':
            bgColor = 'amber'
            text = 'Không đáp ứng giá ban đầu'
            break;
        case 'TooLow': 
            bgColor = 'red'
            text = 'Quá thấp'
            break;
        default:
            bgColor = 'red'
            text = 'Đặt khi kết thúc'
            break;
    }
    return {bgColor, text}
}

const AuctionApp = (props :Iprops) => {
    const { auction , bids } = props
    dayjs.extend(relativeTime);
    dayjs.locale('vi');
    const { data:session } = useSession()
    const {setIsModalOpen} = useSearchContext()
    const [amount,setAmount] = useState<number | null>(null)
    const stateBids = useBidStore(state => state.bids);
    const setBids = useBidStore(state => state.setBids);
    const highBid = bids.reduce(
        (prev, { amount, status }) =>
          status.includes('Accepted') && amount > prev ? amount : prev,
        0
      );           
    const loadMoreData = () => {};
    const handlePlaceBid = async () => {
        if(!session?.user){
            setIsModalOpen(true)
            return
        }
        if(amount){
            if(!session?.user){
                notification.error({
                    message: "Bị hủy",
                    description: "Bạn phải đăng nhập để thực hiện quyền này",
                })
                return
            }
            const res = await GetBalance()
            if(res.data < amount){
                notification.error({
                    message: "Bị hủy",
                    description: "Vui lòng kiểm tra số dư trong ví của bạn",
                })
                return
            }
            if(highBid && amount <= highBid){
                notification.error({
                    message: "Bị hủy",
                    description: "Bạn chỉ được đặt giá cao hơn giá hiện tại",
                })
                return
            }
            const result = await PlaceBid(auction?.id!,amount!)
            if (result.code === 201){
                notification.success({
                    message: "Thành công",
                    description: result.message,
                })
                setAmount(null)
            }else{
                notification.error({
                    message: "Thất bại",
                    description: result.message,
                })
            }
        }else{
            notification.error({
                message: "Cảnh báo",
                description: "Vui lòng nhập số tiền mà bạn muốn đặt",
            })
        }
    }
    useEffect(() => {
        if(bids){
            setBids(bids)
        }
    }, [bids,setBids]);
    return(
        <div style={{
            display:"flex",
            gap:'0.5rem',
            margin:"0.5rem 2rem 0 2rem"
        }}>
            <div style={{
                background: 'white',
                borderRadius: '0.5rem',
                padding: '1rem',
            }}>
               <img 
                style={imgStyle} 
                alt="example" 
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/images/${auction?.imageUrl}`} 
               />
            </div>
            <div style={{
                display:"flex",
                gap:'0.5rem',
                flexDirection:'column',
                width:"37%"
            }}>
                <div style={{
                  background: 'white',
                  borderRadius: '0.5rem',
                  height:"32%",
                }}>
                    {
                        highBid ?
                        <div style={{
                             display:"flex",
                             gap:"0.5rem",
                             margin:"1rem 1rem 0 1rem"
                        }}>
                            <div style={{
                                fontSize:"1.2rem",
                                marginTop:"0.4rem"
                            }}>Giá thầu hiện tại :</div>
                            <div style={{
                               fontSize:"1.7rem",
                               color:"red"
                            }}>
                               {highBid.toLocaleString('vi-VN')} VNĐ
                            </div>
                        </div>
                        :
                        <div style={{
                            margin:"1rem 1rem 0 1rem",
                            fontSize:"1.2rem",
                        }}>
                            Chưa có giá thầu nào được đặt
                        </div>
                    }
                    <div style={{
                        display:'flex',
                        gap:'0.5rem',
                        margin:"0.7rem 1rem 0 1rem"
                    }}>
                        <div style={{
                            fontSize:"1.2rem"
                        }}>
                            Kết thúc vào :
                        </div>
                        <div style={{
                            fontSize:"1.2rem",
                            color:"green"
                        }}>
                            {dayjs(auction?.auctionEnd).format('dddd, D MMMM, YYYY h:mm A')}
                        </div>
                    </div>
                    <div style={{
                        display:'flex',
                        gap:'0.5rem',
                        margin:"0.8rem 1rem 0 1rem"
                    }}>
                        <div style={{
                            fontSize:"1.1rem",
                        }}>
                            Người bán :
                        </div>
                        <div style={{
                            fontSize:"1.1rem",
                            color:"#585858"
                        }}>
                            {auction?.seller}
                        </div>
                    </div>
                    <div style={{
                        display:'flex',
                        gap:'0.5rem',
                        margin:"0.8rem 1rem 0rem 1rem"
                    }}>
                        <div style={{
                            fontSize:"1.1rem",
                        }}>
                            Địa chỉ :
                        </div>
                        <div style={{
                            fontSize:"1.1rem",
                            color:"#585858"
                        }}>
                            {auction?.sellerAddress ?? "Chưa có"}
                        </div>
                    </div>
                </div>
                <div style={{
                    display:'flex',
                    flexDirection:"column",
                    background:"white",
                    borderRadius: '0.5rem',
                }}>
                    <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        margin:"1.6rem 0rem 0.6rem 1rem",
                        fontSize:"1rem",
                     }}>
                        <div style={{
                           color:"#888888",
                           width:"50%"
                        }}>
                           Tên sách
                        </div>
                        <div style={{
                           width:"50%"
                        }}>
                           {auction?.title}
                        </div>
                    </div>
                    <div style={{
                        borderTop:"0.01rem solid #C8C8C8",
                        margin:"0 1rem 0 1rem"
                    }}></div>
                    <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        margin:"1rem 0rem 0.6rem 1rem",
                        fontSize:"1rem",
                     }}>
                        <div style={{
                           color:"#888888",
                           width:"50%"
                        }}>
                           Tác giả
                        </div>
                        <div style={{
                           width:"50%"
                        }}>
                           {auction?.author}
                        </div>
                    </div>
                    <div style={{
                        borderTop:"0.01rem solid #C8C8C8",
                        margin:"0 1rem 0 1rem"
                    }}></div>
                    <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        margin:"1rem 0rem 0.6rem 1rem",
                        fontSize:"1rem",
                     }}>
                        <div style={{
                           color:"#888888",
                           width:"50%"
                        }}>
                           Nhà xuất bản
                        </div>
                        <div style={{
                           width:"50%"
                        }}>
                           {auction?.publisher}
                        </div>
                    </div>
                    <div style={{
                        borderTop:"0.01rem solid #C8C8C8",
                        margin:"0 1rem 0 1rem"
                    }}></div>
                    <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        margin:"0.6rem 0rem 0.6rem 1rem",
                        fontSize:"1rem",
                    }}>
                        <div style={{
                           color:"#888888",
                           width:"50%"
                        }}>
                           Năm xuất bản
                        </div>
                        <div style={{
                           width:"50%"
                        }}>
                           {auction?.year}
                        </div>
                    </div>
                    <div style={{
                        borderTop:"0.01rem solid #C8C8C8",
                        margin:"0 1rem 0 1rem"
                    }}></div>
                    <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        margin:"0.6rem 0rem 1.6rem 1rem",
                        fontSize:"1rem",
                     }}>
                        <div style={{
                           color:"#888888",
                           width:"50%"
                        }}>
                           Số trang
                        </div>
                        <div style={{
                           width:"50%"
                        }}>
                           {auction?.pageCount}
                        </div>
                    </div>
                </div>
                <div style={{
                    background: 'white',
                    borderRadius: '0.5rem',
                }}>
                    <div style={{
                        margin:"1rem 1rem 0 1rem",
                        fontSize:"1.2rem"
                    }}>
                        Mô tả về sản phẩm
                    </div>
                    <div style={{
                        margin:"0.5rem 1rem 1rem 1rem",
                        fontSize:"1rem",
                        color:"#585858"
                    }}>
                        {auction?.description}
                    </div>
                </div>
            </div>
            <div style={{
                width:"35%",
                borderRadius: '0.5rem',
            }}>
              <div
                id="scrollableDiv"
                style={{
                    height: "26.8rem",
                    overflow: 'auto',
                    padding: '0 16px',
                    border: '1px solid rgba(140, 140, 140, 0.35)',
                    background:"white",
                    width:"100%",
                    borderRadius: '0.5rem',
                }}
                >
                <InfiniteScroll
                    dataLength={stateBids.length}
                    next={loadMoreData}
                    hasMore={stateBids.length < 50}
                    loader={<></>}
                    endMessage={<></>}
                    scrollableTarget="scrollableDiv"
                >
                    <List
                    dataSource={stateBids}
                    renderItem={(item) => (
                        <List.Item key={item.id}>
                        <List.Item.Meta
                            title={<div
                              style={{
                                 fontSize:"1rem"
                              }}
                            >{item.bidder}</div>}
                            description={dayjs(item.createdAt).format('dddd, D MMMM, YYYY h:mm A')}
                        />
                        <div style={{ 
                            display:"flex",
                            flexDirection:"column",
                            gap:"0.1rem",
                            width:"30%",
                            alignItems: "flex-end"
                        }}>
                          <div style={{ fontSize:"1rem",color:getBidInfo(item.status).bgColor }}>{item.amount.toLocaleString('vi-VN')} VNĐ</div>
                          <div>{getBidInfo(item.status).text}</div>
                        </div>
                        </List.Item>
                    )}
                    />
                </InfiniteScroll>
              </div>
              <InputNumber
                style={{ 
                    width:"100%",
                    marginTop:"0.5rem",
                    height:"10%"
                }}
                size='large'
                placeholder={auction?.currentHighBid ? `
                    Bạn nên đặt giá cao hơn ${auction?.currentHighBid! + 1}
                ` : "Mời bạn đặt giá"}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                max={10000000 as number}
                min={10000 as number}
                value={amount}
                onChange={(e) => setAmount(e)}
              />
              <Button onClick={handlePlaceBid} type="primary" size={"large"} style={{
                    width:"100%",
                    marginTop:"0.6rem"
               }}>
                   Đặt giá
              </Button>
            </div>
        </div>
    )
}
export default AuctionApp