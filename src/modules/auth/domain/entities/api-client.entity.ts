import { AggregateRoot } from '@src/libs/ddd/domain/base-classes/aggregate-root.base';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { UUID } from '@src/libs/ddd/domain/value-objects/uuid.value-object';
import { genSaltSync } from 'bcrypt';
import crypto from 'crypto';

export interface ApiClientProps {
  secret: string;
  grantType: string[];
}
export class ApiClientEntity extends AggregateRoot<ApiClientProps> {
  protected readonly _id: UUID;
  static create(request: ApiClientProps): ApiClientEntity {
    const id = UUID.generate();
    var randomString = crypto.randomBytes(48, function (err, buffer) {
      var token = buffer.toString('hex');
    });

    const apiClientProps: ApiClientProps = {
      secret: request.secret,
      grantType: request.grantType,
    };

    const apiClient = new ApiClientEntity({
      id,
      props: apiClientProps,
    });
    return apiClient;
  }
}
