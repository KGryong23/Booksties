import { authOptions } from "@/app/api/auth/auth.options"
import OrderApp from "@/components/profile/order.app"
import { sendRequest } from "@/utils/api"
import Button from "antd/es/button/button"
import Result from "antd/es/result"
import { getServerSession } from "next-auth/next"

const ProfileOrder= async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined | number | null };
})=>{
  try {
    const session = await getServerSession(authOptions)
    const res = await sendRequest<IBackendRes<IPagination<IOrder>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/order-service/api/v1/Order/paginate/user?page=${searchParams.page ?? 1}&limit=${searchParams.limit ?? 5}&field=${searchParams.field ?? "created_at"}&order=${searchParams.order ?? "desc"}&status=${searchParams.status ?? ""}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`, 
      },
      body:{
          user_id:session?.user.userId
      },
      nextOption: {
          next: { tags: ['orderbyuser'] },
      }
    });
    console.log(session?.user.userId)
    return<OrderApp orders={res.data.data} />
  } catch (error) {
    return (
      <Result
        style={{height:"20rem"}}
        status="500"
        title="500"
        subTitle="Đã có lỗi xảy ra!!!"
        extra={<Button type="primary" href="/">Back Home</Button>}
      />
    );
}
}
export default ProfileOrder
