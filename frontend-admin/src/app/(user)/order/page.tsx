import OrderApp from "@/components/order/order.app";
import { sendRequest } from "@/utils/api";

const Order = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined | number | null };
}) => {
    const res = await sendRequest<IBackendRes<IPaginationGo<IOrder>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/order-service/api/v1/Order/paginate?page=${searchParams.page ?? 1}&limit=${searchParams.limit ?? 5}&field=${searchParams.field ?? "created_at"}&order=${searchParams.order ?? "desc"}&user_id=${searchParams.user_id ?? "empty"}&status=${searchParams.status ?? "empty"}`,
        method: "GET",
        nextOption: {
            next: { tags: ['orders'] },
        }
    });
    return(
        <>
           <OrderApp
              orders={res.data.data}
           />
        </>
    )
}
export default Order