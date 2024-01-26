--CREATE DATABASE transverse;


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "user"(
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    date_created DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
)


CREATE TABLE note(
    note_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "user"(user_id),
    title VARCHAR(255) NOT NULL,
    "status" VARCHAR(10) NOT NULL,
    visible BOOLEAN NOT NULL,
    date_created DATE NOT NULL,
    date_updated DATE NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    thread_id VARCHAR(50)
    active_transcript TEXT,
    full_transcript TEXT,
    active_markdown TEXT,
    full_markdown TEXT,

);
