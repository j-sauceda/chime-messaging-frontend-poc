import AxiosBase from "./AxiosBase.ts";

const CREATE_CHANNEL_URL = "createChannel";
const CREATE_INSTANCE_URL = "createInstance";
const CREATE_MESSAGE_URL = "createMessage";
const CREATE_USER_URL = "createUser";
const JOIN_CHANNEL_URL = "joinChannel";
const LIST_CHANNELS_URL = "listChannels";
const LIST_INSTANCES_URL = "listInstances";
const LIST_MESSAGES_URL = "listMessages";
const LIST_USERS_URL = "listUsers";
const DELETE_CHANNEL_URL = "deleteChannel";
const DELETE_INSTANCE_URL = "deleteInstance";
const DELETE_MESSAGE_URL = "deleteMessage";
const DELETE_USER_URL = "deleteUser";
const GET_CREDENTIALS_URL = "getCredentials";
const GET_SESSION_ENDPOINT_URL = "getSessionEndpoint";

import { ChannelType } from "../types/ChannelType.ts";
import { CredentialType } from "../types/CredentialType";
import { InstanceType } from "../types/InstanceType.ts";
import { MetadataType } from "../types/CommonTypes.ts";
import { MessageType } from "../types/MessageType.ts";
import { UserType } from "../types/UserType.ts";

type ChannelsListType = {
  Channels: ChannelType[];
} & MetadataType;

type InstancesListType = {
  AppInstances: InstanceType[];
} & MetadataType;

type MessagesListType = {
  ChannelMessages: MessageType[];
} & ChannelType &
  MetadataType;

type UsersListType = {
  AppInstanceUsers: UserType[];
} & InstanceType &
  MetadataType;

type UserCredentials = CredentialType & MetadataType;

type SessionEndpointType = {
  Endpoint: {
    Url: string;
  };
};

class ChimeMessagingService extends AxiosBase {
  async createChannel(
    appInstanceARN: string,
    channelName: string,
    channelId: string,
    appInstanceUserARN: string,
  ) {
    const params = {
      appInstanceARN,
      channelName,
      channelId,
      appInstanceUserARN,
    };
    return this.axiosInstance.post<ChannelType & MetadataType>(
      CREATE_CHANNEL_URL,
      params,
    );
  }

  async createInstance() {
    const params = { instanceName: "ChimeMessagingPOC" };
    return this.axiosInstance.post<InstanceType & MetadataType>(
      CREATE_INSTANCE_URL,
      params,
    );
  }

  async createMessage(
    channelARN: string,
    content: string,
    appInstanceUserARN: string,
  ) {
    const params = { channelARN, content, appInstanceUserARN };
    return this.axiosInstance.post<MessageType & MetadataType>(
      CREATE_MESSAGE_URL,
      params,
    );
  }

  async createUser(appARN: string, userId: string, userName: string) {
    const params = { appARN, userId, userName };
    return this.axiosInstance.post<UserType & MetadataType>(
      CREATE_USER_URL,
      params,
    );
  }

  async joinChannel(channelARN: string, appInstanceUserARN: string) {
    const params = { channelARN, appInstanceUserARN };
    return this.axiosInstance.post(JOIN_CHANNEL_URL, params);
  }

  async listChannels(appInstanceARN: string, appInstanceUserARN: string) {
    return this.axiosInstance.post<ChannelsListType>(LIST_CHANNELS_URL, {
      appInstanceARN,
      appInstanceUserARN,
    });
  }

  async listInstances() {
    return this.axiosInstance.get<InstancesListType>(LIST_INSTANCES_URL);
  }

  async listMessages(channelARN: string, appInstanceUserARN: string) {
    return this.axiosInstance.post<MessagesListType>(LIST_MESSAGES_URL, {
      channelARN,
      appInstanceUserARN,
    });
  }

  async listUsers(appInstanceARN: string) {
    return this.axiosInstance.post<UsersListType>(LIST_USERS_URL, {
      appInstanceARN,
    });
  }

  async deleteChannel(channelARN: string, appInstanceUserARN: string) {
    const params = { channelARN, appInstanceUserARN };
    return this.axiosInstance.delete(DELETE_CHANNEL_URL, {
      data: { ...params },
    });
  }

  async deleteInstance(appInstanceARN: string) {
    const params = { appInstanceARN };
    return this.axiosInstance.delete(DELETE_INSTANCE_URL, {
      data: { ...params },
    });
  }

  async deleteMessage(
    channelARN: string,
    messageId: string,
    appInstanceUserARN: string,
  ) {
    const params = { channelARN, messageId, appInstanceUserARN };
    return this.axiosInstance.delete(DELETE_MESSAGE_URL, {
      data: { ...params },
    });
  }

  async deleteUser(appInstanceUserARN: string) {
    const params = { appInstanceUserARN };
    return this.axiosInstance.delete(DELETE_USER_URL, { data: { ...params } });
  }

  async getCredentials(appInstanceUserARN: string) {
    const url = `${GET_CREDENTIALS_URL}?appInstanceUserARN=${appInstanceUserARN}`;
    return this.axiosInstance.get<UserCredentials>(url);
  }

  async getSessionEndpoint() {
    return this.axiosInstance.get<SessionEndpointType>(GET_SESSION_ENDPOINT_URL);
  }
}

export default ChimeMessagingService;
