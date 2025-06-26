import ProblemListPage from "../components/ProblemList/problemList"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
const Problems = () => {

  const cookieUserName = Cookies.get('user');
  const cookieEmail = Cookies.get('email');
  const CookieToken = Cookies.get('token');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    if(CookieToken){
      setIsAuthenticated(true);
    }
  },[cookieUserName,cookieEmail,isAuthenticated,CookieToken]);
  return (
    <>
    <Navbar isLoggedIn={isAuthenticated} userEmail={cookieEmail} userName={cookieUserName} />
    <ProblemListPage/>
    <Footer/>
    </>
  )
}

export default Problems