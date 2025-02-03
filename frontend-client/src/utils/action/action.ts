'use server'

import { getServerSession } from "next-auth/next"
import { sendRequest, sendRequestFile } from "../api"
import { authOptions } from "@/app/api/auth/auth.options"
import { revalidateTag } from "next/cache"

export async function SignupUser(email :string,password :string) {
    const result = await sendRequest<IBackendRes<boolean>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/signup`,
        method: "POST",
        body:{
          email:email,
          password:password,
          auth:"credentials",
          role:"User"
        },
        nextOption: {
          cache: 'no-store',
        }
    })
    return result
}

export async function SignOutUser(id :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<boolean>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/signout/${id}`,
      method: "GET",
      headers: {
        'Authorization': `Bearer ${session?.access_token}`, 
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}


export async function GetPaginationProductsNotDetail(
  limit :number | null,min_rating:number | null,min_price :number | null,
  max_price :number | null, sort_by :string | null,genre :string | null
){
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/search-service/api/v1/Search/home?page=1&limit=${limit}&min_rating=${min_rating ?? 0}&min_price=${min_price ?? 0}&max_price=${max_price ?? 0}&sort_by=${sort_by ?? 'empty'}&genre=${genre ?? 'empty'}`;
  const products = await sendRequest<IBackendRes<IPagination<IProductNotDetail>>>({
    url: apiUrl,
    method: "GET",
    nextOption: {
      cache: 'no-store',
    }
  });
  return products.data.data
}

export async function CreateQuantityBasket(productid :string,quantity :number) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<string>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/basket-service/api/v1/Basket/save`,
      method: "POST",
      body:{
         user_id:session?.user.userId,
         product_id:productid,
         quantity:quantity
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag("basketitems")
  return result
}

export async function RemoveBasketItemByUserId(productid :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<string>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/basket-service/api/v1/Basket/remove`,
      method: "POST",
      body:{
         user_id:session?.user.userId,
         product_id:productid,
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag("basketitems")
  return result
}

export async function UpdateQuantityBasket(productid :string,quantity :number) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<string>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/basket-service/api/v1/Basket/update`,
      method: "POST",
      body:{
         user_id:session?.user.userId,
         product_id:productid,
         quantity:quantity
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag("basketitems")
  return result
}

export async function AddReviewByUser(productid :string,rating :number,comment :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<string>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/review-service/api/v1/Review/add`,
      method: "POST",
      headers: {
        'Authorization': `Bearer ${session?.access_token}`, 
      },
      body:{
        product_id : productid,
        user_id : session?.user.userId,
        user_name:session?.user.email,
        rating : rating,
        comment : comment
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag('reviews')
  return result
}

export async function handleCheckStock(productid :string,quantity :number) {
  const result = await sendRequest<IBackendRes<string>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory-service/api/v1/Inventory/check`,
      method: "POST",
      body:{
         product_id:productid,
         quantity:quantity
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function CreateOrders(total_amount :number,orderItems :IOrderItems[]) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<string | string[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/order-service/api/v1/Order/saves`,
      method: "POST",
      headers: {
        'Authorization': `Bearer ${session?.access_token}`, 
      },
      body:{
        user_id : session?.user.userId,
        total_amount:total_amount,
        order_items : orderItems,
        full_address:session?.user.address
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag('orderbyuser')
  return result
}

export async function CreateOrder(total_amount :number,orderItems :IOrderItems[]) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<string | string[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/order-service/api/v1/Order/save`,
      method: "POST",
      headers: {
        'Authorization': `Bearer ${session?.access_token}`, 
      },
      body:{
        user_id : session?.user.userId,
        total_amount:total_amount,
        order_items : orderItems,
        full_address:session?.user.address
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag('orderbyuser')
  return result
}

export async function PlaceBid(auctionId :string,amount :number) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<string>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/bidding-service/api/v1/Bid`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`, 
      },
      body:{
        auctionId:auctionId,
        bidder:session?.user.email,
        amount:amount
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag('auction')
  revalidateTag('placebid')
  return result
}

export async function GetBalance() {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<number>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/Wallet/${session?.user.userId}`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function GetOrderByUser() {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<IOrder[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/order-service/api/v1/Order/${session?.user.userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.access_token}`, 
      },
      nextOption: {
        next: { tags: ['orderbyuser'] },
      }
  })
  return result
}

export async function OrderCancell(orderId :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<string>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/order-service/api/v1/Order/cancell`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`, 
      },
      body:
      {
        order_id:orderId,
        status:"cancelled"
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag('orderbyuser')
  return result
}

export async function GetAddress() {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<IAddress>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/User/address/${session?.user.userId}`,
      method: "GET",
      nextOption: {
        next: { tags: ['useraddress'] },
        cache: 'no-store',
      }
  })
  return result
}

export async function UdpateOrderAddress(orderId :string,fullAddress :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<boolean>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/order-service/api/v1/Order/update/address`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`, 
      },
      body:
      {
        order_id:orderId,
        full_address:fullAddress
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag('orderbyuser')
  return result
}

export async function UdpateUserAddress(address :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<boolean>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/User/address`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`, 
      },
      body:
      {
        id:session?.user.userId,
        address:address
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag('useraddress')
  return result
}

export async function GetAuctionByUser() {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<IAuction[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/user/${session?.user.userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.access_token}`, 
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function GetWinBidByUser() {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<IAuction[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/winbid/${session?.user.userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.access_token}`, 
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function GetOrderItemsById(orderId :string) {
  const result = await sendRequest<IBackendRes<IOrderItem[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/order-service/api/v1/Order/items/${orderId}`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function GetBidsForAuction(auctionId :string) {
  const result = await sendRequest<IBackendRes<IBid[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/bidding-service/api/v1/Bid/${auctionId}`,
    method: "GET",
    nextOption: {
        cache: 'no-store',
      }
  });
  return result
}

export async function CreateAuction(values :ICreateAuction,imageUrl :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<number>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/add`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.access_token}`, 
    },
    body:{
      title: values.title,
      author: values.author,
      publisher: values.publisher,
      year: values.year,
      pageCount: values.pageCount,
      imageUrl: imageUrl,
      description: values.description,
      reservePrice: values.reservePrice,
      sellerId: session?.user.userId,
      seller: session?.user.email,
      sellerAddress: session?.user.address,
    },
    nextOption: {
        cache: 'no-store',
      }
  });
  revalidateTag('auctionbyuser')
  return result
}

export async function uploadFile(file:any) {
  const result = await sendRequestFile<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/upload-file`,
      method: "POST",
      body: file ,
      nextOption: {
          cache: 'no-store',
      }
  })
  return result
}

export async function DeleteAuctionByUser(id :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<boolean>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/delete/user/${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.access_token}`, 
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag('auctionbyuser')
  return result
}

export async function GetTransactionBySeller(id :string) {
  const result = await sendRequest<IBackendRes<ITransaction>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/transaction/${id}`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function UpdateTransactionBySeller(id :string,status :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<boolean>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/update/status/seller`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`, 
      },
      body:
      {
        id:id,
        status:status
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function UpdateTransactionByWinner(id :string,status :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<boolean>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/update/transaction`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`, 
      },
      body:
      {
        id:id,
        status:status
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag('auctionbywinner')
  return result
}

export async function UpdateTransactionAddressByWinner(id :string,address :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<boolean>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/update/transaction/address`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`, 
      },
      body:
      {
        id:id,
        address:address
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag('auctionbywinner')
  return result
}

export async function GetBidsForUser() {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<IBid[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/bidding-service/api/v1/Bid/user/${session?.user.userId}`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function GetTransactionsForUser() {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<ITransaction[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/Wallet/transaction/${session?.user.userId}`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function GetAllTitle() {
  const result = await sendRequest<IBackendRes<ITitle[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog-service/api/v1/Product/title`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function GetAllTitleAuction() {
  const result = await sendRequest<IBackendRes<ITitle[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/title`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}