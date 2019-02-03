//import 'babel-polyfill';
const StarNotary = artifacts.require('./starNotary.sol')

let instance;
let accounts;

contract('StarNotary', async (accs) => {
    accounts = accs;
    instance = await StarNotary.deployed();
  });

  it('can Create a Star', async() => {
    let tokenId = 1;
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
  });

  it('lets user1 put up their star for sale', async() => {
    let user1 = accounts[1]
    let starId = 2;
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    assert.equal(await instance.starsForSale.call(starId), starPrice)
  });

  it('lets user1 get the funds after the sale', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 3
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1)
    await instance.buyStar(starId, {from: user2, value: starPrice})
    let balanceOfUser1AfterTransaction = web3.eth.getBalance(user1)
    assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), balanceOfUser1AfterTransaction.toNumber());
  });

  it('lets user2 buy a star, if it is put up for sale', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 4
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user2)
    await instance.buyStar(starId, {from: user2, value: starPrice});
    assert.equal(await instance.ownerOf.call(starId), user2);
  });

  it('lets user2 buy a star and decreases its balance in ether', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 5
    let starPrice = web3.toWei(.01, "ether")
    await instance.createStar('awesome star', starId, {from: user1})
    await instance.putStarUpForSale(starId, starPrice, {from: user1})
    let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user2)
    const balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2)
    await instance.buyStar(starId, {from: user2, value: starPrice, gasPrice:0})
    const balanceAfterUser2BuysStar = web3.eth.getBalance(user2)
    assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice);
  });

  // Write Tests for:

  // 1) The token name and token symbol are added properly.
  it('can add the star name and star symbol properly', async() => {
    assert.equal(await instance.name.call(), "Nut Token");
    assert.equal(await instance.symbol.call(), "NUT");
  });

  // 2) 2 users can exchange their stars.
  it('lets 2 users exchange stars', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]

    let starIdA = 6
    let starAPrice = web3.toWei(.01, "ether")
    await instance.createStar('star A', starIdA, {from: user1})

    let starIdB = 7
    let starBPrice = web3.toWei(.01, "ether")
    await instance.createStar('star B', starIdB, {from: user2})

    await instance.exchangeStars(starIdA, starIdB)
    assert.equal(await instance.ownerOf.call(starIdA), user2)
    assert.equal(await instance.ownerOf.call(starIdB), user1)
  });

  // 3) Stars Tokens can be transferred from one address to another.
  it('lets a user transfer a star', async() => {
    let user1 = accounts[1]
    let user2 = accounts[2]
    let starId = 8
    await instance.createStar('star C', starId, {from: user1})
    assert.equal(await instance.ownerOf.call(starId), user1)
    await instance.transferStar(user2, starId, {from: user1})
    assert.equal(await instance.ownerOf.call(starId), user2)
  });