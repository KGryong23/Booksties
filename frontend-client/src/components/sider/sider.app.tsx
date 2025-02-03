'use client'

import { useState } from "react";

interface IProps {
    genres: IGenre[]
    setGenre:(v: any)=>void
}

const genreItemStyle = {
    padding: "0.625rem 0.9375rem", 
    cursor: "pointer",
    backgroundColor: "white",
    fontSize: "0.875rem", 
    color: "#333",
    fontFamily: "Arial, sans-serif",
    transition: "background-color 0.3s ease",
    borderRadius: "0.3125rem", 
};

const genreItemHoverStyle = {
    ...genreItemStyle,
    backgroundColor: "#e6f7ff",
};



const imageList = [
    "/hihi_6.jpg",
    "/hihi_5.jpg",
    "/hihi_3.jpg",
  ];

const SiderApp = (data: IProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <>
           <div style={{
                margin:"0rem 3rem 0 0",
                width:'100%',
                background:"white",
                borderRadius: '0.5rem',
                height:"73vh"
           }}>
                <h2
                onClick={()=>data.setGenre({id:null,name:null})}
                style={{
                    fontSize: "1.0625rem", 
                    fontWeight: "bold",
                    color: "#333",
                    fontFamily: "Arial, sans-serif",
                    borderBottom: "1px solid #f0f0f0",
                    padding: "1.2rem 0 0.8rem 0.9rem",cursor:"pointer"
                }}>
                    Khám phá theo thể loại
                </h2>
                <div style={{ margin: "0.625rem 0.625rem 0 0.9375rem" }}> 
                    {data.genres.map((item, index) => (
                        <div
                            key={index}
                            style={hoveredIndex === index ? genreItemHoverStyle : genreItemStyle}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={()=>data.setGenre({id:item.id,name:item.name})}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:"1rem"}}>
                {
                    imageList.map((item,index)=>(
                        <div key={index}>
                             <img src={`${item}`} style={{
                                width:"100%",
                                height:"60vh",
                                borderRadius: '0.5rem'
                             }}/>
                        </div>    
                    ))
                }
            </div> 
        </>
    );
}

export default SiderApp;
