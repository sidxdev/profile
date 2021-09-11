import React from "react";
import { Card, Container, Divider } from "semantic-ui-react";
import axios from "axios";
import FeedItem from "./FeedItem";
import { hexToString } from "../lib/HexStringUtil";


class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profileButtonDisable: true,
      feed: [],
    };
  }

  async loadData(id) {
    if (!id) return;

    let response = await axios.get(
      `https://api-testnet.polygonscan.com/api?module=account&action=txlist&address=${id}&startblock=1&endblock=99999999&sort=asc`
    );

    let data = response.data;

    if (data.status !== "1" || !Array.isArray(data.result)) return;

    let feed = data.result
      .filter((e) => e.to.toLowerCase() === this.props.id.toLowerCase())
      .filter((e) => e.input !== "0x")
      .filter((v, i, a) => a.findIndex((t) => t.hash === v.hash) === i)
      .map(({ hash, input, timeStamp }) => ({
        hash,
        content: hexToString(input),
        date: new Date(parseInt(timeStamp) * 1000).toString().substring(0,24),
      }))
      .reverse();

    this.setState({ feed });
  }

  render() {
    return (
      <Container style={{ marginTop: "2.5em" }}>
        <Divider hidden />
        <Card.Group>
          {this.props.id &&
            this.state.feed.map((item) => (
              <FeedItem key={item.hash} {...item} theme={this.props.theme} />
            ))}
        </Card.Group>
      </Container>
    );
  }
}

export default Profile;
