import { getApiUrl } from "@/utils/getApiUrl";

const API_URL = getApiUrl()

const postHeader = (
    body: any,
    stringify: boolean = true,
    contentType?: any
  ) => {
    // const token = localStorage.getItem("accessToken");
    return {
      method: "POST",
      headers: {
        "Content-Type": body ? contentType || "application/json" : null,
        // Authorization: token && `Bearer ${token}`,
      },
      body: body ? (stringify ? JSON.stringify(body) : body) : null,
    };
  };



  export const SignUp = (body : any)=>{
    return fetch(`${API_URL}user/register/`, postHeader(body)).then((res)=>res.json())
  }