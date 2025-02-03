'use client'

import { signOut, useSession } from "next-auth/react"
import "../../styles/web_name.scss"
import "../../styles/hover.scss"
import BookOutlined  from '@ant-design/icons/BookOutlined'
import CaretDownOutlined  from '@ant-design/icons/CaretDownOutlined'
import ShoppingCartOutlined  from '@ant-design/icons/ShoppingCartOutlined'
import TrademarkOutlined  from '@ant-design/icons/TrademarkOutlined'
import UserOutlined  from '@ant-design/icons/UserOutlined'
import LogoutOutlined  from '@ant-design/icons/LogoutOutlined'

import { useEffect, useMemo, useState } from "react"
import { useRouter,usePathname } from "next/navigation"
import { useSearchContext } from "@/lib/search.wrapper"
import SearchBar from "./search.bar"
import Avatar from "antd/es/avatar/avatar"
import Popover, { PopoverProps } from "antd/es/popover"
import message from "antd/es/message"
import Link from "next/link"
import Button from "antd/es/button"

const HeaderApp=()=>{
    const { data:session } = useSession()
    const {setIsModalOpen} = useSearchContext()
    const [search,setSearch] = useState<string>("")
    const [visible, setVisible] = useState(false);
    const router = useRouter()
    const pathname = usePathname();

    const handleSearch=()=>{
      const isAuctionPage =
      typeof window !== 'undefined' && window.location.pathname.includes('/auctions');
      if(search !== ""){
        if(isAuctionPage){
          router.push(`/auctions?searchTerm=${search}`)
        }else{
          router.push(`/search?query=${search}`)
        }
         
      }else{
        message.error("Bạn không được để trống !!!")
      }
    }
    const handleChange = (value: string) => {
       setSearch(value);
    };
    const handleCheckSignin=()=>{
        if(!session?.user){
           setIsModalOpen(true)
        }else{
          router.push("/cart")
        }
    }
    const [arrow, setArrow] = useState<'Show' | 'Hide' | 'Center'>('Show');

    const mergedArrow = useMemo<PopoverProps['arrow']>(() => {
      if (arrow === 'Hide') {
        return false;
      }

      if (arrow === 'Show') {
        return true;
      }

      return {
        pointAtCenter: true,
      };
    }, [arrow]);
    useEffect(() => {
      const path = pathname.toLowerCase();
      if (path.includes('auctions') || path.includes('auction')) {
        setVisible(false);
        return;
      }
  
      const toggleVisibility = () => {
        setVisible((prev) => !prev);
      };
  
      const interval = setInterval(toggleVisibility, 3000); 
  
      return () => clearInterval(interval); 
    }, [pathname]); 
    return(
      <div style={{ 
          display:'flex',
          gap:'1rem',
        }}> 
        <div style={{ 
            display:'flex',
            gap:'5rem',
            height:'100%',
            alignItems:'center',
            margin:'0rem 2rem 0 2rem'
          }}>
          <div style={{
             height:'100%'
          }}>
            <Link href={"/"}>
            <div className="website-name" style={{ height:'3rem',marginBottom:"0.5rem",cursor:'pointer' }}>
              <BookOutlined style={{
                  fontSize:"1.5rem",marginRight:"0.4rem"
              }}/> Booksties
            </div>
            </Link>
          </div>
          <div style={{ 
            height: '11vh',
            marginTop:"1.3rem",
            width:"45rem"
          }}>
              <SearchBar
                  searchValue={search} 
                  onChange={handleChange} 
                  handleSearch={handleSearch}
                  setSearch={setSearch} 
              />
          </div>  
        </div>
        <div style={{
          display:"flex",
          gap:"2rem"
        }}>
          <Link href={"/auctions"} style={{
              marginTop:"1.4rem"
          }}>
          <Popover placement="bottomRight" open={visible} title={"Đấu giá đang diễn ra"} content={"Tham gia ngay"} arrow={mergedArrow}>
          <TrademarkOutlined style={{
              fontSize:"1.5rem",
              color:"#FF7F50",
              cursor:"pointer",
          }}/>
          </Popover>
          </Link>
          <ShoppingCartOutlined style={{
              fontSize:"1.5rem",
              marginTop:"0rem",
              color:"#B0B0B0",
              cursor:"pointer"
              }} 
                onClick={handleCheckSignin}
          />
        <div style={{
          alignItems:"center",
          cursor:"pointer",
          margin:"-0.2rem 0 0 0rem",
          display:'flex',
          gap:"1rem",
        }}>
          {
             session?.user && session?.user.email ? 
             <Popover placement="bottomRight" title={<></>}
               content={
                <div style={{
                  cursor:"pointer"
                }}>
                  <div style={{
                      display:'flex',
                      gap:'1rem',
                  }}>
                      <div style={{
                        fontSize:"1.1rem"
                      }}>
                        {session?.user.email}
                      </div>
                      <div>
                        <Avatar style={{ backgroundColor: "#f56a00", verticalAlign: 'middle' }} size="large">
                          {session.user ? session?.user.email.charAt(0).toUpperCase() : "Chưa có"}
                        </Avatar>
                      </div>
                  </div>
                  <Link href={"/account/profile"}>
                  <div style={{
                     color:"black", 
                     display: "flex",
                     gap:"0.5rem",
                     position: "relative",
                     fontSize:"1.1rem",
                     zIndex: 1,
                     width: "90%",
                     borderRadius: "0.5rem",
                     transition: "background-color 0.3s ease-in-out",
                     margin:"1rem 0 0 0rem",
                     paddingLeft:"0.5rem"
                   }}
                   onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
                   }}
                    onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                   }}
                   >
                     <UserOutlined />
                     <div>Quản lý tài khoản</div>
                  </div>
                  </Link>
                  <div style={{ 
                     display: "flex",
                     gap:"0.5rem",
                     position: "relative",
                     fontSize:"1.1rem",
                     zIndex: 1,
                     width: "90%",
                     borderRadius: "0.5rem",
                     transition: "background-color 0.3s ease-in-out",
                     margin:"0.3rem 0 0 0rem",
                     paddingLeft:"0.5rem"
                   }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }} 
                    onClick={()=>signOut()}
                   >
                     <LogoutOutlined />
                     <div>Đăng xuất</div>
                  </div>
                </div>
               }
               arrow={mergedArrow}>         
             <div style={{
                 display:'flex',
             }}>
                <Avatar style={{ backgroundColor: "#f56a00", verticalAlign: 'middle' }} size="large">
                    {session?.user.email.charAt(0).toUpperCase()}
                </Avatar>
                <CaretDownOutlined style={{
                    marginLeft:"0.3rem",
                    fontSize:"1rem",
                    color:"#697EB1"
                }}/>
             </div>
             </Popover>
            :
            <Button 
               size="large" 
               style={{ fontSize:"1rem" }}
               onClick={handleCheckSignin}
            >
              Đăng nhập
            </Button>
          }
        </div>
        </div>
      </div> 
    )
}
export default HeaderApp