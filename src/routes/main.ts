// import "dotenv/config";
import { Router } from "express";
import { render } from "../api/render";

export default Router().get("/", async (req, res) => {
  return render(req, res, "main", {});
});
