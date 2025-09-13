import React from 'react'
import {useState, useEffect} from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import { Line, Bar } from 'react-chartjs-2'
import { Chart } from 'chart.js/auto'

function Earning() {
  const [earningState, setEarningState] = useState([])
  const [earningStatsTracker, setEarningStateTracker] = useState([])
  const [earningChart, setEarningChart] = useState([])

  useEffect(() => {
    apiInstance.get(`vendor-earning/${UserData()?.vendor_id}/`).then((res) =>{
        setEarningState(res.data[0])
    })
    apiInstance.get(`vendor-monthly-earning/${UserData()?.vendor_id}/`).then((res) =>{
        setEarningStateTracker(res.data)
        setEarningChart(res.data)
    })
  }, [])

  const months = earningChart?.map(item => item.month)
  const revenue = earningChart?.map(item => item.total_earning)

  const revenue_data = {
    labels: months,
    datasets: [
        {
            label: "Total Sales Revenue",
            data: revenue,
            fill: true,
            backgroundColor: 'green',
            borderColor: 'green'
        }
    ]
  }
  return (
    <div className="container-fluid" id="main">
  <div className="row row-offcanvas row-offcanvas-left h-100">
    <Sidebar/>
    <div className="col-md-9 col-lg-10 main mt-4">
      <div className="row mb-3">
        <div className="col-xl-6 col-lg-6 mb-2">
          <div className="card card-inverse card-success">
            <div className="card-block bg-success p-3">
              <div className="rotate">
                <i className="bi bi-currency-dollar fa-5x" />
              </div>
              <h6 className="text-uppercase">Total Sales</h6>
              <h1 className="display-1">${earningState.total_revenue}</h1>
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 mb-2">
          <div className="card card-inverse card-danger">
            <div className="card-block bg-danger p-3">
              <div className="rotate">
                <i className="bi bi-currency-dollar fa-5x" />
              </div>
              <h6 className="text-uppercase">Monthly Earning</h6>
              <h1 className="display-1">${earningState.monthly_revenue}</h1>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="row  container">
        <div className="col-lg-12">
          <h4 className="mt-3 mb-4">Revenue Tracker</h4>
          <table className="table">
            <thead className="table-dark">
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Orders</th>
                <th scope="col">Revenue</th>
              </tr>
            </thead>
            <tbody>
                {earningStatsTracker.map?.((e, index) => (
                    <tr key={index}>
                    {e.month === 2 && <th scope="row">January</th>}
                    {e.month === 3 && <th scope="row">January</th>}
                    {e.month === 4 && <th scope="row">January</th>}
                    {e.month === 5 && <th scope="row">January</th>}
                    {e.month === 6 && <th scope="row">January</th>}
                    {e.month === 1 && <th scope="row">January</th>}
                    {e.month === 7 && <th scope="row">January</th>}
                    {e.month === 8 && <th scope="row">January</th>}
                    {e.month === 9 && <th scope="row">January</th>}
                    {e.month === 10 && <th scope="row">January</th>}
                    {e.month === 11 && <th scope="row">January</th>}
                    {e.month === 12 && <th scope="row">January</th>}
                    <td>{e.sales_count} Items Sold</td>
                    <td>{e.total_earning}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="container">
          <div className="row ">
            <div className="col">
              <h4 className="mt-4">Revenue Analytics</h4>
              <Bar data={revenue_data} style={{ height: 300 }}/>
            </div>
          </div>
          <div className="row my-2">
            <div className="col-md-12 py-1">
              <div className="card">
                <div className="card-body">
                  <canvas id="line-chart" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )}
export default Earning
