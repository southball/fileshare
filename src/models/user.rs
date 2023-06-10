use argon2::{
    password_hash::{rand_core::OsRng, SaltString},
    Argon2, PasswordHash, PasswordHasher, PasswordVerifier,
};
use sqlx::PgConnection;

#[derive(Debug, Clone)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub display_name: String,
    pub password_hash: String,
}

pub struct UserInput {
    pub username: String,
    pub display_name: String,
    pub password: String,
}

pub struct UserUpdateInput {
    pub username: Option<String>,
    pub display_name: Option<String>,
    pub password: Option<String>,
}

impl User {
    pub async fn create(conn: &mut PgConnection, input: UserInput) -> anyhow::Result<i32> {
        let argon2 = Argon2::default();
        let salt = SaltString::generate(&mut OsRng);
        let password_hash = argon2
            .hash_password(input.password.as_bytes(), &salt)
            .map_err(|_| anyhow::anyhow!("failed to hash password"))?
            .to_string();

        let result = sqlx::query!(
            "INSERT INTO users (username, display_name, password_hash) VALUES ($1, $2, $3) RETURNING id",
            input.username,
            input.display_name,
            password_hash
        )
        .fetch_one(&mut *conn)
        .await?;

        Ok(result.id)
    }

    pub async fn update(
        conn: &mut PgConnection,
        id: i32,
        input: UserUpdateInput,
    ) -> anyhow::Result<()> {
        let argon2 = Argon2::default();
        let salt = SaltString::generate(&mut OsRng);
        let password_hash = match input.password {
            Some(password) => Some(
                argon2
                    .hash_password(password.as_bytes(), &salt)
                    .map_err(|_| anyhow::anyhow!("failed to hash password"))?
                    .to_string(),
            ),
            None => None,
        };

        sqlx::query!(
            "UPDATE users
            SET
                username = COALESCE($1, username),
                display_name = COALESCE($2, display_name),
                password_hash = COALESCE($3, password_hash)
            WHERE id = $4",
            input.username,
            input.display_name,
            password_hash,
            id
        )
        .execute(&mut *conn)
        .await?;

        Ok(())
    }

    pub async fn get_by_ids(conn: &mut PgConnection, ids: &[i32]) -> anyhow::Result<Vec<User>> {
        Ok(
            sqlx::query_as!(User, "SELECT * FROM users WHERE id = ANY($1)", ids)
                .fetch_all(&mut *conn)
                .await?,
        )
    }

    pub async fn get_by_username(
        conn: &mut PgConnection,
        username: &str,
    ) -> anyhow::Result<Option<User>> {
        Ok(
            sqlx::query_as!(User, "SELECT * FROM users WHERE username = $1", username)
                .fetch_optional(&mut *conn)
                .await?,
        )
    }

    pub async fn get_by_id(conn: &mut PgConnection, id: i32) -> anyhow::Result<Option<User>> {
        Ok(User::get_by_ids(conn, &[id]).await?.get(0).cloned())
    }

    pub fn verify_password(&self, password: &str) -> bool {
        let argon2 = Argon2::default();
        let Ok(password_hash) = PasswordHash::new(&self.password_hash) else {
            return false;
        };
        argon2
            .verify_password(password.as_bytes(), &password_hash)
            .is_ok()
    }
}
