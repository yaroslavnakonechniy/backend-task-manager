export interface IBoard {
  id: string;
  name: string;
  description: string;
  authorId: string;
}

export type BoardDataCreate = Omit<IBoard, 'id' | 'authorId'>;
export type BoardDataUpdate = Partial<Omit<IBoard, 'id' | 'authorId'>>;
