export type CredentialType = {
  Credentials: {
    AccessKeyId: string;
    SecretAccessKey: string;
    SessionToken: string;
    Expiration: Date;
  },
  AssumedRoleUser: {
    AssumedRoleId: string;
    Arn: string;
  }
};
