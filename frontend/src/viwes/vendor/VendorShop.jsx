import {useState, useEffect, useContext}from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'
import Swal from 'sweetalert2'
import { CartContext } from '../plugin/Context'
import CardID from '../plugin/CardID'
import GetCurrentAddress from '../plugin/UserCountry'

function VendorShop() {
  
     const [vendor, setVendor] = useState([])
     const [products, setproducts] = useState([])
     const param = useParams()

     const[product, setProduct] = useState([])
     const[category, setCategory] = useState([])
 
     const [colorValue, setcolorValue] = useState("No Color")
     const [sizeValue, setSizeValue] = useState("No Size")
     const [qtyValue, setQtyValue] = useState(1)
 
     const [selecteProduct, setSelectedProduct] = useState({})
     const [selectedColors, setSelectedColors] = useState({})
     const [selectedSize, setSelectedSize] = useState({})
     const [cartCount, setCartCount] = useContext(CartContext)
 
    
     const cart_id = CardID()
     const currentAddress = GetCurrentAddress()
     const userData = UserData() 

    useEffect(() => {
        apiInstance.get(`shop-view/${param.slug}/`).then((res) => {
            setVendor(res.data)
        })
    }, [])

    useEffect(() => {
        apiInstance.get(`vendor-products/${param.slug}/`).then((res) => {
            setproducts(res.data)
        })
    }, [])

    
    const handelColorButtonClick = (event, product_id, color_name) => {
        setcolorValue(color_name)
        setSelectedProduct(product_id)

        setSelectedColors((prevSelectedColors) => ({
            ...prevSelectedColors,
            [product_id] : color_name
        }))
   }

   const handleSizeButtonClick = (event, product_id, size_name) => {
      setSizeValue(size_name)
      setSelectedProduct(product_id)

      setSelectedSize((prevSelectedSize) => ({
        ...prevSelectedSize,
        [product_id] : size_name
      }))
   }

   const handleQtyChange = (event, product_id) => {
        setQtyValue(event.target.value)
        setSelectedProduct(product_id)
   }

   const handleAddToCart = async (product_id, shipping_amount, price) => {
    
    console.log(cart_id)
    try {
            const formdata =  new FormData()
        
            formdata.append("product_id", product_id)
            formdata.append("user_id", userData?.sub)
            formdata.append("qty", qtyValue)
            formdata.append("price", price)
            formdata.append("shipping", shipping_amount)
            formdata.append("country", currentAddress.country)
            formdata.append("size", sizeValue)
            formdata.append("color", colorValue)
            formdata.append("cart_id", cart_id)
    
            const response = await apiInstance.post(`cart_view/`, formdata)
            
            Toast.fire ({
                icon: "success",
                title:response.data.message,
            })
            const url = userData ? `cart-list/${cart_id}/${userData?.sub}/` : `cart-list/${cart_id}/`
            apiInstance.get(url).then((res) => {
            setCartCount(res.data.length)
            }) 

           
        
    } catch (error) {
        console.log(error)      
    }  

    }

 const addToWishList = async (productId, userId) => {
        try {
            const formdata = new FormData()
                formdata.append("product_id", productId)
                formdata.append("user_id", userId)
                const response = apiInstance.post(`customer/wishlist/${userId}/`, formdata)
                console.log(response.data)
                Swal.fire({
                    icon: "success",
                    title: response.data.message,
                })
          
        } catch (error) {
            console.log(error)
            
        }     
    }


  return (
    <main className="mt-5">
    <div className="container">
        <section className="text-center container">
            <div className="row py-lg-5">
                <div className="col-lg-6 col-md-8 mx-auto">
                    <img src={vendor?.image} style={{ width: 100, height: 100, objectFit: "cover", borderRadius: "50%" }} alt="" />
                    <h1 className="fw-light">{vendor?.name}</h1>
                    <p className="lead text-muted">{vendor?.description}</p>
                </div>
            </div>
        </section>
        <section className="text-center">
            <h4 className="mb-4">{products.length} Products </h4>
            <div className="row">
                {product?.map((p, index) => (
                                   <div  className='col-lg-4 col-md-12 mb-4' key={index}>
                                        <div className='card'>
                                            <div className='bg-image hover-zoom repple' data-mdb-ripple-color="light">
                                                <Link to={`/detail/${p.slug}/`}>
                                                    <img src={p.image} className='w-100' style={{width:"100%", hight:"250px"}}/>
                                                </Link>
                                                <Link to={`/detail/${p.slug}/`} className='text-reset'>
                                                     <h1>{p.title}</h1>
                                                </Link>
                                            </div>
                                            <div className='card-body'>
                                                    <a href="" className='text-reset'>
                                                        <p>{p.category?.title}</p>
                                                    </a>
                                                <div className='d-flex justify-content-center'>
                                                    <h6 className='mb-3'>${p.price}</h6>
                                                    <h6 className='mb-3 text-muted ms-2'><strike>${p.old_price}</strike></h6>
                                                </div>
                                                <div className='btn-group'>
                                                        <button
                                                            className='btn btn-primary dropdown-toggle'
                                                            type="button"
                                                            id="dropdownMenrClickable"
                                                            data-bs-toggle="dropdown"
                                                            dta-bs-auto-close = "false"
                                                            aria-expanded="false"
                                                            >Vriation
                                                        </button>

                                                        <ul className='dropdown-menu' aria-labelledby='dropdownMenuClickable'>                                                   
                                                            <div className='p-1 mt-0 pt-0 d-flex flex-wrap'>
                                                                <li className='p-1'>
                                                                    <b>Quanty</b>: {qtyValue}
                                                                </li>
                                                                <div className='p-1 mt-0 pt-0 d-flex flex-wrap'>                                                                  
                                                                        <li key={index}>
                                                                          <input type="number" className='form-control'  onChange={(e) => handleQtyChange(e, p.id)}/>
                                                                        </li>
                                                                </div>
                                                            </div>
                                                            {p.size?.length > 0 &&                                                            
                                                            <div className='p-1 mt-0 pt-0 d-flex flex-wrap'>
                                                                <li className='p-1'>
                                                                    <b>Size</b>: {selectedSize[p?.id] || "No Size"}
                                                                </li>
                                                                <div className='p-1 mt-0 pt-0 d-flex flex-wrap'>
                                                                    {p.size?.map((size, index) => (
                                                                        <li key={index}>
                                                                            <button className='btn btn-secondary btn-sm me-2 mb-1'
                                                                            onClick={(e) => handleSizeButtonClick(e, p.id, size.name)}
                                                                            >
                                                                               {size.name}
                                                                            </button>
                                                                        </li>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            }
                                                            {p.color?.length > 0 && 
                                                               <div className='p-1 mt-0 pt-0 d-flex flex-wrap'>
                                                                    <li className='p-1'>
                                                                        <b>color</b>: {selectedColors[p?.id] || "No Color"}
                                                                    </li>
                                                                    <div className='p-1 mt-0 pt-0 d-flex flex-wrap'>
                                                                        {p.color?.map((color, index) => (
                                                                            <li key={index}>
                                                                                <button className='btn btn-secondary btn-sm m-2 mb-1 p-3' style={{ backgroundColor: `${color.name}`}}
                                                                                 onClick={(e) => handelColorButtonClick(e, p.id, color.name)}
                                                                                >                                                                               
                                                                                </button>
                                                                            </li>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            }

                                                            <div className='p-1 mt-0 pt-0 d-flex flex-wrap'>
                                                                  
                                                                    <div className=' d-flex mt-3 mb-1'>
                                                                    
                                                                                <button className='btn btn-primary mb-1 ' 
                                                                                   type="button"
                                                                                   onClick={() => handleAddToCart(p.id, p.price, p.shipping_amount)}
                                                                                > 
                                                                                <i className='fas fa-shopping-cart'/>                                                                              
                                                                                </button>
                                                                                <button className='btn btn-danger px-3 ms-1 me-1 mb-1  ' 
                                                                                   type="button"
                                                                                   onClick={() => addToWishList(p.id, userData?.sub)}
                                                                                  
                                                                                > 
                                                                                <i className='fas fa-heart'/>                                                                              
                                                                                </button>     
                                                                    </div>
                                                                </div>  
                                                        </ul>
                                                </div>
                                             </div>
                                        </div>
                                    </div>
                                
                            ))}
                {/* .map() function end here */}
            </div>
        </section>
    </div>
</main>
  )
}

export default VendorShop
