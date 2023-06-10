mod guards;
mod loaders;
mod scalars;
mod schema;
mod types;

use async_graphql::{dataloader::DataLoader, EmptySubscription, Schema, SchemaBuilder};
use sqlx::PgPool;

use loaders::DataLoaderStruct;

pub type FileshareSchema = Schema<schema::Query, schema::Mutation, EmptySubscription>;

pub fn build_schema(
    pool: PgPool,
    s3_bucket: s3::Bucket,
) -> SchemaBuilder<schema::Query, schema::Mutation, EmptySubscription> {
    FileshareSchema::build(schema::Query, schema::Mutation, EmptySubscription)
        .data(pool.clone())
        .data(s3_bucket)
        .data(DataLoader::new(DataLoaderStruct::new(pool), tokio::spawn))
}

pub type GraphQLUser = types::User;
