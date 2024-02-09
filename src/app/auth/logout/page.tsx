import React from 'react'
import { deleteCookie } from "cookies-next";
import { redirect } from 'next/navigation';

const Logout = () => {
    deleteCookie('token')
    console.log("Logout")
    return redirect('/auth/login')
}

export default Logout