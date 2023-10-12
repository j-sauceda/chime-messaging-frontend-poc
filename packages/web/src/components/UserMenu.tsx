// Third-party libraries
import { ChangeEvent, FC, Fragment } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

// Custom components
import Header from "./Header";

// App state and data fetching
import ChimeMessagingService from "../services/ChimeMessagingService.ts";
import { useStore } from "../store";

// Custom types
import { UserType } from "../types/UserType.ts";

const UserMenu: FC = () => {
  const chimeMessagingService = new ChimeMessagingService();

  const { appInstanceARN, userName, reset, setUserARN, setUserName } = useStore();

  const users = useQuery({
    queryKey: ["users"],
    queryFn: () => chimeMessagingService.listUsers(appInstanceARN),
    enabled: !!appInstanceARN,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUserName(e.target.value);
  };

  const newUser = useMutation({
    mutationFn: () =>
      chimeMessagingService.createUser(
        appInstanceARN,
        crypto.randomUUID(),
        userName,
      ),
    onSuccess: (data) => {
      setUserARN(data.data.AppInstanceUserArn);
    },
  });

  if (users.isError) {
    console.warn(`Error thrown by listUsers: ${users.error}`);
    return (
      <div className="card">Error listing users, check the console logs</div>
    );
  }

  return (
    <Fragment>
      <Header text={"Reset App"} onClickButton={reset} />
      <div 
        className="card"
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          marginBottom: "1rem", 
          marginTop: "3rem" 
        }}
      >
        <h6 style={{ color: "#74cb8d", marginBottom: "0.5rem" }}>Create a new User</h6>
        <label htmlFor="username">User name</label>
        <input 
          id="username" 
          name="username" 
          onChange={handleChange}
          placeholder="Choose a nickname" 
          type="text" 
          value={userName}
          required
        />
        <span
          className="secondary"
          onClick={(e) => {
            e.preventDefault();
            newUser.mutate();
          }}
          role="button"
        >Create User</span>
        {/* Select User from list */}
        <h6 style={{ color: "#74cb8d", marginTop: "1rem", marginBottom: "0.5rem" }}>
          Or select an existing User
        </h6>
        <div style={{display: "flex", flexDirection: "column", marginBottom: "0.5rem"}}>
          {users.isSuccess &&
            users.data?.data.AppInstanceUsers.map((user: UserType) => (
              <button
                className="primary"
                key={user.AppInstanceUserArn}
                onClick={(e) => {
                  e.preventDefault();
                  setUserARN(user.AppInstanceUserArn);
                  setUserName(user.Name!);
                }}
                role="button"
                style={{ marginBottom: "0.3rem" }}
              >{user.Name!}</button>
            ))}
        </div>
      </div>
    </Fragment>
  );
};

export default UserMenu;
