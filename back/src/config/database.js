import 'dotenv/config';

export default {
  dialect: process.env.DIALECT || "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  define: {
    timestamps: process.env.DB_TIMESTAMPS === "true",
    underscored: process.env.DB_UNDERSCORED === "true",
    underscoredAll: process.env.DB_UNDERSCORED_ALL === "true",
  },
};
