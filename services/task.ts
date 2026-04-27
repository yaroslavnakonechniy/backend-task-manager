import { IRepository } from "../interfaces";
import { ITask, TaskDataUpdate } from "../interfaces/entities/task";

export class TaskService {
  private repository: IRepository;
  
  constructor(repository: IRepository) {
    this.repository = repository;
  }

  public async getAllTasks() {
    return this.repository.findAll<ITask>();
  }

  public async getTaskById(id: string) {
    return this.repository.findById<ITask>(id);
  }

  public async createTask(taskData: ITask) {
    return this.repository.create<ITask, ITask>(taskData);
  }

  public async updateTask(id: string, taskData: TaskDataUpdate) {
    return this.repository.update<TaskDataUpdate, ITask | null>(id, taskData);
  }

  public async deleteTask(id: string) {
    return this.repository.delete(id);
  }
}
