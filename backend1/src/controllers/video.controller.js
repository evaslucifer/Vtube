import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  if (!videoFileLocalPath) {
    throw new ApiError(400, "video file is required");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail is required");
  }
  if (!title || !description) {
    throw new ApiError(400, "title and description are required");
  }
  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!videoFile) {
    throw new ApiError(500, "video upload failed");
  }
  if (!thumbnail) {
    throw new ApiError(500, "thumbnail upload failed");
  }
  const video = await Video.create({
    videoFile: videoFile.secure_url,
    thumbnail: thumbnail.secure_url,
    title,
    description,
    duration: videoFile.duration,
    owner: req.user._id,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, video, "video published successfully"));
});
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const videos = await Video.aggregatePaginate(
    Video.aggregate([
      {
        $match: {
          isPublished: true,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]),
    {
      page: Number(page),
      limit: Number(limit),
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "videos fetched successfully"));
});
const getVideosById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "video not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "video not found");
  }
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "you are not authorized to update this video");
  }
  if (!title && !description && !req.file) {
    throw new ApiError(400, "nothing to update");
  }
  let thumbnailUrl = video.thumbnail;
  if (req.file) {
    const thumbnail = await uploadOnCloudinary(req.file.path);
    if (!thumbnail) {
      throw new ApiError(500, "thumbnail upload failed");
    }
    thumbnailUrl = thumbnail.secure_url;
  }
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        ...(title && { title }),
        ...(description && { description }),
        thumbnail: thumbnailUrl,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "video updated successfully"));
});
export { publishVideo, getAllVideos, getVideosById, updateVideo };
