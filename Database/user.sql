CREATE DATABASE instaMeme;

use instaMeme;

CREATE TABLE User (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    username varchar(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    password BINARY(64) NOT NULL
);

CREATE TABLE Photos (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    image_url varchar(255) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES
    User(id) ON DELETE CASCADE
);

CREATE TABLE Comments (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    comment_text varchar(255) NOT NULL,
    user_id INTEGER NOT NULL,
    photo_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES
    User(id) ON DELETE CASCADE,
    FOREIGN KEY (photo_id) REFERENCES
    Photos(id) ON DELETE CASCADE
);

CREATE TABLE Likes (
    user_id INTEGER NOT NULL,
    photo_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES
    User(id) ON DELETE CASCADE,
    FOREIGN KEY (photo_id) REFERENCES
    Photos(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, photo_id)
);

CREATE TABLE Follows (
    follower_id INTEGER NOT NULL,
    followed_id INTEGER NOT NULL,
    FOREIGN KEY (follower_id) REFERENCES
    User(id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES
    User(id) ON DELETE CASCADE,
    PRIMARY KEY (follower_id, followed_id)
);