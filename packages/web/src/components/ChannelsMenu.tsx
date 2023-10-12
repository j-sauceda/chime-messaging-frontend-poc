// Third-party libraries
import { ChangeEvent, FC, Fragment } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

// Custom components
import Header from "./Header";

// App state and data fetching
import ChimeMessagingService from "../services/ChimeMessagingService.ts";
import { useStore } from "../store";

// Custom types
import { ChannelType } from "../types/ChannelType.ts";

const ChannelsMenu: FC = () => {
  const chimeMessagingService = new ChimeMessagingService();

  const {
    appInstanceARN,
    channelName,
    reset,
    setChannelARN,
    setChannelName,
    userARN,
    userName,
  } = useStore();

  const channels = useQuery({
    queryKey: ["channels"],
    queryFn: () => chimeMessagingService.listChannels(appInstanceARN, userARN),
    enabled: !!(appInstanceARN && userARN),
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setChannelName(e.target.value);
  };

  const newChannel = useMutation({
    mutationFn: () =>
      chimeMessagingService.createChannel(
        appInstanceARN,
        channelName,
        crypto.randomUUID(),
        userARN,
      ),
    onSuccess: (data) => {
      setChannelARN(data.data.ChannelArn);
    },
  });

  const joinChannel = useMutation({
    mutationFn: (channel_arn: string) =>
      chimeMessagingService.joinChannel(channel_arn, userARN),
    onSuccess: () =>
      console.log(`joinChannel called by ${userName}`),
  });

  if (channels.isError) {
    console.warn(`Error thrown by listChannels: ${channels.error}`);
    return (
      <div className="card">Error listing channels, check the console logs</div>
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
        <h6 style={{ color: "#74cb8d", marginBottom: "0.5rem" }}>Create a new Channel</h6>
        <label htmlFor="channelname">Channel name</label>
        <input 
          id="channelname" 
          name="channelname" 
          onChange={handleChange}
          placeholder="Choose a channel name" 
          type="text" 
          value={channelName}
          required
        />
        <span
          className="secondary"
          onClick={(e) => {
            e.preventDefault();
            newChannel.mutate();
          }}
          role="button"
        >Create Channel</span>
        {/* Select Channel from list */}
        <h6 style={{ color: "#74cb8d", marginTop: "1rem", marginBottom: "0.5rem" }}>
          Or select an existing Channel
        </h6>
        <div style={{display: "flex", flexDirection: "column", marginBottom: "0.5rem"}}>
          {channels.isSuccess &&
            channels.data?.data.Channels.map((channel: ChannelType) => (
              <button
                className="primary"
                key={channel.ChannelArn}
                onClick={(e) => {
                  e.preventDefault();
                  setChannelARN(channel.ChannelArn);
                  setChannelName(channel.Name!);
                  joinChannel.mutate(channel.ChannelArn);
                }}
                role="button"
              >{`"${channel.Name}" Channel`}</button>
            ))}
        </div>
      </div>
    </Fragment>
  );
};

export default ChannelsMenu;
