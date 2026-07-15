import { Component, PropsWithChildren } from "react";
import { RecoilRoot } from "recoil";
// Global stylesheet for the components/ui primitive layer (NutUI-backed
// Picker/Radio/Checkbox/Tabs/Sheet widgets need this to render correctly).
import "@nutui/nutui-react-taro/dist/style.css";
import "./app.scss";

class App extends Component<PropsWithChildren> {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return <RecoilRoot>{this.props.children}</RecoilRoot>;
  }
}

export default App;
