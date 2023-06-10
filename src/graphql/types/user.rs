use super::super::loaders::DataLoaderStruct;
use super::super::scalars::*;
use super::*;
use async_graphql::dataloader::*;
use async_graphql::*;

#[derive(SimpleObject, Clone, Debug)]
#[graphql(complex)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub display_name: String,
}

impl From<crate::models::User> for User {
    fn from(user: crate::models::User) -> Self {
        Self {
            id: user.id,
            username: user.username,
            display_name: user.display_name,
        }
    }
}

#[ComplexObject]
impl User {
    async fn public_files(&self, ctx: &Context<'_>) -> Result<Vec<File>> {
        let loader = ctx.data::<DataLoader<DataLoaderStruct>>().unwrap();
        let files = loader
            .load_one(PublicFilesByUserId(UserId(self.id)))
            .await?
            .ok_or_else(|| Error::from("File not found"))?;
        Ok(files)
    }
}
