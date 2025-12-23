import React, { use, useEffect, useState } from "react";
import { useUserStore } from "../zustand/user";
const SideBar = () => {
  const { users, fetchUsers, isDataFetched } = useUserStore();
  useEffect(() => {
    fetchUsers();
  }, []);

  if(isDataFetched){
    console.log("Users in SideBar:", users);
  }
  
  return (<>
    {<div className="sidebar">
      {users.map((u) => (<div >{u.username}</div>))}
    </div>}
  </>
  );
};

export default SideBar;
