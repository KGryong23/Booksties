'use client'

import Menu, { MenuProps } from "antd/es/menu/menu"
import HomeOutlined from '@ant-design/icons/HomeOutlined'
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined'
import BarChartOutlined from '@ant-design/icons/BarChartOutlined'
import TeamOutlined from '@ant-design/icons/TeamOutlined'
import UserOutlined from '@ant-design/icons/UserOutlined'
import ScheduleOutlined from '@ant-design/icons/ScheduleOutlined'
import CalendarOutlined from '@ant-design/icons/CalendarOutlined'
import ZoomInOutlined from '@ant-design/icons/ZoomInOutlined'
import SyncOutlined from '@ant-design/icons/SyncOutlined'
import Link from "next/link"

const MenuApp=()=>{
    const onClick: MenuProps['onClick'] = (e) => {};
    const items = [
      {
          key: '0',
          icon: <HomeOutlined style={{fontSize:16}}/>,
          label: <Link href={"/"} style={{fontSize:17}}>Dashboard</Link>,
      },
      {
          key: '1',
          icon: <SyncOutlined style={{fontSize:16}}/>,
          label: <Link href={"/product"} style={{fontSize:17}}>Sản phẩm</Link>,
      },
      {
          key: '2',
          icon: <UnorderedListOutlined style={{fontSize:16}}/>,
          label: <Link href={"/order"} style={{fontSize:17}}>Đơn hàng</Link>,
      },
      {
          key: '3',
          icon: <BarChartOutlined style={{fontSize:16}}/>,
          label: <Link href={"/auction"} style={{fontSize:17}}>Đấu giá</Link>,
      },
      {
          key: '4',
          icon: <TeamOutlined style={{fontSize:16}}/>,
          label: <Link href={"/user"} style={{fontSize:17}}>Quản lý nhân sự</Link>,
      },
      {
          key: '5',
          icon: <UserOutlined style={{fontSize:16}}/>,
          label: <Link href={"/role"} style={{fontSize:17}}>Phân quyền</Link>,
      },
      {
          key: '6',
          icon: <ScheduleOutlined style={{fontSize:16}}/>,
          label: <div style={{fontSize:17}}>Lập lịch học kì</div>,
      },
      {
          key: '7',
          icon: <CalendarOutlined style={{fontSize:16}}/>,
          label: <div style={{fontSize:17}}>Xem lịch học kì</div>,
      },
      {
          key: '8',
          icon: <ZoomInOutlined style={{fontSize:16}}/>,
          label: <div style={{fontSize:17}}>Xem thời khóa biểu</div>,
      },
    ];
    return(
        <Menu
            inlineCollapsed={true}
            onClick={onClick}
            style={{background:"white",border:"none",borderRadius:"0.5rem",paddingTop:"1rem"}}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
        />
    )
}
export default MenuApp