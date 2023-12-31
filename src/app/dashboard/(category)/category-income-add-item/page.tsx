'use client'
import { ChangeEvent, SyntheticEvent, useState } from 'react'
import { setDoc, doc, collection, DocumentData } from 'firebase/firestore'
import Link from 'next/link'
import { RxCross2 } from 'react-icons/rx'
import { toast } from 'react-toastify'
import { useGlobalContext } from '@/app/context/store'
import { db } from '@/app/lib/firebase'

export default function Page() {
  const { uid, setReceiptCategories } = useGlobalContext()
  const [category, setCategory] = useState({
    name: '',
    type: '收入',
  })

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target
    setCategory(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleClick = (event: SyntheticEvent) => {
    event.preventDefault()
  }

  const addCategory = async () => {
    if (!category.name || !category.type) return
    try {
      const categoryRef = doc(collection(db, 'users', uid, 'receiptCategories'))
      await setDoc(categoryRef, {
        name: category.name,
        type: category.type,
      })
      console.log('Document written with ID: ', categoryRef)
    } catch (error) {
      console.log('Error adding document ', error)
    }
  }

  const syncCategoryDisplayed = () => {
    if (!category.name || !category.type) return
    setReceiptCategories((prev: DocumentData[]) => [
      ...prev,
      {
        name: category.name,
        type: category.type,
      },
    ])
  }

  const resetCategoryField = () => {
    if (!category.name || !category.type) return
    setCategory({
      name: '',
      type: '收入',
    })
  }

  const notify = () => {
    if (!category.name || !category.type) return
    toast.success('新增成功!', {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    })
  }

  return (
    <div className='pl-[150px] pt-[180px]'>
      <form className='flex flex-col max-w-[500px] min-h-[500px] m-auto bg-white rounded-[20px] px-[40px] shadow-md pt-[40px] pb-[60px] relative'>
        <Link
          href='/dashboard/category-income'
          className='absolute top-[20px] right-[20px] '
        >
          <RxCross2 className='text-[20px] font-medium cursor-pointer' />
        </Link>
        <div>
          <h2 className='text-center text-[24px] font-medium mb-[50px]'>
            新增收入分類
          </h2>
        </div>
        <div className='flex flex-col justify-center border-b mb-[60px] '>
          <label
            htmlFor='name'
            className='text-[20px] text-primary font-medium'
          >
            分類名稱
          </label>
          <input
            id='name'
            name='name'
            value={category.name}
            onChange={handleChange}
            className='outline-0 bg-[transparent] text-[18px] placeholder:text-gray'
            placeholder='請輸入分類名稱'
          />
        </div>
        <div className='flex flex-col justify-center border-b mb-[80px]'>
          <label
            htmlFor='type'
            className='text-[20px] text-primary font-medium'
          >
            帳戶類別
          </label>
          <select
            required
            id='type'
            name='type'
            value={category.type}
            onChange={handleChange}
            className='outline-none bg-[transparent] text-[18px] appearance-none cursor-pointer'
          >
            <option>{category.type}</option>
          </select>
        </div>
        <div className='text-center'>
          <button
            className='bg-primary text-white text-[20px] rounded-full w-[150px] py-[10px]'
            onClick={event => {
              handleClick(event)
              addCategory()
              syncCategoryDisplayed()
              resetCategoryField()
              notify()
            }}
          >
            新增
          </button>
        </div>
      </form>
    </div>
  )
}
