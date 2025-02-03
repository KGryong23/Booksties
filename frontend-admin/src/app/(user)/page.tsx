import DashboardApp from "@/components/dashboard/dashboard.app"
import { sendRequest } from "@/utils/api";

const Home = async () => {
    const res = await sendRequest<IBackendRes<ISalesRevenue>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/order-service/api/v1/Order/sales`,
        method: "GET",
        nextOption: {
          cache: 'no-store',
        }
    });
    const res_1 = await sendRequest<IBackendRes<ISalesData>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/order-service/api/v1/Order/sales/data`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
    });
    const res_2 = await sendRequest<IBackendRes<IAuctionSummary>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/bidding-service/api/v1/Bid/summary`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
    });
    const res_3 = await sendRequest<IBackendRes<IAuctionLastSixMonth>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/bidding-service/api/v1/Bid/six`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
    });
    const res_4 = await sendRequest<IBackendRes<IAuctionTop>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auction-service/api/v1/Auction/summary`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
    });
    const res_5 = await sendRequest<IBackendRes<IProductTop[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog-service/api/v1/Product/top`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
    });
    return (
      <>
         <DashboardApp 
           salesRevenue={res.data}
           salesData={res_1.data}
           auctionSummary={res_2.data}
           lastSixMonth={res_3.data}
           auctionTop={res_4.data}
           productTop={res_5.data}
         />
      </>
    )
  }
export default Home