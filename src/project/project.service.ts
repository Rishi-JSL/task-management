import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserError } from 'src/auth/auth.service';
import { DAYS_IN_MS, HOURS_IN_MS } from 'src/common/constants';
import { TaskNotificationGateway } from 'src/gateway/task-notification.gateway';
import { UserService } from 'src/user/user.service';
import { ITask, Project } from './schema/create.project';

export enum ProjectError {
  ProjectNotFound = 'ProjectNotFound',
}
@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private userService: UserService,
    private taskNotify: TaskNotificationGateway,
  ) {}

  async createProject(email: string, title: string, description: string) {
    const owner = await this.userService.findUser(email);
    if (!owner) {
      return { error: UserError.UserNotFound };
    }
    console.log('Project Owner', owner);
    const project: Project = {
      title: title,
      description: description,
      owner: owner,
      tasks: [],
      collaborators: [owner],
    };
    console.log('project details', project);
    const newProject = new this.projectModel(project);
    const savedNewProject = await newProject.save();
    return savedNewProject;
  }

  async addCollaborator(
    ownerEmail: string,
    projectId: string,
    collaboratorEmail: string,
  ) {
    const collaborator = await this.userService.findUser(collaboratorEmail);
    if (!collaborator) {
      return { error: UserError.CollaboratorNotFound };
    }

    const project = await this.findProject(projectId);
    if (!project) {
      return { error: ProjectError.ProjectNotFound };
    }

    if (project.owner.email != ownerEmail) {
      return { error: UserError.PermissionDenied };
    }
    project.collaborators.push(collaborator);
    const updatedProject = await project.save();
    this.taskNotify.sendNotificationForTask({
      message: `User ${collaboratorEmail} added to project ${updatedProject.title}`,
    });
    return updatedProject;
  }

  async getAllTasksFormProject(projectId: string) {
    const project = await this.findProject(projectId);
    if (!project) {
      return { error: ProjectError.ProjectNotFound };
    }
    const tasks = project.tasks;
    return { data: { task: tasks } };
  }

  async deleteTaskFromProject(
    ownerEmail: string,
    projectId: string,
    taskId: string,
  ) {
    const project = await this.findProject(projectId);
    if (!project) {
      return { error: ProjectError.ProjectNotFound };
    }
    if (project.owner.email != ownerEmail) {
      return { error: UserError.PermissionDenied };
    }
    project.tasks = project.tasks.filter((task: ITask) => {
      if (task.taskId == taskId) {
        return false;
      }
      return true;
    });
    const updatedProject = await project.save();
    this.taskNotify.sendNotificationForTask({
      message: `User ${'collaboratorEmail'} deleted task ${taskId} from project ${project.title}`,
    });
    return updatedProject;
  }

  async createTask(
    ownerEmail: string,
    projectId: string,
    title: string,
    description: string,
    priority: number,
    days: number,
  ) {
    const project = await this.findProject(projectId);
    if (!project) {
      return { error: ProjectError.ProjectNotFound };
    }
    if (project.owner.email != ownerEmail) {
      return { error: UserError.PermissionDenied };
    }
    const task: ITask = {
      taskId: this.getUniqueTaskId(),
      tittle: title,
      description: description,
      priority: priority,
      dueDateInMs: Date.now() + days * DAYS_IN_MS,
      status: false,
    };
    project.tasks.push(task);
    const updatedProject = await project.save();
    this.taskNotify.sendNotificationForTask({
      message: `User ${'collaboratorEmail'} added to Task ${task.tittle} to project ${updatedProject.title}`,
    });
    return updatedProject;
  }
  async getAllProjectPendingTaskOwner() {
    const projects = await this.projectModel
      .find({}, { _id: false, __v: false })
      .exec();
    const userPendingTask: Record<string, ITask[]> = {};
    projects.forEach((project: Project) => {
      const owner = String(project.owner);
      project.tasks.forEach((task: ITask) => {
        if (task.dueDateInMs - HOURS_IN_MS > Date.now()) {
          if (!userPendingTask[owner]) {
            userPendingTask[owner] = [task];
          } else {
            userPendingTask[owner].push(task);
          }
        }
      });
    });
    return userPendingTask;
  }

  async updateTaskStatus(
    ownerEmail: string,
    projectId: string,
    taskId: string,
  ) {
    const project = await this.findProject(projectId);
    if (!project) {
      return { error: ProjectError.ProjectNotFound };
    }
    if (project.owner.email != ownerEmail) {
      return { error: UserError.PermissionDenied };
    }
    project.tasks.forEach((task: ITask) => {
      if (task.taskId == taskId) {
        task.status = task.status ? false : true;
      }
    });
    return project.save();
  }

  private getUniqueTaskId(): string {
    // TODO: Use uuid
    return String(Math.random());
  }

  private async findProject(id: string) {
    const project = await this.projectModel
      .findById(id)
      .populate('owner')
      .populate('collaborator')
      .exec();
    return project;
  }
}
