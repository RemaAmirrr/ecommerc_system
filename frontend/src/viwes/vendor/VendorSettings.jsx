import {useState, useEffect}from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import Toast from '../plugin/Toast'


function VendorSettings() {

    // const [profileData, setProfileData] = useState([])
    // const [profileImage, setProfileImageData] = useState('')
    // const fetchProfileData = () => {
    //     apiInstance.get(`vendor-settings/${UserData()?.sub}`).then((res) => {
    //         setProfileData(res.data)
    //         setProfileImageData(res.data.image)
    //     })
    // }
    // const handleInputChange = (event) => {
    //     setProfileData({
    //         ...profileData,
    //         [event.target.name]: event.target.value
    //     })
    // }

    // const handleFileChange = (event) => {
    //     setProfileData({
    //         ...profileImage,
    //         [event.target.name]: event.target.files[0]
    //     })
    // }

    // const handleProfileSubmit = async (e)  => {
    //   e.preventDefault()
    //   const formdata = new FormData()

    //   const res = await apiInstance.get(`vendor-shop-settings/${UserData()?.sub}/`)
    //   if (vendorData.image && vendorData.image !== res.data.image){
    //     formdata.append("image", profileData.image)
    //   }
    //   formdata.append("full_name", profileData.full_name)
    //   formdata.append("about", profileData.about)
    //   formdata.append("phone", profileData.phone)

    //   await apiInstance.patch(`vendor-shop-settings/${UserData()?.sub}/`, formdata, {
    //     headers: {
    //         'Content-Type' : 'multipart/form-data'
    //     }
    //   })
    //   fetchProfileData() 
    //   Swal.fire({
    //     icon:"success",
    //     title: "Profile Updated Successfully"
    //   })
    // }

    const [vendorData, setVendorData] = useState([])
    const [vendorImage, setVendorImage] = useState('')

    
    const fetchVendorData = () => {
      apiInstance.get(`vendor-settings/${UserData()?.vendor_id}/`).then((res) => {
       setVendorData(res.data)
       setVendorImage(res.data.image)
      })
    }

    

    const handleVendorChange = (event) => {
      setVendorData({
        ...vendorData,
        [event.target.name] : event.target.value
        
      })
      console.log(vendorData.name)
      console.log(vendorData.description)
      console.log(vendorData.email)
      console.log(vendorData.mobile)

    }

    const handleVendorFileChange = (event) => {
      setVendorImage({
        ...vendorImage,
        [event.target.name] : event.target.files[0]
      })
    }

    const handleVendorSubmit = async (e) => {
      e.preventDefault()
      const formdata = new FormData()

      const res = await apiInstance.get(`vendor-settings/${UserData()?.vendor_id}/`)
      if (vendorImage.image && vendorImage.image !== res.data.image) {
        formdata.append("image", vendorImage.image)
      }
        formdata.append("email", vendorData.email)
        formdata.append("description", vendorData.description)
        formdata.append("name", vendorData.name)
        formdata.append("mobile", vendorData.mobile)

      await apiInstance.patch(`vendor-settings/${UserData()?.vendor_id}/`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      Toast().fire({
        icon: "success",
        title : "Vendor updated",

      })
      fetchVendorData()
    }
    useEffect(() => {
      fetchVendorData()
    }, [])

  return (
    <div className="container-fluid" id="main">
  <div className="row row-offcanvas row-offcanvas-left h-100">
    <Sidebar/>
    <div className="col-md-9 col-lg-10 main mt-4">
      <div className="container">
        <div className="main-body">
          {/* <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                Profile
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">
                Shop
              </button>
            </li>
          </ul> */}
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <div className="row gutters-sm shadow p-4 rounded">
                <div className="col-md-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex flex-column align-items-center text-center">
                        <img
                          src={vendorImage}
                          style={{ width: 160, height: 160, objectFit: "cover" }}
                          alt="Admin"
                          className="rounded-circle"
                          width={150}
                        />
                        <div className="mt-3">
                          <h4 className="text-dark">{vendorData.name}</h4>
                          <p className="text-secondary mb-1">{vendorData.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card mb-3">
                    <div className="card-body">
                      <form
                        className="form-group"
                        method="POST"
                        noValidate=""
                        encType="multipart/form-data"
                        onSubmit={handleVendorSubmit}
                      >
                        <div className="row text-dark">
                          <div className="col-lg-6 mb-2">
                            <label htmlFor="" className="mb-2">
                              Vendor Image
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              name="image"
                              aria-describedby="emailHelp"
                              onChange={handleVendorFileChange}
                            />
                          </div>
                          <div className="col-lg-6 mb-2 ">
                            <label htmlFor="" className="mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              aria-describedby="emailHelp"
                              onChange={handleVendorChange}
                              value={vendorData.name}
                              name="name"
                           
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            Email address
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            aria-describedby="emailHelp"
                            onChange={handleVendorChange}
                            value={vendorData.email}
                            name="email"
                          />
                         </div>
                          <div className="col-lg-6 mb-2">
                            <label htmlFor="" className="mb-2">
                              Phone Number
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="mobile"
                              aria-describedby="emailHelp"
                              onChange={handleVendorChange}
                              value={vendorData.mobile}
                            />
                          </div>
                          
                          <div className="col-lg-12 mb-2">
                            <label htmlFor="" className="mb-2">
                              About Me
                            </label>
                            <textarea
                              type="text"
                              className="form-control"
                              aria-describedby="emailHelp"
                              name="description"
                              value={vendorData.description}
                              onChange={handleVendorChange}                             
                            />
                          </div>
                          <div className="col-lg-6 mt-4 mb-3">
                            <button className="btn btn-success" type="submit">
                              Update Profile <i className="fas fa-check-circle" />{" "}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div
              className="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              <div className="row gutters-sm shadow p-4 rounded">
                <div className="col-md-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex flex-column align-items-center text-center">
                        <img
                          src={vendorData.image}
                          style={{ width: 160, height: 160, objectFit: "cover" }}
                          alt="Admin"
                          className="rounded-circle"
                          width={150}
                        />
                        <div className="mt-3">
                          <h4 className="text-dark">{vendorData?.name}</h4>
                          <p className="text-secondary mb-1">{vendorData?.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card mb-3">
                    <div className="card-body">
                      <form
                        className="form-group"
                        method="POST"
                        noValidate=""
                        encType="multipart/form-data"
                        onSubmit={handleVendorSubmit}
                      >
                        <div className="row text-dark">
                          <div className="col-lg-12 mb-2">
                            <label htmlFor="" className="mb-2">
                              Shop Image
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              name="image"
                              id=""
                              onChange={handleVendorFileChange}
                              value={vendorImage}
                            />
                          </div>
                          <div className="col-lg-12 mb-2 ">
                            <label htmlFor="" className="mb-2">
                              Shop Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              id=""
                              onChange={handleVendorChange}
                              value={vendorData.name}
                            />
                          </div>
                          <div className="col-lg-12 mb-2">
                            <label htmlFor="" className="mb-2">
                               Shop Email
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="email"
                              id=""
                              value={vendorData.email}
                              onChange={handleVendorChange}
                            />
                          </div>
                          <div className="col-lg-6 mb-2">
                            <label htmlFor="" className="mb-2">
                              Shop Description
                            </label>
                            
                          </div>
                          <div className="col-lg-12 mb-2">
                            <label htmlFor="" className="mb-2">
                              shop Description
                            </label>
                            <textarea
                              type="text"
                              className="form-control"
                              name="description"
                              id=""
                              onChange={handleVendorChange}
                              value={vendorData.description}
                            />
                          </div>
                          <div className="col-lg-12 mt-4 mb-3 d-flex">
                            <button className="btn btn-success " type="submit">
                              Update Shop <i className="fas fa-check-circle" />{" "}
                            </button>
                            <Link  to={`/vendor/${vendorData.slug}/`} className="btn btn-primary ms-3" type="submit">
                              View Shop <i className="fas fa-shop" />{" "}
                            </Link>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default VendorSettings
