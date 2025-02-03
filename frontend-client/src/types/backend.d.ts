export {};
declare global{
     interface IBackendRes<T> {
        code:number,
        message:string,
        data: T
     }
     interface IPagination<T> {
        page: number,
        limit: number,
        count: number,
        data: T[]
     }
     interface IPaginationAuction<T> {
      pageIndex: number,
      pageSize: number,
      count: number,
      items: T[]
     }
     interface IProduct{
        id: string,
        title: string,
        author: string,
        publisher: string,
        publication_year: number,
        page_count: number,
        dimensions: string,
        cover_type: string,
        price: number,
        description: string,
        image_url: string,
        sold_quantity: number,
        average_rating: number,
        quantity_evaluate: number,
        discount_percentage: number
     }
     interface IProductNotDetail {
        id: string,
        title: string,
        author: string,
        price: number,
        image_url: string,
        sold_quantity: number,
        average_rating: number,
        discount_percentage: number
     }
     
     interface IGenre{
        id:string | null,
        name:string | null
     }

     interface IBasketItems {
       id: string,
       title: string,
       author: string,
       discount_percentage: number,
       image_url: string,
       quantity: number,
       price: number
     }

     interface IReview{
       review_id: string,
       user_name: string,
       rating: number,
       comment: string,
       updated_at: string
     }
     
     interface IOrderItems {
       product_id : string,
       quantity : number,
       price : number
     }

     interface IAuction {
       id: string,
       reservePrice: number,
       sellerId: string,
       seller: string,
       sellerAddress: string,
       winnerId: string,
       winner: string,
       soldAmount: number,
       currentHighBid: number,
       createdAt: string,
       updatedAt: string,
       auctionEnd: string,
       status: string,
       title: string,
       author: string,
       publisher: string,
       year: number,
       pageCount: number,
       imageUrl: string,
       description: string
    }
    interface IBid{
       id: string,
       auctionId: string,
       bidderId:string,
       bidder: string,
       amount: number,
       status: string,
       createdAt: string
    }
    interface IOrder{
      order_id: string,
      userId: string,
      status: string,
      total_amount: number,
      created_at: string,
      full_address: string
   }

   interface IOrderItem{
         id: string,
         title: string,
         author: string,
         image_url: string,
         quantity: number,
         price: number
   }
   interface IAddress{
       address: string,
       reputation: number
   }
   interface ICreateAuction{
       title: string,
       author: string,
       publisher: string,
       year: number,
       pageCount: number,
       description: string,
       reservePrice: number,
   }
   interface ITransaction{
       status: string,
       address: string
   }
   interface IAuctionWinner{
       id: string,
       reservePrice: string,
       sellerId: string,
       seller: string,
       sellerAddress: string,
       soldAmount: string,
       auctionEnd: string,
       title: string,
       author: string,
       publisher: string,
       year: number,
       pageCount: number,
       imageUrl: string,
       description: string,
       transactionStatus: string,
       shippingAddress: string
   }
   interface ITransaction{
       transactionId: string,
       amount: number,
       description: string,
       createdAt: string
   }
   interface ITitle{
       title: string
   }
}