'use client'

import Sider from "antd/es/layout/Sider"
import SiderApp from "../sider/sider.app"
import { Content } from "antd/es/layout/layout"
import HomeContent from "../content/home.content"
import { useEffect, useState } from "react"
import { GetPaginationProductsNotDetail } from "@/utils/action/action"

const siderStyle: React.CSSProperties = {
    margin: '0rem 0 0 4rem',
    height:'auto',  
    flex: '0 0 25%',
    background:'#efefef',
};
interface IProps{
    genres : IGenre[]
}
const HomePageContent=(data :IProps)=>{
    const [genre,setGenre] = useState<IGenre>({
      id:null,
      name:null
    })
    const [limit,setLimit] = useState<number>(12)
    const [minRating,setMinRating] = useState<number | null>(null)
    const [minPrice,setMinPrice] = useState<number | null>(null)
    const [maxPrice,setMaxPrice] = useState<number | null>(null)
    const [sortBy,setSortBy] = useState<string | null>("high_rating")
    const [products,setProducts] = useState<IProductNotDetail[]>([])
    const handleProducts = async () => {
      const products = await GetPaginationProductsNotDetail(limit,minRating,minPrice,maxPrice,sortBy,genre.id)
      setProducts(products)
    }
    useEffect(()=>{
       handleProducts()
    },[JSON.stringify({ genre, limit, minRating, minPrice, maxPrice, sortBy })])
    return(
        <>
          <Sider width="15.5%" style={siderStyle}>
            <SiderApp 
              genres={data.genres ?? []}
              setGenre={setGenre}
            />
          </Sider>
          <Content style={{marginTop:'1rem'}}>
            <HomeContent 
               products={products ?? []}
               genre={genre.name}
               setGenre={setGenre}
               limit={limit}
               setLimit={setLimit}
               minPrice={minPrice}
               setMinPrice={setMinPrice}
               maxPrice={maxPrice}
               setMaxPrice={setMaxPrice}
               sortBy={sortBy}
               setSortBy={setSortBy}
               minRating={minRating}
               setMinRating={setMinRating}
            />
          </Content>
        </>
    )
}
export default HomePageContent