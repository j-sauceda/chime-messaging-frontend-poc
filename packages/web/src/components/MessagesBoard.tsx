// Third-party libraries
import { ChangeEvent, FC, Fragment, useState } from "react";
import { ChimeSDKMessagingClient, ChimeSDKMessagingClientConfig } from "@aws-sdk/client-chime-sdk-messaging";
import { AwsCredentialIdentity, EndpointV2 } from "@smithy/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDistance } from "date-fns";

import {
  ConsoleLogger,
  DefaultMessagingSession,
  LogLevel,
  Message,
  MessagingSessionConfiguration,
  PrefetchOn
} from "amazon-chime-sdk-js";

// Custom components
import Header from "./Header";

// App state and data fetching
import { useStore } from "../store";
import ChimeMessagingService from "../services/ChimeMessagingService.ts";

// Custom types & variables
import { MessageType } from "../types/MessageType.ts";
type UserCredentials = {
  AccessKeyId: string;
  SecretAccessKey: string;
  SessionToken: string;
  Expiration: Date;
};

const MessagesBoard: FC = () => {
  const chimeMessagingService = new ChimeMessagingService();
  const { channelARN, channelName, reset, sessionEndpoint, userARN } = useStore();

  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);

  const sessionId = crypto.randomUUID();
  const logger = new ConsoleLogger("SDK", LogLevel.INFO);
  
  const userCredentials = useQuery({
    queryKey: ["credentials"],
    queryFn: () => chimeMessagingService.getCredentials(userARN),
    enabled: !!userARN,
  });
  
  let myCredentials = {} as unknown as UserCredentials;
  if (userCredentials.data) {
    myCredentials = userCredentials.data.data.Credentials;
  }
  
  const channelEndpoint: EndpointV2 = { url: new URL(`wss://${sessionEndpoint}`) };
  
  const clientConfig: ChimeSDKMessagingClientConfig = {
    credentials: {
      accessKeyId: myCredentials.AccessKeyId,
      expiration: myCredentials.Expiration,
      secretAccessKey: myCredentials.SecretAccessKey,
      sessionToken: myCredentials.SessionToken
    } as AwsCredentialIdentity,
    region: "us-east-1",
    endpoint: channelEndpoint,
  }

  const chime = new ChimeSDKMessagingClient(clientConfig);

  const sessionConfig = new MessagingSessionConfiguration(
    userARN,
    sessionId,
    sessionEndpoint,
    chime,
  );
  
  sessionConfig.prefetchOn = PrefetchOn.Connect;
  
  console.log(
    `chime client credentials: ${JSON.stringify(chime.config.credentials())}`,
  );
  console.log(
    `configuration.messagingSessionId: ${sessionConfig.messagingSessionId}`,
  );

  const messagingSession = new DefaultMessagingSession(sessionConfig, logger);

  const observer = {
    messagingSessionDidStart: () => {
      console.log("*** messagingSession started");
    },
    messagingSessionDidStartConnecting: (reconnecting: boolean) => {
      if (reconnecting) {
        console.log("*** messagingSession reconnecting");
      } else {
        console.log("*** messagingSession connecting");
      }
    },
    messagingSessionDidStop: (event: CloseEvent) => {
      console.log(`*** messagingSession closed: ${event?.code} ${event?.reason}`);
    },
    messagingSessionDidReceiveMessage: (message: Message) => {
      console.log(`*** messagingSession message received type ${JSON.stringify(message)}`);
      setMessages([ ...messages, message as unknown as MessageType]);
    },
  };

  messagingSession.addObserver(observer);
  messagingSession.start().then(
    () => console.log("*** messagingSession started"),
    (reason) =>
      console.error(`*** messagingSession failed to start: ${JSON.stringify(reason)}`),
  );
  
  const onLeaveSession = () => {
    messagingSession.removeObserver(observer);
    messagingSession.stop();
    reset();
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setContent(e.target.value);
  };

  const sendMessage = useMutation({
    mutationFn: () =>
      chimeMessagingService.createMessage(channelARN, content, userARN),
    onSuccess: () => {
      setContent("");
    },
  });

  return (
    <Fragment>
      <Header text={"Leave Chat"} onClickButton={onLeaveSession} />
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
        <h6 style={{ color: "#74cb8d", marginBottom: "0.5rem" }}>"{channelName}" Conversation</h6>
        <label htmlFor="text-message">Send message</label>
        <input 
          id="text-message" 
          name="text-message" 
          onChange={handleChange}
          placeholder="Enter a new text message" 
          type="text" 
          value={content}
          required
        />
        <span
          className="primary"
          onClick={(e) => {
            e.preventDefault();
            sendMessage.mutate();
          }}
          role="button"
        >Send</span>
      </div>
      {/* Messages list */}
      <div style={{display: "flex", flexDirection: "column", marginBottom: "0.5rem"}}>
        {messages.data?.data.ChannelMessages.map((msg: MessageType) => (
          <div key={msg.MessageId}
            style={{
              backgroundColor: msg.Sender?.Arn === userARN ? "lightblue" : "lightgray",
              borderRadius: "5px",
              marginBottom: "0.5rem",
              marginLeft: msg.Sender?.Arn === userARN && "10rem",
              marginRight: msg.Sender?.Arn !== userARN && "10rem",
            }}
          >
            <strong>{msg.Sender?.Name}</strong>
            <small>
              {` (${formatDistance(
                new Date(),
                new Date(msg.CreatedTimestamp!),
              )} ago):`}
            </small>
            <br/>
            {msg.Content}
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default MessagesBoard;
