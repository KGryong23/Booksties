'use client'

import Card from "antd/es/card"
import Statistic from "antd/es/statistic"
import ArrowUpOutlined from '@ant-design/icons/ArrowUpOutlined'
import BarChart from "./bar.chart"
import Table from "antd/es/table"
import Tag from "antd/es/tag"

interface IProps{
  salesRevenue: ISalesRevenue
  salesData: ISalesData
  auctionSummary: IAuctionSummary
  lastSixMonth: IAuctionLastSixMonth
  auctionTop:IAuctionTop
  productTop:IProductTop[]
}

const getBidInfo = (status :string)=> {
  let bgColor = '';
  let text = '';
  switch (status) {
      case 'Live':
          bgColor = 'green'
          text = 'Đang diễn ra'
          break;
      case 'Pending':
          bgColor = 'blue'
          text = 'Đang xử lý'
          break;
      case 'ReserveNotMet': 
          bgColor = 'red'
          text = 'Không đáp ứng'
          break;
      case 'Upcoming': 
          bgColor = 'yellow'
          text = 'Đang diễn ra'
          break;
      case 'Finished': 
          bgColor = 'orange'
          text = 'Hoàn thành'
          break;
      default:
          bgColor = 'red'
          text = 'Đặt khi kết thúc'
          break;
  }
  return {bgColor, text}
}
const columnsAuction  = [
  {
    title: 'Tên',
    dataIndex: 'title',
    key: 'title',
    render: (text :string) => <a style={{ fontSize:"1rem" }}>{text}</a>,
  },
  {
    title: 'Giá',
    dataIndex: 'currentHighBid',
    render: (text :number) =>{
      let textString: string | number= 0
      if(text){
        textString = text
      }else{
        textString = 'Chưa có'
      }
      return(
        <a style={{  fontSize:"1rem", color:"red" }}>{text ? text?.toLocaleString('vi-VN') : textString}</a>
      )
  },     
    key: 'currentHighBid',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    render: (text :string) =>{
      return(
        <Tag style={{  fontSize:"1rem" }} color={getBidInfo(text).bgColor}>
           {getBidInfo(text).text}
        </Tag>
      )
    },     
    key: 'status',
  },
];
const columnsProduct  = [
  {
    title: 'Tên',
    dataIndex: 'title',
    key: 'title',
    render: (text :string) => 
    <a style={{
       color:"black",
       fontSize:"1rem",
       display: "inline-block",
       maxWidth:"20rem",
       whiteSpace: "nowrap",
       overflow: "hidden",
       textOverflow: "ellipsis", 
    }}>
        {text}
    </a>,
  },
  {
    title: 'Đã bán',
    dataIndex: 'sold_quantity',
    render: (text :number) => <a style={{ color:"red" , fontSize:"1rem" }}>{text}</a>,
    key: 'sold_quantity',
  },
  {
    title: 'Đánh giá',
    dataIndex: 'average_rating',
    render: (text :number) => <a style={{ color:"blue" , fontSize:"1rem" }}>{text}</a>,
    key: 'average_rating',
  },
];
const DashboardApp = (props :IProps) => {
  const { productTop ,salesRevenue , salesData , auctionSummary , lastSixMonth ,auctionTop} = props
    return(
        <div>
           <div style={{
              display:'flex',
              gap:'0.3rem',
              // justifyContent:'center'
           }}>
              <Card style={{ height:"7rem" }}>
                <div style={{
                  display:'flex',
                  gap:'1rem'
                }}>
                  <Statistic title="Tiền bán hôm nay" value={salesData.today_sales.toLocaleString('vi-VN')}/>
                  <div style={{
                     borderLeft:"0.05rem solid #C0C0C0"
                  }}></div>
                  <Statistic title="Tiền đấu giá hôm nay" value={auctionSummary.todaySales.toLocaleString('vi-VN')}/>
                </div>
              </Card>
              <Card>
                  <Statistic title="Tiền bán tháng này" valueRender={()=>(
                    <div style={{ display:"flex",gap:'0.5rem' }}>
                      <div>{(salesData.current_month_sales).toLocaleString('vi-VN')}</div>
                      <div style={{
                        marginTop:"0.3rem",
                        display:'flex',
                        gap:'0.3rem',
                        fontSize:"1.1rem",
                        color: '#3f8600',
                      }}>
                        <div><ArrowUpOutlined /></div>
                        <div>{salesData.percentage_change}</div>
                        <div>%</div>
                      </div>
                    </div>
                  )}/>
              </Card>
              <Card>
                  <Statistic title="Tiền đấu giá tháng này" valueRender={()=>(
                    <div style={{ display:"flex",gap:'0.5rem' }}>
                      <div>{(auctionSummary.currentMonthSales).toLocaleString('vi-VN')}</div>
                      <div style={{
                        marginTop:"0.3rem",
                        display:'flex',
                        gap:'0.3rem',
                        fontSize:"1.1rem",
                        color: '#3f8600',
                      }}>
                        <div><ArrowUpOutlined /></div>
                        <div>{auctionSummary.percentageChange}</div>
                        <div>%</div>
                      </div>
                    </div>
                  )}/>
              </Card>
              <Card style={{ height:"7rem" }}>
                <Statistic title="Tổng tiền bán" value={salesData.total_sales.toLocaleString('vi-VN')}/>
              </Card>
              <Card style={{ height:"7rem" }}>
                <Statistic title="Tổng tiền đấu giá" value={auctionSummary.totalSales.toLocaleString('vi-VN')}/>
              </Card>
              <Card style={{ height:"7rem" }}>
                <Statistic title="Tổng quan đấu giá" valueRender={()=>(
                    <div style={{
                      display:'flex',
                      gap:'0.8rem'
                    }}>
                       <div style={{ display:'flex',gap:'0.2rem' }}>
                          <div>
                             {auctionTop.totalAuctions}
                          </div>
                          <div style={{ fontSize:"0.9rem",marginTop:"0.7rem" }}>
                             phiên
                          </div>
                       </div>
                       <div style={{
                        borderLeft:"0.05rem solid #C0C0C0"
                       }}></div>
                       <div style={{ display:'flex',gap:'0.2rem' }}>
                          <div>
                             {auctionTop.finishedAuctions}
                          </div>
                          <div style={{ fontSize:"0.9rem",marginTop:"0.7rem" }}>
                             đạt
                          </div>
                       </div>
                       <div style={{
                        borderLeft:"0.05rem solid #C0C0C0"
                       }}></div>
                       <div style={{ display:'flex',gap:'0.2rem' }}>
                          <div>
                             {auctionTop.reserveNotMetAuctions}
                          </div>
                          <div style={{ fontSize:"0.9rem",marginTop:"0.7rem" }}>
                             không đạt
                          </div>
                       </div>
                    </div>
                )}/>
              </Card>
           </div>
           <div style={{ display:'flex',gap:'1rem', marginTop:"1rem", }}>
             <div>
              <div style={{ 
                width:'50rem', 
                height:'20rem',
                background:"white",
                borderRadius:"0.5rem",
                display:"flex",
                justifyContent:'center',
                padding:'0.5rem 0'
              }}>
                <BarChart
                    dataChart={salesRevenue}
                    title='Doanh thu bán hàng 6 tháng gần nhất'
                />
              </div>
              <div style={{ 
                width: '50rem', 
                height: '20rem',
                background:"white",
                borderRadius:"0.5rem",
                marginTop:"1rem",
                display:"flex",
                justifyContent:'center',
                padding:'0.5rem 0'
              }}>
                <BarChart
                    dataChart={lastSixMonth}
                    title='Doanh thu đấu giá 6 tháng gần nhất'
                />
              </div>
             </div>
             <div>
                <div style={{
                   background:"white",
                   borderRadius:"0.5rem",
                   height:"60vh",
                   marginBottom:"1rem"
                }}>
                   <div style={{
                    fontSize:"1.1rem",
                    padding:"1rem"
                   }}>Top 5 sản phẩm bán chạy nhất</div>
                <Table rowKey={"id"} columns={columnsProduct} dataSource={productTop} pagination={false}/>
                </div>
                <div style={{
                   background:"white",
                   borderRadius:"0.5rem",
                   height:"55vh"
                }}>
                   <div style={{
                    fontSize:"1.1rem",
                    padding:"1rem"
                   }}>Top 5 phiên đấu giá có giá đặt cao nhất</div>
                   <Table style={{ width:"35rem" }} rowKey={"id"} columns={columnsAuction} dataSource={auctionTop.topAuctions} pagination={false}/>
                </div>
             </div>
           </div>
        </div>
    )
}
export default DashboardApp
