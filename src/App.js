import React from "react";
import { Button, Input, Menu, Message, Modal } from "semantic-ui-react";
import Profile from "./components/Profile";
import { stringToHex } from "./lib/HexStringUtil";
const { create } = require("ipfs-http-client");
const ipfs = create("http://localhost:5001");

class App extends React.Component {
  constructor() {
    super();

    let disableConnect = typeof window.ethereum === "undefined";
    const id = localStorage.getItem("id") || "";
    const chain = localStorage.getItem("chain") || null;

    this.state = {
      theme: localStorage.getItem("theme") || "light",
      connect: id ? true : false,
      disableConnect,
      id,
      chain,
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
      localStorage.removeItem("feed");
      localStorage.removeItem("id");
    } else {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          let chain = window.ethereum.chainId;
          if (chain.startsWith("0x")) {
            chain = parseInt(chain);
          }
          let id = accounts[0];
          localStorage.setItem("id", id);
          localStorage.setItem("chain", chain);
          this.setState({ connect: true, id, chain });
          this.profile.current.loadData(id);
        })
        .catch((_) => {
          this.setState({ connect: false, id: "" });
          localStorage.removeItem("feed");
          localStorage.removeItem("id");
        });
    }
  }

  onClickAdd() {
    this.setState({ addModalOpen: true, postMessage: "" });
  }

  async onClickPostToMetamask() {
    let post = this.state.postMessage;
    let hex;

    // Put long posts on ipfs
    if (post.length > 60) {
      const { cid } = await ipfs.add(post, { pin: true });
      hex = stringToHex(`ipfs://${cid.toString()}`);
    } else {
      hex = stringToHex(post);
    }

    window.ethereum
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            to: this.state.id,
            from: this.state.id,
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
          <Menu.Item header content="Profile" />
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
          chain={this.state.chain}
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
