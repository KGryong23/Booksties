import SearchApp from "@/components/search/search.app";
import { sendRequest } from "@/utils/api";

const Search = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined | number };
})=>{
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/search-service/api/v1/Search/paginate?page=${searchParams.page ?? 1}&limit=${searchParams.limit ?? 12}&min_rating=${searchParams.min_rating ?? 0}&min_price=${searchParams.min_price ?? 0}&max_price=${searchParams.max_price ?? 0}&sort_by=${searchParams.sort_by ?? 'empty'}&query=${searchParams.query ?? 'empty'}`;
  const products = await sendRequest<IBackendRes<IPagination<IProductNotDetail>>>({
    url: apiUrl,
    method: "GET",
    nextOption: {
      cache: 'no-store',
    }
  });
    return(
        <>
            <SearchApp products={products.data.data ?? []}/>
        </>
    )
}
export default Search