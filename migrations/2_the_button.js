/* global artifacts, web3 */

const TheButton = artifacts.require('./TheButton.sol')

module.exports = deployer => {
  deployer.deploy(TheButton, web3.toWei(1, 'ether'))
}
