import {useState, useEffect} from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import { Link} from 'react-router-dom'
import moment from 'moment'

function VendorOrders() {
   const [orders, setOrders] = useState([])
   console.log(UserData().vendor_id)

   const fetechorder = () => { apiInstance.get(`vendor/order/${UserData()?.vendor_id}/`).then((res) => {
        setOrders(res.data)
        console.log(res.data)
     })}

   useEffect(() => {
     fetechorder()
   }, [])

   const handledeleteorder = async(orderId) => {
      const response = await apiInstance.delete(`/vendor/changevendororder/${UserData()?.vendor_id}/${orderId}/`)
    fetechorder()
   }

   const handleFilterOrder = async(filter) => {

    const response = await apiInstance.get(`/vendor/order/filter/${UserData()?.vendor_id}?filter=${filter}`)
    setOrders(response.data)

   }

  return (
    <div className="container-fluid" id="main">
    <div className="row row-offcanvas row-offcanvas-left h-100">
      {/* Add Side Bar Here */}
      <Sidebar/> 
      <div className="col-md-9 col-lg-10 main mt-4">
        <div className="row mb-3 container">
          <div className="col-lg-12" style={{ marginBottom: 100 }}>
            {/* Tab panes */}
            <div className="tab-content">
              <br />
                <div role="tabpanel" className="tab-pane active" id="home1">
                  <h4 className='mb-3'>Orders</h4>
                  <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle btn-sm mt-3 mb-4"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="false"
                        aria-expanded="false"
                      >
                        Filter <i className="fas fa-sliders"></i>
                      </button>
                     
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton1"
                      >
                        <li>
                          <a className="dropdown-item" onClick={() => handleFilterOrder("paid")}>
                            Payment Status: Paid
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" onClick={() => handleFilterOrder("pending")}>
                            Payment Status: Pending
                            
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" onClick={() => handleFilterOrder("processing")}>
                            Payment Status: processing
                            
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" onClick={() => handleFilterOrder("cancelled")}>
                          Payment Status: cancelled
                          </a>
                        </li>
                        <hr />
                        <li>
                          <a className="dropdown-item" onClick={() => handleFilterOrder("latest")}>
                            Date: Latest
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" onClick={() => handleFilterOrder("Oldest")}>
                            Date: Oldest
                          </a>
                        </li>
                        <hr />
                        <li>
                          <a className="dropdown-item" onClick={() => handleFilterOrder("Pending")}>
                            Order Status: Pending
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" onClick={() => handleFilterOrder("Fulfilled")}>
                            Order Status: Fulfiled
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" onClick={() => handleFilterOrder("Cancelled")}>
                            Order Status: Cancelled
                          </a>
                        </li>
                      </ul>
                      
                   </div>
                  <table className="table">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">#Orders Id</th>
                        <th scope="col">Order</th>
                        <th scope="col">Payment status</th>
                        <th scope="col">Order status</th>
                        <th scope="col">Data</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders?.map((o, index) => (
                        <tr key={index}>
                        <td>{o.oid}</td>
                        <td>${o.total}</td>
                        <td>{o.payment_status.toUpperCase()}</td>
                        {/* <td>{o.orders_status.toUpperCase()}</td> */}
                        <td>{moment(o.date).format("MMM DD, YYYY")}</td>
                        <td>
                          <Link to={`/vendor/orders/${o.oid}/`} className="btn btn-primary mb-1 me-2">
                            <i className="fas fa-eye" />
                          </Link>
                          <Link href="" className="btn btn-success mb-1 me-2">
                            <i className="fas fa-edit" />
                          </Link>
                          <Link  onClick={() => handledeleteorder(o.oid)} className="btn btn-danger mb-1">
                            <i className="fas fa-trash" />
                          </Link>
                        </td>
                      </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default VendorOrders
