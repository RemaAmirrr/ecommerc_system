import {useState, useEffect} from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import { useParams } from 'react-router-dom'

function VendorReviewDetail() {
    const [review, setReview] = useState({})
    const [updateReview, setUpdateReview] = useState({reply: ''})

    const param = useParams()

    const handleReplyChange = (event) => {
        setUpdateReview({
            ...updateReview,
            [event.target.name]: event.target.value
        })
    }
    useEffect(() => {
        apiInstance.get(`vendor-reviews-detail-list/${UserData()?.vendor_id}/${param.review_id}/`).then((res) => {
            setReview(res.data)
            
        })
    }, [])

    const handleReplySubmit = async (e) => {
        e.preventDefault()
        const formdata = new FormData()
        formdata.append('reply', updateReview.reply)
        formdata.append("review_id", param.review_id)
        formdata.append("vendor_id", UserData()?.vendor_id)
        await apiInstance.patch(`vendor-reviews-detail-list/${UserData()?.vendor_id}/${param.review_id}/`, formdata).then((res) => {

        })
        apiInstance.get(`vendor-reviews-detail-list/${UserData()?.vendor_id}/${param.review_id}/`).then((res) => {
            setReview(res.data)
            
        })
    }

  return (
    <div className="container-fluid" id="main">
    <div className="row row-offcanvas row-offcanvas-left h-100">
      <Sidebar/>
      {/*/col*/}
      <div className="col-md-9 col-lg-10 main mt-4">
        <section
          className="p-4 p-md-5 text-center text-lg-start shadow-1-strong rounded"style={{backgroundImage:"url(https://mdbcdn.b-cdn.net/img/Photos/Others/background2.webp)"
          }}
        >
          <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-10">
        
               <div className="card mt-3 mb-3" >
                 <div className="card-body m-3">
                   <div className="row">
                     <div className="col-lg-4 d-flex justify-content-center align-items-center mb-4 mb-lg-0">
                       <img
                         src= {review?.profile?.image}
                         className="rounded-circle img-fluid shadow-1"
                         alt={review?.profile?.image}
                         style={{width:"160px", height:"160px", objectFit:"cover"}}
                       />
                     </div>
                     <div className="col-lg-8">
                       <p className="text-dark fw-bold mb-4">
                         Review:{" "}
                         <i>
                           {review?.review}
                         </i>
                       </p>
                       <p className="text-dark fw-bold mb-4">
                         Review:{" "}
                         <i>
                           {review?.reply === ""
                             ? <span>No Reply Yet</span>
                             : (review?.reply) 
                           }
                         
                         </i>
                       </p>       
                       <p className="fw-bold text-dark mb-2">
                         <strong>{review?.profile?.full_name}</strong>
                       </p>
                       <p className="fw-bold text-muted mb-0">
                         Product:{review?.product?.title}
                       </p>
                       <p className="fw-bold text-muted mb-0">
                         Rating: {review.rating}
                              {review.rating === 1 &&
                              <i className="fas fa-star" /> 
                              }
                              {review.rating === 2 &&
                              <>
                              <i className="fas fa-star" /> 
                              <i className="fas fa-star" /> 
                              </>
                              }
                              {review.rating === 3 &&
                              <>
                              <i className="fas fa-star" /> 
                              <i className="fas fa-star" /> 
                              <i className="fas fa-star" />
                              </>
                              
                              }
                              {review.rating === 4 &&
                              <>
                                  <i className="fas fa-star" /> 
                                  <i className="fas fa-star" /> 
                                  <i className="fas fa-star" />
                                  <i className="fas fa-star" />
                              </>
                              }
                              {review.rating === 5 &&
                                  <>
                                  <i className="fas fa-star" /> 
                                  <i className="fas fa-star" /> 
                                  <i className="fas fa-star" />
                                  <i className="fas fa-star" />
                                  <i className="fas fa-star" />
                              </>
                              }
                              {review.rating === 0 &&
                                  <>
                                  <i className="fas fa-star" /> 
                              
                              </>
                              }
                       </p>
                       <div className="d-flex mt-3">
                        <form onSubmit={handleReplySubmit} className='d-flex'>
                            <input type="text" value={updateReview.reply} name="reply" onChange={handleReplyChange} placeholder='Write your reply...' className='form-control'/>
                            <button  type='submit' className='btn btn-success ms-2'><i className='fas fa-paper-plane'></i></button>
                        </form>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div> 
          </div>
        </section>
      </div>
    </div>
    </div>
  )
}

export default VendorReviewDetail
