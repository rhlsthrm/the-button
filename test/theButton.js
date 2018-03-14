/* global artifacts, contract, it, web3, assert */

const TheButton = artifacts.require('./TheButton.sol')
const BLOCK_TIME = 1000
// NOTE: this test will only work if it's run on a blockchain with block time = BLOCK_TIME
contract('TheButton', async accounts => {
  it('should simulate button press', async () => {
    const theButton = await TheButton.deployed()
    let presser = accounts[1]
    await theButton.pressButton({
      from: presser,
      value: web3.toWei(1, 'ether')
    })
    let lastPresser = await theButton.lastPresser.call()
    assert.equal(lastPresser, presser)
    let lastBlockWithPress = await theButton.lastBlockWithPress.call()

    presser = accounts[2]
    await theButton.pressButton({
      from: presser,
      value: web3.toWei(1, 'ether')
    })
    lastPresser = await theButton.lastPresser.call()
    assert.equal(lastPresser, presser)
    lastBlockWithPress = await theButton.lastBlockWithPress.call()

    presser = accounts[3]
    await theButton.pressButton({
      from: presser,
      value: web3.toWei(1, 'ether')
    })
    lastPresser = await theButton.lastPresser.call()
    assert.equal(lastPresser, presser)
    lastBlockWithPress = await theButton.lastBlockWithPress.call()

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, BLOCK_TIME * 4)
    })
    lastBlockWithPress = await theButton.lastBlockWithPress.call()
    assert.isAbove(web3.eth.blockNumber, lastBlockWithPress.toNumber() + 3)

    let buttonContractBalance = web3.eth.getBalance(theButton.address)

    const startingBalance = web3.eth.getBalance(presser)
    await theButton.claimTreasure({ from: presser })
    const endingBalance = web3.eth.getBalance(presser)
    assert.isAbove(endingBalance.toNumber() - startingBalance.toNumber(), 0)

    buttonContractBalance = web3.eth.getBalance(theButton.address)
    assert.equal(buttonContractBalance.toNumber(), 0)
  })
})
