import React from "react";
import { Menu } from "semantic-ui-react";
import Profile from "./components/Profile";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      theme: "light",
      connect: false,
    };
  }

  onClickToggleTheme() {
    if (this.state.theme === "dark") {
      this.setState({ theme: "light" });
      document.body.classList.remove("dark")
      document.body.classList.add("light")
    } else {
      this.setState({ theme: "dark" });
      document.body.classList.remove("light")
      document.body.classList.add("dark")
    }
  }

  onClickConnect() {
    if (this.state.connect) {
      this.setState({ connect: false });
    } else {
      this.setState({ connect: true });
    }
  }

  render() {
    return (
      <div className={this.state.theme}>
        <Menu
          fixed="top"
          compact
          borderless
          inverted={this.state.theme === "dark"}
        >
          <Menu.Item header content="Profile" />
          <Menu.Item
            position="right"
            icon={this.state.theme === "dark" ? "moon" : "sun"}
            onClick={this.onClickToggleTheme.bind(this)}
          />
          <Menu.Item
            name={this.state.connect ? "Disconnect" : "Connect"}
            icon="power"
            onClick={this.onClickConnect.bind(this)}
          />
        </Menu>
        <Profile theme={this.state.theme} />
      </div>
    );
  }
}

export default App;
