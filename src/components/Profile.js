import React from "react";
import { Card, Container, Divider, Header } from "semantic-ui-react";
import axios from "axios";
import FeedItem from "./FeedItem";
import { hexToString } from "../lib/HexStringUtil";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    let feed = localStorage.getItem("feed");
    if (feed) {
      feed = JSON.parse(feed);
    } else {
      feed = [];
    }

    this.state = {
      feed,
    };
  }

  async loadData(id) {
    if (!id) return;

    let network = window.ethereum.networkVersion;
    let host;

    switch (network) {
      // Polygon Mumbai Testnet
      case "80001":
        host = "https://api-testnet.polygonscan.com";
        break;

      // Polygon Mainnet
      case "137":
        host = "https://api.polygonscan.com";
        break;

      default:
        return;
    }

    let response = await axios.get(
      `${host}/api?module=account&action=txlist&address=${id}&startblock=1&endblock=99999999&sort=asc`
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
        date: new Date(parseInt(timeStamp) * 1000).toString().substring(0, 24),
      }))
      .reverse();

    this.setState({ feed });
    localStorage.setItem("feed", JSON.stringify(feed));
  }

  render() {
    return (
      <Container style={{ marginTop: "2.5em" }}>
        <Divider hidden />
        {this.props.id && (
          <Header
            style={{ color: this.props.theme === "dark" ? "white" : "black" }}
            content={`Address ${this.props.id.substring(
              0,
              6
            )}...${this.props.id.slice(-4)} Chain ${
              window.ethereum.networkVersion
            }`}
          />
        )}
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
