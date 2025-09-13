
import Sidebar from './Sidebar'
import {useEffect, useState} from 'react'
import apiInstance from "../utils/axios"
import UserDate from '../viwes/plugin/UserData'
import CardID from '../viwes/plugin/CardID'
// import { CartContext } from '../viwes/plugin/Context'


function Account() {
  
//   const [cartCount, setCartCount] = useContext(CartContext)
  const [profile, setProfile] = useState({})
  const userData = UserDate()
  const cart_id = CardID()
  


  useEffect(() => {
    console.log(userData.sub)
    apiInstance.get(`user/profile/${userData?.sub}/`).then((res) => {
        setProfile(res.data)
    })
    const url = userData ? `cart-list/${cart_id}/${userData?.sub}/` : `cart-list/${cart_id}/`
    apiInstance.get(url).then((res) => {
      setCartCount(res.data.length)
    })  
}, [])

// useEffect(() => {
//     const url = userData ? `cart-list/${cart_id}/${userData?.sub}/` : `cart-list/${cart_id}/`
//     apiInstance.get(url).then((res) => {
//       setCartCount(res.data.length)
//     })  
// }, [cartCount])

  return (
    <main className="mt-5">
            <div className="container">
                <section className="">
                    <div className="row">
                     <Sidebar />
                        <div className="col-lg-9 mt-1">
                            <main className="mb-5" style={{}}>
                                <div className="container px-4">
                                    <section className=""></section>
                                    <section className="">
                                        <div className="row rounded shadow p-3">
                                            <h2>{profile.full_name} </h2>
                                            <div className="col-lg-12 mb-4 mb-lg-0 h-100">
                                                From your account dashboard. you can easily check &amp;
                                                view your <a href="">orders</a>, manage your{" "}
                                                <a href="">
                                                    shipping
                                                </a>
                                                <a href="">Edit Account</a>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </main>
                        </div>
                    </div>
                </section>
            </div>
        </main>
  )
}

export default Account
