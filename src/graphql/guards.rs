use super::loaders::DataLoaderStruct;
use super::scalars::*;
use super::types::User;
use async_graphql::dataloader::*;
use async_graphql::*;

pub struct AuthGuard;

#[async_trait::async_trait]
impl Guard for AuthGuard {
    async fn check(&self, ctx: &Context<'_>) -> Result<()> {
        let _user = ctx
            .data::<Option<User>>()?
            .as_ref()
            .ok_or_else(|| Error::from("Permission denied"))?;
        Ok(())
    }
}

pub struct FileOwnerGuard(pub FileId);

#[async_trait::async_trait]
impl Guard for FileOwnerGuard {
    async fn check(&self, ctx: &Context<'_>) -> Result<()> {
        let loader = ctx.data::<DataLoader<DataLoaderStruct>>()?;
        let user = ctx
            .data::<Option<User>>()?
            .as_ref()
            .ok_or_else(|| Error::from("Permission denied"))?;
        let file = loader
            .load_one(self.0)
            .await?
            .ok_or_else(|| Error::from("File not found"))?;
        if user.id == file.user_id.0 {
            Ok(())
        } else {
            Err(Error::from("Permission denied"))
        }
    }
}

pub struct PublicFileGuard(pub FileId);

#[async_trait::async_trait]
impl Guard for PublicFileGuard {
    async fn check(&self, ctx: &Context<'_>) -> Result<()> {
        let loader = ctx.data::<DataLoader<DataLoaderStruct>>()?;
        let file = loader
            .load_one(self.0)
            .await?
            .ok_or_else(|| Error::from("File not found"))?;
        if file.is_public {
            Ok(())
        } else {
            Err(Error::from("Permission denied"))
        }
    }
}

pub struct FileShareGuard(pub FileId);

#[async_trait::async_trait]
impl Guard for FileShareGuard {
    async fn check(&self, ctx: &Context<'_>) -> Result<()> {
        let loader = ctx.data::<DataLoader<DataLoaderStruct>>()?;
        let file_shares = loader
            .load_one(FileSharesByFileId(self.0))
            .await?
            .ok_or_else(|| Error::from("File not found"))?;
        let user = ctx
            .data::<Option<User>>()?
            .as_ref()
            .ok_or_else(|| Error::from("Permission denied"))?;
        if file_shares.iter().any(|fs| fs.user_id.0 == user.id) {
            Ok(())
        } else {
            Err(Error::from("Permission denied"))
        }
    }
}
