use super::super::guards::*;
use super::super::loaders::DataLoaderStruct;
use super::super::scalars::*;
use super::*;
use async_graphql::dataloader::*;
use async_graphql::*;
use chrono::NaiveDateTime;

#[derive(SimpleObject, Clone, Debug)]
#[graphql(complex)]
pub struct File {
    pub id: i32,
    #[graphql(skip)]
    pub user_id: UserId,
    pub name: String,
    #[graphql(skip)]
    pub uuid: String,
    pub is_public: bool,
    pub created_at: NaiveDateTime,
}

#[derive(InputObject)]
pub struct FileInput {
    pub name: String,
    pub is_public: bool,
    pub uuid: String,
}

#[ComplexObject]
impl File {
    async fn download_url(&self, ctx: &Context<'_>) -> Result<String> {
        let s3_client = ctx.data::<s3::Bucket>().unwrap();
        Ok(s3_client.presign_get(&self.uuid, 300, None)?)
    }

    async fn user(&self, ctx: &Context<'_>) -> Result<User> {
        let loader = ctx.data::<DataLoader<DataLoaderStruct>>().unwrap();
        let user = loader
            .load_one(self.user_id)
            .await?
            .ok_or_else(|| Error::from("User not found"))?;
        Ok(user)
    }

    #[graphql(guard = "FileOwnerGuard(FileId(self.id))")]
    async fn file_shares(&self, ctx: &Context<'_>) -> Result<Vec<FileShare>> {
        let loader = ctx.data::<DataLoader<DataLoaderStruct>>().unwrap();
        let file_shares = loader
            .load_one(FileSharesByFileId(FileId(self.id)))
            .await?
            .ok_or_else(|| Error::from("FileShare not found"))?;
        Ok(file_shares)
    }
}

impl From<crate::models::File> for File {
    fn from(file: crate::models::File) -> Self {
        Self {
            id: file.id,
            user_id: UserId(file.user_id),
            name: file.name,
            uuid: file.uuid,
            is_public: file.is_public,
            created_at: file.created_at,
        }
    }
}
