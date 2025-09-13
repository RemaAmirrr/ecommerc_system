import React, { useEffect, useState, useContext } from 'react'
import apiInstance from '../../utils/axios'
import{Link} from "react-router-dom"
import GetCurrentAddress from '../plugin/UserCountry'
import UserData from '../plugin/UserData'
import CardID from '../plugin/CardID'
import { CartContext } from '../plugin/Context'
import Toast from '../plugin/Toast'

function Product() {
    const[product, setProduct] = useState([])
    const[category, setCategory] = useState([])

    const [colorValue, setcolorValue] = useState("No Color")
    const [sizeValue, setSizeValue] = useState("No Size")
    const [qtyValue, setQtyValue] = useState(1)

    const [selecteProduct, setSelectedProduct] = useState({})
    const [selectedColors, setSelectedColors] = useState({})
    const [selectedSize, setSelectedSize] = useState({})
    const [cartCount, setCartCount] = useContext(CartContext)

    useEffect(() => {
         apiInstance.get(`product/`).then((res) =>{
            setProduct(res.data)
         })

          apiInstance.get(`category/`).then((res) =>{
            setCategory(res.data)
        })
    }, [])

    const handelColorButtonClick = (event, product_id, color_name) => {
        setcolorValue(color_name)
        setSelectedProduct(product_id)

        setSelectedColors((prevSelectedColors) => ({
            ...prevSelectedColors,
            [product_id] : color_name
        }))
        Toast().fire({
          icon : "success",
          title : "color chosed",
        })
   }

   const handleSizeButtonClick = (event, product_id, size_name) => {
      setSizeValue(size_name)
      setSelectedProduct(product_id)

      setSelectedSize((prevSelectedSize) => ({
        ...prevSelectedSize,
        [product_id] : size_name
      }))
       Toast().fire({
          icon : "success",
          title : "Size chosed",
        })
   }

   const handleQtyChange = (event, product_id) => {
        setQtyValue(event.target.value)
        setSelectedProduct(product_id)
   }
   const cart_id = CardID()
   const currentAddress = GetCurrentAddress()
   const userData = UserData()

   const handleqtyinput =(event) => {
    setQtyValue(event.target.value)
 }
  
   const handleAddToCart = async (product_id, shipping_amount, price) => {
    
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
              Toast().fire ({
                icon: "success",
                title:response.data.message,
            })
             const url = userData?`cart-list/${cart_id}/${userData?.sub}/`:`cart-list/${cart_id}/`
             apiInstance.get(url).then((res) => {
             setCartCount(res.data.length)
            }) 

    } catch (error) {
        console.log(error)      
    }}

    useEffect( () => {
        const url = userData ? `cart-list/${cart_id}/${userData?.sub}/` : `cart-list/${cart_id}/`
        apiInstance.get(url).then((res) => {
        setCartCount(res.data.length)
        }) 
    }, [])

    const addToWishList = async (productId) => {
        try {
            const formdata = new FormData()
                formdata.append("product_id", productId)
                formdata.append("user_id", userData?.sub)
                const response = await apiInstance.post(`customer/wishlist/${userData?.sub}/`, formdata)
                // place when you make any function in async put await in frist of fucn this is take a lot of time from me becauce don`t res
                Toast().fire({
                    icon: "success",
                    title: response.data.message,
                })
          
        } catch (error) {
            console.log(error)   
        }     
    }

  return (
   <>
    {/* <StoreHeader/> */}
    <div className="container-fluid">
       <main className="mt-5 ">
          <section className="text-center">
            <div className="row">
                {product?.slice(0, 5).map((p, index) => (
                <div className="col-lg-4 col-md-12 mb-4" style={{width:"20%", hight:"120px"}} key={index}>
                    <div className="card">
                    <div
                        className="bg-image hover-zoom ripple"
                        data-mdb-ripple-color="light"
                    >
                        <Link to={`/product_detail/${p.slug}/`}>
                          <img 
                          src={p.image} style={{width:"20%", hight:"100px"}}
                          className="w-100" 
                          />
                        </Link>
                        <Link to={`/product_detail/${p.slug}/`}>
                        <div className="mask">
                            <div className="d-flex justify-content-start align-items-end h-100">
                            <h5>
                                <span className="badge badge-primary ms-2">New</span>
                            </h5>
                            </div>
                        </div>
                        <div className="hover-overlay">
                            <div
                            className="mask"
                            style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                            />
                        </div>
                        </Link>
                    </div>
                    <div className="card-body">
                        <Link to={`/product_detail/${p.slug}/`} className="text-reset">
                        <h5 className="card-title mb-3">{p.title}</h5>
                        </Link>
                        <a href="" className="text-reset">
                        <p>{p.category?.title}</p>
                        </a>
                        <h6 className="mb-3">${p.price}</h6>
                        <div className="btn-group">
                        <button
                            className="btn btn-primary dropdown-toggle"
                            type="button"
                            id="dropdownMenuClickable"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="false"
                            aria-expanded="false"
                        >
                            Variation
                        </button>
                        <ul
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuClickable"
                        >   <div className="col-md-12 mb-4">
                                            <div className="form-outline">
                                                <label className="form-label" htmlFor="typeNumber"><b>Quantity</b></label>
                                                <input
                                                    type="number"
                                                    id="typeNumber"
                                                    className="form-control quantity"
                                                    min={1}
                                                    value={qtyValue}
                                                    onChange={handleqtyinput}
                                                />
                                            </div>
                                        </div>
                            <div className="d-flex flex-column">
                            <li className="p-1">
                                <b>Size</b>: 
                            </li>
                            
                            <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                {p?.size?.map((s, index) => (
                                <div key={index}>
                                <input  type="hidden" className='size_value' value={s.name} name="" id=""/>
                                <button key={index} type="button" onClick={(e) => handleSizeButtonClick(e, p.id, s.name)} className="btn btn-secondary m-1 size_button">{s.name}</button>   
                                </div> 
                                  ))}
                            </div>
                            </div>
                            <div className="d-flex flex-column mt-3">
                            <li className="p-1">
                                <b>Color</b>:
                            </li>
                            <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                               {p?.color?.map((c, index) => (
                                <div className='d-flex' key={index} >
                                  <input type="hidden" className='color_name' value={c.name} name="" id=""/>
                                  <button  className='btn p-3 m-1 color_button'onClick={(e) => handelColorButtonClick(e, p.id, c.name)}type="button"  style={{ background: `${c.name}` }}></button>
                                </div>
                                ))} 
                            </div>
                            </div>
                            <div className="d-flex mt-3 p-1">
                            <button
                                type="button"
                                className="btn btn-primary me-1 mb-1"
                                onClick={() => handleAddToCart(p.id, p.price, p.shipping_amount)}
                            >
                                <i className="fas fa-shopping-cart" />
                            </button>
                            <button
                                type="button" onClick={() => addToWishList(p.pid)} 
                                className="btn btn-danger px-3 me-1 mb-1 ms-2"
                            >
                                <i className="fas fa-heart" />
                            </button>
                            </div>
                        </ul>
                        <button onClick={() => addToWishList(p.pid)} 
                            type="button"
                            className="btn btn-danger px-3 me-1 ms-2"
                        >
                            <i className="fas fa-heart" />
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
                ))}   
              <div className='row mt-5' style={{  marginLeft : "60px",}}>
                {category?.map((c, index) => (
                  <div className="col-lg-2" key={index} style={{ width: "130px", height: "100px"}} >
                  <Link>
                    <img src={c.image} style={{ width: "100px", height: "100px", borderRadius:
                      "50%", objectFit: "cover" }} alt=""/>                  
                  </Link>
                  <h6>{c.title}</h6>
                </div>
                ))}
              </div>
            </div>
          </section>
          {/*Section: Wishlist*/}
      </main>
      {/*Main layout*/}
      <main>
        <section className="text-center container">
          <div className="row py-lg-5">
            <div className="col-lg-6 col-md-8 mx-auto">
              <h1 className="fw-light">Trending Products</h1>
              <p className="lead text-muted">
                Something short and leading about the collection below—its
                contents
              </p>
            </div>
          </div>
        </section>
        <div className="album py-3 bg-light">
          <div className="container">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
               {product?.slice(0, 6).map((p, index) => (
              <div className="col" key={index}>
                 <div className="card shadow-sm">
                  <svg
                    className="bd-placeholder-img card-img-top"
                    width="100%"
                    height={225}
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Placeholder: Thumbnail"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                  >
                    <title>Placeholder</title>
                    <rect width="100%" height="100%" fill="#55595c" />
                    <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                      Thumbnail
                    </text>
                  </svg>
                  <div className="card-body">
                    <p className="card-text">
                      {p.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                        >
                          Edit
                        </button>
                      </div>
                      <small className="text-muted">9 mins</small>
                    </div>
                  </div>
                </div>
              </div>
               ))}
            </div>
          </div>
        </div>
      </main>
    </div>
     {/* <StoreFooter/> */}
    </>
  )
}

export default Product;
