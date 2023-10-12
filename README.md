# sumadi-chime-messaging-frontend

This frontend calls the endpoints defined in the [sumadi-chime-messaging-backend](https://github.com/lmshn/sumadi-chime-messaging-backend) to create a chat client based on the AWS Chime Messaging and AWS Chime Messaging APIs.

The initial implementation of this frontend utilizes the `amazon-chime-sdk-component-library-react` library for decorative purposes, but this is not essential. Additionally, `date-fns` was chosen in lieu of the deprecated `moment-js` library for calculating time differences between chat messages. Moreover, the state of the application is handled by the `zustand` library. Finally, all chosen libraries (including `axios` and `@tanstack/react-query`) are subject to change according to design considerations.