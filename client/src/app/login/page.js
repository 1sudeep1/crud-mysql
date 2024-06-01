'use client'
import { useFormik } from 'formik'
import Link from 'next/link'
import React, { useState } from 'react'
import * as Yup from 'yup';
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter()
  const notify = (msg) => toast(msg);
  const [passwordSeen, setPasswordSeen] = useState(false)
  const handlePassword = () => {
    setPasswordSeen(!passwordSeen)
  }
  const getCharacterValidationError = (str) => {
    return (`Your password must have at least 1 ${str}`)
  }

  //validation done through yup
  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(5, 'password to short').required('please enter a password').matches(/[0-9]/, getCharacterValidationError('digit')).matches(/[a-z]/, getCharacterValidationError('lowercase')).matches(/[A-Z]/, getCharacterValidationError('uppercase')),
    rememberMe: Yup.boolean().oneOf([true], 'Selection is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await handleSave(values)
        resetForm()
      } catch (err) {
        console.error('Error submitting form:', err);
      }
    }
  })

  const handleSave = async (inputItems) => {
    try {
      const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, inputItems)
      const data = await result.data;
      console.log(data, 'sudeep')
      console.log(inputItems.rememberMe)
      if (result.status === 200) {
        notify(data.msg)
        router.push('/')
        if (inputItems.rememberMe) {
          localStorage.setItem('user', JSON.stringify({name: data.user.Name, email: data.user.Email, gender:data.user.Gender }));
        } else {
          sessionStorage.setItem('user', JSON.stringify({name: data.user.Name, email: data.user.Email, gender:data.user.Gender }));
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
          My Company
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="email" name="email" id="email" value={formik.values.email} onChange={formik.handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500">{formik.errors.email}</div>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password </label>
                <div className='relative'>
                  <input type={`${passwordSeen ? 'text' : 'password'}`} name="password" id="password" placeholder="••••••••" value={formik.values.password} onChange={formik.handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                  <FaEye onClick={handlePassword} className={`absolute right-4 top-4 ${passwordSeen ? 'hidden' : null}`} />
                  <FaRegEyeSlash onClick={handlePassword} className={`absolute right-4 top-4 ${passwordSeen ? null : 'hidden'}`} />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500">{formik.errors.password}</div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="remember" name='rememberMe' aria-describedby="remember" type="checkbox" checked={formik.values.rememberMe} onChange={formik.handleChange} className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                  {formik.touched.rememberMe && formik.errors.rememberMe && (
                    <div className="text-red-500">{formik.errors.rememberMe}</div>
                  )}
                </div>
                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
              </div>
              <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <Link href="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login