export interface CreateArtisanMetadata {}
export interface CreateCustomerMetadata {
  birthdate: string;
}

export class ArtisanMetadataEntity {
  private editorChoice: boolean;
  constructor(props: ArtisanMetadataEntity) {
    this.editorChoice = props.editorChoice;
  }
}
