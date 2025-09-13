
import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import { Link } from 'react-router-dom'

import Swal from 'sweetalert2'

function VendorCoupon() {
    const [stats, setStats] = useState([])
    const [coupons, setCoupons] = useState([]) 
    const [createCoupon, 
      

    ] = useState({
      code: "",
      discont: "",
      active: true,
    })  
    const fetchCouponData = async () => {

        await apiInstance.get(`vendor-coupon-list/${UserData()?.vendor_id}/`).then((res) => {
            setCoupons(res.data)
             
       })
        await apiInstance.get(`vendor-coupon-stats/${UserData()?.vendor_id}/`).then((res) => {
             setStats(res.data[0])
        })
      
    }
    useEffect(() => {
        fetchCouponData()
    }, [])

    const handleDeleteCoupon = async (CouponId) => {
         await apiInstance.delete(`vendor-coupon-detail/${UserData()?.vendor_id}/${CouponId}/`).then((res) => {
          
            fetchCouponData()
        })
    }  
    const handleChange = (event) => {
      setCreateCoupon({
        ...createCoupon,
        [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.targer.value
      })
    }

    const handleCreateCoupon = (e) => {
      e.preventDefault()
      const formdata = new FormData()
      formdata.append('vendor_id' , UserData()?.vendor_id)
      formdata.append('code', createCoupon.code)
      formdata.append('discount', createCoupon.discont)
      formdata.append('active', createCoupon.active)
      apiInstance.post(`vendor-coupon-list/${UserData()?.vendor_id}/`, formdata).then((res) => {
        console.log(res.data);
         fetchCouponData()
          Swal.fire({
            icon: 'success',
            title: "Coupon Created."
          })
        })
      }
     
  return (
<>
  <div classname="container-fluid" id="main">
    <div classname="row row-offcanvas row-offcanvas-left h-100">
      <Sidebar/>
      <div classname="col-md-9 col-lg-10 main mt-4">
        <div classname="row mb-3">
          <div classname="col-xl-6 col-lg-6 mb-2">
            <div classname="card card-inverse card-success">
              <div classname="card-block bg-success p-3">
                <div classname="rotate">
                  <i classname="bi bi-tag fa-5x"></i>
                </div>
                <i classname="bi bi-tag fa-5x">
                  <h6 classname="text-uppercase">Total Coupons</h6>
                  <h1 classname="display-1">{stats.total_coupons}</h1>
                </i>
              </div>
              <i classname="bi bi-tag fa-5x"></i>
            </div>
            <i classname="bi bi-tag fa-5x"></i>
          </div>
          <i classname="bi bi-tag fa-5x">
            <div classname="col-xl-6 col-lg-6 mb-2">
              <div classname="card card-inverse card-danger">
                <div classname="card-block bg-danger p-3">
                  <div classname="rotate">
                    <i classname="bi bi-check-circle fa-5x"></i>
                  </div>
                  <i classname="bi bi-check-circle fa-5x">
                    <h6 classname="text-uppercase">Active Coupons</h6>
                    <h1 classname="display-1">{stats.active_coupons}</h1>
                  </i>
                </div>
                <i classname="bi bi-check-circle fa-5x"></i>
              </div>
              <i classname="bi bi-check-circle fa-5x"></i>
            </div>
            <i classname="bi bi-check-circle fa-5x"></i>
          </i>
        </div>
        <i classname="bi bi-tag fa-5x">
          <i classname="bi bi-check-circle fa-5x">
            <hr />
            <div classname="row  container">
              <div classname="col-lg-12">
                <h4 classname="mt-3 mb-4">
                  {/* {"{"}" "{"}"} */}
                  <i classname="bi bi-tag"> Coupons</i>
                </h4>
                  <i classname="bi bi-tag">
                  <table classname="table">
                    <thead classname="table-dark">
                      <tr>
                        <th scope="col">Code</th>
                        <th scope="col">Discount</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    {coupons?.map((c, index) => (
                      <tr key={index}>
                        <td>{c.code}</td>
                        <td>{c.discount}</td>
                        {c.active === true ? (
                          <td>active</td>
                        ):(
                           <td>notactive</td>
                        )}
                        <td>{c.active}</td>
                        <td>
                          <i classname="fas fa-eye">
                            <Link to={`/vendor/coupon/${c.id}`} classname="btn btn-primary mb-1">
                              <i classname="fas fa-edit"></i>
                              update
                            </Link>
                            <br />
                            <i classname="fas fa-edit">
                              <button onClick={() =>handleDeleteCoupon(c.id)}  classname="btn btn-danger mb-1">
                                <i classname="fas fa-trash"></i>
                                delete
                              </button>
                              <i classname="fas fa-trash"></i>
                            </i>
                          </i>
                        </td>
                      </tr>
                      ))}  
                    </tbody>
                  </table>
                </i>
              </div>
              <i classname="bi bi-tag"></i>
            </div>
            <i classname="bi bi-tag"></i>
          </i>
        </i>
      </div>
      <i classname="bi bi-tag fa-5x">
        <i classname="bi bi-check-circle fa-5x">
          <i classname="bi bi-tag"></i>
        </i>
      </i>
    </div>
    <i classname="bi bi-tag fa-5x">
      <i classname="bi bi-check-circle fa-5x">
        <i classname="bi bi-tag"></i>
      </i>
    </i>
  </div>
  <i classname="bi bi-tag fa-5x">
    <i classname="bi bi-check-circle fa-5x">
      <i classname="bi bi-tag"></i>
    </i>
  </i>
</>
  )}
export default VendorCoupon
