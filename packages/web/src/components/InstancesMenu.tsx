// Third-party libraries
import { FC, Fragment } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Custom components
import Header from "./Header";

// App state and data fetching
import ChimeMessagingService from "../services/ChimeMessagingService.ts";
import { useStore } from "../store";

// Custom types
import { InstanceType } from "../types/InstanceType.ts";

const InstancesMenu: FC = () => {
  const queryClient = useQueryClient();
  const chimeMessagingService = new ChimeMessagingService();

  const { appInstanceARN, reset, setAppInstanceARN, setAppInstanceName, setSessionEndpoint } = useStore();
  
  const endpoint = useQuery({
    queryKey: ["endpoint"],
    queryFn: () => chimeMessagingService.getSessionEndpoint(),
    onSuccess: data => setSessionEndpoint(data.data.Endpoint.Url),
  })

  const instances = useQuery({
    queryKey: ["instances"],
    queryFn: () => chimeMessagingService.listInstances(),
  });

  const newInstance = useMutation({
    mutationFn: () => chimeMessagingService.createInstance(),
    onSuccess: (data) => {
      queryClient.setQueryData(["instances"], data);
      setAppInstanceARN(data.data.AppInstanceArn);
      setAppInstanceName(data.data.Name ?? "");
    },
  });

  const createAppInstance = async () => {
    newInstance.mutate();
  };

  if (instances.isError) {
    console.warn(`Error thrown by listInstances: ${instances.error}`);
    return (
      <div className="card">
        Error listing instances, check the console logs
      </div>
    );
  }
  
  if (endpoint.isError) {
    console.warn(`Error thrown by getSessionEndpoint: ${endpoint.error}`);
    return (
      <div className="card">
        Error getting session-endpoint, check the console logs
      </div>
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
        <h6 style={{ color: "#74cb8d", marginBottom: "0.5rem" }}>
          Select a Chat Instance
        </h6>
        {/* Instances list */}
        <div style={{display: "flex", flexDirection: "column", marginBottom: "0.5rem"}}>
          {instances.isSuccess && instances.data?.data.AppInstances ? (
            instances.data.data.AppInstances.map((instance: InstanceType) => (
              <button
                className="primary"
                style={{margin: "0.2rem"}}
                onClick={(e) => {
                  e.preventDefault();
                  setAppInstanceARN(instance.AppInstanceArn);
                  setAppInstanceName(instance.Name!);
                }}
                key={instance.AppInstanceArn}
              >{instance.Name!}</button>
            ))
          ) : (
            <p>No instances found</p>
          )}
        </div>
        {/* Create a New Instance */}
        <h6 style={{
            color: "#74cb8d",
            marginBottom: "0.5rem",
          }}
        >Or create a new Chat Instance</h6>
        <span
          className="secondary"
          onClick={(e) => {
            e.preventDefault();
            createAppInstance();
          }}
          role="button"
        >Create an appInstance</span>
      </div>
    </Fragment>
  );
};

export default InstancesMenu;
