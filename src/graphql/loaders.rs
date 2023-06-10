use std::collections::HashMap;

use super::scalars::*;
use super::types::{File, FileShare, User};
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

#[async_trait::async_trait]
impl Loader<FileShareId> for DataLoaderStruct {
    type Value = FileShare;
    type Error = async_graphql::Error;
    async fn load(&self, keys: &[FileShareId]) -> Result<HashMap<FileShareId, Self::Value>> {
        let mut conn = self.pool.acquire().await?;
        let keys = keys.iter().map(|k| k.0).collect::<Vec<_>>();
        Ok(crate::models::FileShare::get_by_ids(&mut conn, &keys)
            .await?
            .into_iter()
            .map(|file_share| (FileShareId(file_share.id), file_share.into()))
            .collect::<HashMap<_, _>>())
    }
}

#[async_trait::async_trait]
impl Loader<FileSharesByFileId> for DataLoaderStruct {
    type Value = Vec<FileShare>;
    type Error = async_graphql::Error;
    async fn load(
        &self,
        keys: &[FileSharesByFileId],
    ) -> Result<HashMap<FileSharesByFileId, Self::Value>> {
        let mut conn = self.pool.acquire().await?;
        let keys = keys.iter().map(|k| k.0 .0).collect::<Vec<_>>();
        let file_shares = crate::models::FileShare::get_all_by_file_ids(&mut conn, &keys).await?;
        let mut map = HashMap::new();
        for file_share in file_shares {
            let file_share = FileShare::from(file_share);
            let key = FileSharesByFileId(file_share.file_id);
            map.entry(key).or_insert_with(Vec::new).push(file_share);
        }
        for key in keys {
            map.entry(FileSharesByFileId(FileId(key)))
                .or_insert_with(Vec::new);
        }
        Ok(map)
    }
}

#[async_trait::async_trait]
impl Loader<PublicFilesByUserId> for DataLoaderStruct {
    type Value = Vec<File>;
    type Error = async_graphql::Error;
    async fn load(
        &self,
        keys: &[PublicFilesByUserId],
    ) -> Result<HashMap<PublicFilesByUserId, Self::Value>> {
        let mut conn = self.pool.acquire().await?;
        let keys = keys.iter().map(|k| k.0 .0).collect::<Vec<_>>();
        let files = crate::models::File::get_all_public_by_user_ids(&mut conn, &keys).await?;
        let mut map = HashMap::new();
        for file in files {
            let file = File::from(file);
            let key = PublicFilesByUserId(file.user_id);
            map.entry(key).or_insert_with(Vec::new).push(file);
        }
        for key in keys {
            map.entry(PublicFilesByUserId(UserId(key)))
                .or_insert_with(Vec::new);
        }
        Ok(map)
    }
}
