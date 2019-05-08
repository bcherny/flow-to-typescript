/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
declare type React$Node = null | boolean | number | string | React$Element<any> | React$Portal | Iterable<React$Node | null | undefined>;
/**
 * Base class of ES6 React classes, modeled as a polymorphic class whose main
 * type parameters are Props and State.
 */

declare class React$Component<Props, State = void> {
  props: Props;
  state: State;
  setState: (partialState: (Partial<State> | null | undefined) | ((a: State, b: Props) => Partial<State> | null | undefined), callback: () => any) => void;
  forceUpdate: (callback: () => void) => void;
  constructor: (props: Props, context: any) => void;
  render: () => React$Node;
  componentWillMount: () => any;
  UNSAFE_componentWillMount: () => any;
  componentDidMount: () => any;
  componentWillReceiveProps: (nextProps: Props, nextContext: any) => any;
  UNSAFE_componentWillReceiveProps: (nextProps: Props, nextContext: any) => any;
  shouldComponentUpdate: (nextProps: Props, nextState: State, nextContext: any) => boolean;
  componentWillUpdate: (nextProps: Props, nextState: State, nextContext: any) => any;
  UNSAFE_componentWillUpdate: (nextProps: Props, nextState: State, nextContext: any) => any;
  componentDidUpdate: (prevProps: Props, prevState: State, prevContext: any) => any;
  componentWillUnmount: () => any;
  componentDidCatch: (error: Error, info: {
    componentStack: string;
  }) => any;
  refs: any;
  context: any;
  getChildContext: () => any;
  displayName?: string | null | undefined;
  childContextTypes: any;
  contextTypes: any;
  propTypes: any;
}

declare class React$PureComponent<Props, State = void> extends React$Component<Props, State> {
  props: Props;
  state: State;
}
/**
 * Base class of legacy React classes, which extends the base class of ES6 React
 * classes and supports additional methods.
 */


declare class LegacyReactComponent<Props, State> extends React$Component<Props, State> {
  replaceState: (state: State, callback: () => void) => void;
  isMounted: () => boolean;
  props: Props;
  state: State;
}

declare type React$AbstractComponentStatics = {
  displayName?: string | null | undefined;
  name?: string | null | undefined;
};
/**
 * The type of a stateless functional component. In most cases these components
 * are a single function. However, they may have some static properties that we
 * can type check.
 */

declare type React$StatelessFunctionalComponent<Props> = {
  displayName?: string | null | undefined;
  propTypes?: any;
  contextTypes?: any;
};
/**
 * The type of a component in React. A React component may be a:
 *
 * - Stateless functional components. Functions that take in props as an
 *   argument and return a React node.
 * - ES6 class component. Components with state defined either using the ES6
 *   class syntax, or with the legacy `React.createClass()` helper.
 */

declare type React$ComponentType<Config> = React$AbstractComponent<Config, any>;
/**
 * The type of an element in React. A React element may be a:
 *
 * - String. These elements are intrinsics that depend on the React renderer
 *   implementation.
 * - React component. See `ComponentType` for more information about its
 *   different variants.
 */

declare type React$ElementType = string | React$AbstractComponent<any, any>;
/**
 * Type of a React element. React elements are commonly created using JSX
 * literals, which desugar to React.createElement calls (see below).
 */

declare type React$Element<ElementType extends React$ElementType> = {
  type: ElementType;
  props: React$ElementProps<ElementType>;
  key: React$Key | null;
  ref: any;
};
/**
 * The type of the key that React uses to determine where items in a new list
 * have moved.
 */

declare type React$Key = string | number;
/**
 * The type of the ref prop available on all React components.
 */

declare type React$Ref<ElementType extends React$ElementType> = {
  current: React$ElementRef<ElementType> | null;
} | ((a: React$ElementRef<ElementType> | null) => any) | string;
/**
 * The type of a React Context.  React Contexts are created by calling
 * createContext() with a default value.
 */

declare type React$Context<T> = {
  Provider: React$ComponentType<{
    value: T;
    children?: React$Node | null | undefined;
  }>;
  Consumer: React$ComponentType<{
    children: (value: T) => React$Node | null | undefined;
  }>;
};
/**
 * A React portal node. The implementation of the portal node is hidden to React
 * users so we use an opaque type.
 */

declare opaque type React$Portal;
declare namespace react {
  export var DOM: any;
  export var PropTypes: ReactPropTypes;
  export var version: string;
  export declare function checkPropTypes<V>(propTypes: any, values: V, location: string, componentName: string, getStack: () => string | null | undefined | null | undefined): void;
  export var createClass: React$CreateClass;
  export declare function createContext<T>(defaultValue: T, calculateChangedBits: (a: T, b: T) => number | null | undefined): React$Context<T>;
  export var createElement: React$CreateElement;
  export var cloneElement: React$CloneElement;
  export declare function createFactory<ElementType extends React$ElementType>(type: ElementType): React$ElementFactory<ElementType>;
  export declare function createRef<T>(): {
    current: null | T;
  };
  export declare function isValidElement(element: any): boolean;
  export var Component: typeof React$Component;
  export var PureComponent: typeof React$PureComponent;
  export type StatelessFunctionalComponent<P> = React$StatelessFunctionalComponent<P>;
  export type ComponentType<P> = React$ComponentType<P>;
  export type AbstractComponent<Config, Instance = any> = React$AbstractComponent<Config, Instance>;
  export type ElementType = React$ElementType;
  export type Element<C> = React$Element<C>;
  export var Fragment: (a: {
    children: React$Node | null | undefined;
  }) => React$Node;
  export type Key = React$Key;
  export type Ref<C> = React$Ref<C>;
  export type Node = React$Node;
  export type Context<T> = React$Context<T>;
  export type Portal = React$Portal;
  export var ConcurrentMode: (a: {
    children: React$Node | null | undefined;
  }) => React$Node; // 16.7+

  export var StrictMode: (a: {
    children: React$Node | null | undefined;
  }) => React$Node;
  export var Suspense: React$ComponentType<{
    children?: React$Node | null | undefined;
    fallback?: React$Node;
    maxDuration?: number;
  }>; // 16.6+

  export type ElementProps<C> = React$ElementProps<C>;
  export type ElementConfig<C> = React$ElementConfig<C>;
  export type ElementRef<C> = React$ElementRef<C>;
  export type Config<Props, DefaultProps> = React$Config<Props, DefaultProps>;
  export type ChildrenArray<T> = $ReadOnlyArray<ChildrenArray<T>> | T;
  export var Children: {
    map: <T, U>(children: ChildrenArray<T>, fn: (child: $NonMaybeType<T>, index: number) => U, thisArg: any) => Array<$NonMaybeType<U>>;
    forEach: <T>(children: ChildrenArray<T>, fn: (child: T, index: number) => any, thisArg: any) => void;
    count: (children: ChildrenArray<any>) => number;
    only: <T>(children: ChildrenArray<T>) => $NonMaybeType<T>;
    toArray: <T>(children: ChildrenArray<T>) => Array<$NonMaybeType<T>>;
  };
  export declare function forwardRef<Config, Instance>(render: (props: Config, ref: {
    current: null | Instance;
  } | ((a: null | Instance) => any)) => React$Node): React$AbstractComponent<Config, Instance>;
  export declare function memo<P>(component: React$StatelessFunctionalComponent<P>, equal: (a: P, b: P) => boolean): React$StatelessFunctionalComponent<P>;
  export declare function lazy<P>(component: () => Promise<{
    default: React$ComponentType<P>;
  }>): React$ComponentType<P>;
  declare type MaybeCleanUpFn = () => any | null | undefined;
  export declare function useContext<T>(context: React$Context<T>, observedBits: void | number | boolean): T;
  export declare function useState<S>(initialState: (() => S) | S): [S, (a: ((a: S) => S) | S) => void];
  export declare function useReducer<S, A>(reducer: (a: S, b: A) => S, initialState: S, initialAction: A | null | undefined): [S, (a: A) => void];
  export declare function useRef<T>(initialValue: T | null | undefined): {
    current: T | null;
  };
  export declare function useEffect(create: () => MaybeCleanUpFn, inputs: $ReadOnlyArray<any> | null | undefined): void;
  export declare function useLayoutEffect(create: () => MaybeCleanUpFn, inputs: $ReadOnlyArray<any> | null | undefined): void;
  export declare function useCallback<T extends () => any>(callback: T, inputs: $ReadOnlyArray<any> | null | undefined): T;
  export declare function useMemo<T>(create: () => T, inputs: $ReadOnlyArray<any> | null | undefined): T;
  export declare function useImperativeMethods<T>(ref: {
    current: T | null;
  } | ((inst: T | null) => any) | null | void, create: () => T, inputs: $ReadOnlyArray<any> | null | undefined): void;
  export {
    DOM: typeof DOM;
    PropTypes: typeof PropTypes;
    version: typeof version;
    checkPropTypes: typeof checkPropTypes;
    memo: typeof memo;
    lazy: typeof lazy;
    createClass: typeof createClass;
    createContext: typeof createContext;
    createElement: typeof createElement;
    cloneElement: typeof cloneElement;
    createFactory: typeof createFactory;
    createRef: typeof createRef;
    forwardRef: typeof forwardRef;
    isValidElement: typeof isValidElement;
    Component: typeof Component;
    PureComponent: typeof PureComponent;
    Fragment: typeof Fragment;
    Children: typeof Children;
    ConcurrentMode: typeof ConcurrentMode;
    StrictMode: typeof StrictMode;
    Suspense: typeof Suspense;
    useContext: typeof useContext;
    useState: typeof useState;
    useReducer: typeof useReducer;
    useRef: typeof useRef;
    useEffect: typeof useEffect;
    useLayoutEffect: typeof useLayoutEffect;
    useCallback: typeof useCallback;
    useMemo: typeof useMemo;
    useImperativeMethods: typeof useImperativeMethods;
  };
} // TODO Delete this once https://github.com/facebook/react/pull/3031 lands
// and "react" becomes the standard name for this module

declare namespace React {
  declare module.exports: $Exports<"react">
}
type ReactPropsCheckType = (props: any, propName: string, componentName: string, href: string) => Error | null | undefined;
type ReactPropsChainableTypeChecker = {
  isRequired: ReactPropsCheckType;
};
type React$PropTypes$arrayOf = (typeChecker: ReactPropsCheckType) => ReactPropsChainableTypeChecker;
type React$PropTypes$instanceOf = (expectedClass: any) => ReactPropsChainableTypeChecker;
type React$PropTypes$objectOf = (typeChecker: ReactPropsCheckType) => ReactPropsChainableTypeChecker;
type React$PropTypes$oneOf = (expectedValues: Array<any>) => ReactPropsChainableTypeChecker;
type React$PropTypes$oneOfType = (arrayOfTypeCheckers: Array<ReactPropsCheckType>) => ReactPropsChainableTypeChecker;
type React$PropTypes$shape = (shapeTypes: {
  [key: string]: ReactPropsCheckType
}) => ReactPropsChainableTypeChecker;
type ReactPropTypes = {
  array: React$PropType$Primitive<Array<any>>;
  bool: React$PropType$Primitive<boolean>;
  func: React$PropType$Primitive<Function>;
  number: React$PropType$Primitive<number>;
  object: React$PropType$Primitive<Object>;
  string: React$PropType$Primitive<string>;
  any: React$PropType$Primitive<any>;
  arrayOf: React$PropType$ArrayOf;
  element: React$PropType$Primitive<any>;
  instanceOf: React$PropType$InstanceOf;
  node: React$PropType$Primitive<any>;
  objectOf: React$PropType$ObjectOf;
  oneOf: React$PropType$OneOf;
  oneOfType: React$PropType$OneOfType;
  shape: React$PropType$Shape;
};
