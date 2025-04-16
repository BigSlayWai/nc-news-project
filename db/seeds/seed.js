const db = require("../connection");

const formatDate = (timestamp) => {
  if (typeof timestamp === 'number') {
    return new Date(timestamp).toISOString();
  }
  return timestamp || new Date().toISOString();
};

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => db.query("DROP TABLE IF EXISTS articles;"))
    .then(() => db.query("DROP TABLE IF EXISTS users;"))
    .then(() => db.query("DROP TABLE IF EXISTS topics;"))
    .then(() => db.query(`
      CREATE TABLE topics (
        slug VARCHAR(255) PRIMARY KEY,
        description VARCHAR(255) NOT NULL,
        img_url VARCHAR(1000) NOT NULL
      );
    `))
    .then(() => db.query(`
      CREATE TABLE users (
        username VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(1000) NOT NULL
      );
    `))
    .then(() => db.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        topic VARCHAR(255) REFERENCES topics(slug) NOT NULL,
        author VARCHAR(255) REFERENCES users(username) NOT NULL,
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000) NOT NULL
      );
    `))
    .then(() => db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id),
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR(255) REFERENCES users(username) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `))
    .then(() => {
      const topicPromises = topicData.map((topic) => {
        return db.query(
          "INSERT INTO topics (slug, description, img_url) VALUES ($1, $2, $3);",
          [topic.slug, topic.description, topic.img_url]
        );
      });
      return Promise.all(topicPromises);
    })
    .then(() => {
      const userPromises = userData.map((user) => {
        return db.query(
          "INSERT INTO users (username, name, avatar_url) VALUES ($1, $2, $3);",
          [user.username, user.name, user.avatar_url]
        );
      });
      return Promise.all(userPromises);
    })
    .then(() => {
      const articlePromises = articleData.map((article) => {
        return db.query(
          `INSERT INTO articles 
          (title, topic, author, body, created_at, votes, article_img_url) 
          VALUES ($1, $2, $3, $4, $5, $6, $7);`,
          [
            article.title,
            article.topic,
            article.author,
            article.body,
            formatDate(article.created_at),
            article.votes || 0,
            article.article_img_url
          ]
        );
      });
      return Promise.all(articlePromises);
    })
    .then(() => {
      const commentPromises = commentData.map((comment) => {
        return db.query(
          `INSERT INTO comments 
          (article_id, body, votes, author, created_at) 
          VALUES ($1, $2, $3, $4, $5);`,
          [
            comment.article_id,
            comment.body,
            comment.votes || 0,
            comment.author,
            formatDate(comment.created_at)
          ]
        );
      });
      return Promise.all(commentPromises);
    });
};

module.exports = seed;