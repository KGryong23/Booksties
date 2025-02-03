'use server'

import { getServerSession } from "next-auth/next"
import { sendRequest } from "../api"
import { authOptions } from "@/app/api/auth/auth.options"
import { revalidateTag } from "next/cache"
import { JWT } from "next-auth/jwt"

export async function SignupUser(email :string,password :string) {
    const result = await sendRequest<IBackendRes<boolean>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/signup`,
        method: "POST",
        body:{
          Email:email,
          Password:password,
          Auth:"credentials",
          Role:"User"
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
        Authorization: `Bearer ${session?.access_token}`, 
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function GetPaginationProductsSold() {
  const result = await sendRequest<IBackendRes<boolean>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog-service/api/v1/Product/home?Page=1&Limit=5&Rating=0&Field=price&Order=asc`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function UpdateProduct(record :IProduct) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<string>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog-service/api/v1/Product/update`,
      method: "POST",
      headers: {
        'Authorization': `Bearer ${session?.access_token}`, 
      },
      body:{
          id: record.id,
          title: record.title,
          author: record.author,
          publisher: record.publisher,
          publication_year: record.publication_year,
          page_count: record.page_count,
          dimensions: record.dimensions,
          cover_type: record.cover_type,
          price: record.price,
          description: record.description,
          image_url:record.image_url,
          discount_percentage: record.discount_percentage,
          product_type: record.product_type,
          is_active: record.is_active
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag('products')
  return result
}

export async function DeleteProduct(id :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<string>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog-service/api/v1/Product/delete/${id}`,
      method: "GET",
      headers: {
        'Authorization': `Bearer ${session?.access_token}`, 
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag('products')
  return result
}

export async function CreateProduct(record :ICreateProduct) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<string>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog-service/api/v1/Product/save`,
      method: "POST",
      headers: {
        Authorization : `Bearer ${session?.access_token}`, 
      },
      body:{
          title: record.title,
          author: record.author,
          publisher: record.publisher,
          publication_year: record.publication_year,
          page_count: record.page_count,
          dimensions: record.dimensions,
          cover_type: record.cover_type,
          price: record.price,
          description: record.description,
          image_url: record.image_url,
          product_type: 1,
          is_active: false,
          initialize_warehouse:record.initialize_warehouse,
          original_owner_id: session?.user.userId,
          genre_ids: [record.genre_ids]
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag('products')
  return result
}

export async function GetGenre(id :string) {
  const result = await sendRequest<IBackendRes<IGenre>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog-service/api/v1/Genre/product/${id}`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function UpdateProductGenre(productId :string,genreId :string) {
  const result = await sendRequest<IBackendRes<string>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog-service/api/v1/Genre/`,
      method: "POST",
      body:{
          product_id:productId,
          genre_id:genreId
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function GetInventory(productId :string) {
  const result = await sendRequest<IBackendRes<IInventory>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory-service/api/v1/Inventory/${productId}`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function GetTransaction(inventoryId :string) {
  const result = await sendRequest<IBackendRes<ITransaction[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory-service/api/v1/Inventory/transaction/${inventoryId}`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function UpdateInventory(productId :string,type :string,quantity :number,reason :string) {
  const result = await sendRequest<IBackendRes<string>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/inventory-service/api/v1/Inventory/update`,
      method: "POST",
      body:{
        product_id:productId,
        transaction_type:type,
        quantity:quantity,
        reason:reason
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function UpdateStatusOrder(orderId :string,status :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<string>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/order-service/api/v1/Order/update`,
      method: "POST",
      headers: {
        Authorization : `Bearer ${session?.access_token}`, 
      },
      body:{
        order_id:orderId,
        Status:status
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag('orders')
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

export async function GetUserNameById(userId :string) {
  const result = await sendRequest<IBackendRes<IUserName>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/User/email/${userId}`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
  })
  return result
}

export async function UpdateStatusAuction(acutionId :string,status :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<boolean>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/update/status`,
      method: "POST",
      headers: {
        Authorization : `Bearer ${session?.access_token}`, 
      },
      body:{
        id:acutionId,
        status:status
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag('auctions')
  return result
}

export async function UpdateTimeAuction(auctionId :string,time :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<boolean>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/update/time`,
      method: "POST",
      headers: {
        Authorization : `Bearer ${session?.access_token}`, 
      },
      body:{
        id:auctionId,
        time:time
      },
      nextOption: {
        cache: 'no-store',
      }
  })
  revalidateTag('auctions')
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

export async function CancelBid(bidId :string) {
  const result = await sendRequest<IBackendRes<boolean>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/bidding-service/api/v1/Bid/delete/${bidId}`,
    method: "POST",
    nextOption: {
        cache: 'no-store',
      }
  });
  revalidateTag('auctions')
  return result
}

export async function CancelAuction(auctionId :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<boolean>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/cancel/${auctionId}`,
    method: "POST",
    headers: {
      Authorization : `Bearer ${session?.access_token}`, 
    },
    nextOption: {
        cache: 'no-store',
      }
  });
  revalidateTag('auctions')
  return result
}

export async function EndAuction(auctionId :string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<boolean>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/end/${auctionId}`,
    method: "POST",
    headers: {
      Authorization : `Bearer ${session?.access_token}`, 
    },
    nextOption: {
        cache: 'no-store',
      }
  });
  revalidateTag('auctions')
  return result
}

export async function UpdateUser(userId :string,address :string | null,isActive :boolean,roleId :string,reputation :number) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<boolean>>({
    url:`${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/User/update`,
    method:"POST",
    headers: {
      Authorization : `Bearer ${session?.access_token}`, 
    },
    body:{
        userId: userId,
        address: address,
        isActive: isActive,
        roleId: roleId,
        reputation: reputation
    },
    nextOption: {
        cache: 'no-store',
      }
  });
  revalidateTag('users')
  return result
}

export async function CreateUser(user :ICreateUser) {
  const result = await sendRequest<IBackendRes<boolean>>({
    url:`${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/signup`,
    method:"POST",
    body:{
        email:user.email,
        password:user.password,
        auth:"credentials",
        role:user.role
    },
    nextOption: {
        cache: 'no-store',
      }
  });
  revalidateTag('users')
  return result
}

export async function DeleteUser(userId: string) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<boolean>>({
    url:`${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/User/delete/${userId}`,
    method:"POST",
    headers: {
      Authorization : `Bearer ${session?.access_token}`, 
    },
    nextOption: {
        cache: 'no-store',
      }
  });
  revalidateTag('users')
  return result
}

export async function GetPermissionWithRole(roleId: string) {
  const result = await sendRequest<IBackendRes<IPermission[]>>({
    url:`${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/Permission/${roleId}`,
    method:"GET",
    nextOption: {
        cache: 'no-store',
      }
  });
  return result
}

export async function DeleteRole(roleId: string) {
  const result = await sendRequest<IBackendRes<boolean>>({
    url:`${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/Role/${roleId}`,
    method:"POST",
    nextOption: {
        cache: 'no-store',
      }
  });
  revalidateTag('roles')
  return result
}

export async function DeletePermissionRole(roleId: string, permissionId :string) {
  const result = await sendRequest<IBackendRes<boolean>>({
    url:`${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/Permission/role/delete`,
    method:"POST",
    body:{
       roleId:roleId,
       permissionId:permissionId
    },
    nextOption: {
        cache: 'no-store',
      }
  });
  revalidateTag('roles')
  return result
}

export async function UpdateRole(roleId: string, roleName :string) {
  const result = await sendRequest<IBackendRes<boolean>>({
    url:`${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/Role/update`,
    method:"POST",
    body:{
       id:roleId,
       roleName:roleName
    },
    nextOption: {
        cache: 'no-store',
      }
  });
  revalidateTag('roles')
  return result
}

export async function AddRole(roleName :string) {
  const result = await sendRequest<IBackendRes<boolean>>({
    url:`${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/Role/add`,
    method:"POST",
    body:{
       roleName:roleName
    },
    nextOption: {
        cache: 'no-store',
      }
  });
  revalidateTag('roles')
  return result
}

export async function GetUnassignedPermissions(roleId: string) {
  const result = await sendRequest<IBackendRes<IPermission[]>>({
    url:`${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/Permission/not/${roleId}`,
    method:"GET",
    nextOption: {
        cache: 'no-store',
      }
  });
  return result
}

export async function AddRolePermission(roleId :string,permissionIds :string[]) {
  const result = await sendRequest<IBackendRes<boolean>>({
    url:`${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/Role/permission`,
    method:"POST",
    body:{
      roleId: roleId,
      permissionIds: permissionIds
    },
    nextOption: {
        cache: 'no-store',
      }
  });
  return result
}

export async function RefreshToken() {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<JWT>>({
    url:`${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/Role/permission`,
    method:"POST",
    headers: {
      Authorization: `Bearer ${session?.access_token}`, 
    },
    nextOption: {
        cache: 'no-store',
      }
  });
  return result
}