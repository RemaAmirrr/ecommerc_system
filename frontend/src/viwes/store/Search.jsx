import React from 'react'
import { useEffect, useState } from 'react'
import apiInstance from '../../utils/axios'
import{Link, useSearchParams} from "react-router-dom"
import GetCurrentAddress from '../plugin/UserCountry'
import UserData from '../plugin/UserData'
import CardID from '../plugin/CardID'
import Toast from '../plugin/Toast'


function Search() {

    
    const[product, setProduct] = useState([])
    const[category, setCategory] = useState([])

    const [colorValue, setcolorValue] = useState("No Color")
    const [sizeValue, setSizeValue] = useState("No Size")
    const [qtyValue, setQtyValue] = useState(1)

    const [selecteProduct, setSelectedProduct] = useState({})
    const [selectedColors, setSelectedColors] = useState({})
    const [selectedSize, setSelectedSize] = useState({})

    const [searchParams] = useSearchParams()
    const query = searchParams.get("query")

    useEffect(()=>{
        apiInstance.get(`search/?query=${query}`).then((res) => {
            setProduct(res.data)
        })
    }, [query])

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

   const cart_id = CardID()
   const currentAddress = GetCurrentAddress()
   const user_id = UserData()

   const addToWishList = async (productId) => {
        try {
            const formdata = new FormData()
                formdata.append("product_id", productId)
                formdata.append("user_id", UserData()?.sub)
                const response = await apiInstance.post(`customer/wishlist/${UserData()?.sub}/`, formdata)
                // place when you make any function in async put await in frist of func this is take a lot of time from me becauce don`t res
                Toast().fire({
                    icon: "success",
                    title: response.data.message,
                })
          
        } catch (error) {
            console.log(error)   
        }     
    }
  
   const handleAddToCart = async (product_id, shipping_amount, price) => {
    try {
            const formdata =  new FormData()
        
            formdata.append("product_id", product_id)
            formdata.append("user_id", UserData()?.sub)
            formdata.append("qty", qtyValue)
            formdata.append("price", price)
            formdata.append("shipping", shipping_amount)
            formdata.append("country", currentAddress.country)
            formdata.append("size", sizeValue)
            formdata.append("color", colorValue)
            formdata.append("cart_id", cart_id)
            const response = await apiInstance.post(`cart_view/`, formdata)
            console.log(response)
            Toast().fire ({
                icon: "success",
                title:response.data.message,
            })
                 
    } catch (error) {
        console.log(error)   
    }
}
  return (
    <>
        <main className='mt-5'>
            <div className='container'>
                <section className='text-center mt-4'>
                    <div className='row mt-6'>
                        {
                            product?.map((p, index) => (
                                   <div  className='col-lg-4 col-md-12 mb-4' style={{width:"30%", hight:"120px"}}  key={index}>
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

                                                            >Variation

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
                                                                
                                                                    <button className='btn btn-primary me-1 mb-1 ' 
                                                                        type="button"
                                                                        onClick={() => handleAddToCart(p.id, p.price, p.shipping_amount)}
                                                                    > 
                                                                    <i className='fas fa-shopping-cart'/>                                                                              
                                                                    </button>
                                                                    <button  onClick={(e) => addToWishList(p.pid)} className='btn btn-danger px-1 ms-2 me-1 mb-1 ' 
                                                                        type="button"
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
                                ))
                           }
                                        <div className='row mt-5' >
                                            {
                                                category?.map((c, index) => (
                                                        <div className='col-lg-2 col-md-12 mb-4' key={index}>
                                                        <img src={c.image} className='w-100' style={{width:"100%", hight:"100px",borderRadius: "50%", objectFit:"cover" }} alt=""/>
                                                        <h3>{c.title}</h3> 
                                                        </div>
                                                ))
                                            }
                                        </div>
                       </div>
                                       
                </section>
            </div>
        </main>
    
    </>
  )
}

export default Search
