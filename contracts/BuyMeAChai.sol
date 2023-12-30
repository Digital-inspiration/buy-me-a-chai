// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BuyMeAChai {

     // Event to emit when a Memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List all memos received from friends
    Memo[] memos;

    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev buy a chai for the contract owner
     * @param _name name of the chai buyer
     * @param _message a nice message from the chai buyer 
     */
    function buyChai(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Can't buy a chai for free! Send some ETH");

        memos.push( Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // Emit event whwen a new memo is created
        emit NewMemo( 
            msg.sender, 
            block.timestamp, 
            _name, 
            _message 
            );
    }

    /**
     * @dev send the entire balance stored in the contract to the owner
     */
    function withdrawTips() public{
        require(owner.send(address(this).balance));
        
    }
    
    /**
     * @dev retrieve all the memos received and stored in the blockchain
     */
    function getMemos() public view returns(Memo[] memory){
        return memos;
    }
}
