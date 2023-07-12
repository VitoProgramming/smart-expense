'use client'
import { useState, useEffect } from 'react'
import { useGlobalContext } from '@/app/context/store'
import { SiWebmoney } from 'react-icons/si'

interface HeaderProps {
  title: string
}

export default function Header(props: HeaderProps) {
  const { user, googleSignIn, logOut } = useGlobalContext()
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

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
      setLoading(false)
    }
    checkAuthentication()
  }, [user])

  return (
    <div className='flex items-center justify-between absolute top-0 right-0 z-10 w-[calc(100vw_-_150px)] h-[80px] px-[60px] border-b border-[#F4F4FC] shadow '>
      <h1 className='text-primary'>{props.title}</h1>
      <div className='flex items-center gap-x-[10px]'>
        <SiWebmoney className='text-primary text-[24px]' />
        <p className='text-primary font-bold text-[28px]'>Smart Expense</p>
      </div>
      {loading ? null : !user ? (
        <div>
          <p className='text-primary cursor-pointer' onClick={handleSignIn}>
            Login
          </p>
        </div>
      ) : (
        <div className='flex items-center gap-x-[10px]'>
          <p className='cursor-pointer text-primary' onClick={handleSignOut}>
            Sign out
          </p>
        </div>
      )}
    </div>
  )
}
