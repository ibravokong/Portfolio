function palindrome(str) {
  let regFilter = /[^a-z\d]/g;
  let filteredStr = str.toLowerCase()
                       .replace(regFilter, "");

  for(let i = 0; i < Math.floor(filteredStr.length/2); ++i)
  {
    if(filteredStr[i] != filteredStr[filteredStr.length-1-i])
    {
      return false;
    }
  }
  return true;
}