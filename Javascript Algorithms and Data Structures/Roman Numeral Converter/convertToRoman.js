function convertToRoman(num) {
  if(num <= 0 || num >= 4000)
  {
    return "";
  }
  let RomanSymbols = {
    "0": ["I", "V", "X"],
    "1": ["X", "L", "C"],
    "2": ["C", "D", "M"],
    "3": ["M", "", ""]
  }
  let romanStr = "";
  let numStr = "" + num;
  for(let i = numStr.length-1; i >= 0; --i)
  {
    let auxStr = "";
    let symbols = RomanSymbols[numStr.length-1-i];
    switch(numStr[i])
    {
      case "0":
      case "1":
      case "2":
      case "3":
        auxStr = symbols[0].repeat(Number(numStr[i]));
        break;
      case "4":
        auxStr = symbols[0] + symbols[1];
        break;
      case "5":
      case "6":
      case "7":
      case "8":
        auxStr = symbols[1] + symbols[0].repeat(Number(numStr[i])-5);
        break;
      case "9":
        auxStr = symbols[0] + symbols[2];
        break;
    }
    romanStr = auxStr + romanStr;
  }
 return romanStr;
}