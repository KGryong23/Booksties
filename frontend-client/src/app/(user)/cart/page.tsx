import { authOptions } from "@/app/api/auth/auth.options";
import CartApp from "@/components/cart/cart.app";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

const Cart=async()=>{
  const session = await getServerSession(authOptions)
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/basket-service/api/v1/Basket/user/${session?.user.userId}`;
  const basketitems = await sendRequest<IBackendRes<IBasketItems[]>>({
    url: apiUrl,
    method: "GET",
    nextOption: {
      next: { tags: ['basketitems'] },
    }
  });
   if (!session) {
    redirect("/")
   }
    return(
        <>
           <CartApp basketItems={basketitems.data ?? []}/>
        </>
    ) 
}
export default Cart