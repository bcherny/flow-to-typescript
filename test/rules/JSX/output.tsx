import React from "react";
export default class SampleComponent extends React.Component<{
  test: string;
}, {}> {
  render() {
    return <div>{this.props.text}</div>;
  }

}
