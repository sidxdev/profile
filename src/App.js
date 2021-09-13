import React from "react";
import { createRef } from "react";
import { Button, Input, Menu, Message, Modal } from "semantic-ui-react";
import Profile from "./components/Profile";
import { stringToHex } from "./lib/HexStringUtil";
const { create } = require("ipfs-http-client");

class App extends React.Component {
  constructor() {
    super();

    let disableConnect = typeof window.ethereum === "undefined";
    const id = localStorage.getItem("id") || "";
    const chain = localStorage.getItem("chain") || null;
    const ipfsHost = localStorage.getItem("ipfs") || "http://localhost:5001";
    this.ipfs = create(ipfsHost);
    this.fileUploadRef = createRef();

    this.state = {
      ipfsHost,
      theme: localStorage.getItem("theme") || "light",
      connect: id ? true : false,
      disableConnect,
      id,
      chain,
      addModalOpen: false,
      ipfsModalOpen: false,
      postMessage: "",
      disableRefresh: false,
      ipfs: false,
      fileUploaded: null,
    };

    this.profile = React.createRef();
  }

  componentDidMount() {
    this.setTheme(this.state.theme);

    this.ipfs.isOnline().then((_) => {
      this.setState({ ipfs: true });
    });
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
          let chain = parseInt(window.ethereum.chainId);
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
    this.setState({ addModalOpen: true, postMessage: "", fileUploaded: null });
  }

  async onClickPostToMetamask() {
    let post = this.state.postMessage;
    let hex;

    // Image upload
    if (this.state.fileUploaded) {
      const { cid: imageCID } = await this.ipfs.add(this.state.fileUploaded, {
        pin: true,
      });
      post = JSON.stringify({
        text: post,
        image: imageCID.toString(),
      });
    }

    // Put long posts on ipfs
    if (
      post instanceof File ||
      (post.length > 60 && !post.startsWith("https://"))
    ) {
      const { cid } = await this.ipfs.add(post, { pin: true });
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
      .finally((_) =>
        this.setState({
          addModalOpen: false,
          postMessage: "",
          fileUploaded: null,
        })
      );
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
            icon="cubes"
            onClick={() => this.setState({ ipfsModalOpen: true })}
          />
          <Menu.Item
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
                maxLength={this.state.ipfs ? 1000 : 60}
                fluid
                placeholder="Enter your messsage"
                onChange={(e, { value }) =>
                  this.setState({ postMessage: value })
                }
              />
              {this.state.ipfs ? (
                <div style={{ marginTop: "1em" }}>
                  <Button
                    content="Upload Image"
                    labelPosition="left"
                    icon="file"
                    onClick={() => this.fileUploadRef.current.click()}
                  />
                  <input
                    ref={this.fileUploadRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={({ target }) =>
                      this.setState({ fileUploaded: target.files[0] })
                    }
                  />
                  {this.state.fileUploaded && (
                    <Button
                      negative
                      icon="remove"
                      content={this.state.fileUploaded.name}
                      onClick={() => {
                        this.setState({ fileUploaded: null });
                      }}
                    />
                  )}
                </div>
              ) : (
                <Message
                  error
                  content="Cannot connect to IPFS Node. Posts are limited to 60 characters."
                />
              )}
              <Message warning>
                <p>
                  Your wallet will prompt you for transaction confirmation.
                  Verify transaction amount is 0 and to address is your own. The
                  data input will be a hex encode of your post.
                </p>
                <p>
                  After confirming in your wallet, the transaction may take some
                  time to finalize on the blockchain based on network
                  conditions. You can refresh from the header icon when your
                  wallet notifies you of successful posting.
                </p>
              </Message>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button
              negative
              content="Cancel"
              onClick={() =>
                this.setState({
                  addModalOpen: false,
                  postMessage: "",
                  fileUploaded: null,
                })
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
        <Modal open={this.state.ipfsModalOpen}>
          <Modal.Header>Set IPFS Node</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Input
                fluid
                value={this.state.ipfsHost}
                onChange={(e, { value }) => this.setState({ ipfsHost: value })}
              />
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button
              negative
              content="Cancel"
              onClick={() => this.setState({ ipfsModalOpen: false })}
            />
            <Button
              disabled={
                this.state.ipfsHost &&
                (this.state.ipfsHost.startsWith("http://") ||
                  this.state.ipfsHost.startsWith("https://"))
                  ? false
                  : true
              }
              content="Save"
              labelPosition="right"
              icon="checkmark"
              positive
              onClick={() => {
                localStorage.setItem("ipfs", this.state.ipfsHost);
                window.location.reload();
              }}
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default App;
