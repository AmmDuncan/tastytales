function validatePhone(inputtxt)
{
  let phoneno = /^\d{10}$/;
  return !!(inputtxt.match(phoneno));
}