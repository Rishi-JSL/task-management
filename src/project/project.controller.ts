import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { ProjectService } from './project.service';
import { addCollaboratorDto } from './dto/add-collaborator.dto';
import { CreateUserProjectDto } from './dto/create-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get('/:projectId')
  getALLTaskFromProjects(@Param('projectId') projectId: string) {
    return this.projectService.getAllTasksFormProject(projectId);
  }

  @Post('/create-project')
  createUserProject(@Body() createProject: CreateUserProjectDto) {
    const { title, description, email } = createProject;
    return this.projectService.createProject(email, title, description);
  }

  @Post('/add-collaborator')
  addCollaboratorInProject(@Body() addCollaborator: addCollaboratorDto) {
    const { projectId, collaboratorEmail } = addCollaborator;
    const userEmail = ''; // get email from token
    return this.projectService.addCollaborator(
      userEmail,
      projectId,
      collaboratorEmail,
    );
  }

  @Delete('/:projectId/tasks/:taskId')
  deleteTaskFromProjects(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.projectService.deleteTaskFromProject(projectId, taskId);
  }

  @Post('/create-task')
  createTask(@Body() createTaskDto: CreateTaskDto) {
    const { title, description, projectId, priority, dueDate } = createTaskDto;
    return this.projectService.createTask(
      projectId,
      title,
      description,
      priority,
      dueDate,
    );
  }
}
