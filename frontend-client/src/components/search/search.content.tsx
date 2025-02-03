'use client'

import Button from "antd/es/button"
import { useEffect, useState } from "react"
import PercentageOutlined  from '@ant-design/icons/PercentageOutlined';
import DollarOutlined  from '@ant-design/icons/DollarOutlined';
import MinusOutlined  from '@ant-design/icons/MinusOutlined';
import FilterOutlined  from '@ant-design/icons/FilterOutlined';
import LikeOutlined  from '@ant-design/icons/LikeOutlined';
import FireOutlined  from '@ant-design/icons/FireOutlined';
import DoubleRightOutlined  from '@ant-design/icons/DoubleRightOutlined';

import Checkbox, { CheckboxProps } from "antd/es/checkbox";
import Rate from "antd/es/rate";
import Select from "antd/es/select";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination, { PaginationProps } from "antd/es/pagination";
import SearchModal from "./search.modal";
import Link from "next/link";

const contentStyle_2: React.CSSProperties = {
  background:'white',
  margin: '0 1rem 0.5rem 2rem', 
  borderRadius: '0.5rem',
  height:'10vh',
  display:"flex",
};

const contentStyle_3: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)', 
  gap: '1rem', 
  margin: '0 1.1rem 0 2rem', 
};

const productItemStyle: React.CSSProperties = {
  width: '100%', 
  height: 'auto', 
  background: 'white',
  cursor: 'pointer',
  borderRadius: '0.5rem',
  padding: '0.3rem', 
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
  transition: 'transform 0.2s', 
  display: 'flex',
  flexDirection: 'column',
};

const imgStyle: React.CSSProperties = {
  width: '90%', 
  height: 'auto', 
  borderRadius: '0.25rem', 
};

interface IProps{
  products:IProductNotDetail[]
}
const SearchContent=(data :IProps)=>{
    const [sortBy,setSortBy] = useState<string | null>("high_rating")
    const [rating,setRating] = useState<boolean>(false)
    const [rating_1,setRating_1] = useState<number>(0)
    const [current, setCurrent] = useState(1);
    const [fiveStars,setFiveStars] = useState<boolean>(false)
    const [fourStars,setFourStars] = useState<boolean>(false)
    const [threeStars,setThreeStars] = useState<boolean>(false)
    const [query,setQuery]= useState<string>("empty")
    const router = useRouter()
    const searchParams = useSearchParams();
    const onChange: CheckboxProps['onChange'] = (e) => {
      const isChecked = e.target.checked;
      setRating(isChecked)
      setFourStars(isChecked)
      setQueryParam('min_rating', isChecked ? '4' : null);
      if(isChecked===true){
        setFiveStars(false)
        setThreeStars(false)
      } 
    };
    const handleChange = (value: string) => {
      setSortBy(value)
      setQueryParam('sort_by', value);
    };
 
    const onChangePaginate: PaginationProps['onChange'] = (page) => {
      setCurrent(page);
      setQueryParam('page', page);
    };
    const handleRating = (stars :number) => {
      if (stars === 5) {
          setFiveStars(!fiveStars);
          setFourStars(false);
          setThreeStars(false);
          setRating_1(!fiveStars ? 5 : 0);
          setRating(false);
      } else if (stars === 4) {
          setFiveStars(false);
          setFourStars(!fourStars);
          setThreeStars(false);
          setRating_1(!fourStars ? 4 : 0);
          setRating(!fourStars)
      } else if (stars === 3) {
          setFiveStars(false);
          setFourStars(false);
          setThreeStars(!threeStars);
          setRating_1(!threeStars ? 3 : 0);
          setRating(false);
      }
    };
    const setQueryParam = (key: string, value: string | number | null) => {
      const currentUrl = new URL(window.location.href);
      const searchParams = currentUrl.searchParams;

      if (value === null) {
        searchParams.delete(key);
      } else {
        searchParams.set(key, value.toString());
      }

      router.push(`${currentUrl.pathname}?${searchParams.toString()}`);
    };
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
      setIsModalOpen(true);
    };

    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const handleFieldQuery=(searchParams: URLSearchParams)=>{
      if(searchParams.get("query") && searchParams.get("query") !== null){
          setQuery(searchParams.get("query") ?? "empty")
      }
    }
    useEffect(()=>{
      const searchParams = new URL(window.location.href).searchParams;
      if(searchParams.get("page") && searchParams.get("page") !== null){
          setCurrent(parseInt(searchParams.get("page")!))
      }else{
          setCurrent(1)
      }
      handleFieldQuery(searchParams)
    },[searchParams])
    return(
        <>
          <div style={{
            margin:"-0.2rem 0 1rem 2rem",
            display:"flex",
            gap:"0.5rem",
          }}>
            <div style={{
              display:'flex',
              gap:"0.5rem",
              fontSize:"1rem",
              color:"#888888"
            }}>
              <div>Trang chủ</div>
              <DoubleRightOutlined style={{marginTop:"0.2rem"}}/>
            </div>
            <div style={{fontSize:"1rem",color:"#484848"}}>
              Kết quả tìm kiếm "{query}"
            </div>
          </div>
          <div style={contentStyle_2}>
              <div style={{display:"flex",width:"40rem",gap:'1rem',marginLeft:"1rem"}}>
                <div style={{margin:"1.65rem 0 0 0",fontSize:15,display:"flex",gap:'0.5rem'}}>
                  <Checkbox style={{marginBottom:"1.15rem"}}/> 
                  <FireOutlined style={{marginBottom:"1.15rem",color:"#FF0000"}}/>
                  <div style={{
                      marginTop:"0.4rem",
                      fontSize:"1rem",
                      fontFamily: "Arial, sans-serif", 
                  }}>
                      Giá tốt nhất
                  </div>   
                </div>
                <div style={{
                  borderRight:"0.05rem solid #C8C8C8",
                  height:"1.4rem",
                  marginTop:"1.8rem"
                }}></div>
                <div style={{margin:"1.65rem 0 0 0",fontSize:15,display:"flex",gap:'0.6rem'}}>
                  <Checkbox style={{marginBottom:"1.15rem"}}/> 
                  <div style={{display:"flex",gap:"0.3rem",color:"#FF0000"}}>
                      <LikeOutlined style={{marginBottom:"1.15rem"}}/>
                      <div style={{marginTop:"0.35rem",fontFamily:"initial",fontSize:"1.01rem"}}>TOP DEAL</div>
                  </div>
                  <div style={{marginTop:"0.35rem",fontFamily: "Arial, sans-serif",fontSize:"1.01rem"}}>
                      Siêu rẻ
                  </div>   
                </div>
                <div style={{
                  borderRight:"0.05rem solid #C8C8C8",
                  height:"1.4rem",
                  marginTop:"1.8rem"
                }}></div>
                <div style={{display:"flex",gap:'0.5rem'}}>
                  <Checkbox onChange={onChange} style={{marginTop:"0.5rem"}} checked={rating}/>
                  <Rate allowHalf defaultValue={4} style={{
                      fontSize:10,
                      color:"orange",
                      margin:"2.25rem 0 0 0"
                  }}/>
                  <div style={{
                      margin:"1.98rem 0 0 0",
                      fontFamily: "Arial, sans-serif",
                      fontSize:"1rem"
                  }}>Từ 4 sao</div>
                </div>
              </div>
              <div style={{
                display:"flex",
                margin: `1.2rem 0 0 ${["price_desc", "price_asc"].includes(sortBy!) ? "8.5rem" : "12rem"}`,
                gap:"0.7rem"
            }}>
                <div style={{
                  margin:"0.6rem 0 0 0",
                  fontSize:"1.1rem",
                  color:'#808080',
                  fontFamily:"revert"
                }}>
                  Sắp xếp
                </div>
                <Select
                  defaultValue={sortBy}
                  size="large"
                  onChange={handleChange}
                  options={[
                  { value: 'high_rating', label: 'Phổ biến' },
                  { value: 'best_selling', label: 'Bán chạy' },
                  { value: 'price_desc', label: 'Giá cao đến thấp' },
                  { value: 'price_asc', label: 'Giá thấp đến cao'},
                  ]}
                />
                <div style={{
                  borderRight:"0.05rem solid #C8C8C8",
                  height:"2rem",
                  marginTop:"0.2rem"
                }}></div>
                <Button
                  style={{marginTop:'0.25rem',width:"4rem"}}
                  icon={
                    <div style={{display:"flex",gap:'0.2rem'}}>
                      <FilterOutlined />
                      <div>Tất cả</div>
                    </div>
                  }
                  onClick={showModal}
                />
              </div>
          </div>
          <div style={contentStyle_3}>
              {
                data.products.map((item,index)=>(
                <Link href={`/book/${item.id}`} key={index}>
                  <div
                      style={productItemStyle}
                  >
                      <div style={{
                        width:"100%",
                        display:'flex',
                        justifyContent:"center"
                      }}>
                        <img 
                          style={imgStyle} 
                          alt="example" 
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog/images/${item.image_url}`} 
                        />
                      </div>
                      <div style={{
                        margin:"1rem 0 1rem 0.5rem"
                      }}>
                        <div style={{display:'flex',gap:"0.4rem"}}>
                            <div style={{
                              fontSize:20,
                              display:'flex',
                              color:item.discount_percentage > 0 ? "red" : "black",
                            }}>
                              <div style={{
                                  fontWeight: 400, textShadow: '0.01rem 0.01rem 0 currentColor'
                              }}>
                                  {item.price.toLocaleString('vi-VN')}
                              </div>
                              <DollarOutlined style={{fontSize:14,margin:"0 0 0.3rem 0.2rem"}}/>
                            </div>
                            {
                            item.discount_percentage > 0
                            ?
                            <div style={{
                              display:'flex',
                              margin:'0.2rem 0 0.2rem 0.2rem',
                              background:"#DCDCDC",
                              borderRadius:"0.5rem",
                              padding:"0 0.2rem 0 0.2rem"
                            }}>
                              <MinusOutlined style={{fontSize:6.8}}/>
                              <div style={{marginLeft:'0.1rem'}}>
                                {item.discount_percentage}
                              </div>
                              <PercentageOutlined />
                            </div>
                            :
                            <></>
                            }
                        </div>
                        <div style={{
                            marginTop:"0.8rem",
                            fontSize:17,
                            color:'#808080'
                        }}>
                            {item.author}
                        </div>
                        <div style={{
                            marginTop:"0.4rem",
                            fontSize:18,
                            color: "black",
                            display: "-webkit-box", 
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical", 
                            overflow: "hidden",
                        }}>
                            {item.title}
                        </div>
                        <div style={{
                            display:'flex',
                            marginTop:"1rem",
                            gap:"0.5rem"
                        }}>
                            {
                            item.average_rating > 0
                            ?
                            <>
                            <Rate allowHalf value={item.average_rating} style={{
                                fontSize:14,
                                color:"orange",
                                marginTop:"0.2rem"
                            }}/>
                            <div style={{
                              borderRight:"0.05rem solid #C8C8C8",
                              height:"0.9rem",
                              marginTop:"0.2rem"
                            }}></div>
                            </>
                            :
                            <></>
                            }
                            <div style={{
                              color:'#808080',
                              fontFamily:"revert",
                              fontSize:15
                            }}>
                              Đã bán {item.sold_quantity}
                            </div>
                        </div>
                      </div>
                      <div style={{borderTop:"0.5px solid #F0F0F0",height:"2rem",marginTop:"auto"}}>
                        <div style={{
                          margin:"0.5rem 0 0 0.5rem",
                          color:'#808080',
                          fontFamily:"revert",
                          fontSize:15
                        }}>
                          Giao thứ 5, 12/29
                        </div>
                      </div>  
                  </div>
                </Link>
                ))
              }
          </div>
          <Pagination 
              style={{
                marginTop:"2rem",
                display:"flex",
                justifyContent:"center"
              }} 
              current={current} 
              onChange={onChangePaginate} 
              total={100} 
          />;
          <SearchModal
             isModalOpen={isModalOpen}
             handleCancel={handleCancel}
             setIsModalOpen={setIsModalOpen}
             fiveStars={fiveStars}
             fourStars={fourStars}
             threeStars={threeStars}
             handleRating={handleRating}
             rating={rating_1}
             setFiveStars={setFiveStars}
             setFourStars={setFourStars}
             setThreeStars={setThreeStars}
             setRating={setRating_1}
             setRatingF={setRating}
          />
        </>
    )
}
export default SearchContent