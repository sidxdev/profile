import React from "react";
import { Menu } from "semantic-ui-react";
import Profile from "./components/Profile";

class App extends React.Component {
  constructor() {
    super();

    let disableConnect = typeof window.ethereum === "undefined";

    this.state = {
      theme: localStorage.getItem("theme") || "light",
      connect: false,
      disableConnect,
      id: "",
    };

    this.profile = React.createRef();
  }

  componentDidMount() {
    this.setTheme(this.state.theme);
  }

  onClickToggleTheme() {
    if (this.state.theme === "dark") {
      this.setTheme("light");
    } else {
      this.setTheme("dark");
    }
  }

  setTheme(theme) {
    this.setState({ theme });
    localStorage.setItem("theme", theme);
    document.body.classList.remove("dark");
    document.body.classList.remove("light");
    document.body.classList.add(theme);
  }

  onClickConnect() {
    if (this.state.connect) {
      this.setState({ connect: false, id: "" });
    } else {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          let id = accounts[0];
          this.setState({ connect: true, id });
          this.profile.current.loadData(id);
        })
        .catch((_) => {
          this.setState({ connect: false, id: "" });
        });
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
          <Menu.Item
            header
            content={
              this.state.id
                ? `Profile ${this.state.id.substring(
                    0,
                    6
                  )}...${this.state.id.slice(-4)}`
                : "Profile"
            }
          />
          <Menu.Item
            position="right"
            icon={this.state.theme === "dark" ? "moon" : "sun"}
            onClick={this.onClickToggleTheme.bind(this)}
          />
          <Menu.Item
            name={
              this.state.disableConnect
                ? "Install Metamask"
                : this.state.connect
                ? "Disconnect"
                : "Connect"
            }
            icon={this.state.disableConnect ? "warning" : "power"}
            onClick={
              this.state.disableConnect
                ? () => {
                    window.open("https://metamask.io", "_blank");
                  }
                : this.onClickConnect.bind(this)
            }
          />
        </Menu>
        <Profile
          ref={this.profile}
          theme={this.state.theme}
          id={this.state.id}
        />
      </div>
    );
  }
}

export default App;
