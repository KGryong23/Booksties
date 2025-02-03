import AuctionsApp from "@/components/auctions/auctions.app";
import { sendRequest } from "@/utils/api";
const Auctions = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined | number | null };
}) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/search?page=${searchParams.page ?? 1}&limit=${searchParams.limit ?? 8}&searchTerm=${searchParams.searchTerm ?? ''}&orderBy=${searchParams.orderBy ?? ''}&filterBy=${searchParams.filterBy ?? ''}&seller=${searchParams.seller ?? ''}&winner=${searchParams.winner ?? ''}`;
    const res = await sendRequest<IBackendRes<IPaginationAuction<IAuction>>>({
        url: apiUrl,
        method: "GET",
        nextOption: {
          cache: 'no-store',
        }
    });
    return(
        <>
          <AuctionsApp auctions={res.data}/>
        </>
    )
}
export default Auctions