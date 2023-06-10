use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::{
    http::StatusCode,
    response::{Html, IntoResponse},
    Extension, Json,
};
use axum_session::{Session, SessionPgPool};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::PgPool;

use crate::{graphql::FileshareSchema, models::UserUpdateInput};

pub async fn graphql(
    pool: Extension<PgPool>,
    session: Session<SessionPgPool>,
    Extension(schema): Extension<FileshareSchema>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    let user = match (pool.acquire().await, session.get::<i32>("user_id")) {
        (Ok(mut conn), Some(user_id)) => crate::models::User::get_by_id(&mut conn, user_id)
            .await
            .ok()
            .flatten(),
        _ => None,
    }
    .map(crate::graphql::GraphQLUser::from);
    schema.execute(req.0.data(user)).await.into()
}

pub async fn graphiql() -> impl IntoResponse {
    Html(
        async_graphql::http::GraphiQLSource::build()
            .endpoint("/api/graphql")
            .finish(),
    )
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthLoginInput {
    username: String,
    password: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthRegisterInput {
    username: String,
    password: String,
    display_name: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthUpdateInput {
    password: Option<String>,
    display_name: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthWhoami {
    username: String,
    display_name: String,
}

pub async fn auth_login(
    session: Session<SessionPgPool>,
    Extension(pool): Extension<PgPool>,
    input: Json<AuthLoginInput>,
) -> Result<(), (StatusCode, &'static str)> {
    let mut conn = pool.acquire().await.map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Failed to obtain database connection",
        )
    })?;
    let Some(user) = crate::models::User::get_by_username(&mut conn, &input.username)
        .await
        .map_err(|_| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to query database",
            )
        })? else {
            return Err((StatusCode::FORBIDDEN, "Invalid username or password"));
        };
    let password_matches = user.verify_password(&input.password);
    if password_matches {
        session.set("user_id", user.id);
        Ok(())
    } else {
        Err((StatusCode::FORBIDDEN, "Invalid username or password"))
    }
}

pub async fn auth_logout(session: Session<SessionPgPool>) {
    session.destroy();
}

pub async fn auth_whoami(
    Extension(pool): Extension<PgPool>,
    session: Session<SessionPgPool>,
) -> Result<Json<Option<AuthWhoami>>, (StatusCode, Json<Value>)> {
    let mut conn = pool.acquire().await.map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"error": "Failed to obtain database connection"})),
        )
    })?;
    let user_id = session.get::<i32>("user_id");
    let user = match user_id {
        Some(user_id) => crate::models::User::get_by_id(&mut conn, user_id)
            .await
            .map_err(|_| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({"error": "Failed to query database"})),
                )
            })?,
        None => None,
    };
    Ok(Json(user.map(|user| AuthWhoami {
        username: user.username,
        display_name: user.display_name,
    })))
}

pub async fn auth_register(
    Extension(pool): Extension<PgPool>,
    input: Json<AuthRegisterInput>,
) -> Result<(), (StatusCode, &'static str)> {
    let mut conn = pool.acquire().await.map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Failed to obtain database connection",
        )
    })?;

    let None = crate::models::User::get_by_username(&mut conn, &input.username)
        .await
        .map_err(|_| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to query database",
            )
        })? else {
            return Err((StatusCode::FORBIDDEN, "Username already taken"));
        };

    crate::models::User::create(
        &mut conn,
        crate::models::UserInput {
            username: input.username.clone(),
            display_name: input.display_name.clone(),
            password: input.password.clone(),
        },
    )
    .await
    .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Failed to register user"))?;

    Ok(())
}

pub async fn auth_update(
    session: Session<SessionPgPool>,
    Extension(pool): Extension<PgPool>,
    input: Json<AuthUpdateInput>,
) -> Result<(), (StatusCode, &'static str)> {
    let mut conn = pool.acquire().await.map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Failed to obtain database connection",
        )
    })?;

    let Some(user_id) = session.get::<i32>("user_id") else {
        return Err((StatusCode::FORBIDDEN, "Not logged in"));
    };

    crate::models::User::update(
        &mut conn,
        user_id,
        UserUpdateInput {
            username: None,
            password: input.password.clone(),
            display_name: input.display_name.clone(),
        },
    )
    .await
    .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Failed to update user"))?;

    Ok(())
}
