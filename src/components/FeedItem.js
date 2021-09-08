import React from "react";
import { Card, Icon } from "semantic-ui-react";
import axios from "axios";

class FeedItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: true,
      lazy: this.props.content.startsWith("https://"),
      lazyText: "loading...",
      type: "",
    };
  }

  async componentDidMount() {
    if (this.state.lazy) {
      let response = await axios.get(this.props.content);
      let contentType = response.headers["content-type"];
      if (contentType.search("text/plain") >= 0) {
        this.setState({ lazyText: response.data, type: "download" });
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
          {this.state.lazy && <Icon name={this.state.type} />}
          {this.props.date}
        </Card.Content>
      </Card>
    );
  }
}

export default FeedItem;
