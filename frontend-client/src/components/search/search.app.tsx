'use client'

import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import SearchContent from "./search.content";
import SearchSider from "./search.sider";

const siderStyle: React.CSSProperties = {
    margin: '0 6rem 0 2rem',
    height:'auto',  
    flex: '0 0 25%',
    background:'#efefef',
};
interface IProps{
    products:IProductNotDetail[]
}
const SearchApp=(data :IProps)=>{
    return(
        <>
          <Content>
             <SearchContent products={data.products}/>
          </Content>
          <Sider width="15%" style={siderStyle}>
              <SearchSider/>
          </Sider>
        </>
    )
}
export default SearchApp