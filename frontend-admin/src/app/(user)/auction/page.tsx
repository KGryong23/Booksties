import { authOptions } from "@/app/api/auth/auth.options";
import AuctionApp from "@/components/auction/auction.app"
import { sendRequest } from "@/utils/api";
import Button from "antd/es/button/button";
import Result from "antd/es/result";
import { getServerSession } from "next-auth/next";

const Auction = async ({
   searchParams,
}: {
   searchParams: { [key: string]: string | undefined | number | null };
}) => {
   try {
   const session = await getServerSession(authOptions)
   const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/paginate?page=${searchParams.page ?? 1}&limit=${searchParams.limit ?? 6}&searchTerm=${searchParams.searchTerm ?? ''}&orderBy=${searchParams.orderBy ?? ''}&filterBy=${searchParams.filterBy ?? ''}&seller=${searchParams.seller ?? ''}&winner=${searchParams.winner ?? ''}`;
   const res = await sendRequest<IBackendRes<IPaginationAuction<IAuction>>>({
        url: apiUrl,
        method: "GET",
        headers: {
         Authorization: `Bearer ${session?.access_token}`, 
        },
        nextOption: {
           next: { tags: ['auctions'] },
           cache: 'no-store',
        }
   });
   return <AuctionApp auctions={res.data.items}/>
} catch (error) {
   return (
     <Result
       style={{height:620}}
       status="500"
       title="500"
       subTitle="Xin lỗi, bạn không có quyền truy cập trang này !!!"
       extra={<Button type="primary" href="/">Back Home</Button>}
     />
   );
}
}
export default Auction