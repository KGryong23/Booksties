'use client'

import { signOut, useSession } from "next-auth/react"
import "../../styles/web_name.scss"
import CaretDownOutlined  from '@ant-design/icons/CaretDownOutlined'
import Button from "antd/es/button/button"
import Popover from "antd/es/popover"
import { SignOutUser } from "@/utils/action/action"

const HeaderApp=()=>{
    const { data:session } = useSession()
    const handleSignOut = async () => {
      try {
        if(session?.user.userId){
            await SignOutUser(session?.user.userId)
        }
      } catch (errInfo) {
        console.log('Validate Failed:', errInfo);
      }
      signOut()
    }
    return(
        <div style={{ 
            display:'flex',
            height:'100%',
            alignItems:'center',
            margin:'0rem 0rem 0 2rem',
            justifyContent:"space-between"
          }}>
            <div className="website-name" style={{marginTop:"0.5rem",height:'3rem'}} > 
                Admin
            </div>
            <div style={{
               margin:"0.7rem 10rem 0 0",
            }}>
              {
                session
                ?
                <Popover placement="bottomRight" content={
                  <div onClick={handleSignOut} style={{ cursor:"pointer",fontSize:"1rem" }}>Đăng xuất</div>
                }>
                   <div style={{ 
                     cursor:"pointer",
                     fontSize:"1.2rem",
                     display:"flex"
                   }}>
                     <div>
                       {session.user.email}
                     </div>
                     <CaretDownOutlined style={{
                        margin:"0.2rem 0 0 0.3rem",
                        fontSize:"1rem",
                        color:"#697EB1"
                     }}/>
                   </div>
                </Popover>
                :
                <Button onClick={handleSignOut}>Đăng xuất</Button>
              }
            </div>
        </div>
    )
}
export default HeaderApp