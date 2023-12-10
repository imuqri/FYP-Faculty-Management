import React from "react";
import AddEquipment from "../components/AddEquipment";
import AddSoftware from "../components/AddSoftware";
import Account from "../components/Account";
import AddUser from "../components/AddUser";
import SoftwareList from "../components/SoftwareList";
import EquipmentList from "../components/EquipmentList";
import UserList from "../components/UserList";

const Main = () => {
  return (
    <div className="mb-5">
      <h1>ALL COMPONENT</h1>

      <div>
        <Account />
      </div>
      <div>
        <AddUser />
      </div>
      <div>
        <UserList />
      </div>
      <div>
        <AddSoftware />
      </div>
      <div>
        <SoftwareList />
      </div>
      <div>
        <AddEquipment />
      </div>
      <div>
        <EquipmentList />
      </div> 
      <div>
        
      </div>
      <div>

      </div>
      <div>

      </div>
    </div>
  );
};

export default Main;
