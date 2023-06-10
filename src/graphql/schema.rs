use super::loaders::DataLoaderStruct;
use super::scalars::*;
use super::types::*;
use async_graphql::dataloader::*;
use async_graphql::*;

pub struct Query;
pub struct Mutation;

#[Object]
impl Query {
    async fn file(&self, ctx: &Context<'_>, id: FileId) -> Result<File> {
        let loader = ctx.data::<DataLoader<DataLoaderStruct>>().unwrap();
        let file = loader
            .load_one(id)
            .await?
            .ok_or_else(|| Error::from("File not found"))?;
        Ok(file.into())
    }

    async fn my_files(&self, ctx: &Context<'_>) -> Result<Vec<File>> {
        let user = ctx
            .data::<Option<User>>()?
            .as_ref()
            .ok_or_else(|| Error::from("User must be logged in to view files"))?;
        let pool = ctx.data::<sqlx::PgPool>().unwrap();
        let mut conn = pool.acquire().await?;
        let files = crate::models::File::get_all_by_user_id(&mut conn, user.id)
            .await?
            .into_iter()
            .map(From::from)
            .collect();
        Ok(files)
    }
}

#[Object]
impl Mutation {
    async fn upload_target(&self, ctx: &Context<'_>) -> Result<UploadTarget> {
        let uuid = uuid::Uuid::new_v4().to_string();
        let s3_client = ctx.data::<s3::Bucket>().unwrap();
        let url = s3_client.presign_put(&uuid, 300, None)?;
        Ok(UploadTarget { uuid, url })
    }

    async fn create_file(&self, ctx: &Context<'_>, input: FileInput) -> Result<File> {
        let user = ctx
            .data::<Option<User>>()?
            .as_ref()
            .ok_or_else(|| Error::from("User must be logged in to create file"))?;
        let pool = ctx.data::<sqlx::PgPool>().unwrap();
        let loader = ctx.data::<DataLoader<DataLoaderStruct>>().unwrap();
        let mut conn = pool.acquire().await?;
        let id = crate::models::File::create(
            &mut conn,
            crate::models::FileInput {
                user_id: user.id,
                name: input.name,
                uuid: input.uuid,
                is_public: input.is_public,
            },
        )
        .await?;
        let file = loader
            .load_one(FileId(id))
            .await?
            .ok_or_else(|| Error::from("File not found"))?;
        Ok(file)
    }
}
