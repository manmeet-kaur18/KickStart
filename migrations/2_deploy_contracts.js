var Campaignfactory = artifacts.require("./CampaignFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(Campaignfactory);
};
