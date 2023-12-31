'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useGlobalContext } from '@/app/context/store'
import { SiWebmoney } from 'react-icons/si'
import { AiOutlineMenu } from 'react-icons/ai'
import logo from '/public/logo.svg'

interface HeaderProps {
  positionStyle?: string
  isMenubarStyle?: string
  isLogoStyle?: string
}

export default function Header(props: HeaderProps) {
  const { positionStyle, isMenubarStyle, isLogoStyle } = props
  const { user, googleSignIn, logOut, setIsSidebar } = useGlobalContext()
  const [loading, setLoading] = useState(true)

  const handleSignIn = async () => {
    try {
      await googleSignIn()
    } catch (error) {
      console.log(error)
    }
  }

  const handleSignOut = async () => {
    try {
      await logOut()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClick = () => {
    setIsSidebar(true)
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
      setLoading(false)
    }
    checkAuthentication()
  }, [user])

  return (
    <div className='flex items-center justify-center absolute top-0 right-0 z-10 w-screen h-[80px] border-b border-[#F4F4FC] shadow sm:h-[50px]'>
      <div className='absolute top-[40px] left-[4.1666666667%] translate-y-[-50%] sm:top-[25px]'>
        <h1>
          <Link href='/'>
            <Image src={logo} alt='logo' className={`sm:w-[30px] sm:h-auto ${isLogoStyle || ''}`}/>
          </Link>
          <AiOutlineMenu className={`sm:w-[15px] sm:h-auto sm:cursor-auto ${isMenubarStyle || ''}`} onClick={handleClick}/>
        </h1>
      </div>
      <div className={`flex items-center gap-x-[5px] ${positionStyle} sm:hidden`}>
        <SiWebmoney className='text-primary font-medium' />
        <p className='text-primary text-[20px] font-medium'>Smart Expense</p>
      </div>
      {loading ? (
        <div></div>
      ) : !user ? (
        <div className='absolute top-[40px] right-[4.1666666667%] translate-y-[-50%] sm:top-[25px] sm:text-sm'>
          <p className='text-primary cursor-pointer' onClick={handleSignIn}>
            Login
          </p>
        </div>
      ) : (
        <div className='absolute top-[40px] right-[4.1666666667%] translate-y-[-50%] sm:top-[25px] sm:text-sm'>
          <p className='cursor-pointer text-primary' onClick={handleSignOut}>
            Sign out
          </p>
        </div>
      )}
    </div>
  )
}
