export {};
declare global{
     interface IBackendRes<T> {
        code:number,
        message:string,
        data: T
     }

     interface IProduct {
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
        discount_percentage: number,
        product_type: number,
        is_active: boolean,
        original_owner_id: string,
        created_at: string,
        updated_at: string
     }

     interface IPaginationGo<T> {
        page: number,
        limit: number,
        count: number,
        data: T[]
     }

     interface IGenre{
        id: string,
        name: string
     }

     interface ICreateProduct{
        title: string,
        author: string,
        publisher: string,
        publication_year: number,
        page_count: number,
        dimensions: string,
        cover_type: string,
        price:number,
        description: string,
        image_url: string,
        initialize_warehouse:number,
        genre_ids: string
     }

     interface IInventory{
        inventory_id: string,
        product_id: string,
        quantity: number
     }

     interface ITransaction{
        transaction_id: string,
        transaction_type: string,
        quantity: number,
        reason: string,
        created_at: string
     }
     interface ISalesRevenue{
        labels: string[],
        data: number[]
     }
     interface ISalesData{
        today_sales: number,
        current_month_sales: number,
        percentage_change: number,
        total_sales: number
     }
     interface IAuctionSummary{
        todaySales: number,
        currentMonthSales: number,
        lastMonthSales: number,
        percentageChange: number,
        totalSales: number
     }
     interface IAuctionLastSixMonth{
        labels: string[],
        data: number[]
     }
     interface IAuctionTop{
        topAuctions: IAuction[],
        totalAuctions: number,
        finishedAuctions: number,
        reserveNotMetAuctions: number
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
      interface IProductTop{
         id: string,
         title: string,
         sold_quantity: number,
         average_rating: number
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
     interface IUserName{
         email:string
     }
     interface IPaginationAuction<T> {
         pageIndex: number,
         pageSize: number,
         count: number,
         items: T[]
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
      createAt: string
   }
   interface IUser{
      userId: string,
      email: string,
      password: string,
      authMethod: string,
      isActive: boolean,
      updatedAt: string,
      address: string,
      reputation: number,
      roleName: string
   }
   interface IRole{
      roleId: string,
      roleName: string
   }
   interface ICreateUser{
      email:string,
      password:string,
      role:string
   }
   interface IRoleDetail{
      roleId:string,
      roleName: string,
      createdAt: string,
      updatedAt: string
   }
   interface IPermission{
      permissionId: string,
      permissionName: string
      description:string
      createdAt:string
   }
   interface IRoleChanged{
      roleId : string
   }
   interface IUserRoleChanged{
      userId : string
   }
}