mod graphql;
mod models;
mod routes;

use axum::{
    routing::{get, get_service, post},
    Extension, Router,
};
use axum_session::{Key, SecurityMode, SessionConfig, SessionLayer, SessionPgPool, SessionStore};
use graphql::build_schema;
use s3::creds::Credentials;
use serde::Deserialize;
use sqlx::PgPool;
use tower_http::services::ServeDir;

#[derive(Deserialize, Debug)]
struct EnvConfig {
    s3_endpoint_url: String,
    s3_region: String,
    s3_access_key_id: String,
    s3_secret_access_key: String,
    database_url: String,
    session_key: String,
}

fn make_router(
    pool: PgPool,
    s3_bucket: s3::Bucket,
    session_store: SessionStore<SessionPgPool>,
) -> Router {
    let schema = build_schema(pool.clone(), s3_bucket.clone()).finish();

    std::fs::write("schema.gql", schema.sdl()).expect("Failed to write schema to file");

    Router::new()
        .route("/api/graphql", post(routes::graphql))
        .route("/graphiql", get(routes::graphiql))
        .route("/auth/login", post(routes::auth_login))
        .route("/auth/logout", post(routes::auth_logout))
        .route("/auth/whoami", get(routes::auth_whoami))
        .route("/auth/register", post(routes::auth_register))
        .route("/auth/update", post(routes::auth_update))
        .nest_service("/app", get_service(ServeDir::new("app/dist")))
        .layer(Extension(pool))
        .layer(Extension(schema))
        .layer(SessionLayer::new(session_store))
}

#[tokio::main]
async fn main() {
    let env_config = envy::from_env::<EnvConfig>().expect("Failed to read env config");

    let pool = sqlx::PgPool::connect(&env_config.database_url)
        .await
        .expect("Failed to connect to database");

    let s3_bucket = s3::bucket::Bucket::new(
        "files",
        s3::region::Region::Custom {
            endpoint: env_config.s3_endpoint_url,
            region: env_config.s3_region,
        },
        Credentials::new(
            Some(&env_config.s3_access_key_id),
            Some(&env_config.s3_secret_access_key),
            None,
            None,
            None,
        )
        .expect("Failed to create credentials"),
    )
    .expect("Failed to connect to S3")
    .with_path_style();

    let session_config = SessionConfig::default()
        .with_table_name("axum_sessions")
        .with_key(Key::from(env_config.session_key.as_bytes()))
        .with_database_key(Key::from(env_config.session_key.as_bytes()))
        .with_security_mode(SecurityMode::Simple);

    let session_store =
        SessionStore::<SessionPgPool>::new(Some(pool.clone().into()), session_config);
    session_store
        .initiate()
        .await
        .expect("Failed to initiate session store");

    let app = make_router(pool, s3_bucket, session_store);

    axum::Server::bind(&"127.0.0.1:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
