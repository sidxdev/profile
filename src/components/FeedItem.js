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
      iconColor: "",
    };
  }

  async componentDidMount() {
    if (this.state.lazy) {
      switch (this.state.type) {
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
      <Card fluid>
        {this.state.lazy ? (
          <Card.Content description={this.state.lazyText} />
        ) : (
          <Card.Content description={this.props.content} />
        )}
        <Card.Content extra>
          {this.state.lazy && <Label attached="top right" color={this.state.iconColor} size="tiny">{this.state.type} </Label>}
          {this.props.date}
        </Card.Content>
      </Card>
    );
  }
}

export default FeedItem;
