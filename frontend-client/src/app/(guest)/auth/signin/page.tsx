import { authOptions } from "@/app/api/auth/auth.options"
import LoginForm from "@/components/auth/auth.signin"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

const Signin = async ()=>{
    const session = await getServerSession(authOptions)
    if(session){
      redirect("/")
    }
    return(
        <>
          <LoginForm/>
        </>
    )
}
export default Signin