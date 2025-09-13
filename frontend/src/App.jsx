import { useState ,useEffect} from 'react'
import {Routes, Route, BrowserRouter } from 'react-router-dom'
import Login from './viwes/auth/Login'
import Register from './viwes/auth/Register'
import Dashboard from './viwes/auth/Dashboard'
import Logout from './viwes/auth/Logout'
import ForgetPassword from './viwes/auth/ForgetPassword'
import CreatePassword from './viwes/auth/CreatePassword'
import StoreHeader from './viwes/base/StoreHeader'
import StoreFooter from './viwes/base/StoreFooter'
import Product from './viwes/store/Product'
import ProductDetail from './viwes/store/ProductDetail'
import Cart from './viwes/store/Cart'
import CheckOut from './viwes/store/CheckOut'
import PaymentSuccess from './viwes/store/PaymentSuccess'
import Search from './viwes/store/Search'
import { CartContext } from './viwes/plugin/Context'
import CardID from './viwes/plugin/CardID'
import UserData from './viwes/plugin/UserData'
import apiInstance from './utils/axios'
import Account from './customer/Account'
import PrivateRoute from './layout/PrivateRoute'
import MainWrapper from './layout/ManinWrapper'
import Orders from './customer/Orders'
import OrderDetail from './customer/OrderDetail'
import WishList from './customer/WishList'
import Notification from './customer/Notification'
import CustomerSettings from './customer/CustomerSettings'
import Invoice from './customer/Invoice'
import VendorDashboard from './viwes/vendor/VendorDashboard'
import VendorProducts from './viwes/vendor/VendorProducts'
import VendorOrders from './viwes/vendor/VendorOrders'
import VendorOrderDetail from './viwes/vendor/VendorOrderDetail'
import Earning from './viwes/vendor/Earning'
import VendorReviews from './viwes/vendor/VendorReviews'
import VendorReviewDetail from './viwes/vendor/VendorReviewDetail'
import VendorCoupon from './viwes/vendor/VendorCoupon'
import EditCoupon from './viwes/vendor/EditCoupon'
import VendorNotification from './viwes/vendor/VendorNotification'
import VendorSettings from './viwes/vendor/VendorSettings'
import VendorShop from './viwes/vendor/VendorShop'
import VendorAddProduct from './viwes/vendor/VendorAddProduct'
import VendorUpdateProduct from './viwes/vendor/VendorUpdateProduct'




function App() {

 
  const [cartCount, setCartCount] = useState(0)

  const cart_id = CardID()
  const userData = UserData()

  useEffect(() => {
    const url = userData ? `cart-list/${cart_id}/${userData?.sub}/`:`cart-list/${cart_id}/`
    apiInstance.get(url).then((res) => {
      setCartCount(res.data.length)
    }) 
  })
    return (
    <CartContext.Provider value={[cartCount, setCartCount]}>
        <BrowserRouter>
        <StoreHeader/>
        <MainWrapper>
        <Routes>
          
             {/* User Compnent */}
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/forget-password" element={<ForgetPassword/>}/>
            <Route path="/create-new-password" element={<CreatePassword/>}/>

            {/* Store Compnent */}
            <Route path='/' element={<Product/>}/>
            <Route path='/product_detail/:slug/' element={<ProductDetail/>}/>
            <Route path='/cart/' element={<Cart/>}/>
            <Route path='/checkout/:order_oid/' element={<CheckOut/>}/>
            <Route path='/payment-success/:order_oid' element={<PaymentSuccess/>}/>
            <Route path='/search' element={<Search/>}/>

            {/* Customer Compnent */}
            <Route path='/customer/account/' element={<PrivateRoute><Account/></PrivateRoute>}/>
            <Route path='/customer/orders/' element={<PrivateRoute><Orders/></PrivateRoute>}/>
            <Route path='/customer/order_detail/:order_oid/' element={<PrivateRoute><OrderDetail/></PrivateRoute>}/>
            <Route path='/customer/wishlist/' element={<PrivateRoute><WishList/></PrivateRoute>}/>
            <Route path='/customer/notifications/' element={<PrivateRoute><Notification/></PrivateRoute>}/>
            <Route path='/customer/settings/' element={<PrivateRoute><CustomerSettings/></PrivateRoute>}/>
            <Route path='/customer/invoice/:order_oid/' element={<PrivateRoute><Invoice/></PrivateRoute>}/>

            {/* Vendor Compnent */}
            <Route path='/vendor/dashboard/' element={<PrivateRoute><VendorDashboard/></PrivateRoute>}/>
            <Route path='/vendor/products/' element={<PrivateRoute><VendorProducts/></PrivateRoute>}/>
            <Route path='/vendor/orders/' element={<PrivateRoute><VendorOrders/></PrivateRoute>}/>
            <Route path='/vendor/orders/:order_oid/' element={<PrivateRoute><VendorOrderDetail/></PrivateRoute>}/>
            <Route path='/vendor/earning/' element={<PrivateRoute><Earning/></PrivateRoute>}/>
            <Route path='/vendor/reviews/' element={<PrivateRoute><VendorReviews/></PrivateRoute>}/>
            <Route path='/vendor/reviews/:review_id/' element={<PrivateRoute><VendorReviewDetail/></PrivateRoute>}/>
            <Route path='/vendor/coupon/' element={<PrivateRoute><VendorCoupon/></PrivateRoute>}/>
            <Route path='/vendor/coupon/:coupon_id/' element={<PrivateRoute><EditCoupon/></PrivateRoute>}/>
            <Route path='/vendor/notifications/' element={<PrivateRoute><VendorNotification/></PrivateRoute>}/>
            <Route path='/vendor/settings/' element={<PrivateRoute><VendorSettings/></PrivateRoute>}/>
            <Route path='/vendor/:slug/' element={<PrivateRoute><VendorShop/></PrivateRoute>}/>
            <Route path='/vendor/add-product/' element={<PrivateRoute><VendorAddProduct/></PrivateRoute>}/>
            <Route path='/vendor/prodcut/update/:pid/' element={<PrivateRoute><VendorUpdateProduct/></PrivateRoute>}/>
             
        </Routes>
        </MainWrapper>
        <StoreFooter/>
      </BrowserRouter>
    </CartContext.Provider>
  )
}

export default App
