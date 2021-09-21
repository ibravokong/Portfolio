function telephoneCheck(str) {
  let regexArr = [/^\d{3}[-\s]{0,1}\d{3}[-\s]{0,1}\d{4}$/,
                  /^\(\d{3}\)[-\s]{0,1}\d{3}[-\s]{0,1}\d{4}$/,
                  /^(1\s{0,1}){0,1}\d{3}[-\s]{0,1}\d{3}[-\s]{0,1}\d{4}$/,
                  /^(1\s{0,1}){0,1}\(\d{3}\)[-\s]{0,1}\d{3}[-\s]{0,1}\d{4}$/];

  for(let i = 0; i < regexArr.length; ++i)
  {
    if(regexArr[i].test(str))
    {
      return true;
    }
  }

  return false;
}