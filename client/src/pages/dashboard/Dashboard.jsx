import React from 'react'
import SideBar from '../../components/SideBar'
import ChatWindow from '../../components/chatWindow'
const Dashboard = () => {
  return (
    <main className="flex h-screen">
      <SideBar />
      <ChatWindow />
    </main>
  )
}

export default Dashboard