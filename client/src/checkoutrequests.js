import React, { Component } from "react";
import Header from "./header";
import { Container, Table } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import CampiagnContract from "./contracts/Campaign.json";
import getWeb3 from "./getWeb3";

class Checkoutrequests extends Component {
  state = {
    web3: null,
    contract: null,
    accounts: null,
    requests: null,
    requestscount: null,
    appoverscount:0
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
    const requestcount = await contract.methods.getRequestsCount().call();
    const approversCount = await contract.methods.approverscount().call();
    const requests = await Promise.all(
      Array(parseInt(requestcount))
        .fill()
        .map((element, index) => {
          return contract.methods.requests(index).call();
        })
    );
    this.setState({ requests: requests, requestscount: requestcount,approverscount:approversCount });
    console.log(this.state.requests);
  };

//   renderRowrequests(){
//       const {web3,requests}=this.state;
//       return requests.map((request,index)=>{
//           return (
//               <Table.Row>
//                   <Table.Cell>
//                   {index}
//                   </Table.Cell>
//                     <Table.Cell>
//                     {request.description}
//                     </Table.Cell>
//                     <Table.cell>
//                         {web3.utils.fromWei(request.value,'ether')}
//                     </Table.cell>
//                     <Table.cell>
//                         {request.recipient}
//                     </Table.cell>
//                     <Table.Cell>
//                         {request.approvalCount}/{this.state.appoverscount}
//                     </Table.Cell>
//                     <Table.Cell>
//                         <Button color="green" basic>
//                             Approve
//                         </Button>
//                     </Table.Cell>
//               </Table.Row>
//           );
//       });
//   }
  approveRequest= async(e)=>{
    const {contract,web3,accounts} = this.state;
    try{
        
    await contract.methods.approveRequests(e.target.id).send({
        from:accounts[0]
    });
    window.location.href=`/${this.props.match.params.address}/requests`;

    }catch(err){

    }

  }

  finalizeRequest= async(e)=>{
    const {contract,web3,accounts} = this.state;
    try{
        
    await contract.methods.finalizeRequest(e.target.id).send({
        from:accounts[0]
    });
    window.location.href=`/${this.props.match.params.address}/requests`;

    }catch(err){

    }

  }

  render() {
      const {requests,web3}=this.state;
    if (!this.state.web3 || !this.state.requests) {
      return <h3>Waiting</h3>;
    }
    return (
      <div>
        <Container>
          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
          />
          <Header />

          <h3>Pending Requests</h3>
          <Button
            primary
            onClick={(event) =>
              (window.location.href = `/${this.props.match.params.address}/requests/new`)
            } floated="right" style={{marginBottom:10}}
          >
            Add Requests
          </Button>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
                <Table.HeaderCell>Recipient</Table.HeaderCell>
                <Table.HeaderCell>Approval Count</Table.HeaderCell>
                <Table.HeaderCell>Approve</Table.HeaderCell>
                <Table.HeaderCell>Finalize</Table.HeaderCell>
              </Table.Row>

            </Table.Header>
            <Table.Body>
            {requests.map((item, i) => {
                const readytoFinalize = item.approvalCount > this.state.appoverscount/2;
        return [
            <Table.Row key={i} disabled={item.complete} positive={readytoFinalize && !item.complete}>
                <Table.Cell>
                    {i}
                </Table.Cell>
                
                <Table.Cell>
                    {item.description}
                </Table.Cell>
                <Table.Cell>
                    {web3.utils.fromWei(item.value,'ether')}
                </Table.Cell>
                <Table.Cell>
                    {item.recipient}
                </Table.Cell>
                <Table.Cell>
                    {item.approvalCount}/{this.state.approverscount}
                </Table.Cell>
                <Table.Cell>
                    {
                        item.complete ?null:(
                       <Button id={i} color="green" basic onClick={this.approveRequest}>
                             Approve
                         </Button>)
                    }         
                </Table.Cell>
                <Table.Cell>
                    {requests.complete ? null:(
                       <Button id={i} color="teal" basic onClick={this.finalizeRequest}>
                             Finalize
                         </Button>
                    )}
                </Table.Cell>
            </Table.Row>
        ];
      })}
            </Table.Body>
          </Table>
            <div>Found {this.state.requestscount} Requests</div>
        </Container>
      </div>
    );
  }
}

export default Checkoutrequests;
