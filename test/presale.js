
import ether from './helpers/ether'
import {advanceBlock} from './helpers/advanceToBlock'
import {increaseTimeTo, duration} from './helpers/increaseTime'
import latestTime from './helpers/latestTime'
import EVMThrow from './helpers/EVMThrow'

const BigNumber = web3.BigNumber

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()


const PreSale = artifacts.require('PreSale')

contract('PreSale', function(wallets) {

  const owner = wallets[0]

  const notOwner = wallets[1]

  const newOwner = wallets[2]

  const wallet = wallets[3]

  const newWallet = wallets[4]
 
  const investor1 = wallets[5]

  const investor2 = wallets[6]

  const investor3 = wallets[7]

  const investor4 = wallets[8]

  const period = new BigNumber(60)

  const min = new BigNumber(1000000000000000000)

  const start = new BigNumber(1613205200)

  const hardcap = new BigNumber(9000000000000000000)

  const newMin = new BigNumber(1000000000000000000)

  const newPeriod = new BigNumber(70)

  const newStart = new BigNumber(1614505200)

  const newHardcap = new BigNumber(10000000000000000000)


  before(async function() {
   //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
   await advanceBlock()
  })


  beforeEach(async function () {
    this.presale = await PreSale.new()
  })	 

  describe('invest tests', function () {

    const startDate = new BigNumber(Math.floor(Date.now()/1000) - 10*24*60*60)

    const investor1Value1 = ether(11)

    const investor1Value2 = ether(12)

    const investor2Value1 = ether(13)

    it('should invest balances', async function () {
      await this.presale.setMin(min, {from: owner})
      await this.presale.setHardcap(hardcap, {from: owner})
      await this.presale.setStart(startDate, {from: owner})
      await this.presale.setPeriod(1000, {from: owner})

      await this.presale.send(investor1Value1, {from: investor2}).should.be.fulfilled
      await this.presale.send(investor1Value2, {from: investor1}).should.be.fulfilled
      await this.presale.send(investor2Value1, {from: investor2}).should.be.fulfilled
      investor1Value1.add(investor1Value2).should.be.bignumber.equal(await this.presale.balanceOf(investor1))
      investor2Value1.should.be.bignumber.equal(await this.presale.balanceOf(investor2))
    })

  })


  describe('owner tests', function () {

    it('should be owner', async function () {
      owner.should.equal(await this.presale.owner())
    })	 

    it('should reject transfer ownership if not owner', async function () {
      await this.presale.transferOwnership(newOwner, {from: notOwner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('should reject setMin if not owner', async function () {
      await this.presale.setMin(min, {from: notOwner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('should reject setWallet if not owner', async function () {
      await this.presale.setWallet(wallet, {from: notOwner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('should reject setHardcap if not owner', async function () {
      await this.presale.setHardcap(hardcap, {from: notOwner}).should.be.rejectedWith(EVMThrow)
    })	 
    
    it('should reject setStart if not owner', async function () {
      await this.presale.setStart(start, {from: notOwner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('should reject setPeriod if not owner', async function () {
      await this.presale.setPeriod(period, {from: notOwner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('should changed min if owner', async function () {
      await this.presale.setMin(min, {from: owner})
      min.should.be.bignumber.equal(await this.presale.min())
    })	 

    it('should changed wallet if owner', async function () {
      await this.presale.setWallet(wallet, {from: owner})
      wallet.should.equal(await this.presale.wallet())
    })	 

    it('should changed hardcap if owner', async function () {
      await this.presale.setHardcap(hardcap, {from: owner})
      hardcap.should.be.bignumber.equal(await this.presale.hardcap())
    })	 
    
    it('should changed start if owner', async function () {
      await this.presale.setStart(start, {from: owner})
      start.should.be.bignumber.equal(await this.presale.start())
    })	 

    it('should changed period if owner', async function () {
      await this.presale.setPeriod(period, {from: owner})
      period.should.be.bignumber.equal(await this.presale.period())
    })	 

    it('owner should changed if owner', async function () {
      await this.presale.transferOwnership(newOwner, {from: owner})
      newOwner.should.equal(await this.presale.owner())
    })

    it('should reject setMin if old owner', async function () {
      await this.presale.transferOwnership(newOwner, {from: owner})
      await this.presale.setMin(min, {from: owner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('should reject setWallet if old owner', async function () {
      await this.presale.transferOwnership(newOwner, {from: owner})
      await this.presale.setWallet(newOwner, {from: owner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('should reject transfer ownership if old owner', async function () {
      await this.presale.transferOwnership(newOwner, {from: owner})
      await this.presale.transferOwnership(newOwner, {from: owner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('should reject setHardcap if old owner', async function () {
      await this.presale.transferOwnership(newOwner, {from: owner})
      await this.presale.setHardcap(hardcap, {from: owner}).should.be.rejectedWith(EVMThrow)
    })	 
    
    it('should reject setStart if old owner', async function () {
      await this.presale.transferOwnership(newOwner, {from: owner})
      await this.presale.setStart(start, {from: owner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('should reject setPeriod if old owner', async function () {
      await this.presale.transferOwnership(newOwner, {from: owner})
      await this.presale.setPeriod(period, {from: owner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('should changed min if new owner', async function () {
      await this.presale.transferOwnership(newOwner, {from: owner})
      await this.presale.setMin(newMin, {from: newOwner})
      newMin.should.be.bignumber.equal(await this.presale.min())
    })	 

    it('should changed wallet if new owner', async function () {
      await this.presale.transferOwnership(newOwner, {from: owner})
      await this.presale.setWallet(newWallet, {from: newOwner})
      newWallet.should.equal(await this.presale.wallet())
    })	 

    it('should changed hardcap if new owner', async function () {
      await this.presale.transferOwnership(newOwner, {from: owner})
      await this.presale.setHardcap(newHardcap, {from: newOwner})
      newHardcap.should.be.bignumber.equal(await this.presale.hardcap())
    })	 
    
    it('should changed start if new owner', async function () {
      await this.presale.transferOwnership(newOwner, {from: owner})
      await this.presale.setStart(newStart, {from: newOwner})
      newStart.should.be.bignumber.equal(await this.presale.start())
    })	 

    it('should changed period if new owner', async function () {
      await this.presale.transferOwnership(newOwner, {from: owner})
      await this.presale.setPeriod(newPeriod, {from: newOwner})
      newPeriod.should.be.bignumber.equal(await this.presale.period())
    })	 

    it('owner should changed if new owner', async function () {
      await this.presale.transferOwnership(newOwner, {from: owner})
      await this.presale.transferOwnership(owner, {from: newOwner})
      owner.should.equal(await this.presale.owner())
    })

  })


  describe('time tests', function () {

    const startDate = new BigNumber(Math.floor(Date.now()/1000) - 10*24*60*60);

    it('should not invest before start date', async function () {
      await this.presale.setMin(min, {from: owner})
      await this.presale.setHardcap(hardcap, {from: owner})
      await this.presale.setStart(startDate, {from: owner})
      await this.presale.setPeriod(period, {from: owner})
      await this.presale.send(11, {from: investor1}).should.be.rejectedWith(EVMThrow)
    })

    it('should not invest after start date', async function () {
      await this.presale.setMin(min, {from: owner})
      await this.presale.setHardcap(hardcap, {from: owner})
      await this.presale.setStart(startDate, {from: owner})
      await this.presale.setPeriod(period, {from: owner})
      await increaseTimeTo(startDate.add(period*24*60*60 + 10*24*60*60))
      await this.presale.send(11, {from: investor1}).should.be.rejectedWith(EVMThrow)
    })

  })



 
})

