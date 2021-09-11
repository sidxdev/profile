import React from "react";
import { Button, Input, Menu, Message, Modal } from "semantic-ui-react";
import Profile from "./components/Profile";
import { stringToHex } from "./lib/HexStringUtil";

class App extends React.Component {
  constructor() {
    super();

    let disableConnect = typeof window.ethereum === "undefined";

    this.state = {
      theme: localStorage.getItem("theme") || "light",
      connect: false,
      disableConnect,
      id: "",
      addModalOpen: false,
      postMessage: "",
      disableRefresh: false,
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

  onClickAdd() {
    this.setState({ addModalOpen: true, postMessage: "" });
  }

  async onClickPostToMetamask() {
    let post = this.state.postMessage;
    let hex = stringToHex(post);

    window.ethereum
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            to: window.ethereum.selectedAddress,
            from: window.ethereum.selectedAddress,
            data: `0x${hex}`,
          },
        ],
      })
      .then((_) => {})
      .catch((_) => {})
      .finally((_) => this.setState({ addModalOpen: false, postMessage: "" }));
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
          {this.state.id && (
            <Menu.Item
              icon="refresh"
              disabled={this.state.disableRefresh}
              onClick={() => {
                this.profile.current.loadData(this.state.id);
                this.setState({ disableRefresh: true });
                setTimeout(
                  () => this.setState({ disableRefresh: false }),
                  2000
                );
              }}
            />
          )}

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
        <Button
          circular
          icon="add"
          size="big"
          onClick={this.onClickAdd.bind(this)}
          style={{
            display: this.state.connect ? "block" : "none",
            position: "fixed",
            margin: "2em",
            bottom: "0px",
            right: "0px",
            zIndex: 6,
          }}
        />
        <Modal open={this.state.addModalOpen}>
          <Modal.Header>Post a new Message</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Input
                fluid
                placeholder="Enter your messsage"
                onChange={(e, { value }) =>
                  this.setState({ postMessage: value })
                }
              />
              <Message warning>
                <p>
                  Metamask will prompt you for transaction confirmation. Verify
                  transaction amount is 0 and to address is your own. The data
                  input will be a hex encode of your post.
                </p>
                <p>
                  After confirming in Metamask, the transaction may take some
                  time to finalize on the blockchain based on network
                  conditions. You can refresh from the header icon when Metamask
                  notifies you of successful posting.
                </p>
              </Message>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button
              negative
              content="Cancel"
              onClick={() =>
                this.setState({ addModalOpen: false, postMessage: "" })
              }
            />
            <Button
              content="Post"
              labelPosition="right"
              icon="checkmark"
              positive
              disabled={this.state.postMessage ? false : true}
              onClick={this.onClickPostToMetamask.bind(this)}
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default App;
