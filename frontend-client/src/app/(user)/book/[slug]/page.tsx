import ProductDetails from "@/components/product/product.details";
import { sendRequest } from "@/utils/api";

const BookDetail= async ({ params }: { params: { slug: string } })=>{
    const product = await sendRequest<IBackendRes<IProduct>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog-service/api/v1/Product/${params.slug}`,
        method: "GET",
        nextOption: {
          cache: 'no-store',
        }
    });
    const reviews = await sendRequest<IBackendRes<IReview[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/review-service/api/v1/Review/${params.slug}`,
        method: "GET",
        nextOption: {
          next: { tags: ['reviews'] },
        }
    });
    return(
        <>
           <ProductDetails 
             product={product.data}
             reviews={reviews.data ?? []}
           />
        </>
    )
}
export default BookDetail