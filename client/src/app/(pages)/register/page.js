'use client'
import React, { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const Register = () => {
  const router= useRouter()
  const notify = (msg) => toast(msg);
  const [passwordSeen, setPasswordSeen] = useState(false)
  const [conifrmPasswordSeen, setconfirmPasswordSeen] = useState(false)
  const handlePassword = () => {
    setPasswordSeen(!passwordSeen)
  }
  const handleConfirmPassword = () => {
    setconfirmPasswordSeen(!conifrmPasswordSeen)
  }
  const getCharacterValidationError = (str) => {
    return (`Your password must have at least 1 ${str}`)
  }

  //validation done through yup
  const registerSchema = Yup.object().shape({
    fullName: Yup.string().min(2, 'Too Short').max(50, 'Too Long').required('Full Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    gender: Yup.string().required('please choose one'),
    password: Yup.string().min(5, 'password to short').required('please enter a password').matches(/[0-9]/, getCharacterValidationError('digit')).matches(/[a-z]/, getCharacterValidationError('lowercase')).matches(/[A-Z]/, getCharacterValidationError('uppercase')),
    confirmPassword: Yup.string().required('please retype your password').oneOf([Yup.ref('password')], "password doesnot match"),
    isAcceptTerms: Yup.boolean().oneOf([true], 'Selection is required'),

  });

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      gender: '',
      password: '',
      confirmPassword: '',
      isAcceptTerms: false
    },
    validationSchema: registerSchema,
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
      const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, inputItems)
      const data = await result.data
      console.log(data)
      if (result.status === 201) {
        notify(data)
        router.push('/login')
      }
    } catch (err) {
      if (err.response.status === 400) {
        notify(err.response.data)
      }
      throw err;
    }
  }
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-auto lg:py-10">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
          My Company
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>

              <div>
                <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your full name</label>
                <input type="text" name="fullName" id="fullName" value={formik.values.fullName} onChange={formik.handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="your full name" required />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div className="text-red-500">{formik.errors.fullName}</div>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="email" name="email" id="email" value={formik.values.email} onChange={formik.handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500">{formik.errors.email}</div>
                )}
              </div>

              <div>
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Gender</h3>
                <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                    <div className="flex items-center ps-3">
                      <input id="male" type="radio" name="gender" value="male" checked={formik.values.gender === 'male'} onChange={formik.handleChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                      <label htmlFor="male" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Male</label>
                    </div>
                  </li>
                  <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                    <div className="flex items-center ps-3">
                      <input id="female" type="radio" name="gender" value="female" checked={formik.values.gender === 'female'} onChange={formik.handleChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                      <label htmlFor="female" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Female</label>
                    </div>
                  </li>
                  <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                    <div className="flex items-center ps-3">
                      <input id="other" type="radio" name="gender" value="other" checked={formik.values.gender === 'other'} onChange={formik.handleChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                      <label htmlFor="other" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Other</label>
                    </div>
                  </li>
                </ul>
                {formik.touched.gender && formik.errors.gender && (
                  <div className="text-red-500">{formik.errors.gender}</div>
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

              <div>
                <div className='relative'>
                  <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                  <input type={`${conifrmPasswordSeen ? 'text' : 'password'}`} name="confirmPassword" id="confirm-password" placeholder="••••••••" value={formik.values.confirmPassword} onChange={formik.handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                  <FaEye onClick={handleConfirmPassword} className={`absolute right-4 bottom-4 ${conifrmPasswordSeen ? 'hidden' : null}`} />
                  <FaRegEyeSlash onClick={handleConfirmPassword} className={`absolute right-4 bottom-4 ${conifrmPasswordSeen ? null : 'hidden'}`} />
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className="text-red-500">{formik.errors.confirmPassword}</div>
                )}
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input id="terms" aria-describedby="terms" type="checkbox" name="isAcceptTerms" checked={formik.values.isAcceptTerms} onChange={formik.handleChange} className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                </div>
                {formik.touched.isAcceptTerms && formik.errors.isAcceptTerms && (
                  <div className="text-red-500">{formik.errors.isAcceptTerms}</div>
                )}
              </div>

              <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account? <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register
