import { IRepository } from "../interfaces";
import { IBoard, BoardDataUpdate } from "../interfaces/entities/board";

export class BoardService {
  private repository: IRepository;
  
  constructor(repository: IRepository) {
    this.repository = repository;
  }

  public async getAllBoards() {
    return this.repository.findAll<IBoard>();
  }

  public async getBoardById(id: string) {
    return this.repository.findById<IBoard>(id);
  }

  public async createBoard(boardData: IBoard) {
    return this.repository.create<IBoard, IBoard>(boardData);
  }

  public async updateBoard(id: string, boardData: BoardDataUpdate) {
    return this.repository.update<BoardDataUpdate, IBoard | null>(id, boardData);
  }

  public async deleteBoard(id: string) {
    return this.repository.delete(id);
  }
}
