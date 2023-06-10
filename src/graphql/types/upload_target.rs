use async_graphql::*;

#[derive(SimpleObject)]
pub struct UploadTarget {
    pub uuid: String,
    pub url: String,
}
