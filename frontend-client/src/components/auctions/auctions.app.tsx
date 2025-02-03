'use client'

import Radio from "antd/es/radio"
import FireOutlined from '@ant-design/icons/FireOutlined';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import LeftOutlined from '@ant-design/icons/LeftOutlined';
import FieldTimeOutlined from '@ant-design/icons/FieldTimeOutlined';
import ShoppingOutlined from '@ant-design/icons/ShoppingOutlined';
import HourglassOutlined from '@ant-design/icons/HourglassOutlined';
import StarOutlined from '@ant-design/icons/StarOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';

import CountdownTimer from "./countdown.timer";
import CurrentBid from "./current.bid";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuctionStore } from "@/hooks/useAuctionStore";
import { useShallow } from "zustand/react/shallow";

const imgStyle: React.CSSProperties = {
  width: '100%',
  height: '65vh',
  borderRadius: '0.5rem',
};

interface IProps {
  auctions: IPaginationAuction<IAuction>
}
const AuctionsApp = (props: IProps) => {
  const { auctions } = props
  const router = useRouter()
  const [orderBy, setOrderBy] = useState<"new" | "endingSoon" | "highBid">("highBid")
  const [filterBy, SetFilterBy] = useState<"finished" | "endingSoon" | "live">("live")
  const [limit, setLimit] = useState<number>(auctions.count | 8)
  const [page, setPage] = useState<number>(auctions.pageIndex | 1)
  const handleQueryParams = () => {
    const queryParams: Record<string, string> = {};
    if (page) queryParams.page = encodeURIComponent(page.toString());
    if (limit) queryParams.limit = encodeURIComponent(limit.toString());
    if (orderBy) queryParams.orderBy = encodeURIComponent(orderBy);
    if (filterBy) queryParams.filterBy = encodeURIComponent(filterBy);
    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/auctions?${queryString}`)
  }
  const data = useAuctionStore(useShallow(state => ({
    auctions: state.auctions,
    totalCount: state.totalCount,
    pageCount: state.pageCount
  })))
  const setData = useAuctionStore(state => state.setData);

  useEffect(() => {
    handleQueryParams()
  }, [orderBy, filterBy, page, limit])

  useEffect(() => {
    if (auctions) {
      setData(auctions);
    }
  }, [auctions, setData]);

  return (
    <div style={{
      margin: '1rem 4rem 0 4rem'
    }}>
      <div style={{ display: "flex", justifyContent: 'space-between' }}>
        <div style={{
          display: 'flex',
          gap: '0.5rem'
        }}>
          <div style={{
            fontSize: "1.2rem",
            marginTop: "0.7rem"
          }}>
            Lọc theo
          </div>
          <Radio.Group size="large" value={filterBy} onChange={(e) => SetFilterBy(e.target.value)}>
            <Radio.Button value="live">
              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <FireOutlined />
                <div style={{ fontSize: "1rem" }}>
                  Đấu giá trực tiếp
                </div>
              </div>
            </Radio.Button>
            <Radio.Button value="endingSoon">
              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <CalendarOutlined />
                <div style={{ fontSize: "1rem" }}>
                  Kết thúc <LeftOutlined /> 6 giờ
                </div>
              </div>
            </Radio.Button>
            <Radio.Button value="finished">
              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <FieldTimeOutlined />
                <div style={{ fontSize: "1rem" }}>
                  Đã hoàn thành
                </div>
              </div>
            </Radio.Button>
          </Radio.Group>
        </div>
        <div style={{
          display: 'flex',
          gap: '0.5rem'
        }}>
          <div style={{
            fontSize: "1.2rem",
            marginTop: "0.7rem"
          }}>
            Sắp xếp
          </div>
          <Radio.Group size="large" value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
            <Radio.Button value="new">
              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <ShoppingOutlined />
                <div style={{ fontSize: "1rem" }}>
                  Mới nhất
                </div>
              </div>
            </Radio.Button>
            <Radio.Button value="endingSoon">
              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <HourglassOutlined />
                <div style={{ fontSize: "1rem" }}>
                  Sắp kết thúc
                </div>
              </div>
            </Radio.Button>
            <Radio.Button value="highBid">
              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <StarOutlined />
                <div style={{ fontSize: "1rem" }}>
                  Giá đặt cao nhất
                </div>
              </div>
            </Radio.Button>
          </Radio.Group>
        </div>
        <Radio.Group size="large" value={limit} onChange={(e) => setLimit(e.target.value)}>
          <Radio.Button value={4}>
            4
          </Radio.Button>
          <Radio.Button value={8}>
            8
          </Radio.Button>
          <Radio.Button value={12}>
            12
          </Radio.Button>
        </Radio.Group>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        margin: '1rem 0rem 0rem 0rem',
      }}>
        {
          data.auctions.map((item, index) => (
            <Link href={`/auction/${item.id}`} key={index}>
              <div style={{
                background: 'white',
                cursor: 'pointer',
                borderRadius: '0.5rem',
                padding: '1rem',
                position: 'relative'
              }}>
                <img
                  style={imgStyle}
                  alt="example"
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auction/images/${item.imageUrl}`}
                />
                <div style={{
                  color: "#333",
                  fontFamily: "Arial, sans-serif",
                  fontSize: '1.2rem',
                  marginTop: "0.7rem"
                }}>
                  {item.title}
                </div>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: "0.2rem",
                  justifyContent: "space-between",
                  fontSize: "1rem"
                }}>
                  <div style={{
                    color: "red"
                  }}>
                    {item.author}
                  </div>
                  <div>
                    {item.year}
                  </div>
                </div>
                <div style={{
                  position: "absolute",
                  bottom: "5.5rem",
                  left: "1.5rem"
                }}>
                  <CountdownTimer auctionEnd={item.auctionEnd} />
                </div>
                <div style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "1.5rem"
                }}>
                  <CurrentBid
                    reservePrice={item.reservePrice}
                    amount={item.currentHighBid}
                  />
                </div>
              </div>
            </Link>
          ))
        }
      </div>
      <div style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        marginTop: "2rem"
      }}>
        <Radio.Group
          size="large"
          style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}
          onChange={(e) => setPage(e.target.value)}
        >
          <Radio.Button value={page - 1} disabled={page > 1 ? false : true}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <LeftOutlined />
              <div>
                Trước
              </div>
            </div>
          </Radio.Button>
          <Radio.Button value={page + 1}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div>Sau</div>
              <RightOutlined />
            </div>
          </Radio.Button>
        </Radio.Group>
      </div>
    </div>
  )
}

export default AuctionsApp