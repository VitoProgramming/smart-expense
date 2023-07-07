'use client'
import { ChangeEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  collection,
  getDocs,
  setDoc,
  doc,
  DocumentData,
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import {
  getReceiptCategoriesSnap,
  getBudgetsSnap,
} from '@/app/utils/getDocSnap'
import { UID } from '@/app/utils/uid'
import { useGlobalContext } from '@/app/context/store'
import cancelIcon from '/public/cancel.png'
import categoryIcon from '/public/category-icon.png'
import dollarSign from '/public/dollar-sign.png'
import descriptionIcon from '/public/description-icon.png'
import calendar from '/public/calendar.png'
import necessityIcon from '/public/necessity-icon.png'

const categories = {
  bank: '銀行',
  eTicket: '電子票證',
  manual: '手動新增',
}

interface ExpenseReceiptObject {
  category: string
  amounts: number | string
  description: string
  createdTime: number | string
  account: string
}

export default function NewItem() {
  const [expenseReceipt, setExpenseReceipt] = useState<ExpenseReceiptObject>({
    category: '',
    amounts: '',
    description: '',
    createdTime: '',
    account: '',
  })

  const [expenseCategories, setExpenseCategories] = useState<DocumentData[]>([])
  const [budgetDetails, setBudgetDetails] = useState<DocumentData[]>([])

  const allAccounts: DocumentData[] = useGlobalContext().allAccounts

  const selectedAccount = getAccountData()
  const accountID = getAccountData()?.id

  function getAccountData() {
    const selectedAccount = allAccounts.filter(
      item => item.name === expenseReceipt.account
    )
    return selectedAccount[0]
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target
    setExpenseReceipt(prev => ({ ...prev, [name]: value }))
  }

  const addNewReceipt = async (accountID: string) => {
    if (
      !expenseReceipt.category ||
      !expenseReceipt.amounts ||
      !expenseReceipt.description ||
      !expenseReceipt.createdTime ||
      !expenseReceipt.account
    )
      return
    try {
      const receiptsRef = doc(
        collection(db, 'users', UID, 'accounts', accountID, 'receipts')
      )
      await setDoc(receiptsRef, {
        category: expenseReceipt.category,
        amounts: Number(-expenseReceipt.amounts),
        description: expenseReceipt.description,
        createdTime: expenseReceipt.createdTime,
        account: expenseReceipt.account,
        type: '支出',
      })
      console.log('Document written with ID: ', receiptsRef)
    } catch (error) {
      console.log('Error adding document ', error)
    }
    setExpenseReceipt({
      category: '',
      amounts: '',
      description: '',
      createdTime: '',
      account: ',',
    })
  }

  const popUpNotification = () => {
    budgetDetails.forEach(budgetDetail => {
      if (
        expenseReceipt.account === budgetDetail.account &&
        expenseReceipt.category === budgetDetail.expenseCategory &&
        expenseReceipt.createdTime > budgetDetail.startTime &&
        expenseReceipt.createdTime < budgetDetail.endTime &&
        Number(expenseReceipt.amounts) > budgetDetail.amounts / 2 &&
        Number(expenseReceipt.amounts) < budgetDetail.amounts
      ) {
        alert('該筆支出已超過預算的一半')
      } else if (
        expenseReceipt.account === budgetDetail.account &&
        expenseReceipt.category === budgetDetail.expenseCategory &&
        expenseReceipt.createdTime > budgetDetail.startTime &&
        expenseReceipt.createdTime < budgetDetail.endTime &&
        Number(expenseReceipt.amounts) > budgetDetail.amounts
      ) {
        alert('該筆支出已超過預算')
      }
    })
  }

  const updateAccountBalance = async (accountID: string) => {
    if (
      !expenseReceipt.category ||
      !expenseReceipt.amounts ||
      !expenseReceipt.description ||
      !expenseReceipt.createdTime ||
      !expenseReceipt.account
    )
      return
    try {
      const accountRef = doc(db, 'users', UID, 'accounts', accountID)

      await setDoc(accountRef, {
        balance: selectedAccount.balance - Number(expenseReceipt.amounts),
        category: selectedAccount.category,
        name: selectedAccount.name,
      })
    } catch (error) {
      console.log('Error setting a document', error)
    }
  }

  useEffect(() => {
    getReceiptCategoriesSnap().then(res => {
      setExpenseCategories(res.filter(doc => doc.type === '支出'))
    })
  }, [])

  useEffect(() => {
    getBudgetsSnap().then(res => setBudgetDetails(res))
  }, [])

  return (
    <div className='flex flex-col items-center w-[935px] min-h-[500px] m-auto bg-gray rounded-[20px] pb-[30px] mt-[209px] pt-[30px]'>
      <div className='px-[20px] flex justify-between w-full mb-[30px]'>
        <Link href='/dashboard/receipts-expense-category'>
          <Image src={cancelIcon} alt='cancel' className='object-cover' />
        </Link>
        <button
          onClick={() => {
            addNewReceipt(accountID)
            updateAccountBalance(accountID)
            popUpNotification()
          }}
        >
          完成
        </button>
      </div>
      <div className='self-start pl-[80px] mb-[30px]'>
        <h1>新增支出</h1>
      </div>
      <div className='w-[500px]'>
        <div className='flex gap-x-[50px] items-center pb-[15px] mb-[30px]'>
          <div>
            <Image
              src={categoryIcon}
              alt='category icon'
              className='w-[45px] h-auto'
            />
          </div>
          <div className='border-b w-full flex flex-col gap-y-[5px]'>
            <label htmlFor='category'>類別</label>
            <select
              required
              id='category'
              name='category'
              className='outline-0 bg-[transparent] invalid:text-[#a4a4a4]'
              value={expenseReceipt.category}
              onChange={handleChange}
            >
              <option disabled value=''>
                選擇類別
              </option>
              {expenseCategories &&
                expenseCategories.map(expenseCategory => (
                  <option
                    key={expenseCategory.name}
                    value={expenseCategory.name}
                  >
                    {expenseCategory.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className='flex gap-x-[50px] items-center pb-[15px] mb-[30px]'>
          <div>
            <Image
              src={dollarSign}
              alt='dollar sign'
              className='w-[45px] h-auto'
            />
          </div>
          <div className='border-b w-full flex flex-col'>
            <label htmlFor='amounts'>金額</label>
            <input
              className='outline-0 bg-[transparent]'
              id='amounts'
              name='amounts'
              value={expenseReceipt.amounts}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='flex items-center gap-x-[50px] pb-[15px] mb-[30px]'>
          <div>
            <Image
              src={descriptionIcon}
              alt='description icon'
              className='w-[45px] h-auto'
            />
          </div>
          <div className='flex flex-col w-full'>
            <label htmlFor='description'>明細描述</label>
            <input
              className='border-b outline-0 bg-[transparent]'
              id='description'
              name='description'
              value={expenseReceipt.description}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='flex items-center gap-x-[50px] pb-[15px] mb-[30px]'>
          <div>
            <Image
              src={calendar}
              alt='calendar icon'
              className='w-[45px] h-auto'
            />
          </div>
          <div className='flex flex-col w-full'>
            <label htmlFor='createdTime'>日期</label>
            <input
              type='date'
              className='border-b outline-0 bg-[transparent]'
              id='createdTime'
              name='createdTime'
              value={expenseReceipt.createdTime}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='flex items-center gap-x-[50px] pb-[15px] mb-[30px]'>
          <div>
            <Image
              src={necessityIcon}
              alt='necessity icon'
              className='w-[45px] h-auto'
            />
          </div>
          <div className='flex flex-col w-full gap-y-[5px] border-b '>
            <label htmlFor='account'>帳戶</label>
            <select
              required
              className='outline-0 bg-[transparent] invalid:text-[#a4a4a4]'
              id='account'
              name='account'
              value={expenseReceipt.account}
              onChange={handleChange}
            >
              <option disabled value=''>
                選擇帳戶
              </option>
              <optgroup label={categories.bank}>
                {allAccounts &&
                  allAccounts
                    .filter(account => account.category === categories.bank)
                    .map(account => (
                      <option key={account.name}>{account.name}</option>
                    ))}
              </optgroup>
              <optgroup label={categories.eTicket}>
                {allAccounts &&
                  allAccounts
                    .filter(account => account.category === categories.eTicket)
                    .map(account => (
                      <option key={account.name}>{account.name}</option>
                    ))}
              </optgroup>
              <optgroup label={categories.manual}>
                {allAccounts &&
                  allAccounts
                    .filter(account => account.category === categories.manual)
                    .map(account => (
                      <option key={account.name}>{account.name}</option>
                    ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
