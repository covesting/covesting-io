pragma solidity ^0.4.13;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';

import 'zeppelin-solidity/contracts/lifecycle/Pausable.sol';

/**
 * @title PreSale
 * @dev The PreSale contract stores balances investors of pre sale stage.
 */
contract PreSale is Pausable {
    
  event Invest(address, uint);

  using SafeMath for uint;
    
  address public wallet;

  uint public start;

  uint public min;

  uint public hardcap;
  
  uint public invested;
  
  uint public period;

  mapping (address => uint) public balances;

  address[] public investors;

  modifier saleIsOn() {
    require(now > start && now < start + period * 1 days);
    _;
  }

  modifier isUnderHardcap() {
    require(invested < hardcap);
    _;
  }

  function setMin(uint newMin) onlyOwner {
    min = newMin;
  }

  function setHardcap(uint newHardcap) onlyOwner {
    hardcap = newHardcap;
  }
  
  function totalInvestors() constant returns (uint) {
    return investors.length;
  }
  
  function balanceOf(address investor) constant returns (uint) {
    return balances[investor];
  }
  
  function setStart(uint newStart) onlyOwner {
    start = newStart;
  }
  
  function setPeriod(uint16 newPeriod) onlyOwner {
    period = newPeriod;
  }
  
  function setWallet(address newWallet) onlyOwner {
    require(newWallet != address(0));
    wallet = newWallet;
  }

  function invest() saleIsOn isUnderHardcap whenNotPaused payable {
    require(msg.value >= min);
    wallet.transfer(msg.value);
    if(balances[msg.sender] == 0) {
      investors.push(msg.sender);    
    }
    balances[msg.sender] = balances[msg.sender].add(msg.value);
    invested = invested.add(msg.value);
    Invest(msg.sender, msg.value);
  }

  function() external payable {
    invest();
  }

}
