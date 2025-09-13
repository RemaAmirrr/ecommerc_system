import {useEffect, useState} from 'react'
import apiInstance from '../utils/axios'
import { Link } from 'react-router-dom'
import UserData from '../viwes/plugin/UserData'
import Sidebar from './Sidebar'
import  Toast  from '../viwes/plugin/Toast'


function WishList() {

    const [wishlist, setWishlist] = useState()
    const userData = UserData()
    const fatchdata = () => {
        apiInstance.get(`customer/wishlist/${userData?.sub}/`).then((res) =>{
          setWishlist(res.data)
        })
    }

    useEffect(() => {
        fatchdata()
    }, [])

    const addToWishList = async (productId) => {
        try {
            const formdata = new FormData()
                formdata.append("product_id", productId)
                formdata.append("user_id", userData?.sub)
                const response = await apiInstance.post(`customer/wishlist/${userData?.sub}/`, formdata)
                Toast().fire({
                    icon: "success",
                    title: response.data.message,
                })
                fatchdata()
          
        } catch (error) {
            console.log(error)
            
        }     
    }

//   return (
//     <main className="mt-5">
//     <div className="container">
//         <section className="">
//             <div className="row">
//                 <Sidebar/>
//                 <div className="col-lg-9 mt-1">
//                     <section className="">
//                         <main className="mb-5" style={{}}>
//                             <div className="container">
//                                 <section className="">
//                                     <div className="row">
//                                         <h3 className="mb-3">
//                                             <i className="fas fa-heart text-danger" /> Wishlist
//                                         </h3>
//                                         <div className="col-lg-4 col-md-12 mb-4">
//                                             <div className="card">
                                           
//                                             {
//                                              wishlist?.map((w, index) => (
//                                             <div  className='col-lg-4 col-md-12 mb-4' key={index}>
//                                               <div className='card'>
//                                                <div className='bg-image hover-zoom repple' data-mdb-ripple-color="light">
//                                                     <Link to={`/detail/${w.product.slug}/`}>
//                                                         <img src={w.product?.image} className='w-100' style={{width:"100%", hight:"250px"}}/>
//                                                     </Link>
//                                                     <Link to={`/detail/${w.product.slug}/`} className='text-reset'>
//                                                         <h1>{w.product.title}</h1>
//                                                     </Link>
//                                                 </div>
//                                                 <div className='card-body'>
//                                                     <a href="" className='text-reset'>
//                                                         <p>{w.product.category.title}</p>
//                                                     </a>
//                                                 <div className='d-flex justify-content-center'>
//                                                     <h6 className='mb-3'>${w.product.price}</h6>
//                                                     <h6 className='mb-3 text-muted ms-2'><strike>${w.product.old_price}</strike></h6>
//                                                 </div>
//                                                 <div className='btn-group'>
//                                                         <button
//                                                             className='btn btn-primary dropdown-toggle'
//                                                             type="button"
//                                                             id="dropdownMenrClickable"
//                                                             data-bs-toggle="dropdown"
//                                                             dta-bs-auto-close = "false"
//                                                             aria-expanded="false"
//                                                             >Vriation
//                                                         </button>

//                                                         <ul className='dropdown-menu' aria-labelledby='dropdownMenuClickable'>                                                   
//                                                             <div className='p-1 mt-0 pt-0 d-flex flex-wrap'>
//                                                                 <li className='p-1'>
//                                                                     <b>Quanty</b>: {qtyValue}
//                                                                 </li>
//                                                                 <div className='p-1 mt-0 pt-0 d-flex flex-wrap'>                                                                  
//                                                                         <li key={index}>
//                                                                           <input type="number" className='form-control'  onChange={(e) => handleQtyChange(e, p.id)}/>
//                                                                         </li>
//                                                                 </div>
//                                                             </div>
//                                                             {w.product.size?.length > 0 &&                                                            
//                                                             <div className='p-1 mt-0 pt-0 d-flex flex-wrap'>
//                                                                 <li className='p-1'>
//                                                                     <b>Size</b>: {selectedSize[w?.id] || "No Size"}
//                                                                 </li>
//                                                                 <div className='p-1 mt-0 pt-0 d-flex flex-wrap'>
//                                                                     {w.product.size?.map((size, index) => (
//                                                                         <li key={index}>
//                                                                             <button className='btn btn-secondary btn-sm me-2 mb-1'
//                                                                             onClick={(e) => handleSizeButtonClick(e, w.product.id, size.name)}
//                                                                             >
//                                                                                {size.name}
//                                                                             </button>
//                                                                         </li>
//                                                                     ))}
//                                                                 </div>
//                                                             </div>
//                                                             }
//                                                             {p.color?.length > 0 && 
//                                                                <div className='p-1 mt-0 pt-0 d-flex flex-wrap'>
//                                                                     <li className='p-1'>
//                                                                         <b>color</b>: {selectedColors[p?.id] || "No Color"}
//                                                                     </li>
//                                                                     <div className='p-1 mt-0 pt-0 d-flex flex-wrap'>
//                                                                         {p.color?.map((color, index) => (
//                                                                             <li key={index}>
//                                                                                 <button className='btn btn-secondary btn-sm m-2 mb-1 p-3' style={{ backgroundColor: `${color.name}`}}
//                                                                                  onClick={(e) => handelColorButtonClick(e, p.id, color.name)}
//                                                                                 >                                                                               
//                                                                                 </button>
//                                                                             </li>
//                                                                         ))}
//                                                                     </div>
//                                                                 </div>
//                                                             }

//                                                             <div className='p-1 mt-0 pt-0 d-flex flex-wrap'>
                                                                  
//                                                                     <div className=' d-flex mt-3 mb-1'>
                                                                    
//                                                                                 <button className='btn btn-primary me-1 mb-1 ' 
//                                                                                    type="button"
//                                                                                    onClick={() => handleAddToCart(w.product.id, w.product.price, w.product.shipping_amount)}
//                                                                                 > 
//                                                                                 <i className='fas fa-shopping-cart'/>                                                                              
//                                                                                 </button>
//                                                                                 <button className='btn btn-danger px-1 ms-2 me-1 mb-1 ' 
//                                                                                    type="button"
                                                                                  
//                                                                                 > 
//                                                                                 <i className='fas fa-heart'/>                                                                              
//                                                                                 </button>
                                                                                                                                                
//                                                                     </div>
//                                                                 </div>  
//                                                             </ul>
//                                                       </div>
//                                                  </div>
//                                               </div>
//                                             </div>
//                                             ))}
//                                             </div>
//                                         </div>

//                                         {/* Show This if there are no item in wishlist */}
//                                         <h6 className='container'>Your wishlist is Empty </h6>
//                                     </div>
//                                 </section>
//                             </div>
//                         </main>
//                     </section>
//                 </div>
//             </div>
//         </section>
//     </div>
// </main>
//   )
 return (
        <main className="mt-5">
            <div className="container">
                <section className="">
                    <div className="row">
                        {/* Sidebar Here */}
                        <Sidebar />
                        <div className="col-lg-9 mt-1">
                            <section className="">
                                <main className="mb-5" style={{}}>
                                    <div className="container">
                                        <section className="">
                                            <div className="row">
                                                <h3 className="mb-3">
                                                    <i className="fas fa-heart text-danger" /> Wishlist
                                                </h3>
                                                    {wishlist?.map((w, index) =>(
                                                    <div className="col-lg-4 col-md-12 mb-4" key={index}>
                                                        <div className="card">
                                                            <div
                                                                className="bg-image hover-zoom ripple"
                                                                data-mdb-ripple-color="light"
                                                            >
                                                                <img
                                                                    src={w.product.image}
                                                                    className="w-100"
                                                                    style={{ width: "80px", marginTop : "20px", height: "200px", objectFit: "cover" }}
                                                                />
                                                                <a href="#!">
                                                                    <div className="mask">
                                                                        <div className="d-flex justify-content-start align-items-end h-100">
                                                                            <h5>
                                                                                <span className="badge badge-primary ms-2">
                                                                                    New
                                                                                </span>
                                                                            </h5>
                                                                        </div>
                                                                    </div>
                                                                    <div className="hover-overlay">
                                                                        <div
                                                                            className="mask"
                                                                            style={{
                                                                                backgroundColor: "rgba(251, 251, 251, 0.15)"
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </a>
                                                            </div>
                                                            <div className="card-body">
                                                               
                                                                <a href="" className="text-reset">
                                                                    <p>{w.product.title}</p>
                                                                </a>
                                                                <h6 className="mb-3">${w.product.price}</h6>

                                                                <button type="button" onClick={() => addToWishList(w.product?.pid)} className="btn btn-danger px-3 me-1 mb-1">
                                                                    <i className="fas fa-heart" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    ))}
                                                {/* Show This if there are no item in wishlist */}
                                                <h6 className='container'>Your wishlist is Empty </h6>
                                            </div>
                                        </section>
                                    </div>
                                </main>
                            </section>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default WishList
