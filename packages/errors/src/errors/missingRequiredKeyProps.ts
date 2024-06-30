import { CustomError } from "./error";
import { InstanceType } from "@rx-bot/common";
import { ErrorCode } from "../errorCode";

export class MissingRequiredKeyPropsError extends CustomError {
  constructor(instanceType: InstanceType) {
    super(
      `Missing required key props for instance type ${instanceType}. 
      You need to provide the required key props when defining the instance with onClick prop.`,
      ErrorCode.MissingRequiredKeyProps,
    );
  }
}
