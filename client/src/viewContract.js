import React, { Component } from "react";
import Header from "./header";
import {
  Container,
  Card,
  Form,
  Input,
  Button,
  Grid,
  Message,
} from "semantic-ui-react";
import CampiagnContract from "./contracts/Campaign.json";
import getWeb3 from "./getWeb3";

class ViewContract extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    minimumContribution: null,
    requests: null,
    approverscount: null,
    manager: null,
    balance: null,
    value: 0,
    errorMessage: "",
    loading: false,
  };
  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = CampiagnContract.networks[networkId];
      const instance = new web3.eth.Contract(
        CampiagnContract.abi,
        this.props.match.params.address
      );

      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { contract } = this.state;
    const summary = await contract.methods.getSummary().call();
    console.log(summary);
    this.setState({
      minimumContribution: summary[0],
      balance: summary[1],
      requests: summary[2],
      approverscount: summary[3],
      manager: summary[4],
    });
  };

  renderCards = () => {
    const {
      balance,
      manager,
      approverscount,
      requests,
      minimumContribution,
      web3,
    } = this.state;
    const items = [
      {
        header: manager,
        meta: "Address of Manger",
        description:
          " The manager created this camapign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description: "you must contribute this much wei to become an approver",
        style: { overflowWrap: "break-word" },
      },
      {
        header: requests,
        meta: "Number of Requests",
        description:
          " A request tries to withdraw money from the contract.Request must be approved by approvers",
        style: { overflowWrap: "break-word" },
      },
      {
        header: approverscount,
        meta: "Number Of Approvers",
        description:
          "It is the number of people who have donated to this campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description:
          "The balance is amount of money this campaign has left to spend",
        style: { overflowWrap: "break-word" },
      },
    ];
    return <Card.Group items={items} />;
  };

  onSubmit = async () => {
    // event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    const { contract, accounts, web3 } = this.state;
    try {
      await contract.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });
      window.location.href = `/${this.props.match.params.address}`;
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    if (
      !this.state.manager ||
      !this.state.requests ||
      !this.state.balance ||
      !this.state.approverscount
    ) {
      return (
        <div>
          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
          />
          <Container>
            <Header />
            Showing up contract details
            <br />
            {this.props.match.params.address}
          </Container>
        </div>
      );
    }
    return (
      <div>
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
        />
        <Container>
          <Header />
          <h3>Campaign Show</h3>
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
              <Grid.Column width={6}>
                <Form error={!!this.state.errorMessage}>
                  <Form.Field>
                    <label>Amount to contribute</label>
                    <Input
                      value={this.state.value}
                      onChange={(event) =>
                        this.setState({ value: event.target.value })
                      }
                      label="ether"
                      labelPosition="right"
                      placeholder="contribution"
                    />
                  </Form.Field>
                  <Message
                    error
                    header="Oops!"
                    content={this.state.errorMessage}
                  />
                  <Button
                    loading={this.state.loading}
                    primary
                    type="submit"
                    onClick={this.onSubmit}
                  >
                    Contribute !
                  </Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Button
                  onClick={(event) =>
                    (window.location.href = `/${this.props.match.params.address}/requests`)
                  }
                  primary>
                  View Requests
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default ViewContract;
