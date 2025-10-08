import React from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import Nav from './Components/Navigation/Nav';
import Home from './Components/Navigation/Home';
import Resource from './Components/Navigation/resource';
import MockTest from './Components/Navigation/mocktest';
import Companies from './Components/Navigation/Companies';
import Dashboard from './Components/Navigation/Dashboard';
import Profile from './Components/Navigation/profile';
import About from './Components/Navigation/About';
import Login from './Components/Navigation/Login';
import SignUp from './Components/Navigation/SignUp';
import AdminQuiz from './Components/Admin/AdminQuiz';
// Company components
import Accenture from './Components/Company/Accenture';
import Adobe from './Components/Company/Adobe';
import Atlassian from './Components/Company/Atlassian';
import Byjus from './Components/Company/Byjus';
import Capgemini from './Components/Company/Capgemini';
import Cisco from './Components/Company/Cisco';
import Cognizant from './Components/Company/Cognizant';
import Deloitte from './Components/Company/Deloitte';
import EPAM from './Components/Company/EPAM';
import EY from './Components/Company/EY';
import Flipkart from './Components/Company/Flipkart';
import GoldmanSachs from './Components/Company/GoldmanSachs';
import Hashedin from './Components/Company/Hashedin';
import HCL from './Components/Company/HCL';
import Hexaware from './Components/Company/Hexaware';
import HP from './Components/Company/HP';
import IBM from './Components/Company/IBM';
import Infosys from './Components/Company/Infosys';
import Intel from './Components/Company/Intel';
import JPMorgan from './Components/Company/JPMorgan';
import Mahindra from './Components/Company/Mahindra';
import Meesho from './Components/Company/Meesho';
import Microsoft from './Components/Company/Microsoft';
import Mindtree from './Components/Company/Mindtree';
import Oracle from './Components/Company/Oracle';
import Paytm from './Components/Company/Paytm';
import Phillips from './Components/Company/Phillips';
import Tcs from './Components/Company/Tcs';
import Uber from './Components/Company/Uber';
import Wipro from './Components/Company/Wipro';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Nav />
        <Home />
      </>
    )
  },
  {
  path: '/admin/quiz',
  element: <>
    <Nav />
    <AdminQuiz />
  </>
},
  {
    path: '/resource',
    element: (
      <>
        <Nav />
        <Resource />
      </>
    )
  },
  {
    path: '/mockTest',
    element: (
      <>
        <Nav />
        <MockTest />
      </>
    )
  },
  {
    path: '/companies',
    element: (
      <>
        <Nav />
        <Companies />
      </>
    )
  },

  // Individual company pages (no nesting)
  { path: '/companies/accenture', element: <><Nav /><Accenture /></> },
  { path: '/companies/adobe', element: <><Nav /><Adobe /></> },
  { path: '/companies/atlassian', element: <><Nav /><Atlassian /></> },
  { path: '/companies/byjus', element: <><Nav /><Byjus /></> },
  { path: '/companies/capgemini', element: <><Nav /><Capgemini /></> },
  { path: '/companies/cisco', element: <><Nav /><Cisco /></> },
  { path: '/companies/cognizant', element: <><Nav /><Cognizant /></> },
  { path: '/companies/deloitte', element: <><Nav /><Deloitte /></> },
  { path: '/companies/epam', element: <><Nav /><EPAM /></> },
  { path: '/companies/ey', element: <><Nav /><EY /></> },
  { path: '/companies/flipkart', element: <><Nav /><Flipkart /></> },
  { path: '/companies/goldmansachs', element: <><Nav /><GoldmanSachs /></> },
  { path: '/companies/hashedin', element: <><Nav /><Hashedin /></> },
  { path: '/companies/hcl', element: <><Nav /><HCL /></> },
  { path: '/companies/hexaware', element: <><Nav /><Hexaware /></> },
  { path: '/companies/hp', element: <><Nav /><HP /></> },
  { path: '/companies/ibm', element: <><Nav /><IBM /></> },
  { path: '/companies/infosys', element: <><Nav /><Infosys /></> },
  { path: '/companies/intel', element: <><Nav /><Intel /></> },
  { path: '/companies/jpmorgan', element: <><Nav /><JPMorgan /></> },
  { path: '/companies/mahindra', element: <><Nav /><Mahindra /></> },
  { path: '/companies/meesho', element: <><Nav /><Meesho /></> },
  { path: '/companies/microsoft', element: <><Nav /><Microsoft /></> },
  { path: '/companies/mindtree', element: <><Nav /><Mindtree /></> },
  { path: '/companies/oracle', element: <><Nav /><Oracle /></> },
  { path: '/companies/paytm', element: <><Nav /><Paytm /></> },
  { path: '/companies/phillips', element: <><Nav /><Phillips /></> },
  { path: '/companies/tcs', element: <><Nav /><Tcs /></> },
  { path: '/companies/uber', element: <><Nav /><Uber /></> },
  { path: '/companies/wipro', element: <><Nav /><Wipro /></> },

  {
    path: '/dashboard',
    element: (
      <>
        <Nav />
        <Dashboard />
      </>
    )
  },
  {
    path: '/profile',
    element: (
      <>
        <Nav />
        <Profile />
      </>
    )
  },
  {
    path: '/login',
    element: (
      <>
      <Nav />
       <Login/>
      </>
    )
  },
  {
    path: '/signup',
    element: (
      <>
      <Nav />
       <SignUp/>
      </>
    )
  },
  {
    path: '/about',
    element: (
      <>
        <Nav />
        <About />
      </>
    )
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
