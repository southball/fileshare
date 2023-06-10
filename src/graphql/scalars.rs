use async_graphql::*;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Copy, Debug, Clone, PartialEq, Eq, Hash)]
pub struct FileId(pub i32);
scalar!(FileId);

#[derive(Deserialize, Serialize, Copy, Debug, Clone, PartialEq, Eq, Hash)]
pub struct UserId(pub i32);
scalar!(UserId);
