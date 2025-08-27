import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUplaod from "express-fileupload";
import compression from "compression";
import morgan from "morgan";
import createHttpError from "http-errors";

// importing routes
import routes from "./routes/index.route.js";

dotenv.config();

// initializing app
const app = express();

//morgan middleware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// json body parser
app.use(express.json());

// url parser
app.use(express.urlencoded({ extended: true }));

// cookie-parser
app.use(cookieParser());

// compression
app.use(compression());

// fileuplad
app.use(fileUplaod({ useTempFiles: true }));

// cors
app.use(
  cors({
    origin: "http://localhost:5174", // Your frontend origin
    credentials: true, // Allow cookies
  })
);

//routes
app.use("/api/v1", routes);

// page not found

app.use((req, res, next) => {
  next(createHttpError.NotFound("This route does not exist"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal server error",
      status: err.status || 500,
    },
  });
});

// exporting app
export default app;
