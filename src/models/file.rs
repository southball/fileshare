use chrono::NaiveDateTime;
use sqlx::PgConnection;

#[derive(Debug, Clone)]
pub struct File {
    pub id: i32,
    pub user_id: i32,
    pub name: String,
    pub uuid: String,
    pub is_public: bool,
    pub created_at: NaiveDateTime,
}

pub struct FileInput {
    pub user_id: i32,
    pub name: String,
    pub uuid: String,
    pub is_public: bool,
}

impl File {
    pub async fn create(conn: &mut PgConnection, input: FileInput) -> anyhow::Result<i32> {
        let result = sqlx::query!(
            "INSERT INTO files (user_id, name, uuid, is_public) VALUES ($1, $2, $3, $4) RETURNING id",
            input.user_id,
            input.name,
            input.uuid,
            input.is_public
        )
        .fetch_one(&mut *conn)
        .await?;

        Ok(result.id)
    }

    pub async fn get_by_ids(conn: &mut PgConnection, ids: &[i32]) -> anyhow::Result<Vec<File>> {
        Ok(
            sqlx::query_as!(File, "SELECT * FROM files WHERE id = ANY($1)", ids)
                .fetch_all(&mut *conn)
                .await?,
        )
    }

    pub async fn get_all_by_user_id(
        conn: &mut PgConnection,
        user_id: i32,
    ) -> anyhow::Result<Vec<File>> {
        let ids = sqlx::query!("SELECT id FROM files WHERE user_id = $1", user_id)
            .map(|row| row.id)
            .fetch_all(&mut *conn)
            .await?;
        File::get_by_ids(&mut *conn, &ids[..]).await
    }
}
