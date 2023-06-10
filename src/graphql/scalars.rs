use async_graphql::*;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Copy, Debug, Clone, PartialEq, Eq, Hash)]
pub struct FileId(pub i32);
scalar!(FileId);

#[derive(Deserialize, Serialize, Copy, Debug, Clone, PartialEq, Eq, Hash)]
pub struct UserId(pub i32);
scalar!(UserId);

#[derive(Deserialize, Serialize, Copy, Debug, Clone, PartialEq, Eq, Hash)]
pub struct FileShareId(pub i32);
scalar!(FileShareId);

#[derive(Deserialize, Serialize, Copy, Debug, Clone, PartialEq, Eq, Hash)]
pub struct FileSharesByFileId(pub FileId);
scalar!(FileSharesByFileId);

#[derive(Deserialize, Serialize, Copy, Debug, Clone, PartialEq, Eq, Hash)]
pub struct PublicFilesByUserId(pub UserId);
scalar!(PublicFilesByUserId);
