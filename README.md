# chime-messaging-frontend-poc

This frontend calls the endpoints defined in the [chime-messaging-backend-poc](https://github.com/j-sauceda/chime-messaging-backend-poc) to create a chat client based on the AWS Chime Messaging and AWS Chime Messaging APIs.

We utilized the `@picocss/pico` library for styling. Additionally, `date-fns` was chosen for calculating time differences between chat messages. Moreover, the state of the application is handled by the `zustand` library. Finally, other libraries (including `axios` and `@tanstack/react-query`) may be changed according to development preferences.