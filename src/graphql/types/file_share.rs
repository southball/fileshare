use super::super::loaders::DataLoaderStruct;
use super::super::scalars::*;
use super::*;
use async_graphql::dataloader::*;
use async_graphql::*;
use chrono::NaiveDateTime;

#[derive(SimpleObject, Clone, Debug)]
#[graphql(complex)]
pub struct FileShare {
    pub id: i32,
    #[graphql(skip)]
    pub file_id: FileId,
    #[graphql(skip)]
    pub user_id: UserId,
    pub created_at: NaiveDateTime,
}

#[derive(InputObject)]
pub struct FileShareInput {
    pub file_id: FileId,
    pub user_id: UserId,
}

#[ComplexObject]
impl FileShare {
    async fn file(&self, ctx: &Context<'_>) -> Result<File> {
        let loader = ctx.data::<DataLoader<DataLoaderStruct>>().unwrap();
        let file = loader
            .load_one(self.file_id)
            .await?
            .ok_or_else(|| Error::from("File not found"))?;
        Ok(file)
    }

    async fn user(&self, ctx: &Context<'_>) -> Result<User> {
        let loader = ctx.data::<DataLoader<DataLoaderStruct>>().unwrap();
        let user = loader
            .load_one(self.user_id)
            .await?
            .ok_or_else(|| Error::from("User not found"))?;
        Ok(user)
    }
}

impl From<crate::models::FileShare> for FileShare {
    fn from(file_share: crate::models::FileShare) -> Self {
        Self {
            id: file_share.id,
            file_id: FileId(file_share.file_id),
            user_id: UserId(file_share.user_id),
            created_at: file_share.created_at,
        }
    }
}
