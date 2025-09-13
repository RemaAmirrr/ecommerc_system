import {useEffect, useState} from 'react'
import apiInstance from '../utils/axios'
import UserData from '../viwes/plugin/UserData'
import Sidebar from './Sidebar'
import  Toast  from '../viwes/plugin/Toast'


function CustomerSettings() {

  const [profile, setProfile] = useState([])
  const fetchProfilData = () => {
    apiInstance.get(`user/profile/${UserData()?.sub}/`).then((res) => {
      setProfile(res.data)
    })
  }

  useEffect(() => {
    fetchProfilData()
  }, [])

  const handelInputChange = (event) =>{
    setProfile({
      ...profile,
      [event.target.name]:event.target.value
    })}

  const handelImageChenge = (event) => {
    setProfile({
      ...profile,
      [event.target.name]:event.target.files[0]
    })
  }
  
  const handelFormsSubmit = async (e) => {
    e.preventDefault()
    const formdata = new FormData()
    const res = await apiInstance.get(`user/profile/${UserData()?.sub}/`)
    if(profile.image && profile.image !== res.data.image){
      formdata.append ('image', profile.image)
    }
    formdata.append("full_name", profile.full_name)
    formdata.append("country", profile.country)
    formdata.append("state", profile.state)
    formdata.append("city", profile.city)
    formdata.append("address", profile.address)
    formdata.append("phone", profile.phone)

    try {
      await apiInstance.patch(`user/profile/${UserData()?.sub}/`, formdata,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      Toast().fire({
        icon : "success",
        title : "profile updated sucss"
      })
      fetchProfilData()
      
    } catch (error) {
      console.log(error);
    }

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
                      {" "}
                      <i className="fas fa-gear fa-spin" /> Settings{" "}
                    </h3>
                    <form encType="multipart/form-data" onSubmit={handelFormsSubmit}>
                      <div className="row">
                        <div className="col-lg-12 mb-3">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            Profile Image
                          </label>
                          <input
                            type="file"
                            className="form-control"
                            aria-describedby="emailHelp"
                            onChange={handelImageChenge}
                            name="image"
                           
                          />
                        </div>
                      
                        <div className="col-lg-12">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            Full Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            aria-describedby="emailHelp"
                            onChange={handelInputChange}
                            value={profile?.full_name}
                            name="full_name"
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
                            onChange={handelInputChange}
                            value={profile?.user?.email}
                            name="email"
                          />
                        </div>
                        <div className="col-lg-6 mt-3">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            Mobile
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            aria-describedby="emailHelp"
                            onChange={handelInputChange}
                            value={profile?.phone}
                            name="phone"
                            
                          />
                        </div>
                      </div>
                      <br />
                      <div className="row">
                        <div className="col-lg-6">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            Address
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            aria-describedby="emailHelp"
                            onChange={handelInputChange}
                            value={profile.address}
                            name="address"
                          />
                        </div>
                        <div className="col-lg-6 mt-3">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            City
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            aria-describedby="emailHelp"
                            value={profile.city}
                            onChange={handelInputChange}
                            name="city"
                          />
                        </div>
                        <div className="col-lg-6 mt-3">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            State
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            aria-describedby="emailHelp"
                            onChange={handelInputChange}
                            value={profile.state}
                            name="state"
                          />
                        </div>
                        <div className="col-lg-6 mt-3">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            Country
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            aria-describedby="emailHelp"
                            value={profile.country}
                            onChange={handelInputChange}
                            name="country"
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary mt-5">
                        Save Changes
                      </button>
                    </form>
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

export default CustomerSettings

