import HomePageContent from "@/components/home/home.page.content";
import { sendRequest } from "@/utils/api"

const Home = async ()=> {
    const genres = await sendRequest<IBackendRes<IGenre[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/catalog-service/api/v1/Genre/`,
      method: "GET",
      nextOption: {
        cache: 'no-store',
      }
    });
    return (
      <>
         <HomePageContent 
            genres={genres.data ?? []}
         />
      </>
    );
}
export default Home