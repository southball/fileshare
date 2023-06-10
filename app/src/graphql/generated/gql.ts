/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "mutation CreateFile($input: FileInput!) {\n  createFile(input: $input) {\n    __typename\n  }\n}": types.CreateFileDocument,
    "mutation CreateFileShare($input: FileShareInput!) {\n  createFileShare(input: $input) {\n    __typename\n  }\n}": types.CreateFileShareDocument,
    "mutation UploadTarget {\n  uploadTarget {\n    uuid\n    url\n  }\n}": types.UploadTargetDocument,
    "query DownloadFile($id: FileId!) {\n  file(id: $id) {\n    downloadUrl\n  }\n}": types.DownloadFileDocument,
    "query FileSharesWithMe {\n  fileSharesWithMe {\n    __typename\n    file {\n      __typename\n      id\n      name\n      createdAt\n      user {\n        __typename\n        username\n        displayName\n      }\n    }\n  }\n}": types.FileSharesWithMeDocument,
    "query GetUsers {\n  users {\n    id\n    username\n    displayName\n  }\n}": types.GetUsersDocument,
    "query MyFiles {\n  myFiles {\n    id\n    name\n    isPublic\n    createdAt\n  }\n}": types.MyFilesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateFile($input: FileInput!) {\n  createFile(input: $input) {\n    __typename\n  }\n}"): (typeof documents)["mutation CreateFile($input: FileInput!) {\n  createFile(input: $input) {\n    __typename\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateFileShare($input: FileShareInput!) {\n  createFileShare(input: $input) {\n    __typename\n  }\n}"): (typeof documents)["mutation CreateFileShare($input: FileShareInput!) {\n  createFileShare(input: $input) {\n    __typename\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UploadTarget {\n  uploadTarget {\n    uuid\n    url\n  }\n}"): (typeof documents)["mutation UploadTarget {\n  uploadTarget {\n    uuid\n    url\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query DownloadFile($id: FileId!) {\n  file(id: $id) {\n    downloadUrl\n  }\n}"): (typeof documents)["query DownloadFile($id: FileId!) {\n  file(id: $id) {\n    downloadUrl\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FileSharesWithMe {\n  fileSharesWithMe {\n    __typename\n    file {\n      __typename\n      id\n      name\n      createdAt\n      user {\n        __typename\n        username\n        displayName\n      }\n    }\n  }\n}"): (typeof documents)["query FileSharesWithMe {\n  fileSharesWithMe {\n    __typename\n    file {\n      __typename\n      id\n      name\n      createdAt\n      user {\n        __typename\n        username\n        displayName\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetUsers {\n  users {\n    id\n    username\n    displayName\n  }\n}"): (typeof documents)["query GetUsers {\n  users {\n    id\n    username\n    displayName\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyFiles {\n  myFiles {\n    id\n    name\n    isPublic\n    createdAt\n  }\n}"): (typeof documents)["query MyFiles {\n  myFiles {\n    id\n    name\n    isPublic\n    createdAt\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;