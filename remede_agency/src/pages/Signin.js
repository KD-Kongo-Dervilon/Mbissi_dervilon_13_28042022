import { useEffect, useState, useRef } from "react"
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signinUser, setRememberMe, getUserProfile } from "../utils/slices/userIdSlice"
import { rememberMeSelector, statusSelector, userInfosSelector } from "../utils/selectors"


/**
 * It's a component that renders a form to sign in a user
 * @returns A React component
 */
const Signin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formValidator, setFormValidator] = useState(false)

  const emailError = useRef(null)
  const passwordError = useRef(null)

  const connected = useSelector(state => statusSelector(state) === 'connected')
  const rememberMe = useSelector(state => rememberMeSelector(state) === true)
  const userId = useSelector(state => userInfosSelector(state).id)

  // Auto-displays user email on demand
  useEffect(() => {
    if (rememberMe &&
      localStorage.ARGENTBANK_userInfos &&
      localStorage.ARGENTBANK_userInfos.email !== null) {
      setEmail(JSON.parse(localStorage.ARGENTBANK_userInfos).email)
      document.querySelector('#remember-me').setAttribute('checked', true)
    }
  }, [rememberMe])

  // Fetch USERPROFILE if access granted
  useEffect(() => {
    if (connected) {
      const token = sessionStorage.ARGENTBANK_token
      dispatch(getUserProfile(token))
    }
  }, [connected])

  // Navigate to USER PAGE with ID if profile fetched
  useEffect(() => {
    if (connected) {
      navigate(`/user/${userId}`)
    }
  }, [userId])

  // Dispatch user's credentials to gain access to user's Page
  function logIn(e) {
    e.preventDefault()
    if (!formValidator) {
      return
    }
    // Third arg for remeberMe
    if (e.target[2].checked) {
      dispatch(signinUser(email, password, true))
    } else {
      dispatch(signinUser(email, password))
    }
  }

  // Validate each input and sets value for email & password
  function validateForm(type, value) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    switch (type) {
      case 'email':
        setEmail(value)
        if (!emailRegex.test(value)) {
          emailError.current.className = 'error-msg error-show'
          setFormValidator(false)
          return
        } else {
          emailError.current.className = 'error-msg'
        }
        break
      default:
        setPassword(value)
        if (value.length < 6) {
          passwordError.current.className = 'error-msg error-show'
          setFormValidator(false)
          return
        } else {
          passwordError.current.className = 'error-msg'
        }
        break
    }
    setFormValidator(true)
  }

  function toggleRememberMe() {
    dispatch(setRememberMe(!rememberMe))
  }

  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form onSubmit={e => logIn(e)}>
          <div className="input-wrapper">
            <label htmlFor="usermail">User Mail</label>
            <input
              type="text"
              id="usermail"
              onChange={e => validateForm('email', e.target.value)}
              value={email}
            />
            <div className="error-msg" ref={emailError}>This is not a correct email</div>
          </div>
          <div className="input-wrapper">
            <label htmlFor="userpassword">Password</label>
            <input
              type="password"
              id="userpassword"
              onChange={e => validateForm('password', e.target.value)}
            />
            <div className="error-msg" ref={passwordError}>Password should be at least 6 characters long</div>
          </div>
          <div className="input-remember">
            <input type="checkbox" id="remember-me" onClick={toggleRememberMe} />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <input className="sign-in-button" type="submit" value="Sign In" />
        </form>
        <Link to="/signup"> <span className="marge-right">No account ?</span> Signup here</Link>
      </section>
    </main>
  )
}

export default Signin