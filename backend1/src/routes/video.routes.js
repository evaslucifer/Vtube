import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideosById,
  publishVideo,
  togglePublishStatus,
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

router.route("/:videoId").delete(verifyJWT, deleteVideo);

router.route("/:videoId/toggle-publish").patch(verifyJWT, togglePublishStatus);

export default router;
