import RoleApp from "@/components/role/role.app"
import { sendRequest } from "@/utils/api";

const Role = async({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined | number | null };
}) => {
    const res = await sendRequest<IBackendRes<IPaginationAuction<IRoleDetail>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/api/v1/Role/paginate?page=${searchParams.page ?? 1}&limit=${searchParams.limit ?? 5}&field=${searchParams.field ?? 'role_id'}&roleName=${searchParams.roleName ?? 'empty'}&order=${searchParams.order ?? 'asc'}`,
        method: "GET",
        nextOption: {
            cache: 'no-store',
            next: { tags: ['roles'] },
        }
    });
    return <RoleApp roles={res.data.items}/>
}
export default Role