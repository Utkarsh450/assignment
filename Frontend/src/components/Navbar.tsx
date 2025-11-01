import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='w-full h-full flex'>
      <div className='flex font-[satoshi] flex-col gap-4 justify-between overflow-x-hidden'>
        <div>
          <div className='font-medium w-full h-fit p-1 text-2xl text-sky-500 tracking-tight mx-14 mt-10'>ExpensesDiary</div>
          <div className='flex flex-col gap-10 px-14 py-10'>
            <NavLink className={"font-semibold text-xl hover:bg-sky-600/40 w-full h-14 p-2 rounded text-zinc-600"} to="/dashboard">Dashboard</NavLink>
            <NavLink className={"font-semibold text-xl hover:bg-sky-600/40 w-full h-14 p-2 rounded text-zinc-600"} to="/budgets">Budgets</NavLink>
            <NavLink className={"font-semibold text-xl hover:bg-sky-600/40 w-full h-14 p-2 rounded text-zinc-600"} to="/expenses">Expenses</NavLink>
          </div>
        </div>
        <div className='flex gap-4 items-center px-10 py-10'>

          <div className='w-10 h-10 rounded-full bg-red-500'></div>
          <div className='font-semibold text-lg'>Profile</div>
        </div>
      </div>
      <div className='w-[0.1rem] h-full overflow-y-auto bg-zinc-500'></div>
    </div>
  )
}

export default Navbar