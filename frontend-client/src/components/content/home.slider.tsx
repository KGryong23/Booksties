'use client'

import Slider, { Settings } from "react-slick";
import RightOutlined  from '@ant-design/icons/RightOutlined';
import LeftOutlined  from '@ant-design/icons/LeftOutlined';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button from "antd/es/button";

const imageList = [
  "/2398.png",
  "/366.png",
  "/2389.png",
  "/3703.png",
  "/3715.png"
];

const HomeSlider=()=>{
    const NextArrow=(props: any)=>{
        return(
          <Button
             onClick={()=>{props.onClick()}}
             shape="circle"
             style={{
                position:'absolute',
                right:'0.5rem',
                top: "40%",
                zIndex: 2,
                width: 45,
                height:44,
                background: "#606060",
                border:'0.5rem solid #606060'
                }}
              icon={<RightOutlined style={{color:'white',fontSize:"1rem"}}/>}
          />
        )
      }
      const PrevArrow=(props: any)=>{
        return(
          <Button
            onClick={()=>{props.onClick()}}
            shape="circle"
            style={{
              position:'absolute',
              left:'0.5rem',
              top: "40%",
              zIndex: 2,
              width: 45,
              height:44,
              background:"#606060",
              border:'0.5rem solid #606060'
            }}
            icon={<LeftOutlined style={{color:'white',fontSize:"1rem"}}/>}
          />  
        )
      }
      const settings : Settings = {
        dots: false,
        infinite: true,
        speed: 400,
        slidesToShow: 1,  
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow/>, 
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true
                }
            }
        ]
    };
    return(
       <Slider {...settings}>
            {imageList.map((src,index)=> (
               <div key={index}>
                  <img src={`${src}`} style={{width:'100%', height:"38vh",borderRadius: '0.5rem',}}/>
               </div>
            ))}
       </Slider> 
    )
}
export default HomeSlider