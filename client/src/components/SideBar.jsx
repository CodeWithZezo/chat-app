import React, { use, useEffect, useState } from "react";
import { useUserStore } from "../zustand/user";
import {useMessageStore} from "../zustand/message";
import {useAuthStore} from "../zustand/auth"
const SideBar = () => {
  const { users, fetchUsers, isDataFetched } = useUserStore();
  const { fetchMessages, setCurrentChatId } = useMessageStore();
  const { user } = useAuthStore()
  useEffect(() => {
    fetchUsers();
  }, []);

  if(isDataFetched){
    console.log("Users in SideBar:", users);
    console.log(user);
    
  }

  const openChat = (userId) => {
    setCurrentChatId(userId);
    fetchMessages(userId);
  };

  return (
     <div className="h-screen w-80 bg-base-200 overflow-y-auto">
      <div className="p-4 border-b border-base-300">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>
      
      <div className="p-2">
        {!isDataFetched ? (
          // Skeleton loading state
          <>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-3 mb-2 bg-base-100 rounded-lg">
                <div className="skeleton h-12 w-12 shrink-0 rounded-full"></div>
                <div className="flex-1">
                  <div className="skeleton h-4 w-24 mb-2"></div>
                  <div className="skeleton h-3 w-32"></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          // Actual user list
          <>
            {users.map((u) => (
              <div 
              onClick={() => openChat(u._id)}
                key={u._id} 
                className="flex items-center gap-3 p-3 mb-2 bg-base-100 rounded-lg hover:bg-base-300 transition-colors cursor-pointer"
              >
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full">
                    <img src={u.profilePic} alt={`${u.username}'s profile`} />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold">{u._id === user._id ? `You (${u.username})`  : u.username}</h2>
                  <p className="text-sm text-base-content/60">Online</p>
                </div>
                <div className="badge badge-success badge-xs"></div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>


  );
};

export default SideBar;
