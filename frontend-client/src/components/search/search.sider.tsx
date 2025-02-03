'use client'

const imageList = [
  "/hihi_6.jpg",
  "/hihi_5.jpg",
];

const SearchSider=()=>{
    return(
      <div style={{
        display:"flex",
        flexDirection:"column",
        gap:"0.5rem",
        margin:"2.2rem 0rem 0 0"
      }}>
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
    )
}
export default SearchSider