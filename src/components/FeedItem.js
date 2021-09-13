import React from "react";
import { Card, Image, Label } from "semantic-ui-react";
import axios from "axios";
import HTMLReactParser from "html-react-parser";

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

  formatHTMLText(content) {
    // enable links
    const linksRegex = /(https?:\/\/[^\s]+)/gm;
    content = content.replace(
      linksRegex,
      `<a href="$1" target="_blank">$1</a>`
    );

    return <div>{HTMLReactParser(content)}</div>;
  }

  async loadAndSetFromURL(url, color) {
    let response = await axios.get(url);
    let contentType = response.headers["content-type"];
    if (contentType.search("text/plain") >= 0) {
      this.setState({
        lazyText: response.data,
        iconColor: color,
      });
    } else if (contentType.search("image") >= 0) {
      this.setState({
        lazyText: "",
        lazyImage: url,
        iconColor: color,
      });
    } else if (contentType.search("application/json") >= 0) {
      let json = response.data;

      this.setState({
        lazyText: json.text,
        lazyImage: json.image ? `${IPFS_GATEWAY}${json.image}` : null,
        iconColor: color,
      });
    } else {
      this.setState({
        lazyText: "Content not supported.",
        iconColor: color,
      });
    }
  }

  async componentDidMount() {
    if (this.state.lazy) {
      switch (this.state.type) {
        default:
        case "https":
          await this.loadAndSetFromURL(this.props.content, "red");
          break;
        case "ipfs":
          let url = `${IPFS_GATEWAY}${this.props.content.replace(
            "ipfs://",
            ""
          )}`;
          await this.loadAndSetFromURL(url, "teal");
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
        {this.state.lazyImage && (
          <Image fluid wrapped src={this.state.lazyImage} />
        )}
        <Card.Content>
          <Card.Description
            style={{ color: this.props.theme === "dark" ? "white" : "black" }}
          >
            {this.formatHTMLText(
              this.state.lazy ? this.state.lazyText : this.props.content
            )}
          </Card.Description>
        </Card.Content>
        <Card.Content
          extra
          style={{ color: this.props.theme === "dark" ? "white" : "black" }}
        >
          {this.state.lazy && (
            <Label
              attached="bottom right"
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
