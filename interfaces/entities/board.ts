export interface IBoard {
  id: string;
  name: string;
  description: string;
  authorId: string;
}

export type BoardDataUpdate = Partial<Omit<IBoard, 'id' | 'authorId'>>;
