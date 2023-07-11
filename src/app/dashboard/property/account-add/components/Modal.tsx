import { ChangeEvent, SyntheticEvent } from 'react'
import { setDoc, collection, doc, DocumentData } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { useGlobalContext } from '@/app/context/store'
import Link from 'next/link'
import Button from './Button'

interface ModalProps {
  addAccount: {
    accountName: string
    accountCategory: string
    balance: number | string
  }
  setAddAccount: React.Dispatch<
    React.SetStateAction<{
      accountName: string
      accountCategory: string
      balance: number | string
    }>
  >
}

export default function Modal(props: ModalProps) {
  const { uid, setAllAccounts } = useGlobalContext()

  const categories = ['銀行', '電子票證', '手動新增']

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target
    props.setAddAccount(prev => ({ ...prev, [name]: value }))
  }

  const addAccount = async (event: SyntheticEvent) => {
    event.preventDefault()
    if (
      !props.addAccount.accountName ||
      !props.addAccount.accountCategory ||
      !props.addAccount.balance
    )
      return

    try {
      const accountsRef = doc(collection(db, 'users', uid, 'accounts'))
      await setDoc(accountsRef, {
        name: props.addAccount.accountName,
        category: props.addAccount.accountCategory,
        balance: Number(props.addAccount.balance),
      })
      console.log('Document written with ID: ', accountsRef)
    } catch (error) {
      console.error('Error adding document: ', error)
    }
  }

  const syncAccountsDisplayed = () => {
    setAllAccounts((prev: DocumentData[]) => [
      ...prev,
      {
        name: props.addAccount.accountName,
        category: props.addAccount.accountCategory,
        balance: Number(props.addAccount.balance),
      },
    ])
  }

  const resetAccountField = () => {
    props.setAddAccount({
      accountName: '',
      accountCategory: '',
      balance: '',
    })
  }

  return (
    <form className='max-w-[600px] m-auto mt-[250px]'>
      <div className='border-2 border-gray rounded-[20px] px-[40px] py-[80px] mb-[35px]'>
        <div className='flex flex-col mb-[80px] gap-y-[10px]'>
          <label htmlFor='accountName'>帳戶名稱</label>
          <input
            className='outline-0 border-b border-gray'
            placeholder='輸入自訂的帳戶名稱'
            id='accountName'
            name='accountName'
            value={props.addAccount.accountName}
            onChange={handleChange}
          />
        </div>
        <div className='flex flex-col mb-[80px] gap-y-[10px]'>
          <label htmlFor='accountCategory'>帳戶種類</label>
          <select
            required
            className='outline-0 border-b border-gray invalid:text-gray'
            id='accountCategory'
            name='accountCategory'
            value={props.addAccount.accountCategory}
            onChange={handleChange}
          >
            <option disabled value=''>
              選擇帳戶
            </option>
            {categories.map((category, index) => (
              <option key={index}>{category}</option>
            ))}
          </select>
        </div>
        <div className='flex justify-between border-b border-gray'>
          <label>總額</label>
          <input
            className='outline-0 text-right'
            placeholder='0'
            id='balance'
            name='balance'
            value={props.addAccount.balance}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className='px-[40px] flex justify-between'>
        <Button
          name={'新增'}
          onClick={event => {
            addAccount(event)
            syncAccountsDisplayed()
            resetAccountField()
          }}
        />
        <Link href='/dashboard/property'>
          <Button name={'取消'} />
        </Link>
      </div>
    </form>
  )
}