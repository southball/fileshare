use async_graphql::SimpleObject;

#[derive(SimpleObject, Clone, Debug)]
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
