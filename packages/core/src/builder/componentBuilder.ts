import { Builder } from "./builder";
import {
  Container,
  HostContext,
  InstanceProps,
  InstanceType,
  ReactInstanceType,
} from "@rx-bot/common";
import { Button } from "../components";
import {
  UnsupportedComponentError,
  UnsupportedReactComponentError,
} from "@rx-bot/errors";
import { Component, ComponentOptions } from "../components";
import { Menu } from "../components/Menu";
import { Container as ContainerComponent } from "../components/Container";
import { Header } from "../components/Header";
import { LineBreak } from "../components/LineBreak";

type InstanceTypeKeys = keyof typeof InstanceType;

interface Constructor<T> {
  new (opts: ComponentOptions): T;
}

/**
 * ComponentBuilder is a class that is responsible for building the instance of the host element.
 * The target is to create the instance of the host element based on the instance type.
 */
export class ComponentBuilder implements Builder {
  /**
   * Mapper that maps the instance type to the component.
   * Add new supported components here.
   */
  componentMapper: { [key in InstanceTypeKeys]?: Constructor<Component> } = {
    [InstanceType.Button]: Button,
    [InstanceType.Menu]: Menu,
    [InstanceType.Container]: ContainerComponent,
    [InstanceType.Header]: Header,
    [InstanceType.LineBreak]: LineBreak as unknown as Constructor<Component>,
  };

  /**
   * Mapper that maps the React instance type to the instance type.
   * You can map the React instance type to target instance by combining the
   * reactInstanceMapper and componentMapper together.
   *
   * @see componentMapper
   */
  reactInstanceMapper: { [key: string]: InstanceType } = {
    [ReactInstanceType.Button]: InstanceType.Button,
    [ReactInstanceType.Div]: InstanceType.Container,
    [ReactInstanceType.Text]: InstanceType.Text,
    [ReactInstanceType.Paragraph]: InstanceType.Container,
    [ReactInstanceType.Menu]: InstanceType.Menu,
    [ReactInstanceType.H1]: InstanceType.Header,
    [ReactInstanceType.H2]: InstanceType.Header,
    [ReactInstanceType.H3]: InstanceType.Header,
    [ReactInstanceType.H4]: InstanceType.Header,
    [ReactInstanceType.H5]: InstanceType.Header,
    [ReactInstanceType.H6]: InstanceType.Header,
    [ReactInstanceType.NewLine]: InstanceType.LineBreak,
    [ReactInstanceType.ThematicBreak]: InstanceType.LineBreak,
  };

  build(
    reactInstanceType: ReactInstanceType,
    props: InstanceProps,
    rootContainer: Container,
    hostContext: HostContext,
  ): Component {
    const mappedInstanceType = this.getInstanceType(reactInstanceType);
    // if supported, then create the component
    return this.getComponent(
      mappedInstanceType,
      props,
      rootContainer,
      hostContext,
    );
  }

  /**
   * Get component from instance type and create the instance out of the component.
   * @param mappedInstanceType
   * @param props
   * @param container
   * @param hostContext
   * @private
   */
  private getComponent(
    mappedInstanceType: InstanceType,
    props: InstanceProps,
    container: Container,
    hostContext: HostContext,
  ) {
    const Component = this.componentMapper[mappedInstanceType];
    if (!Component) {
      throw new UnsupportedComponentError(mappedInstanceType);
    }

    return new Component({
      props,
      container,
      hostContext,
    });
  }

  /**
   * Get instance type from React instance type
   * @param instanceType
   * @private
   */
  private getInstanceType(instanceType: ReactInstanceType) {
    // first map the instance type to the supported instance type
    const mappedInstanceType = (this.reactInstanceMapper as any)[
      instanceType
    ] as InstanceType | undefined;

    if (!mappedInstanceType) {
      throw new UnsupportedReactComponentError(instanceType);
    }
    return mappedInstanceType;
  }
}