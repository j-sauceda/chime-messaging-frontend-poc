import { create } from "zustand";

interface ChatState {
  appInstanceARN: string;
  appInstanceName: string;
  channelARN: string;
  channelName: string;
  isSessionOn: boolean;
  userARN: string;
  userName: string;
  reset: () => void;
  sessionEndpoint: string;
  setAppInstanceARN: (arn: string) => void;
  setAppInstanceName: (name: string) => void;
  setChannelARN: (arn: string) => void;
  setChannelName: (name: string) => void;
  setIsSessionOn: (hasSessionStarted: boolean) => void;
  setSessionEndpoint: (url: string) => void;
  setUserARN: (arn: string) => void;
  setUserName: (name: string) => void;
}

export const useStore = create<ChatState>((set) => ({
  appInstanceARN: "",
  appInstanceName: "",
  channelARN: "",
  channelName: "",
  isSessionOn: false,
  sessionEndpoint: "",
  userARN: "",
  userName: "",
  reset: () =>
    set(() => ({
      appInstanceARN: "",
      appInstanceName: "",
      channelARN: "",
      channelName: "",
      endpoint: "",
      userARN: "",
      userName: "",
    })),
  setAppInstanceARN: (arn: string) =>
    set((state) => ({ ...state, appInstanceARN: arn })),
  setAppInstanceName: (name: string) =>
    set((state) => ({ ...state, appInstanceName: name })),
  setChannelARN: (arn: string) =>
    set((state) => ({ ...state, channelARN: arn })),
  setChannelName: (name: string) =>
    set((state) => ({ ...state, channelName: name })),
  setIsSessionOn: (hasSessionStarted: boolean) =>
    set((state) => ({ ...state, isSessionOn: hasSessionStarted })),
  setSessionEndpoint: (url: string) => set((state) => ({ ...state, sessionEndpoint: url })),
  setUserARN: (arn: string) => set((state) => ({ ...state, userARN: arn })),
  setUserName: (name: string) => set((state) => ({ ...state, userName: name })),
}));
