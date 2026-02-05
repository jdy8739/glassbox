import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Validator to ensure two arrays have matching lengths
 */
@ValidatorConstraint({ name: 'arrayLengthMatch', async: false })
export class ArrayLengthMatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (!Array.isArray(value) || !Array.isArray(relatedValue)) {
      return false;
    }

    return value.length === relatedValue.length;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} and ${relatedPropertyName} arrays must have the same length`;
  }
}

/**
 * Decorator to validate that two array properties have matching lengths
 * @param property - The name of the related property to compare against
 * @param validationOptions - Additional validation options
 */
export function ArrayLengthMatch(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: ArrayLengthMatchConstraint,
    });
  };
}
