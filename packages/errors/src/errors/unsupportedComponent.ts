import { ErrorCode } from "../errorCode";
import { CustomError } from "./error";
import { InstanceType } from "@rx-lab/common";

/**
 * Custom error class to indicate
 * that a component is not supported.
 */
export class UnsupportedComponentError extends CustomError {
  constructor(instanceType: InstanceType) {
    super(
      `The given instance type ${instanceType} is not supported.`,
      ErrorCode.UnsupportedComponent,
    );
  }
}
