export interface EditorChoiceRepositoryPort {
  exist(artisanID: string): Promise<boolean>;
}
