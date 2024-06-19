import {
  Container,
  HostContext,
  InstanceProps,
  ReactInstanceType,
} from "@rx-bot/common";
import { Component } from "../components";

/**
 * Builder is a class that is responsible for building the instance of the host element.
 * @see packages/core/src/builder/componentBuilder.ts
 **/
export interface Builder {
  /**
   * Build the instance of the host element based on the type and props.
   * This function is used at the beginning of the render phase and
   * should map the instance type to any supported component.
   *
   * @see packages/core/src/builder/componentBuilder.ts
   * @param type InstanceType
   * @param props InstanceProps
   * @param rootContainer Container
   * @param hostContext HostContext
   */
  build(
    type: ReactInstanceType,
    props: InstanceProps,
    rootContainer: Container,
    hostContext: HostContext,
  ): Component;
}