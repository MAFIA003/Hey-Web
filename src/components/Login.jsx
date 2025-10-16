// src/components/Login.jsx
import { useState } from 'react';
import { Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import './Login.css';
import { auth } from '../firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';

function Login() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) => alert(error.message));
  };

  const handlePasswordReset = () => {
  if (!email) {
    return alert("Please enter your email address to reset your password.");
  }
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent! Please check your inbox.");
    })
    .catch((error) => alert(error.message));
};

  const handleAuth = (e) => {
    e.preventDefault();
    if (isLoginView) {
      // Sign In Logic
      signInWithEmailAndPassword(auth, email, password)
        .catch((error) => alert(error.message));
    } else {
      // Sign Up / Create Account Logic
      if (name.trim() === "") {
        return alert("Please enter a name.");
      }

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // After creating the user, update their profile with the name
          return updateProfile(userCredential.user, {
            displayName: name,
          });
        })
        .catch((error) => alert(error.message));
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <img
          src="logo.png"
          alt="Hey Web Logo"
        />
        <div className="login__text">
          <h1>{isLoginView ? 'Sign in to Hey Web' : 'Create an Account'}</h1>
        </div>

        <form onSubmit={handleAuth} className="login__form">
          {!isLoginView && (
            <TextField
              label="Full Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
          )}
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                name="showPassword"
                color="primary"
              />
            }
            label="Show password"
            className="login__showPassword"
          />

          {/* 3. ADD THE "FORGOT PASSWORD" LINK FOR THE LOGIN VIEW */}
          {isLoginView && (
            <p className="login__forgotPassword" onClick={handlePasswordReset}>
              Forgot Password?
            </p>
          )}
          <Button type="submit" className="login__authButton">
            {isLoginView ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="login__separator">
          <span>OR</span>
        </div>

        <Button onClick={signInWithGoogle} className="login__googleButton">
          Sign In With Google
        </Button>

        <p className="login__toggleView" onClick={() => setIsLoginView(!isLoginView)}>
          {isLoginView
            ? "Don't have an account? Create one"
            : 'Already have an account? Sign In'}
        </p>
      </div>
    </div>
  );
}

export default Login;