export type MessageType = {
  ChannelArn?: string;
  MessageId: string;
  Status: {
    Value: string;
  };
  CreatedTimestamp?: string;
  Content?: string;
  LastUpdatedTimestamp?: string;
  Redacted?: boolean;
  Sender?: {
    Arn: string;
    Name: string;
  };
  Type?: string;
};
