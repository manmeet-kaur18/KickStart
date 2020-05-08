import React, { Component } from "react";
import FactoryContract from "./contracts/Campaignfactory.json";
import getWeb3 from "./getWeb3";
import {Button,Form,Input,Container,Message} from 'semantic-ui-react';
import Header from './header';
class CreateContracts extends Component {
  state = { web3: null, accounts: null, contract: null ,minimumContribution:0,errorMessage:''};
  componentDidMount = async () => {
    try {
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = FactoryContract.networks[networkId];
        const instance = new web3.eth.Contract(
          FactoryContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
      this.setState({ web3:web3, accounts:accounts, contract: instance });
    } catch (error) {
      
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

      onSubmit = async (event)=>{
        event.preventDefault();
        try{
            const contract = this.state.contract;
            await contract.methods.createcampaign(this.state.minimumContribution).send({
               from:this.state.accounts[0] 
            });
            window.location.href="/";
        }catch(err){
            this.setState({
                errorMessage:err.message,
            })
        }
       
    };
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
          <Container>
               <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
               <Header/>
        <h3>Create a New Campaign</h3>
                 <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                     <Form.Field>
                         <label>Minimum Contribution</label>
                         <Input
                            label="wei"
                            labelPosition='right'
                            placeholder='contribution'
                            value={this.state.minimumContribution}
                            onChange={event=>this.setState({minimumContribution:event.target.value})}
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage}/>
                    <Button primary type="submit">Submit</Button>
                </Form>
                </Container>
      </div>
    );
  }
}

export default CreateContracts;
