import React, { useEffect, useState, useContext } from 'react'
import apiInstance from '../../utils/axios'
import GetCurrentAddress from '../plugin/UserCountry'
import UserData from '../plugin/UserData'
import CardID from '../plugin/CardID'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../plugin/Context'
import Toast from '../plugin/Toast'


function Cart() {

    const [cart, setCart] = useState([])
    const [cartTotal, setCartTotal] = useState([])
    const [productQuantities, setProductQuantities] = useState([])
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [cartCount, setCartCount] = useContext(CartContext)

    const [country, setCountry] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [address, setAddress] = useState("")

    const userData = UserData()
    const cart_id = CardID()
    const currentAddress = GetCurrentAddress()
    const navigate = useNavigate()
    console.log(cart_id)
    console.log(userData?.sub)
    

    const fetchCartTotal  = (cart_id, user_id) => {
        const url = user_id ? `cart-detail/${cart_id}/${user_id}/`:`cart-detail/${cart_id}/`
        apiInstance.get(url).then((res) => {
            setCartTotal(res.data)
            
        })
    }

    const fetchCartDetail= (cart_id, user_id) => {
        const url = user_id ? `cart-list/${cart_id}/${user_id}/`:`cart-list/${cart_id}/`
        apiInstance.get(url).then((res) => {
            setCart(res.data)
            setCartCount(res.data.length)
        })
    }
    
    if (cart_id !== null || cart_id !== undefined) {
        if (userData?.sub !== undefined){
            // Send Cart Data with userId and CartId
            useEffect(() => {
                fetchCartDetail(cart_id, userData ?. sub)
                fetchCartTotal(cart_id, userData ?. sub)
            }, [])   
        } else {
            // Send cart data without userId but only cartId
            useEffect(() => {
                fetchCartDetail(cart_id, null)
                fetchCartTotal(cart_id, null)
            }, [])
        }
    }

    

    // this code belong to update
    useEffect(() => {
        const initialQuantites = {}
        cart.forEach((c) => {
            initialQuantites[c.product?.id] = c.qty  
        })
        // make a dict lik this {"aerfgdg": 5}
        setProductQuantities(initialQuantites)
    }, [cart])

    const handleQtyChange = (event, product_id) => {
        const quantity = event.target.value
        setProductQuantities((prevQuantities) => ({
            ...prevQuantities,
            [product_id]:quantity
        }))
        
    }

    const updateCart =  async (product_id, shipping_amount, color, size, price) =>{
        const  qtyValue = productQuantities[product_id]
 
     try {
        const formdata =  new FormData()
        formdata.append("product_id", product_id)
        formdata.append("user_id", userData?.sub)
        formdata.append("qty", qtyValue)
        formdata.append("price", price)
        formdata.append("shipping", shipping_amount)
        formdata.append("country", currentAddress.country)
        formdata.append("size", size)
        formdata.append("color", color)
        formdata.append("cart_id", cart_id)
       

        const response = await apiInstance.post(`cart_view/`, formdata)

        Toast().fire ({
            icon: "success",
            title:response.data.message,
        })
        fetchCartDetail(cart_id, userData ?. sub)
        fetchCartTotal(cart_id, userData ?. sub)

      } catch (error) {
        console.log(error)
         }
    }

    const handleDeleteCartItem =  async (item_id) => {
        try {
                const url = userData?.sub
                   ?`cart-delete/${cart_id}/${userData?.sub}/${item_id}/`:`cart-delete/${cart_id}/${item_id}/`
        
                  await apiInstance.delete(url)
                   Toast().fire ({
                        icon: "success",
                        title:"Item removed from cart",
                })

                fetchCartDetail(cart_id, userData ?. sub)
                fetchCartTotal(cart_id, userData ?. sub) 
            
        } catch (error) {
            console.log(error)
        }   
    }

    const handleChange = (event) => {
        const {name, value} =event.target

        switch (name) {

            case "fullName":
                setFullName(value)
                break

            case "email":
                setEmail(value)
                break

            case "mobile":
                setMobile(value)
                break     

             case "address":
                setAddress(value)
                break

            case "country":
                setCountry(value)
                break
                
            case "state":
                setState(value)
                break 
                
            case "city":
                setCity(value)
                break

            default:
                break    
   
        }
    }

    const createOrder =  async (event) => {

        if(!fullName || !email || !mobile || !address || !city || !state || !country){

            Swal.fire({
                icon: 'warning',
                title:"Missing Fields",
                text:"All fields are required before chechout!"
            })
         }
         else{

            try {

                const formdata = new FormData()
                formdata.append("full_name", fullName)
                formdata.append("email", email)
                formdata.append("mobile", mobile)
                formdata.append("address", address)
                formdata.append("city", city)
                formdata.append("state", state)
                formdata.append("country", country)
                formdata.append("cart_id", cart_id)
                formdata.append("user_id", userData ?.sub)
    
                const response = await apiInstance.post('create-order/', formdata)
                
                navigate(`/checkout/${response.data.order_oid}/`)
                  
            } catch (error) {
                console.log(error)
            }
         }    
    }

  return (
    <div>
    <main className="mt-5">
        <div className="container">
            <main className="mb-6">
                <div className="container">
                    <section className="">
                        <div className="row gx-lg-5 mb-5">
                            <div className="col-lg-8 mb-4 mb-md-0">
                                <section className="mb-5">
                                    {cart?.map((c, index) => (
                                        <div className="row border-bottom mb-4 " key={index}>
                                            <div className="col-md-2 mb-4 mb-md-0">
                                                <div
                                                    className="bg-image ripple rounded-5 mb-4 overflow-hidden d-block"
                                                    data-ripple-color="light"
                                                        >
                                                        <img
                                                            src={c.product?.image}
                                                            className="w-100"
                                                            alt=""
                                                            style={{ height: "100px", objectFit: "cover", borderRadius: "10px" }}
                                                        />
                                                   
                                                    <a href="#!">
                                                        <div className="hover-overlay">
                                                            <div
                                                                className="mask"
                                                                style={{
                                                                    backgroundColor: "hsla(0, 0%, 98.4%, 0.2)"
                                                                }}
                                                            />
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="col-md-8 mb-4 mb-md-0">
                                                {/* <Link to={null} className="fw-bold text-dark mb-4">Product Title</Link> */}
                                                <p className="mb-0">
                                                    <span className="text-muted me-2">Size:</span>
                                                    <span>{c.size}</span>
                                                </p>
                                                <p className='mb-0'>
                                                    <span className="text-muted me-2">Color:</span>
                                                    <span>{c.color}</span>
                                                </p>
                                                <p className='mb-0'>
                                                    <span className="text-muted me-2">Price:</span>
                                                    <span>{c.price}</span>
                                                </p>
                                                <p className='mb-0'>
                                                    <span className="text-muted me-2">Stock Qty:</span>
                                                    <span>{c.qty}</span>
                                                </p>
                                                {/* <p className='mb-0'>
                                                    <span className="text-muted me-2">Vendor:</span>
                                                    <span>{c.vendor}</span>
                                                </p> */}
                                                <p className="mt-3">
                                                    <button className="btn btn-danger "type='button' onClick={() => handleDeleteCartItem(c.id)}>
                                                        <small><i className="fas fa-trash me-2" />Remove</small>
                                                    </button>
                                                </p>
                                            </div>
                                            <div className="col-md-2 mb-4 mb-md-0">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <div className="form-outline">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={productQuantities[c.product?.id] || c.qty}
                                                            min={1}
                                                            onChange={(e) => handleQtyChange(e, c.product.id)}
                                                            />
                                                    </div>
                                                    <button className='ms-2 btn btn-primary' type='button' onClick={() => updateCart( c.product?.id, c.product?.shipping_amount, c.color, c.size, c.product?.price)}><i className='fas fa-rotate-right'></i></button>
                                                </div>
                                                <h5 className="mb-2 mt-3 text-center"><span className="align-middle">${c.sub_total}</span></h5>
                                            </div>
                                        </div>
                                    ))}
                                    </section>
                                    {cart < 1 &&
                                        <>
                                            <h5>Your Cart Is Empty</h5>
                                            {/* <Link to='/'> <i className='fas fa-shopping-cart'></i> Continue Shopping</Link> */}
                                        </>
                                    }
                                    {cart?.length > 0 &&
                                        <div>
                                            <div>
                                        <h5 className="mb-4 mt-4">Personal Information</h5>
                                        {/* 2 column grid layout with text inputs for the first and last names */}
                                        <div className="row mb-4">
                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="full_name"> <i className='fas fa-user'></i> Full Name</label>
                                                    <input
                                                        type="text"
                                                        id=""                                                    
                                                        className="form-control"
                                                        onChange={handleChange}
                                                        name="fullName"
                                                        value={fullName}
                                                    />
                                                </div>
                                            </div>
    
                                        </div>   
                                        <div className="row mb-4">
                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="form6Example1"><i className='fas fa-envelope'></i> Email</label>
                                                    <input
                                                        type="text"
                                                        id=""
                                                        className="form-control"
                                                        name='email'
                                                        value={email}
                                                        onChange={handleChange}   
                                                    />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="form6Example1"><i className='fas fa-phone'></i> Mobile</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name='mobile'
                                                        value={mobile}
                                                        onChange={handleChange}
    
                                                    />
                                                </div>
                                            </div>
                                        </div>
    
                                        <h5 className="mb-1 mt-4">Shipping address</h5>
    
                                        <div className="row mb-4">
                                            <div className="col-lg-6 mt-3">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="form6Example1"> Address</label>
                                                    <input
                                                        type="text"
                                                        id="form6Example1"
                                                        className="form-control"
                                                        name='address'
                                                        value={address}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 mt-3">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="form6Example1"> City</label>
                                                    <input
                                                        type="text"
                                                        id="form6Example1"
                                                        className="form-control"
                                                        name='city'
                                                        value={city}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
    
                                            <div className="col-lg-6 mt-3">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="form6Example1"> State</label>
                                                    <input
                                                        type="text"
                                                        id="form6Example1"
                                                        className="form-control"
                                                        name='state'
                                                        value={state}
                                                        onChange={handleChange}

                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 mt-3">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="form6Example1"> Country</label>
                                                    <input
                                                        type="text"
                                                        id="form6Example1"
                                                        className="form-control"
                                                        name='country'
                                                        value={country}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        </div>

                                     </div>  
                                    }
                                
                            </div>
                            <div className="col-lg-4 mb-4 mb-md-0">
                                {/* Section: Summary */}
                                <section className="shadow-4 p-4 rounded-5 mb-4">
                                    <h5 className="mb-3">Cart Summary</h5>
                                    <div className="d-flex justify-content-between">
                                        <span>Subtotal </span>
                                        <span>${cartTotal?.sub_total?.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Shipping </span>
                                        <span>${cartTotal?.shipping?.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Tax </span>
                                        <span>${cartTotal?.tax?.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Servive Fee </span>
                                        <span>${cartTotal?.sub_total?.toFixed(2)}</span>
                                    </div>
                                    <hr className="my-4" />
                                    <div className="d-flex justify-content-between fw-bold mb-5">
                                        <span>Total </span>
                                        <span>${cartTotal?.total?.toFixed(2)}</span>
                                    </div>

                                    <button
                                       type="button"
                                       className='btn btn-primary btn-rounded w-100'
                                       onClick={createOrder}

                                    >
                                       Proceed to Checkout <i className='fas fa-arrow-right'></i> 
                                    </button>
                                    {/* <Link to='/checkout/' className="btn btn-primary btn-rounded w-100" >
                                        Got to checkout
                                    </Link> */}
                                </section>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    </main>
</div>
  )
}

export default Cart
