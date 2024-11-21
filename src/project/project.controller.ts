import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { ProjectService } from './project.service';
import { addCollaboratorDto } from './dto/add-collaborator.dto';
import { CreateUserProjectDto } from './dto/create-project.dto';
import { AuthGuard } from 'src/auth/auth.gaurd';
import { IJwtTokenUserData } from 'src/interface';
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @UseGuards(AuthGuard)
  @Get('/:projectId')
  getALLTaskFromProjects(@Param('projectId') projectId: string) {
    return this.projectService.getAllTasksFormProject(projectId);
  }

  @UseGuards(AuthGuard)
  @Post('/create-project')
  createUserProject(
    @Req() request: any,
    @Body() createProject: CreateUserProjectDto,
  ) {
    const { title, description } = createProject;
    const userData = request['user'] as IJwtTokenUserData;
    const email = userData.email;
    return this.projectService.createProject(email, title, description);
  }

  @UseGuards(AuthGuard)
  @Post('/add-collaborator')
  addCollaboratorInProject(
    @Req() request: any,
    @Body() addCollaborator: addCollaboratorDto,
  ) {
    const { projectId, collaboratorEmail } = addCollaborator;
    const userData = request['user'] as IJwtTokenUserData;
    const userEmail = userData.email;
    return this.projectService.addCollaborator(
      userEmail,
      projectId,
      collaboratorEmail,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('/:projectId/tasks/:taskId')
  deleteTaskFromProjects(
    @Req() request: any,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    const userData = request['user'] as IJwtTokenUserData;
    const userEmail = userData.email;
    return this.projectService.deleteTaskFromProject(
      userEmail,
      projectId,
      taskId,
    );
  }

  @UseGuards(AuthGuard)
  @Post('/create-task')
  createTask(@Req() request: any, @Body() createTaskDto: CreateTaskDto) {
    const { title, description, projectId, priority, days } = createTaskDto;
    const userData = request['user'] as IJwtTokenUserData;
    const userEmail = userData.email;
    return this.projectService.createTask(
      userEmail,
      projectId,
      title,
      description,
      priority,
      days,
    );
  }

  @UseGuards(AuthGuard)
  @Patch('/:projectId/update-task-status/:taskId')
  updateUserProjectTaskStatus(
    @Req() request: any,
    @Param('taskId') taskId: string,
    @Param('projectId') projectId: string,
  ) {
    const userData = request['user'] as IJwtTokenUserData;
    const userEmail = userData.email;
    return this.projectService.updateTaskStatus(userEmail, projectId, taskId);
  }
}
