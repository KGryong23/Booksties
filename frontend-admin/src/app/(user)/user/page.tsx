import { authOptions } from "@/app/api/auth/auth.options";
import UserApp from "@/components/user/user.app"
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth/next";

const User = async({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined | number | null };
}) => {
    const res = await sendRequest<IBackendRes<IPaginationAuction<IUser>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/User/paginate?page=${searchParams.page ?? 1}&limit=${searchParams.limit ?? 5}&email=${searchParams.email ?? "empty"}&authMethod=${searchParams.authMethod ?? "empty"}&field=${searchParams.field ?? "user_id"}&order=${searchParams.order ?? "asc"}`,
        method: "GET",
        nextOption: {
            cache: 'no-store',
            next: { tags: ['users'] },
        }
    });
    const res_1 = await sendRequest<IBackendRes<IRole[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/Role/all`,
        method: "GET",
        nextOption: {
            cache: 'no-store',
        }
    });
    return(<UserApp users={res.data.items} roles={res_1.data}/>
    )
}
export default User