import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserError } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { ITask, Project } from './schema/create.project';
import { TaskNotificationGateway } from 'src/gateway/task-notification.gateway';

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
      owner: owner._id,
      tasks: [],
      collaborators: [owner._id],
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
    // user validation not required, validated using token
    const collaborator = await this.userService.findUser(collaboratorEmail);
    if (!collaborator) {
      return { error: UserError.CollaboratorNotFound };
    }

    const project = await this.findProject(projectId);
    if (!project) {
      return { error: ProjectError.ProjectNotFound };
    }
    const owner = await this.userService.findUser(ownerEmail);

    if (project.owner != owner?._id) {
      return { error: UserError.PermissionDenied };
    }
    project.collaborators.push(collaborator._id);
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

  async deleteTaskFromProject(projectId: string, taskId: string) {
    const project = await this.findProject(projectId);
    if (!project) {
      return { error: ProjectError.ProjectNotFound };
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
    projectId: string,
    title: string,
    description: string,
    priority: number,
    dueDate: Date,
  ) {
    const project = await this.findProject(projectId);
    if (!project) {
      return { error: ProjectError.ProjectNotFound };
    }
    const task: ITask = {
      taskId: this.getUniqueTaskId(),
      tittle: title,
      description: description,
      priority: priority,
      dueDate: dueDate,
    };
    project.tasks.push(task);
    const updatedProject = await project.save();
    this.taskNotify.sendNotificationForTask({
      message: `User ${'collaboratorEmail'} added to Task ${task.tittle} to project ${updatedProject.title}`,
    });
    return updatedProject;
  }
  private getUniqueTaskId(): string {
    // TODO: Use uuid
    return String(Math.random());
  }

  private async findProject(id: string) {
    const project = await this.projectModel.findById(id);
    return project;
  }
}
