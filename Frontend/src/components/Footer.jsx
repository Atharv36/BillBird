import React from 'react'
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className='bg-gray-900 border-t-[0.2px]'>
        <div className="container mx-auto p-4 text-center text-amber-100 flex flex-col lg:flex-row lg:justify-between gap-2 ">
            <p>© All Rights Reserved 2024-2025</p>
            <div className='flex items-center gap-5 justify-center text-3xl'>
                <a href="" >
                    <FaInstagramSquare className='hover:text-green-400'/>
                </a>
                <a href="https://in.linkedin.com/in/atharv-uscoicar-4b50432a0">
                    <FaLinkedin className='hover:text-green-400'/>
                </a>
                <a href="https://github.com/Atharv36">
                    <FaGithub className='hover:text-green-400'/>
                </a>
            </div>
        </div>

    </footer>
    
  )
}

export default Footer