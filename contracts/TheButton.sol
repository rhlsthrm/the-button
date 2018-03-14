pragma solidity ^0.4.0;

/// @title Simulate /r/thebutton
contract TheButton {
    event ButtonPressed(address presser, uint block);
    event TreasureCollected(address claimer, uint256 amountClaimedWei);

    uint8 constant REQUIRED_NUM_BLOCKS_WITHOUT_PRESS = 3;

    uint256 public buttonPressFeeWei;

    address public lastPresser;
    uint public lastBlockWithPress;

    /// @notice Constructor
    /// @param _buttonPressFeeWei Sets fee to press the button
    function TheButton(uint256 _buttonPressFeeWei) public {
        require(_buttonPressFeeWei > 0);
        buttonPressFeeWei = _buttonPressFeeWei;
    }

    /// @notice Press button, requires fee to match the initialized fee
    function pressButton() public payable {
        require(msg.value == buttonPressFeeWei);
        lastPresser = msg.sender;
        lastBlockWithPress = block.number;
        ButtonPressed(msg.sender, block.number);
    }

    /// @notice Claims the treasure only if you are the last presser and
    /// REQUIRED_NUM_BLOCKS_WITHOUT_PRESS have passed without a press
    function claimTreasure() public {
        require(msg.sender == lastPresser);
        require(block.number > (lastBlockWithPress + REQUIRED_NUM_BLOCKS_WITHOUT_PRESS));
        TreasureCollected(msg.sender, this.balance);
        msg.sender.transfer(this.balance);
    }
}