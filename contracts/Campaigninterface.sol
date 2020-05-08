pragma solidity >=0.4.21 <0.7.0;

contract Campaigninterface{
    struct Request{
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address=>bool) approvals;
    }
    Request[] public requests;
    address public manager;
    uint public mincontribution;
    mapping(address=>bool) public approvers;
    uint public approverscount;
    
    modifier restricted(){
        require(msg.sender==manager);
        _;
    }
    
    constructor(uint minimum,address creater) public{
        manager = creater;
        mincontribution=minimum;        
    }
    function contribute() public payable{
        require(msg.value>mincontribution);
        approvers[msg.sender]=true;
        approverscount++;
    }
    
    function createrequest(string memory description,uint value,address payable recipient) public restricted{
         Request memory newRequest=Request({
             description:description,
             value:value,
             recipient:recipient,
             complete:false,
             approvalCount:0
         });
         requests.push(newRequest);
    }
    
    function approveRequests(uint index) public{
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        require(request.approvalCount>(approverscount/2));
        require(!request.complete);
        request.recipient.transfer(request.value);
        request.complete=true;
        
    }
    function getSummary() public view returns (uint,uint,uint,uint,address){
        return(
            mincontribution,
            address(this).balance,
            requests.length,
            approverscount,
            manager
        );
    } 
    function getRequestsCount() public view returns (uint){
        return requests.length;
    }

}
