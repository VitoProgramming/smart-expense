import Link from 'next/link'
import { DocumentData } from 'firebase/firestore'
import Category from './Category'
import { useGlobalContext } from '@/app/context/store'
import categoryIcon from '/public/category-icon.png'
import categoryAddIcon from '/public/category-add-icon.png'

export default function Result() {
  const { receiptCategories } = useGlobalContext()
  const incomeCategories = receiptCategories.filter(
    (receiptCategory: DocumentData) => receiptCategory.type === '收入'
  )
  return (
    <div className='flex flex-col items-center w-[935px] min-h-[500px] m-auto bg-gray rounded-[20px] pb-[30px] mt-[209px]'>
      <div className='flex bg-[#F4F4F4] rounded-t-[20px] w-full mb-[20px]'>
        <Link
          href='/dashboard/category-expense'
          className='w-full bg-[#F4F4F4] rounded-tl-[20px] rounded-r-[20px] py-[5px] text-center'
        >
          <button>支出</button>
        </Link>
        <Link
          href='/dashboard/category-income'
          className='w-full bg-[#A8A8A8] py-[5px] text-center rounded-[20px]'
        >
          <button>收入</button>
        </Link>
        <Link
          href='/dashboard/category-transfer'
          className='w-full bg-[#F4F4F4] rounded-tr-[20px] py-[5px] text-center'
        >
          <button>轉帳</button>
        </Link>
      </div>
      <div className='self-start pl-[20px] mb-[50px]'>
        <h2>收入分類</h2>
      </div>
      <div className='grid w-full grid-cols-3 gap-y-[90px]'>
        {incomeCategories &&
          incomeCategories.map(
            (incomeCategory: DocumentData, index: number) => (
              <Category
                key={index}
                src={categoryIcon}
                categoryName={incomeCategory.name}
              />
            )
          )}
        <Link href='/dashboard/category-income-add-item'>
          <Category src={categoryAddIcon} categoryName='新增' />
        </Link>
      </div>
    </div>
  )
}
