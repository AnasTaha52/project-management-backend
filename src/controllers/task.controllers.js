import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableTaskStatus, TaskStatusEnum } from "../utils/constants.js";
import { create } from "domain";


// ─── Task Controllers ─────────────────────────────────────────────────────────

/**
 * GET /projects/:projectId/tasks
 * Returns all tasks for a project with populated assignedTo & assignedBy user info
 * using MongoDB aggregation pipeline.
 */
const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId)
  }).populate("assignedTo", "avatar username fullName")

  return res
    .status(201)
    .json(new ApiResponse(201, tasks, "Tasks fetched successfully"));
});

/**
 * GET /projects/:projectId/tasks/:taskId
 * Returns a single task with populated user info and its subtasks.
 */
const getTasksById = asyncHandler(async (req, res) => {
  const {  taskId } = req.params;

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            _id: 1,
            username: 1,
            fullName: 1,
            avatar: 1
          }
        ]
      }
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdby",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  _id: 1,
                  username: 1,
                  fullName : 1,
                  avatar: 1
                }
              ]
            }
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy" , 0]
              }
            }
          }
        ]
      }
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["assignedTo", 0]
        }
      }
    }
  ])

  if(!task || task.length === 0 ){
    throw new ApiError(404, "Task not found")
  }

  return res.status(200).json(new ApiResponse(200 , task[0] , "Task fetched successfully"))
});

/**
 * POST /projects/:projectId/tasks
 * Creates a new task. assignedTo defaults to the requesting user if not provided.
 */
const createTasks = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body
  const { projectId } = req.params

  const project = await Project.findById(projectId)

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const files = req.files || []

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.orignalname}`,
      mimetype: file.mimetype,
      size: file.size
    }
  })

  const task = await Task.create({
    title,
    description,
    assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
    project: new mongoose.Types.ObjectId(projectId),
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments
  })

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));

});

/**
 * PATCH /projects/:projectId/tasks/:taskId
 * Updates task title, description, and/or assignedTo.
 */
const updateTasks = asyncHandler(async (req, res) => {
  const { title, description, assignedTo } = req.body;
  const { projectId, taskId } = req.params;

  const task = await Tasks.findOneAndUpdate(
    { _id: taskId, project: projectId },
    {
      $set: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(assignedTo !== undefined && { assignedTo }),
      },
    },
    { new: true }
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

/**
 * PATCH /projects/:projectId/tasks/:taskId/status
 * Updates the status of a task. Uses TaskStatusEnum for validation.
 * Allowed values: "todo" | "in_progress" | "done"
 */
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { projectId, taskId } = req.params;

  if (!AvailableTaskStatus.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status. Allowed values: ${AvailableTaskStatus.join(", ")}`
    );
  }

  const task = await Tasks.findOneAndUpdate(
    { _id: taskId, project: projectId },
    { $set: { status } },
    { new: true }
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task status updated successfully"));
});

/**
 * DELETE /projects/:projectId/tasks/:taskId
 * Deletes a task and all its associated subtasks.
 */
const deleteTasks = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;

  const task = await Tasks.findOneAndDelete({ _id: taskId, project: projectId });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Cascade delete subtasks belonging to this task
  await Subtask.deleteMany({ task: taskId });

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task deleted successfully"));
});


// ─── Subtask Controllers ──────────────────────────────────────────────────────

/**
 * POST /projects/:projectId/tasks/:taskId/subtasks
 * Creates a subtask under a given task.
 */
const createSubTasks = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { taskId } = req.params;

  const task = await Tasks.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subTask = await Subtask.create({
    title,
    task: taskId,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subTask, "SubTask created successfully"));
});

/**
 * PATCH /projects/:projectId/tasks/:taskId/subtasks/:subtaskId
 * Updates a subtask's title and/or isCompleted flag.
 */
const updatedSubTasks = asyncHandler(async (req, res) => {
  const { title, isCompleted } = req.body;
  const { taskId, subtaskId } = req.params;

  const subTask = await Subtask.findOneAndUpdate(
    { _id: subtaskId, task: taskId },
    {
      $set: {
        ...(title !== undefined && { title }),
        ...(isCompleted !== undefined && { isCompleted }),
      },
    },
    { new: true }
  );

  if (!subTask) {
    throw new ApiError(404, "SubTask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subTask, "SubTask updated successfully"));
});

/**
 * DELETE /projects/:projectId/tasks/:taskId/subtasks/:subtaskId
 * Deletes a specific subtask.
 */
const deleteSubTasks = asyncHandler(async (req, res) => {
  const { taskId, subtaskId } = req.params;

  const subTask = await Subtask.findOneAndDelete({ _id: subtaskId, task: taskId });

  if (!subTask) {
    throw new ApiError(404, "SubTask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subTask, "SubTask deleted successfully"));
});


export {
  getTasks,
  getTasksById,
  createTasks,
  updateTasks,
  updateTaskStatus,
  deleteTasks,
  createSubTasks,
  updatedSubTasks,
  deleteSubTasks,
};