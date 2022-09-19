import {
  DomainPrimitive,
  ValueObject,
} from '../base-classes/value-object.base';

export class ID extends ValueObject<string> {
  constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  protected validate({ value }: DomainPrimitive<string>): void {}
}
