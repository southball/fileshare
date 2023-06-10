use super::guards::*;
use super::loaders::DataLoaderStruct;
use super::scalars::*;
use super::types::*;
use async_graphql::dataloader::*;
use async_graphql::*;

pub struct Query;
pub struct Mutation;

#[Object]
impl Query {
    #[graphql(guard = "AuthGuard")]
    async fn users(&self, ctx: &Context<'_>) -> Result<Vec<User>> {
        let pool = ctx.data::<sqlx::PgPool>().unwrap();
        let mut conn = pool.acquire().await?;
        let users = crate::models::User::get_all(&mut conn).await?;
        Ok(users.into_iter().map(From::from).collect())
    }

    #[graphql(guard = "PublicFileGuard(id).or(FileOwnerGuard(id)).or(FileShareGuard(id))")]
    async fn file(&self, ctx: &Context<'_>, id: FileId) -> Result<File> {
        let loader = ctx.data::<DataLoader<DataLoaderStruct>>().unwrap();
        let file = loader
            .load_one(id)
            .await?
            .ok_or_else(|| Error::from("File not found"))?;
        Ok(file.into())
    }

    #[graphql(guard = "AuthGuard")]
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
    #[graphql(guard = "AuthGuard")]
    async fn upload_target(&self, ctx: &Context<'_>) -> Result<UploadTarget> {
        let uuid = uuid::Uuid::new_v4().to_string();
        let s3_client = ctx.data::<s3::Bucket>().unwrap();
        let url = s3_client.presign_put(&uuid, 300, None)?;
        Ok(UploadTarget { uuid, url })
    }

    #[graphql(guard = "AuthGuard")]
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

    #[graphql(guard = "FileOwnerGuard(input.file_id)")]
    async fn create_file_share(
        &self,
        ctx: &Context<'_>,
        input: FileShareInput,
    ) -> Result<FileShare> {
        let pool = ctx.data::<sqlx::PgPool>().unwrap();
        let mut conn = pool.acquire().await?;
        let loader = ctx.data::<DataLoader<DataLoaderStruct>>().unwrap();
        let id = crate::models::FileShare::create(
            &mut conn,
            crate::models::FileShareInput {
                file_id: input.file_id.0,
                user_id: input.user_id.0,
            },
        )
        .await?;
        let file_share = loader
            .load_one(FileShareId(id))
            .await?
            .ok_or_else(|| Error::from("File share not found"))?;
        Ok(file_share)
    }
}
