use std::collections::HashMap;

use super::scalars::*;
use super::types::{File, User};
use async_graphql::dataloader::*;
use async_graphql::*;

pub struct DataLoaderStruct {
    pool: sqlx::PgPool,
}

impl DataLoaderStruct {
    pub fn new(pool: sqlx::PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait::async_trait]
impl Loader<FileId> for DataLoaderStruct {
    type Value = File;
    type Error = async_graphql::Error;
    async fn load(&self, keys: &[FileId]) -> Result<HashMap<FileId, Self::Value>> {
        let mut conn = self.pool.acquire().await?;
        let keys = keys.iter().map(|k| k.0).collect::<Vec<_>>();
        Ok(crate::models::File::get_by_ids(&mut conn, &keys)
            .await?
            .into_iter()
            .map(|file| (FileId(file.id), file.into()))
            .collect::<HashMap<_, _>>())
    }
}

#[async_trait::async_trait]
impl Loader<UserId> for DataLoaderStruct {
    type Value = User;
    type Error = async_graphql::Error;
    async fn load(&self, keys: &[UserId]) -> Result<HashMap<UserId, Self::Value>> {
        let mut conn = self.pool.acquire().await?;
        let keys = keys.iter().map(|k| k.0).collect::<Vec<_>>();
        Ok(crate::models::User::get_by_ids(&mut conn, &keys)
            .await?
            .into_iter()
            .map(|user| (UserId(user.id), user.into()))
            .collect::<HashMap<_, _>>())
    }
}
