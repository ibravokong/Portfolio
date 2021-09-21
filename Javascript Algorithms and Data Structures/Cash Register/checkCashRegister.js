function checkCashRegister(price, cash, cid) {
  let obj = {
    status: "",
    change: []
  };

  let currency = [10000, 2000, 1000, 500, 100, 25, 10, 5, 1];
  let totalChange = cash*100 - price*100;
  let closed = true;

  for(let i = 0; i < cid.length; ++i)
  {
    if(totalChange >= currency[i])
    {
      let actualCurrency = cid[cid.length-1-i].slice();
      actualCurrency[1] = Math.min(Math.floor(totalChange/currency[i])*currency[i], actualCurrency[1]*100);
      totalChange -= actualCurrency[1];

      if(closed && (cid[cid.length-1-i][1]*100 != actualCurrency[1]))
      {
        closed = false;
      }

      actualCurrency[1] /= 100;
      obj.change.push(actualCurrency);
    }
    else if(cid[cid.length-1-i][1] != 0)
    {
      closed = false;
    }
  }

  if(totalChange == 0)
  {
    if(closed)
    {
      obj.status = "CLOSED";
      obj.change = cid;
    }
    else
    {
      obj.status = "OPEN";
    }
  }
  else
  {
    obj.status = "INSUFFICIENT_FUNDS";
    obj.change = [];
  }
  
  return obj;
}

//checkCashRegister(14, 20, [["PENNY", 0], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 2], ["FIVE", 5], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]);