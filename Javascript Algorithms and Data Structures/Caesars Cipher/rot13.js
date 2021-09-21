function rot13(str) {
  let letterRegex = /[A-Z]/;
  let shift = 13;
  let decodedStr = str.split("")
                      .map(letter => {
                        if(letterRegex.test(letter))
                        {
                          let letterCode = letter.charCodeAt() - shift;
                          if(letterCode < 65)
                          {
                            letterCode += 26;
                          }
                          return String.fromCharCode(letterCode);
                        }
                        return letter;
                      })
                      .join("");
  return decodedStr;
}