import React, { Component } from "react";
import Header from "./header";
import { Message,Container,Form,Input,Button} from "semantic-ui-react";
import CampiagnContract from "./contracts/Campaign.json";
import getWeb3 from "./getWeb3";


class AddRequestsCampaign extends Component {
    state={
        web3:null,
        contract:null,
        accounts:null,
        description:'',
        value:0,
        recipient:'',
        loading:false,
        errorMessage:''
    }
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

      onSubmit= async(event)=>{
          this.setState({loading:true,errorMessage:''});
        const {contract,web3,accounts,description,value,recipient}=this.state;
        try{
            await contract.methods.createrequest(description,web3.utils.toWei(value,'ether'),recipient).send({
                from:accounts[0]
            });
            window.location.href = `/${this.props.match.params.address}/requests`;
        }catch(err){
            this.setState({errorMessage:err.message});

        }
        this.setState({loading:false});
      }
  render() {
    return (
      <div>
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
        />
        <Container>
          <Header />
          <a href={`/${this.props.match.params.address}/requests`}>Back</a>
          <h3>Create a Request</h3>
          <Form error={!!this.state.errorMessage}>
            <Form.Field>
                <label>Description</label>
                <Input value={this.state.description} onChange={event=>this.setState({description:event.target.value})}/>
            </Form.Field>
            <Form.Field>
                <label>Value in ether</label>
                <Input value={this.state.value} onChange={event=>this.setState({value:event.target.value})}/>
            </Form.Field>
            <Form.Field>
                <label>Recipient</label>
                <Input value={this.state.recipient} onChange={event=>this.setState({recipient:event.target.value})}/>
            </Form.Field>
            <Message
                    error
                    header="Oops!"
                    content={this.state.errorMessage}
                  />
            <Button loading={this.state.loading} primary onClick={this.onSubmit}>Create!</Button>
          </Form>
        </Container>
      </div>
    );
  }
}

export default AddRequestsCampaign;
