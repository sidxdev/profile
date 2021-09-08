import React from "react";
import {
  Button,
  Card,
  Container,
  Divider,
  Input,
  Label,
} from "semantic-ui-react";
import axios from "axios";
import FeedItem from "./FeedItem";

function hexToUtf8(hex) {
  return decodeURIComponent(
    hex
      .replace(/\s+/g, "")
      .replace(/[0-9a-f]{2}/g, "%$&")
      .substring(2)
  );
}

class Profile extends React.Component {
  constructor() {
    super();

    const id = localStorage.getItem("ID");

    this.state = {
      id,
      profileButtonDisable: true,
      feed: [],
    };
  }

  componentDidMount() {
    this.loadData(this.state.id);
  }

  onChangeProfile(event) {
    this.setState({ profileButtonDisable: false, id: event.target.value });
  }

  onClickProfileSave() {
    localStorage.setItem("ID", this.state.id);
    this.setState({ profileButtonDisable: true });
    this.loadData(this.state.id);
  }

  async loadData(id) {
    if (!id) return;

    let response = await axios.get(
      `https://api.polygonscan.com/api?module=account&action=txlist&address=${id}&startblock=1&endblock=99999999&sort=asc`
    );

    let data = response.data;

    if (data.status !== "1" || !Array.isArray(data.result)) return;

    let feed = data.result
      .filter((e) => e.to.toLowerCase() === this.state.id.toLowerCase())
      .filter((e) => e.input !== "0x")
      .filter((v, i, a) => a.findIndex((t) => t.hash === v.hash) === i)
      .map(({ hash, input, timeStamp }) => ({
        hash,
        content: hexToUtf8(input),
        date: new Date(parseInt(timeStamp) * 1000).toLocaleString(),
      }));

    this.setState({ feed });
  }

  render() {
    return (
      <Container>
        <Divider hidden />
        <Input
          value={this.state.id}
          onChange={this.onChangeProfile.bind(this)}
          fluid
          label={<Label content="Profile" />}
          action={
            <Button
              primary
              disabled={this.state.profileButtonDisable}
              icon="save"
              onClick={this.onClickProfileSave.bind(this)}
            />
          }
          placeholder="0x... address"
        />
        <Divider hidden />
        <Card.Group>
          {this.state.feed.map((item) => (
            <FeedItem key={item.hash} {...item} />
          ))}
        </Card.Group>
      </Container>
    );
  }
}

export default Profile;
