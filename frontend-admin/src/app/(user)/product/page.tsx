import { authOptions } from "@/app/api/auth/auth.options";
import ProductApp from "@/components/product/product.app"
import { sendRequest } from "@/utils/api";
import Button from "antd/es/button/button";
import Result from "antd/es/result";
import { getServerSession } from "next-auth/next";

const Product = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined | number | null };
})=>{
try {
    const session = await getServerSession(authOptions)
    const products = await sendRequest<IBackendRes<IPaginationGo<IProduct>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog-service/api/v1/Product/paginate?page=${searchParams.page ?? 1}&limit=${searchParams.limit ?? 6}&rating=${searchParams.rating ?? 0}&field=${searchParams.field ?? 'id'}&order=${searchParams.order ?? 'asc'}&genre_id=${searchParams.genre_id ?? 'empty'}&search_term=${searchParams.search_term ?? 'empty'}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${session?.access_token}`, 
        },
        nextOption: {
            next: { tags: ['products'] },
        }
    });
    const genres = await sendRequest<IBackendRes<IGenre[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog-service/api/v1/Genre/`,
        method: "GET",
        nextOption: {
            cache: 'no-store',
        }
    });
    return <ProductApp 
               products={products.data.data ?? []}
               genres={genres.data}
           />
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
export default Product