import AuctionApp from "@/components/auction/auction.app";
import { sendRequest } from "@/utils/api";

const Auction = async ({ params }: { params: { slug: string } }) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/${params.slug}`;
    const res = await sendRequest<IBackendRes<IAuction>>({
        url: apiUrl,
        method: "GET",
        nextOption: {
            cache: 'no-store',
          }
    });
    const bids = await sendRequest<IBackendRes<IBid[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/bidding-service/api/v1/Bid/${params.slug}`,
        method: "GET",
        nextOption: {
            cache: 'no-store',
          }
    });
    console.log(bids)
    return(
        <>
          <AuctionApp auction={res.data} bids={bids.data}/>
        </>
    )
}
export default Auction