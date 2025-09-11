

import React from 'react'
import { setAuth,setClear } from '../lib/Reduxs/authSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'


function ProtectedRoute({children}) {
const disptach =useDispatch()
const{user,token}=useSelector((state)=>state.auth)||{}


const {}=useQuery({
   queryKey: ["CurrentUser"],
   queryFn:async()=>{
    const response =await api
   }
})

  return children 
}

export default ProtectedRoute
