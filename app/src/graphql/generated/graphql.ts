/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  FileId: { input: any; output: any; }
  /**
   * ISO 8601 combined date and time without timezone.
   *
   * # Examples
   *
   * * `2015-07-01T08:59:60.123`,
   */
  NaiveDateTime: { input: any; output: any; }
  UserId: { input: any; output: any; }
};

export type File = {
  __typename?: 'File';
  createdAt: Scalars['NaiveDateTime']['output'];
  downloadUrl: Scalars['String']['output'];
  fileShares: Array<FileShare>;
  id: Scalars['Int']['output'];
  isPublic: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  user: User;
};

export type FileInput = {
  isPublic: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  uuid: Scalars['String']['input'];
};

export type FileShare = {
  __typename?: 'FileShare';
  createdAt: Scalars['NaiveDateTime']['output'];
  file: File;
  id: Scalars['Int']['output'];
  user: User;
};

export type FileShareInput = {
  fileId: Scalars['FileId']['input'];
  userId: Scalars['UserId']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createFile: File;
  createFileShare: FileShare;
  uploadTarget: UploadTarget;
};


export type MutationCreateFileArgs = {
  input: FileInput;
};


export type MutationCreateFileShareArgs = {
  input: FileShareInput;
};

export type Query = {
  __typename?: 'Query';
  file: File;
  fileSharesWithMe: Array<FileShare>;
  myFiles: Array<File>;
  users: Array<User>;
};


export type QueryFileArgs = {
  id: Scalars['FileId']['input'];
};

export type UploadTarget = {
  __typename?: 'UploadTarget';
  url: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  displayName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  publicFiles: Array<File>;
  username: Scalars['String']['output'];
};

export type CreateFileMutationVariables = Exact<{
  input: FileInput;
}>;


export type CreateFileMutation = { __typename?: 'Mutation', createFile: { __typename: 'File' } };

export type CreateFileShareMutationVariables = Exact<{
  input: FileShareInput;
}>;


export type CreateFileShareMutation = { __typename?: 'Mutation', createFileShare: { __typename: 'FileShare' } };

export type UploadTargetMutationVariables = Exact<{ [key: string]: never; }>;


export type UploadTargetMutation = { __typename?: 'Mutation', uploadTarget: { __typename?: 'UploadTarget', uuid: string, url: string } };

export type DownloadFileQueryVariables = Exact<{
  id: Scalars['FileId']['input'];
}>;


export type DownloadFileQuery = { __typename?: 'Query', file: { __typename?: 'File', downloadUrl: string } };

export type FileSharesWithMeQueryVariables = Exact<{ [key: string]: never; }>;


export type FileSharesWithMeQuery = { __typename?: 'Query', fileSharesWithMe: Array<{ __typename: 'FileShare', file: { __typename: 'File', id: number, name: string, createdAt: any, user: { __typename: 'User', username: string, displayName: string } } }> };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: number, username: string, displayName: string }> };

export type MyFilesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyFilesQuery = { __typename?: 'Query', myFiles: Array<{ __typename?: 'File', id: number, name: string, isPublic: boolean, createdAt: any }> };


export const CreateFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<CreateFileMutation, CreateFileMutationVariables>;
export const CreateFileShareDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFileShare"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileShareInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFileShare"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<CreateFileShareMutation, CreateFileShareMutationVariables>;
export const UploadTargetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadTarget"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadTarget"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<UploadTargetMutation, UploadTargetMutationVariables>;
export const DownloadFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DownloadFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FileId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"downloadUrl"}}]}}]}}]} as unknown as DocumentNode<DownloadFileQuery, DownloadFileQueryVariables>;
export const FileSharesWithMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FileSharesWithMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileSharesWithMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FileSharesWithMeQuery, FileSharesWithMeQueryVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const MyFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myFiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<MyFilesQuery, MyFilesQueryVariables>;