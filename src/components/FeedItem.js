import React from "react";
import { Card, Label } from "semantic-ui-react";
import axios from "axios";

const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

class FeedItem extends React.Component {
  constructor(props) {
    super(props);

    let type = "text";
    let lazy = false;

    if (this.props.content.startsWith("https://")) {
      type = "https";
      lazy = true;
    } else if (this.props.content.startsWith("ipfs://")) {
      type = "ipfs";
      lazy = true;
    }

    this.state = {
      text: true,
      lazy,
      type,
      lazyText: "loading...",
      iconColor: "grey",
    };
  }

  async componentDidMount() {
    if (this.state.lazy) {
      switch (this.state.type) {
        default:
        case "https":
          let httpResponse = await axios.get(this.props.content);
          let httpContentType = httpResponse.headers["content-type"];
          if (httpContentType.search("text/plain") >= 0) {
            this.setState({
              lazyText: httpResponse.data,
              iconColor: "red",
            });
          }
          break;
        case "ipfs":
          let ipfsResponse = await axios.get(
            `${IPFS_GATEWAY}${this.props.content.replace("ipfs://", "")}`
          );
          let ipfsContentType = ipfsResponse.headers["content-type"];
          if (ipfsContentType.search("text/plain") >= 0) {
            this.setState({
              lazyText: ipfsResponse.data,
              iconColor: "teal",
            });
          }
          break;
      }
    }
  }

  render() {
    return (
      <Card
        fluid
        raised
        style={{
          background: this.props.theme === "dark" ? "black" : "white",
        }}
      >
        <Card.Content>
          <Card.Description
            content={this.state.lazy ? this.state.lazyText : this.props.content}
            style={{ color: this.props.theme === "dark" ? "white" : "black" }}
          />
        </Card.Content>
        <Card.Content
          extra
          style={{ color: this.props.theme === "dark" ? "white" : "black" }}
        >
          {this.state.lazy && (
            <Label
              attached="top right"
              color={this.state.iconColor}
              size="tiny"
            >
              {this.state.type}{" "}
            </Label>
          )}
          {this.props.date}
        </Card.Content>
      </Card>
    );
  }
}

export default FeedItem;
