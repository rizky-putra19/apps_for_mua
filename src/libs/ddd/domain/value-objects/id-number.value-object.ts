import {
  DomainPrimitive,
  ValueObject,
} from '../base-classes/value-object.base';
import { ID } from './id.value-object';

export class IDNumber extends ID {
  constructor(value: string) {
    super(value.toString());
  }

  public get value(): string {
    return this.props.value;
  }

  protected validate({ value }: DomainPrimitive<string>): void {}
}
