import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import About from './Components/About';
import AddPage from './Components/AddCompititor';
import Adminhome from './Components/AdminHome';
import Sidenav from './Components/AdminPannel';
import Adminacc from './Components/Adminacc';
import Approvepage from './Components/Approve';
import Comparison from './Components/Comparison';
import Createpool from './Components/Createpool';
import Foot from './Components/Foot';
import Forgotpsw from './Components/Forgotpsw';
import Home from './Components/Home';
import Login from './Components/Login';
import Navigationbar from './Components/Navigationbar';
import User from './Components/Orderstatus';
import Oraganization from './Components/Organization';
import Pools from './Components/Pools';
import Preview from './Components/Preview';
import Pricing from './Components/Price';
import ProductTile from './Components/ProductTile';
import ReactPayPal from './Components/ReactPayPal';
import Realityshow from './Components/Realityshow';
import Realpool from './Components/Realpool';
import Register from './Components/Register';
import Report from './Components/Reports';
import Result from './Components/Result';
import './Components/Styles.css';
import Update from './Components/Update';

function App() {

  return (


    <div>


      <Router>


        <Navigationbar />
        <Sidenav/>

        <Routes>
          <Route  path='/' element={<Home />}></Route>
          <Route  path='/home' element={<Home />}></Route>
          <Route  path='/Prices' element={<Pricing />}></Route>
          <Route  path='/about' element={<About />}></Route>
          <Route  path='/login' element={<Login />}></Route>
          <Route  path='/Pools' element={<Pools />}></Route>
          <Route  path='/register' element={<Register />}></Route>
          <Route  path='/login' element={<Login />}></Route>
          <Route  path='/orderstatus' element={<User />}></Route>
          <Route  path='/update' element={<Update />}></Route>
          <Route  path='/Createpools' element={<Createpool/>}></Route>
          <Route  path='/AddCompitiors' element={<AddPage/>}></Route>
          <Route  path='/Preview' element={<Preview/>}></Route>
          <Route  path='/Reports' element={<Report/>}></Route>
          <Route  path='/ApprovePage' element={<Approvepage/>}></Route>
          <Route  path='/producttile' element={<ProductTile/>}></Route>
          <Route  path='/AdminHome' element={<Adminhome/>}></Route>
          <Route  path='/Realityshow' element={<Realityshow/>}></Route>
          <Route  path='/Organizations' element={<Oraganization/>}></Route>
          <Route  path='/Forgotpassword' element={<Forgotpsw/>}></Route>
          <Route  path='/Realpools' element={<Realpool/>}></Route>
          <Route  path='/Results' element={<Result/>}></Route>
          <Route  path='/Adminacc' element={<Adminacc/>}></Route>
          <Route  path='/Checkouts' element={<ReactPayPal/>}></Route>
          <Route  path='/Comparison' element={<Comparison/>}></Route>
          </Routes>
        <Foot />
      </Router>
    </div>
  );
}

export default App;
