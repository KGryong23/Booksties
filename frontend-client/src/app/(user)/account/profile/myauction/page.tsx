import { authOptions } from "@/app/api/auth/auth.options"
import MyAuctionApp from "@/components/profile/myauction.app"
import { sendRequest } from "@/utils/api"
import Button from "antd/es/button/button"
import Result from "antd/es/result"
import { getServerSession } from "next-auth/next"

const MyAuction=async({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined | number | null };
})=>{
  try {
    const session = await getServerSession(authOptions)
    const result = await sendRequest<IBackendRes<IPaginationAuction<IAuction>>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/paginate/${session?.user.userId}?page=${searchParams.page ?? 1}&limit=${searchParams.limit ?? 5}&filterBy=${searchParams.filterBy}`,
          method: "GET",
          nextOption: {
            cache: 'no-store',
            next: { tags: ['auctionbyuser'] },
          }
    })
    return <MyAuctionApp auctions={result.data ? result.data.items : []}/>
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
export default MyAuction