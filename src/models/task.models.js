import mongoose, { Schema } from "mongoose";
import { AvailableTaskStatus, AvailableUserRole, TaskStatusEnum, UserRolesEnum } from "../utils/constants.js";
import { Project } from "./project.models.js";
import { assign } from "nodemailer/lib/shared/index.js";

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  assignedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: AvailableTaskStatus,
    default: TaskStatusEnum.TODO
  },
  attachments:{
    type: [{
        url: String,
        mimetype: String,
        size: Number
    }],
    default: []
  }
});


export const Tasks = mongoose.model("Task" , taskSchema)