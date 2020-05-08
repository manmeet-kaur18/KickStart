const factoryStorage = artifacts.require("./CampaignFactory.sol");
const campaignStorage = artifacts.require("./Campaigninterface.sol");

contract("Factory", async (accounts) => {
  let factory;
  let campaignaddress;
  let campaign;
  beforeEach(async () => {
    factory = await factoryStorage.new();
    await factory.createcampaign("100", { from: accounts[0], gas: "1000000" });
    [campaignaddress] = await factory.getdeployedcontracts.call();
    // console.log(campaignaddress);
    campaign = await campaignStorage.at(campaignaddress);
    // console.log(campaign.address);
  });

  it("deploys a factory and campaign", () => {
    assert.ok(factory.address);
    assert.ok(campaign.address);
  });

  it(" marks caller as campaign manager", async () => {
    const manager = await campaign.manager.call();
    assert.equal(accounts[0], manager);
  });
  it("allows people to contribute and make money and marks them as approvers", async () => {
    await campaign.contribute({
      value: "200",
      from: accounts[1],
    });
    const isContributer = await campaign.approvers.call(accounts[1]);

    assert(isContributer);
  });
  it("requires a minimum contribution", async () => {
    try {
      await campaign.contribute({ value: 5, from: accounts[1] });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it("allows a manager to make a payment request", async () => {
    await campaign.createrequest("Buy batteries", "100", accounts[1], {
      from: accounts[0],
      gas: "1000000",
    });
    const request = await campaign.requests.call(0);
    assert.equal("Buy batteries", request.description);
  });
  it("processes requests", async () => {
    await campaign.contribute({from:accounts[0],value:web3.utils.toWei('10','ether')});
    await campaign.createrequest("Buy batteries", web3.utils.toWei('5','ether'), accounts[1], {
      from: accounts[0],
      gas: "1000000",
    });
    await campaign.approveRequests(0,{from:accounts[0],gas:'1000000'});
    await campaign.finalizeRequest(0,{from:accounts[0],gas:'1000000'});
   
    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance,'ether');
    balance = parseFloat(balance);
    console.log(balance);
    assert(balance>113);
  });
});
