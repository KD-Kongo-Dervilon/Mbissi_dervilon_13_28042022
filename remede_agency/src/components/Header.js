import React from 'react';
import logo from '../assets/argentBankLogo.png'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { userInfosSelector } from '../utils/selectors'

/**
 * It returns a header with a logo, a link to the home page, and a link to the signin page if the user
 * is not connected, and a link to the home page and a link to sign out if the user is connected
 * @returns A header with a logo and a link to the signin page.
 */

const Header = () => {
  const connected = useSelector(state => state.user.status === 'connected')
  const { firstName } = useSelector(state => userInfosSelector(state))

  return (
    <header className='main-nav'>
      <Link to="/" className='main-nav-logo'>
        <img className='main-nav-logo-image' src={logo} alt='logo' />
      </Link>
      {connected ? (
        <Link to='/' className='main-nav-item'>
        <span className='circle-user'>
          <i className="fa fa-user-circle"></i>
        </span>
          {firstName}
          <span className='user-out'>
            <i className="fa-solid fa-right-from-bracket"></i>
          </span>
          Sign Out
        </Link>
      ) : (
        <Link to="/signin" className='main-nav-item'>
          <span className='user'>
          <i className="fa-solid fa-circle-user"></i>
        </span>
          Sign In
        </Link>
      )}
    </header>
  )
}

export default Header
