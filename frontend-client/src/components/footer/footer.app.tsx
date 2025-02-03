import { Footer } from "antd/es/layout/layout"
import AppleOutlined  from '@ant-design/icons/AppleOutlined';
import WindowsOutlined  from '@ant-design/icons/WindowsOutlined';
import GithubOutlined  from '@ant-design/icons/GithubOutlined';
import AliwangwangOutlined  from '@ant-design/icons/AliwangwangOutlined';
const FooterApp=()=>{
    return(
        <Footer style={{background:'#181818',height:"100%",width:"100%",marginTop:"3.4rem"}}>
            <div style={{borderBottom:'1px solid #A9A9A9',height:100,display:'flex',justifyContent:"space-between",marginTop:10}}>
               <div style={{color:"white",fontSize:25,width:'50%',fontFamily:'cursive'}}>Wellcome Booksties</div>
               <div style={{display:'flex',gap:40,fontSize:60,color:'whitesmoke',margin:"20px 0 50px 0"}}>
                    <AppleOutlined />
                    <WindowsOutlined />
                    <GithubOutlined />
                    <AliwangwangOutlined />
               </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',marginTop:100}}>
              <div style={{color:"white",fontSize:40,fontFamily:'cursive'}}>Trung Academy</div>
            </div>
        </Footer>
    ) 
}
export default FooterApp