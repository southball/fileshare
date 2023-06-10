use chrono::NaiveDateTime;
use sqlx::PgConnection;

#[derive(Debug, Clone)]
pub struct FileShare {
    pub id: i32,
    pub file_id: i32,
    pub user_id: i32,
    pub created_at: NaiveDateTime,
}

pub struct FileShareInput {
    pub file_id: i32,
    pub user_id: i32,
}

impl FileShare {
    pub async fn create(conn: &mut PgConnection, input: FileShareInput) -> anyhow::Result<i32> {
        let row = sqlx::query!(
            "INSERT INTO file_shares (file_id, user_id) VALUES ($1, $2) RETURNING id",
            input.file_id,
            input.user_id
        )
        .fetch_one(&mut *conn)
        .await?;
        Ok(row.id)
    }

    pub async fn get_by_ids(
        conn: &mut PgConnection,
        ids: &[i32],
    ) -> anyhow::Result<Vec<FileShare>> {
        Ok(sqlx::query_as!(
            FileShare,
            "SELECT * FROM file_shares WHERE id = ANY($1)",
            ids
        )
        .fetch_all(&mut *conn)
        .await?)
    }

    pub async fn get_all_by_file_ids(
        conn: &mut PgConnection,
        file_ids: &[i32],
    ) -> anyhow::Result<Vec<FileShare>> {
        let ids = sqlx::query!(
            "SELECT id FROM file_shares WHERE file_id = ANY($1)",
            file_ids
        )
        .map(|row| row.id)
        .fetch_all(&mut *conn)
        .await?;
        FileShare::get_by_ids(&mut *conn, &ids[..]).await
    }
}
