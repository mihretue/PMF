'use server'
import { cookies } from 'next/headers'
async function DeleteCookies() {
  (await cookies()).delete("sessionid")
  ;(await cookies()).delete("csrftoken")
  ;(await cookies()).delete("userInfo")
  ;(await cookies()).delete("access_token")
  ;(await cookies()).delete("user_data")
  ;(await cookies()).delete("user_info")
}
export default DeleteCookies