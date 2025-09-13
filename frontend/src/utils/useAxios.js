import axios from "axios"
import { isAccessTokenExpaired, setAuthUser, getRefreshToken } from "./auth"
import { BASE_URl } from "./constantts"
import Cookies from "js-cookie"

const useAxios = async () => {
    const access_token = Cookies.get("access_token")
    const refresh_token = Cookies.get("refresh_token")

    const axiosInstance = axios.create({
        baseURL: BASE_URl,
        headers: {Authorization: `Bearer ${access_token}`}
    })

    axiosInstance.interceptors.request.use(async (req) =>{
       if(!isAccessTokenExpaired(access_token)){
        return req
       }

       const response = await getRefreshToken(refresh_token)
       setAuthUser(response.access, response.refresh)
   
       req.headers.Authorization = `Bearer ${response.data.access}`
       return req
    })

    return axiosInstance
}

export default useAxios