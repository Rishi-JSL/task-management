import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserError } from 'src/auth/auth.service';
import { DAYS_IN_MS, HOURS_IN_MS } from 'src/common/constants';
import { TaskNotificationGateway } from 'src/gateway/task-notification.gateway';
import { UserService } from 'src/user/user.service';
import { ITask, Project } from './schema/create.project';
import { UserRole, UserRoleType } from 'src/role/schema/user-role.schema';

export enum ProjectError {
  ProjectNotFound = 'projectNotFound',
  CollaboratorAlreadyPartOfProject = 'collaboratorAlreadyPartOfProject',
}
@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(UserRole.name) private userRoleModel: Model<UserRole>,
    private userService: UserService,
    private taskNotify: TaskNotificationGateway,
  ) {}

  async createProject(email: string, title: string, description: string) {
    const owner = await this.userService.findUser(email);
    if (!owner) {
      return { error: UserError.UserNotFound };
    }
    // TODO: unique key for projects identify project exist before creating
    const project: Project = {
      title: title,
      description: description,
      tasks: [],
    };
    console.log('project details', project);
    const newProject = new this.projectModel(project);
    const savedNewProject = await newProject.save();
    if (savedNewProject) {
      const role: UserRole = {
        projectId: savedNewProject.id,
        userEmail: owner.email,
        role: UserRoleType.SUPER_ADMIN,
      };
      const userRole = new this.userRoleModel(role);
      await userRole.save();
    }
    return savedNewProject;
  }

  async addCollaborator(
    userEmail: string,
    projectId: string,
    collaboratorEmail: string,
    roleType: UserRoleType,
  ) {
    const collaborator = await this.userService.findUser(collaboratorEmail);
    if (!collaborator) {
      return { error: UserError.CollaboratorNotFound };
    }

    const project = await this.findProject(projectId);
    if (!project) {
      return { error: ProjectError.ProjectNotFound };
    }
    const userRole = await this.findUserRole(userEmail, projectId);

    if (userRole?.role == UserRoleType.ADMIN) {
      return { error: UserError.PermissionDenied };
    }
    const collaboratorRole: UserRole = {
      projectId: project.id,
      userEmail: collaborator.email,
      role: roleType,
    };
    const collaboratorRoleInDb = await this.findUserRole(
      collaboratorEmail,
      projectId,
    );
    if (collaboratorRoleInDb) {
      return { error: ProjectError.CollaboratorAlreadyPartOfProject };
    }
    const newCollaborator = new this.userRoleModel(collaboratorRole);
    await newCollaborator.save();
    this.taskNotify.sendNotificationForTask({
      message: `User ${collaboratorEmail} added to project ${project.title}`,
    });
    return newCollaborator;
  }

  async getAllTasksFormProject(projectId: string, userEmail: string) {
    const project = await this.findProject(projectId);
    if (!project) {
      return { error: ProjectError.ProjectNotFound };
    }
    const userRole = await this.findUserRole(userEmail, projectId);
    if (!userRole) {
      return { error: UserError.PermissionDenied };
    }
    if (!this.isUserHaveReadAccessToTask(userRole.role)) {
      return { error: UserError.PermissionDenied };
    }
    const tasks = project.tasks;
    return { data: { task: tasks } };
  }

  async deleteTaskFromProject(
    userEmail: string,
    projectId: string,
    taskId: string,
  ) {
    const project = await this.findProject(projectId);
    if (!project) {
      return { error: ProjectError.ProjectNotFound };
    }
    const userRole = await this.findUserRole(userEmail, projectId);
    if (!userRole) {
      return { error: UserError.PermissionDenied };
    }
    if (!this.isUserHaveDeleteAccessToTask(userRole?.role)) {
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
      message: `User ${userEmail} deleted task ${taskId} from project ${project.title}`,
    });
    return updatedProject;
  }

  async createTask(
    userEmail: string,
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
    const userRole = await this.findUserRole(userEmail, projectId);
    if (!userRole) {
      return { error: UserError.PermissionDenied };
    }
    if (!this.isUserHaveCreateAccessToTask(userRole?.role)) {
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
    const projects = await this.projectModel.find().exec();
    const userPendingTask: Record<string, ITask[]> = {};
    projects.forEach(async (project) => {
      const users = await this.userRoleModel
        .find({ projectId: project.id })
        .exec();
      const owner = this.getProjectSuperAdmin(users);
      const ownerEmail = owner?.userEmail as string;

      if (!ownerEmail) return;

      project.tasks.forEach((task: ITask) => {
        if (task.dueDateInMs - HOURS_IN_MS > Date.now()) {
          if (!userPendingTask[ownerEmail]) {
            userPendingTask[ownerEmail] = [task];
          } else {
            userPendingTask[ownerEmail].push(task);
          }
        }
      });
    });
    return userPendingTask;
  }
  private getProjectSuperAdmin(userRole: UserRole[]) {
    return userRole.find((userRole: UserRole) => {
      return userRole.role == UserRoleType.SUPER_ADMIN;
    });
  }

  async updateTaskStatus(userEmail: string, projectId: string, taskId: string) {
    const project = await this.findProject(projectId);
    if (!project) {
      return { error: ProjectError.ProjectNotFound };
    }
    const userRole = await this.findUserRole(userEmail, projectId);
    if (!userRole) {
      return { error: UserError.PermissionDenied };
    }
    if (!this.isUserHaveUpdateAccessToTask(userRole.role)) {
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
    const project = await this.projectModel.findById(id).exec();
    return project;
  }

  private async findUserRole(userEmail: string, projectId: string) {
    const userRole = await this.userRoleModel
      .findOne({ userEmail, projectId })
      .exec();
    return userRole;
  }

  private isUserHaveReadAccessToTask(role: UserRoleType) {
    if (
      role == UserRoleType.ADMIN ||
      role == UserRoleType.EDITOR ||
      role == UserRoleType.SUPER_ADMIN ||
      role == UserRoleType.VIEWER
    ) {
      return true;
    }
    return false;
  }

  private isUserHaveDeleteAccessToTask(role: UserRoleType) {
    if (
      role == UserRoleType.SUPER_ADMIN ||
      role == UserRoleType.ADMIN ||
      role == UserRoleType.EDITOR
    ) {
      return true;
    }
    return false;
  }

  private isUserHaveUpdateAccessToTask(role: UserRoleType) {
    if (
      role == UserRoleType.SUPER_ADMIN ||
      role == UserRoleType.ADMIN ||
      role == UserRoleType.EDITOR
    ) {
      return true;
    }
    return false;
  }

  private isUserHaveCreateAccessToTask(role: UserRoleType) {
    if (role == UserRoleType.SUPER_ADMIN || role == UserRoleType.ADMIN) {
      return true;
    }
    return false;
  }
}
