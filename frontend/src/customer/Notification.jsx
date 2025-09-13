import {useEffect, useState} from 'react'
import apiInstance from '../utils/axios'
import UserData from '../viwes/plugin/UserData'
import Sidebar from './Sidebar'
import moment from 'moment'
import Swal from 'sweetalert2'


function Notification() {
   
  const [notification, setnotification] = useState([])
  
  const fetchNotification = () => {
    apiInstance.get(`customer/notifications/${UserData().sub}/`).then((res) => {
        setnotification(res.data);  
    })
  }

  useEffect(() => {
     fetchNotification()
  }, [])

  const MarkNotiAsSeen = (notiId) => {
    apiInstance.get(`/customer/marknotificationasseen/${UserData()?.sub}/${notiId}/`).then((res) => {
      fetchNotification()
    })

    fetchNotification()
    Swal.fire({
        icon: "success",
        text : "Notification Marked As Seen"
    })   
  }

  return (
    <main className="mt-5">
  <div className="container">
    <section className="">
      <div className="row">
       <Sidebar/>
        <div className="col-lg-9 mt-1">
          <section className="">
            <main className="mb-5" style={{}}>
              <div className="container px-4">
                <section className="">
                  <h3 className="mb-3">
                    <i className="fas fa-bell" /> Notifications{" "}
                  </h3>
                   {notification?.map((n, index) => (
                    <div className="list-group" key={index}>
                    <a
                      href="#"
                      className="list-group-item list-group-item-action active"
                      aria-current="true"
                    > 
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">Order Confirmed</h5>
                        <small className='mb-1'>{moment(n.date).format("MMM D, YYYY")} </small>
                      </div>
                      <p className='mb-1'>
                        Order has been Confirmed
                      </p>                  
                      <button className="btn btn-success mt-4"
                      onClick={() => MarkNotiAsSeen(n.id)}>
                        <i className='fas fa-eye'></i>
                      </button>
                    </a>
                   </div>
                  ))} 
                  {notification.length < 1 && 
                    <h4 className='p-4'> No Notifications Yet</h4>
                  }                
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

export default Notification
