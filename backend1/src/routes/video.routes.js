import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getAllVideos,
  getVideosById,
  publishVideo,
  updateVideo,
} from "../controllers/video.controller.js";

const router = Router();

router.route("/publish").post(
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishVideo
);
router.route("/").get(getAllVideos);
router.route("/:videoId").get(getVideosById);
router
  .route("/:videoId")
  .patch(verifyJWT, upload.single("thumbnail"), updateVideo);

export default router;
